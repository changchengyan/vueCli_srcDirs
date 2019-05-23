/**
 * 联动浏览器,实现二三维联动一体化
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
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/layers/GraphicsLayer",
        "esri/core/Accessor",

    "../ViewSynchronizer"


    ],
    function (dom, on, domCons, domStyle, Evented,SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol,GraphicsLayer,
              Accessor,ViewSynchronizer) {

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
                color: [255, 0, 0],
                size: "20px",  // pixels
                outline: {  // autocasts as esri/symbols/SimpleLineSymbol
                    color: [255, 0, 0],
                    width: 5  // points
                }
            }),
            printService: "",
            viewType:"none"
        }

        return Accessor.createSubclass([Evented], {
            declaredClass: "dse.modules.viewers.SyncViewerManager",
            constructor:function(){

                this.viewSynchronizer = new ViewSynchronizer([]);

            },

            properties: {
                mapViewer:{
                    set:function(value){
                        //value.trackingLayer.visible = false;
                        this.viewSynchronizer.add(value.view);
                        this._set("mapViewer",value);

                        this._initialTrackingLayer();

                    }
                },

                sceneViewer:{
                    set:function(value){
                        //value.trackingLayer.visible = false;
                        this.viewSynchronizer.add(value.view);
                        this._set("sceneViewer",value);
                    }
                },

                viewType: {
                    readOnly:true,
                    value: "sync-view",
                    get:function() {
                        return viewConfig.viewType
                    }
                },

                viewer:{
                    readOnly:true,
                    get: function () {
                        switch (viewConfig.viewType) {

                            case "map-view":
                                return this.mapViewer;
                            case "scene-view":
                                return this.sceneViewer;
                            default:
                                return this.mapViewer;
                        }
                    }

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



            goTo: function (target) {
                this.viewer.goTo(target);
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
                console.log(graphic);
                this._addHighLight(graphic);
            },


            _initialTrackingLayer: function () {
                var trackingLyr = new GraphicsLayer({
                    id: "DE_SyncViewerGraphicLyr",
                    title: "绘制图层",
                    elevationInfo: {
                        mode: "on-the-ground"
                    },
                    listMode:"hide"
                });
                this.mapViewer.addLayer(trackingLyr);
                this._set("trackingLayer",trackingLyr);

            },

            clear: function () {
                this.trackingLayer.removeAll();
                this.mapViewer.clear();
                this.sceneViewer.clear();
                //this._clearHighLight();
            },

            _clearHighLight: function () {
                this.viewer._clearHighLight();
            },

            addGroundLayers: function (layers) {
                this.sceneViewer.addGroundLayers(layers);
            },

            addGraphic: function (graphic) {
                this.trackingLayer.add(graphic);
            },

            addGraphics: function (graphics) {
                this.trackingLayer.addMany(graphics);
            },

            _addHighLight: function (graphic) {
                this.viewer._addHighLight(graphic)
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

            showView:function(viewType){
                switch (viewType){
                    case "map-view":
                        this.sceneViewer.removeLayer(this.trackingLayer);
                        this.mapViewer.addLayer(this.trackingLayer);

                        break;
                    case "scene-view":
                        this.mapViewer.removeLayer(this.trackingLayer);
                        this.sceneViewer.addLayer(this.trackingLayer);

                        break;
                    case "sync-view":
                        break;
                }
                viewConfig.viewType = viewType;
            
                this.notifyChange("viewType");
            }


        });


    });