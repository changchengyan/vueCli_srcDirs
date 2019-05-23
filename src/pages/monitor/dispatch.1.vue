<template>
<div id="dispatch">
    <div class="row first">
        <span class="col big">工单信息</span>
        <span class="col" @click="goHome">返回</span>
    </div>
    <div class="row last">
        <div class="col tabs">
            <!-- :class="{active:index==tableIndex}" -->
            <!-- @click="thisTab(index)" -->
            <div class="tab-item" v-for="(item,index) in tabs" :key="index">{{item.name}}</div>
        </div>
        <div class="col actions">
            <template v-if="tableIndex==1">
                <template v-if="haveDispatch=='false'">
                    <span @click="dispatch_">派发</span>
                </template>
                <template v-else>
                    <span class="finish">派发完成</span>
                </template>
            </template>
            <template v-if="tableIndex==0">
                <template v-if="haveDispatch=='false'">
                    <span @click="dispatch_old">派发</span>
                </template>
                <template v-else>
                    <span class="finish">派发完成</span>
                </template>
            </template>
            <template v-if="tableIndex==2">
                <template v-if="haveDispatch=='false'">
                    <span @click="dispatch_feedBack">反馈</span>
                </template>
                <template v-else>
                    <span class="finish">反馈完成</span>
                </template>
            </template>
            <div class="export" @click="exportPdf"> <span>导出</span> </div>
            <div class="print" @click="print"> <span>打印</span></div>
            <template v-if="haveDispatch=='true'">
                <div class="upload">
                    <span>
                    <i class="el-icon-upload"></i>
                    上传文件
                    <input type="file" class="fullTab" @change="getFile($event)" accept=".pdf,.jpg,.png" >
                </span>
                </div>=
            </template>
            <template v-else>
                <div class="upload">
                    <span class="upload gray">
                      <i class="el-icon-upload"></i>
                      上传文件
                    </span>
                </div>
            </template>
        </div>
    </div>
    <template v-if="tableIndex==0&&tableType==0">
        <template v-if="haveDispatch=='false'">
            <div class="tables">
                <div class=" table-item ">
                    <div class="inner-wrap">
                        <div class="mainHead old"> <span>{{companyName}}安装抢修派工单</span> </div>
                        <table>
                            <tr>
                                <td class="sm"><span>日期</span></td>
                                <td colspan="2">
                                    <span>{{oldTable.time}}</span>
                                </td>
                                <td class="middle"><span>用户名</span></td>
                                <td colspan="5"><span>{{oldTable.user}}</span></td>
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
                                <td colspan="2" class="md">
                                    <input type="text" v-model="oldTable.attendance">
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
                                <td> <span>序号</span> </td>
                                <td><span>工作内容</span></td>
                                <td class="middle"><span>材料名称</span></td>
                                <td class="sm"><span>单位</span></td>
                                <td class="sm"><span>数量</span></td>
                                <td><span>备注</span></td>
                                <td><span>操作</span></td>
                            </tr>
                            <tr v-for="(item,index) in oldTable.productList" :key="index">
                                <td> <span>{{index+1}}</span> </td>
                                <td><input  :ref="'content_old'+(index+1)" type="text" placeholder="工作内容"></td>
                                <td><input  :ref="'name_old'+(index+1)" type="text" placeholder="材料名称"></td>
                                <td><input  :ref="'unit_old'+(index+1)" type="text" placeholder="单位"></td>
                                <td><input  :ref="'num_old'+(index+1)" type="text" placeholder="数量"></td>
                                <td class="lang"><input :ref="'remark_old'+(index+1)" type="text" placeholder="备注"></td>
                                <td class="del"><span @click="old_delThis(index)">删除</span></td>
                            </tr>
                            <tr>
                                <td colspan="7" class="addCol"> <span @click="old_addOne">新增</span></td>
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
                                <td colspan="2">
                                    <span>{{oldTable.time}}</span>
                                </td>
                                <td class="middle"><span>用户名</span></td>
                                <td colspan="5"><span>{{oldTable.user}}</span></td>
                            </tr>
                            <tr>
                                <td><span>紧急程度</span></td>
                                <td colspan="2">
                                    <span>{{oldTable.hurrySelect|formateHurry}}</span>
                                </td>
                                <td><span>联系电话</span></td>
                                <td colspan="4"><span>{{oldTable.tel}}</span></td>
                            </tr>
                            <tr>
                                <td><span>出勤事由</span></td>
                                <td colspan="2" class="md">
                                    <span>{{oldTable.attendance}}</span>
                                </td>
                                <td><span>处理人</span></td>
                                <td colspan="4">
                                    <span>{{oldTable.doerName}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td :rowspan="oldTable.productList.length+2"><span>工程情况</span></td>
                                <td> <span>序号</span> </td>
                                <td><span>工作内容</span></td>
                                <td class="middle"><span>材料名称</span></td>
                                <td class="sm"><span>单位</span></td>
                                <td class="sm"><span>数量</span></td>
                                <td><span>备注</span></td>
                            </tr>
                            <tr v-for="(item,index) in oldTable.productList" :key="index">
                                <td> <span>{{index+1}}</span> </td>
                                <td><input readonly :ref="'content_old'+(index+1)" type="text" placeholder="工作内容"></td>
                                <td><input readonly :ref="'name_old'+(index+1)" type="text" placeholder="材料名称"></td>
                                <td><input readonly :ref="'unit_old'+(index+1)" type="text" placeholder="单位"></td>
                                <td><input readonly :ref="'num_old'+(index+1)" type="text" placeholder="数量"></td>
                                <td class="lang"><input  readonly  :ref="'remark_old'+(index+1)" type="text" placeholder="备注"></td>
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
    </template>
    <template v-if="tableIndex==0&&tableType==1">
        <template v-if="haveDispatch=='false'">
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
                                <td><input type="text" placeholder="检修地点" v-model='workOrder.address' ></td>
                                <td><span>最迟处理时间</span></td>
                                <td colspan="5">
                                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="workOrder.lastDoTime" type="datetime" placeholder="选择日期">
                                    </el-date-picker>
                                </td>
                            </tr>
                            <tr>
                                <td><span>紧急程度</span></td>
                                <td>
                                    <el-select v-model="workOrder.hurrySelect" placeholder="请选择">
                                        <el-option v-for="item in  workOrder.hurryList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </td>
                                <td><span>检修类型</span></td>
                                <td colspan="5">
                                    <el-select v-model="workOrder.typeSelect" placeholder="请选择">
                                        <el-option v-for="item in workOrder.typeList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </td>
                            </tr>
                            <tr>
                                <td><span>派单人</span></td>
                                <td>
                                    <span>{{workOrder.orderer}}</span>
                                </td>
                                <td><span>处理人</span></td>
                                <td colspan="5" class="getWorker">
                                    <input type="text" placeholder="处理人" v-model="workOrder.doerName" @focus="getWorkers">
                                    <div class="subLists" v-if="workers.length&&colseFlag">
                                        <div class="listItem" v-for="(item,index) in workers" :key="index" @click="selectThisWorker(item)">
                                            {{item.NAME}}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><span>检修内容</span></td>
                                <td colspan="4">
                                    <input type="text" placeholder="请输入检修内容" v-model="workOrder.repireContent">
                                </td>
                            </tr>
                            <tr>
                                <td :rowspan="workOrder.productList.length+2"><span>材料清单</span></td>
                                <td><span>材料名称</span></td>
                                <td><span>单位</span></td>
                                <td><span>数量</span></td>
                                <td><span>操作</span></td>
                            </tr>
                            <tr v-for="(item,index) in workOrder.productList" :key="index">
                                <td><input  :ref="'name'+(index+1)" type="text" placeholder="材料名称" ></td>
                                <td><input  :ref="'unit'+(index+1)" type="text" placeholder="单位" ></td>
                                <td><input  :ref="'number'+(index+1)" type="text" placeholder="数量"></td>
                                <td class="del"><span @click="workOrder_del(index)">删除</span></td>
                            </tr>
                            <tr>
                                <td colspan="4" class="addCol"><span @click="workOrder_add">新增</span></td>
                            </tr>
                            <tr>
                                <td><span>派发意见</span></td>
                                <td colspan="4"><input type="text" placeholder="派发意见" v-model="workOrder.orderAdvice"></td>
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
                                <td> <input  readonly type="text" placeholder="检修地点" v-model='workOrder.address' ></td>
                                <td><span>最迟处理时间</span></td>
                                <td colspan="2">
                                    <span>{{workOrder.lastDoTime}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td><span>紧急程度</span></td>
                                <td>
                                    <span>{{workOrder.hurrySelect|formateHurry}}</span>
                                </td>
                                <td><span>检修类型</span></td>
                                <td colspan="2">
                                    <span>{{workOrder.typeSelect|formateRepairType}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td><span>派单人</span></td>
                                <td>
                                    <span>{{workOrder.orderer}}</span>
                                </td>
                                <td><span>处理人</span></td>
                                <td colspan="2" class="getWorker">
                                    <span>{{workOrder.doerName}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td><span>检修内容</span></td>
                                <td colspan="4">
                                    <input type="text" placeholder="请输入检修内容" v-model="workOrder.repireContent">
                                </td>
                            </tr>
                            <tr>
                                <td :rowspan="workOrder.productList.length+2"><span>材料清单</span></td>
                                <td><span>材料名称</span></td>
                                <td><span>单位</span></td>
                                <td><span>数量</span></td>
                            </tr>
                            <tr v-for="(item,index) in workOrder.productList" :key="index">
                                <td><input readonly :ref="'name'+(index+1)" type="text" placeholder="材料名称" ></td>
                                <td><input readonly :ref="'unit'+(index+1)" type="text" placeholder="单位" ></td>
                                <td><input readonly :ref="'number'+(index+1)" type="text" placeholder="数量"></td>
                            </tr>
                            <tr>
                                <td><span>派发意见</span></td>
                                <td colspan="4"> <span>{{workOrder.orderAdvice}}</span></td>
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

    </template>
    <save-model :showModel="save_model.toggleShowModel" :type="true" :flag="save_model.save_flag" :content="save_model.save_msg" @delThis="hiddenSaveModel"></save-model>
    <iframe :src="makepdf_path" frameborder="0" height="0" width="0" style="position:absolute"></iframe>
</div>
</template>

<script>
import {
    saveOrUpdateWorkorder,
    queryPersonByDept
} from "@/api/rushrepair/workOrder"
import saveModel from "@/common/components/poupe/save_status"

export default {
    components: {
        saveModel
    },
    data() {
        return {
            id: "", //工单id
            makepdf_path: "",
            deptId: "", //部门ID
            companyName: "", //公司名字
            haveDispatch: 'false', //是否已派单
            tabs: [],
            tableIndex: 0,
            oldTable: {
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
                        number: ""
                    },
                    {
                        name: "",
                        unit: "",
                        number: ""
                    },
                    {
                        name: "",
                        unit: "",
                        number: ""
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
                orderNum: "", //工单单号
                orderTime: "", // 派单时间
                lastDoTime: "", //最近处理时间
                address: "", //检修地点
                tel: "", //派发人手机号
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
                        value: "0",
                        label: "暗漏"
                    },
                    {
                        value: "1",
                        label: "爆管"
                    },
                    {
                        value: "2",
                        label: "管网压占"
                    },
                    {
                        value: "3",
                        label: "附属设备问题"
                    },
                    {
                        value: "4",
                        label: "检查井问题"
                    },
                    {
                        value: "5",
                        label: "其他"
                    }
                ],
                typeSelect: "",
                reporter: "", //上报人
                contacts: "", //联系电话
                orderer: "", //派单人
                doer: "", // 处理人ID
                doerName: "", //处理人名字
                dangerDesc: "", // 隐患描述
                repireContent: "", // 检修内容
                productList: [{
                        name: "",
                        unit: "",
                        number: ""
                    },
                    {
                        name: "",
                        unit: "",
                        number: ""
                    },
                    {
                        name: "",
                        unit: "",
                        number: ""
                    }
                ], // 材料
                orderAdvice: "", //派发意见
                orderDept: "", //派发部门
                repairDept: "", //处理部门
            },
            workers: [],
            workerName: "",
            colseFlag: true,
            save_model: {
                toggleShowModel: false,
                save_flag: false,
                save_msg: ""
            },
            tableType: 0, // 默认选择是原有工单
        };
    },
    beforeDesdivoy() {
        this.$router.push({
            name: "pipe_monitor_earlyWarning"
        });
        this.$store.commit("setAside_status", true);
        this.$emit("showAside");
    },
    methods: {
        goHome() {
            this.$router.go(-1);
            this.$store.commit("setAside_status", true);
            this.$emit("showAside");
            sessionStorage.setItem("haveDispatch", 'false')
        },
        print() {
            let flag = this.tableType;
            if (flag == 0) {
                let temp_oldList = this.getOld_OrderInputs();
                let temp_data = {
                    orgName: this.companyName,
                    time: this.oldTable.time,
                    user: this.oldTable.user,
                    hurrySelect: this.oldTable.hurrySelect == "0" ? "紧急" : (this.oldTable.hurrySelect == "1" ? "较急" : "一般"),
                    tel: this.oldTable.tel,
                    attendance: this.oldTable.attendance,
                    doerName: this.oldTable.doerName,
                    productList: temp_oldList,
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

                let temp_workOrder = this.getOrderInputs();
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
                    lastDoTime: this.workOrder.lastDoTime,
                    address: this.workOrder.address,
                    tel: this.workOrder.tel,
                    hurrySelect: this.workOrder.hurrySelect == "0" ? "紧急" : (this.workOrder.hurrySelect == "1" ? "较急" : "一般"),
                    typeSelect: temp_type,
                    reporter: this.workOrder.reporter,
                    contacts: this.workOrder.contacts,
                    orderer: this.workOrder.orderer,
                    doerName: this.workOrder.doerName,
                    dangerDesc: this.workOrder.dangerDesc,
                    repireContent: this.workOrder.repireContent,
                    productList: temp_workOrder,
                    orderAdvice: this.workOrder.orderAdvice,
                    orderDept: this.workOrder.orderDept,
                    repairDept: this.workOrder.repairDept
                }
                sessionStorage.setItem("tableContent", JSON.stringify(temp_data));
                let pageUrl = dse.static_baseUrl + "/tables/standard.html";
                window.open(pageUrl);

            }
        },
        exportPdf() {
            let that = this;
            let flag = this.tableType;
            if (flag == 0) {
                let temp_oldList = this.getOld_OrderInputs();
                let temp_data = {
                    orgName: this.companyName==null?"":this.companyName,
                    time: this.oldTable.time==null?"":this.oldTable.time,
                    user: this.oldTable.user==null?"":this.oldTable.user,
                    hurrySelect: this.oldTable.hurrySelect == "0" ? "紧急" : (this.oldTable.hurrySelect == "1" ? "较急" : "一般"),
                    tel: this.oldTable.tel==null?"":this.oldTable.tel,
                    attendance: this.oldTable.attendance==null?"":this.oldTable.attendance,
                    doerName: this.oldTable.doerName==null?"":this.oldTable.doerName,
                    productList: temp_oldList,
                    feedBack: {
                        result: "",
                        time: "",
                        storeNum: ""
                    }
                }
                sessionStorage.setItem("tableContent", JSON.stringify(temp_data));
                let pageUrl = dse.static_baseUrl + "/makePDF.html?name='原有工单'";
                that.makepdf_path = pageUrl+"&random="+Math.random();

            } else {

                let temp_workOrder = this.getOrderInputs();
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
                     default :
                        temp_type = ""
                }

                let temp_data = {
                    orgName: this.companyName==null?"":this.companyName,
                    orderNum: this.workOrder.orderNum==null?"":this.workOrder.orderNum,
                    orderTime: this.workOrder.orderTime==null?"":this.workOrder.orderTime,
                    lastDoTime: this.workOrder.lastDoTime==null?"":this.workOrder.lastDoTime,
                    address: this.workOrder.address==null?"":this.workOrder.address,
                    tel: this.workOrder.tel==null?"":this.workOrder.tel,
                    hurrySelect: this.workOrder.hurrySelect == "0" ? "紧急" : (this.workOrder.hurrySelect == "1" ? "较急" : "一般"),
                    typeSelect: temp_type,
                    reporter: this.workOrder.reporter==null?"":this.workOrder.reporter,
                    contacts: this.workOrder.contacts==null?"":this.workOrder.contacts,
                    orderer: this.workOrder.orderer==null?"":this.workOrder.orderer,
                    doerName: this.workOrder.doerName==null?"":this.workOrder.doerName,
                    dangerDesc: this.workOrder.dangerDesc==null?"":this.workOrder.dangerDesc,
                    repireContent: this.workOrder.repireContent==null?"":this.workOrder.repireContent,
                    productList: temp_workOrder,
                    orderAdvice: this.workOrder.orderAdvice==null?"":this.workOrder.orderAdvice,
                    orderDept: this.workOrder.orderDept==null?"":this.workOrder.orderDept,
                    repairDept: this.workOrder.repairDept==null?"":this.workOrder.repairDept,
                }
                sessionStorage.setItem("tableContent", JSON.stringify(temp_data));
                let pageUrl = dse.static_baseUrl + "/makePDF.html?name='标准工单'";
                that.makepdf_path = pageUrl+"&random="+Math.random();

            }
        },
        old_delThis(index) {
            this.oldTable.productList.splice(index, 1);
        },
        old_addOne() {
            this.oldTable.productList.push({
                content: "",
                name: "",
                unit: "",
                number: "",
                remark: ""
            });
        },
        thisTab(index) {
            this.tableIndex = index;
        },
        workOrder_add() {
            this.workOrder.productList.push({
                name: "",
                unit: "",
                number: ""
            });
        },
        workOrder_del(index) {
            this.workOrder.productList.splice(index, 1);
        },
        feedBack_add() {
            this.feedBack.productList.push({
                name: "",
                unit: "",
                number: ""
            });
        },
        feedBack_del(index) {
            this.feedBack.productList.splice(index, 1);
        },
        queryPersonByDept_() {
            let that = this;
            queryPersonByDept({
                id: "" + that.deptId
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
                    that.workers = data || [];

                }
            })
        },
        selectThisWorker(val) {
            this.workOrder.doer = val.ID;
            this.oldTable.doer = val.ID;
            this.workOrder.doerName = val.NAME;
            this.oldTable.doerName = val.NAME;
            this.colseFlag = false;
        },
        getWorkers(val) {
            this.colseFlag = true;
            this.queryPersonByDept_();
        },
        hiddenSaveModel(val) {
            this.save_model.toggleShowModel = false;
        },
        saveOrUpdateWorkorder_(formData_) {
            let that = this;
            saveOrUpdateWorkorder(formData_).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`;
                    return;
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!");
                    return;
                }
                that.save_model.toggleShowModel = true;
                that.save_model.save_flag = (res.status == 1);
                that.save_model.save_msg = res.msg;
                if (res.status == 1) {
                    let {
                        data
                    } = res;
                    that.haveDispatch = 'true';
                    sessionStorage.setItem("haveDispatch", 'true');
                    that.workOrder.orderTime = data.dispatchTime || "";
                    that.workOrder.orderNum = data.orderCode || "";
                    that.oldTable.time = data.dispatchTime || "";
                }
            })
        },
        getOrderInputs() {
            let that = this;
            let temp_list = that.workOrder.productList;
            let temp_arr = [];
            if (temp_list.length > 0) {
                for (let i = 0; i < temp_list.length; i++) {
                    let temp_name = "name" + (i + 1);
                    let temp_unit = "unit" + (i + 1);
                    let temp_number = "number" + (i + 1);
                    let temp_name_ = that.$refs[temp_name][0].value;
                    let temp_unit_ = that.$refs[temp_unit][0].value;
                    let temp_number_ = that.$refs[temp_number][0].value;
                    temp_arr.push({
                        "name": "" + temp_name_,
                        "unit": "" + temp_unit_,
                        "num": "" + temp_number_,
                        "content": "",
                        "remark": ""
                    })
                }
            }
            return temp_arr
        },
        dispatch_() {
            let that = this;
            if (this.workOrder.address == "" || this.workOrder.hurrySelect == "" || this.workOrder.typeSelect == "" || this.workOrder.doerName == "" || this.workOrder.repireContent == "" || this.workOrder.orderAdvice == "") {
                this.$message.error("请把基本填写完整!")
                return
            }
            let temp_arr = this.getOrderInputs();
            let formData_ = new FormData();
            formData_.append("questionId", that.id);
            formData_.append("checkAddr", that.workOrder.address);
            formData_.append("lastHandleTime", that.workOrder.lastDoTime);
            formData_.append("lev", that.workOrder.hurrySelect);
            formData_.append("orderType", that.workOrder.typeSelect);
            formData_.append("handleUser", that.workOrder.doer);
            formData_.append("checkContent", that.workOrder.repireContent);
            formData_.append("materialArr", JSON.stringify(temp_arr));
            formData_.append("dispatchAdvice", that.workOrder.orderAdvice);
            formData_.append("orderStatus", "1");
            formData_.append("proFrom", "3");
            this.saveOrUpdateWorkorder_(formData_);
        },
        getOld_OrderInputs() {
            let that = this;
            let temp_list = that.oldTable.productList;
            let temp_arr = [];
            if (temp_list.length > 0) {
                for (let i = 0; i < temp_list.length; i++) {
                    let temp_content = "content_old" + (i + 1);
                    let temp_name = "name_old" + (i + 1);
                    let temp_unit = "unit_old" + (i + 1);
                    let temp_num = "num_old" + (i + 1);
                    let temp_remark = "remark_old" + (i + 1);
                    let temp_content_ = that.$refs[temp_content][0].value;
                    let temp_name_ = that.$refs[temp_name][0].value;
                    let temp_unit_ = that.$refs[temp_unit][0].value;
                    let temp_num_ = that.$refs[temp_num][0].value;
                    let temp_remark_ = that.$refs[temp_remark][0].value;

                    temp_arr.push({
                        "name": "" + temp_name_,
                        "unit": "" + temp_unit_,
                        "num": "" + temp_num_,
                        "content": "" + temp_content_,
                        "remark": "" + temp_remark_
                    })
                }
            }
            return temp_arr
        },
        dispatch_old() {
            let that = this;
            if (this.oldTable.hurrySelect == "" || this.oldTable.attendance == "" || this.oldTable.doerName == "") {
                this.$message.error("请把基本填写完整!")
                return
            }
            let formData_ = new FormData();
            let temp_arr = this.getOld_OrderInputs();
            formData_.append("questionId", that.id);
            formData_.append("lev", that.oldTable.hurrySelect);
            formData_.append("handleUser", that.oldTable.doer);
            formData_.append("checkContent", that.oldTable.attendance);
            formData_.append("materialArr", JSON.stringify(temp_arr));
            formData_.append("orderStatus", "1");
            formData_.append("proFrom", "3");
            this.saveOrUpdateWorkorder_(formData_);
        },
        dispatch_feedBack() {

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
            post_formdata.append("files", temp_file)
            saveOrUpdateWorkorder(formData_).then(res => {
                that.save_model.toggleShowModel = true;
                that.save_model.save_flag = (res.status == 1);
                that.save_model.save_msg = res.msg;
            })

        }

    },
    created() {
        let temp_id = this.$route.params.id;
        this.id = temp_id;
        this.tableType = this.$route.params.tableType;
        if (this.tableType == 0) {
            this.tabs = [{
                name: "原有工单"
            }]
        } else {
            this.tabs = [{
                name: "标准工单"
            }]
        }
        this.deptId = this.$store.getters.get_deptId;
        this.filePath = this.$store.getters.get_filePath;
        this.haveDispatch = sessionStorage.getItem("haveDispatch") || "false";
        this.oldTable.user = this.workOrder.orderer = this.$store.getters.getUserName;
        this.oldTable.tel = this.$store.getters.get_tel;
        this.workOrder.orderDept = this.workOrder.repairDept = this.$store.getters.get_dept;
        this.companyName = this.$store.getters.getCompyName;
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
                case "0":
                    temp = "暗漏";
                    break;
                case "1":
                    temp = "爆管";
                    break;
                case "2":
                    temp = "管网占压";
                    break;
                case "3":
                    temp = "附属设备问题";
                    break;
                case "4":
                    temp = "检查井问题";
                    break;
                case "5":
                    temp = "其他";
                    break;
            }
            return temp;
        }
    }
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

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

#dispatch {
    width: 100%;
    height: 100%;
    background: #ccc;

    .row.first {
        width: 100%;
        height: 40px;
        background: #ccc;
        display: flex;
        justify-content: space-between;
        position: relative;
        font-size: 14px;

        span {
            display: inline-block;
            padding: 10px 15px;
            position: absolute;
            bottom: 0;
            background: #0b83fe;
            color: #fff;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            cursor: pointer;

            &:first-child {
                left: 20px;
            }

            &:last-child {
                right: 20px;
                padding: 5px 15px;
                background: #ff8901;
            }
        }
    }

    .row.last {
        width: 100%;
        height: 30px;
        padding: 0 20px;
        background: #cafafc;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .tabs {
            width: 150px;
            height: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            color: #333;
            font-weight: 600;
            font-size: 16px;

            .tab-item {
                height: 100%;
                line-height: 30px;
                cursor: pointer;

                &.active {
                    color: red;
                    border-bottom: 2px solid red;
                }
            }
        }

        .actions {
            // width: 200px;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
                display: inline-block;
                width: 70px;
                line-height: 25px;
                background: #0b83fe;
                border-radius: 5px;
                cursor: pointer;
                color: #fff;
                text-align: center;
                margin-right: 20px;
            }

            div {
                width: 80px;
                height: 25px;
                position: relative;
                margin-right: 20px;

                span {
                    width: 100%;
                    margin-right: 0px;

                    &.gray {
                        background: gray;
                        cursor: not-allowed;
                    }
                }

                input {
                    width: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    opacity: 0;
                }
            }
        }
    }

    .tables {
        width: 100%;
        height: calc(100% - 80px);
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
                            min-height: 40px;
                            line-height: 40px;
                            text-align: center;
                            border-right: 1px solid #ccc;
                            text-align: center;

                            &.sm {
                                width: 80px;
                            }

                            .inLine {
                                width: calc(100% - 76px);
                                display: inline-block;
                            }

                            &.lang {
                                width: 140px;
                            }

                            &.middle {
                                width: 100px;
                            }

                            &.largeText {
                                padding: 0 5px;
                                position: relative;

                                .limitText {
                                    position: absolute;
                                    bottom: 10px;
                                    right: 10px;
                                }

                                textarea {
                                    margin-top: 10px;
                                    height: 50px;
                                    resize: none;
                                }
                            }

                            &.addCol {
                                span {
                                    padding: 0 5px;
                                    line-height: 20px;
                                    border: 1px solid blue;
                                    border-radius: 5px;
                                    cursor: pointer;
                                }
                            }

                            &.del {
                                color: #333;
                                font-size: 12px;

                                span {
                                    padding: 0 5px;
                                    line-height: 20px;
                                    border: 1px solid blue;
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
</style>
