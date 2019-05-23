/**
 * 地图浏览器,封装一些常用的地图控件
 * MapView目前还不支持高亮显示，所以在模块中加入了一个GraphicsLayer(trackingLayer)用于代替mapView自带的graphics，
 * mapView.graphics用于添加高亮要素
 * Version:0.1
 * Created by Dell on 2017/12/8.
 * @module MapViewer
 */
define([
        "dojo/dom",
        "dojo/on",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/Evented",

        "esri/core/Accessor",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/views/MapView",

        "esri/widgets/ScaleBar",
        "esri/widgets/Home",
        "esri/widgets/LayerList",
        "esri/widgets/Print",
        "esri/widgets/Compass",
        "esri/widgets/Expand",

        "dse/modules/measure/_measureDistance",
        "dse/modules/measure/_measureArea",
        "dse/modules/toolbars/Draw",
    ],
    function (dom, on, domCons, domStyle, Evented,
              Accessor,  Graphic,GraphicsLayer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, MapView,  ScaleBar, Home, LayerList, Print, Compass,  Expand,
             _MeasureDistance, _MeasureArea,  Draw) {

        var viewConfig = {
            fillSymbol: new SimpleFillSymbol({
                color: [102, 0, 255, 0.3],
                outline: {
                    type: "dash",
                    color: "#6600FF",
                    width: 3
                }
            }),

            lineSymbol: new SimpleLineSymbol({
                color: "#21BAED",
                width: 3
            }),

            markerSymbol: new SimpleMarkerSymbol({
                style: "circle",
                color: [255, 255, 0],
                size: "16px",  // pixels
                outline: {  // autocasts as esri/symbols/SimpleLineSymbol
                    color: [255, 255, 0],
                    width: 5  // points
                }
            }),
            printService: "",
        }

        return Accessor.createSubclass([Evented], {
            declaredClass: "dse.modules.viewers.MapViewer",

            properties: {
                viewNode: {
                    set:function(node){
                        var view = this._createMapView(node);
                        this._set("viewNode",node);
                        this._set("view", view);

                        view.when(function(evt){//初始化trackinglayer,初始化测量工具
                           this._initialTrackingLayer();
                            var measureExpand = new Expand({
                                expandIconClass: "esri-icon-settings",
                                expandTooltip: "测量",
                                view: view,
                                content: this._createMeasurementUI()
                            });
                            view.ui.add([
                                {
                                    component: measureExpand,
                                    position: "top-left",
                                    index: 0
                                },
                            ]);
                        }.bind(this),function(error){
                            console.log(error);
                        });
                    }
                },
                map: null,

                viewType: {
                    value: "map-view",
                    readOnly: true
                },
                view: {
                    readOnly: true,
                },
                trackingLayer: {
                    readOnly: true,
                },

                graphics: {
                    readOnly: true,
                    get: function () {
                        return this.trackingLayer.graphics;
                    }
                }

            },

            addLayer: function (layer) {
                this.map.add(layer);
            },

            addLayers: function (layers) {
                this.map.addMany(layers);
            },

            goTo: function (target) {
                this.view.goTo(target);
            },

            removeLayer:function(layer){
                 this.map.remove(layer);
            },


            highlight: function (geometry) {
                this._clearHighLight();
                var graphic = new Graphic(geometry);
                switch (geometry.type) {
                    case "polygon":
                        graphic.symbol = viewConfig.fillSymbol;
                        break;
                    case "polyline":
                        graphic.symbol = viewConfig.lineSymbol;
                        break;
                    case "point":
                        graphic.symbol = viewConfig.markerSymbol;
                        break;
                }

                this._addHighLight(graphic);
            },

            //在第一次加载完图层后调用
            _initialTrackingLayer: function () {
                var trackingLyr = new GraphicsLayer({
                    id: "DE_ViewerGraphicLyr",
                    title: "绘制图层",
                    elevationInfo: {
                        mode: "on-the-ground"
                    },
                    listMode:"hide"
                });
                this.map.add(trackingLyr);
                this._set("trackingLayer",trackingLyr);

            },

            clear: function () {
                if (this.trackingLayer) {
                    this.trackingLayer.removeAll();
                }
                this._clearHighLight();
            },

            _clearHighLight: function () {
                this.view.graphics.removeAll();
            },

            addGraphic: function (graphic) {
                this.trackingLayer.add(graphic);
            },

            addGraphics: function (graphics) {
                this.trackingLayer.addMany(graphics);
            },

            _addHighLight: function (graphic) {
                this.view.graphics.add(graphic);
            },

            /**
             * 删除带有指定graphic
             * @method 删除graphic
             * @for MapViewer
             * @param {Graphic} graphic 被删除的graphic
             */
            removeGraphic: function (graphic) {
                this.trackingLayer.remove(graphic);
            },

            /**
             * 删除带有指定标识的graphic(s)
             * @method 删除graphic(s)
             * @for MapViewer
             * @param {String} flag graphic的标识，用graphic.flag表示
             * @return {Array} 返回被删除的graphic
             */
            removeGraphics: function (flag) {
                var finds = this.trackingLayer.graphics.filter(function (graphic) {
                    return graphic.flag === flag;
                });
                this.trackingLayer.removeMany(finds);
                return finds;
            },

            _createMapView: function (node) {
                var view = new MapView({
                    container: node,
                    map: this.map,
                });


                    var scaleBar = new ScaleBar({
                        view: view,
                        unit: "metric"
                    });


                    var homeWidget = new Home({
                        view: view
                    });


                    var layerList = new LayerList({
                        view: view,
                        container: document.createElement("div"),
                    });

                    var layerListExpand = new Expand({
                        expandIconClass: "esri-icon-layers",
                        expandTooltip: "图层列表",
                        view: view,
                        content: layerList.domNode
                    });

                    var print = new Print({
                        view: view,
                        container: document.createElement("div"),
                        printServiceUrl: viewConfig.printService.url
                    });

                    var printExpand = new Expand({
                        expandIconClass: "esri-icon-printer",
                        expandTooltip: "截图",
                        view: view,
                        content: print.domNode
                    });


                    var compass = new Compass({
                        view: view
                    });


                    view.ui.add([
                        {
                            component: scaleBar,
                            position: "bottom-left",
                            index: 0
                        },
                        {
                            component: homeWidget,
                            position: "top-left",
                            index: 0
                        }, {
                            component: layerListExpand,
                            position: "top-right",
                            index: 0
                        }, {
                            component: printExpand,
                            position: "top-right",
                            index: 0
                        }, {
                            component: compass,
                            position: "top-left",
                            index: 0
                        },
                    ]);
                return view;
            },

            _createMeasurementUI: function () {
                this._initMeasurement();
                var wrapper = domCons.create("div");

                var distanceNode = domCons.create("div", {
                    "class": "esri-widget-button esri-widget esri-interactive",
                    innerHTML: '<span class="esri-icon-polyline"></span>',
                    title: "距离",
                }, wrapper);
                on(distanceNode, "click", function (evt) {
                    this._measureDistance.start();
                }.bind(this));

                var areaNode = domCons.create("div", {
                    "class": "esri-widget-button esri-widget esri-interactive",
                    innerHTML: '<span class="esri-icon-polygon"></span>',
                    title: "面积"
                }, wrapper);
                on(areaNode, "click", function (evt) {
                    this._measureArea.start();
                }.bind(this));
                var clearNode = domCons.create("div", {
                    "class": "esri-widget-button esri-widget esri-interactive",
                    innerHTML: '<span class="esri-icon-trash"></span>',
                    title: "清除"
                }, wrapper);

                on(clearNode, "click", function (evt) {
                    this.clear();
                    this._measureArea.clear();
                    this._measureDistance.clear();
                }.bind(this));
                return wrapper;
            },

            _initMeasurement: function () {
                this._measureDistance = new _MeasureDistance({
                    view: this.view
                });
                this._measureArea = new _MeasureArea({
                    view: this.view
                });
            },
        });
    });