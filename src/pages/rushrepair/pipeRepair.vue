<template>
<div id="pipeRepair">
    <div class="topHead">
        <div class="tabs">
            <span class="tabItem" :class="{actived:index==main_selectTab}" @click="showThisTab(index)" v-for="(item,index) in maintabs" :key="index">
                {{item.name}}
            </span>
        </div>
        <span class="goback" @click="goBack">返回</span>
    </div>
    <div class="main">
        <template v-if="main_selectTab==0">
            <div class="repairMsg">
                <div class="topHead">
                    <div class="col">
                        <span class="rect"></span>
                        <span>检修基本信息</span>
                    </div>
                    <div class="col">
                    </div>
                </div>
                <div class="tableContent">
                    <div class="row">
                        <div class="col"><span>抢修单号</span></div>
                        <div class="col"><span>{{reapirMsg.orderCode}}</span></div>
                        <div class="col"><span>检修类型</span></div>
                        <div class="col"><span>{{reapirMsg.orderType|formateRepairType}}</span></div>
                    </div>
                    <div class="row">
                        <div class="col"><span>紧急程度</span></div>
                        <div class="col">
                            <span>{{reapirMsg.lev|formate_lev}}</span>
                        </div>
                        <div class="col"><span>检修内容</span></div>
                        <div class="col"><span>{{reapirMsg.checkContent}}</span></div>
                    </div>
                    <div class="row">
                        <div class="col"><span>上报人</span></div>
                        <div class="col"><span>{{reapirMsg.proUser}}</span></div>
                        <div class="col"><span>地址</span></div>
                        <div class="col"><span>{{reapirMsg.checkAddr}}</span></div>
                    </div>
                    <div class="row">
                        <div class="col"><span>派发部门</span></div>
                        <div class="col"><span>{{reapirMsg.dispatchDept}}</span></div>
                        <div class="col"><span>派发人</span></div>
                        <div class="col"><span>{{reapirMsg.dispatchUser}}</span></div>
                    </div>
                    <div class="row">
                        <div class="col"><span>派发时间</span></div>
                        <div class="col"><span>{{reapirMsg.dispatchTime}}</span></div>
                        <div class="col"><span>派发意见</span></div>
                        <div class="col"><span>{{reapirMsg.dispatchAdvice}}</span></div>
                    </div>
                    <div class="row">
                        <div class="col"><span>处理时间</span></div>
                        <div class="col"><span>{{reapirMsg.handleTime}}</span></div>
                        <div class="col"><span>附件</span></div>
                        <div class="col">
                            <div id="fileItem" v-for="(item,index) in reapirMsg.fileList" :key="index">
                                <template v-if="item.fileType==='png'||item.fileType==='jpg'||item.fileType==='jpeg'">
                                    <img src="../../assets/images/common/png.png" :alt="item.fileName" :title="item.fileName" @click="downloadFile(item.filePath)">
                                </template>
                                <template v-if="item.filePath==='pdf'">
                                    <img src="../../assets/images/common/pdf.png" :alt="item.fileName" :title="item.fileName" @click="downloadFile(item.filePath)">
                                </template>
                                <template v-if="item.filePath==='word'">
                                    <img src="../../assets/images/common/word.png" :alt="item.fileName" :title="item.fileName" @click="downloadFile(item.filePath)">
                                </template>
                                <template v-if="item.filePath==='xls'||item.filePath==='xlsx'">
                                    <img src="../../assets/images/common/excel.png" :alt="item.fileName" :title="item.fileName" @click="downloadFile(item.filePath)">
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col"><span>处理人</span></div>
                        <div class="col"><span>{{reapirMsg.handleUser}}</span></div>
                        <div class="col"><span>状态</span></div>
                        <div class="col">
                            <span>{{reapirMsg.orderStatus|formate_orderStatus}}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col"><span>处理意见</span></div>
                        <div class="col"><span>{{reapirMsg.handleProposal}}</span></div>
                        <div class="col"><span>审核意见</span></div>
                        <div class="col"><span>{{reapirMsg.auditAdvice}}</span></div>
                    </div>
                </div>
                <div class="trace">
                    <div class="tophead">
                        <span class="rect"></span>
                        <span>检修追踪</span>
                    </div>
                    <div class="timeLine">
                        <div class="wrapLine">
                            <template v-for="(item,index) in repairMsgList">
                                <div class="timeItem"  v-if="item.status!='3'&&item.status!='6'"  :key="index">
                                    <div>
                                        <span>{{item.status|formate_orderStatus}}</span>
                                    </div>
                                    <div class="circle">
                                        <i class="el-icon-success"></i>
                                    </div>
                                    <div class="littleTip" v-if="item.status==3">
                                        <span>正在{{item.name}}</span>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="cards">
                            <template v-for="(item,index) in repairMsgList" >
                                <div class="cardItem" v-if="item.status!='3'&&item.status!='6'" :key="index">
                                    <div class="innerWrap">
                                        <div class="tips">
                                            <span>{{item.deptName}}-{{item.userName}}-在{{item.happendTime}}进行了{{item.status|farmateStatus}}操作</span>
                                        </div>
                                        <div class="imgs">
                                            <img :src="filePath+''+v.fileCompress" alt="" v-for="(v,i) in item.fileList" :key="i">
                                    </div>
                                        </div>
                                    </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="main_selectTab==1">
            <div class="table-msg">
                <div class="top-head">
                    <div class="subTabs">
                        <span class="subItem" @click="showThis(index)" :class="{actived:msg_tabItem==index}" v-for="(item,index) in msg_tabs" :key="index">
                            {{item.name}}
                        </span>
                    </div>
                    <div class="actions">
                        <template v-if="show_feedBack>=4">
                            <template v-if="orderStatus=='4'||orderStatus=='3'">
                                <span @click="feedback_table('feedback')" :class="{notAllow:common_dispatch.feedback}">反馈</span>
                            </template>
                        </template>
                        <template v-else>
                            <template v-if="orderStatus=='3'">
                                <template v-if="dispatchFlag==false">
                                        <span @click="dispatch_new">派发</span>
                                </template>
                                <template v-else>
                                    <span class="finish">派发完成</span>
                                </template>
                            </template>
                        </template>

                        <span @click="exportPdf">导出</span>
                        <span @click="print">打印</span>
                        <template v-if="(orderStatus=='4'||orderStatus=='3')&&dispatchStatus=='false'">
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
                    </div>
                </div>
                <template v-if="msg_tabItem==0">
                    <!-- 标准工单 有拒绝的情况下需要重新派单 -->
                    <template v-if="orderStatus=='3'">
                        <div class="tables">
                            <div class=" table-item ">
                                <div class="inner-wrap">
                                    <div class="mainHead">
                                        <span>{{workOrder.orgName}}检修派工单</span>
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
                                            <td :title="workOrder.address"> <span>{{workOrder.address}}</span> </td>
                                            <td><span>最迟处理时间</span></td>
                                            <td>
                                                <span>{{workOrder.lastDoTime}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><span>紧急程度</span></td>
                                            <td>
                                                <span>{{workOrder.hurrySelect|formate_lev}}</span>
                                            </td>
                                            <td><span>检修类型</span></td>
                                            <td>
                                                <span>{{workOrder.typeSelect|formateRepairType}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><span>上报人</span></td>
                                            <td> <span>{{workOrder.reporter}}</span></td>
                                            <td><span>联系电话</span></td>
                                            <td> <span>{{workOrder.contacts}}</span></td>
                                        </tr>
                                        <tr>
                                            <td><span>派单人</span></td>
                                            <td>{{workOrder.orderer}}</td>
                                            <td><span>处理人</span></td>
                                            <td class="getWorker">
                                                <template v-if="refuse_name_flag==false">
                                                    <input type="text" placeholder="处理人" v-model="workOrder.doerName" @focus="getWorkers">
                                                    <div class="subLists" v-if="workers.length&&colseFlag">
                                                        <div class="listItem" v-for="(item,index) in workers" :key="index" @click="selectThisWorker(item)">
                                                            {{item.NAME}}
                                                        </div>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <span>{{workOrder.doerName}}</span>
                                                </template>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><span>隐患描述</span></td>
                                            <td colspan="3" :title="workOrder.dangerDesc"><span class="alignLeft">{{workOrder.dangerDesc}}</span> </td>
                                        </tr>
                                        <tr>
                                            <td><span>检修内容</span></td>
                                            <td colspan="3" :title="workOrder.repireContent"> <span class="alignLeft">{{workOrder.repireContent}}</span></td>
                                        </tr>
                                        <tr>
                                            <td :rowspan="workOrder.productList.length+1"><span>材料清单</span></td>
                                            <td><span>材料名称</span></td>
                                            <td><span>单位</span></td>
                                            <td><span>数量</span></td>
                                        </tr>
                                        <tr v-for="(item,index) in workOrder.productList" :key="index">
                                            <td><span>{{item.materialName}}</span></td>
                                            <td><span>{{item.materialUnit}}</span></td>
                                            <td> <span>{{item.materialNum}}</span> </td>
                                        </tr>
                                        <tr>
                                            <td><span>派发意见</span></td>
                                            <td colspan="3" :title="workOrder.orderAdvice"> <span class="alignLeft">{{workOrder.orderAdvice}}</span></td>
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
                    <!-- 标准工单 在接单并执行的途中 -->
                    <template v-else>
                        <div class="tables">
                            <div class=" table-item ">
                                <div class="inner-wrap">
                                    <div class="mainHead">
                                        <span>{{workOrder.orgName}}检修派工单</span>
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
                                            <td :title="workOrder.address"> <span>{{workOrder.address}}</span> </td>
                                            <td><span>最迟处理时间</span></td>
                                            <td>
                                                <span>{{workOrder.lastDoTime}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><span>紧急程度</span></td>
                                            <td>
                                                <span>{{workOrder.hurrySelect|formate_lev}}</span>
                                            </td>
                                            <td><span>检修类型</span></td>
                                            <td>
                                                <span>{{workOrder.typeSelect|formateRepairType}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><span>上报人</span></td>
                                            <td> <span>{{workOrder.reporter}}</span></td>
                                            <td><span>联系电话</span></td>
                                            <td> <span>{{workOrder.contacts}}</span></td>
                                        </tr>
                                        <tr>
                                            <td><span>派单人</span></td>
                                            <td>{{workOrder.orderer}}</td>
                                            <td><span>处理人</span></td>
                                            <td> <span>{{workOrder.doer}}</span></td>
                                        </tr>
                                        <tr>
                                            <td><span>隐患描述</span></td>
                                            <td colspan="3" :title="workOrder.dangerDesc"><span class="alignLeft">{{workOrder.dangerDesc}}</span> </td>
                                        </tr>
                                        <tr>
                                            <td><span>检修内容</span></td>
                                            <td colspan="3" :title="workOrder.repireContent"> <span class="alignLeft">{{workOrder.repireContent}}</span></td>
                                        </tr>
                                        <tr>
                                            <td :rowspan="workOrder.productList.length+1"><span>材料清单</span></td>
                                            <td><span>材料名称</span></td>
                                            <td><span>单位</span></td>
                                            <td><span>数量</span></td>
                                        </tr>
                                        <tr v-for="(item,index) in workOrder.productList" :key="index">
                                            <td><span>{{item.materialName}}</span></td>
                                            <td><span>{{item.materialUnit}}</span></td>
                                            <td> <span>{{item.materialNum}}</span> </td>
                                        </tr>
                                        <tr>
                                            <td><span>派发意见</span></td>
                                            <td colspan="3" :title="workOrder.orderAdvice"> <span class="alignLeft">{{workOrder.orderAdvice}}</span></td>
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
                <template v-if="msg_tabItem==1&&show_feedBack>=4">
                    <!-- 标准反馈单 在查看的状态 -->
                    <template v-if="orderStatus!='4'">
                        <div class="tables">
                            <div class="table-item right-table">
                                <div class="inner-wrap">
                                    <div class="mainHead">
                                        <span>{{feedBack.orgName}}反馈单</span>
                                    </div>
                                    <div class="subHead">
                                        <div class="col">
                                            <span>检修单号:</span>
                                            <span>{{feedBack.orderNum}}</span>
                                        </div>
                                        <div class="col">
                                            <span>反馈时间:</span>
                                            <span>{{feedBack.feedBackTime}}</span>
                                        </div>
                                    </div>
                                    <table>
                                        <tr>
                                            <td><span>检修地点</span></td>
                                            <td>
                                                <span :title="feedBack.address">{{feedBack.address}}</span>
                                            </td>
                                            <td><span>最迟处理时间</span></td>
                                            <td>
                                                <span>{{feedBack.lastDoTime}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><span>紧急程度</span></td>
                                            <td>
                                                <span>{{feedBack.hurrySelect|formate_lev}}</span>
                                            </td>
                                            <td><span>检修类型</span></td>
                                            <td>
                                                <span>{{feedBack.typeSelect|formateRepairType}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td rowspan="3"><span>检修报告</span></td>
                                            <td colspan="3">
                                                <span :title="feedBack.reason" class="alignLeft">原因分析:{{feedBack.reason}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="3">
                                                <span :title="feedBack.handleResult" class="alignLeft">处理结果:{{feedBack.handleResult}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="3">
                                                <span :title="feedBack.suggestion" class="alignLeft">相关建议:{{feedBack.suggestion}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td :rowspan="feedBack.productList.length+1"><span>材料清单</span></td>
                                            <td><span>材料名称</span></td>
                                            <td><span>单位</span></td>
                                            <td><span>数量</span></td>
                                        </tr>
                                        <tr v-for="(item,index) in feedBack.productList" :key="index">
                                            <td><span>{{item.name}}</span></td>
                                            <td><span>{{item.unit}}</span></td>
                                            <td><span>{{item.number}}</span></td>
                                        </tr>
                                        <tr>
                                            <td><span>检修评价</span></td>
                                            <td colspan="3" :title="feedBack.checkAdvice">
                                                <span class="alignLeft">{{feedBack.checkAdvice}}</span>
                                            </td>
                                        </tr>
                                        <tr class="noBorder">
                                            <td colspan="2"><span>检修部门:{{feedBack.repairDept}}</span></td>
                                            <td colspan="2"><span>验收部门:</span></td>
                                        </tr>
                                        <tr class="noBorder">
                                            <td colspan="2"><span>签字:</span></td>
                                            <td colspan="2"><span>签字:</span></td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </template>
                     <!-- 反馈单正在填写的过程中 -->
                    <template v-else>
                        <div class="tables">
                            <div class="table-item right-table">
                                <div class="inner-wrap">
                                    <div class="mainHead">
                                        <span>{{feedBack.orgName}}反馈单</span>
                                    </div>
                                    <div class="subHead">
                                        <div class="col">
                                            <span>检修单号:</span>
                                            <span>{{feedBack.orderNum}}</span>
                                        </div>
                                        <div class="col">
                                            <span>反馈时间:</span>
                                            <span>{{feedBack.feedBackTime}}</span>
                                        </div>
                                    </div>
                                    <table>
                                        <tr>
                                            <td><span>检修地点</span></td>
                                            <td><input type="text" v-model="feedBack.address" placeholder="请输入检修地点"></td>
                                            <td><span>最迟处理时间</span></td>
                                            <td colspan="2">
                                                <span>{{feedBack.lastDoTime}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><span>紧急程度</span></td>
                                            <td>
                                                <span>{{feedBack.hurrySelect|formate_lev}}</span>
                                            </td>
                                            <td><span>检修类型</span></td>
                                            <td colspan="2">
                                                <span>{{feedBack.typeSelect|formateRepairType}}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td rowspan="3"><span>检修报告</span></td>
                                            <td colspan="4"><span class="inline-sm">原因分析:</span> <input class="inLine" v-model="feedBack.reason"  placeholder="请输入原因分析" type="text"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="4"><span class="inline-sm">处理结果:</span> <input class="inLine" v-model="feedBack.handleResult" placeholder="请输入处理结果" type="text"> </td>
                                        </tr>
                                        <tr>
                                            <td colspan="4"><span class="inline-sm">相关建议:</span> <input class="inLine" v-model="feedBack.suggestion"  placeholder="请输入相关建议" type="text"></td>
                                        </tr>
                                        <tr>
                                            <td :rowspan="feedBack.productList.length+2"><span>材料清单</span></td>
                                            <td><span>材料名称</span></td>
                                            <td><span>单位</span></td>
                                            <td><span>数量</span></td>
                                            <td><span>操作</span></td>
                                        </tr>
                                        <tr v-for="(item,index) in feedBack.productList" :key="index">

                                            <td><input  v-model="item.name"  type="text" placeholder="材料名称" ></td>
                                            <td><input   v-model="item.unit"  type="text" placeholder="单位"></td>
                                            <td><input   v-model="item.number"  type="text" placeholder="数量" ></td>
                                            <td class="del"><span  class="btn-del" @click="feedBack_del(index)">删除</span></td>
                                        </tr>
                                        <tr>
                                            <td colspan="4" class="addCol"><span class="btn-add" @click='feedBack_add'>新增</span></td>
                                        </tr>
                                        <tr>
                                            <td><span>检修评价</span></td>
                                            <td colspan="4"><input type="text" placeholder="请输入评价结果"  v-model="feedBack.checkAdvice" ></td>
                                        </tr>
                                        <tr class="noBorder">
                                            <td colspan="2"><span>检修部门:{{feedBack.repairDept}}</span></td>
                                            <td colspan="3"><span>验收部门:</span></td>
                                        </tr>
                                        <tr class="noBorder">
                                            <td colspan="2"><span>签字:</span></td>
                                            <td colspan="3"><span>签字:</span></td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
            </div>
        </template>
    </div>
    <info-model :showViewModel="showInfoModel" :title="'通知'" @hiddenSelf="hiddenInfoModel">
        <div class="notice">
            <div class="subContent">
                <span>gbndsjkgbndsjkbnk</span>
            </div>
            <div class="footer">
                <span class="cancel">取消</span>
                <span class="send">发送</span>
                <span class="edit" @click="gotoEdit">编辑</span>
            </div>
        </div>
    </info-model>
    <save-model :showModel="save_model.toggleShowModel" :type="true" :flag="save_model.save_flag" :content="save_model.save_msg" @delThis="hiddenSaveModel"></save-model>
</div>
</template>

<script>
import saveModel from "@/common/components/poupe/save_status"

import infoModel from '@/common/components/poupe/view'
import gisTools from '@/common/components/gis_units/tools'
import {
    getWorkorderDetail,
    getOrderFlow,
    saveOrUpdateWorkorder
} from "@/api/rushrepair/pipeRepair"

import {
    queryPersonByDept,
    expWorkWorder2xls
} from "@/api/rushrepair/workOrder"

import {
    uploadFiles
} from "@/api/common/upload"
export default {
    components: {
        infoModel,
        gisTools,
        saveModel
    },
    data() {
        return {
            id: "", //工单id
            orderStatus: "", // 订单状态
            dispatchStatus: 'false', //订单提交状态
            maintabs: [{ //主切换tab
                    name: "检修信息"
                },
                {
                    name: "工单信息"
                }
            ],
            filePath: "", //静态文件的前缀域名
            main_selectTab: null, //显示工单 原有工单和标准工单  默认是原有工单
            tableShow: true, //右边小窗口的开关
            showInfoModel: false, //显示停水通知的开关
            msg_tabs: [], // 标准工单和反馈单的页签
            msg_tabItem: 0, // 工单信息下的 激活状态下的tab
            reapirMsg: { // 检修信息

            },
            common_dispatch:{
                feedback:false
            },
            workOrder: {
                id: "", //派单ID
                orgName: '', //组织结构名字
                doerName:"", //处理人的名字
                orderNum: "", //工单单号
                orderTime: "", // 派单时间
                lastDoTime: "", //最近处理时间
                address: "", //检修地点
                hurrySelect: "",
                typeSelect: "",
                reporter: "", //上报人
                contacts: "", //联系电话
                orderer: "", //派单人
                doer: "", // 处理人
                dangerDesc: "", // 隐患描述
                repireContent: "", // 检修内容
                productList: [], // 材料
                orderAdvice: "", //派发意见
                orderDept: "", //派发部门
                repairDept: "", //处理部门
            },
            feedBack: {
                id: "", //派单ID
                orgName: "", //组织名字
                orderNum: "", //工单单号
                feedBackTime: "", // 派单时间
                lastDoTime: "", //最近处理时间
                address: "", //检修地点
                hurrySelect: "",
                typeSelect: "",
                result: "",
                advise: "",
                productList: [{
                        "name": "",
                        "unit": "",
                        "number": "",
                        "content": "",
                        "remark": ""
                    },
                    {
                        "name": "",
                        "unit": "",
                        "number": "",
                        "content": "",
                        "remark": ""
                    },
                    {
                        "name": "",
                        "unit": "",
                        "number": "",
                        "content": "",
                        "remark": ""
                    }
                ],
                reporter: "", //上报人
                contacts: "", //联系电话
                orderer: "", //派单人
                doer: "", // 处理人
                dangerDesc: "", // 隐患描述
                repireContent: "", // 检修内容
                orderAdvice: "", //派发意见
                orderDept: "", //派发部门
                repairDept: "", //处理部门
                handleResult: "", //处理结果
                reason: "", //原因分析
                suggestion: "", //相关建议
                checkAdvice: "", // 检修评价
            },
            repairMsgList: [], //流程图
            save_model: {
                toggleShowModel: false,
                save_flag: false,
                save_msg: ""
            },
            workers: [],
            workerName: "",
            colseFlag: true,
            show_feedBack: "", //是否显示 反馈单  当 处理完成 才能反馈
            dispatchFlag: false, //拒绝后重新选人
            deptId: "", // 部门ID
            dispatch_id: "", //派单的Id
            refuse_name_flag: false, //重新派单后的重置 样式
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
            this.$store.commit("setAside_status", true);
            this.$emit("showAside");
        },
        hiddenSaveModel(val) {
            this.save_model.toggleShowModel = false;
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
            // this.sub_msg_tabIndex= index;

        },
        feedBack_add() {
            this.feedBack.productList.push({
                "name": "",
                "unit": "",
                "number": "",
                "content": "",
                "remark": ""
            });
        },
        feedBack_del(index) {
            this.feedBack.productList.splice(index, 1);
        },
        gotoEdit() {
            this.$router.push({
                name: "pipe_rushrepair_edit"
            });
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
        print() {
            let that = this
            let activedTab = this.msg_tabItem;
            if (activedTab == 0) {
                let temp_workOrder = this.formate_products(that.workOrder.productList);
                let type = this.workOrder.typeSelect;
                let temp_type = null;
                let list = dse.problem_type;
                for(let i =0;i<list.length;i++){
                    if(list[i].value===type){
                        temp_type = list[i].label
                    }
                }
                let temp_data = {
                    orgName: this.orgName,
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
                    doerName: this.workOrder.doer,
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
            } else {
                let temp_feedBack = this.feedBack.productList;
                let temp_arr = [];
                for (let i = 0; i < temp_feedBack.length; i++) {
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
                let type = this.feedBack.typeSelect;
                let temp_type = null;
                 let list = dse.problem_type;
                for(let i =0;i<list.length;i++){
                    if(list[i].value===type){
                        temp_type = list[i].label
                    }
                }
                let temp_data = {
                    orgName: this.feedBack.orgName,
                    orderNum: this.feedBack.orderNum,
                    feedBackTime: this.feedBack.feedBackTime,
                    address: this.feedBack.address,
                    lastDoTime: this.feedBack.lastDoTime,
                    hurrySelect: this.feedBack.hurrySelect == "0" ? "紧急" : (this.feedBack.hurrySelect == "1" ? "较急" : "一般"),
                    typeSelect: temp_type,
                    reason: this.feedBack.reason,
                    handleResult: this.feedBack.handleResult,
                    suggestion: this.feedBack.suggestion,
                    productList: temp_arr,
                    checkAdvice: this.feedBack.checkAdvice,
                    repairDept: this.feedBack.repairDept,
                    orderDept: this.feedBack.orderDept
                }
                sessionStorage.setItem("tableContent", JSON.stringify(temp_data));
                let pageUrl = dse.static_baseUrl + "/tables/feedback.html";
                window.open(pageUrl);
            }
        },
        exportPdf() {
            let that = this;
            let temp_id = this.id;
            let len = this.msg_tabs.length;
            let type = "1";
            if(len==2){
                type = "2"
            }
            this.expWorkWorder2xls_(temp_id,type)
        },
        formate_arr(arr) {
            let temp_arr = arr;
            let temp_json = {
                type0: [],
                type1: []
            }
            if (temp_arr.length > 0) {
                for (let i = 0; i < temp_arr.length; i++) {
                    if (temp_arr[i].type == "0") {
                        temp_json.type0.push(temp_arr[i])
                    } else {
                        temp_json.type1.push(temp_arr[i])
                    }
                }
            }
            return temp_json;
        },
        formate_feedback_material(arr){
            let temp_arr = arr&&arr.length>0?arr:[]
            let temp_list = []
            for(let i=0;i<temp_arr.length;i++){
                let temp_json = {}
                temp_json.name = temp_arr[i].materialName
                temp_json.unit = temp_arr[i].materialUnit
                temp_json.number = temp_arr[i].materialNum
                temp_list.push(temp_json)
            }
            return temp_list
        },
        getWorkorderDetail_(id) {
            let that = this;
            getWorkorderDetail({
                id: "" + id
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

                    that.dispatch_id = res.data.id;

                    that.reapirMsg = data;
                    that.workOrder.orgName = that.feedBack.orgName = data.organizationName;
                    that.workOrder.id = that.feedBack.id = data.id;
                    that.orderStatus = data.orderStatus; //派单状态
                    that.workOrder.reporter = data.proUser;
                    that.workOrder.orderNum = that.feedBack.orderNum = data.orderCode; // 单号
                    that.workOrder.orderTime = data.dispatchTime; //单号时间
                    that.feedBack.feedBackTime = data.finishTime; // 反馈时间
                    that.workOrder.lastDoTime = that.feedBack.lastDoTime = data.lastHandleTime; // 最迟处理时间
                    that.workOrder.address = that.feedBack.address = data.checkAddr; // 地址
                    that.workOrder.hurrySelect = that.feedBack.hurrySelect = data.lev; // 紧急程度
                    that.workOrder.contacts = data.mobile; // 派单人手机号
                    that.workOrder.dangerDesc = data.proDescrip; // 问题描述
                    that.workOrder.typeSelect = that.feedBack.typeSelect = data.orderType; // 问题类型
                    that.workOrder.orderer = that.feedBack.orderer = data.dispatchUser; //  派单人
                    that.workOrder.repireContent = that.feedBack.repireContent = data.checkContent; // 检修内容
                    that.workOrder.orderDept = that.feedBack.orderDept = data.dispatchDept; //  派单部门
                    that.workOrder.orderAdvice = data.dispatchAdvice;
                    that.workOrder.repairDept = that.feedBack.repairDept = data.dispatchDept; // 处理部门

                    that.workOrder.doer = data.handleUser; //处理人
                    let materialList = this.formate_arr(data.materialList);
          
                    that.workOrder.productList = materialList.type0; // 材料清单

                    if (data.orderStatus != "4") {
                        that.feedBack.productList = that.formate_feedback_material(materialList.type1);
                        that.feedBack.reason = data.reason;
                        that.feedBack.handleResult = data.reason;
                        that.feedBack.handleResult = data.handleResult;
                        that.feedBack.suggestion = data.suggestion;
                        that.feedBack.checkAdvice = data.auditAdvice;
                    }else{
                         that.feedBack.productList = that.formate_feedback_material(data.materialList)
                    }
                }
            })
        },
        getOrderFlow_(id) {
            let that = this;
            getOrderFlow({
                orderId: "" + id
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
                    that.repairMsgList = data;
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
        getFeedbackInputs() {
            let that = this;
            let temp_list = that.feedBack.productList;
            let temp_arr = [];
            if (temp_list.length > 0) {
                for (let i = 0; i < temp_list.length; i++) {
                    temp_arr.push({
                        "name": "" + temp_list[i].name,
                        "unit": "" + temp_list[i].unit,
                        "num": "" + temp_list[i].number,
                        "content": "",
                        "remark": ""
                    })
                }
            }
            return temp_arr
        },
        saveOrUpdateWorkorder_(data,str) {
            let that = this;
            saveOrUpdateWorkorder(data).then(res => {
                that.save_model.toggleShowModel = true;
                that.save_model.save_flag = (res.status == 1);
                that.save_model.save_msg = res.msg;
                that.dispatchStatus = 'true';
                sessionStorage.setItem("dispatchFlag", 'true');

                if(res.status==1){
                    that.common_dispatch.feedback = true;
                    that.orderStatus = '5'
                }
                let temp_arr = JSON.parse(res.data.materialArr);
                let temp_getList = []
                if(res.data&&res.data.materialList&&res.data.materialList.length>0){
                     for (let i = 0; i < temp_arr.length; i++) {
                        let temp_json = {}
                        temp_json.workContent = temp_arr[i].content
                        temp_json.materialName = temp_arr[i].name
                        temp_json.materialUnit = temp_arr[i].unit
                        temp_json.materialNum = temp_arr[i].num
                        temp_json.remark = temp_arr[i].remark
                        temp_getList.push(temp_json)
                    }
                }
               that.workOrder.productList = that.feedBack.productList = temp_getList;
               let flag= that.msg_tabItem
               if (flag== 0) {
                   that.workOrder.id = data.id;
               } else {
                   that.feedBack.id = data.id;
               }

            })
        },
        get_feedBackData() {
            let that = this;
            let temp_arr = this.getFeedbackInputs();
            let temp_data = new FormData();
            temp_data.append("id", that.id);
            // temp_data.append("lev", that.feedBack.hurrySelect);
            // temp_data.append("orderType", that.feedBack.typeSelect);
            temp_data.append("reason", that.feedBack.reason);
            temp_data.append("handleResult", that.feedBack.handleResult);
            temp_data.append("suggestion", that.feedBack.suggestion);
            temp_data.append("materialArr", JSON.stringify(temp_arr));
            temp_data.append("auditAdvice", that.feedBack.checkAdvice);
            temp_data.append("orderStatus", "5");
            return temp_data;
        },
        feedback_table(str) {
            
            let flag = this.common_dispatch.feedback;
            if(flag){
                return
            }

            if (this.feedBack.address == "" || this.feedBack.reason == "" || this.feedBack.suggestion == "" || this.feedBack.checkAdvice == "") {
                this.$message.error("请把基本信息填写完整!");
                return
            }
            let temp_data = this.get_feedBackData();
            this.saveOrUpdateWorkorder_(temp_data,str);
        },
        getWorkers(val) {
            this.colseFlag = true;
            this.queryPersonByDept_();
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
            this.workOrder.doerName = val.NAME;
            this.colseFlag = false;
        },
        getFile(e) {
            let that = this;
            let temp_file = e.target.files[0];
            let temp_fileName = temp_file.name;
            let temp_fileName_arr = temp_fileName.split(".");
            let temp_fileType = temp_file.type
            if(temp_file.size/1024/1024>10){
                that.$message.error("您上传的文件不能大于10M!")
                return
            }
             if(temp_fileType=="image/jpeg"||temp_fileType=="application/pdf"||temp_fileType=="image/png"||temp_fileType=="application/msword"||temp_fileType=="application/vnd.ms-excel"||temp_fileType=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
                let post_formdata = new FormData();
                let flag = that.msg_tabItem
                if (flag == 0) {
                    post_formdata.append("fileBiz", that.workOrder.id)
                } else {
                    post_formdata.append("fileBiz", that.feedBack.id)
                }
                post_formdata.append("fileName", temp_fileName)
                post_formdata.append("files", temp_file)
                uploadFiles(post_formdata).then(res => {
                    that.save_model.toggleShowModel = true;
                    that.save_model.save_flag = (res.status == 1);
                    that.save_model.save_msg = res.msg;
                })
             }else{
                 that.$message.error("您上传的文件格式应该为：png、jpg、pdf、word、excel"); 
             }


           

        },
        dispatch_new() {
            let that = this
            if(this.workOrder.doer===""){
                this.$message.error("请选择一个处理人!")
                return
            }
            if(this.workOrder.doerName===""){
                this.$message.error("请选择一个处理人!")
                return
            }
            let formData_ = new FormData();
            formData_.append("id", that.dispatch_id);
            formData_.append("handleUser", that.workOrder.doer);
            formData_.append("orderStatus", "1");
            saveOrUpdateWorkorder(formData_).then(res => {
                if (res.status == 1) {
                    that.refuse_name_flag = true;
                    that.$message.success("派单成功!")
                    that.dispatchFlag = true
                } else {
                    that.$message.error("派单失败!")
                }

            })

        },
        expWorkWorder2xls_(id,type){
            let  that = this
            let  formdata = new FormData();
            formdata.append("id",id);
            formdata.append("questionId",'');
            formdata.append("exportType",type);
            expWorkWorder2xls(formdata).then(res=>{
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
        },
        downloadFile(filePath){
            let before_url = this.filePath
            let complate_url = before_url+filePath
            window.open(complate_url)
        }

    },
    created() {
        this.main_selectTab = this.$store.getters.getTopActivedTab;
        let temp_id = this.$route.params.id;
        this.show_feedBack = parseInt(this.$route.params.status)
        this.deptId = this.$store.getters.get_deptId;
        if ( this.show_feedBack >= 4) {
            this.msg_tabs = [{
                    name: "标准工单"
                },
                {
                    name: "检修反馈单"
                }
            ]
        } else {
            this.msg_tabs = [{
                name: "标准工单"
            }]
        }

        this.id = temp_id;
        this.getWorkorderDetail_(temp_id);
        this.getOrderFlow_(temp_id);
        this.filePath = this.$store.getters.get_filePath;
        this.dispatchStatus = sessionStorage.getItem("dispatchFlag") || "false"

       
    },
    filters: {
        farmateStatus(val) {
            let temp = ''
           let list = dse.orderStatus;
            for(let i =0;i<list.length;i++){
                if(list[i].value===val){
                    temp = list[i].label
                }
            }
            return temp;
        },
        formateRepairType(val) {
            let temp = ''
            let list = dse.problem_type;
            for(let i =0;i<list.length;i++){
                if(list[i].value===val){
                    temp = list[i].label
                }
            }
            return temp;
        },
        formate_lev(val) {
            let temp = ''
            let list = dse.dangerlist;
            for(let i =0;i<list.length;i++){
                if(list[i].value===val){
                    temp = list[i].label
                }
            }
            return temp;
        },
        formate_orderStatus(val){
            let temp = ''
            let list = dse.orderStatus;
            for(let i =0;i<list.length;i++){
                if(list[i].value===val){
                    temp = list[i].label
                }
            }
            return temp;
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

#pipeRepair {
    width: 100%;
    height: 100%;
    background: #ccc;
    font-size: $baseFontSize;
    color: $baseColor;

    &>.topHead {
        width: 100%;
        height: 40px;
        padding: 0 20px;
        position: relative;
        text-align: right;
        vertical-align: middle;
        padding-top: 5px;
        border-bottom: 1px solid $baseBorderColor;

        .tabs {
            position: absolute;
            top: 10px;
            left: 20px;
            height: 30px;

            span {
                display: inline-block;
                margin-right: 10px;
                height: 100%;
                line-height: 30px;
                padding: 0 10px;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                background: #04beb7;
                color: #fff;
                cursor: pointer;

                &.actived {
                    background: #0b82ff;
                }
            }
        }

        span.goback {
            line-height: 30px;
            display: inline-block;
            padding: 0 15px;
            background: #fe8a01;
            border-radius: 5px;
            color: #fff;
            cursor: pointer;
        }
    }

    .main {
        width: 100%;
        height: calc(100% - 40px);
        position: relative;

        #closingTapGis {
            width: 100%;
            height: 100%;
        }

        .gis-tools {
            position: absolute;
            right: 20px;
            top: 10px;
            width: 350px;
            height: 30px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .colse-stopSupplyWater {
            position: absolute;
            right: 400px;
            top: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            padding: 8px 15px;
            border-radius: 5px;
            background: #0b83fe;
            color: #fff;
            cursor: pointer;
        }

        .close-rightTable {
            position: absolute;
            top: 60px;
            right: 20px;
            height: calc(100% - 80px);

            .toggleBar {
                width: 24px;
                height: 88px;
                border: 1px solid $baseBorderColor;
                position: absolute;
                left: -24px;
                top: 50%;
                cursor: pointer;
                text-align: center;

                i {
                    line-height: 88px;
                }
            }

            .mainContent {
                width: 350px;
                height: 100%;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

                &>.topHead {
                    width: 100%;
                    height: 35px;
                    padding: 0 10px;
                    background: #e3edef;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 600;

                    span:last-child {
                        display: inline-block;
                        padding: 0px 10px;
                        background: #0b82ff;
                        border-radius: 5px;
                        height: 25px;
                        line-height: 25px;
                        color: #fff;
                    }
                }
            }

            .contentTable {
                width: 100%;
                height: calc(100% - 35px);
                overflow-y: auto;

                table {
                    width: 100%;
                    border-spacing: 0;

                    thead {
                        width: 100%;

                        tr {
                            width: 100%;

                            th {
                                width: 20%;
                                line-height: 30px;
                                border-right: 1px solid $baseBorderColor;
                                border-bottom: 1px solid $baseBorderColor;

                                &:last-child {
                                    border-right: none;
                                }
                            }
                        }
                    }

                    tbody {
                        width: 100%;

                        tr {
                            width: 100%;

                            td {
                                width: 20%;
                                line-height: 30px;
                                text-align: center;
                                border-right: 1px solid $baseBorderColor;
                                border-bottom: 1px solid $baseBorderColor;

                               
                                &:last-child {
                                    border-right: none;
                                }

                                .status {
                                    display: inline-block;
                                    padding: 0px 15px;
                                    line-height: 20px;
                                    color: #fff;

                                    &.open {
                                        background: #04beb7;
                                    }

                                    &.close {
                                        background: #dddfde;
                                    }
                                }

                                .actionStatus {
                                    display: inline-block;
                                    padding: 0px 10px;
                                    line-height: 20px;
                                    border: 1px solid #0b83fe;
                                    border-radius: 5px;
                                    color: #0b83fe;
                                    cursor: pointer;
                                }

                            }
                        }
                    }
                }
            }
        }

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
                            background: #3a9a2e;
                        }

                        &.notAllow{
                            background: gray;
                            cursor: not-allowed;
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
                                    min-height: 30px;
                                    line-height: 30px;
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
                                    span.btn-add,span.btn-del{
                                        width: 60px;
                                    }

                                    &.sm {
                                        width: 80px;
                                    }

                                    &.md {
                                        width: 145px;
                                    }

                                    &.long {
                                        width: calc(100% - 300px);
                                    }

                                    &.long-sm {
                                        width: 50px;
                                    }

                                    &.long-md {
                                        width: 200px;
                                    }

                                    &.long-long {
                                        width: calc(100% - 400px);
                                    }
                                    span.inline-sm{
                                        width: 90px;
                                    }
                                    .inLine {
                                        width: calc(100% - 100px);
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
                                            border: 1px solid #0b83fe;
                                            color: #0b83fe;
                                            border-radius: 5px;
                                            cursor: pointer;
                                        }
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

                                    span.alignLeft{
                                        text-align: left;
                                        padding-left: 1em;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        .repairMsg {
            width: 100%;
            height: 100%;
            background: #ebebeb;
            padding: 0 10px;

            .topHead {
                width: 100%;
                height: 30px;
                line-height: 30px;
                font-weight: 600;
                display: flex;
                justify-content: space-between;

                .col {
                    .rect {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        background: #2cb8bd;
                        line-height: 30px;
                    }

                    .del {
                        display: inline-block;
                        padding: 0px 10px;
                        background: #0b83ff;
                        line-height: 25px;
                        color: #fff;
                        border-radius: 5px;
                        margin-right: 20px;
                    }
                }
            }

            .tableContent {
                width: 100%;
                height: calc(100% - 300px);
                border: 1px solid #c9c9c9;
                border-bottom: none;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background: #fff;

                .row {
                    width: 100%;
                    height: 12.5%;
                    display: flex;
                    justify-content: space-between;

                    .col {
                        width: 100px;
                        border-right: 1px solid #c9c9c9;
                        border-bottom: 1px solid #c9c9c9;
                        padding-left: 10px;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        &:last-child {
                            border-right: none;
                        }

                        &:nth-child(even) {
                            width: calc(50% - 100px);
                        }

                        &:nth-child(odd) {
                            background: #d6fafa;
                            font-weight: 600;
                            text-align: center;
                        }

                        &.noborder {
                            border-bottom: none;
                        }

                        .doc {
                            margin-right: 10px;
                        }
                    }
                }
            }

            .trace {
                width: 100%;
                height: 250px;

                .tophead {
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    font-weight: 600;

                    .rect {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        background: #2cb8bd;
                        line-height: 30px;
                    }
                }

                .timeLine {
                    width: 100%;
                    height: calc(100% - 30px);
                    background: #fff;
                    padding: 15px;

                    .wrapLine {
                        width: 100%;
                        display: flex;
                        justify-content: flex-start;

                        .timeItem {
                            width: 20%;
                            height: 30px;
                            border-bottom: 4px solid #ccc;
                            position: relative;
                            margin-bottom: 20px;

                            .circle {
                                width: 20px;
                                height: 20px;
                                background: #ccc;
                                border-radius: 20px;
                                position: absolute;
                                top: 18px;
                                left: 0;

                                i {
                                    display: inline-block;
                                    font-size: 20px;
                                    line-height: 20px;
                                    color: #3b9a2e;

                                    &.yellow {
                                        color: #fe8a01;
                                    }
                                }
                            }

                            .littleTip {
                                position: absolute;
                                top: 15px;
                                left: 30px;
                                width: 70px;
                                height: 25px;
                                line-height: 22px;
                                border: 2px dotted #1d2088;
                                border-radius: 5px;
                                background: #fff;
                                text-align: center;
                                font-size: 12px;
                            }
                        }
                    }

                    .cards {
                        width: 100%;
                        display: flex;
                        justify-content: flex-start;
                        height: calc(100% - 50px);

                        .cardItem {
                            width: 20%;
                            height: 100%;

                            .innerWrap {
                                width: 80%;
                                height: 100%;
                                margin: 0 auto;
                                padding: 10px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

                                .tips {
                                    width: 100%;
                                    height: 60px;
                                    line-height: 20px;
                                    font-size: 12px;
                                }

                                .imgs {
                                    width: 100%;
                                    height: calc(100% - 60px);
                                    display: flex;
                                    justify-content: space-around;

                                    img {
                                        width: 100px;
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
