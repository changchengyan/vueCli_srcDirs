/**
 * Created by DExtra on 2017-8-14 16:17:30.
 * 自定义实现的测量距离方法
 */
define([
        "dojo/on",
        "dojo/_base/lang",

        "esri/geometry/Polyline",
        "esri/geometry/Point",
        "esri/geometry/geometryEngine",
        "esri/Graphic",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/TextSymbol",

        "esri/views/2d/draw/Draw",
        "esri/core/Accessor",

        "../../layers/OverlayLayer"
],
    function (on, lang,
               Polyline, Point, geometryEngine, Graphic, SimpleMarkerSymbol, SimpleLineSymbol, TextSymbol, Draw, Accessor,
               OverlayLayer) {
        var measureConfig = {
            lineSymbol: new SimpleLineSymbol({
                color: "#21BAED",
                width: 1.5
            }),
            markerSymbol: new SimpleMarkerSymbol({
                color: "#21BAED",
                width: 1.5
            })
        };

        var measureDistance = Accessor.createSubclass({
            declaredClass: "dse.modules.measure._measureDistance",
            _stops: [],
            properties: {
                view: {
                    value: null,
                    set: function (value) {
                        var draw = new Draw({
                            view: value
                        });
                        this._set("view", value);
                        this._set("draw", draw);
                        this._createOverLaylayer(value);//用自定义的overlayLayer添加divlabel,overlaylayer这个类还有有点bug，如果不喜欢，注释该行，修改_labelDistance方法

                    }
                },
                draw: {
                    readOnly: true,
                    value: null,
                },
                type: {
                    readOnly: true,
                    get: function () {
                        return "distance";
                    }
                },
            },

            //开始测量距离
            start: function () {
                this.view.focus();
                var action = this.draw.create("polyline",{
                    mode:"hybrid"
                });

                action.on("vertex-add", function (evt) {
                    var length = this._measure(evt.vertices);
                    this._addVertex(evt.vertices, length);
                }.bind(this));

                action.on("cursor-update", function (evt) {
                    this._measure(evt.vertices);
                }.bind(this));

                action.on("draw-complete", function (evt) {
                    this._measure(evt.vertices);
                }.bind(this));

                action.on("vertex-remove", function (evt) {
                    this._measure(evt.vertices);
                }.bind(this));
            },

            clear: function () {
                this.view.graphics.removeAll();
                this._overlayLayer.removeAll();
                this.draw.reset();
            },

            _measure: function (vertices) {
                var line = this._createPolyline(vertices);
                var lineLength = 0;

                if (line.paths[0].length > 1) {
                    lineLength = this._measureLength(line)
                }
                this._createGraphic(line);
                return lineLength;

            },

            _measureLength: function (line) {
                line = geometryEngine.simplify(line);
                if (this.view.spatialReference.isWGS84 || this.view.spatialReference.isWebMercator) {//在web麦卡托投影和WGS84坐标系下的计算方法
                    return geometryEngine.geodesicLength(line, "meters");
                } else {//在其他投影坐标系下的计算方法
                    return geometryEngine.planarLength(line, "meters")
                }
            },

            _labelDistance: function (geom, distance) {
                var textSymbol = this._createTextSymbol("起点");
                if (distance > 0 && distance >= 1000) {
                    textSymbol.text = (distance / 1000).toFixed(2) + "km";
                } else if (distance > 0 && distance < 1000) {
                    textSymbol.text = distance.toFixed() + "m";
                }
                //添加html元素的方式显示距离，不喜欢的话可以注释掉以下代码
                var toolTip =  createTooltip(textSymbol.text);
                this._overlayLayer.add({
                    html: toolTip,
                    geometry: geom
                });



                //用textsymbol的方式显示距离，由于textsymbol的holocolor目前不支持mapview，
                // 所以显示效果不太好，暂时替换，等更新后看实际情况在进行替换。
                // 也可以取消注释自行查看效果

                // var txtGraphic=new Graphic({
                //     geometry: geom,
                //     symbol: textSymbol
                // });
                // txtGraphic.flag="label";
                // this.view.graphics.add(txtGraphic);

                //创建divlabel容器
                function createTooltip(text) {
                    var tooltip = document.createElement("div");
                    tooltip.setAttribute("role", "tooltip");
                    tooltip.classList.add("dextra-tooltip");

                    var textElement = document.createElement("div");
                    textElement.classList.add("esri-widget");
                    textElement.innerHTML = text;
                    tooltip.appendChild(textElement);
                    return tooltip;
                }
            },

            _createTextSymbol: function (text) {
                var textSymbol = new TextSymbol({
                    color: "coral",
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

            _addVertex: function (vertexs, length) {
                var vertex = vertexs[vertexs.length - 1];
                var point = new Point({
                    x: vertex[0],
                    y: vertex[1],
                    spatialReference: this.view.spatialReference
                });
                var graphic = new Graphic({
                    geometry: point,
                    symbol: measureConfig.markerSymbol
                });
                graphic.flag = "vertex";
                this.view.graphics.add(graphic);
                this._labelDistance(point.clone(), length);
                return graphic;
            },

            _createPolyline: function (vertices) {

                var polyline = new Polyline({
                    paths: vertices,
                    spatialReference: this.view.spatialReference
                });
                return polyline;
            },

            _createGraphic: function (polyline) {
                this._remove("line");
                var graphic = new Graphic({
                    geometry: polyline,
                    symbol: measureConfig.lineSymbol
                });
                graphic.flag = "line";
                this.view.graphics.add(graphic);
                return graphic;
            },

            _remove: function (flag) {
                var find = this.view.graphics.find(function (graphic) {
                    return graphic.flag === flag;
                });
                if (find) {
                    this.view.graphics.remove(find);
                }
            },

            //创建div图层，overlaylayer类还有bug，这是暂时的解决方案。
            _createOverLaylayer: function (view) {
                this._overlayLayer = new OverlayLayer({
                    popupEnabled: true,
                    listMode: "hide"
                });
                view.map.add(this._overlayLayer);
            }
        });

        return measureDistance;
    });
