<template>

    <div id="home">
        <div class="col">
            <el-tree
                    :data="treeData"
                    default-expand-all
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :props="defaultProps"
                    :default-checked-keys="get_treeSelectedList"
                    @check-change="nodeChange">

            </el-tree>
        </div>
        <div class="col">
            <div id="gis" >
                <div class="left-legend">
                    <legend-model :defualName="'图例'">
                        <div class="icon-wrap">
                            <div class="pipe-wrap">
                                <div class="col"><span class="pencil"></span><span>正常管道</span></div>
                                <div class="col"><span class="pencil ignore"></span><span>报废管道</span></div>
                            </div>
                            <div class="sub-icons">
                                <div class="row">
                                    <div class="col"><span></span><span>检修井</span></div>
                                    <div class="col"><span></span><span>阀门(一定开度)</span></div>
                                </div>
                                <div class="row">
                                    <div class="col"><span></span><span>阀门(开)</span></div>
                                    <div class="col"><span></span><span>消防栓(正常)</span></div>
                                </div>
                                <div class="row">
                                    <div class="col"><span></span><span>阀门(全关)</span></div>
                                    <div class="col"><span></span><span>消防栓(异常)</span></div>
                                </div>
                                <div class="row">
                                    <div class="col"><span></span><span>隐患(已上报)</span></div>
                                    <div class="col"><span></span><span>隐患(处理中)</span></div>
                                </div>
                                <div class="row">
                                    <div class="col"><span></span><span>工程(建设中)</span></div>
                                    <div class="col"><span></span><span>巡检人</span></div>
                                </div>
                            </div>
                        </div>
                    </legend-model>
                </div>
                <func-tools >
                    <div class="col">
                        <span>管网编辑</span>
                    </div>
                    <div class="col have-more">
                        <el-checkbox v-model="showLayerBgColor"></el-checkbox>
                        <span>分区颜色</span>
                        <i class="el-icon-caret-bottom"></i>
                    </div>
                    <div class="colorList">
                        <div class="row"><span class="cycle-color red"></span><span>漏损率≥10%</span></div>
                        <div class="row"><span class="cycle-color orange"></span><span>10%＞漏损率≥5%</span></div>
                        <div class="row"><span class="cycle-color yellow"></span><span>5%＞漏损率≥2%</span></div>
                        <div class="row"><span class="cycle-color green"></span><span>2%＞漏损率</span></div>
                    </div>
                    <div class="col"  @click="showNoticeModel">
                        <i class="el-icon-bell"></i>
                    </div>
                </func-tools>
                <div class="searchBox">
                    <fuzzy-search :searchLists="searchLists" :defaultName="defaultName" :closeList_flag="closeFlag"
                                  @selectThis="selectThis" @callBackList="callBackList"/>
                </div>
                <div class="pannel-wrap">
                    <div class="col">
                        <span class="color-blue">503Km</span>
                        <span>管网总长</span>
                    </div>
                    <div class="col">
                        <span class="color-green">33Km</span>
                        <span>比上年同期增加</span>
                    </div>
                </div>
            </div>
            <toggle-table :totalPage="totalPages" :innerWidth="350" @toggleFlag="toggleFlag">
                <tabs-toggle :tabList="headList" @myActivedIndex="myActivedIndex" ref="prevTabsNext">
                    <template v-if="tabActivedIndex===0">
                        <pipe-msg ref="pipe"/>
                    </template>
                    <template v-else-if="tabActivedIndex===1">
                        <project-msg ref="project"/>
                    </template>
                    <template v-else-if="tabActivedIndex===2">
                        <monitor-msg ref="monitor"/>
                    </template>
                    <template v-else-if="tabActivedIndex===3">
                        <dev-warking ref="devWarking"/>
                    </template>
                    <template v-else-if="tabActivedIndex===4">
                        <msg ref="msg"/>
                    </template>
                    <template v-else-if="tabActivedIndex===5">
                        <part-count ref="partCount"/>
                    </template>
                    <template v-else>
                        <pipe-simulate ref="pipeSimulate"/>
                    </template>
                </tabs-toggle>
            </toggle-table>

        </div>
        <list-model :list="noticeList" :tips="'报警通知'" ref="notice">
            <table class="innerTable">
                <tbody>
                <tr>
                    <td><span>监测站点</span></td>
                    <td><span>报警信息</span></td>
                </tr>
                <tr>
                    <td><span>监测站点</span></td>
                    <td><span>报警信息</span></td>
                </tr>
                </tbody>
            </table>
        </list-model>
        <bg-model :id="siteId" :tips="'绿化泵站'">
            <separating-tabs :tabs="siteTabs" :id="siteId" @separatingTabIndex="separatingTabIndex">
                <template v-if="separateActiveTabIndex==0">
                    <configuration/>
                </template>
                <template v-else-if="separateActiveTabIndex==1">
                    <monitor-manager/>
                </template>
                <template v-else-if="separateActiveTabIndex==2">
                    <video-monitor/>
                </template>
                <template v-else-if="separateActiveTabIndex==3">
                    <base-msg/>
                </template>
            </separating-tabs>
        </bg-model>
    </div>

</template>

<script>

    import ToggleTable from '../common/components/toggleTable';
    import PipeMsg from './home_tabs/pipeMsg';
    import ProjectMsg from './home_tabs/projectMsg';
    import MonitorMsg from './home_tabs/monitorMsg';


    import LegendModel from '../common/components/legend';

    import {mapGetters, mapMutations} from 'vuex';
    import TabsToggle from '../common/components/tabsToggle';
    import FuzzySearch from '../common/components/fuzzySearch';
    import ListModel from '../common/components/toast/listModel';
    import BgModel from '../common/components/toast/bgModel';
    import SeparatingTabs from '../common/components/separatingTabs';
    import Configuration from './home_tabs/project_models/configuration';
    import MonitorManager from './home_tabs/project_models/monitorManager';
    import VideoMonitor from './home_tabs/project_models/videoMonitor';
    import BaseMsg from './home_tabs/project_models/baseMsg';
    import Msg from './home_tabs/msg';
    import DevWarking from './home_tabs/devWarking';
    import PartCount from './home_tabs/partCount';
    import PipeSimulate from './home_tabs/pipeSimulate';
    import FuncTools from '../common/components/funcTools';


    export default {
        components: {
            FuncTools,
            PipeSimulate,
            PartCount,
            DevWarking,
            Msg,
            BaseMsg,
            VideoMonitor,
            MonitorManager,
            Configuration,
            SeparatingTabs,
            BgModel,
            ListModel,
            FuzzySearch, TabsToggle, LegendModel, MonitorMsg, ProjectMsg, PipeMsg, ToggleTable
        },
        data() {
            return {
                totalPages: 1, //共多少页
                defaultWidth: 'calc(100% - 350px)',
                treeData: [
                    {
                        id: 10,
                        label: '管网信息',
                        father: '',
                        index: 0,
                        ifOnly: false,
                        children: [
                            {
                                id: 11,
                                label: '管网',
                                father: '管网信息',
                                index: 0,
                                ifOnly: false,
                                selfIndex: 0,
                            },
                            {
                                id: 12,
                                label: '阀门',
                                father: '管网信息',
                                index: 0,
                                ifOnly: false,
                                selfIndex: 1
                            },
                            {
                                id: 13,
                                label: '检修井',
                                father: '管网信息',
                                index: 0,
                                ifOnly: false,
                                selfIndex: 2
                            },
                            {
                                id: 14,
                                label: '消防栓',
                                father: '管网信息',
                                index: 0,
                                ifOnly: false,
                                selfIndex: 3
                            }
                        ]
                    },
                    {
                        id: 20,
                        label: '工程信息',
                        index: 1,
                        father: '',
                        ifOnly: false,
                        children: [
                            {
                                id: 21,
                                label: '概览',
                                father: '工程信息',
                                index: 1,
                                ifOnly: false,
                                selfIndex: 0
                            },
                            {
                                id: 22,
                                label: '水库',
                                father: '工程信息',
                                index: 1,
                                ifOnly: false,
                                selfIndex: 1
                            },
                            {
                                id: 23,
                                label: '水厂',
                                father: '工程信息',
                                index: 1,
                                ifOnly: false,
                                selfIndex: 2
                            },
                            {
                                id: 24,
                                label: '大用水户',
                                father: '工程信息',
                                index: 1,
                                ifOnly: false,
                                selfIndex: 3
                            },
                            {
                                id: 25,
                                label: '泵站',
                                father: '工程信息',
                                index: 1,
                                selfIndex: 4
                            },
                            {
                                id: 26,
                                label: '计量间',
                                father: '工程信息',
                                index: 1,
                                ifOnly: false,
                                selfIndex: 5
                            }
                        ]
                    },
                    {
                        id: 30,
                        label: '巡检抢修',
                        index: 2,
                        ifOnly: false,
                        father: '',
                        children: [
                            {
                                id: 31,
                                label: '实时信息',
                                father: '巡检抢修',
                                index: 2,
                                ifOnly: false,
                                selfIndex: 0
                            },
                            {
                                id: 32,
                                label: '检修信息',
                                father: '巡检抢修',
                                index: 2,
                                ifOnly: false,
                                selfIndex: 1
                            },
                            {
                                id: 33,
                                label: '关阀历史信息',
                                father: '巡检抢修',
                                index: 2,
                                ifOnly: false,
                                selfIndex: 2
                            }
                        ]
                    },
                    {
                        id: 40,
                        label: '设备运行',
                        father: '',
                        index: 3,
                        ifOnly: true,
                        selfIndex: 0
                    },
                    {
                        id: 50,
                        label: '监测信息',
                        index: 4,
                        father: '',
                        ifOnly: false,
                        children: [
                            {
                                id: 51,
                                label: '流量',
                                father: '监测信息',
                                index: 4,
                                ifOnly: false,
                                selfIndex: 0
                            },
                            {
                                id: 52,
                                label: '压力',
                                father: '监测信息',
                                index: 4,
                                ifOnly: false,
                                selfIndex: 1
                            },
                            {
                                id: 53,
                                label: '水质',
                                father: '监测信息',
                                index: 4,
                                selfIndex: 2
                            },
                            {
                                id: 54,
                                label: '视频',
                                father: '监测信息',
                                index: 4,
                                ifOnly: false,
                                selfIndex: 3
                            }
                        ]

                    },
                    {
                        id: 60,
                        label: '分区计量',
                        index: 5,
                        ifOnly: true,
                        father: '',
                        selfIndex: 0
                    },
                    {
                        id: 70,
                        label: '管网模拟',
                        father: '',
                        index: 6,
                        ifOnly: true,
                        selfIndex: 0
                    }

                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                tabActivedIndex: 0, //页签的默认激活项
                subTabList: {
                    headList: [{name: '管网信息', flag: true}, {name: '工程信息', flag: false}, {
                        name: '巡检抢修',
                        flag: false
                    }, {name: '设备运行', flag: false}, {name: '监测信息', flag: false}, {
                        name: '分区计量',
                        flag: false
                    }, {name: '管网模拟', flag: false}],
                    pipe: [{name: '管网', flag: true}, {name: '阀门', flag: false}, {
                        name: '检修井',
                        flag: false
                    }, {name: '消防栓', flag: false}],
                    project: [{name: '概览', flag: false}, {name: '水库', flag: false}, {
                        name: '水厂',
                        flag: false
                    }, {name: '大用水户', flag: false}, {name: '泵站', flag: false}, {name: '计量间', flag: false}],
                    monitor: [{name: '实时信息', flag: false}, {name: '检修信息', flag: false}, {name: '关阀历史信息', flag: false}],
                    devs: [],
                    msg: [{name: '流量', flag: false}, {name: '压力', flag: false}, {name: '水质', flag: false}, {
                        name: '视频',
                        flag: false
                    }],
                    zone: [],
                    simulate: [],
                    ids: [],
                    headList_leftIndex:[], //默认留下的 索引
                },
                headList: [], //一级页签列表
                noticeMusicURL: '', //连续播放的音频URL
                searchLists: [], //模糊查询的数据列表
                defaultName: '', //模糊查询的关键字
                closeFlag: false, //关闭列表
                noticeList: [],
                siteId: '', //站点ID
                siteTabs: ['运行组态', '监测信息', '视频监控', '基础信息'], //站点需要的切换页签
                separateActiveTabIndex: 0, //默认分离式页签的索引
                showLayerBgColor:false, // 是否显示分区域的背景
            };
        },
        computed: {
            ...mapGetters({
                get_cityPosition: 'get_cityPosition',
                get_companyId: 'get_companyId',
                get_headTabList: 'get_headTabList',
                get_sunTab_pipe: 'get_sunTab_pipe',
                get_sunTab_project: 'get_sunTab_project',
                get_sunTab_monitor: 'get_sunTab_monitor',
                get_sunTab_devs: 'get_sunTab_devs',
                get_sunTab_msg: 'get_sunTab_msg',
                get_sunTab_zone: 'get_sunTab_zone',
                get_sunTab_simulate: 'get_sunTab_simulate',
                get_treeSelectedList: 'get_treeSelectedList'
            })
        },
        methods: {

            toggleFlag(flag) {
                if (flag) {
                    this.defaultWidth = 'calc(100% - 350px)';
                } else {
                    this.defaultWidth = '100%';
                }
            },
            getCheckedNodes(fatherName) {
                let list = this.$refs.tree.getCheckedNodes();
                let temp_list = this.subTabList;
                temp_list.ids = [];
                temp_list.headList_leftIndex = [];
                list.map((val) => {
                    temp_list.ids.push(val.id);
                    temp_list.headList_leftIndex.push(val.id);
                    if (val.father === '管网信息') {
                        temp_list.headList[0] = {name: '管网信息', flag: true};
                        temp_list.pipe[val.selfIndex] = {name: val.label, flag: true};

                    }
                    if (val.father === '工程信息') {
                        temp_list.headList[1] = {name: '工程信息', flag: true};
                        temp_list.project[val.selfIndex] = {name: val.label, flag: true};

                    }
                    if (val.father === '巡检抢修') {
                        temp_list.headList[2] = {name: '巡检抢修', flag: true};
                        temp_list.monitor[val.selfIndex] = {name: val.label, flag: true};

                    }
                    if (val.father === '设备运行') {
                        temp_list.headList[3] = {name: '设备运行', flag: true};
                        temp_list.devs[val.selfIndex] = {name: val.label, flag: true};

                    }
                    if (val.father === '监测信息') {
                        temp_list.headList[4] = {name: '监测信息', flag: true};
                        temp_list.msg[val.selfIndex] = {name: val.label, flag: true};

                    }
                    if (val.father === '分区计量') {
                        temp_list.headList[5] = {name: '分区计量', flag: true};
                        temp_list.zone[val.selfIndex] = {name: val.label, flag: true};
                    }
                    if (val.father === '管网模拟') {
                        temp_list.headList[6] = {name: '管网模拟', flag: true};
                        temp_list.simulate[val.selfIndex] = {name: val.label, flag: true};
                    }

                });
                return temp_list;
            },
            fatherNodeFlag(fatherIndex) {

                let temp_list = this.$refs.tree.getCheckedKeys();

                let flag = false;

                function len(arr, val) {
                    let processArr = arr.filter(function (value) {
                        if (parseInt(value / 10) - 1 == val) {
                            return 1;
                        }
                        return  0;
                    });
                    return processArr.length;
                }
                flag = len(temp_list, fatherIndex) >= 1 ? true : false;
                return flag;
            },
            nodeChange(item, ifChecked, children) {
                let that = this;
                let wrap_obj = this.getCheckedNodes(item.father);

                if(item.ifOnly){
                    if(ifChecked){

                        this.$refs.prevTabsNext.fromFather_activedTab({
                            index:item.index,
                            leftIds:[item.index]
                        });
                        this.subTabList.headList[item.index] = {name: item.label, flag: true};
                        that.set_headTabList(that.subTabList.headList);
                        this.$refs.prevTabsNext.fromFather(that.subTabList.headList);
                        switch (item.label) {
                            case '设备运行':

                                this.tabActivedIndex = 3;
                                this.subTabList.devs = wrap_obj.devs;
                                this.subTabList.devs = this.funTool.uniqBy(that.subTabList.devs, 'name');
                                that.set_sunTab_devs(that.subTabList.devs);
                                // setTimeout(() => {
                                //     that.$refs.devs.fromFather({
                                //         list: that.subTabList.devs,
                                //         currentIndex: item.selfIndex + 1
                                //     });
                                // }, 500);
                                break;
                            case '分区计量':
                                this.tabActivedIndex = 5;
                                this.subTabList.zone = wrap_obj.zone;
                                this.subTabList.zone = this.funTool.uniqBy(that.subTabList.zone, 'name');
                                that.set_sunTab_zone(that.subTabList.zone);
                                //
                                // this.$refs.zone.fromFather({
                                //     list: that.subTabList.zone,
                                //     currentIndex: item.selfIndex + 1
                                // });
                                break;
                            case '管网模拟':
                                this.tabActivedIndex = 6;
                                this.subTabList.simulate = wrap_obj.simulate;
                                this.subTabList.simulate = this.funTool.uniqBy(that.subTabList.simulate, 'name');
                                that.set_sunTab_simulate(that.subTabList.simulate);
                                // that.set_sunTab_simulate({
                                //     list: that.subTabList.simulate,
                                //     currentIndex: item.selfIndex + 1
                                // });
                                break;
                        }
                    }
                    else{
                        this.tabActivedIndex = (wrap_obj.headList_leftIndex).length>0? parseInt((wrap_obj.headList_leftIndex)[(wrap_obj.headList_leftIndex.length-1)]/10-1) :0;

                        switch (item.label) {
                            case '设备运行':
                                // this.tabActivedIndex = 3;
                                // this.subTabList.devs[item.index] = {name: item.label, flag: false};
                                // that.set_sunTab_devs(that.subTabList.devs);
                                // setTimeout(() => {
                                //     this.$refs.devWarking.fromFather({
                                //         list: that.subTabList.devs,
                                //         currentIndex: item.selfIndex
                                //     });
                                // }, 500);

                                break;
                            case '分区计量':

                                // this.tabActivedIndex = 5;
                                // this.subTabList.zone[item.index] = {name: item.label, flag: false};
                                // that.set_sunTab_zone(that.subTabList.zone);
                                //
                                // setTimeout(() => {
                                //     that.$refs.zone.fromFather({
                                //         list: that.subTabList.zone,
                                //         currentIndex: item.selfIndex
                                //     });
                                // }, 500);

                                break;
                            case '管网模拟':
                                // this.tabActivedIndex = 6;
                                // this.subTabList.simulate[item.index] = {name: item.label, flag: false};
                                // that.set_sunTab_simulate(that.subTabList.simulate);
                                // setTimeout(() => {
                                //     that.$refs.simulate.fromFather({
                                //         list: that.subTabList.simulate,
                                //         currentIndex: item.selfIndex
                                //     });
                                // }, 500);
                                break;
                        }
                        this.$refs.prevTabsNext.fromFather_activedTab({
                            index:item.index,
                            leftIds:wrap_obj.headList_leftIndex
                        });
                        this.subTabList.headList[item.index] = {name: item.label, flag: false};
                        that.set_headTabList(that.subTabList.headList);
                        this.$refs.prevTabsNext.fromFather(that.subTabList.headList);

                        this.$refs.prevTabsNext.activedTab_reduce(that.tabActivedIndex);
                    }
                }
                else{
                    if (!item.children) {
                        if (ifChecked) {
                            that.set_headTabList(wrap_obj.headList);
                            this.$refs.prevTabsNext.fromFather(wrap_obj.headList);
                            this.$refs.prevTabsNext.fromFather_activedTab({
                                index:item.index,
                                leftIds:[item.index]
                            });
                            switch (item.father) {
                                case '管网信息':

                                    this.tabActivedIndex = 0;
                                    this.subTabList.pipe = wrap_obj.pipe;
                                    this.subTabList.pipe = this.funTool.uniqBy(that.subTabList.pipe, 'name');
                                    that.set_sunTab_pipe(that.subTabList.pipe);
                                    setTimeout(() => {
                                        that.$refs.pipe.fromFather({
                                            list: that.subTabList.pipe,
                                            currentIndex: item.selfIndex + 1
                                        });
                                    }, 500);
                                    break;
                                case '工程信息':

                                    this.tabActivedIndex = 1;
                                    this.subTabList.project = wrap_obj.project;
                                    this.subTabList.project = this.funTool.uniqBy(that.subTabList.project, 'name');
                                    that.set_sunTab_project(that.subTabList.project);
                                    setTimeout(() => {
                                        that.$refs.project.fromFather({
                                            list: that.subTabList.project,
                                            currentIndex: item.selfIndex + 1
                                        });
                                    }, 500);

                                    break;
                                case '巡检抢修':

                                    this.tabActivedIndex = 2;
                                    this.subTabList.monitor = wrap_obj.monitor;
                                    this.subTabList.monitor = this.funTool.uniqBy(that.subTabList.monitor, 'name');
                                    that.set_sunTab_monitor(that.subTabList.monitor);
                                    setTimeout(() => {
                                        that.$refs.monitor.fromFather({
                                            list: that.subTabList.monitor,
                                            currentIndex: item.selfIndex + 1
                                        });
                                    }, 500);

                                    break;
                                case '监测信息':

                                    this.tabActivedIndex = 4;
                                    this.subTabList.msg = wrap_obj.msg;
                                    this.subTabList.msg = this.funTool.uniqBy(that.subTabList.msg, 'name');
                                    that.set_sunTab_msg(that.subTabList.msg);
                                    setTimeout(() => {
                                        that.$refs.msg.fromFather({
                                            list: that.subTabList.msg,
                                            currentIndex: item.selfIndex +1
                                        });
                                    }, 500);
                                    break;

                            }
                        }
                        else {
                            this.$refs.prevTabsNext.fromFather_activedTab({
                                index:item.index,
                                leftIds:wrap_obj.headList_leftIndex
                            });
                            switch (item.father) {
                                case '管网信息':
                                    this.tabActivedIndex = 0;
                                    this.subTabList.pipe[item.selfIndex] = {name: item.label, flag: false};
                                    this.subTabList.pipe = this.funTool.uniqBy(that.subTabList.pipe, 'name');
                                    that.set_sunTab_pipe(that.subTabList.pipe);
                                    setTimeout(() => {
                                        this.$refs.pipe.fromFather({
                                            list: that.subTabList.pipe,
                                            currentIndex: item.selfIndex
                                        });
                                    }, 500);
                                    break;
                                case '工程信息':
                                    this.tabActivedIndex = 1;
                                    this.subTabList.project[item.selfIndex] = {name: item.label, flag: false};
                                    this.subTabList.project = this.funTool.uniqBy(that.subTabList.project, 'name');
                                    that.set_sunTab_project(that.subTabList.project);
                                    setTimeout(() => {
                                        that.$refs.project.fromFather({
                                            list: that.subTabList.project,
                                            currentIndex: item.selfIndex
                                        });
                                    }, 500);
                                    break;
                                case '巡检抢修':

                                    this.tabActivedIndex = 2;
                                    this.subTabList.monitor[item.selfIndex] = {name: item.label, flag: false};
                                    this.subTabList.monitor = this.funTool.uniqBy(that.subTabList.monitor, 'name');
                                    that.set_sunTab_monitor(that.subTabList.monitor);
                                    setTimeout(() => {
                                        this.$refs.monitor.fromFather({
                                            list: that.subTabList.monitor,
                                            currentIndex: item.selfIndex
                                        });
                                    }, 500);
                                    break;
                                case '监测信息':
                                    this.tabActivedIndex = 4;
                                    this.subTabList.msg[item.selfIndex] = {name: item.label, flag: false};
                                    this.subTabList.msg = this.funTool.uniqBy(that.subTabList.msg, 'name');

                                    that.set_sunTab_msg(that.subTabList.msg);
                                    setTimeout(() => {
                                        that.$refs.msg.fromFather({
                                            list: that.subTabList.msg,
                                            currentIndex: item.selfIndex
                                        });
                                    }, 500);
                                    break;
                            }


                        }
                        let temp_list = this.getCheckedNodes(item.father).ids;
                        this.subTabList.ids = this.funTool.uniq(temp_list);
                        that.set_treeSelectedList(that.subTabList.ids);

                        let flag = this.fatherNodeFlag(item.index);
                        if (!flag) {
                            this.subTabList.headList[item.index] = {name: item.father, flag: false};
                            that.set_headTabList(that.subTabList.headList);
                            this.$refs.prevTabsNext.fromFather(that.subTabList.headList);
                            // let temp_index = item.index - 1 < 0 ? 0 : item.index - 1;
                            let temp_index = this.subTabList.ids.length>0? parseInt(that.subTabList.ids[(that.subTabList.ids.length-1)] / 10) - 1:0;
                            this.$refs.prevTabsNext.activedTab_reduce(temp_index);
                        }
                    }
                }
            },
            myActivedIndex(obj) {
                let that = this;
                this.tabActivedIndex = obj.activedIndex;
                let temp_list = [];
                switch (obj.activedIndex) {
                    case 0:
                        if (obj.flag) {
                            this.$refs.prevTabsNext.fromFather_activedTab({
                                index:obj.activedIndex,
                                leftIds:[obj.activedIndex]
                            });
                        }

                        this.tabActivedIndex = 0;
                        setTimeout(() => {
                            temp_list = that.get_sunTab_pipe;
                            this.$refs.pipe.fromFather({list: temp_list, currentIndex: 1});
                        }, 500);
                        break;
                    case 1:
                        if (obj.flag) {
                            this.$refs.prevTabsNext.fromFather_activedTab({
                                index:obj.activedIndex,
                                leftIds:[obj.activedIndex]
                            });
                        }
                        this.tabActivedIndex = 1;

                        setTimeout(() => {
                            temp_list = that.get_sunTab_project;
                            this.$refs.project.fromFather({list: temp_list, currentIndex: 2});
                        }, 500);

                        break;
                    case 2:
                        if (obj.flag) {
                            this.$refs.prevTabsNext.fromFather_activedTab({
                                index:obj.activedIndex,
                                leftIds:[obj.activedIndex]
                            });
                        }
                        this.tabActivedIndex = 2;
                        setTimeout(() => {
                            temp_list = that.get_sunTab_monitor;
                            this.$refs.monitor.fromFather({list: temp_list, currentIndex: 3});
                        }, 500);

                        break;
                    case 3:
                        if (obj.flag) {
                            this.$refs.prevTabsNext.fromFather_activedTab({
                                index:obj.activedIndex,
                                leftIds:[obj.activedIndex]
                            });
                        }
                        this.tabActivedIndex = 3;
                        setTimeout(() => {
                            temp_list = that.get_sunTab_devs;
                            this.$refs.devs.fromFather({list: temp_list, currentIndex: 4});
                        }, 500);
                        break;
                    case 4:
                        if (obj.flag) {
                            this.$refs.prevTabsNext.fromFather_activedTab({
                                index:obj.activedIndex,
                                leftIds:[obj.activedIndex]
                            });
                        }
                        this.tabActivedIndex = 4;
                        setTimeout(() => {
                            temp_list = that.get_sunTab_zone;
                            this.$refs.msg.fromFather({list: temp_list, currentIndex: 5});
                        }, 500);
                        break;
                    case 5:
                        if (obj.flag) {
                            this.$refs.prevTabsNext.fromFather_activedTab({
                                index:obj.activedIndex,
                                leftIds:[obj.activedIndex]
                            });
                        }
                        this.tabActivedIndex = 5;
                        setTimeout(() => {
                            temp_list = that.get_sunTab_zone;
                            this.$refs.zone.fromFather({list: temp_list, currentIndex: 6});
                        }, 500);
                        break;
                    case 6:
                        if (obj.flag) {
                            this.$refs.prevTabsNext.fromFather_activedTab({
                                index:obj.activedIndex,
                                leftIds:[obj.activedIndex]
                            });
                        }
                        this.tabActivedIndex = 6;
                        setTimeout(() => {
                            temp_list = that.get_sunTab_simulate;
                            this.$refs.simulate.fromFather({list: temp_list, currentIndex: 7});
                        }, 500);
                        break;
                }
            },
            ...mapMutations({
                'set_headTabList': 'set_headTabList',
                'set_sunTab_pipe': 'set_sunTab_pipe',
                'set_sunTab_project': 'set_sunTab_project',
                'set_sunTab_monitor': 'set_sunTab_monitor',
                'set_sunTab_devs': 'set_sunTab_devs',
                'set_sunTab_msg': 'set_sunTab_msg',
                'set_sunTab_zone': 'set_sunTab_zone',
                'set_sunTab_simulate': 'set_sunTab_simulate',
                'set_treeSelectedList': 'set_treeSelectedList'
            }),

            // 回调的 模糊查询函数
            callBackList(name) {
                // 调用接口
            },
            // 选择模糊查询的某一个
            selectThis(val) {
                this.defaultName = val.name;
            },
            //显示 通知的弹窗
            showNoticeModel() {
                this.$refs.notice.showModel();
            },
            //分离式页签 获取索引
            separatingTabIndex(index) {
                this.separateActiveTabIndex = index;
            }
        },
        created() {
            this.headList = this.get_headTabList;
        },
        mounted() {

        }

    };

</script>

<style>
    .dse-map {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
    }

    .map-toolbar {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    /* 用于解决gis框架中底图切换工具UI的bug */
    #dtqh > ul {
        margin: 0;
        padding: 0;
    }
</style>

<style scoped lang="scss">
    #home {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        padding: 5px;

        .col {
            height: 100%;
            overflow-y: auto;

            &:nth-child(1) {
                width: 150px;
            }

            &:nth-child(2) {
                width: calc(100% - 150px);
                position: relative;
                display: flex;
                justify-content: space-between;

                #gis {
                    height: 100%;
                    position: relative;

                    .gis-tool {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        z-index: 100;
                    }

                    .gis-import {
                        position: absolute;
                        top: 100px;
                        left: 10px;
                        z-index: 100;
                    }

                    .left-legend {
                        position: absolute;
                        left: 10px;
                        bottom: 10px;
                        z-index: 100;

                        .icon-wrap {
                            width: 300px;
                            height: 200px;

                            .pipe-wrap {
                                width: 100%;
                                height: 40px;

                                .col {
                                    width: 100%;
                                    height: 20px;
                                    line-height: 20px;
                                    text-align: center;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;

                                    .pencil {
                                        display: inline-block;
                                        width: 50px;
                                        height: 5px;
                                        background: #0b83fe;
                                        margin-right: 10px;

                                        &.ignore {
                                            background: gray;
                                        }
                                    }
                                }
                            }

                            .sub-icons {
                                width: 100%;
                                height: calc(100% - 40px);

                                .row {
                                    width: 100%;
                                    height: 20%;
                                    display: flex;
                                    justify-content: space-between;
                                    padding: 0 5px;

                                    .col {
                                        flex: 1;
                                        text-align: center;
                                    }
                                }
                            }
                        }
                    }

                    #funcTools{
                        position: absolute;
                        top: 10px;
                        left: 535px;
                        .col{
                            width: 80px;
                            border-right: 1px solid #ccc;
                            height: 38px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            cursor: pointer;

                            &:last-child{
                                width: 40px;
                                i{
                                    font-size: 30px;
                                }
                            }
                            &.have-more{
                                width: 126px;
                                .el-checkbox{
                                    margin-right: 5px;
                                    margin-bottom: 0px;
                                }
                            }
                        }
                        .colorList{
                            position: absolute;
                            top: 40px;
                            left: 80px;
                            width: 144px;
                            height: 95px;
                            padding: 5px;
                            background: #fff;
                            box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: flex-start;
                            .row{
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }
                            .cycle-color{
                                display: inline-block;
                                width: 12px;
                                height: 12px;
                                border-radius: 50%;
                                margin-right: 5px;
                                &.red{
                                    background: red;
                                }
                                &.orange{
                                    background: orange;
                                }
                                &.yellow{
                                    background: yellow;
                                }
                                &.green{
                                    background: green;
                                }
                            }
                        }
                    }

                    .searchBox {
                        width: 200px;
                        height: 30px;
                        position: absolute;
                        top: 10px;
                        left: 80px;
                        z-index: 100;
                    }

                    .pannel-wrap {
                        width: 230px;
                        padding: 0 10px;
                        height: 50px;
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        display: flex;
                        justify-content: space-between;
                        background: #fff;
                        color: #999;
                        box-shadow: 0 0 5px rgba(0,0,0,0.6);
                        font-weight: 600;
                        .col {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            font-size: 14px;
                            span {
                                display: inline-block;
                                width: 100%;
                                text-align: center;
                                &.color-blue{
                                    color: #1681e2;
                                }
                                &.color-green{
                                    color: #18bac0;
                                }
                            }
                        }
                    }
                }

                .tabs {
                    width: 100%;
                    height: 30px;
                    border-bottom: 1px solid #ccc;

                    span {
                        display: inline-block;
                        width: 80px;
                        text-align: center;
                        line-height: 30px;

                        &.activedTab {
                            color: #fff;
                            background: #0b83fe;
                        }

                        cursor: pointer;
                    }
                }

                .main-content {
                    width: 100%;
                    height: calc(100% - 30px);
                    padding: 5px 0;
                }


            }
        }
    }

</style>
