<template>
<div id="form">
    <div class="main">
        <div class="table-msg">
            <div class="top-head">
                <div class="subTabs">
                    <!-- :class="{actived:index==msg_tabItem}" -->
                    <!-- @click="showThis(index)" -->
                    <span class="subItem"   v-for="(item,index) in msg_tabs" :key="index">
                            {{item.name}}
                        </span>
                </div>
                <div class="actions">
                    <template v-if="msg_tabItem==1&&problemStatus=='true'">
                        <template v-if="dispatchFlag=='false'">
                            <span @click="dispatch_">派发</span>
                        </template>
                        <template v-else>
                            <span class="finish">派发完成</span>
                        </template>
                    </template>
                    <template v-if="msg_tabItem==0&&problemStatus=='true'">
                        <template v-if="dispatchFlag=='false'">
                            <span @click="dispatch_old">派发</span>
                        </template>
                        <template v-else>
                            <span class="finish">派发完成</span>
                        </template>
                    </template>
                    <span @click="exportPdf">导出</span>
                    <span @click="print">打印</span>
                    <template v-if="dispatchFlag=='false'&&problemStatus=='true'">
                        <span class="upload gray">
                        <i class="el-icon-upload"></i>
                        上传文件
                    </span>
                    </template>
                    <template v-else>
                        <span class="upload">
                            <i class="el-icon-upload"></i>
                            上传文件
                            <input type="file" class="fullTab" @change="getFile($event)" accept=".pdf,.jpg,.png" >
                        </span>
                    </template>

                    <span @click="goHome">返回</span>
                </div>
            </div>
            <template v-if="msg_tabItem==0">
                <template v-if="problemStatus=='true'&&dispatchFlag=='false'">
                    <div class="tables">
                        <div class=" table-item ">
                            <div class="inner-wrap">
                                <div class="mainHead old"> <span>{{companyName}}安装抢修派工单</span> </div>
                                <table>
                                    <tr>
                                        <td class="sm"><span>日期</span></td>
                                        <td colspan="2" class="md">
                                            <span>{{oldTable.time}}</span>
                                        </td>
                                        <td class="sm"><span>用户名</span></td>
                                        <td colspan="4" class="long"><span>{{oldTable.user}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><span>紧急程度</span></td>
                                        <td colspan="2">
                                            <el-select v-model="oldTable.hurrySelect" placeholder="请选择">
                                                <el-option v-for="item in oldTable.hurryList" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </td>
                                        <td><span>联系电话</span></td>
                                        <td colspan="4"><span>{{oldTable.tel}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><span>出勤事由</span></td>
                                        <td colspan="2" class="result" :title="oldTable.attendance">
                                            <span>{{oldTable.attendance}}</span>
                                        </td>
                                        <td><span>处理人</span></td>
                                        <td colspan="4" class="getWorker">
                                            <input type="text" placeholder="处理人" v-model="oldTable.doerName"  @focus="getWorkers">
                                            <div class="subLists" v-if="workers.length&&colseFlag">
                                                <div class="listItem" v-for="(item,index) in workers" :key="index" @click="selectThisWorker(item)">
                                                    {{item.NAME}}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td :rowspan="oldTable.productList.length+2"><span>工程情况</span></td>
                                        <td class="long-sm"> <span>序号</span> </td>
                                        <td class="long-long"><span>工作内容</span></td>
                                        <td class="long-sm"><span>材料名称</span></td>
                                        <td class="long-sm"><span>单位</span></td>
                                        <td class="long-sm"><span>数量</span></td>
                                        <td class="long-md"><span>备注</span></td>
                                        <td class="long-sm"><span>操作</span></td>
                                    </tr>
                                    <tr v-for="(item,index) in oldTable.productList" :key="index">
                                        <td class="long-sm"> <span>{{index+1}}</span> </td>
                                        <!-- <td><input  :ref="'content_old'+(index+1)" type="text" placeholder="工作内容"></td>
                                        <td><input  :ref="'name_old'+(index+1)" type="text" placeholder="材料名称"></td>
                                        <td><input  :ref="'unit_old'+(index+1)" type="text" placeholder="单位"></td>
                                        <td><input  :ref="'num_old'+(index+1)" type="text" placeholder="数量"></td>
                                        <td class="lang"><input :ref="'remark_old'+(index+1)" type="text" placeholder="备注"></td> -->

                                        <td><input v-model= "item.content" type="text" placeholder="工作内容"></td>
                                        <td><input  v-model= "item.name"  type="text" placeholder="材料名称"></td>
                                        <td><input  v-model= "item.unit"  type="text" placeholder="单位"></td>
                                        <td><input  v-model= "item.number"  type="text" placeholder="数量"></td>
                                        <td class="lang"><input v-model="item.remark" type="text" placeholder="备注"></td>
                                        <td class="del"><span class="btn-del" @click="old_delThis(index)">删除</span></td>
                                    </tr>
                                    <tr>
                                        <td colspan="7" class="addCol"> <span class="btn-add" @click="old_addOne">新增</span></td>
                                    </tr>
                                    <tr>
                                        <td><span>处理结果</span></td>
                                        <td colspan="2" class="largeText">
                                            <div></div>
                                        </td>
                                        <td><span>处理时间</span></td>
                                        <td colspan="4">

                                        </td>

                                    </tr>
                                    <tr>
                                        <td><span>库存</span></td>
                                        <td colspan="2" class="store">
                                            <div></div>
                                        </td>
                                        <td><span>部门负责人</span></td>
                                        <td colspan="4"></td>
                                    </tr>
                                    <tr>
                                        <td><span>派工负责人</span></td>
                                        <td colspan="2"> </td>
                                        <td><span>审核人</span></td>
                                        <td colspan="4"></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="tables">
                        <div class=" table-item ">
                            <div class="inner-wrap">
                                <div class="mainHead old"> <span>{{companyName}}安装抢修派工单</span> </div>
                                <table>
                                    <tr>
                                        <td class="sm"><span>日期</span></td>
                                        <td colspan="2" class="md">
                                            <span>{{oldTable.time}}</span>
                                        </td>
                                        <td class="sm"><span>用户名</span></td>
                                        <td colspan="3" class="long"><span>{{oldTable.user}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><span>紧急程度</span></td>
                                        <td colspan="2">
                                            <span>{{oldTable.hurrySelect|formateHurry}}</span>
                                        </td>
                                        <td><span>联系电话</span></td>
                                        <td colspan="3"><span>{{oldTable.tel}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><span>出勤事由</span></td>
                                        <td colspan="2" class="result" :title="oldTable.attendance">
                                            <span>{{oldTable.attendance}}</span>
                                        </td>
                                        <td><span>处理人</span></td>
                                        <td colspan="3" class="getWorker">
                                            <span>{{oldTable.doerName}}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td :rowspan="oldTable.productList.length+1"><span>工程情况</span></td>
                                        <td class="long-sm"> <span>序号</span> </td>
                                        <td class="long-long"><span>工作内容</span></td>
                                        <td class="long-sm"><span>材料名称</span></td>
                                        <td class="long-sm"><span>单位</span></td>
                                        <td class="long-sm"><span>数量</span></td>
                                        <td class="long-md"><span>备注</span></td>
                                    </tr>
                                    <tr v-for="(item,index) in oldTable.productList" :key="index">
                                        <td> <span>{{index+1}}</span> </td>
                                        <td :title="item.content"><span>{{item.content}}</span></td>
                                        <td><span>{{item.name}}</span></td>
                                        <td><span>{{item.unit}}</span></td>
                                        <td><span>{{item.number}}</span></td>
                                        <td class="lang"><span>{{item.remark}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><span>处理结果</span></td>
                                        <td colspan="2" class="largeText">
                                            <div></div>
                                        </td>
                                        <td><span>处理时间</span></td>
                                        <td colspan="3">

                                        </td>

                                    </tr>
                                    <tr>
                                        <td><span>库存</span></td>
                                        <td colspan="2" class="store">
                                            <div></div>
                                        </td>
                                        <td><span>部门负责人</span></td>
                                        <td colspan="3"></td>
                                    </tr>
                                    <tr>
                                        <td><span>派工负责人</span></td>
                                        <td colspan="2"> </td>
                                        <td><span>审核人</span></td>
                                        <td colspan="3"></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </template>

            </template>
            <template v-else>
                <template v-if="problemStatus=='true'&&dispatchFlag=='false'">
                    <div class="tables">
                        <div class=" table-item ">
                            <div class="inner-wrap">
                                <div class="mainHead">
                                    <span>{{companyName}}检修派工单</span>
                                </div>
                                <div class="subHead">
                                    <div class="col">
                                        <span>检修单号:</span>
                                        <span>{{workOrder.orderNum}}</span>
                                    </div>
                                    <div class="col">
                                        <span>派单时间:</span>
                                        <span>{{workOrder.orderTime}}</span>
                                    </div>
                                </div>
                                <table>
                                    <tr>
                                        <td><span>检修地点</span></td>
                                        <td><input type="text" placeholder="检修地点" v-model="workOrder.address"></td>
                                        <td><span>最迟处理时间</span></td>
                                        <td colspan="2">
                                            <!-- <span>2018-09-10 09:10</span> -->
                                            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="workOrder.lastHandleTime" type="datetime" placeholder="选择日期">
                                            </el-date-picker>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><span>紧急程度</span></td>
                                        <td>
                                            <!-- <span>{{workOrder.hurrySelect|formateHurry}}</span> -->
                                            <el-select v-model="workOrder.hurrySelect" placeholder="请选择">
                                                <el-option v-for="item in workOrder.hurryList" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </td>
                                        <td><span>检修类型</span></td>
                                        <td colspan="2">
                                            <span>{{workOrder.typeSelect|formateRepairType}}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><span>上报人</span></td>
                                        <td> <span>{{workOrder.repoter}}</span></td>
                                        <td><span>联系电话</span></td>
                                        <td colspan="2">
                                            <span>{{workOrder.tel}}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><span>派单人</span></td>
                                        <td><span>{{workOrder.orderer}}</span></td>
                                        <td><span>处理人</span></td>
                                        <td colspan="2" class="getWorker">
                                            <input type="text" placeholder="处理人" v-model="workOrder.doerName"  @focus="getWorkers">
                                            <div class="subLists" v-if="workers.length&&colseFlag">
                                                <div class="listItem" v-for="(item,index) in workers" :key="index" @click="selectThisWorker(item)">
                                                    {{item.NAME}}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><span>隐患描述</span></td>
                                        <td colspan="4"><input type="text" placeholder="隐患描述" v-model="workOrder.desc"></td>
                                    </tr>
                                    <tr>
                                        <td><span>检修内容</span></td>
                                        <td colspan="4"><input type="text" placeholder="检修内容" v-model="workOrder.repireContent"></td>
                                    </tr>
                                    <tr>
                                        <td :rowspan="workOrder.productList.length+2"><span>材料清单</span></td>
                                        <td><span>材料名称</span></td>
                                        <td><span>单位</span></td>
                                        <td><span>数量</span></td>
                                        <td><span>操作</span></td>
                                    </tr>
                                    <tr v-for="(item,index) in workOrder.productList" :key="index">
                                        <td><input  v-model="item.name"  type="text" placeholder="材料名称" ></td>
                                        <td><input  v-model="item.unit"  type="text" placeholder="单位" ></td>
                                        <td><input  v-model="item.number"  type="text" placeholder="数量" ></td>
                                        <td class="del"><span class="btn-add" @click="workOrder_del(index)">删除</span></td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" class="addCol"><span class="btn-add" @click="workOrder_add">新增</span></td>
                                    </tr>
                                    <tr>
                                        <td><span>派发意见</span></td>
                                        <td colspan="4"><input type="text" v-model="workOrder.orderAdvice"></td>
                                    </tr>
                                    <tr class="noBorder">
                                        <td colspan="2"> <span>派发部门:{{workOrder.orderDept}}</span> </td>
                                        <td colspan="3"> <span>处理部门:{{workOrder.repairDept}}</span> </td>
                                    </tr>
                                    <tr class="noBorder">
                                        <td colspan="2"> <span>签字:</span> </td>
                                        <td colspan="3"> <span>签字:</span> </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="tables">
                        <div class=" table-item ">
                            <div class="inner-wrap">
                                <div class="mainHead">
                                    <span>{{companyName}}检修派工单</span>
                                </div>
                                <div class="subHead">
                                    <div class="col">
                                        <span>检修单号:</span>
                                        <span>{{workOrder.orderNum}}</span>
                                    </div>
                                    <div class="col">
                                        <span>派单时间:</span>
                                        <span>{{workOrder.orderTime}}</span>
                                    </div>
                                </div>
                                <table>
                                    <tr>
                                        <td><span>检修地点</span></td>
                                        <td :title="workOrder.address"> <span>{{workOrder.address}}</span></td>
                                        <td><span>最迟处理时间</span></td>
                                        <td >
                                            <span>{{workOrder.lastHandleTime}}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><span>紧急程度</span></td>
                                        <td>
                                            <span>{{workOrder.hurrySelect|formateHurry}}</span>
                                        </td>
                                        <td><span>检修类型</span></td>
                                        <td >
                                            <span>{{workOrder.typeSelect|formateRepairType}}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><span>上报人</span></td>
                                        <td> <span>{{workOrder.repoter}}</span></td>
                                        <td><span>联系电话</span></td>
                                        <td > <span>{{workOrder.tel}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><span>派单人</span></td>
                                        <td><span>{{workOrder.orderer}}</span></td>
                                        <td><span>处理人</span></td>
                                        <td  class="getWorker">
                                            <span>{{workOrder.doerName}}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><span>隐患描述</span></td>
                                        <td colspan="3" :title="workOrder.desc"> <span>{{workOrder.desc}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><span>检修内容</span></td>
                                        <td colspan="3" :title="workOrder.repireContent"> <span>{{workOrder.repireContent}}</span></td>
                                    </tr>
                                    <tr>
                                        <td :rowspan="workOrder.productList.length+1"><span>材料清单</span></td>
                                        <td><span>材料名称</span></td>
                                        <td><span>单位</span></td>
                                        <td><span>数量</span></td>
                                    </tr>
                                    <tr v-for="(item,index) in workOrder.productList" :key="index">
                                        <td><span>{{item.name}}</span></td>
                                        <td><span>{{item.unit}}</span></td>
                                        <td><span>{{item.number}}</span></td>
                                    </tr>
                                    <tr>
                                        <td><span>派发意见</span></td>
                                        <td colspan="3" :title="workOrder.orderAdvice"> <span>{{workOrder.orderAdvice}}</span></td>
                                    </tr>
                                    <tr class="noBorder">
                                        <td colspan="2"> <span>派发部门:{{workOrder.orderDept}}</span> </td>
                                        <td colspan="2"> <span>处理部门:{{workOrder.repairDept}}</span> </td>
                                    </tr>
                                    <tr class="noBorder">
                                        <td colspan="2"> <span>签字:</span> </td>
                                        <td colspan="2"> <span>签字:</span> </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </template>

            </template>
            <iframe :src="makepdf_path" frameborder="0" height="0" width="0" style="position:absolute"></iframe>
        </div>
    </div>
    <save-model :showModel="save_model.toggleShowModel" :type="true" :flag="save_model.save_flag" :content="save_model.save_msg" @delThis="hiddenSaveModel"></save-model>
</div>
</template>

<script>
import {
    saveOrUpdateWorkorder,
    queryPersonByDept,
    expWorkWorder2xls
} from "@/api/rushrepair/workOrder"
import saveModel from "@/common/components/poupe/save_status"
import {
    uploadFiles
} from "@/api/common/upload"
export default {
    components: {
        saveModel
    },
    data() {
        return {
            makepdf_path: "", // 制作pdf的路径
            selectTable_type: 0, //显示工单 原有工单和标准工单  默认是原有工单 0 原有工单 1 标准工单
            problemID: "", //隐患ID
            companyName: "", //公司名字
            dispatchFlag: 'false', //派单状态
            deptId: "",
            problemStatus: "", // 问题状态 
            msg_tabs: [], //工单
            msg_tabItem: 1, // 工单信息下的 激活状态下的tab
            file: null, //上传的文件
            oldTable: {
                id: "", //派单的ID
                time: "",
                user: "",
                tel: "",
                attendance: "", //出勤事由
                doer: "", // 处理人ID
                doerName: "", //处理人名字
                currentTime: "",
                value: '',
                productList: [{
                        name: "",
                        unit: "",
                        number: "",
                        content: "",
                        remark: ""
                    },
                    {
                        name: "",
                        unit: "",
                        number: "",
                        content: "",
                        remark: ""
                    },
                    {
                        name: "",
                        unit: "",
                        number: "",
                        content: "",
                        remark: ""
                    }
                ],
                hurryList: [{
                        value: "0",
                        label: "紧急"
                    },
                    {
                        value: "1",
                        label: "较急"
                    },
                    {
                        value: "2",
                        label: "一般"
                    }
                ],
                hurrySelect: ""
            },
            workOrder: {
                id: "", //派单的ID
                orderNum: "", //订单单号
                orderTime: "", // 派单时间
                address: "",
                lastHandleTime: "", //最迟处理时间
                hurryList: [{
                        value: "0",
                        label: "紧急"
                    },
                    {
                        value: "1",
                        label: "较急"
                    },
                    {
                        value: "2",
                        label: "一般"
                    }
                ],
                hurrySelect: "",
                typeList: [{
                        value: "1",
                        label: "爆管"
                    },
                    {
                        value: "2",
                        label: "暗漏"
                    },
                    {
                        value: "3",
                        label: "供水设备维修"
                    },
                    {
                        value: "4",
                        label: "非法用水"
                    },
                    {
                        value: "5",
                        label: "供水管网压占"
                    },
                    {
                        value: "6",
                        label: "其他"
                    }
                ],
                typeSelect: "",
                dangerDesc: "",
                repireContent: "", //检修内容
                productList: [{
                        name: "",
                        unit: "",
                        number: "",
                        content: "",
                        remark: ""
                    },
                    {
                        name: "",
                        unit: "",
                        number: "",
                        content: "",
                        remark: ""
                    },
                    {
                        name: "",
                        unit: "",
                        number: "",
                        content: "",
                        remark: ""
                    }
                ],
                repoter: "", //上报人
                tel: "", //联系人手机
                orderer: "", //派单人
                doer: "", //处理人ID
                doerName: "", //处理人名字
                desc: "", //隐患描述
                orderAdvice: "", //检修内容
            },
            workers: [],
            workerName: "",
            colseFlag: true,
            save_model: {
                toggleShowModel: false,
                save_flag: false,
                save_msg: ""
            },

        }
    },
    methods: {
        goBack() {
            this.$router.push({
                name: "pipe_rushrepair_information"
            });
            this.$store.commit("setAside_status", true);
            this.$emit("showAside");
        },
        showThisTab(index) {
            this.main_selectTab = index;
            this.$store.commit("setToptab", index);
        },
        toggoleShow() {
            this.tableShow = !this.tableShow;
        },
        showInfo() {
            this.showInfoModel = true;
        },
        hiddenInfoModel(val) {
            this.showInfoModel = val;
        },
        showThis(index) {
            this.msg_tabItem = index;
        },
        old_addOne() {
            this.oldTable.productList.push({
                name: "",
                unit: "",
                number: "",
                content: "",
                remark: ""
            });
        },
        old_delThis(index) {
            this.oldTable.productList.splice(index, 1);
        },
        workOrder_add() {
            this.workOrder.productList.push({
                name: "",
                unit: "",
                number: "",
                content: "",
                remark: ""
            });
        },
        workOrder_del(index) {
            this.workOrder.productList.splice(index, 1);
        },
        gotoEdit() {
            this.$router.push({
                name: "pipe_rushrepair_edit"
            });
        },
        print() {
            let flag = this.selectTable_type;
            if (flag == 0) {
                let temp_oldList = this.oldTable.productList;
                let temp_arr = [];
                for (let i = 0; i < temp_oldList.length; i++) {
                    for (let i = 0; i < temp_arr.length; i++) {
                        let temp_json = {}
                        temp_json.content = temp_arr[i].workContent
                        temp_json.name = temp_arr[i].materialName
                        temp_json.unit = temp_arr[i].materialUnit
                        temp_json.num = temp_arr[i].materialNum
                        temp_json.remark = temp_arr[i].remark
                        temp_arr.push(temp_json)
                    }
                }
                let temp_data = {
                    orgName: this.companyName,
                    time: this.oldTable.time,
                    user: this.oldTable.user,
                    hurrySelect: this.oldTable.hurrySelect == "0" ? "紧急" : (this.oldTable.hurrySelect == "1" ? "较急" : "一般"),
                    tel: this.oldTable.tel,
                    attendance: this.oldTable.attendance,
                    doerName: this.oldTable.doerName,
                    productList: temp_arr,
                    feedBack: {
                        result: "",
                        time: "",
                        storeNum: ""
                    }
                }
                sessionStorage.setItem("tableContent", JSON.stringify(temp_data));
                let pageUrl = dse.static_baseUrl + "/tables/old.html";
                window.open(pageUrl);

            } else {
                let temp_workOrder = this.workOrder.productList;
                let temp_arr = [];
                for (let i = 0; i < temp_workOrder.length; i++) {
                    for (let i = 0; i < temp_arr.length; i++) {
                        let temp_json = {}
                        temp_json.content = temp_arr[i].workContent
                        temp_json.name = temp_arr[i].materialName
                        temp_json.unit = temp_arr[i].materialUnit
                        temp_json.num = temp_arr[i].materialNum
                        temp_json.remark = temp_arr[i].remark
                        temp_arr.push(temp_json)
                    }
                }
                let type = this.workOrder.typeSelect;
                let temp_type = null;
                switch (type) {
                    case "0":
                        temp_type = "暗漏"
                        break;
                    case "1":
                        temp_type = "爆管"
                        break;
                    case "2":
                        temp_type = "管网压占"
                        break;
                    case "3":
                        temp_type = "附属设备问题"
                        break;
                    case "4":
                        temp_type = "检修井问题"
                        break;
                    case "5":
                        temp_type = "其它"
                        break;
                }

                let temp_data = {
                    orgName: this.companyName,
                    orderNum: this.workOrder.orderNum,
                    orderTime: this.workOrder.orderTime,
                    lastDoTime: this.workOrder.lastHandleTime,
                    address: this.workOrder.address,
                    tel: this.workOrder.tel,
                    hurrySelect: this.workOrder.hurrySelect == "0" ? "紧急" : (this.workOrder.hurrySelect == "1" ? "较急" : "一般"),
                    typeSelect: temp_type,
                    reporter: this.workOrder.reporter,
                    contacts: this.workOrder.contacts,
                    orderer: this.workOrder.orderer,
                    doerName: this.workOrder.doerName,
                    dangerDesc: this.workOrder.desc,
                    repireContent: this.workOrder.repireContent,
                    productList: temp_arr,
                    orderAdvice: this.workOrder.orderAdvice,
                    orderDept: this.workOrder.orderDept,
                    repairDept: this.workOrder.repairDept
                }
                sessionStorage.setItem("tableContent", JSON.stringify(temp_data));
                let pageUrl = dse.static_baseUrl + "/tables/standard.html";
                window.open(pageUrl);
            }
        },
        formate_products(arr) {
            let temp_arr = arr.length > 0 ? arr : [];
            let formateArr = []
            if (temp_arr.length > 0) {
                for (let i = 0; i < temp_arr.length; i++) {
                    let temp_json = {}
                    temp_json.name = temp_arr[i].materialName == null ? "" : temp_arr[i].materialName;
                    temp_json.content = temp_arr[i].workContent == null ? "" : temp_arr[i].workContent
                    temp_json.unit = temp_arr[i].materialUnit == null ? "" : temp_arr[i].materialUnit
                    temp_json.num = temp_arr[i].materialNum == null ? "" : temp_arr[i].materialNum
                    temp_json.remark = temp_arr[i].remark == null ? "" : temp_arr[i].remark
                    formateArr.push(temp_json);
                }
            }
            return formateArr
        },
        exportPdf() {
            let that = this;
            let flag = this.selectTable_type;
            // if (flag == 0) {
            //     let temp_oldList = this.formate_products(that.oldTable.productList);
            //     let temp_data = {
            //         orgName: this.companyName == null ? "" : this.companyName,
            //         time: this.oldTable.time == null ? "" : this.oldTable.time,
            //         user: this.oldTable.user == null ? "" : this.oldTable.user,
            //         hurrySelect: this.oldTable.hurrySelect == "0" ? "紧急" : (this.oldTable.hurrySelect == "1" ? "较急" : "一般"),
            //         tel: this.oldTable.tel == null ? "" : this.oldTable.tel,
            //         attendance: this.oldTable.attendance == null ? "" : this.oldTable.attendance,
            //         doerName: this.oldTable.doerName == null ? "" : this.oldTable.doerName,
            //         productList: temp_oldList,
            //         feedBack: {
            //             result: "",
            //             time: "",
            //             storeNum: ""
            //         }
            //     }
            //     sessionStorage.setItem("tableContent", JSON.stringify(temp_data));
            //     let pageUrl = dse.static_baseUrl + "/makePDF.html?name='原有工单'";
            //     // window.open(pageUrl);
            //     that.makepdf_path = pageUrl + "&random=" + Math.random();
            // } else {
            //     // let temp_oldList = this.getOrderInputs();
            //     let temp_oldList = this.formate_products(that.workOrder.productList);
            //     let type = this.workOrder.typeSelect;
            //     let temp_type = null;
            //     switch (type) {
            //         case "0":
            //             temp_type = "暗漏"
            //             break;
            //         case "1":
            //             temp_type = "爆管"
            //             break;
            //         case "2":
            //             temp_type = "管网压占"
            //             break;
            //         case "3":
            //             temp_type = "附属设备问题"
            //             break;
            //         case "4":
            //             temp_type = "检修井问题"
            //             break;
            //         case "5":
            //             temp_type = "其它"
            //             break;
            //     }

            //     let temp_data = {
            //         orgName: this.companyName == null ? "" : this.companyName,
            //         orderNum: this.workOrder.orderNum == null ? "" : this.workOrder.orderNum,
            //         orderTime: this.workOrder.orderTime == null ? "" : this.workOrder.orderTime,
            //         lastDoTime: this.workOrder.lastHandleTime == null ? "" : this.workOrder.lastHandleTime,
            //         address: this.workOrder.address == null ? "" : this.workOrder.address,
            //         tel: this.workOrder.tel == null ? "" : this.workOrder.tel,
            //         hurrySelect: this.workOrder.hurrySelect == "0" ? "紧急" : (this.workOrder.hurrySelect == "1" ? "较急" : "一般"),
            //         typeSelect: temp_type,
            //         reporter: this.workOrder.reporter == null ? "" : this.workOrder.reporter,
            //         contacts: this.workOrder.contacts == null ? "" : this.workOrder.contacts,
            //         orderer: this.workOrder.orderer == null ? "" : this.workOrder.orderer,
            //         doerName: this.workOrder.doerName == null ? "" : this.workOrder.doerName,
            //         dangerDesc: this.workOrder.desc == null ? "" : this.workOrder.desc,
            //         repireContent: this.workOrder.repireContent == null ? "" : this.workOrder.repireContent,
            //         productList: temp_oldList,
            //         orderAdvice: this.workOrder.orderAdvice == null ? "" : this.workOrder.orderAdvice,
            //         orderDept: this.workOrder.orderDept == null ? "" : this.workOrder.orderDept,
            //         repairDept: this.workOrder.repairDept == null ? "" : this.workOrder.repairDept
            //     }
            //     sessionStorage.setItem("tableContent", JSON.stringify(temp_data));
            //     let pageUrl = dse.static_baseUrl + "/makePDF.html?name='标准工单'";
            //     that.makepdf_path = pageUrl + "&random=" + Math.random();

            // }

            let temp_id =''
            if(flag ===0){
                temp_id = that.oldTable.id
            }else{
                temp_id = that.workOrder.id;
            }
            this.expWorkWorder2xls_(temp_id)
        },
        goHome() {
            let that = this;
            this.$router.push({
                name: "pipe_rushrepair_hiddenDanger"
            })
            that.$store.commit("setAside_status", true);
            that.$emit("showAside");
            sessionStorage.setItem("dispatchFlag", "false");
        },
        getOrderInputs() {
            let that = this;
            let temp_list = that.workOrder.productList;
            let temp_arr = [];
            if (temp_list.length > 0) {
                for (let i = 0; i < temp_list.length; i++) {
                    // let temp_name = "name" + (i + 1);
                    // let temp_unit = "unit" + (i + 1);
                    // let temp_number = "number" + (i + 1);
                    // let temp_name_ = that.$refs[temp_name][0].value;
                    // let temp_unit_ = that.$refs[temp_unit][0].value;
                    // let temp_number_ = that.$refs[temp_number][0].value;
                    if(temp_list[i].name!==""){
                         temp_arr.push({
                            "name": "" + temp_list[i].name,
                            "unit": "" + temp_list[i].unit,
                            "num": "" + temp_list[i].number,
                            "content": "",
                            "remark": ""
                        })
                    }
                }
            }
            return temp_arr
        },
        getOld_OrderInputs() {
            let that = this;
            let temp_list = that.oldTable.productList;
            let temp_arr = [];
            if (temp_list.length > 0) {
                for (let i = 0; i < temp_list.length; i++) {
                    // let temp_content = "content_old" + (i + 1);
                    // let temp_name = "name_old" + (i + 1);
                    // let temp_unit = "unit_old" + (i + 1);
                    // let temp_num = "num_old" + (i + 1);
                    // let temp_remark = "remark_old" + (i + 1);
                    // let temp_content_ = that.$refs[temp_content][0].value;
                    // let temp_name_ = that.$refs[temp_name][0].value;
                    // let temp_unit_ = that.$refs[temp_unit][0].value;
                    // let temp_num_ = that.$refs[temp_num][0].value;
                    // let temp_remark_ = that.$refs[temp_remark][0].value;

                    if(temp_list[i].content!==""||temp_list[i].name!==""){
                         temp_arr.push({
                            "name": "" + temp_list[i].name,
                            "unit": "" + temp_list[i].unit,
                            "num": "" + temp_list[i].number,
                            "content": "" + temp_list[i].content,
                            "remark": "" + temp_list[i].remark
                        })
                    }  
                }
            }
            return temp_arr
        },
        queryPersonByDept_() {
            let that = this;
            queryPersonByDept({
                id: "" + that.deptId
            }).then(res => {
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.status == 1) {
                    let {
                        data
                    } = res;
                    that.workers = data || [];
                }
            })
        },
        getWorkers(val) {
            this.colseFlag = true;
            this.queryPersonByDept_();
        },
        selectThisWorker(val) {
            this.workOrder.doer = val.ID;
            this.oldTable.doer = val.ID;
            this.workOrder.doerName = val.NAME;
            this.oldTable.doerName = val.NAME;
            this.colseFlag = false;
        },
        saveOrUpdateWorkorder_(formData_) {
            let that = this;
            saveOrUpdateWorkorder(formData_).then(res => {
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                that.save_model.toggleShowModel = true;
                that.save_model.save_flag = (res.status == 1);
                that.save_model.save_msg = res.msg;
                if (res.status == 1) {
                    let {
                        data
                    } = res;
                    that.dispatchFlag = 'true';
                    sessionStorage.setItem("dispatchFlag", 'true');
                    that.workOrder.orderTime = data.dispatchTime || "";
                    that.workOrder.orderNum = data.orderCode || "";
                    that.oldTable.time = data.dispatchTime || "";

                    let flag = that.selectTable_type;
                    if (flag == 0) {
                        that.oldTable.id = data.id;
                    } else {
                        that.workOrder.id = data.id;
                    }
                    let temp_arr = JSON.parse(res.data.materialArr);
                    let temp_getList = []
                    for (let i = 0; i < temp_arr.length; i++) {
                        let temp_json = {}
                        temp_json.content = temp_arr[i].content
                        temp_json.name = temp_arr[i].name
                        temp_json.unit = temp_arr[i].unit
                        temp_json.number = temp_arr[i].num
                        temp_json.remark = temp_arr[i].remark
                        temp_getList.push(temp_json)
                    }
                    that.workOrder.productList = that.oldTable.productList = temp_getList;

                }
            })
        },
        dispatch_() {
            let that = this;
            if (this.workOrder.doerName == "") {
                this.$message.error("请填写处理人!")
                return
            }
            let temp_arr = this.getOrderInputs();
            let formData_ = new FormData();
            formData_.append("checkAddr", that.workOrder.address);
            // console.log(that.workOrder.lastHandleTime)
            formData_.append("lastHandleTime", that.workOrder.lastHandleTime);
            formData_.append("lev", that.workOrder.hurrySelect);
            formData_.append("orderType", that.workOrder.typeSelect);
            formData_.append("handleUser", that.workOrder.doer);
            formData_.append("checkContent", that.workOrder.repireContent);
            formData_.append("materialArr", JSON.stringify(temp_arr));
            formData_.append("dispatchAdvice", that.workOrder.orderAdvice);
            formData_.append("orderStatus", "1");
            formData_.append("questionId", that.problemID);
            formData_.append("dispatchAdvice",that.workOrder.orderAdvice)
            formData_.append("proFrom", "1");
            formData_.append("type", "1");

            this.saveOrUpdateWorkorder_(formData_);
        },
        hiddenSaveModel(val) {
            this.save_model.toggleShowModel = false;
        },
        dispatch_old() {
            let that = this;
            if (that.oldTable.hurrySelect == "" || that.oldTable.doerName == "") {
                this.$message.error("请把基本信息填写完整!")
                return
            }
            let formData_ = new FormData();
            let temp_arr = this.getOld_OrderInputs();
            formData_.append("lev", that.oldTable.hurrySelect);
            formData_.append("handleUser", that.oldTable.doer);
            formData_.append("checkContent", that.oldTable.attendance);
            formData_.append("materialArr", JSON.stringify(temp_arr));
            formData_.append("orderStatus", "1");
            formData_.append("questionId", that.problemID);
            formData_.append("proFrom", "1");
            formData_.append("type", "0");
            this.saveOrUpdateWorkorder_(formData_);

        },
        getFile(e) {
            let that = this;
            let temp_file = e.target.files[0];
            let temp_fileName = temp_file.name;
            let temp_fileName_arr = temp_fileName.split(".");
            if (temp_fileName_arr[temp_fileName_arr.length - 1] != 'png' && temp_fileName_arr[temp_fileName_arr.length - 1] != 'jpg' && temp_fileName_arr[temp_fileName_arr.length - 1] != 'pdf') {
                that.$message.error("您上传的文件格式应该为：png、jpg或者pdf");
                return
            }
            let post_formdata = new FormData();
            let flag = that.selectTable_type;
            if (flag == 0) {
                post_formdata.append("fileBiz", that.oldTable.id)
            } else {
                post_formdata.append("fileBiz", that.workOrder.id)
            }
            post_formdata.append("fileName", temp_fileName)
            post_formdata.append("files", temp_file)

            uploadFiles(post_formdata).then(res => {
                that.save_model.toggleShowModel = true;
                that.save_model.save_flag = (res.status == 1);
                that.save_model.save_msg = res.msg;
            })

        },
         expWorkWorder2xls_(id){
            let  that = this
            expWorkWorder2xls({
                id:""+id,
                questionId:""
            }).then(res=>{
                if(res.status===1){
                    let sub_url = res.data.path?res.data.path:"";
                    if(sub_url){
                        let main_url = that.$store.getters.get_filePath
                        let complate_url = main_url+sub_url;
                        window.location.href = complate_url;
                    }
                }
            }).catch(error=>{
                console.log(error)
            })
        }
    },
    filters: {
        formateHurry(val) {
            let temp = val;
            switch (val) {
                case "0":
                    temp = "紧急";
                    break;
                case "1":
                    temp = "较急";
                    break;
                case "2":
                    temp = "一般";
                    break;
            }
            return temp;
        },
        formateRepairType(val) {
            let temp = val;
            switch (val) {
                case "1":
                    temp = "爆管"
                    break;
                case "2":
                    temp = "暗漏"
                    break;
                case "3":
                    temp = "供水设备维修"
                    break;
                case "4":
                    temp = "非法用水"
                    break;
                case "5":
                    temp = "供水管网压占"
                    break;
                case "6":
                    temp = "其它"
                    break;
            }
            return temp;
        }
    },
    created() {
        this.main_selectTab = this.$store.getters.getTopActivedTab;
        let temp_data = JSON.parse(sessionStorage.getItem("hiddenDanger"));
        this.companyName = this.$store.getters.getCompyName;
        this.deptId = this.$store.getters.get_deptId;
        this.workOrder.repoter = temp_data.createUser;
        this.workOrder.desc = this.oldTable.attendance = temp_data.proDescrip;
        this.workOrder.id = this.oldTable.id = temp_data.id;
        this.workOrder.address = temp_data.place;
        this.workOrder.tel = this.$store.getters.get_tel;
        this.workOrder.orderer = this.oldTable.user = this.$store.getters.getUserName;
        this.workOrder.repireContent = temp_data.checkContent
        this.workOrder.orderAdvice = temp_data.dispatchAdvice
        // this.workOrder.hurrySelect = this.oldTable.hurrySelect = temp_data.probLevel;
        this.workOrder.typeSelect = temp_data.probType;
        this.workOrder.orderDept = this.workOrder.repairDept = this.$store.getters.get_dept;
        this.oldTable.tel = this.$store.getters.get_tel;
        this.problemID = temp_data.id;

        if (temp_data.handleUser) {
            this.oldTable.doerName = this.workOrder.doerName = temp_data.handleUser
        }
        if (temp_data.lev) {
            this.oldTable.hurrySelect = this.workOrder.hurrySelect = temp_data.lev
        }
        if (temp_data.dispatchTime) {
            this.oldTable.time = this.workOrder.orderTime = temp_data.dispatchTime
        }
        if (temp_data.materialList) {
            let temp_arr = []

            for(let i=0;i<temp_data.materialList.length;i++){
                let temp_json = {}
                temp_json.name = temp_data.materialList[i].materialName;
                temp_json.content = temp_data.materialList[i].workContent
                temp_json.unit = temp_data.materialList[i].materialUnit
                temp_json.number = temp_data.materialList[i].materialNum
                temp_json.remark = temp_data.materialList[i].remark
                temp_arr.push(temp_json)
            }

            this.oldTable.productList = this.workOrder.productList = temp_arr
        }
        if (temp_data.orderCode) {
            this.workOrder.orderNum = temp_data.orderCode
        }
        if (temp_data.lastHandleTime) {
            this.workOrder.lastHandleTime = temp_data.lastHandleTime
        }
        if (temp_data.checkAddr) {
            this.workOrder.address = temp_data.checkAddr
        }
        if (temp_data.type) {
            this.workOrder.typeSelect = temp_data.type
        }
        if (temp_data.proUser) {
            this.workOrder.repoter = temp_data.proUser
        }
        // this.orderStatus = temp_data.
        let temp_flag = this.$route.params.editFlag;
        this.problemStatus = temp_flag
        this.dispatchFlag = sessionStorage.getItem("dispatchFlag") || "false";

        let temp_selectTable = this.$route.params.tableType;
        this.selectTable_type = temp_selectTable;
        if (temp_selectTable == 0) {
            this.msg_tabs = [{
                name: "原有工单"
            }]
            this.msg_tabItem = 0;
        } else {
            this.msg_tabs = [{
                name: "标准工单"
            }]
            this.msg_tabItem = 1;
        }
    },
    beforeDestroy() {
        sessionStorage.setItem("dispatchFlag", 'false');
    }
}
</script>

<style lang="scss" scoped>
$baseFontSize:14px;
$baseColor:#333;
$baseBorderColor:#ccc;

#form {
    width: 100%;
    height: 100%;
    background: #ebebeb;
    font-size: $baseFontSize;
    color: $baseColor;

    .main {
        width: 100%;
        height: calc(100%);
        position: relative;

        .table-msg {
            width: 100%;
            height: 100%;

            .top-head {
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding: 0 20px;
                height: 40px;
                line-height: 40px;
                background: #caf2fc;

                .subTabs {
                    font-weight: 600;

                    span {
                        display: inline-block;
                        line-height: 38px;
                        cursor: pointer;
                        margin-right: 15px;

                        &.actived {
                            color: #0b83fe;
                            border-bottom: 2px solid #0b83fe;
                        }
                    }
                }

                .actions {
                    cursor: pointer;

                    span {
                        display: inline-block;
                        padding: 0px 15px;
                        line-height: 25px;
                        border-radius: 5px;
                        background: #0b83fe;
                        color: #fff;
                        margin-right: 10px;

                        &:last-child {
                            background: #fe8a01;
                        }

                        &.finish {
                            background: #67c23a;
                        }

                        &.upload {
                            position: relative;
                            width: 110px;
                            height: 25px;

                            input {
                                display: inline-block;
                                width: 100%;
                                height: 100%;
                                position: absolute;
                                top: 0;
                                left: 0;
                                opacity: 0;
                                cursor: pointer;
                            }
                        }

                        &.gray {
                            background: gray;
                            cursor: not-allowed;
                        }
                    }
                }
            }

            .tables {
                input {
                    display: inline-block;
                    height: 30px;
                    width: 100%;
                    border: none;
                    padding-left: 5px;
                }

                textarea {
                    border: none;
                    width: 100%;
                }

                width: 100%;
                height: calc(100% - 40px);
                padding: 0 10px;
                padding-bottom: 10px;
                display: flex;
                justify-content: center;

                .table-item {
                    width: 800px;
                    height: 100%;

                    .inner-wrap {
                        width: 100%;
                        height: 100%;
                        background: #fff;
                        font-size: 14px;
                        padding: 0 10px;
                        overflow-y: auto;

                        .mainHead {
                            font-size: 16px;
                            line-height: 40px;
                            text-align: center;
                            font-weight: 600;
                            border-bottom: 1px solid #ccc;

                            &.old {
                                border-bottom: none;
                            }
                        }

                        .subHead {
                            width: 100%;
                            padding: 0 10px;
                            height: 30px;
                            line-height: 30px;
                            display: flex;
                            justify-content: space-between;
                            font-size: 12px;
                            color: #666;
                        }

                        table {
                            width: 100%;
                            border-spacing: 0;
                            border-collapse: collapse;
                            border-top: 1px solid #ccc;
                            margin-bottom: 20px;

                            tr {
                                border: 1px solid #ccc;
                                border-top: none;

                                &.noBorder {
                                    border: none;

                                    td {
                                        padding-left: 20px;
                                        border-right: none;
                                        text-align: center;
                                    }
                                }

                                td {
                                    // min-height: 250px;
                                    line-height: 30px;
                                    height: 30px;
                                    text-align: center;
                                    border-right: 1px solid #ccc;
                                    text-align: center;

                                    span{
                                        display: inline-block;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        width: 100%;
                                    }
                                    span.btn-del,span.btn-add{
                                        width: 60px;
                                    }

                                    &.sm {
                                        width: 80px;
                                    }

                                    &.md {
                                        width: 120px;
                                    }

                                    .inLine {
                                        width: calc(100% - 76px);
                                        display: inline-block;
                                    }

                                    &.result {
                                        word-break: break-all;

                                        span {
                                            display: inline-block;
                                        }
                                    }

                                    &.middle {
                                        width: 100px;
                                    }

                                    &.long {
                                        width: calc(100% - 300px);
                                    }

                                    &.largeText {
                                        div {
                                            height: 100px;
                                        }
                                    }

                                    &.long-sm {
                                        width: 50px;
                                    }

                                    &.long-md {
                                        width: 200px;
                                    }

                                    &.long-long {
                                        width: calc(100% - 450px);
                                    }

                                    &.store {
                                        div {
                                            height: 100px;
                                        }
                                    }

                                    &.addCol {
                                        span {
                                            padding: 0 5px;
                                            line-height: 20px;
                                            border: 1px solid #0b83fe;
                                            color: #0b83fe;
                                            border-radius: 5px;
                                            cursor: pointer;
                                        }
                                    }

                                    &.md {
                                        width: 300px;
                                    }

                                    &.del {
                                        color: #333;
                                        font-size: 12px;

                                        span {
                                            padding: 0 8px;
                                            line-height: 20px;
                                            border: 1px solid #0b83fe;
                                            color: #0b83fe;
                                            border-radius: 5px;
                                            cursor: pointer;
                                        }
                                    }

                                    &.getWorker {
                                        position: relative;

                                        .subLists {
                                            width: 80%;
                                            position: absolute;
                                            top: 40px;
                                            left: 10px;
                                            background: #fff;
                                            min-height: 100px;
                                            max-height: 200px;
                                            overflow-y: auto;
                                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

                                            .listItem {
                                                width: 100;
                                                line-height: 30px;
                                                height: 30px;
                                                border-bottom: 1px solid #ccc;
                                                cursor: pointer;

                                                &:hover {
                                                    background: #0b83fe;
                                                    color: #fff;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .notice {
        width: 100%;
        height: 400px;

        .subContent {
            width: 100%;
            padding: 10px;
            height: calc(100% - 40px);
        }

        .footer {
            width: 100%;
            height: 40px;
            background: #e3e3e3;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;

            span {
                display: inline-block;
                padding: 0px 10px;
                height: 30px;
                line-height: 30px;
                background: #0b83ff;
                color: #fff;
                border-radius: 5px;
                margin-right: 10px;
                cursor: pointer;

                &.cancel {
                    background: #ccccce;
                }
            }
        }
    }
}
</style>
