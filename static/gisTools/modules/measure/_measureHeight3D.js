/**
 * Created by DExtra on 2017-8-14 16:17:30.
 * 弃用,不建议使用
 */
define([
        "dojo/_base/lang",
        "esri/geometry/Polyline",
        "esri/geometry/Point",
        "esri/geometry/geometryEngine",
        "esri/Graphic",
        "esri/symbols/TextSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/layers/GraphicsLayer",
        "dse/modules/toolbars/_drawZLine3D",
        "dojo/on",
        "esri/core/Accessor",
],
    function (lang, Polyline, Point, geometryEngine, Graphic
              , TextSymbol, SimpleMarkerSymbol, SimpleLineSymbol, GraphicsLayer, _DrawLine, on, Accessor) {
        var measureConfig = {
            isActive: false,
            // meters | feet | kilometers | miles | nautical-miles | yards
            units: "meters",
            activeFeature: null,
            finsishedFeature: null,
            markerSymbol: new SimpleMarkerSymbol({
                color: "#21BAED",
                width: 0.1
            }),
            lineSymbol: new SimpleLineSymbol({
                color: "#21BAED",
                width: 1.5
            }),

        };

        var measureDistance = Accessor.createSubclass({
            declaredClass: "dse.modules.measure._measureHeight3D",
            constructor: function (options) {
                var self = this;
                this.view = options.view;
                this._listeners = [];
                this._draw = new _DrawLine({ view: options.view });
                this._stopPoints = null;
                this._stopGraphics = [];
                this._stopDistances = null;
                this._measureLayer = new GraphicsLayer({
                    id: "dextra-measureHeight3D",
                    elevationInfo: {
                        mode: "on-the-ground",

                    },
                    title: "三维高度量算图层",
                    listMode:"hide"
                });

                this.view.map.add(this._measureLayer);
                //this._measureLayer = options.view.graphics;
                this._draw.on("draw-complete", function (evt) {
                    self._drawComplete(evt);
                });

                this._initialMeasureLayer();
            },

            properties: {
                view: null,
                type: {
                    readOnly: true,
                    get: function () {
                        return "height3D";
                    }
                },
                draw: {
                    readOnly: true,
                    get: function () {
                        return this._draw;
                    }
                }
            },

            _drawComplete: function (evt) {
                var feature = evt.feature;
            
                this._endMeasureDistance(feature.geometry);
                this._draw.deactivate();
            },

            _initialMeasureLayer: function () {
                this.view.on("click", lang.hitch(this, function (evt) {
                    var self = this;
                    this.view.hitTest(evt).then(function (response) {
                        var graphic = response.results[0].graphic;
                        if (graphic.symbol.isClearBtn) {
                            self._measureLayer.removeAll();
                        }
                    });
                }));
            },

            //开始测量距离
            start: function () {
                this._clearMapMouseClickEvent();
                this._measureLayer.removeAll();
                this._draw.deactivate();
                this._draw.activate();
  
            },

            clear: function () {
                this._measureLayer.removeAll();
                this._clearMapMouseClickEvent();
                this._draw.deactivate();
                this._draw.clear();
            },

            _measure: function (startPoint,endPoint) {

                var distance = endPoint.z - startPoint.z;

                var stopGraphic = new Graphic({
                    geometry: endPoint.clone(),
                    symbol: measureConfig.markerSymbol
                });

                var textGraphic = this._getStopPointGraphic(endPoint.clone(), distance);

                this._measureLayer.add(textGraphic);
                this._measureLayer.add(stopGraphic);
                this._stopGraphics.push(textGraphic);
            },

            //测量结束、测量线段
            _endMeasureDistance: function (line) {
                var startPoint = line.getPoint(0, 0);
                var endPoint = line.getPoint(0, 1);
       
                this._measure(startPoint, endPoint);
           
                var lineGraphic = new Graphic({
                    geometry: line,
                    symbol: measureConfig.lineSymbol
                });
                this.view.graphics.add(lineGraphic);
                //this._measureLayer.add(lineGraphic);
                this._clearMapMouseClickEvent();
            },

            //获取测量点的Graphics
            _getStopPointGraphic: function (stopPoint, distance) {
               
                var textSymbol = this._createTextSymbol("起点");
                textSymbol.text = distance.toFixed() + "m";
              
                return new Graphic({
                    geometry: stopPoint,
                    symbol: textSymbol
                });
            },
            //计算距离
            _calDistance: function (point1, point2) {

            },

            _createTextSymbol: function (text) {
                var textSymbol = new TextSymbol({
                    color: "white",
                    haloColor: "#33cc33",
                    haloSize: 1,
                    horizontalAlignment: "right",
                    xoffset: 3,
                    yoffset: 3,
                    text: text,
                    font: {  // autocast as esri/symbols/Font
                        size: 12,
                        family: "sans-serif",
                        weight: "bolder"
                    }
                });
                return textSymbol;
            },

            _clearMapMouseClickEvent: function () {
                if (this._mapClickFlag != null) {
                    this._mapClickFlag.remove();
                    this._mapClickFlag = null;
                }
            },

            _toMapPoint: function (event) {
                var point = this.view.toMap(event);
                return point;
            }

        });

        return measureDistance;
    });
