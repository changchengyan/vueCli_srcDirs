<template>
<div id="makePlan">
    <div id="gis"> </div>
    <div class="leftWrap">
        <div class="toggleBar" @click="toggleShow">
            <template v-if="showTable">
                <i class="el-icon-arrow-left"></i>
            </template>
            <template v-else>
                <i class="el-icon-arrow-right"></i>
            </template>
        </div>
        <div class="innerWrap" v-if="showTable">
            <div class="topHead">
                <span class="rect"> </span>
                <span>巡检计划定制</span>
            </div>
            <div class="tableContent">
                <table>
                    <tr>
                        <td> <i class="el-icon-star-on"></i> <span>巡检名称</span></td>
                        <td><input type="text" placeholder="请输入巡检名称" v-model="plan.planName"></td>
                    </tr>
                    <tr>
                        <td><i class="el-icon-star-on"></i> <span>巡检周期</span></td>
                        <td>
                            <el-radio v-model="plan.planCycle" @change="getPlanCycle" label="年">年</el-radio>
                            <el-radio v-model="plan.planCycle" @change="getPlanCycle" label="季度">季度</el-radio>
                            <el-radio v-model="plan.planCycle" @change="getPlanCycle" label="月">月</el-radio>
                            <el-radio v-model="plan.planCycle" @change="getPlanCycle" label="周">周</el-radio>
                        </td>
                    </tr>
                     <tr>
                        <td><i class="el-icon-star-on"></i><span>网格区域</span></td>
                        <td class="drawPolygon" @click="drawPolygon_"> <span>点击设置巡检区域(在地图上框选)</span></td>
                    </tr>
                    <tr>
                        <td><i class="el-icon-star-on"></i><span>区域名称</span></td>
                        <td class="drawPolygon" @click="drawPolygon_"> <span>{{polygon_postObj.areaName}}</span></td>
                    </tr>
                      <tr>
                        <td><i class="el-icon-star-on"></i><span>签到点</span></td>
                        <td>
                            <span>{{makeNum}}个</span>
                            <img src="../../assets/images/common/mark.png" alt="">
                            <span class="addPoint" :class="{actived:allowAdd}" @click="addPoint">新增</span>
                        </td>
                    </tr>
                    <tr>
                        <td><i class="el-icon-star-on"></i><span>巡检人员</span></td>
                        <td>
                            <div class="workersTree">
                                <el-tree :data="workers" :props="defaultProps" accordion>
                                </el-tree>
                            </div>
                            <span class="selectBtn" @click="showPeopleModel">选择</span>
                        </td>
                    </tr>
                   
                    <tr>
                        <td><i class="el-icon-star-on"></i><span>巡检方式</span></td>
                        <td>
                            <el-radio v-model="plan.inspectMode" label="0">步行</el-radio>
                            <el-radio v-model="plan.inspectMode" label="1">自行车</el-radio>
                            <el-radio v-model="plan.inspectMode" label="2">摩托车</el-radio>
                            <el-radio v-model="plan.inspectMode" label="3">汽车</el-radio>
                        </td>
                    </tr>
                    <tr>
                        <td><i class="el-icon-star-on"></i><span>巡检内容</span></td>
                        <td>
                            <textarea placeholder="巡检内容" v-model="plan.inspectInfo"></textarea>
                        </td>
                    </tr>
                  
                    <tr>
                        <td><i class="el-icon-star-on"></i><span>备注</span></td>
                        <td>
                            <textarea placeholder="设备专项维护在此备注设备类型" v-model="plan.remarks"></textarea>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="action">
                <div class="save" @click="save" :class="{notAllow:save_flag===true}">保存</div>
                <div class="cancel" @click="cancel">取消</div>
            </div>
        </div>
    </div>
    <div class="gistools" :style="{left:gistools_left+'px'}">
        <tools @handleThisDom="thisDom" @showLayers="toggleSelectThis" :defaultLayers="layers"></tools>
    </div>
    <!-- <div class="legend">
        <div class="turbes">
            <div class="item">
                <div class="col">
                    1
                </div>
                <div>
                    输水管网
                </div>
            </div>
        </div>
        <div class="devs">
            <div class="devItem">
                <div>1</div>
                <div>巡检点</div>
            </div>
        </div>
    </div> -->
    <people-view :showViewModel="showPeopleTreeFlag" :title="'选择人员'" @hiddenSelf="hiddenPeopleModel">
        <div class="peopleSelectTree">
            <div class="peopleTree">
                <shuttle-box @thisWorkers="getWorkers" :defaultWorkers="workersList"></shuttle-box>
            </div>
            <div class="actions">
                <div class="cancel" @click="cancelSelectPeople">取消</div>
                <div class="config" @click="configSelectPeople">确定</div>
            </div>
        </div>
    </people-view>

    <save-status @delThis="closeSaveModel" :showModel="toggleShowSaveStatus" :type="1" :flag="saveFlag" :content="saveMsg"></save-status>
</div>
</template>

<script>
import tools from "@/common/components/gis_units/tools";
import peopleView from "@/common/components/poupe/view";

import saveStatus from "@/common/components/poupe/save_status";

import ShuttleBox from "@/common/components/shuttleBox";

import * as esriLoader from "esri-loader";
import {
    addPlanArea,
    addSignPoint,
    addInspectorPlan,
    addPlanPerson,
    getDepartAndUser
} from "@/api/rushrepair/makePlan";
import {
    uuid_
} from "@/common/utils/uuid";

import {
    Get_lgtd_lttd_dist
} from "@/common/utils/get_lgtd_lttd_dist";

import JudgeTime from "@/common/utils/judgeTime";
esriLoader.loadCss(dse.arcgis_mainCss);
let startJs = dse.arcgis_startJS;
const options = {
    url: startJs,
    dojoConfig: dse.gisConfig
};
let temp_baseUrl = dse.baseURL;
let drawMarkPoint, drawPolygon_;
let temp_staticPath = dse.static_baseUrl; //静态问价路径

let pipeUrl = dse.arcgis_belowMap;
//管网图层配置
import gw2dConfig from '@/common/config/gis2d/gw2dConfig';
gw2dConfig.popupTemplate.visible = false;
import layerUtils from '@/common/utils/layerUtils';


let colors = [
    [243, 104, 56, 0.6],
    [240, 86, 84, 0.6],
    [163, 217, 0, 0.6],
    [46, 78, 126, 0.6],
    [75, 92, 196, 0.6],
    [14, 184, 58, 0.6],
    [0, 51, 113, 0.6],
    [202, 105, 36, 0.6],
    [255, 71, 119, 0.6],
    [62, 237, 231, 0]
];

export default {
     components: {
        tools,
        peopleView,
        saveStatus,
        ShuttleBox
    },
    data() {
        return {
            view: null,
            map: null,
            layers:[],
            contentList: [{
                    value: "1",
                    label: "管道及附属设备"
                },
                {
                    value: "2",
                    label: "消防栓"
                }
            ],
            toggleShowSaveStatus: false, //显示保存状态的弹窗
            saveFlag: false, //保存状态的判断
            saveMsg: "", // 保存状态的提示信息
            contentItem: "", //巡检内容
            showTable: true, //显示左侧窗口
            gistools_left: 380, //gis工具窗口
            allowAdd: false, //允许添加点标记
            makeNum: 0, //标记数量
            areaID: "", //区域ID
            polygon_postObj: {
                //  上传区域的信息
                id: "",
                areaName: "",
                planArea: "",
                areas: 0,
                areaColor: ""
            },
            plan: {
                // 上传计划信息
                id:"", //计划ID
                planName: "",
                planCycle: "",
                inspectPlanDate: "",
                personId: "",
                areaId: "",
                inspectMode: "",
                inspectInfo: "",
                signCode: "",
                patrolineLength: "",
                remarks: "",
                inspectPlanDateEnd: ""
            },
            markPoints: [{
                // 上传点的信息
                pointName: "",
                lgtd: "",
                lttd: "",
                inspectArea: "",
                planID:""
            }],
            addWorkers: [],
            showPeopleTreeFlag: false, // 显示选择人员的弹窗
            peopleTreeSelect: [], //待选的所有员工
            peopleTreeSelected: [],
            peopleSelected_show: null,
            save_success_flagCount: 0, //提交保存的计数器 等于4 才算保存成功
            timer: null, //保存状态轮询
            workers: [], //显示选中的不同部门的工作人员
            defaultProps: {
                children: "userList",
                label: "NAME"
            },
            workersList: [], //初始化的部门员工列表
            post_workers: null,
            post_workerList: [],
            save_flag:false, // 点击保存后关闭保存按钮 默认是 可以点击的
        };
    },
    methods: {
        toggleShow() {
            this.showTable = !this.showTable;
            if (!this.showTable) {
                this.gistools_left = 20;
            } else {
                this.gistools_left = 380;
            }
        },
        closeSaveModel(val) {
            this.toggleShowSaveStatus = val.modelFlag;
        },
        getPlanArea() {
            let that = this;
            let temp_areaId = this.polygon_postObj.id;
            let temp_areaName = this.polygon_postObj.areaName;
            let temp_planArea = this.polygon_postObj.planArea;
            let temp_areage = this.polygon_postObj.areas;
            let temp_areaColor = this.polygon_postObj.areaColor;
            let temp_planID = this.plan.id;
            addPlanArea({
                    id: "" + temp_areaId,
                    areaName: "" + temp_areaName,
                    planArea: "" + temp_planArea,
                    areas: temp_areage,
                    areaColor: "" + temp_areaColor,
                    planId:""+temp_planID
                })
                .then(res => {
                    if (res.msg == "no user") {
                        window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
              dse.baseURL
            }?id=${id}`;
                        return;
                    }
                    if (res.msg == "操作失败") {
                        that.$message.error("服务错误!");
                        return;
                    }
                    if (res) {
                        if (res.status == 1) {
                            that.save_success_flagCount = that.save_success_flagCount + 1;
                        }else{
                            that.save_flag = false
                        }
                    }
                })
                .catch(error => {
                   console.log(error)
                });
        },
        getSignPoint() {
            let that = this;
            let temp_addList = this.markPoints;
            addSignPoint(temp_addList)
                .then(res => {
                    if (res.msg == "no user") {
                        window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
              dse.baseURL
            }?id=${id}`;
                        return;
                    } else if (res.msg == "操作失败") {
                        that.$message.error("服务错误!");
                        return;
                    } else if (res) {
                        if (res.status == 1) {
                            that.save_success_flagCount = that.save_success_flagCount + 1;
                        }else{
                            that.save_flag = false
                        }
                    }
                })
                .catch(error => {
                   console.log(error)
                });
        },
        getInspectorPlan() {
            let that = this;
            let temp_areaId = this.polygon_postObj.id;
            let temp_dis = 0;
            if (that.markPoints.length) {
                let len = that.markPoints.length;
                for (let i = 0; i < len; i++) {
                    if (i <= len - 2 && len >= 2) {
                        let lgtd1 = that.markPoints[i].lgtd;
                        let lttd1 = that.markPoints[i].lttd;
                        let lgtd2 = that.markPoints[i + 1].lgtd;
                        let lttd2 = that.markPoints[i + 1].lttd;
                        temp_dis += new Get_lgtd_lttd_dist.getInstance(
                            lgtd1,
                            lttd1,
                            lgtd2,
                            lttd2
                        ).getDistance();
                    }
                }
            }
            addInspectorPlan({
                    id:""+that.plan.id,
                    planName: "" + that.plan.planName,
                    planCycle: "" + that.plan.planCycle,
                    inspectPlanDate: "" + that.plan.inspectPlanDate,
                    areaId: "" + temp_areaId,
                    inspectMode: "" + that.plan.inspectMode,
                    inspectInfo: "" + that.plan.inspectInfo,
                    signCode: "" + that.plan.signCode,
                    patrolineLength: temp_dis,
                    remarks: "" + that.plan.remarks,
                    inspectPlanDateEnd: "" + that.plan.inspectPlanDateEnd,
                    signNum: "" + that.makeNum,
                    useStatus: "1"
                })
                .then(res => {
                    if (res.msg == "no user") {
                        window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
              dse.baseURL
            }?id=${id}`;
                        return;
                    } else if (res.msg == "操作失败") {
                        that.$message.error("服务错误!");
                        return;
                    } else if (res) {
                        if (res.status == 1) {
                            that.save_success_flagCount = that.save_success_flagCount + 1;
                        }else{
                            that.save_flag = false
                        }
                    }
                })
                .catch(error => {
                   console.log(error)
                });
        },
        getInspectorInfo() {
            //保存人员
            let that = this;
            let post_workers_ = this.post_workerList;
            addPlanPerson(post_workers_)
                .then(res => {
                    if (res.msg == "no user") {
                        window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
              dse.baseURL
            }?id=${id}`;
                        return;
                    } else if (res.msg == "操作失败") {
                        that.$message.error("服务错误!");
                        return;
                    } else if (res) {
                        if (res.status == 1) {
                            that.save_success_flagCount = that.save_success_flagCount + 1;
                        }else{
                            that.save_flag = false
                        }
                    }
                })
                .catch(error => {
                   console.log(error)
                });
        },
        save() {
            let that = this;
                if(this.save_flag===true){
                    return
                }
                this.save_flag = true;

                if(this.makeNum==0){
                    this.$message.error("请添加签到点!")
                    this.save_flag = false
                    return
                }
                if(this.post_workerList.length>that.markPoints.length){
                    this.$message.error("巡检人数不能大于签到点数!");
                     this.save_flag = false
                    return 
                }
               
                if(this.post_workerList.length==0){
                    this.$message.error("请添加派工人员!")
                     this.save_flag = false
                    return
                }
                if(this.plan.planName===""){
                    this.$message.error("请填写计划名字!")
                     this.save_flag = false
                    return
                }
              this.getPlanArea();
              this.getInspectorPlan();
              this.getInspectorInfo();
              this.getSignPoint();
              that.timer = setInterval(() => {
                if (that.save_success_flagCount == 4) {
                  that.toggleShowSaveStatus = true;
                  that.saveFlag = true;
                  that.saveMsg = "保存成功!";
                  setTimeout(() => {
                    that.$router.push({
                      name: "pipe_rushrepair_information"
                    });
                    that.$store.commit("setAside_status", true);
                    that.$emit("showAside");
                  }, 2100);
                  clearInterval(that.timer);
                }else{
                    that.save_flag = false;
                }
              }, 1000);
        },
        cancel() {
            let that = this;
            this.$router.push({
                name: "pipe_rushrepair_information"
            });
            this.$store.commit("setAside_status", true);
            this.$emit("showAside");
        },
        createMap(position) {
            let that = this;
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
                        "esri/geometry/Polygon",
                        "esri/tasks/QueryTask",
                        "esri/tasks/support/Query",
                        "esri/symbols/SimpleFillSymbol",
                        "dse/utils/BaseMapUtils",
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
                        Polygon,
                        QueryTask,
                        Query,
                        SimpleFillSymbol,
                        BaseMapUtils
                    ]) => {
                        layerUtils.bindAmdClass(QueryTask, Query, GraphicsLayer, Graphic);
                         let point_iframe_url = `${temp_baseUrl}/?id=${id}#/pipe/rushrepair/gisFrame_plan_point`; // 生产环境
                         let area_iframe_url =`${temp_baseUrl}/?id=${id}#/pipe/rushrepair/gisFrame_plan_area`; // 生产环境
                         let iframe_area =`<iframe src="${area_iframe_url}" height="240" width="460"  scrolling="no" frameborder="0"></iframe>`;
                         let iframe_point =`<iframe src="${point_iframe_url}" height="240" width="460"  scrolling="no" frameborder="0"></iframe>`;
                        // Create the map
                        that.map = new Map({
                            // basemap: "satellite",
                            // ground: "world-elevation"
                        });
                        
                        let baseMapUtils = new BaseMapUtils({
                            map: that.map,
                            mapType: '2'
                        });

                        //debugger;
                        baseMapUtils.loadBaseLayers(dse.baseMapLayers);

                         // 管网图层.
                        // debugger;
                        let pipeUrl = that.$store.getters.get_pipe_defaultLayer
                        gw2dConfig.url = pipeUrl;
                        gw2dConfig.popupTemplate.visible = false;
                        that.copy_pipe=that.layer1 = layerUtils.loadData(that.map, gw2dConfig);
                        //===================================================

                        that.view = new MapView({
                            container: "gis",
                            map: that.map,
                            zoom: 15,
                            center: position,
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
                        let _Polygon = new Draw({
                            view: that.view
                        });

                        let randomColor_ = null;
                        drawPolygon_ = function (randomColor) {
                            randomColor_ = randomColor;
                            that.view.popup.close();
                            that.view.graphics.removeAll();
                            let action = _Polygon.create("polygon");
                            // , {
                            //     mode: "click"
                            // }
                            that.view.focus();
                            action.on("vertex-add", drawPolygon);
                            // console.log("测试看看")
                            // action.on("cursor-update", drawPolygon);
                            // action.on("vertex-remove", drawPolygon);
                            action.on("draw-complete", finish);
                        };
                        let centerPoint = ""; //面的中心点
                        let sumArea = ""; // 面的面积
                        let vertices = null; //面的角点数据
                        function drawPolygon(evt) {
                            // console.log(evt);
                            vertices = evt.vertices;
                            that.view.graphics.removeAll();
                            let polygon = createPolygon(vertices);
                            let graphic = createGraphic(polygon);
                            that.view.graphics.add(graphic);
                            that.allowAdd = true;
                            centerPoint = polygon.centroid;
                            sumArea = geometryEngine.geodesicArea(polygon, "square-meters");

                            if (sumArea <= 0) {
                                let simplifiedPolygon = geometryEngine.simplify(polygon);
                                if (simplifiedPolygon) {
                                    sumArea = geometryEngine.geodesicArea(
                                        simplifiedPolygon,
                                        "square-meters"
                                    );
                                }
                            }
                            labelAreas(polygon, sumArea);
                        }

                        function finish() {
                            let area = sumArea;
                            if (area > 0) {
                                dse.globalData = parseFloat(area) / 1000000;
                                that.makeNum = 0;
                                that.markPoints = [];
                                that.view.popup.close();
                                that.view.popup.open({
                                    title: "区域",
                                    content: "" + iframe_area,
                                    location: centerPoint
                                });
                            }
                        }

                        function createPolygon(vertices) {
                            return new Polygon({
                                rings: vertices,
                                spatialReference: that.view.spatialReference
                            });
                        }

                        function createGraphic(polygon) {
                            let graphic = new Graphic({
                                geometry: polygon,
                                symbol: {
                                    type: "simple-fill",
                                    color: randomColor_,
                                    style: "solid",
                                    outline: {
                                        color: [255, 255, 255, 0.5],
                                        width: 2
                                    }
                                }
                            });
                            return graphic;
                        }

                        function labelAreas(geom, area) {
                            let temp_area = parseFloat(area) / 1000000;
                            let graphic = new Graphic({
                                geometry: geom.centroid,
                                symbol: {
                                    type: "text",
                                    color: "white",
                                    haloColor: "black",
                                    haloSize: "1px",
                                    text: temp_area.toFixed(2) + " 平方千米",
                                    xoffset: 3,
                                    yoffset: 3,
                                    font: {
                                        // autocast as Font
                                        size: 14,
                                        family: "sans-serif"
                                    }
                                }
                            });

                            that.polygon_postObj.areas = parseFloat(area) / 1000000;
                            that.polygon_postObj.planArea = JSON.stringify({
                                spatialReference: {
                                    wkid: 4326
                                },
                                paths: [vertices]
                            });
                            that.view.graphics.add(graphic);
                        }
                        drawMarkPoint = function () {
                            let drawPoint = new Draw({
                                view: that.view
                            });
                            let action = drawPoint.create("point");
                            // , {
                            //     mode: "click"
                            // }
                            // action.on("cursor-update", function (evt) {
                            //     createPointGraphic(evt.coordinates);
                            // });
                            action.on("draw-complete", function (evt) {
                                createPointGraphic(evt.coordinates);
                            });
                        };

                        function createPointGraphic(coordinates) {
                            // that.view.graphics.removeAll();
                            let point = {
                                type: "point",
                                x: coordinates[0],
                                y: coordinates[1],
                                spatialReference: that.view.spatialReference
                            };
                            that.makeNum = that.makeNum + 1;

                            let graphic = new Graphic({
                                geometry: point,
                                attributes: that.makeNum,
                                symbol: {
                                    type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                                    url: `${temp_staticPath}/gis_temporary_pic/mark_normal.svg`,
                                    width: "20px",
                                    height: "20px"
                                }
                            });
                            let motherGeometry = that.view.graphics.items[0].geometry;
                            let temp_geometry = graphic.geometry;
                            let flag = geometryEngine.contains(motherGeometry, temp_geometry);
                            if (flag) {
                                that.view.graphics.add(graphic);
                                that.markPoints.push({
                                    lttd: graphic.geometry.latitude,
                                    lgtd: graphic.geometry.longitude,
                                    pointName: "",
                                    inspectArea: that.polygon_postObj.id,
                                    planId:""+that.plan.id
                                });
                                dse.globalData = {
                                    latitude: graphic.geometry.latitude,
                                    longitude: graphic.geometry.longitude,
                                    pointIndex: that.makeNum
                                };
                                that.view.popup.open({
                                    title: "签到点",
                                    content: "" + iframe_point,
                                    location: point
                                });
                            }else{
                                 that.makeNum = that.makeNum -1;
                            }
                        }
                    }
                );
        },
        toggleSelectThis(val) {
            let that = this;
            let temp_list = val;
            for (let i = 0; i < temp_list.length; i++) {
                if (temp_list[i].active) {
                    switch (temp_list[i].name) {
                        case "管网":
                            that.map.add(that.layer1);
                            break;
                        case "阀门":
                            that.map.add(that.layer2);
                            break;
                        case "消防栓":
                            // that.view.graphics.removeAll();
                            that.map.add(that.layer3);
                            break;
                        case "监测仪器":
                            // that.map.add(that.layer1);
                            break;
                        case "其它":
                            // that.map.add(that.layer1);
                            break;
                    }
                } else {
                    switch (temp_list[i].name) {
                        case "管网":
                            that.map.remove(that.layer1);
                            break;
                        case "阀门":
                            that.map.remove(that.layer2);
                            break;
                        case "消防栓":
                            that.map.remove(that.layer3);
                            break;
                        case "监测仪器":
                            // that.map.remove(that.layer1);
                            break;
                        case "其它":
                            // that.map.remove(that.layer1);
                            break;
                    }
                }
            }
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
                    that.distance.clear();
                    that.area.clear();
                    that.distance.start();
                    break;
                case "测面":
                    that.distance.clear();
                    that.area.clear();
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
        drawPolygon_() {
            let that = this;
            this.view.graphics.removeAll();
            let num = 1+Math.round(10*Math.random());
            if(num==11){
                num = 10
            }
            num = num-1
            let randomColor = colors[num];
            that.polygon_postObj.areaColor = JSON.stringify(randomColor);
            drawPolygon_(randomColor);
            window.this_ = this;
        },
        addPoint() {
            if(this.polygon_postObj.areaName){
               drawMarkPoint();
            }
        },
        hiddenPeopleModel(flag) {
            this.showPeopleTreeFlag = flag;
        },
        showPeopleModel() {
            this.showPeopleTreeFlag = true;
        },
        cancelSelectPeople() {
            this.showPeopleTreeFlag = false;
        },
        configSelectPeople() {
            this.showPeopleTreeFlag = false;
            this.peopleSelected_show = this.selected;
        },
        getWorkers(val) {
            this.workers = val;
            this.formatePostWorkers();
        },
        formatePostWorkers() {
            let that = this;
            let temp_arr = this.workers;
            let temp_post = [];
            if (temp_arr.length) {
                for (let i = 0; i < temp_arr.length; i++) {
                    for (let j = 0; j < temp_arr[i].userList.length; j++) {
                        temp_post.push({
                            planId: "" + that.plan.id,
                            personId: "" + temp_arr[i].userList[j].ID
                        });
                    }
                }
            }
            that.post_workerList = temp_post;
        },
        getDepartAndUser_() {
            let that = this;
            let orgID = that.$store.getters.get_companyId;
            getDepartAndUser({
                    OrganizationId: "" + orgID
                })
                .then(res => {
                    if (res.msg == "no user") {
                        window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
              dse.baseURL
            }?id=${id}`;
                        return;
                    }
                    if (res.msg == "操作失败") {
                        that.$message.error("服务错误!");
                        return;
                    }
                    let temp_arr = res.data || [];
                    if (res.data) {
                        for (let i = 0; i < temp_arr.length; i++) {
                            temp_arr[i].action = false;
                            temp_arr[i].showSub = false;
                            for (let j = 0; j < temp_arr[i].userList.length; j++) {
                                temp_arr[i].userList[j].action = false;
                            }
                        }
                    }
                    that.workersList = temp_arr;
                })
                .catch(error => {
                    // if (error == "Error: Network Error") {
                    //     that.$message.error("网络错误");
                    //     return;
                    // } else {
                    //     that.$message.error("逻辑错误!");
                    // }
                });
        },
        getPlanCycle(val) {
            let that = this;
            let timeFormate = null;
            switch (val) {
                case "年":
                    timeFormate = new JudgeTime("1");
                    // that.plan.inspectPlanDate = "2018/11/01" + " " + "00:01";
                    // that.plan.inspectPlanDateEnd = "";
                    that.plan.inspectPlanDate = (timeFormate.formateTime()).startTime+" "+"00:00:01"
                    that.plan.inspectPlanDateEnd = (timeFormate.formateTime()).endTime+" "+"23:23:59"
                    break;
                case "季度":
                    timeFormate = new JudgeTime("2");
                    // that.plan.inspectPlanDate = "2018/11/01" + " " + "00:01";
                    // that.plan.inspectPlanDateEnd = "";

                    that.plan.inspectPlanDate = (timeFormate.formateTime()).startTime+" "+"00:00:01"
                    that.plan.inspectPlanDateEnd = (timeFormate.formateTime()).endTime+" "+"23:23:59"
                    break;
                case "月":
                    timeFormate =new  JudgeTime("3");
                    // that.plan.inspectPlanDate = "2018/11/01" + " " + "00:01";
                    // that.plan.inspectPlanDateEnd = "";
                    
                    that.plan.inspectPlanDate = (timeFormate.formateTime()).startTime+" "+"00:00:01"
                    that.plan.inspectPlanDateEnd = (timeFormate.formateTime()).endTime+" "+"23:23:59"
                    break;
                case "周":
                    timeFormate = new JudgeTime("4");
                    // that.plan.inspectPlanDate = "2018/11/01" + " " + "00:01";
                    // that.plan.inspectPlanDateEnd = "";
                    that.plan.inspectPlanDate = (timeFormate.formateTime()).startTime+" "+"00:00:01"
                    that.plan.inspectPlanDateEnd = (timeFormate.formateTime()).endTime+" "+"23:23:59"
                    break;
            }
        }
    },
    computed: {
        selected: function () {
            let temp_select = this.peopleTreeSelected;
            let temp_arr = this.peopleTreeSelect;
            let temp_str = "";
            for (let i = 0; i < temp_select.length; i++) {
                for (let j = 0; j < temp_arr.length; j++) {
                    if (temp_arr[j].key == temp_select[i]) {
                        temp_str += temp_arr[j].label + ",";
                        break;
                    }
                }
            }
            return temp_str;
        }
    },
    mounted() {
         let  potions = this.$store.getters.get_cityPosition
        if(potions.length===0){
            potions = [106.290351, 36.001819]
        }
        this.createMap(potions);
        let companyID = this.$store.getters.get_companyId;
        this.getDepartAndUser_();
    },
    beforeDestroy() {
        this.$router.push({
            name: "pipe_rushrepair_information"
        });
        this.$store.commit("setAside_status", true);
        this.$emit("showAside");
    },
    created() {
        let that = this;
        // this.getWorkers();
        // let orgId = JSON.stringify(sessionStorage.getItem("user"))
        that.polygon_postObj.id = uuid_(32, 32);
        that.plan.id  = uuid_(32,32);
    }
};
</script>

<style lang="scss" scoped>
$baseFont: 14px;
$baseColor: #333;
$baseBorderColor: #ccc;
$baseBg: #fff;
#makePlan {
    width: 100%;
    height: 100%;
    position: relative;
    i{
        color: red;
    }
    input {
        padding-left: 10px;
    }
    input::-webkit-input-placeholder {
        color: #ccc;
    }
    input::-moz-placeholder {
        color: #ccc;
    }
    input:-ms-input-placeholder {
        color: #ccc;
    }
    textarea {
        border: 1px solid #ccc;
        border-radius: 5px;
        padding-left: 10px;
    }
    .peopleSelectTree {
        width: 100%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .peopleTree {
            width: 100%;
            display: flex;
            justify-content: center;
        }
        .actions {
            width: 100%;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            div {
                display: inline-block;
                padding: 0 20px;
                background: #0b83fe;
                line-height: 30px;
                border-radius: 5px;
                cursor: pointer;
                margin-left: 10px;
                color: #fff;
            }
        }
    }
    #gis {
        width: 100%;
        height: 100%;
    }
    .leftWrap {
        position: absolute;
        left: 10px;
        top: 10px;
        height: calc(100% - 20px);
        .toggleBar {
            position: absolute;
            top: 50%;
            right: -24px;
            width: 24px;
            height: 88px;
            line-height: 88px;
            border: 1px solid $baseBorderColor;
            cursor: pointer;
            text-align: center;
            background: #fff;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
        }
        .innerWrap {
            width: 350px;
            height: 100%;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            font-size: $baseFont;
            color: $baseColor;
            background: $baseBg;
            .topHead {
                width: 100%;
                padding: 10px;
                span:first-child {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    background: #05beb8;
                    margin-right: 10px;
                } // border-bottom: 1px solid $baseBorderColor;
                margin-bottom: 10px;
            }
            .tableContent {
                width: 100%;
                height: calc(100% - 80px);
                overflow-y: auto;
                table {
                    width: 100%;
                    border-spacing: 0;
                    text-align: center;
                    border-top: 1px solid #ccc;
                    tr {
                        width: 100%;
                        td {
                            // padding: 2px;
                            border-bottom: 1px solid #ccc;
                            width: 80px;
                            line-height: 30px;
                            position: relative; // display: flex;
                            // align-items: center;
                            &:last-child {
                                width: calc(100% - 80px);
                            }
                            &:first-child {
                                background: #d6fafa;
                                font-weight: 600;
                            }
                            input {
                                display: inline-block;
                                width: 80%;
                                border: 1px solid #ccc;
                                line-height: 20px;
                                border-radius: 5px;
                                padding-right: 5px;
                            }
                            .el-date-editor {
                                width: 80%;
                            }
                            .el-select {
                                width: 80%;
                            }
                            textarea {
                                display: inline-block;
                                margin-top: 10px;
                                min-height: 80px;
                                width: 80%;
                                resize: none;
                            }
                            span.addPoint {
                                display: inline-block;
                                padding: 0 5px;
                                line-height: 20px;
                                background: gray;
                                color: #fff;
                                cursor: pointer;
                                border-radius: 3px;
                                margin-left: 20px;
                                &.actived {
                                    background: #0b83fe;
                                }
                            }
                            &.drawPolygon {
                                cursor: pointer;
                            }
                            img {
                                width: 16px;
                                vertical-align: middle;
                            }
                            .selectBtn {
                                display: inline-block;
                                padding: 0px 10px;
                                background: #0b83fe;
                                line-height: 25px;
                                color: #fff;
                                cursor: pointer;
                                border-radius: 5px;
                                position: absolute;
                                right: 10px;
                                top: 3px;
                            }
                            .peoples {
                                display: inline-block;
                                width: calc(100% - 80px);
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                text-align: center;
                                margin-right: 50px; // margin-top: 5px;
                            }
                        }
                    }
                }
            }
            .action {
                width: 100%;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #fff7f8;
                div {
                    height: 30px;
                    padding: 0 20px;
                    margin-right: 10px;
                    line-height: 30px;
                    border-radius: 5px;
                    cursor: pointer;
                    &.save {
                        background: #0b83fe;
                        color: #fff;
                        &.notAllow{
                            background: gray;
                            cursor: not-allowed;
                        }
                    }
                    &.cancel {
                        background: #ccccce;
                    }
                }
            }
        }
    }
    .gistools {
        position: absolute;
        height: 30px;
        top: 20px;
        width: 325px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        background: #fff;
        border-radius: 5px;
    }
    .legend {
        width: 300px;
        height: 300px;
        position: absolute;
        right: 20px;
        bottom: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        padding: 10px;
        font-size: $baseFont;
        color: $baseColor;
        .turbes {
            width: 100%;
            height: 200px;
            overflow-y: auto;
            .item {
                height: 25px;
                display: flex;
                align-items: center;
                div {
                    width: 50%;
                    text-align: center;
                }
            }
        }
        .devs {
            width: 100%;
            height: calc(100% - 200px);
            overflow-x: auto;
            display: flex;
            justify-content: flex-start;
            .devItem {
                width: 60px;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                div {
                    margin-bottom: 10px;
                }
            }
        }
    }
}
</style>
