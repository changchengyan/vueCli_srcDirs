<template>
<div id="information">
    <div id="gis"></div>
    <div class="gisTool">
        <tools @handleThisDom="thisDom" @showLayers="toggleSelectThis" :defaultLayers="layers"></tools>
    </div>
    <div class="table">
        <div class="inner" v-if="ifshowTable">
            <div class="tabs">
                <div class="tab-item" @click="selectThis(index)" :class="{actived:index==activedIndex}" v-for="(item,index) in tabs" :key="index">
                    {{item.name}}
                </div>
            </div>
            <template v-if="activedIndex==0">
                <div class="msg">
                    <div class="contentTable">
                        <table>
                            <thead>
                                <tr>
                                    <th><span>区域颜色</span></th>
                                    <th><span>状态</span></th>
                                    <th><span>巡检人员</span></th>
                                    <th class="time-sm"><span>上线时间</span></th>
                                    <th><span>今日巡检里程</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="onLive_msg.planList.length>0">
                                    <tr v-for="(item,index) in onLive_msg.planList" :key="index">
                                        <td><span class="rect" :style="{backgroundColor:'rgba'+item.areaColor}"></span></td>
                                        <td>
                                            <template v-if="item.startTime&&!item.endTime">
                                                <img src="../../assets/images/common/onLine.png" alt="">
                                        </template>
                                                <template v-else>
                                                    <img src="../../assets/images/common/offLine.png" alt="">
                                        </template>
                                        </td>
                                        <td><span class="name">{{item.userName}}</span></td>
                                        <td class="time-sm" :title="item.startTime"><span class="onLineTime">{{item.startTime}}</span></td>
                                        <td><span>{{item.inspectLength?item.inspectLength:0}}公里</span></td>
                                    </tr>
                                </template>

                            </tbody>
                        </table>
                    </div>
                    <div class="pagination">
                        <pagination :totalPage="onLive_msg.totalPages" @thisPage="getPageData_onLine"></pagination>
                    </div>

                </div>
            </template>
            <template v-if="activedIndex==1">
                <div class="plan plan_">
                    <div class="row ">
                        <span class="littleLong">巡检人员:</span>
                        <el-input clearable v-model="routingCheck_plan.worker"></el-input>
                    </div>
                    <div class="row">
                        <span class="sm">从:</span>
                        <el-date-picker  align="center" value-format="yyyy-MM" @change="getPlan_startMonth" v-model="routingCheck_plan.startTime" type="month" placeholder="月份">
                        </el-date-picker>
                        <span class="sm">到:</span>
                        <el-date-picker align="center" value-format="yyyy-MM" @change="getPlan_endMonth" v-model="routingCheck_plan.endTime" type="month" placeholder="月份">
                        </el-date-picker>
                        <el-button type="primary" @click="search_routingCheckPlan">搜索</el-button>
                    </div>
                    <div class="addPlan">
                        <span :class="{ifAdd:addFlag===true}" @click="gotoDescPage"><i class="el-icon-plus"></i>新增</span>
                    </div>
                    <div class="content routing-plan">
                        <table>
                            <thead>
                                <tr>
                                    <!--<th><span>巡检人</span></th>-->
                                    <th><span>计划名称</span></th>
                                    <!-- <th><span>完成率</span></th> -->
                                    <th><span>巡检日期</span></th>
                                    <th><span>巡检进度</span></th>
                                    <!--<th><span>巡检周期</span></th>-->
                                    <th><span>巡检人</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="routingCheck_plan.planList.length>0">
                                    <tr v-for="(item,index) in routingCheck_plan.planList" :key="index">
                                        <!--<td><span class="area">{{item.name}}</span></td>-->
                                        <td><span class="place" :title="item.planName">{{item.planName}}</span></td>
                                        <!-- <td><span>80%</span></td> -->
                                        <template v-if="item.endTime">
                                            <td :title="item.startTime+'-'+item.endTime"><span>{{item.startTime}}-{{item.endTime}}</span></td>
                                        </template>
                                        <template v-else>
                                            <td :title="item.startTime"><span>{{item.startTime}}</span></td>
                                        </template>
                                        <td><span>{{item.sumnum}}%</span></td>
                                        <!--<td><span>{{item.planCycle}}</span></td>-->
                                        <td :title="item.allName"><span>{{item.allName}}</span></td>
                                    </tr>
                                </template>

                            </tbody>
                        </table>
                    </div>
                    <div class="pagination">
                        <pagination :totalPage="routingCheck_plan.totalPages" @thisPage="getPageData_routingPlan"></pagination>
                    </div>
                </div>
            </template>
            <template v-if="activedIndex==2">
                <div class="plan">
                    <div class="row">
                        <span>处理人:</span>
                        <el-input v-model="peopleName" clearable></el-input>
                    </div>
                    <div class="row">
                        <span class="sm">从:</span>
                        <el-date-picker align="center" v-model="pipeRepair.startTime" type="date" placeholder="日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                        <span class="sm">到:</span>
                        <el-date-picker align="center" v-model="pipeRepair.endTime" type="date" placeholder="日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                        <el-button type="primary" @click="search_repair">搜索</el-button>
                    </div>
                    <div class="content">
                        <table>
                            <thead>
                                <tr>
                                    <th><span>序号</span></th>
                                    <th class="tableName"><span>检修单号</span></th>
                                    <th class="tableTime"><span>派单时间</span></th>
                                    <th><span>状态</span></th>
                                    <th><span>详情</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in pipeRepair.planList" :key="index">
                                    <td><span>{{index+1}}</span></td>
                                    <td class="tableName" :title="item.orderCode"><span>{{item.orderCode}}</span></td>
                                    <td class="tableTime" :title="item.dispatchTime"><span>{{item.dispatchTime}}</span></td>
                                    <td>
                                        <template v-if="item.orderStatus=='0'">
                                            <span class="ordering">派单</span>
                                        </template>
                                        <template v-if="item.orderStatus=='1'">
                                            <span class="receive">派单</span>
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
                                        <!-- <template v-else>
                                            <span></span>
                                        </template> -->
                                    </td>
                                    <td class="hasBorder" @click="gotosubDesc(item.id,item.type,item.orderStatus)"><span>详情</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagination">
                        <pagination :totalPage="pipeRepair.totalPages" @thisPage="getPageData_repair"></pagination>

                    </div>
                </div>
            </template>
            <template v-if="activedIndex==3">
                <div class="plan">
                    <div class="row">
                        <span>巡检人员:</span>
                        <el-input v-model="routingCheck_record.worker" clearable></el-input>
                    </div>
                    <div class="row">
                        <span class="sm">从:</span>
                        <el-date-picker align="center" v-model="routingCheck_record.startTime" type="date" placeholder="日期" @change="getStartTime_record">
                        </el-date-picker>
                        <span class="sm">到:</span>
                        <el-date-picker align="center" v-model="routingCheck_record.endTime" type="date" placeholder="日期" @change="getEndTime_record">
                        </el-date-picker>
                        <el-button type="primary" @click="shearch_record">搜索</el-button>
                    </div>
                    <div class="content rushRepair ">
                        <table>
                            <thead>
                                <tr>
                                    <th><span>巡检人员</span></th>
                                    <th><span>巡检日期</span></th>
                                    <th><span>当前进度</span></th>
                                    <th><span>计划名称</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if=" routingCheck_record.planList.length>0">
                                    <tr v-for="(item,index) in routingCheck_record.planList" :key="index">
                                        <td><span>{{item.userName}}</span></td>

                                        <td class="record_time" :title="item.startTime+'-'+item.endTime"><span>{{item.startTime|formateStartTime}}-{{item.endTime|formateEndTime}}</span></td>
                                        <td><span>{{item.sumNum}}%</span></td>
                                        <td class="record_place"><span class="hasColor" @click="gotonewPage(item.recordId,item.planName)">{{item.planName}}</span></td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagination">
                        <pagination :totalPage="routingCheck_record.totalPages" @thisPage="getPageData_checkRecord"></pagination>
                    </div>
                </div>
            </template>
        </div>
        <div class="toggoleBar" @click="toggleShowTable">
            <template v-if="ifshowTable">
                <i class="el-icon-arrow-right"></i>
            </template>
            <template v-else>
                <i class="el-icon-arrow-left"></i>
            </template>
        </div>
    </div>
    <template v-if="showLegent">
        <div class="wrap-tips">
            <div class="legent">
                <div class="close" @click="closeLegent">
                    <i class="el-icon-close"></i>
                </div>
                <!-- <div class="pipes">
                    <div class="row">
                        <div class="col">
                            <span class="one"></span>
                            <span>未巡检</span>
                        </div>
                        <div class="col">
                            <span class="two"></span>
                            <span>已巡检</span>
                        </div>

                    </div>
                    <div class="row">
                        <div class="col">
                            <span class="three"></span>
                            <span>未计划</span>
                        </div>
                        <div class="col">
                            <span ></span>
                            <span></span>
                        </div>
                    </div>
                </div> -->
                <div class="events">
                    <div class="item">
                        <img src="../../assets/images/common/repair.png" alt="">
                        <span>管网改造</span>
                    </div>
                    <div class="item">
                        <img src="../../assets/images/common/mark_need.png" alt="">
                        <span>签到点</span>
                    </div>
                    <div class="item">
                        <img src="../../assets/images/common/problemPoint.png" alt="">
                        <span>隐患点</span>
                    </div>
                    <div class="item">
                        <img src="../../assets/images/common/trail.png" alt="">
                        <span>巡查轨迹</span>
                    </div>
                    <div class="item">
                        <img src="../../assets/images/common/jxj.png" alt="">
                        <span>检修井</span>
                    </div>
                </div>
            </div>
            <div class="notices">
                <span>管线更新至{{update_time}}年</span>
            </div>
        </div>
    </template>
    <template v-else>
        <div class="legend-btn" @click="showLegend_">
            <span>图例</span>
        </div>
    </template>

    <select-table :closedModel_flag="showSelect_model_flag" @closeModel="close_selectModel" @configSelect="configTable"></select-table>
</div>
</template>

<script>
import tools from "@/common/components/gis_units/tools";
import * as esriLoader from "esri-loader";
esriLoader.loadCss(dse.arcgis_mainCss);
let startJs = dse.arcgis_startJS;
const options = {
    url: startJs,
    dojoConfig: dse.gisConfig
};
let pipeUrl = dse.arcgis_belowMap;
let fmUrl = dse.arcgis_points;
let jxjMap = dse.arcgis_jxj;

let wireMap = dse.arcgis_wire;
// 二维管网相关.
import popupUtils from '@/common/utils/popupUtils';
//管网图层配置
import gw2dConfig from '@/common/config/gis2d/gw2dConfig';
// 阀门配置
import fm2dConfig from '@/common/config/gis2d/fm2dConfig';
//电线配置
import dx2dConfig from '@/common/config/gis2d/dx2dConfig';
//检修井
import jxj2dConfig from "@/common/config/gis2d/jxj2dConfig"
import layerUtils from '@/common/utils/layerUtils';
import {
    queryOnlinePerson,
    queryInspectionInfo,
    querySignPoint,
    queryInspectorPlanInfo,
    getModifiedTime,
    getWorkorderList,
    getMapPro,
    getUserRecord
} from "@/api/rushrepair/information";
let drawArea = null; // 挂载画区域的函数
import TransformTime from "@/common/utils/utc_str_timeTrs"

import Arcgis_mkt_jwd from "@/common/utils/arcgis_mkt_jwd"

import pagination from "@/common/components/pagination";
let temp_staticPath = dse.static_baseUrl; //静态问价路径

import selectTable from "@/common/components/select_into_table"

let draw_dangerPoint = null; //绘制隐患点的图层函数
let draw_rodeReform_line = null; //绘制道路改造线的图层函数
let draw_rodeReform_points = null; //绘制道路改造 点的图层函数

window.personalTimer = null;   //人的 点位 定时器

let drawLine = null; //画轨迹的函数
export default {
    components: {
        tools,
        pagination,
        selectTable
    },
    data() {
        return {
            addFlag: false, //控制新增计划的按钮权限
            companyId:"", // 公司的ID
            map: null,
            view: null,
            layer1: null, // 管网
            layer3: null, //阀门
            dangerLayer: null, //隐患点的图层
            store_dangerLayer: [], // 储存隐患的图层点的数组
            rodeReform_line_layer: null, //道路改造的线图层
            store_rodeReform_line_layer: [], //储存道路改造的线数组
            rodeReform_points_layer: null, //道路改造的两头点图层
            store_rodeReform_points_layer: [], //道路改造的点的 数组
            drawTools: null, //gis工具栏  绘图工具
            distance: null, //gis工具栏  量测工具
            area: null, //gis工具栏  量测面积
            tabs: [{
                    name: "实时信息"
                },
                {
                    name: "巡检计划"
                },
                {
                    name: "管网抢修"
                },
                {
                    name: "巡检记录"
                }
            ],
            activedIndex: null, // 激活的tabs
            peopleName: "", //模糊查询的巡检人员
            areaID: "", //巡检区域
            startValue_plan: "", //巡检计划的开始时间
            endValue_plan: "", //巡检计划的结束时间
            startValue: "", //开始时间
            endValue: "", //结束时间
            tableData: [],
            plan: {
                name: ""
            },
            recordId: "", //巡检记录ID
            routingCheckTotolPage: 1,
            routingCheck_recordList: [], //巡检记录
            search_startPlan: null,
            search_endPlan: null,
            newGraphicsLayer_line: null, // 画轨迹线
            newGraphicsLayer_peoplePoints: null, //人的定位点
            newGraphicsLayer_pologon: null, //画面
            newGraphicsLayer_marks: null, // 画标记点
            temp_onlineArea: [], //保存实时信息的副本
            marks_online: [], //在线模块的标记点
            marks_plan: [], //巡检计划的标记点
            temp_planArea: [], //巡检记录的区域
            ifshowTable: true, //是否显示右侧内容
            showLegent: true, //显示图例
            routingCheck_planList: [], //巡检计划
            routingCheck_totalPage: 1,
            online_initCount: 0, //判断是否是第一次进入  实时信息
            update_time: "", // arcgis 更新时间
            layers: [],
            onLive_msg: { //实时信息
                totalPages: 1,
                planList: []
            },
            routingCheck_plan: { // 巡检计划
                totalPages: 1,
                planList: [],
                worker: "",
                startTime: "",
                endTime: "",
                post_startTime: "",
                post_endTime: ""
            },
            pipeRepair: { //管网抢修
                totalPages: 1,
                planList: [],
                worker: "",
                startTime: "",
                endTime: "",
                post_startTime: "",
                post_endTime: ""
            },
            routingCheck_record: { //巡检记录
                totalPages: 1,
                planList: [],
                worker: "",
                startTime: "",
                endTime: ""
            },
            showSelect_model_flag: false, //管网抢修 选择进入 标准工单 或者原用工单 弹窗
            gotoDetail_id: null, // 管网抢修进入详情页的id
            filePath: ""
        };
    },
    methods: {
        selectThis(index) {
            let that = this;
            this.activedIndex = index;
            this.$store.commit("setTab", index);

            if(this.view){
                this.view.popup.close()
            }

            if (index == 0) {
                if (that.newGraphicsLayer_pologon) {
                    that.newGraphicsLayer_pologon.removeAll();
                    that.newGraphicsLayer_marks.removeAll();
                    that.dangerLayer.removeAll();
                    that.rodeReform_line_layer.removeAll();
                    that.rodeReform_points_layer.removeAll();
                }

                drawArea(that.temp_onlineArea, that.marks_online);
                if (personalTimer) {
                    clearInterval(personalTimer)
                }
                personalTimer = setInterval(() => {
                    that.queryOnlinePerson_("1")
                }, 3 * 1000)

            } else if (index == 1) {

                if (personalTimer) {
                    clearInterval(personalTimer)
                }
                that.newGraphicsLayer_pologon.removeAll();
                that.newGraphicsLayer_marks.removeAll();
                that.newGraphicsLayer_line.removeAll();
                that.newGraphicsLayer_peoplePoints.removeAll();
                that.dangerLayer.removeAll();
                that.rodeReform_line_layer.removeAll();
                that.rodeReform_points_layer.removeAll();
                drawArea(that.routingCheck_plan.planList, that.marks_plan);
            } else if (index == 2) {
                if (personalTimer) {
                    clearInterval(personalTimer)
                }
                that.newGraphicsLayer_pologon.removeAll();
                that.newGraphicsLayer_marks.removeAll();
                that.newGraphicsLayer_line.removeAll();
                that.newGraphicsLayer_peoplePoints.removeAll();
                that.dangerLayer.removeAll();
                that.rodeReform_line_layer.removeAll();
                that.rodeReform_points_layer.removeAll();
                that.dangerLayer.addMany(that.store_dangerLayer);
                that.rodeReform_line_layer.addMany(that.store_rodeReform_line_layer);
                that.rodeReform_points_layer.addMany(that.store_rodeReform_points_layer);
            } else {
                if (personalTimer) {
                    clearInterval(personalTimer)
                }
                that.newGraphicsLayer_pologon.removeAll();
                that.newGraphicsLayer_marks.removeAll();
                that.newGraphicsLayer_line.removeAll();
                that.newGraphicsLayer_peoplePoints.removeAll();
                that.dangerLayer.removeAll();
                that.rodeReform_line_layer.removeAll();
                that.rodeReform_points_layer.removeAll();
            }
        },
        gotoDescPage() {
            let that  = this
            let flag = this.addFlag
            if (!flag) {
                return
            }
            if (personalTimer) {
                clearInterval(personalTimer)
            }
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
            this.$router.push({
                name: "pipe_rushrepair_plan"
            });
        },
        showLegend_() {
            this.showLegent = true;
        },
        gotonewPage(recordId, name) {
            this.$router.push({
                name: "pipe_rushrepair_record",
                params: {
                    id: "" + recordId,
                    planName: name
                }
            });
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
        },
        gotosubDesc(id, type, status) {
            // this.showSelect_model_flag = true;
            this.gotoDetail_id = id;
            let temp_num = parseInt(type)
            let temp_id = id;

            this.$router.push({
                name: "pipe_rushrepair_piperepair",
                params: {
                    "id": temp_id,
                    "tableType": temp_num,
                    "status": "" + status
                }
            });
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
        },
        toggleShowThis(val) {
            let temp_name = val.name;
            let temp_flag = val.flag;
            if (temp_name == "所有设备") {
                return
            }
            if (temp_name == "管网") {
                return
            }
            if (temp_name == "阀门") {
                return
            }
            if (temp_name == "消防栓") {
                return
            }
            if (temp_name == "消防栓") {
                return
            }
            if (temp_name == "其他") {
                return
            }
        },
        createMap(position) {
            let that = this;
            let temp_modelUrl = that.gisModel_iframe;
            esriLoader
                .loadModules(
                    [
                        "dojo/on",
                        "esri/Map",
                        "esri/views/MapView",
                        "esri/layers/FeatureLayer",
                        "dse//modules/toolbars/_Draw",
                        "dse/modules/measure/_measureDistance",
                        "dse/modules/measure/_measureArea",
                        "esri/layers/GraphicsLayer",
                        "esri/geometry/geometryEngine",
                        "esri/Graphic",
                        "esri/widgets/Search",
                        "esri/symbols/SimpleMarkerSymbol",
                        "esri/views/2d/draw/Draw",
                        "esri/tasks/QueryTask",
                        "esri/tasks/support/Query",
                        "esri/symbols/SimpleFillSymbol",
                        "esri/geometry/Polyline",
                        "dse/utils/BaseMapUtils",
                        "esri/geometry/support/webMercatorUtils",
                        "dojo/domReady!"
                    ],
                    options
                )
                .then(
                    ([
                        domOn,
                        Map,
                        MapView,
                        FeatureLayer,
                        _Draw,
                        _measureDistance,
                        _measureArea,
                        GraphicsLayer,
                        geometryEngine,
                        Graphic,
                        Search,
                        SimpleMarkerSymbol,
                        Draw,
                        QueryTask,
                        Query,
                        SimpleFillSymbol,
                        Polyline,
                        BaseMapUtils,
                       webMercatorUtils
                    ]) => {
                        
                        let temp_baseUrl = that.DSE.baseURL;
                        let danger_url = "" + temp_baseUrl + "/?id=" + id + "#/pipe/rushrepair/gisFrame_danger_point";
                        let iframe_danger = '<iframe src="' + danger_url + '" height="396" width="500"  scrolling="no" frameborder="0"></iframe>'

                        let rodeReform_url = "" + temp_baseUrl + "/?id=" + id + "#/pipe/rushrepair/gisFrame_rodeReform";
                        let iframe_rodeReform = '<iframe src="' + rodeReform_url + '" height="396" width="500"  scrolling="no" frameborder="0"></iframe>'

                        layerUtils.bindAmdClass(QueryTask, Query, GraphicsLayer, Graphic);
                        // Create the map
                        that.map = new Map({
                            // basemap: "satellite"
                        });

                        let baseMapUtils = new BaseMapUtils({
                            map: that.map,
                            mapType: '2'
                        });

    
                        baseMapUtils.loadBaseLayers(dse.baseMapLayers);

                        // 管网图层.
                        //临时 管网图层
                        let pipeUrl = that.$store.getters.get_pipe_defaultLayer;
                        gw2dConfig.url = pipeUrl;
                        gw2dConfig.popupTemplate.visible = false;
                        that.layer1 = layerUtils.loadData(that.map, gw2dConfig);
                        //===================================================

                        // // 阀门图层
                        // fm2dConfig.url = fmUrl;
                        // that.layer3 = layerUtils.loadData(that.map, fm2dConfig);
                        // //===================================================

                        // // 电线图层
                        // dx2dConfig.url = wireMap;
                        // this.layer4 = layerUtils.loadData(that.map, dx2dConfig);
                        // //===================================================
                        //检修井
                        jxj2dConfig.url = jxjMap;
                        that.layer6 = layerUtils.loadData(that.map, jxj2dConfig);
                        //==================================================
                        that.newGraphicsLayer_line = new GraphicsLayer({ //轨迹线
                            graphics: []
                        })
                        that.map.add(that.newGraphicsLayer_line);
                        that.newGraphicsLayer_peoplePoints = new GraphicsLayer({ // 有轨迹的人
                            graphics: []
                        })
                        that.map.add(that.newGraphicsLayer_peoplePoints);

                        that.newGraphicsLayer_pologon = new GraphicsLayer({ // 绘制的区域
                            graphics: []
                        })
                        that.map.add(that.newGraphicsLayer_pologon);
                        that.newGraphicsLayer_marks = new GraphicsLayer({ //标记点
                            graphics: []
                        })
                        that.map.add(that.newGraphicsLayer_marks);

                        that.dangerLayer = new GraphicsLayer({ //隐患的 图层
                            graphics: []
                        })

                        that.rodeReform_line_layer = new GraphicsLayer({ // 道路改造 线的 图层
                            graphics: []
                        })
                        that.rodeReform_points_layer = new GraphicsLayer({ // 道路改造 两头点的 图层
                            graphics: []
                        })

                        that.map.add(that.dangerLayer);
                        that.map.add(that.rodeReform_line_layer);
                        that.map.add(that.rodeReform_points_layer);
                        that.view = new MapView({
                            container: "gis",
                            map: that.map,
                            zoom: 15,
                            center:position,
                            highlightOptions: {
                                color: [255, 255, 0, 1],
                                haloOpacity: 0.9,
                                fillOpacity: 0.2
                            }
                        });

                        that.drawTools = new _Draw({
                            view: that.view
                        });
                        that.distance = new _measureDistance({
                            view: that.view
                        });
                        that.area = new _measureArea({
                            view: that.view
                        });


                        let movePoints = [];
                        let animateNum = 0;

                        let graphicLine = null;
                        let peopleMan_points = null; // 小人的坐标点

                        let graphic_polygon = null; //绘制计划区域
                        let graphicPoint = null; // 
                        let temp_plans = null;
                        let temp_marks = null;
                        setTimeout(() => {
                            temp_plans = that.temp_onlineArea || [];
                            temp_marks = that.marks_online || [];
                            for (let i = 0; i < temp_plans.length; i++) {
                                let points_area = JSON.parse(temp_plans[i].planArea)
                                let points = points_area.paths;
                                let color = temp_plans[i].areaColor;
                                color = JSON.parse(color);

                                let polygon = {
                                    type: "polygon", // autocasts as Polygon
                                    rings: points,
                                    spatialReference: {
                                        wkid: 102100
                                    }
                                };
                                graphic_polygon = new Graphic({
                                    geometry: polygon,
                                    symbol: {
                                        type: "simple-fill", // autocasts as SimpleFillSymbol
                                        color: color,
                                        style: "solid",
                                        outline: { // autocasts as SimpleLineSymbol
                                            color: "white",
                                            width: 2,
                                            style: "dash-dot"
                                        }
                                    }
                                });
                                that.newGraphicsLayer_pologon.add(graphic_polygon);
                            }

                            let flag_pic = null;

                            for (let j = 0; j < temp_marks.length; j++) {
                                // for (let k = 0; k < temp_marks[j].length; k++) {
                                let mkt_arr = new Arcgis_mkt_jwd([temp_marks[j].lgtd, temp_marks[j].lttd]).lonlat2mercator();
                                if (temp_marks[j].SIGNFLAG == '0') {
                                    flag_pic = `${temp_staticPath}/gis_temporary_pic/mark_normal.svg`
                                } else {
                                    flag_pic = `${temp_staticPath}/gis_temporary_pic/mark_error.svg`
                                }
                                graphicPoint = new Graphic({
                                    geometry: {
                                        type: "point", // autocasts as /Point
                                        x: mkt_arr[0],
                                        y: mkt_arr[1],
                                        spatialReference: that.view.spatialReference
                                    },
                                    symbol: {
                                        type: "picture-marker",
                                        url: "" + flag_pic,
                                        width: "20px",
                                        height: "20px"
                                    }
                                })
                                that.newGraphicsLayer_marks.add(graphicPoint);
                                // }

                            }

                        }, 1000)
                        drawArea = function (areaList, marks) {
                            that.newGraphicsLayer_pologon.removeAll();
                            that.newGraphicsLayer_marks.removeAll();
                            let temp_plans = areaList || [];
                            let temp_marks = marks;
                            for (let i = 0; i < temp_plans.length; i++) {
                                let points_area = JSON.parse(temp_plans[i].planArea)
                                let points = points_area.paths;
                                let color = temp_plans[i].areaColor;
                                color = JSON.parse(color);

                                let polygon = {
                                    type: "polygon", // autocasts as Polygon
                                    rings: points,
                                    spatialReference: {
                                        wkid: 102100
                                    }
                                };
                                graphic_polygon = new Graphic({
                                    geometry: polygon,
                                    symbol: {
                                        type: "simple-fill", // autocasts as SimpleFillSymbol
                                        color: color,
                                        style: "solid",
                                        outline: { // autocasts as SimpleLineSymbol
                                            color: "#FFFF37",
                                            width: 2,
                                            style: "short-dash"
                                        }
                                    }
                                });
                                that.newGraphicsLayer_pologon.add(graphic_polygon)
                            }
                            let flag_pic = null;
                            for (let j = 0; j < temp_marks.length; j++) {
                                let mkt_arr = new Arcgis_mkt_jwd([temp_marks[j].lgtd, temp_marks[j].lttd]).lonlat2mercator();
                                if (temp_marks[j].SIGNFLAG == '0') {
                                    flag_pic = `${temp_staticPath}/gis_temporary_pic/mark_error.svg`
                                } else {
                                    flag_pic = `${temp_staticPath}/gis_temporary_pic/mark_normal.svg`
                                }
                                graphicPoint = new Graphic({
                                    geometry: {
                                        type: "point", // autocasts as /Point
                                        x: mkt_arr[0],
                                        y: mkt_arr[1],
                                        spatialReference: that.view.spatialReference
                                    },
                                    symbol: {
                                        type: "picture-marker",
                                        url: "" + flag_pic,
                                        width: "20px",
                                        height: "20px"
                                    }
                                })
                                that.newGraphicsLayer_marks.add(graphicPoint);
                            }

                        }

                       

                        draw_dangerPoint = function (point) {
                            let temp_point = point;
                            let mkt_arr = new Arcgis_mkt_jwd([temp_point.lgtd, temp_point.lttd]).lonlat2mercator();
                            let graphicPoint = new Graphic({
                                geometry: {
                                    type: "point", // autocasts as /Point
                                    x: mkt_arr[0],
                                    y: mkt_arr[1],
                                    spatialReference: that.view.spatialReference
                                },
                                symbol: {
                                    type: "picture-marker",
                                    url: `${temp_staticPath}/gis_temporary_pic/problemPoint.png`,
                                    width: "34px",
                                    height: "30px"
                                },
                                attributes: temp_point,
                                popupTemplate: {
                                    title: "隐患点",
                                    content: "" + iframe_danger
                                }
                            })
                            that.store_dangerLayer.push(graphicPoint)
                        }

                        draw_rodeReform_line = function (line) {
                            let temp_line = line;
                            let path_line = JSON.parse(line.planArea)["paths"]
                            let graphicLine = new Graphic({
                                geometry: new Polyline({
                                    paths: path_line,
                                    spatialReference: that.view.spatialReference
                                }),
                                symbol: {
                                    type: "simple-line", // autocasts as new SimpleFillSymbol
                                    color: "#a6a6a6",
                                    style: "solid",
                                    width: 4,
                                    cap: "round",
                                    join: "round"
                                },
                                attributes: line,
                                popupTemplate: {
                                    title: "道路改造",
                                    content: "" + iframe_rodeReform
                                }
                            });
                            that.store_rodeReform_line_layer.push(graphicLine)
                        }
                        draw_rodeReform_points = function (line) {
                            let temp_point = line;
                            let path_line = JSON.parse(line.planArea)["paths"];
                            let startPoint = null;
                            let endPoint = null;
                            let len = path_line[0].length;
                            startPoint = path_line[0][0];
                            endPoint = path_line[0][len - 1];

                            // startPoint = webMercatorUtils.xyToLngLat(startPoint);
                            // endPoint = webMercatorUtils.xyToLngLat(endPoint);

                            let graphic_startPoint = new Graphic({
                                geometry: {
                                    type: "point", // autocasts as /Point
                                    x: startPoint[0],
                                    y: startPoint[1],
                                    spatialReference: that.view.spatialReference
                                },
                                symbol: {
                                    type: "picture-marker",
                                    url: `${temp_staticPath}/gis_temporary_pic/rodeReform.png`,
                                    width: "20px",
                                    height: "22px"
                                },
                                attributes: temp_point,
                                popupTemplate: {
                                    title: "道路改造",
                                    content: "" + iframe_rodeReform
                                }
                            });
                            that.store_rodeReform_points_layer.push(graphic_startPoint)

                            // that.rodeReform_points_layer.add(graphic_startPoint)


                            let graphic_endPoint = new Graphic({
                                geometry: {
                                    type: "point", // autocasts as /Point
                                    x: endPoint[0],
                                    y: endPoint[1],
                                    spatialReference: that.view.spatialReference
                                },
                                symbol: {
                                    type: "picture-marker",
                                    url: `${temp_staticPath}/gis_temporary_pic/rodeReform.png`,
                                    width: "20px",
                                    height: "22px"
                                },
                                attributes: temp_point,
                                popupTemplate: {
                                    title: "道路改造",
                                    content: "" + iframe_rodeReform
                                }
                            });
                            that.store_rodeReform_points_layer.push(graphic_endPoint)
                            // that.rodeReform_points_layer.add(graphic_endPoint)

                            

                        }
                        if(that.activedIndex ===1){
                             if (personalTimer) {
                                clearInterval(personalTimer)
                            }
                            that.newGraphicsLayer_pologon.removeAll();
                            that.newGraphicsLayer_marks.removeAll();
                            that.newGraphicsLayer_line.removeAll();
                            that.newGraphicsLayer_peoplePoints.removeAll();
                            that.dangerLayer.removeAll();
                            that.rodeReform_line_layer.removeAll();
                            that.rodeReform_points_layer.removeAll();
                            setTimeout(()=>{
                                 drawArea(that.routingCheck_plan.planList, that.marks_plan);
                            },1000)
                        }

                        //监听弹出框.
                        that.view.popup.watch('selectedFeature', function (newView, oldValue, portery, object) {
                            window.graphic = that.view.popup.selectedFeature;
                            that.iframe_width_flag = false;
                            if (window.graphic) {
                                that.view.graphics.removeAll();
                                let tempGra = new Graphic({
                                    geometry: window.graphic.geometry,
                                    symbol: {
                                        type: "simple-marker",
                                        style: "circle",
                                        color: [255, 250, 205, 0.3],
                                        size: "60px",
                                        outline: {
                                            color: "yellow",
                                            width: 1
                                        }
                                    }
                                });
                                that.view.graphics.add(tempGra);
                                let params = window.graphic.attributes;
                                params.staticFile = that.filePath
                                dse.globalData = params;
                            }
                        });
                        //关闭弹出框时恢复高亮显示的管线.
                        that.view.popup.watch('visible', function (newView, oldValue, portery, object) {
                            if (!newView) {
                                that.view.graphics.removeAll();
                            }
                        });

                        drawLine = function (test_points_) {
                            let points_len = test_points_.length;
                            peopleMan_points = new Graphic({
                                geometry: {
                                    type: "point", // autocasts as /Point
                                    x: test_points_[0],
                                    y: test_points_[1],
                                    spatialReference: that.view.spatialReference
                                },
                                symbol: {
                                    type: "picture-marker",
                                    url: `${temp_staticPath}/gis_temporary_pic/inspector-me.svg`,
                                    width: "40px",
                                    height: "40px"

                                }
                            })
                            that.newGraphicsLayer_peoplePoints.removeAll();
                            that.newGraphicsLayer_peoplePoints.add(peopleMan_points);
                        }

                    }
                );
        },
        toggleSelectThis(val) {
            let that = this;
            let temp_list = val;
        },
        //是否是底图
        _isBaseLayer(layerId) {
            let items = dse.baseMapLayers.filter(function (layer) {
                return layer.id === layerId;
            });
            return items.length > 0 ? items[0] : null;
        },
        //切换底图状态.
        _changeBaseLayer(type) {
            //
            let self = this;
            //
            this.map.allLayers.forEach((layer, index) => {

                if (this._isBaseLayer(layer.id)) {
                    // self.map.getLayer(lId).setVisibility(false);

                    self.map.findLayerById(layer.id).visible = false;
                    /**
                     * 修复底图切换时，标签图层显示不正常
                     * @author wangsl
                     * @date 2017-05-24
                     * */
                    let lblLayer = self.map.findLayerById(layer.id + "w");
                    //hide label layer.
                    if (lblLayer) {
                        // lblLayer.setVisibility(false);
                        lblLayer.visible = false;
                    }
                }
            });
            let vecLayer = this.map.findLayerById(type);
            let labelLayer = this.map.findLayerById(type + "w");
            //
            if (vecLayer) {
                vecLayer.visible = true;
            }
            if (labelLayer) {
                labelLayer.visible = true;
            }
        },
        thisDom(obj) {
            let that = this;
            let temp_str = obj.tmpStr;
            switch (temp_str) {
                case "平面":
                    this._changeBaseLayer('gvec');
                    break;
                case "卫星":
                    this._changeBaseLayer('gimg');
                    break;
                case "地形":
                    this._changeBaseLayer('gter');
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
        queryOnlinePerson_(page) { //实时查询
            let that = this;
            queryOnlinePerson({
                userId: "",
                page: "" + page,
                pageSize: "10"
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`;
                    return;
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!");
                    return;
                }
                let temp_arr = JSON.parse(JSON.stringify(res.data.rows)) || [];
                that.temp_onlineArea = res.data.rows || [];
                for (let i = 0; i < temp_arr.length; i++) {
                    let color = temp_arr[i].areaColor;
                    color = JSON.parse(color);
                    color = '(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + color[3] + ')';
                    temp_arr[i].areaColor = color;
                }
                that.onLive_msg.planList = temp_arr || [];
                that.onLive_msg.totalPages = Math.ceil(res.data.total / 10) || 1;
                that.online_initCount = that.online_initCount + 1;
                that.marks_online = [];
       
                for (let i = 0; i < that.onLive_msg.planList.length; i++) {
                    querySignPoint({
                        planId: "" + that.onLive_msg.planList[i].planId
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
                            that.marks_online = that.marks_online.concat(res.data || []);
                            // if (that.online_initCount > 1) {
                            drawArea(that.temp_onlineArea, that.marks_online);
                            // }
                        }
                    }).catch(function (error) {
                        console.log(error)
                    });
                    that.getUserRecord_(that.onLive_msg.planList[i].userId, that.onLive_msg.planList[i].recordId)
                }
            }).catch(function (error) {
                console.log(error)
            });
        },
        queryInspectionInfo_(page) {
            let that = this;
            let startTime = this.routingCheck_record.startTime || "";
            let endTime = this.routingCheck_record.endTime || "";
            let name = this.routingCheck_record.worker;
            // let recordId = this.recordId;
            queryInspectionInfo({
                name: "" + name,
                startTime: "" + startTime,
                endTime: "" + endTime,
                recordId: "",
                userId: "",
                page: "" + page,
                pageSize: "10"
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
                        inspectionInfoData
                    } = res.data;
                    that.routingCheck_record.totalPages = Math.ceil(inspectionInfoData.total / 10) || 1;
                    that.routingCheck_record.planList = inspectionInfoData.rows || [];
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
        getStartTime_record(val) {
            let time = new TransformTime(val).format_yymmdd();
            this.routingCheck_record.startTime = time;
        },
        getEndTime_record(val) {
            let time = new TransformTime(val).format_yymmdd();
            this.routingCheck_record.endTime = time;
        },
        shearch_record() {
            let temp_startTime = this.routingCheck_record.startTime;
            let temp_endTime = this.routingCheck_record.endTime;
            var time1 = new Date(temp_startTime);
            var time2 = new Date(temp_endTime);
            if (time1 > time2) {
                this.$message.error("开始时间不能大于结束时间!")
                return
            }
            this.queryInspectionInfo_("1");
        },
        search_routingCheckPlan() {
            let that  = this
            let temp_start = new Date(that.routingCheck_plan.post_startTime)
            let temp_end = new Date(that.routingCheck_plan.post_endTime)
            if(temp_end<temp_start){
                this.$message.error("开始月份不能大于结束月份!")
                return
            }
            this.queryInspectorPlanInfo_("1");
        },

        //获取当前之前或者之后天数的日期
        getDateStr(val, AddDayCount) {
            let dd = new Date(val);
            dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
            let y = dd.getFullYear();
            let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
            let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
            return y + "/" + m + "/" + d;
        },
        //获取当前月有多少天
        getMonthLength(date) {
            let d = new Date(date)
            // 将日期设置为下月一号
            d.setMonth(d.getMonth() + 1)
            d.setDate('1')
            // 获取本月最后一天
            d.setDate(d.getDate() - 1)
            return d.getDate()
        },
        getPlan_startMonth(val) {
            if (val) {
                let formate_time = val.replace("-", "/");
                let old_time = formate_time + "/01"
                // let temp_time = this.getDateStr(old_time, -6)
                this.routingCheck_plan.post_startTime = old_time
            } else {
                this.routingCheck_plan.startTime = '';
                this.routingCheck_plan.post_startTime = '';
            }

        },
        getPlan_endMonth(val) {
            if (val) {
                let days = this.getMonthLength(val)
                let formate_time = val.replace("-", "/");
                let old_time = formate_time + "/" + days
                // let temp_time = this.getDateStr(old_time, 6)
                this.routingCheck_plan.post_endTime = old_time
            } else {
                this.routingCheck_plan.endTime = "";
                this.routingCheck_plan.post_endTime = "";
            }

        },
        toggleShowTable() {
            this.ifshowTable = !this.ifshowTable;
        },
        closeLegent() {
            this.showLegent = !this.showLegent
        },
        queryInspectorPlanInfo_(page) {
            let that = this;

            let temp_workers = that.routingCheck_plan.worker;
            let temp_startTime = this.routingCheck_plan.post_startTime || "";
            let temp_endTime = this.routingCheck_plan.post_endTime || "";

            queryInspectorPlanInfo({
            	name:"" +　temp_workers,
                personId: "",
                areaId: "",
                startTime: "" + temp_startTime,
                endTime: "" + temp_endTime,
                useStatus: "1",
                page: "" + page,
                pageSize: "10"
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
                    let {
                        rows,
                        total
                    } = data;
                    that.routingCheck_plan.planList = rows || [];
                    that.routingCheck_plan.totalPages = Math.ceil(total / 10) || 1;
                    that.marks_plan = [];
                    for (let i = 0; i < that.routingCheck_plan.planList.length; i++) {
                        querySignPoint({
                            planId: "" + that.routingCheck_plan.planList[i].planId
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
                                that.marks_plan = that.marks_plan.concat(res.data || []);

                            }
                        }).catch(function (error) {
                            if (error == "Error: Network Error") {
                                that.$message.error("网络错误")
                                return;
                            } else {
                                that.$message.error("逻辑错误!")
                            }
                        });
                    }

                }
            }).catch(function (error) {
                console.log(error)
            });
        },
        getModifiedTime_() {
            let that = this;
            getModifiedTime({
                year: ""
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
                    if (data.length > 0) {
                        that.update_time = data[0].UPDATETIME;
                    }
                }
            }).catch(function (error) {
                console.log(error)
            });
        },
        getWorkorderList_(page) {
            let that = this;
            let temp_startTime = this.pipeRepair.startTime || "";
            let temp_endTime = this.pipeRepair.endTime || "";
            let temp_start_ = new Date(temp_startTime.replace("-", "/"));
            let temp_end_ = new Date(temp_endTime.replace("-", "/"));
            if (temp_start_ > temp_end_) {
                this.$message.error("开始时间不能大于结束时间!")
                return
            }
            getWorkorderList({
                startTime: "" + temp_startTime,
                endTime: "" + temp_endTime,
                orderStatus: "",
                page: "" + page,
                pageSize: "10"
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
                    let {
                        rows
                    } = data;
                    that.pipeRepair.planList = rows || [];
                    that.pipeRepair.totalPages = Math.ceil(data.total / 10) || 1;
                    if (rows && rows.length) {
                        // for (let i = 0; i < rows.length; i++) {
                        //     if (rows[i].proFromCode == '1') {
                                // that.getMapPro_(rows[i].questionId);
                                let companyId = that.companyId
                                that.getMapPro_(companyId);
                        //     }
                        // }
                    }

                }
            }).catch(err => {
                console.log(err)
            })
        },
        search_repair() {
            this.getWorkorderList_("1");

        },
        getPageData_onLine(pageNum) {
            this.queryOnlinePerson_(pageNum)
        },
        getPageData_routingPlan(pageNum) {
            this.queryInspectorPlanInfo_(pageNum); //获取获取巡检计划
        },
        getPageData_repair(pageNum) {
            this.getWorkorderList_(pageNum); // 获取 管网抢修
        },
        getPageData_checkRecord(pageNum) {
            this.queryInspectionInfo_(pageNum); //获取获取巡检记录
        },
        getMapPro_(id) {
            let that = this;
            getMapPro({
                companyId: "" + id
            }).then(res => {
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (that.dangerLayer) {
                    that.dangerLayer.removeAll();
                    that.rodeReform_line_layer.removeAll();
                    that.rodeReform_points_layer.removeAll();
                }

                let {
                    data
                } = res;
                let {
                    RoadData,
                    hiddenAndOtherData
                } = data;
                hiddenAndOtherData = hiddenAndOtherData || [];
                if (hiddenAndOtherData.length > 0) {
                    for (let i = 0; i < hiddenAndOtherData.length; i++) {
                        if (draw_dangerPoint) {
                            draw_dangerPoint(hiddenAndOtherData[i]);
                        }
                    }
                }
                if (RoadData.length > 0) {
                    for (let i = 0; i < RoadData.length; i++) {
                        draw_rodeReform_line(RoadData[i]);
                        draw_rodeReform_points(RoadData[i]);
                    }
                }

                setTimeout(()=>{
                    that.dangerLayer.addMany(that.store_dangerLayer);
                    that.rodeReform_line_layer.addMany(that.store_rodeReform_line_layer);
                    that.rodeReform_points_layer.addMany(that.store_rodeReform_points_layer);
                },1500)

            }).catch(err => {
                console.log(err)
            })
        },
        close_selectModel(val) {
            this.showSelect_model_flag = false;
        },
        configTable(val) {
            let temp_id = this.gotoDetail_id;
            this.$router.push({
                name: "pipe_rushrepair_piperepair",
                params: {
                    "id": temp_id,
                    "tableType": val
                }
            });
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
        },
        getUserRecord_(userID, recordId) {
            let that = this;
            getUserRecord({
                startTime: "",
                endTime: "",
                userid: "" + userID,
                recordId: "" + recordId
            }).then(res => {
                let {
                    data
                } = res;

                let temp_arr = [];

                for (let i = 0; i < data.length; i++) {
                    let inner_arr = new Arcgis_mkt_jwd([data[i].LGTD, data[i].LTTD]).lonlat2mercator();
                    temp_arr.push(inner_arr)
                }
                if(temp_arr.length>0){
                    drawLine(temp_arr[temp_arr.length - 1])
                }
            }).catch(error => {
                console.log(error)
            })
        }
    },
    filters: {
        formateStartTime(val) {
            return val
        },
        formateEndTime(val) {
            return val
        },
        formate_time(val) {
            let temp_val = val
            temp_val = temp_val.split(" ")
            temp_val = temp_val[0]
            let temp_year = temp_val.split("-")[0] + "年"
            let temp_month = temp_val.split("-")[1] + "月"
            let temp_day = temp_val.split("-")[2] + "日"
            return temp_year + temp_month + temp_day
        }
    },
    mounted() {
        let that = this;
        //  得到 当前的 经纬度数据
        let  potions = this.$store.getters.get_cityPosition
        if(potions.length===0){
            potions = [106.290351, 36.001819]
        }

        this.createMap(potions);

        this.queryInspectionInfo_("1"); //获取获取巡检记录
        this.queryInspectorPlanInfo_("1"); // 获取巡检计划
        this.getWorkorderList_("1"); // 获取 管网抢修
        if(  this.activedIndex===0){
            if(personalTimer){
                clearInterval(personalTimer)
            }
              personalTimer = setInterval(() => {
                    that.queryOnlinePerson_("1")
              }, 3 * 1000)
        }else{
            that.queryOnlinePerson_("1")
        }
      
    },
    created() {
        let that = this;
        this.activedIndex = this.$store.getters.getActived;
        this.filePath = this.$store.getters.get_filePath
        that.addFlag = (that.$store.getters.get_pages_btn_allow).information.add;

        this.companyId = this.$store.getters.get_companyId

        this.queryOnlinePerson_("1"); // 获取在线人数列表
        this.getModifiedTime_();
    },
    beforeDestroy() {
        let that = this
        if (personalTimer) {
            clearInterval(personalTimer)
        }
    }
};
</script>

<style lang="scss" scoped>
$baseFont: 14px;
$baseColor: #333;
$borderColor: #ccc;

#information {
    width: 100%;
    height: 100%;
    position: relative;

    #gis {
        width: 100%;
        height: 100%;
    }

    .gisTool {
        position: absolute;
        right: 20px;
        top: 20px;
        width: 260px;
        height: 30px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        border-radius: 5px;
        background: #fff;
    }

    &>.table {
        height: calc(100% - 90px);
        position: absolute;
        top: 70px;
        right: 20px;
        background: #fff;

        .inner {
            height: 100%;
            width: 400px;
            position: relative;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

            .tabs {
                width: 100%;
                display: flex;
                justify-content: flex-start;
                font-size: $baseFont;
                color: $baseColor;
                background: rgb(227, 237, 239);
                height: 30px;
                line-height: 30px;

                .tab-item {
                    width: 70px;
                    text-align: center;
                    border-right: 1px solid #ccc;
                    cursor: pointer;

                    &.actived {
                        background: rgb(11, 131, 254);
                        color: #fff;
                    }

                    &:last-child {
                        border-right: none;
                    }
                }
            }

            .plan {
                width: 100%;
                height: calc(100% - 40px);
                // overflow: hidden;
                &.plan_ {
                    .el-input {
                        width: calc(100% - 70px);
                    }
                }

                .row {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    height: 30px;
                    line-height: 30px;
                    font-size: $baseFont;
                    margin: 10px 0;
                    padding: 0 10px;

                    span {
                        display: inline-block;
                        width: 60px;
                    }

                    span.sm {
                        width: 30px;
                        margin: 0 10px;
                    }
                    .el-input {
                        width: calc(100% - 80px);
                    }
                    .el-select {
                        width: calc(100% - 40px);
                    }
                    .el-date-editor{
                        width: 110px;
                        .el-picker-panel{
                            position: absolute;
                            left: -158px !important ;
                        }
                    }

                    .el-button {
                        margin-left: 4px;
                    }

                    
                }

                .addPlan {
                    width: 100%;
                    padding: 0 10px;
                    height: 35px;
                    background: #dcdedd;
                    font-size: 14px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;

                    span {
                        display: inline-block;
                        padding: 0 10px;
                        line-height: 25px;
                        background: gray;
                        color: #fff;
                        border-radius: 5px;
                        cursor: not-allowed;

                        &.ifAdd {
                            background: #3a9a2e;
                            cursor: pointer;
                        }
                    }
                }

                .content {
                    width: 100%;
                    height: calc(100% - 125px);
                    overflow-y: auto;
                    margin-bottom: 10px;

                    &.rushRepair {
                        height: calc(100% - 120px);

                        table {
                            td.record_time {
                                span {
                                    width: 100%;
                                }
                            }

                            td.record_place {
                                span {
                                    width: 100%;
                                }
                            }
                        }
                    }

                    &.routing-plan {
                        height: calc(100% - 160px);
                        margin-bottom: 10px;

                        table {
                            td {
                                span {
                                    width: 100%;
                                }
                            }
                        }
                    }

                    table {
                        width: 100%;
                        border-spacing: 0;
                        border-top: 1px solid #ccc;
                        font-size: $baseFont;
                        text-align: center;

                        .tableName,
                        .tableTime {
                            span {
                                width: 100%;
                            }
                        }

                        thead {
                            width: 100%;

                            tr {
                                width: 100%;

                                th {
                                    width: 20%;
                                    height: 25px;
                                    line-height: 25px;
                                    border-right: 1px solid #ccc;
                                    border-bottom: 1px solid #ccc;

                                    &:last-child {
                                        border-right: none;
                                    }
                                }
                            }
                        }

                        tbody {
                            width: 100%;
                            height: calc(100% - 30px);
                            overflow-y: auto;

                            tr {
                                width: 100%;

                                td {
                                    width: 20%; // height: 25px;
                                    line-height: 25px;
                                    border-right: 1px solid #ccc;
                                    border-bottom: 1px solid #ccc;

                                    &:last-child {
                                        border-right: none;
                                    }

                                    .area {
                                        // color: #0f84fe;
                                        // text-decoration: underline;
                                        // cursor: pointer;
                                    }

                                    span.ordering {
                                        display: inline-block;
                                        padding: 2px 10px;
                                        /*background: #c964e9;*/
                                        color: #c964e9; 
                                        border-radius: 5px;
                                    }

                                    span.receive {
                                        display: inline-block;
                                        padding: 2px 8px;
                                        color: #e7af18; 
                                        border-radius: 5px;
                                    }

                                    span.doing {
                                        display: inline-block;
                                        padding: 2px 10px;
                                        /*background: #ff2c50;*/
                                        color: #ff2c50;
                                        border-radius: 5px;
                                    }

                                    span.down {
                                        display: inline-block;
                                        padding: 2px 10px;
                                        /*background: #16bfb1;*/
                                        color: #16bfb1;
                                        border-radius: 5px;
                                    }

                                    span.checked {
                                        display: inline-block;
                                        padding: 2px 6px;
                                        /*background: #00bd12;*/
                                        color: #00bd12;
                                        border-radius: 5px;
                                    }

                                    span.hasColor {
                                        color: #0f84fe;
                                        text-decoration: underline;
                                        cursor: pointer;
                                    }

                                    &.hasBorder {
                                        span {
                                            display: inline-block;
                                            padding: 2px 10px;
                                            border: 1px solid #1b8cff;
                                            cursor: pointer;
                                            border-radius: 5px;
                                            color: #1b8cff;
                                        }
                                    }
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

            .msg {
                width: 100%;
                height: calc(100% - 24px);

                .contentTable {
                    width: 100%;
                    height: calc(100% - 50px);
                    overflow-y: auto;
                    margin-bottom: 10px;

                    table {
                        width: 100%;
                        border-spacing: 0;
                        text-align: center;
                        font-size: $baseFont;
                        color: $baseColor;

                        thead {
                            width: 100%;

                            tr {
                                width: 100%;

                                th {
                                    width: 20%;
                                    padding: 5px 0;
                                    height: 30px;
                                    border-right: 1px solid #ccc;
                                    border-bottom: 1px solid #ccc;

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
                                    padding: 5px 0;
                                    height: 30px;
                                    border-right: 1px solid #ccc;
                                    border-bottom: 1px solid #ccc;

                                    &:last-child {
                                        border-right: none;
                                    }

                                    .rect {
                                        display: inline-block;
                                        height: 10px;
                                        width: 80%; // background: red;
                                    }

                                    .status {
                                        display: inline-block;
                                        width: 20px;
                                        height: 20px;
                                        border-radius: 20px;
                                        background: blue;
                                    }
                                }
                            }
                        }

                        .time-sm {
                            span {
                                width: 100%;
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
        }

        .toggoleBar {
            position: absolute;
            top: 50%;
            left: -12px;
            width: 24px;
            height: 88px;
            border: 1px solid #ccccc8;
            line-height: 86px;
            cursor: pointer;
            margin-top: -44px;
            margin-left: -12px;
            background: #fff;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            text-align: center;

            i {
                line-height: 88px;
            }
        }
    }

    .wrap-tips {
        position: absolute;
        bottom: 20px;
        left: 20px;
        width: 300px;
        // height: 300px;

        .legent {
            width: 300px;
            height: 150px;
            font-size: 12px;
            color: #333;
            background: #fff;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;

            .close {
                width: 20px;
                height: 20px;
                position: absolute;
                top: 5px;
                right: 0px;
                cursor: pointer;
            }

            .pipes {
                width: 100%;
                height: 60%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-content: space-between;

                .row {
                    width: 100%;
                    height: 33.33%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    text-align: center;

                    .col {
                        width: 50%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        span {
                            display: inline-block;
                            width: 50%;
                            text-align: center;

                            &.one {
                                height: 15px;
                                background: #45a2ff;
                            }

                            &.two {
                                height: 15px;
                                background: #7e8eff;
                            }

                            &.three {
                                height: 15px;
                                background: #798d9e;
                            }
                        }
                    }

                }
            }

            .events {
                width: 100%;
                height: 80px;
                display: flex;
                justify-content: space-between;

                .item {
                    width: 20%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    span:first-child {
                        display: inline-block;
                        width: 100%;
                        margin-bottom: 10px;
                    }

                    img {
                        width: 35px;
                        display: block;
                        margin-bottom: 5px;
                    }
                }
            }
        }

        .notices {
            width: 300px;
            background: #fff;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: $baseColor;
            text-align: center;
            border-radius: 3px;
        }
    }

    .legend-btn {
        position: absolute;
        bottom: 50px;
        left: 20px;
        width: 40px;
        height: 40px;
        line-height: 40px;
        border-radius: 50%;
        cursor: pointer;
        background: #0b83fe;
        color: #fff;
        text-align: center;
        font-size: 12px;
    }
}
</style>
