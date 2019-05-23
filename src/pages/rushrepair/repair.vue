<template>
<div id="repair">
    <div class="timeSelect">
        <span>从:</span>
        <el-date-picker value-format="yyyy-MM-dd" v-model="startTime" type="date" placeholder="选择日期">
        </el-date-picker>
        <span>到:</span>
        <el-date-picker value-format="yyyy-MM-dd" v-model="endTime" type="date" placeholder="选择日期">
        </el-date-picker>
        <el-select v-model="orderItem" placeholder="请选择">
            <el-option v-for="item in orders" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <el-button type="primary" @click="search">搜索</el-button>
        <!-- <el-button :class="{ifAdd:addFlag===false}" type="primary" icon="el-icon-plus" @click="creatNewOrder">新增</el-button> -->
        <span class="add" :class="{ifAdd:addFlag===true}" @click="creatNewOrder">
               <i class="el-icon-plus"></i> 新增
        </span>
    </div>
    <div class="table">
        <table>
            <thead>
                <tr>
                    <th class="sm"><span>序号</span></th>
                    <th class="md"><span>检修单号</span></th>
                    <th class="md"><span>上报时间</span></th>
                    <th class="sm"><span>紧急程度</span></th>
                    <th class="md"><span>来源</span></th>
                    <th ><span>派发意见</span></th>
                    <th class="sm"><span>详情</span></th>
                    <th class="sm"><span>状态</span></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in tableList" :key="index">
                    <td class="sm"><span>{{index+1}}</span></td>
                    <td class="md"><span>{{item.orderCode}}</span></td>
                    <td class="md"><span>{{item.dispatchTime}}</span></td>
                    <td class="sm">
                        <template v-if="item.lev=='0'">
                            <span class="level3">紧急</span>
                        </template>
                        <template v-if="item.lev=='1'">
                            <span class="level2">较急</span>
                        </template>
                        <template v-if="item.lev=='2'">
                            <span class="level1">一般</span>
                        </template>
                    </td>
                    <td class="md"><span>{{item.proForm}}</span></td>
                    <td><span class="longText" :title="item.dispatchAdvice">{{item.dispatchAdvice}}</span></td>
                    <td class="sm border"  :class="{ifDispatch:dispatchFlag===true}" @click="gotoDesc(item.id,item.type,item.orderStatus)"><span>详情</span></td>
                    <td class="sm">
                        <template v-if="item.orderStatus=='0'">
                            <span class="ordering">已派单</span>
                        </template>
                        <template v-if="item.orderStatus=='1'">
                            <span class="receive">已派单</span>
                        </template>
                        <template v-if="item.orderStatus=='2'">
                            <span class="doing">处理中</span>
                        </template>
                        <template v-if="item.orderStatus=='3'">
                            <span class="doing"> 拒绝处理</span>
                        </template>
                        <template v-if="item.orderStatus=='4'">
                            <span class="down">处理完成</span>
                        </template>
                        <template v-if="item.orderStatus=='5'">
                            <span class="checked">审核通过</span>
                        </template>
                        <template v-if="item.orderStatus=='6'">
                            <span class="doing">审核拒绝</span>
                        </template>
                        <template v-else>
                            <span></span>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="pagination">
        <el-pagination background layout="prev, pager, next" :total="totalPages" @current-change="handleCurrentTime" @prev-click="handlePrev" @next-click="handleNext">
        </el-pagination>
    </div>
    <select-table :closedModel_flag="showSelect_model_flag" @closeModel="close_selectModel" @configSelect="configTable"></select-table>
</div>
</template>

<script>
import selectTable from "@/common/components/select_into_table"

import {
    getWorkorderList
} from "@/api/rushrepair/repair"
export default {
    components: {
        selectTable
    },
    data() {
        return {
            addFlag:false, //新增按钮的权限控制
            dispatchFlag:false, //工单详情和派发的按钮控制
            startTime: "",
            endTime: "",
            tableList: [],
            orders: [],
            orderItem: "",
            totalPages: 1,
            showSelect_model_flag: false, //管网抢修 选择进入 标准工单 或者原用工单 弹窗
            gotoDetail_id: null, // 管网抢修进入详情页的id
            addNew_detail_flag: null, // 判断是否是新增按钮或者是到详情按钮  1 为新增  2 为详情
        };
    },
    methods: {
        creatNewOrder() {
            let flag = this.addFlag
            if(!flag){
                return
            }
            this.addNew_detail_flag = 1;
            let flag_ = this.addNew_detail_flag;
            let temp_id = this.gotoDetail_id;
            if (flag_ == 1) {
                this.$router.push({
                    name: "pipe_rushrepair_workOrder"
                });
            } else {
                this.$router.push({
                    name: "pipe_rushrepair_piperepair",
                    params: {
                         "id": temp_id,
                         "tableType": val
                    }
                });
            }
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
        },
        getWorkorderList_(page) {
            let that = this;
            let temp_startTime = this.startTime || "";
            let temp_endTime = this.endTime || "";
            let temp_type = this.orderItem
            let start = temp_startTime.replace("-", "/");
            let start_ = new Date(start);
            let end = temp_endTime.replace('-', '/');
            let end_ = new Date(end);
            if (start_ > end_) {
                that.$message.error('开始时间不能小于结束时间');
                return;
            }
            getWorkorderList({
                startTime: "" + temp_startTime,
                endTime: "" + temp_endTime,
                orderStatus: "" + temp_type,
                page: "" + page,
                pageSize: "10"
            }).then(res => {
                if (res.status == 1) {
                    let {
                        data
                    } = res;
                    that.tableList = data.rows || [];
                    that.totalPages = Math.ceil(data.total / 10) || 1;

                }
            })
        },
        search() {
            this.getWorkorderList_("1");
        },
        handleCurrentTime(val) {
            this.getWorkorderList_(val);
        },
        handlePrev(val) {
            this.getWorkorderList_(val);
        },
        handleNext(val) {
            this.getWorkorderList_(val);
        },
        gotoDesc(id,type,status) {
            let flag_ = this.dispatchFlag
            if(!flag_){
                return
            }
            this.gotoDetail_id = id;
            let flag = this.addNew_detail_flag;
            let temp_id = this.gotoDetail_id;
            let temp_num = parseInt(type)
            this.$router.push({
                name: "pipe_rushrepair_piperepair",
                params: {
                        "id": temp_id,
                        "tableType": temp_num,
                        "status":status
                }
            });
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");

        },
        close_selectModel(val) {
            this.showSelect_model_flag = false;
        },
        configTable(val) {
            let flag = this.addNew_detail_flag;
            let temp_id = this.gotoDetail_id;
            if (flag == 1) {
                this.$router.push({
                    name: "pipe_rushrepair_workOrder",
                    params: {
                        "tableType": val
                    }
                });
            } else {
                this.$router.push({
                    name: "pipe_rushrepair_piperepair",
                    params: {
                         "id": temp_id,
                         "tableType": val
                    }
                });
            }

            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
        }
    },
    created() {
        let  that = this;
        that.addFlag = (that.$store.getters.get_pages_btn_allow).repair.add;
        that.dispatchFlag = (that.$store.getters.get_pages_btn_allow).repair.dispatch;
        this.getWorkorderList_("1");
        let temp_orderStatus = [ {
                    value:"",
                    label:"全部状态"
                }]
        temp_orderStatus=temp_orderStatus.concat(dse.orderStatus)
        this.orders = temp_orderStatus
        
    }
};
</script>

<style lang="scss" scoped>
#repair {
    width: 100%;
    height: 100%;
    padding: 10px;
    font-size: 14px;
    color: #333;
    background: #ebebeb;

    .timeSelect {
        width: 100%;
        height: 30px;
        line-height: 30px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 20px;

        .el-date-editor--date {
            margin-right: 10px;
        }

        span {
            display: inline-block;
            margin-right: 10px;
        }

        .el-select {
            margin-right: 10px;
        }
        .el-button{
            background: #0b83fe;
           
        }
        span.add{
            display: inline-block;
            // padding: 3px 10px;
            height: 30px;
            line-height: 30px;
            margin-left: 20px;
            padding: 0 10px;
            border-radius: 5px;
            background: gray;
            cursor: not-allowed;
            color: #fff;
            &.ifAdd{
                background: #0b83fe;
                cursor: pointer;
            }
        }
    }

    .table {
        width: 100%;
        height: calc(100% - 100px);
        overflow-y: auto;
        background: #fff;
        margin-bottom: 20px;

        table {
            width: 100%;
            border-spacing: 0;
            text-align: center;
            border: 1px solid #ccc;
            border-bottom: none;

            thead,
            tbody {
                width: 100%;
            }

            thead tr {
                background: #e3edef;
            }

            tr {
                width: 100%;

                td {
                    border-right: 1px solid #ccc;
                    border-bottom: 1px solid #ccc;

                    &:last-child {
                        border-right: none;
                    }

                    span{
                        display: inline-block;
                        line-height: 40px;
                    }

                    &.sm {
                        width: 70px;

                        span.level3 {
                            display: inline-block;
                            padding: 0px 15px;
                            line-height: 25px;
                            // border-radius: 5px;
                            color: #fff;
                            background: #ff0f10;

                        }

                        span.level2 {
                            display: inline-block;
                            padding: 0px 15px;
                            line-height: 25px;
                            color: #fff;
                            background: #e18224;

                        }

                        span.level1 {
                            display: inline-block;
                            padding: 0px 15px;
                            line-height: 25px;
                            color: #fff;
                            background: #dec624;
                        }

                        &.border {
                            span {
                                display: inline-block;
                                padding: 0 10px;
                                line-height: 20px;
                                border-radius: 5px;
                                border: 1px solid gray;
                                color: gray;
                                cursor: not-allowed;
                            }
                            &.ifDispatch{
                                span{
                                    border: 1px solid #0b83fe;
                                    cursor: pointer;
                                    color: #0b83fe;
                                }
                            }
                        }

                        span.haveSend {
                            color: #e3862e;
                        }

                        span.haveDown {
                            color: #31b678;
                        }

                        span.noSend {
                            color: #ff1213;
                        }

                        span.ordering {
                            display: inline-block;
                            line-height: 25px;
                            // padding: 0px 10px;
                            color: #c964e9;
                            border-radius: 5px;
                        }

                        span.receive {
                            display: inline-block;
                            // padding: 0px 8px;
                            line-height: 25px;
                            color: #e7af18;
                            border-radius: 5px;
                        }

                        span.doing {
                            display: inline-block;
                            line-height: 25px;
                            // padding: 0px 10px;
                            color: #ff2c50;
                            border-radius: 5px;
                        }

                        span.down {
                            display: inline-block;
                            line-height: 25px;
                            // padding: 0px 10px;
                            color: #16bfb1;
                            border-radius: 5px;
                        }

                        span.checked {
                            display: inline-block;
                            line-height: 25px;
                            // padding: 0px 10px;
                            color: #00bd12;
                            border-radius: 5px;
                        }
                    }

                    &.md {
                        width: 160px;
                    }

                    span.longText {
                        width: 100%;
                        padding: 0 10px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }

                th {
                    line-height: 30px;
                    border-right: 1px solid #ccc;
                    border-bottom: 1px solid #ccc;

                    &:last-child {
                        border-right: none;
                    }

                    &.sm {
                        width: 70px;
                    }

                    &.md {
                        width: 160px;
                    }
                }
            }
        }
    }

    .pagination {
        width: 100%;
        display: flex;
        justify-content: center;
    }
}
</style>
