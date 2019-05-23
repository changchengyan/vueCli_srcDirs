<template>
<div id="earlyWarning">
    <div id="gis">gis</div>
    <div class="gistools">
        <gis-tools @handleThisDom="thisDom"></gis-tools>
    </div>
    <div class="aside-table">
        <div class="toggleBar" @click="toggleShowtable">
            <template v-if="tableShow">
                <i class="el-icon-arrow-left" ></i>
            </template>
            <template v-else>
                <i class="el-icon-arrow-right"></i>
            </template>
        </div>
        <div class="inner" v-if="tableShow">
            <div class="row">
                <div class="top-tabItem">选择图层</div>
                <div class="tabs">
                    <div class="tab-item" @click="activeThis(index)" :class="{active:index==actived}" v-for="(item,index) in tabs" :key="index">{{item.name}}</div>
                </div>
            </div>
            <div class="row">
                <div class="selects">
                    <div class="select-item">
                        <span>选择对象:</span>
                       <select-tree  :waterWorksTree="tree" @showSelectLists="selectItem"></select-tree>
                    </div>
                    <div class="select-item">
                        <span>所属区域:</span>
                        <el-select v-model="areaItem" placeholder="请选择">
                            <el-option v-for="item in areaList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="select-item">
                        <span>测点名称:</span>
                       <el-input
                        placeholder="请输入内容"
                        v-model="searchName"
                        clearable>
                        </el-input>
                    </div>
                    <div class="select-item">
                        <span>管线编号:</span>
                        <el-select v-model="value" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="select-item">
                    <span>时间:</span>
                    <el-date-picker v-model="dateValue" type="date" placeholder="选择日期">
                    </el-date-picker>
                    <span>从:</span>
                    <el-time-select v-model="timeValue" :picker-options="{
                      start: '08:30',
                      step: '00:10',
                      end: '18:30'
                    }" placeholder="选择时间">
                    </el-time-select>
                    <span>到:</span>
                    <el-time-select v-model="timeValue" :picker-options="{
                      start: '08:30',
                      step: '00:10',
                      end: '18:30'
                    }" placeholder="选择时间">
                    </el-time-select>
                    <el-button type="primary">搜索</el-button>
                </div>
                <div class="table">
                    <table>
                        <tr class="thead">
                            <td><span>监测点名称</span></td>
                            <td><span>预警时间</span></td>
                            <td><span>监测项类型</span></td>
                            <td><span>实时监测值</span></td>
                            <td><span>预警状态</span></td>
                            <td><span>历史详情</span></td>
                            <td><span>操作</span></td>
                        </tr>
                        <tr>
                            <td><span>临河大道监测点</span></td>
                            <td><span>6-1210:09</span></td>
                            <td><span>压力(MPa)</span></td>
                            <td><span>5.2</span></td>
                            <td><span>待处理</span></td>
                            <td><span class="btn">详情</span></td>
                            <td><span class="btn" @click="showAction_">处理</span></td>
                        </tr>
                        <tr>
                            <td><span>临河大道监测点</span></td>
                            <td><span>6-1210:09</span></td>
                            <td><span>压力(MPa)</span></td>
                            <td><span>5.2</span></td>
                            <td><span>待处理</span></td>
                            <td><span class="btn">详情</span></td>
                            <td><span class="btn">处理</span></td>
                        </tr>
                    </table>
                </div>
                <div class="pagenation">
                    <!-- <pagenation :noSmall='paginate.ifSmall' :totalPage="paginate.totalPage_"></pagenation> -->
                    <el-pagination background layout="prev, pager, next" :total="10000">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
    <warn-model :showDefinedModel="showAction" :title="'监测点检修任务处理'" @hiddenSelf="closedActionModel">
        <div class="taskProcess">
            <div class="topDesc">
                <div class="row"><span>监测点名称:</span> <span>临江大道监测点</span> </div>
                <div class="row">
                    <div class="col">
                        <span>检测项类型:</span> <span>压力(MPa)</span>
                    </div>
                    <div class="col">
                        <span>实时检测值:</span> <span>5.2</span>
                    </div>
                </div>
                <div class="subContent">
                    <span>2018年7月11日 进行阀门改造,并进行相应的检修</span>
                </div>
            </div>
            <div class="footer">
                <span class="dispach" @click="callSub">派单</span>
                <span class="actions">处理</span>
            </div>
        </div>
    </warn-model>
</div>
</template>

<script>
import pagenation from "@/common/components/pagination";
import warnModel from "@/common/components/Poupe/defined";
import gisTools from '@/common/components/gis_units/tools'
import selectTree from '@/common/components/selectWithTree'
export default {
    components: {
        pagenation,
        warnModel,
        gisTools,
        selectTree
    },
    data() {
        return {
            tools1_str: "交通图",
            tools2_str: "工具",
            tools3_str: "全屏",
            tableShow: true,
            showAction: false, //显示任务处理的弹窗
            dateValue: "", // 日期选择
            timeValue: "", // 时间选择
            tree:[], //水施
            areaList:[], //区域 列表
            areaItem:'', // 选中的区域
            searchName:"", // 查询的名字
            options: [{
                    value: "选项1",
                    label: "黄金糕"
                },
                {
                    value: "选项2",
                    label: "双皮奶"
                },
                {
                    value: "选项3",
                    label: "蚵仔煎"
                },
                {
                    value: "选项4",
                    label: "龙须面"
                },
                {
                    value: "选项5",
                    label: "北京烤鸭"
                }
            ],
            value: "",
            date_: "",
            radio_: "1",
            tabs: [{
                name: "水压"
            }, {
                name: "流量"
            }, {
                name: "水龄"
            }],
            actived: 0, //侧边栏 tabs
            flow: {
                content_tabs: [{
                    name: "警告"
                }, {
                    name: "流量监测数值"
                }],
                actived_contentTab: 0, //内容区 tabs
                contentList: [{
                        address: "临河大道",
                        number: "NXST-0001",
                        time: "4-30 09:32",
                        flowNum: "1.8",
                        status: true,
                        radio_status: "1"
                    },
                    {
                        address: "临河大道FGHFGGUY",
                        number: "NXST-0001",
                        time: "4-30 09:32",
                        flowNum: "1.8",
                        status: true,
                        radio_status: "2"
                    }
                ]
            },
            waterPress: {
                content_tabs: [{
                    name: "警告"
                }, {
                    name: "压力监测数值"
                }],
                actived_contentTab: 0, //内容区 tabs
                contentList: [{
                        desc: "流量大于阈值",
                        name: "临河大道",
                        time: "4-30 09:32",
                        flowNum: "1.8",
                        status: true
                    },
                    {
                        desc: "流量大于阈值",
                        name: "临河大道",
                        time: "4-30 09:32",
                        flowNum: "1.8",
                        status: true
                    }
                ]
            },
            waterQuality: {
                content_tabs: [{
                    name: "警告"
                }, {
                    name: "水质监测数值"
                }],
                actived_contentTab: 0, //内容区 tabs
                contentList: [{
                        desc: "流量大于阈值",
                        name: "临河大道",
                        time: "4-30 09:32",
                        flowNum: "1.8",
                        status: true
                    },
                    {
                        desc: "流量大于阈值",
                        name: "临河大道",
                        time: "4-30 09:32",
                        flowNum: "1.8",
                        status: true
                    }
                ]
            },
            waterAge: {
                contentList: [{
                        age: "12h",
                        desc: "水龄时长超过24h",
                        name: "临河大道"
                    },
                    {
                        age: "12h",
                        desc: "水龄时长超过24h",
                        name: "临河大道"
                    }
                ]
            },
            DetonatingRisk: {
                contentList: [{
                        level: "0.65",
                        name: "临河大道"
                    },
                    {
                        level: "0.82",
                        name: "临河大道"
                    }
                ]
            },
            paginate: {
                //分页器
                ifSmall: true,
                totalPage_: 12
            },
            pipeBoomDescTab: [{
                name: "基本信息"
            }, {
                name: "工单详情"
            }],
            pipeBoom_selected: 0
        };
    },
    methods: {
        selectItem(val){
            // console.log(val);
        },
        thisDom(obj) {
            // console.log(obj);
            let that = this;
            let temp_str = obj.tmpStr;
            switch (temp_str) {
                case "平面":
                    that.view.map.basemap = "streets";
                    break;
                case "卫星":
                    that.view.map.basemap = "satellite";
                    break;
                case "地形":
                    that.view.map.basemap = "terrain";
                    break;
                case "管网":
                    that.map.removeAll();
                    that.map.add(that.layer1);
                    break;
                case "阀门":
                    that.map.removeAll();
                    that.map.add(that.layer2);
                    break;
                case "消防栓":
                    that.map.removeAll();
                    that.map.add(that.layer3);
                    break;
                case "测距":
                    that.distance.start();
                    break;
                case "测面":
                    that.area.start();
                    break;
                case "标点":
                    that.drawTools.activate("circle");
                    break;
                case "标面":
                    that.drawTools.activate("polygon");
                    break;
                case "清除所有":
                    that.distance.clear();
                    that.area.clear();
                    break;
            }
        },
        activeThis(index) {
            this.actived = index;
        },
        showThisTab(index) {
            this.pipeBoom_selected = index;
        },
        closedActionModel(flag) {
            this.showAction = flag;
        },
        showAction_() {
            this.showAction = true;
        },
        callSub() {
            this.$router.push({
                name: "pipe_monitor_dispatch"
            });
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
        },
        toggleShowtable(){
            this.tableShow = !this.tableShow;
        }
    },
    created(){
        this.tree = this.DSE.tree;
        this.areaList = this.DSE.areaLists;
    }
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

#earlyWarning {
    width: 100%;
    height: 100%;
    position: relative;
    #gis {
        width: 100%;
        height: 100%;
    }
    .model .content .taskProcess {
        width: 100%;
        height: 100%;
        font-size: 14px;
        color: #333;
        padding: 10px 0;
        .topDesc {
            width: 100%;
            padding: 0 10px;
            .row {
                width: 100%;
                height: 30px;
                line-height: 30px;
                span {
                    display: inline-block;
                    margin-right: 10px;
                }
                display: flex;
                justify-content: flex-start;
                .col {
                    margin-right: 20px;
                }
                &:last-child {
                    margin-bottom: 5px;
                }
            }
        }
        .subContent {
            width: 100%;
            height: 50px;
            border: 1px solid #ccc;
            padding: 5px;
            overflow-y: auto;
            margin-bottom: 10px;
            border-radius: 5px;
        }
        .footer {
            width: 100%;
            height: 35px;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                display: inline-block;
                padding: 3px 10px;
                border: 1px solid blue;
                color: blue;
                border-radius: 3px;
                margin-right: 10px;
                cursor: pointer;
            }
        }
    }
    .gistools {
        width: 350px;
        height: 30px;
        padding: 0 20px;
        position: absolute;
        right: 20px;
        top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        margin-bottom: 20px;
        .el-dropdown {
            cursor: pointer;
        }
    }
    .aside-table {
        position: absolute;
        right: 20px;
        top: 70px;
        height: calc(100% - 90px);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        .toggleBar {
            width: 24px;
            height: 88px;
            position: absolute;
            left: -24px;
            top: 50%;
            border: 1px solid #ccc;
            line-height: 88px;
            text-align: center;
            cursor: pointer;
            i{
                line-height: 88px;
            }
        }
        .inner {
            width: 700px;
            height: 100%;
            position: relative;
            display: flex;
            justify-content: space-between;
            .row:first-child {
                width: 100px;
                height: 100%;
                font-size: 14px;
                color: #333;
                .top-tabItem {
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    background: #ccc;
                    text-align: center;
                }
                .tabs {
                    width: 100%;
                    height: calc(100% - 30px);
                    overflow-y: auto;
                    text-align: center;
                    .tab-item {
                        height: 30px;
                        line-height: 30px;
                        cursor: pointer;
                        &.active {
                            background: blue;
                            color: #fff;
                        }
                    }
                }
            }
            .row:last-child {
                width: calc(100% - 100px);
                padding-top: 0;
                border-left: 1px solid #ccc;
                .selects {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    flex-flow: wrap;
                    margin-bottom: 10px;
                    .select-item {
                        width: 50%;
                        height: 30px;
                        line-height: 30px;
                        padding: 10px;
                        font-size: 14px;
                        margin-bottom: 10px;
                        color: #333;
                        display: flex;
                        justify-content: space-between;
                        span {
                            display: inline-block;
                            width: 80px;
                            margin-left: 10px;
                        }
                        .el-select {
                            width: calc(100% - 80px);
                        }
                        .el-date-editor--date {
                            width: 300px;
                        }
                        .el-date-editor--time-select {
                            width: 250px;
                        }
                        button {
                            margin-left: 10px;
                        }
                    }
                }
                &>.select-item {
                    width: 100%;
                    font-size: 14px;
                    color: #333;
                    padding: 0 10px;
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    span {
                        display: inline-block;
                        width: 70px;
                        margin: 0 5px;
                    }
                    .el-button {
                        margin-left: 5px;
                    }
                   .el-date-editor--date{
                       width: 240px;
                   }
                   .el-date-editor--time-select{
                       width: 160px;
                   }
                }
                .table {
                    width: 100%;
                    height: calc(100% - 190px);
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        border-spacing: 0;
                        border-top: 1px solid #ccc;
                        border-bottom: 1px solid #ccc;
                        font-size: 14px;
                        color: #333;
                        text-align: center;
                        tr.thead {
                            font-weight: 600;
                        }
                        tr td {
                            max-width: 200px;
                            height: 40px;
                            border-right: 1px solid #ccc;
                            border-bottom: 1px solid #ccc;
                            min-width: 50px;
                            span {
                                width: 100%;
                                display: inline-block;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                &.btn {
                                    display: inline;
                                    padding: 2px 5px;
                                    border: 1px solid blue;
                                    border-radius: 5px;
                                    color: blue;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                }
                .pagenation {
                    width: 100%;
                    padding: 10px;
                    display: flex;
                    justify-content: center;
                }
            }
        }
    }
}
</style>
