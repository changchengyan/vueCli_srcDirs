define(["require", "exports", "esri/views/2d/draw/Draw", "esri/Graphic", "esri/geometry/Polygon", "esri/geometry/geometryEngine", "esri/symbols/TextSymbol", "dojo/_base/lang", "esri/layers/GraphicsLayer"], function (require, exports, Draw, Graphic, Polygon, geometryEngine, TextSymbol, dojoLang, GraphicsLayer) {
    "use strict";
    /**
     * @description 二维地图测量面积工具.
     * */
    var MeasureArea = /** @class */ (function () {
        function MeasureArea(infoProps) {
            //
            this.view = infoProps.view;
            this.map = infoProps.map;
            //
            this.drawTool = new Draw({
                view: this.view
            });
            //
            this.drawLayer = this.view.graphics;
            // this.drawLayer = new GraphicsLayer({
            //     //
            //     id: '_measure_area_layer_'
            // });
            // //
            // this.map.add(this.drawLayer);
        }

        /**
         * @description 启动测量面积功能.
         * @public
         * */
        MeasureArea.prototype.start = function () {
            //
            this.enableCreatePolygon(this.drawTool, this.view);
        };
        /**
         * @description 清除测量面积功能.
         * @public
         * */
        MeasureArea.prototype.clear = function () {
            //
            // this.view.graphics.removeAll();
            this.drawLayer.removeAll();
            this.drawTool.reset();
        };
        /**
         * @private
         * */
        MeasureArea.prototype.enableCreatePolygon = function (draw, view) {
            this.drawAction = draw.create("polygon");
            // focus the view to activate keyboard shortcuts for drawing polygons
            view.focus();
            // listen to vertex-add event on the action
            this.drawAction.on("vertex-add", dojoLang.hitch(this, this.drawPolygon));
            // listen to cursor-update event on the action
            this.drawAction.on("cursor-update", dojoLang.hitch(this, this.drawPolygon));
            // listen to vertex-remove event on the action
            this.drawAction.on("vertex-remove", dojoLang.hitch(this, this.drawPolygon));
            // *******************************************
            // listen to draw-complete event on the action
            // *******************************************
            this.drawAction.on("draw-complete", dojoLang.hitch(this, this.drawPolygon));
        };
        //
        // this function is called from the polygon draw action events
        // to provide a visual feedback to users as they are drawing a polygon
        MeasureArea.prototype.drawPolygon = function (event) {
            var vertices = event.vertices;
            //remove existing graphic
            // this.view.graphics.removeAll();
            this.drawLayer.removeAll();
            // create a new polygon
            var polygon = this.createPolygon(vertices);
            // create a new graphic representing the polygon, add it to the view
            var graphic = this.createGraphic(polygon);
            // this.view.graphics.add(graphic);
            this.drawLayer.add(graphic);
            // calculate the area of the polygon
            var area = geometryEngine.geodesicArea(polygon, "square-meters");
            if (area < 0) {
                // simplify the polygon if needed and calculate the area again
                var simplifiedPolygon = geometryEngine.simplify(polygon);
                if (simplifiedPolygon) {
                    area = geometryEngine.geodesicArea(simplifiedPolygon, "square-meters");
                }
            }
            // start displaying the area of the polygon
            this.labelAreas(polygon, area);
        };
        // create a polygon using the provided vertices
        MeasureArea.prototype.createPolygon = function (vertices) {
            return new Polygon({
                rings: vertices,
                spatialReference: this.view.spatialReference
            });
        };
        // create a new graphic representing the polygon that is being drawn on the view
        MeasureArea.prototype.createGraphic = function (polygon) {
            var graphic = new Graphic({
                geometry: polygon,
                symbol: {
                    type: "simple-fill",
                    color: [102, 0, 255, 0.2],
                    style: "solid",
                    outline: {
                        // color: [255, 255, 122],
                        color: "#21BAED",
                        width: 2
                    }
                }
            });
            return graphic;
        };
        MeasureArea.prototype._createTextSymbol = function (text) {
            var symbol = {
                color: "#FF5722",
                haloColor: "#33cc33",
                haloSize: 1,
                horizontalAlignment: "right",
                xoffset: 3,
                yoffset: 3,
                text: text,
                font: {
                    size: 12,
                    family: "sans-serif",
                    weight: "bolder"
                }
            };
            var textSymbol = new TextSymbol(symbol);
            return textSymbol;
        };
        //Label polyon with its area
        MeasureArea.prototype.labelAreas = function (geom, area) {
            // var graphic = new Graphic({
            //     geometry: geom.centroid,
            //     symbol: {
            //         type: "text",
            //         color: "white",
            //         haloColor: "black",
            //         haloSize: "1px",
            //         text: area.toFixed(2) + " 平方米",
            //         xoffset: 3,
            //         yoffset: 3,
            //         font: { // autocast as Font
            //             size: 14,
            //             family: "sans-serif"
            //         }
            //     }
            // });
            // this.view.graphics.add(graphic);
            var textSymbol = this._createTextSymbol("面积");
            if (area > 0 && area >= 1000000) {
                textSymbol.text = (area / 1000000).toFixed(2) + "平方千米";
            }
            else if (area > 0 && area < 1000000) {
                textSymbol.text = area.toFixed() + "平方米";
            }
            var txtGraphic = new Graphic({
                geometry: geom,
                symbol: textSymbol
            });
            // txtGraphic.flag = "label";
            // this.view.graphics.add(txtGraphic);
            this.drawLayer.add(txtGraphic);
        };
        return MeasureArea;
    }());
    return MeasureArea;
});
//# sourceMappingURL=MeasureArea.js.map