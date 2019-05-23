/**
 * Created by DExtra on 2017-8-14 16:17:30.
 */
define([
        "dojo/_base/lang",
        "esri/geometry/Polyline",
        "esri/geometry/Point",
        "esri/geometry/geometryEngine",
        "esri/Graphic",
        "esri/symbols/TextSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/layers/GraphicsLayer",
        "dse/modules/toolbars/_drawLine3D",
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
                width: 2
            }),

        };

        var measureDistance = Accessor.createSubclass({
            declaredClass: "dse.modules.measure._measureDistance3D",
            constructor: function (options) {
                var self = this;
                this.view = options.view;
                this._listeners = [];
                this._draw = new _DrawLine({ view: options.view });
                this._stopPoints = null;
                this._stopGraphics = [];
                this._stopDistances = null;
                this._measureLayer = new GraphicsLayer({
                    id: "dextra-measureDistance3D",
                    elevationInfo: {
                        mode: "on-the-ground",
                        offset: 1
                    },
                    title: "三维测量距离图层",
                    listMode:"hide"
                });
                this.view.map.add(this._measureLayer);
                //this._measureLayer = options.view.graphics;
                //this._measureLayer.elevationInfo = {
                //    mode: "on-the-ground",
                //    offset: 1
                //};
 

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
                        return "distance3D";
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
                var endPoint = feature.geometry.getPoint(0, feature.geometry.paths[0].length - 1);
                this._endMeasureDistance(feature.geometry, endPoint);
                //this._draw.deactivate();
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
                this._stopPoints = [];
                this._stopDistances = [];
                this._measureLayer.removeAll();
                this._draw.deactivate();
                this._draw.activate();
                var self = this;
                this._stopGraphics = [];

                this._mapClickFlag = this.view.on("pointer-down", function (evt) {
                    if (evt.native.button !== 0) return;
                    var point = self._toMapPoint(evt);
                    if (point === null) return
                    self._measure(point)
                });
            },

            clear: function () {
                this._measureLayer.removeAll();
                this._clearMapMouseClickEvent();
                this._draw.deactivate();
            },

            _measure: function (point) {
                var stopPoints = this._stopPoints;
                var stopDistances = this._stopDistances;
                var self = this;
                var distance = 0;
                var stopPoint = point;


                if (stopPoints.length > 0) {
                    var startPoint = stopPoints[stopPoints.length - 1];
                    distance = self._calDistance(startPoint, stopPoint);
                    if (self._stopDistances.length > 0) {
                        distance += self._stopDistances[self._stopDistances.length - 1];
                    }
                    stopDistances.push(distance);
                }
                stopPoints.push(stopPoint);
                var stopGraphic = new Graphic({
                    geometry: stopPoint.clone(),
                    symbol: measureConfig.markerSymbol
                });

                var textGraphic = self._getStopPointGraphic(stopPoint.clone(), distance);

                self._measureLayer.add(textGraphic);
                self._measureLayer.add(stopGraphic);
                self._stopGraphics.push(textGraphic);
            },

            //测量距离结束，添加清除按钮、测量线段
            _endMeasureDistance: function (line, endPoint) {
                this._measure(endPoint);
                var lineGraphic = new Graphic({
                    geometry: line,
                    symbol: measureConfig.lineSymbol
                });

                this._measureLayer.add(lineGraphic);
                this._clearMapMouseClickEvent();
            },

            //获取测量点的Graphics
            _getStopPointGraphic: function (stopPoint, distance) {

                var textSymbol = this._createTextSymbol("起点");
                if (distance > 0 && distance >= 1000) {
                    textSymbol.text = (distance / 1000).toFixed(2) + "km";
                } else if (distance > 0 && distance < 1000) {
                    textSymbol.text = distance.toFixed() + "m";
                }

                return new Graphic({
                    geometry: stopPoint,
                    symbol: textSymbol
                });
            },
            //计算距离
            _calDistance: function (point1, point2) {
                var startPointCoordinates = [point1.x, point1.y];
                var endPointCoordinates = [point2.x, point2.y];

                var line = new Polyline({
                    spatialReference: this.view.spatialReference,
                    hasZ: false,
                    hasM: false,
                    paths: [[
                        startPointCoordinates,
                        endPointCoordinates
                    ]
                    ]
                });

                if (this.view.spatialReference.isWGS84 || this.view.spatialReference.isWebMercator) {//在web麦卡托投影和WGS84坐标系下的计算方法
                    return geometryEngine.geodesicLength(line, "meters");
                } else {//在其他投影坐标系下的计算方法
                    return geometryEngine.planarLength(line, "meters")
                }
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
