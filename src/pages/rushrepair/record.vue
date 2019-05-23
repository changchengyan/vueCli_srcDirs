<template>
<div id="record">
    <div class="topHead">
        <div class="col">
            <span class="rect"></span>
            <span>{{planName}}管线巡查记录</span>
        </div>
        <div class="col">
            <span class="goback" @click="goback">返回</span>
        </div>
    </div>
    <div class="recordTable">
        <div class="inner-wrap">
            <div class="recordList">
                <div class="item">
                    <div class="sm"><span>巡检人员</span></div>
                    <div class="lastCeil"><span>{{routingCheck_recordList.userName||""}}</span></div>
                    <div class="sm"><span>巡检计划名称</span></div>
                    <div><span>{{routingCheck_recordList.planName||""}}</span></div>
                </div>
                <div class="item">
                    <div><span>巡检区域名称</span></div>
                    <div><span>{{routingCheck_recordList.areaName||""}}</span></div>
                    <div><span>巡线长度</span></div>
                    <div><span>{{routingCheck_recordList.inspectLength||0}} Km</span></div>
                </div>
                <div class="item">
                    <div><span>今日签到点</span></div>
                    <div><span>{{routingCheck_recordList.sumNowCount}}</span></div>
                    <div><span>累计签到点</span></div>
                    <div><span>{{routingCheck_recordList.sumCount}}</span></div>
                </div>
                <div class="item">
                    <div><span>开始时间</span></div>
                    <div><span>{{routingCheck_recordList.startTime}}</span></div>
                    <div><span>结束时间</span></div>
                    <div><span>{{routingCheck_recordList.endTime}}</span></div>
                </div>
                <div class="item">
                    <div><span>在线时长</span></div>
                    <div><span>{{routingCheck_recordList.leadTime}} 小时</span></div>
                    <div><span>平均速度</span></div>
                    <div><span>{{inspectSpeed}} Km/h</span></div>
                </div>
                <div class="item">
                    <div><span>巡检进度</span></div>
                    <div>
                        <div class="progress">
                            <span class="innerProgress" :style="{width:routingCheck_recordList.sumNum+'%'}"></span>
                        </div>
                        <span>{{routingCheck_recordList.sumNum}}%</span>
                    </div>
                    <div><span>轨迹回放</span></div>
                    <div @click="playGisTrail">
                        <img class="play" src="../../assets/images/common/play.png" alt="">
                    </div>
                    </div>
                    <div class="item">
                        <div><span>巡检方式</span></div>
                        <div><span>{{routingCheck_recordList.inspectMode|trans_type}}</span></div>
                        <div><span>隐患个数</span></div>
                        <div><span>{{routingCheck_recordList.probCount}} 个</span></div>
                    </div>
                </div>
                <div id="map_wrap"></div>
            </div>
        </div>
        <div class="topHead">
            <div class="col">
                <span class="rect"></span>
                <span>隐患详情</span>
            </div>
        </div>
        <div class="recordTable">
            <div class="desc">
                <div class="content-head">
                    <div class="sm"><span>序号</span></div>
                    <div class="md"><span>隐患上报时间</span></div>
                    <div class="sm"><span>隐患编号</span></div>
                    <div class="sm"><span>紧急程度</span></div>
                    <div class="bg"><span>隐患描述</span></div>
                    <div class="bg"><span>隐患地点</span></div>
                    <div class="bg"><span>现场照片</span></div>
                    <div class="sm"><span>定位</span></div>
                    <div class="sm"><span>隐患状态</span></div>
                </div>
                <div class="contentList">
                    <div class="contentItem" v-for="(item,index) in problemsData" :key="index">
                        <div class="sm"><span>{{index+1}}</span></div>
                        <div class="md"><span>{{item.reportTime}}</span></div>
                        <div class="sm"><span>{{item.probCode}}</span></div>
                        <div class="sm">
                            <template v-if="item.probLevel=='0'">
                                <span class="status level3">紧急</span>
                            </template>
                            <template v-if="item.probLevel=='1'">
                                <span class="status level2">较急</span>
                            </template>
                            <template v-if="item.probLevel=='2'">
                                <span class="status level1">一般</span>
                            </template>
                        </div>
                        <div class="bg"><span>{{item.descrip}}</span></div>
                        <div class="bg" :title="item.place"><span>{{item.place}}</span></div>
                        <div class='bg between' @click="showPicModel_(index)">
                            <template v-for="(val,i) in item.file" >
                                <img  :src="filePath+val.filePath" alt=""   v-if="i<=2" :key="i">
                            </template>
                        </div>
                            <div class="sm position" @click="showPositionGis(item.lgtd,item.lttd)">
                                <img class="position" src="../../assets/images/common/position.png" alt="">
                            </div>
                                <div class="sm">
                                    <template v-if="item.probStatus=='0'">
                                        <span class="actionStatus">未核实</span>
                                    </template>
                                    <template v-if="item.probStatus=='1'">
                                        <span class="actionStatus">已核实</span>
                                    </template>
                                    <template v-if="item.probStatus=='2'">
                                        <span class="actionStatus">已派单</span>
                                    </template>
                                    <template v-if="item.probStatus=='3'">
                                        <span class="actionStatus">处理中</span>
                                    </template>
                                    <template v-if="item.probStatus=='4'">
                                        <span class="actionStatus">已处理</span>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <pic-slider :showViewModel='showPicModel' :title="'图片'" @hiddenSelf="hiddenPicModel">
                    <div class="slider">
                        <el-carousel :interval="5000" arrow="always">
                            <el-carousel-item v-for="(item,index) in carousel " :key="index">
                                <img :src="filePath+item.filePath" alt="">
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </pic-slider>
            </div>
</template>

<script>
import gisPositionModel from "@/common/components/poupe/view"
import gisTrailModel from "@/common/components/poupe/view"
import picSlider from "@/common/components/poupe/view"

import * as esriLoader from "esri-loader";
esriLoader.loadCss(dse.arcgis_mainCss);
let startJs = dse.arcgis_startJS;
const options = {
    url: startJs,
    dojoConfig: dse.gisConfig
};
import {
    queryInspectionInfo
} from "@/api/rushrepair/information";
import Arcgis_mkt_jwd from "@/common/utils/arcgis_mkt_jwd"

let pipeUrl = dse.arcgis_belowMap;

// 二维管网相关.
import popupUtils from '@/common/utils/popupUtils';
//管网图层配置
import gw2dConfig from '@/common/config/gis2d/gw2dConfig';
import layerUtils from '@/common/utils/layerUtils';

let drawLine = null //画轨迹的函数
export default {
    components: {
        gisPositionModel,
        gisTrailModel,
        picSlider
    },
    data() {
        return {
            filePath: "", // 网络文件初始路径
            planName:"", //计划的名字
            view: null, //gis 视图的实例
            map: null, //gis 地图类型的实例
            routingCheckTotolPage: 1,
            problemPosition_point: null, //隐患位置的点位
            newGraphicsLayer_line: null, //轨迹线图层
            base_lineLayer:null, // 巡检人员的轨迹线
            newGraphicsLayer_peoplePoints: null, //定位点
            routingCheck_recordList: {
                areaName: "",
                endTime: "",
                inspectDate: "",
                inspectLength: "",
                inspectMode: "",
                inspectSpeed: "",
                leadTime: 0,
                nowEndTime: "",
                nowStartTime: "",
                planId: "",
                planName: "",
                recordId: "",
                startTime: "",
                sumCount: 0,
                userName: "",
                probCount: 0,
                sumNowCount: 0,
                sumNum: 0

            },
            problemsData: [], //隐患详情列表
            showPicModel: false, //显示图片轮播的弹窗
            carousel: [], //轮播图
            person_remrks: [], //人的轨迹
            persional_focus: [], //地图聚焦
            inspectSpeed: null, //平均速度
            errorPoints:[], //隐患点的坐标点集合
        }
    },
    methods: {
        goback() {
            this.$router.push({
                name: "pipe_rushrepair_information"
            });
            this.$store.commit("setAside_status", true);
            this.$emit("showAside");
            this.$emit("activedTab", 3);
        },
        showPositionGis(lgtd, lttd) {
            let points = [lgtd, lttd]
            setTimeout(() => {
                this.createMap("gisPosition", points);
            }, 1000)
        },

        playGisTrail() {
            // let points = [106.299599, 36.007376]
            let points = this.persional_focus
            setTimeout(() => {
                this.createMap("gisTrail", points);
            }, 1000)
        },
        createMap(id,positions) {
            let that = this;
            esriLoader
                .loadModules(
                    [
                        "dojo/on",
                        "esri/Map",
                        "esri/views/MapView",
                        "esri/layers/FeatureLayer",
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
                        "esri/geometry/Point",
                        "dse/utils/BaseMapUtils",
                        "esri/geometry/support/webMercatorUtils",
                        "esri/geometry/SpatialReference",
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
                        Point,
                        BaseMapUtils,
                        webMercatorUtils,
                        SpatialReference
                    ]) => {
                        let wellBuffer, wellsGeometries, magnitude;
                        layerUtils.bindAmdClass(QueryTask, Query, GraphicsLayer, Graphic);

                        let sp4326 = new SpatialReference({
                                wkid: 4326
                        });

                        // Create the map
                        that.map = new Map({
                            // basemap: "osm",
                        });
                        let baseMapUtils = new BaseMapUtils({
                            map: that.map,
                            mapType: '2'
                        });
                        //debugger;
                        baseMapUtils.loadBaseLayers(dse.baseMapLayers);

                         // 管网图层.
                        gw2dConfig.url = that.$store.getters.get_pipe_defaultLayer;
                        gw2dConfig.popupTemplate.visible = false;
                        that.layer1 = layerUtils.loadData(that.map, gw2dConfig);

                        that._changeBaseLayer('gvec');

                        that.problemPosition_point = new GraphicsLayer({
                            graphics: []
                        })

                        that.map.add(that.problemPosition_point);
                        that.newGraphicsLayer_line = new GraphicsLayer({
                            graphics: []
                        })
                        that.map.add(that.newGraphicsLayer_line);
                        that.newGraphicsLayer_peoplePoints = new GraphicsLayer({
                            graphics: []
                        })
                        that.map.add(that.newGraphicsLayer_peoplePoints);

                        // 巡检人员的轨迹全程基线
                        that.base_lineLayer = new GraphicsLayer({
                            graphics: []
                        })
                        that.map.add(that.base_lineLayer);


                        that.view = new MapView({
                            container: "map_wrap",
                            map: that.map,
                            zoom: 17,
                            // center: [106.290351, 36.001819],
                            center:positions.length>0?positions:[106.290351, 36.001819],
                            highlightOptions: {
                                color: [255, 255, 0, 1],
                                haloOpacity: 0.9,
                                fillOpacity: 0.2
                            }
                        });
                        // if (id == "gisPosition") {
                        //     let mkt_arr = new Arcgis_mkt_jwd(points).lonlat2mercator();
                        //     let problem_points = new Graphic({
                        //         geometry: {
                        //             type: "point", // autocasts as /Point
                        //             x: mkt_arr[0],
                        //             y: mkt_arr[1],
                        //             spatialReference: {
                        //                 wkid: 102100
                        //             }
                        //         },
                        //         symbol: {
                        //             type: "picture-marker",
                        //             url: `${dse.baseURL}/static/gis_temporary_pic/position.png`,
                        //             width: "50px",
                        //             height: "50px"
                        //         }

                        //     })
                        //     that.problemPosition_point.add(problem_points);
                        // }

                        if (id == "gisTrail") {
                            let movePoints = [];
                            let animateNum = 0;
                            let graphicLine = null;
                            let peopleMan_points = null; // 小人的坐标点
                            drawLine = function (index) {
                                let test_points_ = that.person_remrks
                                if (test_points_.length > 0 && index <= test_points_.length - 2) {
                                    movePoints = [];
                                    movePoints.push(
                                        test_points_[index],
                                        test_points_[index + 1]
                                    )
                                    graphicLine = new Graphic({
                                        geometry: new Polyline({
                                            paths: movePoints,
                                            spatialReference: that.view.spatialReference
                                        }),
                                        symbol: {
                                            type: "simple-line", // autocasts as new SimpleFillSymbol
                                            color: "red",
                                            width: 0.5,
                                            cap: "round",
                                            join: "round"
                                        }
                                    });
                                    that.newGraphicsLayer_line.add(graphicLine);
                                    peopleMan_points = new Graphic({
                                        geometry: {
                                            type: "point", // autocasts as /Point
                                            x: test_points_[index + 1][0],
                                            y: test_points_[index + 1][1],
                                            spatialReference: that.view.spatialReference
                                        },
                                        symbol: {
                                            type: "picture-marker",
                                            url: `${dse.baseURL}/static/gis_temporary_pic/inspector-me.svg`,
                                            width: "25px",
                                            height: "25px"
                                        }
                                    })
                                    that.newGraphicsLayer_peoplePoints.removeAll();
                                    that.newGraphicsLayer_peoplePoints.add(peopleMan_points);
                                } else {
                                    clearInterval(that.timer);
                                }
                            }
                            if (this.person_remrks.length > 0) {
                                that.timer = setInterval(() => {
                                    drawLine(animateNum);
                                    animateNum++;
                                }, 3000)
                            }
                        }
                        function errorPoint() {
                            let temp_arr = that.errorPoints
                            let formate_points = []
                            for(let j=0;j<temp_arr.length;j++){
                                  let mp = new Point(temp_arr[j][0], temp_arr[j][1], sp4326);
                                    mp = new webMercatorUtils.geographicToWebMercator(mp);
                                    formate_points.push([mp.x,mp.y])
                            }
                            for (let i = 0; i < formate_points.length; i++) {
                                let problem_points = new Graphic({
                                    geometry: {
                                        type: "point", // autocasts as /Point
                                        x: formate_points[i][0],
                                        y: formate_points[i][1],
                                        spatialReference: {
                                            wkid: 102100
                                        }
                                    },
                                    symbol: {
                                        type: "picture-marker",
                                        url: `${dse.baseURL}/static/gis_temporary_pic/position.png`,
                                        width: "50px",
                                        height: "50px"
                                    }

                                })
                                that.problemPosition_point.add(problem_points);
                            }
                        }

                        setTimeout(()=>{
                            errorPoint()
                            let test_points_ = that.person_remrks
                            let graphicLine = new Graphic({
                                geometry: new Polyline({
                                    paths: test_points_,
                                    spatialReference: that.view.spatialReference
                                }),
                                symbol: {
                                    type: "simple-line", // autocasts as new SimpleFillSymbol
                                    color: "blue",
                                    width: 0.5,
                                    cap: "round",
                                    join: "round"
                                }
                            });
                            that.base_lineLayer.add(graphicLine);
                        },2000)

                    }
                );
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
            let self = this;
            this.map.allLayers.forEach((layer, index) => {
                if (this._isBaseLayer(layer.id)) {
                    self.map.findLayerById(layer.id).visible = false;
                    let lblLayer = self.map.findLayerById(layer.id + "w");
                    if (lblLayer) {
                        lblLayer.visible = false;
                    }
                }
            });
            let vecLayer = this.map.findLayerById(type);
            let labelLayer = this.map.findLayerById(type + "w");
            if (vecLayer) {
                vecLayer.visible = true;
            }
            if (labelLayer) {
                labelLayer.visible = true;
            }
        },
        queryInspectionInfo_(id, page) {
            let that = this;
            queryInspectionInfo({
                name: "",
                startTime: "",
                endTime: "",
                recordId: "" + id,
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
                        inspectionInfoData,
                        proData,
                        inspectTrackData
                    } = res.data;
                    that.routingCheckTotolPage = Math.ceil(inspectionInfoData.total / 10) || 1;
                    that.routingCheck_recordList = inspectionInfoData.rows[0] || {};
                    if(that.routingCheck_recordList.areaName){
                        let temp_pipeLen = that.routingCheck_recordList.inspectLength
                        let temp_onLiveTime =that.routingCheck_recordList.leadTime 
                        if(temp_onLiveTime>0){
                            that.inspectSpeed = (temp_pipeLen/temp_onLiveTime).toFixed(2)
                        }else{
                            that.inspectSpeed  = '0.00'
                        }
                    }
                    that.problemsData = proData || [];
                    if (inspectTrackData.length > 0) {
                        that.persional_focus = [inspectTrackData[0].LGTD, inspectTrackData[0].LTTD]
                        let temp_arr = [];
                        for (let i = 0; i < inspectTrackData.length; i++) {
                            let inner_arr = new Arcgis_mkt_jwd([inspectTrackData[i].LGTD, inspectTrackData[i].LTTD]).lonlat2mercator();
                            temp_arr.push(inner_arr)
                        }
                        that.person_remrks = temp_arr;
                    }
                    let  errorPoints = []
                    for(let j=0;j<that.problemsData.length;j++){
                            let inner_arr = [that.problemsData[j].lgtd, that.problemsData[j].lttd];
                            errorPoints.push(inner_arr)
                    }
                    that.errorPoints = errorPoints
                }
            }).catch(function (error) {
                console.log(error)
            });
        },
        hiddenPicModel(val) {
            this.showPicModel = false;
        },
        showPicModel_(index) {
            if (this.problemsData[index].file.length > 0) {
                this.showPicModel = true;
                this.carousel = this.problemsData[index].file;
            }
        }
    },
    filters: {
        trans_type(val) {
            switch (val) {
                case "0":
                    return "步行";
                    break;
                case "1":
                    return "自行车";
                    break;
                case "2":
                    return "摩托车";
                    break;
                case "3":
                    return "汽车";
                    break;
            }
        }
    },
    mounted() {
        this.createMap('',[])
    },
    beforeDestroy() {
        this.$router.push({
            name: "pipe_rushrepair_information"
        });
        this.$store.commit("setAside_status", true);
        this.$emit("showAside");
    },
    created() {
        let id = this.$route.params.id;
        this.planName = this.$route.params.planName
        this.queryInspectionInfo_(id, "1");
        this.filePath = this.$store.getters.get_filePath;
        // let temp_speed = 5 + parseFloat(parseFloat(Math.random()).toFixed(2));
        // this.inspectSpeed = temp_speed;
    }
}
</script>

<style lang="scss" scoped>
$baseFont:14px;
$baseColor:#333;
$baseBorderColor:#ccc;
$baseBg:#fff7f8;

* {
    box-sizing: border-box;
}

#record {
    width: 100%;
    height: 100%;
    color: $baseColor;
    font-size: $baseFont;

    &>.topHead {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        background: #ebebeb;
        padding: 0 20px;

        .col {
            .rect {
                display: inline-block;
                width: 12px;
                height: 12px;
                background: #05bebb;
            }

            .goback {
                display: inline-block;
                padding: 4px 20px;
                background: #fe8a01;
                cursor: pointer;
                color: #fff;
                border-radius: 5px;
            }
        }
    }

    .recordTable {
        width: 100%;
        height: calc(50% - 40px);
        overflow-y: auto;

        .inner-wrap {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;

            .recordList {
                width: calc(100% - 900px);
                height: 100%;
                border-right: 1px solid #ccc;

                &>div.item {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    height: 14.28%;
                    align-items: center;

                    &>div {
                        // width: 25%;
                        border-right: 1px solid $baseBorderColor;
                        border-bottom: 1px solid $baseBorderColor; // line-height: 30px;
                        padding-left: 10px;
                        height: 100%;
                        display: table-cell;
                        text-align: center;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        &:last-child {
                            border-right: none;
                        }

                        &.lastBorder {
                            border-right: 1px solid $baseBorderColor;
                        }

                        &:nth-child(odd) {
                            width: 100px;
                            background: #d6fafa;
                        }

                        &:nth-child(even) {
                            width: calc(50% - 100px);
                        }

                        .progress {
                            width: 80%;
                            height: 12px;
                            background: #cfcfcf;
                            display: inline-block;
                            position: relative;
                            border-radius: 12px;
                            margin-right: 10px;

                            span {
                                position: absolute;
                                top: 0;
                                left: 0; // width: 60%;
                                height: 12px;
                                border-radius: 12px;
                                background: #3ea3f6;
                            }
                        }

                        img {
                            width: 35px;
                            display: inline-block;
                            vertical-align: middle;
                            cursor: pointer;

                            &:hover {
                                width: 50px;
                            }
                        }
                    }

                }
            }

            #map_wrap {
                width: 900px;
                height: 100%;
            }

        }

        .desc {
            width: 100%;
            height: 100%;
            border-top: 1px solid #ccc;

            .content-head {
                width: 100%;
                background: #ebebeb;
                height: 40px;
                line-height: 40px;
                overflow-y: scroll;

                &>div {
                    border-right: 1px solid $baseBorderColor;
                    text-align: center;
                    float: left;

                    &:last-child {
                        border-right: none;
                    }

                    // background: #e3edef;
                    &.sm {
                        width: 100px;
                    }

                    &.md {
                        width: 160px;
                    }

                    &.bg {
                        width: calc(33.33% - 220px);
                    }
                }
            }

            .contentList {
                width: 100%;
                height: calc(100% - 40px);
                // display: flex;
                // flex-direction: column;
                // justify-content: flex-start;
                // align-content: space-between;
                overflow-y: scroll;

                div.contentItem {
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    div {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-right: 1px solid $baseBorderColor;
                        border-bottom: 1px solid $baseBorderColor;
                        height: 30px;
                        text-align: center;

                        &:last-child {
                            border-right: none;
                        }

                        &.sm {
                            width: 100px;
                        }

                        &.md {
                            width: 160px;
                        }

                        &.bg {
                            width: calc(33.33% - 220px);

                            span {
                                display: inline-block;
                                width: 100%;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }

                        img {
                            vertical-align: middle;
                            width: 20%;
                            height: 80%;
                        }

                        &.between {
                            justify-content: space-around;
                        }

                        span.status {
                            display: inline-block;
                            padding: 0px 10px;
                            line-height: 25px;
                            color: #fff;

                            &.level3 {
                                background: #ff0f10;
                            }

                            &.level2 {
                                background: #e18224;
                            }

                            &.level1 {
                                background: #dec624;
                            }
                        }

                        &.position {
                            cursor: pointer;
                        }

                        i {
                            font-size: 25px;
                            color: #0b83ff;
                        }

                        img.play {
                            width: 14px;
                        }

                        img.position {
                            width: 30px;
                        }
                    }
                }
            }
        }
    }

    .paingation {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    #gisPosition,
    #gisTrail {
        width: 100%;
        height: 400px;
        position: relative;
    }

    .slider {
        width: 100%;
        height: 300px;

        .el-carousel {
            width: 100%;
            height: 100%;

            .el-carousel__container {
                position: relative;
                height: 400px !important;
            }

            .el-carousel__item h3 {
                color: #475669;
                font-size: 14px;
                opacity: 0.75;
                line-height: 150px;
                margin: 0;
            }

            .el-carousel__item:nth-child(2n) {
                background-color: #99a9bf;
            }

            .el-carousel__item:nth-child(2n+1) {
                background-color: #d3dce6;
            }

            img {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
