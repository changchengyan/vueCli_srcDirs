/**
 * Created by dell on 2017-8-14 16:17:30.
 */
define([
        "dojo/_base/lang",
        "esri/geometry/Polygon",
        "esri/geometry/Point",
        "esri/geometry/geometryEngine",
        "esri/Graphic",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/TextSymbol",
        "esri/layers/GraphicsLayer",
        "dse/modules/toolbars/_drawPolygon3D",
        "dojo/on",
        "esri/core/Accessor",
],
    function (lang, Polygon, Point, geometryEngine, Graphic, SimpleMarkerSymbol, SimpleFillSymbol, TextSymbol, GraphicsLayer, _DrawPolygon, on, Accessor) {
        var measureConfig = {
            isActive: false,
            // meters | feet | kilometers | miles | nautical-miles | yards
            units: "meters",
            activeFeature: null,
            finsishedFeature: null,
            fillSymbol: new SimpleFillSymbol({
                color: [102, 0, 255, 0.2],
                outline: {
                    color: "#6600FF",
                    width: 2
                }
            }),
            markerSymbol: new SimpleMarkerSymbol({
                color: "#21BAED",
                width: 1.5
            })
        };

        var measureArea = Accessor.createSubclass({
            declaredClass: "dse.modules.measure._measureArea",
            constructor: function (options) {
                var self = this;
                this.view = options.view;
                this._listeners = [];
                this._draw = new _DrawPolygon({ view: options.view });

                this._measureLayer = new GraphicsLayer({
                    id: "dextra-measureArea3D",
                    elevationInfo: {
                        mode: "on-the-ground",
                        offset: 1
                    },
                    title: "三维测量面积图层",
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
                        return "distance";
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
                this._measure(evt.feature.geometry);
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
                this._measureLayer.removeAll();
                this._draw.deactivate();
                this._draw.activate();
            },

            clear: function () {
                this._measureLayer.removeAll();
                this._clearMapMouseClickEvent();
                this._draw.deactivate();
            },

            _measure: function (polygon) {
                var area = this._calArea(polygon)
                var textGraphic = this._getStopPointGraphic(polygon.centroid, area);
                var polygonGraphic = new Graphic({
                    geometry: polygon,
                    symbol: measureConfig.fillSymbol
                });
                this._measureLayer.add(polygonGraphic);
                this._measureLayer.add(textGraphic);

            },



            //获取测量点的Graphics
            _getStopPointGraphic: function (centerPoint, area) {
                var textSymbol = this._createTextSymbol("面积");
                if (area > 0 && area >= 1000000) {
                    textSymbol.text = (area / 1000000).toFixed(2) + "平方千米";
                } else if (area > 0 && area < 1000000) {
                    textSymbol.text = area.toFixed() + "平方米";
                }

                return new Graphic({
                    geometry: centerPoint,
                    symbol: textSymbol
                });
            },
            //计算距离
            _calArea: function (polygon) {

                if (this.view.spatialReference.isWGS84 || this.view.spatialReference.isWebMercator) {//在web麦卡托投影和WGS84坐标系下的计算方法
                    return geometryEngine.geodesicArea(polygon, "square-meters");
                } else {//在其他投影坐标系下的计算方法
                    return geometryEngine.planarArea(polygon, "square-meters")
                }
            },



            _createTextSymbol: function (text) {
                var textSymbol = new TextSymbol({
                    color: "white",
                    haloColor: "#33cc33",
                    haloSize: "2px",
                    xoffset: 3,
                    yoffset: 3,
                    horizontalAlignment: "right",
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

        return measureArea;
    });
