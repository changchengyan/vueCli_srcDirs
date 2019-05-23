<template>
<div id="baseSet">
    <div class="tabs">
        <div class="tabItem" :class="{actived:activedIndex==index}" @click="getThisTab(index)" v-for="(item,index) in tabs" :key="index">
            <span>{{item.name}}</span>
        </div>
    </div>
    <template v-if="activedIndex==0">
        <div class="wrap-card">
            <div class="search">
                <div class="col">
                    <el-input placeholder="请输入名称" clearable prefix-icon="el-icon-search" v-model="all.search">
                    </el-input>
                    <el-button @click="search_all" type="primary" @keyup.enter="search_all">搜索</el-button>
                </div>
                <div class="col">
                    <el-button  :class="{ifAdd:addFlag===false}"  @click="gotoAddModel('1')" type="primary"><i class="el-icon-plus"></i>新增</el-button>
                </div>
            </div>
            <div class="tableItem">
                <div class="table-head">
                    <div class="col sm">
                        <span>编号</span>
                    </div>
                    <div class="col">
                        <span>测点名称</span>
                    </div>
                    <div class="col sm">
                        <span>测点项类型</span>
                    </div>
                    <div class="col">
                        <span>仪表编号</span>
                    </div>
                    <div class="col">
                        <span>测点经度</span>
                    </div>
                    <div class="col">
                        <span>测点纬度</span>
                    </div>
                    <div class="col sm">
                        <span>状态</span>
                    </div>
                    <div class="col">
                        <span>数据标识</span>
                    </div>
                    <div class="col md">
                        <span>配置时间</span>
                    </div>
                    <div class="col md">
                        <span>操作</span>
                    </div>
                </div>
                <div class="subContent">
                    <div class="table-content" v-for="(item,index) in all.list" :key="index">
                        <div class="col sm">
                            <span>{{ (all.currentPage-1)*10+(index+1)}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.MONITORNAME}}</span>
                        </div>
                        <div class="col sm">
                            <span>{{item.MONITORTYPE|formateType}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.DEVICECODE}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.LGTD}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.LTTD}}</span>
                        </div>
                        <div class="col sm">
                            <span>{{item.SUBISVALID|formateStatus}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.DATACODE}}</span>
                        </div>
                        <div class="col md">
                            <span>{{item.CREATETIME}}</span>
                        </div>
                        <div class="col md">
                            <span  :class="{ifEdit:editFlag===false}" @click="gotoDetail_all(item)">编辑</span>
                            <span  :class="{ifDel:delFlag===false}"  @click="del_all(item.id,index)">删除</span>
                        </div>
                    </div>
                </div>
                <div class="pagenation">
                    <el-pagination background  :current-page="currentPage" layout="total, prev, pager, next" :total="all.totalPage" @current-change="handleCurrent_all" @prev-click="handlePrev_all" @next-click="handleNext_all">
                    </el-pagination>
                </div>
            </div>
        </div>
    </template>
    <template v-if="activedIndex==1">
        <div class="wrap-card">
            <div class="search">
                <div class="col">
                    <el-input placeholder="请输入名称" clearable prefix-icon="el-icon-search" v-model="qulity.search">
                    </el-input>
                    <el-button @click="search_qulity" type="primary" @keyup.enter="search_qulity">搜索</el-button>
                </div>
                <div class="col">
                    <el-button  :class="{ifAdd:addFlag===false}" @click="gotoAddModel('1')" type="primary"><i class="el-icon-plus"></i>新增</el-button>
                </div>
            </div>
            <div class="tableItem">
                <div class="table-head">
                    <div class="col sm">
                        <span>编号</span>
                    </div>
                    <div class="col">
                        <span>测点名称</span>
                    </div>
                    <div class="col sm">
                        <span>测点项类型</span>
                    </div>
                    <div class="col">
                        <span>仪表编号</span>
                    </div>
                    <div class="col">
                        <span>测点经度</span>
                    </div>
                    <div class="col">
                        <span>测点纬度</span>
                    </div>
                    <div class="col sm">
                        <span>状态</span>
                    </div>
                    <div class="col">
                        <span>数据标识</span>
                    </div>
                    <div class="col md">
                        <span>配置时间</span>
                    </div>
                    <div class="col md">
                        <span>操作</span>
                    </div>
                </div>
                <div class="subContent">
                    <div class="table-content" v-for="(item,index) in qulity.list" :key="index">
                        <div class="col sm">
                            <span>{{(qulity.currentPage-1)*10+(index+1)}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.MONITORNAME}}</span>
                        </div>
                        <div class="col sm">
                            <span>{{item.MONITORTYPE|formateType}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.DEVICECODE}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.LGTD}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.LTTD}}</span>
                        </div>
                        <div class="col sm">
                            <span>{{item.SUBISVALID|formateStatus}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.DATACODE}}</span>
                        </div>
                        <div class="col md">
                            <span>{{item.CREATETIME}}</span>
                        </div>
                        <div class="col md">
                            <span   :class="{ifEdit:editFlag===false}" @click="gotoDetail_qulity(item)">编辑</span>
                            <span   :class="{ifDel:delFlag===false}" @click="del_qulity(item.id,index)">删除</span>
                        </div>
                    </div>
                </div>
                <div class="pagenation">
                    <el-pagination background  :current-page="currentPage" layout="total, prev, pager, next" :total="qulity.totalPage" @current-change="handleCurrent_qulity" @prev-click="handlePrev_qulity" @next-click="handleNext_qulity">
                    </el-pagination>
                </div>
            </div>
        </div>
    </template>
    <template v-if="activedIndex==2">
        <div class="wrap-card">
            <div class="search">
                <div class="col">
                    <el-input placeholder="请输入名称" clearable prefix-icon="el-icon-search" v-model="press.search">
                    </el-input>
                    <el-button type="primary" @click="search_press"  @keyup.enter="search_press">搜索</el-button>
                </div>
                <div class="col">
                    <el-button   :class="{ifAdd:addFlag===false}" @click="gotoAddModel('2')" type="primary"><i class="el-icon-plus"></i>新增</el-button>
                </div>
            </div>
            <div class="tableItem">
                <div class="table-head">
                    <div class="col sm">
                        <span>编号</span>
                    </div>
                    <div class="col">
                        <span>测点名称</span>
                    </div>
                    <div class="col sm">
                        <span>测点项类型</span>
                    </div>
                    <div class="col">
                        <span>仪表编号</span>
                    </div>
                    <div class="col">
                        <span>测点经度</span>
                    </div>
                    <div class="col">
                        <span>测点纬度</span>
                    </div>
                    <div class="col sm">
                        <span>状态</span>
                    </div>
                    <div class="col">
                        <span>数据标识</span>
                    </div>
                    <div class="col md">
                        <span>配置时间</span>
                    </div>
                    <div class="col md">
                        <span>操作</span>
                    </div>
                </div>
                <div class="subContent">
                    <div class="table-content" v-for="(item,index) in press.list" :key="index">
                        <div class="col sm">
                            <span>{{(press.currentPage-1)*10+(index+1)}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.MONITORNAME}}</span>
                        </div>
                        <div class="col sm">
                            <span>{{item.MONITORTYPE|formateType}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.DEVICECODE}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.LGTD}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.LTTD}}</span>
                        </div>
                        <div class="col sm">
                            <span>{{item.SUBISVALID|formateStatus}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.DATACODE}}</span>
                        </div>
                        <div class="col md">
                            <span>{{item.CREATETIME}}</span>
                        </div>
                        <div class="col md">
                            <span   :class="{ifEdit:editFlag===false}" @click="gotoDetail_press(item)">编辑</span>
                            <span   :class="{ifDel:delFlag===false}" @click="del_press(item.id,index)">删除</span>
                        </div>
                    </div>
                </div>
                <div class="pagenation">
                    <el-pagination background :current-page="currentPage" layout="total,prev, pager, next" :total="press.totalPage" @current-change="handleCurrent_press" @prev-click="handlePrev_press" @next-click="handleNext_press">
                    </el-pagination>
                </div>
            </div>
        </div>
    </template>
    <template v-if="activedIndex==3">
        <div class="wrap-card">
            <div class="search">
                <div class="col">
                    <el-input placeholder="请输入名称" clearable prefix-icon="el-icon-search" v-model="flow.search">
                    </el-input>
                    <el-button type="primary" @click="search_flow" @keyup.enter="search_flow">搜索</el-button>
                </div>
                <div class="col">
                    <el-button @click="gotoAddModel('3')" :class="{ifAdd:addFlag===false}" type="primary"><i class="el-icon-plus"></i>新增</el-button>
                </div>
            </div>
            <div class="tableItem">
                <div class="table-head">
                    <div class="col sm">
                        <span>编号</span>
                    </div>
                    <div class="col">
                        <span>测点名称</span>
                    </div>
                    <div class="col sm">
                        <span>测点项类型</span>
                    </div>
                    <div class="col">
                        <span>仪表编号</span>
                    </div>
                    <div class="col">
                        <span>测点经度</span>
                    </div>
                    <div class="col">
                        <span>测点纬度</span>
                    </div>
                    <div class="col sm">
                        <span>状态</span>
                    </div>
                    <div class="col">
                        <span>数据标识</span>
                    </div>
                    <div class="col md">
                        <span>配置时间</span>
                    </div>
                    <div class="col md">
                        <span>操作</span>
                    </div>
                </div>
                <div class="subContent">
                    <div class="subContent">
                        <div class="table-content" v-for="(item,index) in flow.list" :key="index">
                            <div class="col sm">
                                <span>{{(flow.currentPage-1)*10+(index+1)}}</span>
                            </div>
                            <div class="col">
                                <span>{{item.MONITORNAME}}</span>
                            </div>
                            <div class="col sm">
                                <span>{{item.MONITORTYPE|formateType}}</span>
                            </div>
                            <div class="col">
                                <span>{{item.DEVICECODE}}</span>
                            </div>
                            <div class="col">
                                <span>{{item.LGTD}}</span>
                            </div>
                            <div class="col">
                                <span>{{item.LTTD}}</span>
                            </div>
                            <div class="col sm">
                                <span>{{item.SUBISVALID|formateStatus}}</span>
                            </div>
                            <div class="col">
                                <span>{{item.DATACODE}}</span>
                            </div>
                            <div class="col md">
                                <span>{{item.CREATETIME}}</span>
                            </div>
                            <div class="col md">
                                <span   :class="{ifEdit:editFlag===false}" @click="gotoDetail_flow(item)">编辑</span>
                                <span   :class="{ifDel:delFlag===false}"  @click="del_flow(item.id,index)">删除</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pagenation">
                    <el-pagination background  :current-page="currentPage" layout="total,prev, pager, next" :total="flow.totalPage" @current-change="handleCurrent_flow" @prev-click="handlePrev_flow" @next-click="handleNext_flow">
                    </el-pagination>
                </div>
            </div>
        </div>
    </template>
    <save-status :showModel="ifShowModel" :content="fetchContent" :delNum="del_id" @delThis="closeModel" :type="modelType" :flag="status" @sureDelThis="configDel"></save-status>
</div>
</template>

<script>
import saveStatus from "@/common/components/poupe/save_status";

import {
    getPipeMonitorPoint,
    deleteMonitor
} from "@/api/monitor/baseSet"

export default {
    components: {
        saveStatus
    },
    data() {
        return {
            currentPage:1, //当前的页数
            ifShowModel: false,
            addFlag:true, //控制 新增的按钮
            editFlag:true, //控制 编辑的按钮
            delFlag:true, //控制  删除的按钮
            fetchContent: "",
            modelType: false,
            status: null,
            del_id: null,
            del_index: null,
            del_type: null, //区分是哪个tab的删除
            tabs: [{
                    name: "全部"
                },
                {
                    name: "水质"
                },
                {
                    name: "水压"
                },
                {
                    name: "流量"
                }
            ],
            activedIndex: 0,
            all: {
                totalPage: 1,
                search: "",
                list: [],
                currentPage:1
            },
            qulity: {
                totalPage: 1,
                search: "",
                list: [],
                currentPage:1
            },
            press: {
                totalPage: 1,
                search: "",
                list: [],
                currentPage:1
            },
            flow: {
                totalPage: 1,
                search: "",
                list: [],
                currentPage:1
            }
        }
    },
    methods: {
        closeModel(val) {
            this.ifShowModel = val.modelFlag
        },
        configDel(obj) {
            let del_index = this.del_index;
            let del_type = this.del_type;
            this.deleteMonitor_(obj.num, del_index, del_type);
        },
        getThisTab(index) {
            this.activedIndex = index;
            let temp_searchName = null;
            this.currentPage = 1;
            this.$store.commit("set_baseSet_tabs_activedIndex", index)
            if (index == 0) {
                temp_searchName = this.all.search;
                this.getPipeMonitorPoint_("1", temp_searchName, '');
            } else if (index == 1) {
                temp_searchName = this.qulity.search;
                this.getPipeMonitorPoint_("1", temp_searchName, '1');
            } else if (index == 2) {
                temp_searchName = this.press.search;
                this.getPipeMonitorPoint_("1", temp_searchName, '2');

            } else {
                temp_searchName = this.flow.search;
                this.getPipeMonitorPoint_("1", temp_searchName, '3');
            }
        },
        getPipeMonitorPoint_(page, name, type) {
            let that = this
            getPipeMonitorPoint({
                page: "" + page,
                pageSize: "10",
                name: "" + name,
                type: "" + type
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`;
                    return;
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!");
                    return;
                }
                if (res.status == 1) {
                    let {
                        data
                    } = res;
                    if (type == '') {
                        that.all.list = data.rows || [];
                        that.all.totalPage = data.total;
                    } else if (type == '1') {
                        that.qulity.list = data.rows || [];
                        that.qulity.totalPage = data.total;
                    } else if (type == '2') {
                        that.press.list = data.rows || [];
                        that.press.totalPage = data.total;
                    } else {
                        that.flow.list = data.rows || [];
                        that.flow.totalPage = data.total;
                    }

                }
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // } else {
                //     that.$message.error("逻辑错误!")
                // }
            });
        },
        gotoAddModel(num) {
            let flag =  this.addFlag
            if(!flag){
                return
            }
            this.$router.push({
                name: "pipe_monitor_addBase",
                params:{
                    "activedIndex":num
                }
            })
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
        },
        handleCurrent_flow(num) {
            let temp_searchName = this.flow.search;
            this.flow.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '3');
        },
        handlePrev_flow(num) {
            let temp_searchName = this.flow.search;
            this.flow.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '3');
        },
        handleNext_flow(num) {
            let temp_searchName = this.flow.search;
            this.flow.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '3');
        },
        handleCurrent_qulity(num) {
            let temp_searchName = this.qulity.search;
            this.qulity.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '1');
        },
        handlePrev_qulity(num) {
            let temp_searchName = this.qulity.search;
            this.qulity.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '1');
        },
        handleNext_qulity(num) {
            let temp_searchName = this.qulity.search;
            this.qulity.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '1');
        },
        handleCurrent_press(num) {
            let temp_searchName = this.press.search;
            this.press.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '2');
        },
        handlePrev_press(num) {
            let temp_searchName = this.press.search;
            this.press.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '2');
        },
        handleNext_press(num) {
            this.currentPage = num
            let temp_searchName = this.press.search;
            this.press.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '2');
        },
        handleCurrent_all(num) {
            this.currentPage = num
            let temp_searchName = this.all.search;
            this.all.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '');
        },
        handlePrev_all(num) {
            this.currentPage = num
            let temp_searchName = this.all.search;
            this.all.currentPage = num;
            this.getPipeMonitorPoint_(num, temp_searchName, '');
        },
        handleNext_all(num) {
            let temp_searchName = this.all.search;
            this.all.currentPage = num;
            this.currentPage = num
            this.getPipeMonitorPoint_(num, temp_searchName, '');
        },
        search_qulity() {
            let temp_name = this.qulity.search;
            this.qulity.currentPage = 1;
            this.getPipeMonitorPoint_('1', temp_name, '1');
        },
        search_press() {
            let temp_name = this.press.search;
            this.press.currentPage = 1;
            this.getPipeMonitorPoint_('1', temp_name, '2');
        },
        search_flow() {
            let temp_name = this.flow.search;
            this.flow.currentPage = 1;
            this.getPipeMonitorPoint_('1', temp_name, '3');
        },
        search_all() {
            let temp_name = this.all.search;
            this.currentPage = 1;
            this.all.currentPage = 1;
            this.getPipeMonitorPoint_('1', temp_name, '');
        },
        gotoDetail_flow(item) {
             let flag = this.editFlag
            if(!flag){
                return
            }
            let temp_item = item;
            this.$router.push({
                name: "pipe_monitor_addBase",params:{"edit":temp_item,"editAble":true}
            })
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");

        },
        gotoDetail_press(item) {
             let flag = this.editFlag
            if(!flag){
                return
            }
           let temp_item = item;
            this.$router.push({
                name: "pipe_monitor_addBase",params:{"edit":temp_item,"editAble":true}
            })
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
        },
        gotoDetail_qulity(item) {
            let flag = this.editFlag
            if(!flag){
                return
            }
             let temp_item = item;
            this.$router.push({
                name: "pipe_monitor_addBase",params:{"edit":temp_item,"editAble":true}
            })
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
        },
        gotoDetail_all(item) {
            let flag =  this.editFlag
            if(!flag){
                return
            }
            let temp_item = item;
            this.$router.push({
                name: "pipe_monitor_addBase",params:{"edit":temp_item,"editAble":true}
            })
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
        },
        del_all(id, index) {
            let flag =  this.delFlag
            if(!flag){
                return
            }
            this.del_id = id;
            this.del_index = index;
            this.ifShowModel = true;
            this.del_type = ""
        },
        del_qulity(id, index) {
             let flag = this.delFlag
            if(!flag){
                return
            }
            this.del_id = id;
            this.del_index = index;
            this.ifShowModel = true;
            this.del_type = "1"

        },
        del_press(id, index) {
             let flag = this.delFlag
            if(!flag){
                return
            }
            this.del_id = id;
            this.del_index = index;
            this.ifShowModel = true;
            this.del_type = "2"
        },
        del_flow(id, index) {
             let flag = this.delFlag
            if(!flag){
                return
            }
            this.del_id = id;
            this.del_index = index;
            this.ifShowModel = true;
            this.del_type = "3"
        },
        deleteMonitor_(id, index, type) {
            let that = this;
            deleteMonitor({
                id: "" + id
            }).then(res => {
                if (res.status == 1) {
                    that.ifShowModel = false;
                    switch (type) {
                        case '':
                            that.all.list.splice(index, 1);
                            break;
                        case '1':
                            that.qulity.list.splice(index, 1);
                            break;
                        case '2':
                            that.press.list.splice(index, 1);
                            break;
                        case '3':
                            that.flow.list.splice(index, 1);
                            break;
                    }
                }
            })
        }

    },
    created() {
        let that  = this;
        this.activedIndex = this.$store.getters.get_baseSet_tabs_activedIndex;
        let temp_actived = this.activedIndex;
        switch (temp_actived) {
            case 0:
                this.getPipeMonitorPoint_("1", '', '');
                break;
            case 1:
                this.getPipeMonitorPoint_("1", '', "1");
                break;
            case 2:
                this.getPipeMonitorPoint_("1", '', '2');
                break;
            case 3:
                this.getPipeMonitorPoint_("1", '', '3');
                break;
        }
        that.addFlag = (that.$store.getters.get_pages_btn_allow).baseSet.add;
        that.editFlag = (that.$store.getters.get_pages_btn_allow).baseSet.edit;
        that.delFlag = (that.$store.getters.get_pages_btn_allow).baseSet.del;

    },
    filters: {
        formateType(val) {
            let temp = val;
            switch (val) {
                case "1":
                    temp = "水质";
                    break;
                case "2":
                    temp = "水压";
                    break;
                case "3":
                    temp = "流量";
                    break;
            }
            return temp
        },
        formateStatus(val) {
            let temp = val;
            switch (val) {
                case "1":
                    temp = "启用";
                    break;
                case "2":
                    temp = "停用";
                    break;
            }
            return temp
        }
    }
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

#baseSet {
    width: 100%;
    height: 100%; // background: #ccc;
    padding: 20px;
    padding-top: 0;
    font-size: 14px;
    color: #333;

    .tabs {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;

        .tabItem {
            display: inline-block;
            padding: 0px 30px;
            line-height: 30px;
            border: 1px solid #ccc;
            border-bottom: none;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            margin-right: 10px;
            cursor: pointer;

            &.actived {
                background: #0b83fe;
                border: 1px solid #0b83fe;
                color: #fff;
            }
        }
    }

    .wrap-card {
        width: 100%;
        height: calc(100% - 40px);
        border: 1px solid #ccc;
        border-radius: 5px;
        padding-top: 10px;

        .search {
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 0 10px;

            .col {
                width: 50%;
                display: flex;
                justify-content: flex-end;

                .el-input {
                    width: calc(100% - 100px);
                    margin-right: 20px;
                }
                .el-button{
                    &.ifAdd{
                        background: gray;
                        cursor: not-allowed;
                    }
                }
            }

            margin-bottom: 10px;
        }

        .tableItem {
            width: 100%;
            height: calc(100% - 40px); // padding: 10px;
            // border: 1px solid #ccc;
            border-radius: 5px;

            .table-head {
                width: 100%;
                display: flex;
                justify-content: space-between;
                height: 40px;
                line-height: 40px;
                background: #e3edef;

                .col {
                    text-align: center;
                    border-right: 1px solid #ccc;
                    border-bottom: 1px solid #ccc;

                    &:last-child {
                        border-right: none;
                    }

                    font-weight: 600;

                    span {
                        display: inline-block;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        line-height: 40px;
                    }

                    width: calc(20% - 120px);

                    &.sm {
                        width: 100px;
                    }

                    &.md {
                        width: 150px;
                    }
                }
            }

            .subContent {
                width: 100%;
                height: calc(100% - 80px);
                overflow-y: auto;

                .table-content {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    height: 30px;

                    .col {
                        width: calc(20% - 120px);
                        text-align: center;
                        border-right: 1px solid #ccc;
                        border-bottom: 1px solid #ccc;

                        span {
                            display: inline-block;
                            width: 100%;
                            line-height: 30px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        &:last-child {
                            border-right: none;
                            padding-top: 5px;

                            span {
                                width: 50px;
                                border: 1px solid #0b83fe;
                                color: #0b83fe;
                                border-radius: 5px;
                                cursor: pointer;
                                line-height: 18px;
                                &.ifEdit,&.ifDel{
                                    background: gray;
                                    cursor: not-allowed;
                                    color: #fff;
                                }
                            }
                        }

                        &.sm {
                            width: 100px;
                        }

                        &.md {
                            width: 150px;
                        }
                    }
                }
            }

            .pagenation {
                width: 100%;
                display: flex;
                justify-content: center;
            }
        }
    }
}
</style>
