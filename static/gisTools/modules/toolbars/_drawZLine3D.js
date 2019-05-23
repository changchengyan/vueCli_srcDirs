/**
 * Created by dell on 2017/8/9.
 * 绘制线，等后续api更新后可能会弃用QAQ
 */
define([
        "esri/geometry/Polyline",
        "esri/Graphic",
        "esri/symbols/LineSymbol3DLayer",
        "esri/symbols/LineSymbol3D",
        "esri/geometry/geometryEngine",
        "esri/core/Accessor",
        "dojo/Evented",
],
    function (Polyline, Graphic, LineSymbol3DLayer, LineSymbol3D, geometryEngine, Accessor, Evented) {
        var line3Dlayer = new LineSymbol3DLayer({
            size: 2,  // points
            material: { color: "#21BAED" }
        })

        var drawConfig = {
            isActive: false,
            // circle | extent | polygon | polyline | point
            type: "z-polyline3D",
            activeFeature: null,

            symbol: new LineSymbol3D({
                symbolLayers: [line3Dlayer],

            }),

        }


        var drawline = Accessor.createSubclass([Evented], {
            declaredClass: "dse.modules.toolbars._drawzLine3D",
            constructor: function (options) {
                this.view = options.view;
                this._listeners = [];
                if (options.symbol) {
                    drawConfig.symbol = options.symbol;
                }

            },
            _start: null,
            _end: null,

            _startX: -1,
            _startY: -1,

            properties: {
                view: null,
                geometry: {
                    get: function () {
                        return drawConfig.activeFeature.geometry;
                    }
                },
                type: {
                    readOnly: true,
                    get: function () {
                        return "z-polyline3D";
                    }
                },
                isActive: {
                    readOnly: true,
                    get: function () {
                        return drawConfig.isActive;
                    }
                },



            },

            activate: function (symbol) {
                drawConfig.isActive = true;
                drawConfig.activeFeature = null;
                if (symbol) {
                    drawConfig.symbol = symbol;
                }
                this._bindListeners();
            },

            deactivate: function () {
                drawConfig.isActive = false;
                if (this._listeners.length > 0) {
                    for (var i = 0; i < this._listeners.length; i++) {
                        this._listeners[i].remove();
                    }
                    this._listeners.length = 0;
                }
              //  this.clear();
            },

            clear: function () {
                var self = this;
                var find = this.view.graphics.find(function (graphic) {
                    return graphic.geometry.type === "polyline";
                });

                if (find) {
                    this.view.graphics.remove(find);
                }
            },

            _bindListeners: function () {
                var self = this;
                var viewClickHandler = this.view.on("click", function (event) {
                    event.stopPropagation();
                });

                var pointerDownListener = this.view.on("pointer-down", function (event) {
                    if (self._startX === -1 && self._startY === -1) {
                        self._startX = event.x;
                        self._startY = event.y;
                    }

                    if (event.native.button !== 0)
                        return;
                    self._addPoint(event);

                });

                var pointerMoveListener = this.view.on("pointer-move", function (event) {

                    self._updateLastVertex(event);
                });

                var doubleClickListener = this.view.on("double-click", function (event) {
                    self._finishDrawing(event);
                    event.stopPropagation();
                });

                this._listeners.push(viewClickHandler);
                this._listeners.push(pointerDownListener);
                this._listeners.push(pointerMoveListener);
                this._listeners.push(doubleClickListener);
            },

            _addPoint: function (event) {
                var point = this.view.toMap(event);

                if (point === null) return;
                if (!drawConfig.activeFeature) {
                    if (!point.hasZ) {
                        point.z = 0;
                    }
                    this._start = point;
                    this._end = point.clone();
                    this._end.z = point.z+10;
                    var line = this._createLine(this._start, this._end);
                    drawConfig.activeFeature = new Graphic({
                        geometry: line,
                        symbol: drawConfig.symbol
                    });
                    this.view.graphics.add(drawConfig.activeFeature);
                }
            },

            _createLine: function (startPosition, endPosition) {
                var startPointCoordinates = [startPosition.x, startPosition.y, startPosition.z];
                var endPointCoordinates = [startPosition.x, startPosition.y, endPosition.z];

                var line = new Polyline({
                    spatialReference: this.view.spatialReference,
                    hasZ: true,
                    hasM: false,
                    paths: [[
                        startPointCoordinates,
                        endPointCoordinates
                    ]
                    ]
                });
                return line;
            },

            _addVertex: function (line, newPoint) {
                var polyline = line.clone();
                var lastPointIndex = line.paths[0].length;
                polyline.insertPoint(0, lastPointIndex, newPoint);
                return polyline;
            },

            _updateFeature: function (polyline) {
                this.clear();
                var newFeature = new Graphic({
                    geometry: polyline,
                    symbol: drawConfig.symbol
                });
                drawConfig.activeFeature = newFeature;

                this.view.graphics.add(newFeature);
            },

            _finishDrawing: function (event) {
                var finalLine = drawConfig.activeFeature.geometry.clone();
                this._updateFeature(finalLine);
                this.deactivate();
                this.emit("draw-complete", { feature: drawConfig.activeFeature });
            },

            //在双击绘制结束时point-down事件会在double-click事件前触发两次，因此会添加相同的点，要在此去除
            _reCaculatePolyline: function (line) {
                var endIndex = line.paths[0].length - 3;
                for (var i = line.paths[0].length - 1; i >= endIndex; i--) {
                    line.removePoint(0, i);
                }
                return line;
            },

            _updateLastVertex: function (event) {
                if (drawConfig.activeFeature) {

                    if (this._start === null) return;
                    var polyline = drawConfig.activeFeature.geometry.clone();

                    var lastPointIndex = polyline.paths[0].length - 1;
                    this._setNewZPoint(event.x, event.y);
                   
                    var updatedLine = polyline.setPoint(0, lastPointIndex, this._end);

                    this._updateFeature(updatedLine);
                }

            },

            _mouseDir: function (x, y) {
                var dir = "";
                if (y - this._startY > 0) {
                    
                    dir = "bottom";
                } else {
                    dir = "top";
                }
                this._startY = y;
                return dir;
            },

            _setNewZPoint(x, y) {
                var flag = this._mouseDir(x, y);

                var point = this._end;
                if (flag == "top") {

                    point.z = point.z + 1;
                } else if (flag == "bottom") {
                    point.z = point.z - 1;
                }
            }


        });

        return drawline;
    });
