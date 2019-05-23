/**
 * Created by Administrator on 2016/7/14.
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "dojo/_base/array", "dojo/_base/lang", "esri/layers/WebTileLayer", "esri/config", "esri/layers/TileLayer", "esri/layers/MapImageLayer", "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer",  "esri/geometry/Extent"], factory);
    }
})(function (require, exports) {
    // "use strict";
    var arrayUtils = require("dojo/_base/array");
    var dojoLang = require("dojo/_base/lang");
    var WebTileLayer = require("esri/layers/WebTileLayer");
    var esriConfig = require("esri/config");
    var TileLayer = require("esri/layers/TileLayer");
    var MapImageLayer = require("esri/layers/MapImageLayer");
    var FeatureLayer = require("esri/layers/FeatureLayer");
    var GraphicsLayer = require("esri/layers/GraphicsLayer");
    // var QueryDisplayLayer = require("../layers/QueryDisplayLayer");
    var Extent = require("esri/geometry/Extent");
    esriConfig.request.corsEnabledServers.push("http://mt0.google.cn");
    esriConfig.request.corsEnabledServers.push("http://mt1.google.cn");
    esriConfig.request.corsEnabledServers.push("http://t0.tianditu.com");
    esriConfig.request.corsEnabledServers.push("http://t1.tianditu.com");
    /**
     * ===========================================
     * Tian Di tu Layer Urls.
     * ===========================================
     * */
    /**
     * url template:http://${subDomain}.mqcdn.com/tiles/1.0.0/vx/map/${level}/${col}/${row}.jpg
     * */
    //https://t0.tianditu.gov.cn
    // var baseUrl = "http://{subDomain}.tianditu.cn/{layerName}/wmts";
    var baseUrl = "http://{subDomain}.tianditu.com/{layerName}/wmts";
    //
    var subUrl = "?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER={layerId}&STYLE=default&";
    var matrixUrl = "TILEMATRIXSET={matrix}&FORMAT=tiles&TILECOL=${col}&TILEROW=${row}&TILEMATRIX=${level}";
    //离线地图URL模板.
    var localUrlTemplateSuffix = '/tiles/{level}/{col}/{row}';
    /**
     * ===========================================
     * Google Layer Urls.
     * ===========================================
     * */
    var googleDXUrlTemplate = "http://{subDomain}.google.cn/vt/lyrs=t@132,r@292013572&hl=zh-CN&gl=CN&expIds=201527&rlbl=1&x=${col}&y=${row}&z=${level}&s=";
    //
    var googleJTUrlTemplate = "http://{subDomain}.google.cn/vt/lyrs=m@297000000&hl=zh-CN&gl=CN&expIds=201527&rlbl=1&x=${col}&y=${row}&z=${level}&s=";
    //
    var googleYGUrlTemplate = "http://{subDomain}.google.cn/vt/lyrs=y&hl=zh-CN&gl=cn&x=${col}&y=${row}&z=${level}&s=";
    /**
     * ===========================================
     * Bai Du Layer Urls.
     * ===========================================
     * */
    // var bdVecUrl = "http://${subDomain}.map.bdimg.com/tile/?qt=tile&x=${col}&y=${row}&z=${level}&styles=pl&scaler=1&udt=20160708 ";
    //
    //
    /**
     * ===========================================
     * load tile layers from specify url.
     * ===========================================
     * */
    var LayerType = (function () {
        //
        return {
            //
            BD: "bd",
            TDT: "tdt",
            GOOGLE: "google" //google layer.
        };
    })();
    var _map = null;
    var _initExtent = null;
    function createSubDomains(count, type) {
        var results = [];
        for (var i = 0; i < count; i++) {
            //
            if (type === LayerType.BD) {
                //bai du layer.
                results.push("online" + i);
            }
            else if (type === LayerType.GOOGLE) {
                //google layer
                results.push("mt" + i);
            }
            else if (type === LayerType.TDT) {
                //tian di tu layer.
                results.push("t" + i);
            }
            else {
            }
        }
        return results;
    }
    var BaseMapUtils = /** @class */ (function () {
        /**
         * @description  <p class="sunlight-desc">框架地图相关操作处理模块,框架内部使用,不需要对外公开. </p>
         * <strong>RefUrl&nbsp;:&nbsp;&nbsp;</strong> <span class="sunlight-imp">dsegis/utils/BaseMapUtils</span>
         * @constructs 构造函数
         * @alias BaseMapUtils
         * @param {esri/Map} map 地图实例对象.
         *
         * @private
         *
         * @example
         * // 引用方式1
    
         define(function(require,exports.module){
    
                    var BaseMapUtils=require("dsegis/utils/BaseMapUtils");
                    var util=new BaseMapUtils(url,{});
                    util.addLayer(infoParam);
              });
         //引用方式 2
    
         require(["dsegis/utils/BaseMapUtils"],function(BaseMapUtils){
               //
                    var util=new BaseMapUtils(url,{});
                    util.addLayer(infoParam);
                });
         * */
        function BaseMapUtils(utilsProps) {
            this.mapType = '1';
            //
            this._map_ = utilsProps.map;
            _map = this._map_;
            dojoLang.mixin(this, utilsProps);
        }
        //
        //
        /**
         * @private
         * */
        BaseMapUtils.prototype._createTdtImgLayer = function (options) {
            var visible = options.visible || false;
            var imgUrl = this._createUrlTemplate("img_w");
            var imgLabelUrl = this._createUrlTemplate("cia_w");
            this._createBaseLayers([imgUrl, imgLabelUrl], LayerType.TDT, visible, [options.id, options.id + "w"]);
            //
        };
        //
        /**
         * @private
         * */
        BaseMapUtils.prototype._createTdtVecLayer = function (options) {
            //TODO:
            var visible = options.visible || false;
            var vecUrl = this._createUrlTemplate("vec_w");
            var vecLblUrl = this._createUrlTemplate("cva_w");
            this._createBaseLayers([vecUrl, vecLblUrl], LayerType.TDT, visible, [options.id, options.id + "w"]);
        };
        /**
         * @private
         * */
        BaseMapUtils.prototype._createTdtTerrainLayer = function (options) {
            //
            var visible = options.visible || false;
            //
            var terUrl = this._createUrlTemplate("ter_w");
            var terLblUrl = this._createUrlTemplate("cta_w");
            this._createBaseLayers([terUrl, terLblUrl], LayerType.TDT, visible, [options.id, options.id + "w"]);
        };
        /**
         * @private
         * */
        BaseMapUtils.prototype._createBaseLayers = function (urls, type, isVisible, ids) {
            //url
            var self = this;
            arrayUtils.forEach(urls, function (url, iindex) {
                //
                //
                // console.log(createSubDomains(2, type));
                var tileLayer = new WebTileLayer({
                    id: ids[iindex],
                    urlTemplate: url,
                    subDomains: createSubDomains(2, type)
                });
                if (!isVisible) {
                    //
                    // tileLayer.hide();
                    tileLayer.visible = false;
                }
                //
                self._layers_.push(tileLayer);
            });
            // console.log(urls)
            //定位有变化.
            // if (this._map_) {
            //     //
            //     if (_initExtent) {
            //         //
            //         this._map_.setExtent(_initExtent);
            //     }
            // }
        };
        /**
         * @private
         * */
        BaseMapUtils.prototype._createUrlTemplate = function (layerName) {
            //
            if (layerName) {
                //
                var parts = layerName.split("_");
                var url1 = baseUrl.replace(/{layerName}/g, layerName);
                //
                var url2 = subUrl.replace(/{layerId}/g, parts[0]);
                //
                var url3 = matrixUrl.replace(/{matrix}/g, parts[1]);
                //
                // return url1 + url2 + url3;
                return "" + url1 + url2 + url3;
            }
        };
        /**
         * @private
         * */
        BaseMapUtils.prototype.loadTDTLayer = function (options) {
            //
            _initExtent = options.extent;
            if (options.type === "vec") {
                //矢量图
                this._createTdtVecLayer(options);
            }
            else if (options.type === "img") {
                //影像图
                this._createTdtImgLayer(options);
            }
            else if (options.type === "ter") {
                //地形图
                this._createTdtTerrainLayer(options);
            }
            else {
                // TODO:
                alert("底图类型不支持，请输入['ter','img','vec']中的一种。");
            }
        };
        /**
         * @private
         * */
        BaseMapUtils.prototype.loadGoogleLayer = function (options) {
            //
            _initExtent = options.extent;
            var isVisible = options.visible || false;
            if (options.type === "ter") {
                //地形图
                this._createBaseLayers([googleDXUrlTemplate], LayerType.GOOGLE, isVisible, [options.id]);
            }
            else if (options.type === "vec") {
                //矢量图
                this._createBaseLayers([googleJTUrlTemplate], LayerType.GOOGLE, isVisible, [options.id]);
            }
            else if (options.type === "img") {
                //影像图
                this._createBaseLayers([googleYGUrlTemplate], LayerType.GOOGLE, isVisible, [options.id]);
            }
            else {
                //
                alert("底图类型不支持，请输入['ter','vec','img']中的一种。");
            }
        };
        //
        BaseMapUtils.prototype.addLayer = function (options) {
            //
            // 不能使用type属性， 会和内置API的 只读属性 type 相冲突.
            var type = options.layerType;
            //
            var dseLayer = null;
            switch (type) {
                //
                case "feature":
                    dseLayer = this._createFeatureLayer(options);
                    break;
                case "graphic":
                    dseLayer = this._createGraLayer(options);
                    break;
                case "wfs":
                    // dseLayer = this._createWfsLayer(options);
                    break;
                case "dynamic":
                    //
                    dseLayer = this._createDynamicLayer(options);
                    break;
                case "query":
                    // dseLayer = this._createQueryDisplayLayer(options);
                    break;
                default:
                    break;
            }
            if (dseLayer) {
                //
                // var layerIndex = options.index || _map.layerIds.length;
                //
                //
                dseLayer.name = options.name || "Layer" + (Math.random() * 100).toFixed(0);
                // dseLayer.legendType="ags";
                dseLayer.isInLayerCtrl = options.isInLayerCtrl;
                //
                if (options.layerIndex) {
                    //
                    _map.add(dseLayer, options.layerIndex);
                }
                else {
                    _map.add(dseLayer);
                }
            }
            return dseLayer;
        };
        //
        /**
         * @description 创建 Feature ArcGIS GraphicsLayer.
         *
         * @private
         * */
        BaseMapUtils.prototype._createGraLayer = function (options) {
            //
            var dseLayer = _map.findLayerById(options.id);
            if (!dseLayer) {
                //
                dseLayer = new GraphicsLayer({
                    id: options.id,
                    visible: options.initShow
                });
                //
                dseLayer.legendType = "single";
                // var layerIndex = options.index || _map.layerIds.length;
                // _map.addLayer(dseLayer, layerIndex);
            }
            //
            return dseLayer;
        };
        /**
         * @description 创建 Feature ArcGIS FeatureLayer.
         * @private
         * */
        BaseMapUtils.prototype._createFeatureLayer = function (options) {
            //
            var dseLayer = _map.findLayerById(options.id);
            if (!dseLayer) {
                //
                dseLayer = new FeatureLayer({
                    id: options.id,
                    url: options.url,
                    // mode: FeatureLayer.MODE_ONDEMAND,
                    visible: options.initShow,
                });
                dseLayer.legendType = "ags";
                // var layerIndex = options.index || _map.layerIds.length;
                // _map.addLayer(dseLayer, layerIndex);
            }
            //
            return dseLayer;
        };
        /**
         * @description 创建 Feature WFS Layer.
         *
         * @private
         * */
        // _createWfsLayer: function (options) {
        //
        //     var dseLayer = _map.findLayerById(options.id);
        //     //
        //     if (!dseLayer) {
        //         //
        //         dseLayer = new WFSLayer({
        //             url: options.url,
        //             visible: options.initShow
        //         });
        //         dseLayer.id = options.id;
        //         dseLayer.legendType = "ags";
        //         // var layerIndex = options.index || _map.layerIds.length;
        //         // _map.addLayer(dseLayer, layerIndex);
        //     }
        //     //
        //     return dseLayer;
        // },
        /**
         * @description 创建ArcGIS dynamic Layer.
         *
         * @private
         * */
        BaseMapUtils.prototype._createDynamicLayer = function (options) {
            //
            var dseLayer = _map.findLayerById(options.id);
            //
            if (!dseLayer) {
                //
                dseLayer = new MapImageLayer({
                    //
                    url: options.url,
                    id: options.id,
                    visible: options.initShow
                });
                dseLayer.legendType = "ags";
            }
            return dseLayer;
        };
        /**
         * @description 创建信息展示图层.
         *
         * @private
         * */
        //
        BaseMapUtils.prototype._createQueryDisplayLayer = function (layerProps) {
            // //
            // var dseLayer = this._map_.findLayerById(layerProps.id); //_map.findLayerById(options.id);
            // if (!dseLayer) {
            //     //
            //     layerProps.map = _map;
            //     layerProps.mapType = this.mapType;
            //     // options.mapType
            //     // options.mapType
            //     dseLayer = new QueryDisplayLayer(layerProps);
            //     //
            //     dseLayer.visible = layerProps.initShow;
            //     dseLayer.id = layerProps.id;
            //     // dseLayer
            //     dseLayer.legendType = "single";
            //     if (layerProps.configUrl) {
            //         //
            //         require([layerProps.configUrl], function (xxConfig) {
            //             //
            //             xxConfig.legendInfo.layerId = dseLayer.id;
            //             xxConfig.legendInfo.layerName = dseLayer.name;
            //             //
            //             // dseLayer.template = xxConfig.template;
            //             //
            //             dseLayer.setLayerTemplate(xxConfig.template);
            //             dseLayer.setLayerTips(xxConfig.tips);
            //             dseLayer.legendInfo = xxConfig.legendInfo;
            //             dseLayer.symbolCallBack = xxConfig.symbolCallBack;
            //             // dseLayer.tips = xxConfig.tips;
            //         });
            //     }
            //     // dseLayer.legendInfo = options.legendInfo;
            //     // dseLayer.name = options.name;
            // }
            // return dseLayer;
        };
        /**
         * @description 加载基于太乐地图下载的离线万片.
         * @private
         * */
        BaseMapUtils.prototype._createLocalTaiLeLayer = function (layerCfg, isLabel) {
            //
            var imageFormat = layerCfg.format || ".png";
            if (isLabel) {
                layerCfg.id = layerCfg.id + "w";
            }
            //
            var layerExtent = new Extent({
                xmin: layerCfg.fullExtent[0],
                ymin: layerCfg.fullExtent[1],
                xmax: layerCfg.fullExtent[2],
                ymax: layerCfg.fullExtent[3]
            });
            var tiledLayer = new WebTileLayer({
                urlTemplate: layerCfg.url + localUrlTemplateSuffix + imageFormat,
                subDomains: [],
                id: layerCfg.id,
                visible: layerCfg.initShow,
                // initExtent: layerCfg.initExtent,
                fullExtent: layerExtent
            });
            return tiledLayer;
        };
        /**
         * @description 创建程序底图
         * @public
         * */
        //
        BaseMapUtils.prototype.loadBaseLayers = function (layersCfg) {
            // var layers = [];
            this._layers_ = [];
            var self = this;
            arrayUtils.forEach(layersCfg, dojoLang.hitch(this, function (cfg) {
                //
                var baseLayer = null;
                //
                var labelLayer = null;
                switch (cfg.type) {
                    //
                    case "google":
                        //
                        this.loadGoogleLayer({
                            id: cfg.id,
                            type: cfg.url,
                            visible: cfg.initShow
                        });
                        break;
                    case "tdt":
                        this.loadTDTLayer({
                            id: cfg.id,
                            type: cfg.url,
                            visible: cfg.initShow
                            // wkid:DseGisConfig.mapType
                        });
                        break;
                    case "arcgis":
                        baseLayer = new TileLayer({
                            //
                            url: cfg.url,
                            id: cfg.id,
                            visible: cfg.initShow
                        });
                        // _map.addLayer(baseLayer);
                        self._layers_.push(baseLayer);
                        break;
                    //加载ArcGIS动态地图服务.
                    case "dynamic":
                        baseLayer = new MapImageLayer({
                            url: cfg.url,
                            visible: cfg.initShow
                        });
                        // _map.addLayer(baseLayer);
                        self._layers_.push(baseLayer);
                        break;
                    case "local":
                        // baseLayer = new LocalTiledLayer(cfg.url, {
                        //     //
                        //     id: cfg.id,
                        //     visible: cfg.initShow,
                        //     // cacheValue:cfg.code,
                        //     initExtent: cfg.initExtent,
                        //     fullExtent: cfg.fullExtent
                        // });
                        // // _map.addLayer(baseLayer);
                        // self._layers_.push(baseLayer);
                        break;
                    /**
                     * <p>加载Google 离线地图</p>
                     * @author wangsl
                     * @date 2017-03-21
                     * */
                    case "googleOffLine":
                        //
                        baseLayer = this._createLocalTaiLeLayer(cfg);
                        // _map.addLayer(baseLayer);
                        self._layers_.push(baseLayer);
                        //加载标签服务
                        if (cfg.labelInfo && cfg.labelInfo.url) {
                            //
                            labelLayer = self._createLocalTaiLeLayer(cfg, true);
                            // _map.addLayer(baseLayer);
                            self._layers_.push(labelLayer);
                        }
                        break;
                    /**mapOffice*/
                    case "offline":
                        baseLayer = this._createLocalTaiLeLayer(cfg);
                        // _map.addLayer(baseLayer);
                        self._layers_.push(baseLayer);
                        //加载标签服务
                        if (cfg.labelInfo && cfg.labelInfo.url) {
                            //
                            labelLayer = this._createLocalTaiLeLayer(cfg, true);
                            // _map.addLayer(baseLayer);
                            self._layers_.push(labelLayer);
                        }
                        break;
                    /**加载超图WMTS切片图*/
                    case "smWmts":
                        //
                        // baseLayer = new SuperMapWMTSLayer(cfg.url, {
                        //     //
                        //     id: cfg.id,
                        //     scales: cfg.scales,
                        //     startIndex: cfg.startIndex || 0,
                        //     extent: cfg.extent,
                        //     wkid: cfg.wkid,
                        //     serviceMode: cfg.serviceMode,
                        //     format: cfg.format || "image/png",
                        //     identifier: cfg.identifier,
                        //     style: cfg.style || "default",
                        //     tileMatrixSet: cfg.tileMatrixSet,
                        //     resolutionKey: cfg.resolutionKey,
                        //     visible: cfg.initShow,
                        //     token: cfg.token
                        //
                        // });
                        // //
                        // // _map.addLayer(baseLayer);
                        // self._layers_.push(baseLayer);
                        break;
                    /**加载天地图WMTS图层,CGCS2000坐标系*/
                    case "tdtWmts":
                        // baseLayer = new TdtWMTSLayer(cfg.url, {
                        //     //
                        //     id: cfg.id,
                        //     scales: cfg.scales,
                        //     startIndex: cfg.startIndex || 0,
                        //     extent: cfg.extent,
                        //     wkid: cfg.wkid,
                        //     format: cfg.format || "tiles",
                        //     identifier: cfg.identifier,
                        //     style: cfg.style || "default",
                        //     tileMatrixSet: cfg.tileMatrixSet,
                        //     visible: cfg.initShow,
                        //     origin: cfg.origin,
                        //     token: cfg.token
                        // });
                        // //
                        // // _map.addLayer(baseLayer);
                        // self._layers_.push(baseLayer);
                        // if (cfg.labelInfo) {
                        //     //
                        //     labelLayer = new TdtWMTSLayer(cfg.labelInfo.url, {
                        //         //
                        //         id: cfg.id + "w",
                        //         scales: cfg.scales,
                        //         startIndex: cfg.startIndex || 0,
                        //         extent: cfg.extent,
                        //         wkid: cfg.wkid,
                        //         format: cfg.format || "tiles",
                        //         identifier: cfg.labelInfo.identifier,
                        //         style: cfg.style || "default",
                        //         tileMatrixSet: cfg.tileMatrixSet,
                        //         visible: cfg.initShow,
                        //         origin: cfg.origin,
                        //         token: cfg.token
                        //
                        //     });
                        //     //
                        //     // _map.addLayer(labelLayer);
                        //     self._layers_.push(labelLayer);
                        // }
                        break;
                    default:
                        break;
                }
            }));
            //
            _map.addMany(self._layers_);
        };
        return BaseMapUtils;
    }());
    return BaseMapUtils;
});
//# sourceMappingURL=BaseMapUtils.js.map