/**
 * Created by dell on 2017/8/9.
 * 绘制线，等后续api更新后可能会弃用QAQ
 */
define([
        "esri/geometry/Point",
        "esri/Graphic",
        "esri/symbols/TextSymbol",
        "esri/geometry/geometryEngine",
        "esri/core/Accessor",
        "dojo/Evented",
],
    function (Point, Graphic, TextSymbol, geometryEngine, Accessor, Evented) {
        var drawConfig = {
            isActive: false,
            // circle | extent | polygon | polyline | point
            type: "text",
            activeFeature: null,

            symbol: new TextSymbol({
                color: "white",
                haloColor: "black",
                haloSize: "1px",
                text: "Text",
                font: {  // autocast as esri/symbols/Font
                    size: 12,
                    family: "sans-serif",
                    weight: "bolder"
                }
            })

        }


        var drawline = Accessor.createSubclass([Evented], {
            declaredClass: "dse.modules.toolbars._drawText",
            constructor: function (options) {
                this.view = options.view;
                this._listeners = [];
                if (options.symbol) {
                    drawConfig.symbol = options.symbol;
                }

            },

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
                        return "text";
                    }
                },
                isActive: {
                    readOnly: true,
                    get: function () {
                        return drawConfig.isActive;
                    }
                }



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
            },

            clear: function () {

                for (var i = this.view.graphics.length - 1; i >= 0; i--) {
                    var graphic = this.view.graphics[i];
                 
                    if (graphic&&graphic.hasAttribute("dextratype"))
                        if (graphic.dextratype === this.type) {
                            this.view.graphics.remove(graphic);
                        }
                }
            },

            _bindListeners: function () {
                var self = this;
                var viewClickHandler = this.view.on("click", function (event) {
                    event.stopPropagation();
                    self._addPoint(event);
                });
                this._listeners.push(viewClickHandler);
            },

            _addPoint: function (event) {
                var point = this.view.toMap(event);

                if (!drawConfig.activeFeature) {
                    drawConfig.activeFeature = new Graphic({
                        geometry: point,
                        symbol: drawConfig.symbol
                    });
                    drawConfig.activeFeature.dextratype = this.type;
                    // this.view.graphics.add(drawConfig.activeFeature);
                    this.emit("draw-complete", { feature: drawConfig.activeFeature });
                    this.deactivate();
                }
            },

        });

        return drawline;
    });
