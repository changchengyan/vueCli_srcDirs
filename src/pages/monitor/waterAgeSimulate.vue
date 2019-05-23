<template>
<div id="waterAgeSimulate">
    <div id="gis"></div>
    <div class="gistools">
        <gistools @handleThisDom="thisDom" @showLayers="toggleSelectThis" :defaultLayers="layers"></gistools>
    </div>
    <div class="ledgend">
        <div class="top">
            <span>水龄值</span>
        </div>
        <div class="list">
            <div class="item" v-for="(item,index) in timeLine" :key="index">
                <span v-if="index!=0">{{item}}</span>
            </div>
        </div>
    </div>
    <div class="animation">
        <canvas  id="clock" width="160" height="160"></canvas>
        <span class="time">{{activedIndex}}时</span>
    </div>
    <template v-if="!isOpacity">
        <div class="startBtn" :class="{run:isOpacity==false}" @click="start()">
            <span>开始模拟</span>
        </div>
    </template>
    <template v-else>
        <div class="startBtn" :class="{stop:isOpacity==true}" @click="stop()">
            <span>结束模拟</span>
        </div>
    </template>
    <div class="ledgend_">
        <div class="top-head">
            <div class="col"><span class="line"></span></div>
            <div class="col"><span>输水管线</span></div>
        </div>
        <div class="sub">
            <div class="col">
                <!-- <div class="logo"></div> -->
                <img src="../../assets/images/common/jxj.png" alt="">
                <span>检修井</span>
            </div>
            <div class="col">
                <!-- <div class="log"></div> -->
                <img src="../../assets/images/common/xfs.png" alt="">
                <span>消防栓</span>
            </div>
        </div>
    </div>
    <div class="updateTime">
        <created-time></created-time>
    </div>
</div>
</template>

<script>
import * as esriLoader from "esri-loader";
import createdTime from "@/common/components/createdTime"
esriLoader.loadCss(dse.arcgis_mainCss);
let startJs = dse.arcgis_startJS;
const options = {
    url: startJs,
    dojoConfig: dse.gisConfig
};
// let pipeUrl = dse.arcgis_belowMap;  
let pipeUrl = waterAge_gisUrl;

let jxjUrl = dse.arcgis_jxj;
let xfsUrl = dse.arcgis_pipe;
let query_ = null; // 查询管道的函数
// 二维管网相关.
import popupUtils from '@/common/utils/popupUtils';
//管网图层配置
import gw2dConfig from '@/common/config/gis2d/gw2dConfig';
import jxj2dConfig from '@/common/config/gis2d/jxj2dConfig';
import xfs2dConfig from '@/common/config/gis2d/xfs2dConfig';

import layerUtils from '@/common/utils/layerUtils';

import gistools from '@/common/components/gis_units/tools';

import {
    getWaterAgeData
} from "@/api/monitor/waterAgeSimulate"
export default {
    components: {
        gistools,
        createdTime
    },
    data() {
        return {
            view: null,
            map: null,
            layer1: null, //管道图层
            layer2: null, //检修井图层
            layer3: null, //消防栓图层
            layers: [], //工具栏图层
            distance: null, //自定义量距
            area: null, //自定义画面
            timeLine: [0, 2, 6, 12, 24],
            activedIndex: null,
            timer: null,
            isOpacity: false,
            line_0_2_layer: "", // 0~2小时的水龄
            line_2_6_layer: "", // 2~6小时的水龄
            line_6_12_layer: "", // 6~12小时的水龄
            line_12_24_layer: "", // 12~24小时的水龄
            line_24_0_layer: "", // 24~0小时的水龄
            countNum: 0, //记录 计数器
        };
    },
    methods: {
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
                        BaseMapUtils
                    ]) => {
                        layerUtils.bindAmdClass(QueryTask, Query, GraphicsLayer, Graphic);
                        that.map = new Map({
                            // basemap: "satellite"
                        });
                        let baseMapUtils = new BaseMapUtils({
                            map: that.map,
                            mapType: '2'
                        });

                        //debugger;
                        baseMapUtils.loadBaseLayers(dse.baseMapLayers);
                        // 管网图层.

                        let pipeUrl = that.$store.getters.get_pipe_defaultLayer
                        gw2dConfig.url = pipeUrl;
                        gw2dConfig.popupTemplate.visible = false;
                        that.layer1 = layerUtils.loadData(that.map, gw2dConfig);
                        //===================================================

                        // 消防栓图层.
                        let  xfsUrl = that.$store.getters.get_xfs_defaultLayer
                        xfs2dConfig.url = xfsUrl;
                        xfs2dConfig.popupTemplate.visible = false;
                        that.layer3 = layerUtils.loadData(that.map, xfs2dConfig);
                        //===================================================

                        // 检修井图层.
                        jxj2dConfig.url = jxjUrl;
                        jxj2dConfig.popupTemplate.visible = false;
                        that.layer2 = layerUtils.loadData(that.map, jxj2dConfig);
                        //===================================================
                        // 0~2小时的水龄
                        that.line_0_2_layer = new GraphicsLayer({
                            graphics: []
                        });
                        that.line_0_2_layer.symbolInfo = {
                            type: "simple-line",
                            color: "#247911",
                            width: 4
                        };
                        that.map.add(that.line_0_2_layer);

                        // 2~6小时的水龄
                        that.line_2_6_layer = new GraphicsLayer({
                            graphics: []
                        });
                        that.line_2_6_layer.symbolInfo = {
                            type: "simple-line",
                            color: "#56eefc",
                            width: 4
                        };
                        that.map.add(that.line_2_6_layer);

                        // 6~12小时的水龄
                        that.line_6_12_layer = new GraphicsLayer({
                            graphics: []
                        });
                        that.line_6_12_layer.symbolInfo = {
                            type: "simple-line",
                            color: "#2dc679",
                            width: 4
                        };
                        that.map.add(that.line_6_12_layer);

                        // 12~24小时的水龄
                        that.line_12_24_layer = new GraphicsLayer({
                            graphics: []
                        });
                        that.line_12_24_layer.symbolInfo = {
                            type: "simple-line",
                            color: "#383ecf",
                            width: 4
                        };
                        that.map.add(that.line_12_24_layer);

                        // 24~0小时的水龄
                        that.line_24_0_layer = new GraphicsLayer({
                            graphics: []
                        });
                        that.line_24_0_layer.symbolInfo = {
                            type: "simple-line",
                            color: "#5a3237",
                            width: 4
                        };
                        that.map.add(that.line_24_0_layer);

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

                        query_ = function (time, pipeCode) {
                            let queryTask = new QueryTask({
                                url: pipeUrl
                            });
                            let queryParam = new Query();
                            queryParam.returnGeometry = true;
                            queryParam.outFields = ['*'];
                            queryParam.where = `CODE =  '${pipeCode}'`;
                            queryTask.execute(queryParam)
                                .then((res) => {
                                    let features_ = res.features;
                                    if (features_.length) {
                                        let gra = null;
                                        if (time <= 2) {
                                            gra = new Graphic({
                                                geometry: features_[0].geometry,
                                                symbol: {
                                                    type: "simple-line",
                                                    color: "#247911",
                                                    width: 4
                                                }
                                            });
                                            that.line_0_2_layer.add(gra);
                                        } else if (time > 2 && time <= 6) {
                                            gra = new Graphic({
                                                geometry: features_[0].geometry,
                                                symbol: {
                                                    type: "simple-line",
                                                    color: "#56eefc",
                                                    width: 4
                                                }
                                            });
                                            that.line_2_6_layer.add(gra);
                                        } else if (time > 6 && time <= 12) {
                                            gra = new Graphic({
                                                geometry: features_[0].geometry,
                                                symbol: {
                                                    type: "simple-line",
                                                    color: "#2dc679",
                                                    width: 4
                                                }
                                            });
                                            that.line_6_12_layer.add(gra);
                                        } else if (12 < time && time <= 24) {
                                            let gra = new Graphic({
                                                geometry: features_[0].geometry,
                                                symbol: {
                                                    type: "simple-line",
                                                    color: "#383ecf",
                                                    width: 4
                                                }
                                            });
                                            that.line_12_24_layer.add(gra);
                                        } else {
                                            gra = new Graphic({
                                                geometry: features_[0].geometry,
                                                symbol: {
                                                    type: "simple-line",
                                                    color: "#5a3237",
                                                    width: 4
                                                }
                                            });
                                            that.line_24_0_layer.add(gra);
                                        }
                                    }
                                })
                                .catch((error) => {});
                        }

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
        toggleSelectThis(val) {
            let that = this;
            let temp_list = val;
        },
        selectThis(index) {
            let that = this
            this.activedLayer = index;
            if (index == 0) {
                that.waterQc_layer.removeAll();
                that.waterPress_layer.removeAll();
                that.waterFlow_layer.addMany(that.flow_layer);
            } else if (index == 1) {
                that.waterQc_layer.removeAll();
                that.waterFlow_layer.removeAll();
                that.waterPress_layer.addMany(that.press_layer);
            } else {
                that.waterFlow_layer.removeAll();
                that.waterPress_layer.removeAll();
                that.waterQc_layer.addMany(that.qc_layer);
            }
        },
        getWaterAgeData_(time) {
            let that = this;
            getWaterAgeData({
                time: "" + time,
                companyId: ""
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`;
                    return;
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!");
                    return;
                }
                let {
                    data
                } = res;
                data = data || [];
                if (data.length > 0) {
                    that.line_0_2_layer.removeAll();
                    that.line_2_6_layer.removeAll();
                    that.line_6_12_layer.removeAll();
                    that.line_12_24_layer.removeAll();
                    that.line_24_0_layer.removeAll();
                    for (let i = 0; i < data.length; i++) {
                        let code = data[i].code
                        let timeNum = data[i].quality;
                        query_(timeNum, code)
                    }
                }
            })
        },
        start() {
            let time_ = new Date();
            let hour = time_.getHours()+1;
            this.activedIndex = hour;
            this.isOpacity = true
            let that = this;
            let drawing = document.getElementById("clock");
            let content_ = drawing.getContext("2d");
            let count = hour;
            let num = this.countNum;
            clock();
            this.getWaterAgeData_(count);
            function clock() {
                const pl = count * 15 - 90;
                content_.clearRect(0, 0, 200, 200);
                content_.beginPath();
                content_.lineWidth = "3";
                content_.arc(100, 100, 70, 0, 360 * Math.PI / 180, false);
                for (let i = 0; i < 24; i++) {
                    content_.moveTo(100, 100);
                    content_.arc(100, 100, 70, i * 15 * Math.PI / 180, i * 15 * Math.PI / 180, false);
                }
                content_.stroke();
                content_.beginPath();
                content_.fillStyle = "#fff";
                content_.arc(100, 100, 70 * 19 / 20, 0.360 * Math.PI / 180, false);
                content_.fill();
                content_.beginPath();
                content_.lineWidth = "3";

                content_.beginPath();
                content_.moveTo(100, 100);

                content_.arc(100, 100, 70 * 16 / 20, pl * Math.PI / 180, pl * Math.PI / 180, false);
                content_.stroke();
                count++;

                content_.lineWidth = "1";
                content_.font = "18px";
                content_.strokeText('0', 96, 50);
                content_.strokeText('6', 154, 104);
                content_.strokeText('12', 96, 160);
                content_.strokeText('18', 40, 104);
                content_.fillStyle = "#f00";
                if (count == 24) {
                    count = 0;
                }
                if (num == 24) {
                    clearInterval(that.timer);
                    that.isOpacity = false;
                }
                if (count - 1 == 0) {
                    that.activedIndex = 24;
                } else {
                    that.activedIndex = count - 1 == -1 ? 23 : count - 1;
                }
                num++
                that.countNum = num;
            }
            that.timer = setInterval(() => {
                clock();
                this.getWaterAgeData_(count);
            }, 6 * 1000)
        },
        stop() {
            let that = this;
            clearInterval(that.timer)
            this.isOpacity = false
        },
        draw() {
            let that = this;
            let time_ = new Date();
            let hour = time_.getHours();
            // let hour = 1;
            this.activedIndex = hour;
            let drawing = document.getElementById("clock");
            let content_ = drawing.getContext("2d");
            let count = hour;
            const pl_ = hour * 15 - 90;

            function clock() {
                const pl = pl_;
                content_.clearRect(0, 0, 160, 160);
                content_.beginPath();
                content_.lineWidth = "3";
                content_.arc(80, 80, 70, 0, 360 * Math.PI / 180, false);
                for (let i = 0; i < 24; i++) {
                    content_.moveTo(80, 80);
                    content_.arc(80, 80, 70, i * 15 * Math.PI / 180, i * 15 * Math.PI / 180, false);
                }
                content_.stroke();
                content_.beginPath();
                content_.fillStyle = "#fff";
                content_.arc(80, 80, 70 * 19 / 20, 0.360 * Math.PI / 180, false);
                content_.fill();
                content_.beginPath();
                content_.lineWidth = "3";

                content_.beginPath();
                content_.moveTo(80, 80);

                content_.arc(80, 80, 70 * 16 / 20, pl * Math.PI / 180, pl * Math.PI / 180, false);
                content_.stroke();
                content_.lineWidth = "1";
                content_.font = "18px";
                content_.strokeText('0', 76, 35);
                content_.strokeText('6', 135, 85);
                content_.strokeText('12', 76, 135);
                content_.strokeText('18', 25, 85);
                content_.fillStyle = "#f00";
            }
            clock();
        }
    },
    mounted() {
        
        let position = this.$store.getters.get_cityPosition

        this.createMap(position);
        this.draw()
    },
    created() {
        let time = new Date();
        let hour_ = time.getHours();
        this.getWaterAgeData_(hour_);

    }
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

#waterAgeSimulate {
    width: 100%;
    height: 100%;
    position: relative;

    #gis {
        width: 100%;
        height: 100%;
    }

    .gistools {
        width: 200px;
        height: 30px;
        background: #fff;
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

    .ledgend {
        width: 100px;
        height: 200px;
        position: absolute;
        top: 20px;
        left: 50px;
        background: #fff;
        border-radius: 5px;
        opacity: 0.8;
        font-size: 14px;

        .top {
            width: 100%;
            line-height: 25px;
            font-weight: 600;
            text-align: center;
        }

        .list {
            width: 100%;
            height: calc(100% - 25px);

            .item {
                width: 10px;
                height: 30px;
                margin-left: 20px;
                position: relative;

                &:nth-child(1) {
                    background: #247911;
                }

                &:nth-child(2) {
                    background: #56eefc;
                }

                &:nth-child(3) {
                    background: #2dc679;
                }

                &:nth-child(4) {
                    background: #383ecf;
                }

                &:nth-child(5) {
                    background: #5a3237;
                }

                span {
                    width: 40px;
                    font-weight: 600;
                    position: absolute;
                    left: 15px;
                    top: -5px;
                }
            }
        }
    }

    .animation {

        width: 160px;
        height: 160px;
        position: absolute;
        top: 20px;
        right: 320px;
        background: #fff;
        // opacity: 0;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;

        // position: relative;
        &.visable {
            opacity: 0.9;
        }

        .time {
            position: absolute;
            font-size: 12px;
            top: 34%;
            left: 44%;
            // z-index: 10;
            color: #0b83fe;
            // border: 1px solid #0b83fe;
            // padding: 2px 5px;
            // border-radius: 4px;
        }
    }

    .startBtn {
        width: 80px;
        height: 30px;
        border-radius: 5px;
        position: absolute;
        top: 190px;
        right: 356px;
        background: #eff318;
        opacity: 1;
        line-height: 30px;
        text-align: center;
        color: #333;
        cursor: pointer;

        &.run {
            // cursor: not-allowed;
            background: #0b83fe;
            color: #fff;
        }

        &.stop {
            background: #eff318;
            color: #333;
        }
    }

    .ledgend_ {
        width: 200px;
        height: 100px;
        position: absolute;
        bottom: 60px;
        left: 20px;
        border-radius: 10px;
        background: #fff;
        font-size: 14px;
        color: #333;

        .top-head {
            width: 100%;
            height: 30px;
            display: flex;
            justify-content: space-between;

            .col {
                height: 30px;
                width: 50%;
                line-height: 30px;
                padding: 0 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                span.line {
                    display: inline-block;
                    width: 80%;
                    height: 15px;
                    margin: 0 auto;
                    background: #44cef6;
                }
            }
        }

        .sub {
            width: 100%;
            height: calc(100% - 30px);
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .col {
                width: 50%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                span {
                    display: inline-block;
                    padding-top: 5px;
                }
            }
        }
    }

    .updateTime {
        width: 200px;
        height: 30px;
        line-height: 30px;
        position: absolute;
        bottom: 20px;
        left: 20px;
        background: #fff;
        border-radius: 5px;
    }
}
</style>
