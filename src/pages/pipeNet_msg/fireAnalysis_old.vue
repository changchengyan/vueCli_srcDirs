<template>
<div id="home">
    <div class="gis-content">
        <div id="gis" ref="gis"></div>
        <div class="fireplug">
            <div class="fireplug-tabs">
                <span :class="{active:fireplug_item==index}" @click="showThisFireplug(index)" v-for="(item,index) in fireplugtabs " :key="index">{{item.name}}</span>
            </div>
            <template v-if="fireplug_item==0">
                <div class="sub-progress">
                    <div class="tips">保护半径</div>
                    <el-slider v-model="radius" :max="120" :min="50" :format-tooltip="formatTooltip" @change="getSliderValue"></el-slider>
                    <div class="min-max">
                        <span>50m</span>
                        <span>100m</span>
                    </div>
                </div>
            </template>
        </div>
        <div class="cancel" v-if="fireStatus" @click="cancel">清除火灾点</div>
    </div>
</div>
</template>

<script>
import * as esriLoader from "esri-loader";
esriLoader.loadCss(dse.arcgis_mainCss);
let xfsUrl = dse.arcgis_pipe;

let global_frame_data = dse.globalData;
let startJs = dse.arcgis_startJS;
const options = {
    url: startJs,
    dojoConfig: dse.gisConfig
};

let point, geodesicBuffer, xfs_func;
let drawFirePoint; //绘制着火点的方法
let domainURL = dse.baseURL;

let pipeUrl = dse.arcgis_belowMap;
// 三维管网相关.
import popupUtils from '@/common/utils/popupUtils';
//管网图层配置
import gw2dConfig from '@/common/config/gis2d/gw2dConfig';
gw2dConfig.popupTemplate.visible = false;
import layerUtils from '@/common/utils/layerUtils';

export default {
    name: "Home",
    data() {
        return {
            view: null, // 全局化  gis底图实例
            map: null, //  挂载底图图层
            layer2: null, // 消防栓图层
            xfs_circle_layer: null, //消防栓 圆的图层
            xfsGeometries: "", //所有消防算的物体集合
            fireplugtabs: [
                // 消防相关的 tab栏
                {
                    name: "消防分析",
                    active: true
                },
                {
                    name: "消防模拟",
                    active: false
                }
            ],
            fireplug_item: 0,
            radius: 50, //消防分析半径
            fireStatus: false, //是否显示清除按钮
        };
    },
    methods: {
        createMap() {
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
                        QueryTask,
                        Query,
                        SimpleFillSymbol,
                        BaseMapUtils
                    ]) => {
                        layerUtils.bindAmdClass(QueryTask, Query, GraphicsLayer, Graphic);

                        let wellBuffer, wellsGeometries, magnitude;
                        that.map = new Map({
                            // basemap: "satellite",
                            // ground: "world-elevation"
                        });
                        that.map = new Map({
                            //    basemap: "hybrid"
                            layers: []
                        });
                        let baseMapUtils = new BaseMapUtils({
                            map: that.map,
                            mapType: '2'
                        });

                        //debugger;
                        baseMapUtils.loadBaseLayers(dse.baseMapLayers);

                        gw2dConfig.url = pipeUrl;
                        gw2dConfig.popupTemplate.visible = false;
                        that.layer1 = layerUtils.loadData(that.map, gw2dConfig);

                        that.xfs_circle_layer = new GraphicsLayer({
                            geometrys: []
                        })

                        that.layer2 = new FeatureLayer({
                            url: xfsUrl,
                        });
                        that.map.add(that.layer2);

                        that.view = new MapView({
                            container: "gis",
                            map: that.map,
                            zoom: 15,
                            center: [106.290351, 36.001819],
                            highlightOptions: {
                                color: [255, 255, 0, 1],
                                haloOpacity: 0.9,
                                fillOpacity: 0.2
                            }
                        });

                        function getMinDis_xfs(geometry_) {
                            let queryTask = new QueryTask({
                                url: xfsUrl
                            });
                            var query = new Query();
                            query.returnGeometry = true;
                            query.outFields = ["*"];
                            // query.where = parmas;
                            query.geometry = geometry_;
                            queryTask.execute(query).then(function (results) {
                                let features = results.features;
                                let geometrys = [];
                                if (features.length > 0) {
                                    geometrys = features.map(item => {
                                        return item.geometry
                                    })
                                }
                                let wellBuffers = geometryEngine.geodesicBuffer(geometrys, [
                                        120
                                    ], "meters",
                                    true);
                                wellBuffer = wellBuffers[0];
                                let graphic = new Graphic({
                                    geometry: wellBuffer,
                                    symbol: new SimpleFillSymbol({
                                        color: [127, 184, 14, 0.4],
                                        outline: {
                                            color: [255, 230, 0, 1],
                                            width: "2px"
                                        }
                                    }),
                                });
                                that.view.graphics.add(graphic);
                                that.xfs_circle_layer.graphics.add(graphic)
                            });

                        }

                        // that.view.on("click", function (event) {
                        //     that.view.hitTest(event).then(
                        //         res => {
                        //             let temp_geometry = res.results[0].graphic.geometry;
                        //             let wellBuffer = geometryEngine.geodesicBuffer(temp_geometry, 120, "meters", true);
                        //             getMinDis_xfs(wellBuffer);
                        //         }
                        //     );
                        // });

                        drawFirePoint = function () {
                            let drawPoint = new Draw({
                                view: that.view
                            })
                            let action = drawPoint.create("point");
                            action.on("cursor-update", function (evt) {
                                createPointGraphic(evt.coordinates);
                            });
                            action.on("draw-complete", function (evt) {
                                createPointGraphic(evt.coordinates);
                            });
                        }

                        function createPointGraphic(coordinates) {
                            that.view.graphics.removeAll();
                            var point = {
                                type: "point",
                                x: coordinates[0],
                                y: coordinates[1],
                                spatialReference: that.view.spatialReference
                            };

                            var graphic = new Graphic({
                                geometry: point,
                                symbol: {
                                    type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                                    url: "" + domainURL + "/static/gis_temporary_pic/fire.gif",
                                    width: "50px",
                                    height: "50px"
                                }
                            });
                            let temp_geometry = graphic.geometry;
                            let wellBuffer = geometryEngine.geodesicBuffer(temp_geometry, 120, "meters", true);
                            getMinDis_xfs(wellBuffer);
                            that.view.graphics.add(graphic);
                        }

                        // 给消防栓画圆圈
                        that.view.when(function () {
                                return that.layer2.when(function () {
                                    var query = that.layer2.createQuery();
                                    return that.layer2.queryFeatures(query);
                                });
                            })
                            .then(getValues)
                            .then(addCircle)

                        function getValues(response) {
                            let Geometries = response.features;
                            let values = Geometries.map(function (feature) {
                                return feature.geometry
                            });
                            that.xfsGeometries = values;
                            return values;
                        }

                        function addCircle(values) {
                            let bufferDistance = parseInt(that.radius);
                            let wellBuffers = geometryEngine.geodesicBuffer(values, [
                                    bufferDistance
                                ], "meters",
                                true);
                            wellBuffer = wellBuffers[0];
                            let bufferGraphic = new Graphic({
                                geometry: wellBuffer,
                                symbol: new SimpleFillSymbol({
                                    color: [127, 184, 14, 0.4],
                                    outline: {
                                        color: [255, 230, 0, 1],
                                        width: "2px"
                                    }
                                }),
                            });
                            that.view.graphics.removeAll();
                            that.view.graphics.add(bufferGraphic);
                        }
                        xfs_func = addCircle;
                    }
                );
        },
        showThisFireplug(index) {
            //展示 消防栓的 tab栏
            let that = this;
            this.fireplug_item = index;
            if (index == 0) {
                // that.view.graphics.removeAll();
                this.fireStatus = false;
                that.view.when(function () {
                        return that.layer3.when(function () {
                            var query = that.layer3.createQuery();
                            return that.layer3.queryFeatures(query);
                        });
                    })
                    .then(getValues)
                    .then(xfs_func)

                function getValues(response) {
                    let Geometries = response.features;
                    let values = Geometries.map(function (feature) {
                        return feature.geometry
                    });
                    that.xfsGeometries = values;
                    return values;
                }
            } else {
                // that.view.graphics.removeAll();
                drawFirePoint();
                this.fireStatus = true;
            }
        },
        formatTooltip(val) {

            return val;
        },
        getSliderValue(val) {
            let that = this;
            that.radius = val;
            let temp = that.xfsGeometries;
            xfs_func(temp)
        },
        cancel() {
            this.view.graphics.removeAll();
        }
    },
    mounted() {
        let that = this;
        that.createMap();
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/resetCSS/pipeNet_msg/msg_2d_3d.scss";

.cancel {
    width: 80px;
    height: 80px;
    line-height: 80px;
    color: #fff;
    cursor: pointer;
    text-align: center;
    border-radius: 80px;
    background: #0b83ff;
    position: absolute;
    top: 50%;
    left: 20px;
    margin-top: -40px;
}
</style>
