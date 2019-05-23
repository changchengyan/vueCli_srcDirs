
/**
 * 场景浏览器,封装一些常用的场景控件
 * 模块中加入了一个GraphicsLayer(trackingLayer)用于代替mapView自带的graphics，
 * Update:[0.2 添加了4.7中的面积测量控件,移除以前的测量控件]
 * Version:0.2
 * Created by Dell on 2017/12/8.
 * @module SceneViewer
 */
define([
        "dojo/dom",
        "dojo/on",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/Evented",
        "esri/core/watchUtils",
        "esri/core/Accessor",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/views/SceneView",

        "esri/widgets/Home",
        "esri/widgets/LayerList",
        "esri/widgets/Expand",
        "esri/widgets/DirectLineMeasurement3D",
        "esri/widgets/AreaMeasurement3D",
        "dse/modules/measure/_measureDistance3D",
        "dse/modules/measure/_measureArea3D",

    ],
    function (dom, on, domCons, domStyle, Evented,
              watchUtils,  Accessor,  Graphic,GraphicsLayer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, SceneView,  Home, LayerList,  Expand,DirectLineMeasurement3D,
              AreaMeasurement3D,_MeasureDistance3D, _MeasureArea3D) {

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
                color: "#21BAED",
                size: "16px",  // pixels
                outline: {  // autocasts as esri/symbols/SimpleLineSymbol
                    color: [255, 255, 0],
                    width: 5  // points
                }
            }),
            printService: "",
        }

        return Accessor.createSubclass([Evented], {
            declaredClass: "dse.modules.viewers.SceneViewer",

            properties: {
                viewNode: {
                    set:function(node){
                        var view = this._createSceneView(node);
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

                            measureExpand.watch( "expanded", function(newValue, oldValue){
                               if(!newValue){
                                   // this._measureArea.clear();
                                   this._measureDistance.clear();
                                   if(this._measurementDirct&&!this._measurementDirct.destroyed){
                                       this._measurementDirct.destroy();
                                   }
                                   if(this._measurementArea3D&&!this._measurementArea3D.destroyed){
                                       this._measurementArea3D.destroy();
                                   }

                               }
                            }.bind(this));

                        }.bind(this),function(error){
                            console.log(error);
                        });
                    }
                },
                map: null,

                viewType: {
                    value: "scene-view",
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

            addGroundLayers: function (layers) {
                this.view.map.ground.layers.addMany(layers);
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

            _createSceneView: function (node) {
                var view = new SceneView({
                    container: node,
                    map: this.map,
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



                view.ui.add([
                    {
                        component: homeWidget,
                        position: "top-left",
                        index: 0
                    }, {
                        component: layerListExpand,
                        position: "top-right",
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
                    if(this._measurementDirct&&!this._measurementDirct.destroyed){
                        this._measurementDirct.destroy();
                    }
                    if(this._measurementArea3D&&!this._measurementArea3D.destroyed){
                        this._measurementArea3D.destroy();
                    }
                    this._measureDistance.start();
                }.bind(this));

                //移除自定义实现的面积控件
                // var areaNode = domCons.create("div", {
                //     "class": "esri-widget-button esri-widget esri-interactive",
                //     innerHTML: '<span class="esri-icon-polygon"></span>',
                //     title: "面积"
                // }, wrapper);
                // on(areaNode, "click", function (evt) {
                //     if(this._measurementDirct&&!this._measurementDirct.destroyed){
                //         this._measurementDirct.destroy();
                //     }
                //     if(this._measurementArea3D&&!this._measurementArea3D.destroyed){
                //         this._measurementArea3D.destroy();
                //     }
                //     this._measureArea.start();
                // }.bind(this));

                var directLineNode = domCons.create("div", {
                    "class": "esri-widget-button esri-widget esri-interactive",
                    innerHTML: '<span class="esri-icon-plus"></span>',
                    title: "直线"
                }, wrapper);

                var area3DNode = domCons.create("div", {
                    "class": "esri-widget-button esri-widget esri-interactive",
                    innerHTML: '<span class="esri-icon-polygon"></span>',
                    title: "面积(新)"
                }, wrapper);

                on(directLineNode, "click", function (evt) {
                    if(!this._measurementDirct|| this._measurementDirct.destroyed){
                        this._measurementDirct = new DirectLineMeasurement3D({
                            view: this.view
                        });
                    }
                }.bind(this));

                on(area3DNode, "click", function (evt) {
                    if(!this._measurementArea3D|| this._measurementArea3D.destroyed){
                        this._measurementArea3D = new AreaMeasurement3D({
                            view: this.view
                        });
                    }
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
                    if(this._measurementDirct&&!this._measurementDirct.destroyed){
                        this._measurementDirct.destroy();
                    }
                    if(this._measurementArea3D&&!this._measurementArea3D.destroyed){
                        this._measurementArea3D.destroy();
                    }
                }.bind(this));
                return wrapper;
            },

            _initMeasurement: function () {
                this._measureDistance = new _MeasureDistance3D({
                    view: this.view
                });
                this._measureArea = new _MeasureArea3D({
                    view: this.view
                });
                this._measurementDirct=null;
            },
        });
    });