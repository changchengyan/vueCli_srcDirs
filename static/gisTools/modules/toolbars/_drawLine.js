/**
 * Created by DExtra on 2017/8/9.
 * 绘制线，等后续api更新后可能会弃用QAQ
 * 已弃用，不建议继续使用
 */
define([
        "esri/geometry/Polyline",
        "esri/Graphic",
        "esri/symbols/SimpleLineSymbol",
        "esri/geometry/geometryEngine",
        "esri/core/Accessor",
        "dojo/Evented",
    ],
    function (Polyline,Graphic,SimpleLineSymbol,geometryEngine,Accessor,Evented) {
        var drawConfig={
            isActive: false,
            // circle | extent | polygon | polyline | point
            type: "polyline",
            activeFeature: null,

            symbol: new SimpleLineSymbol({
                color: "#21BAED",
                width: 1.5
            }),

        }


        var drawline=Accessor.createSubclass([Evented],{
            declaredClass: "dse.modules.toolbars._drawLine",
            constructor:function(options){
                this.view=options.view;
                this._listeners=[];

                if (options.symbol) {
                    drawConfig.symbol = options.symbol;
                }
            },

            properties: {
                view:null,
                geometry:{
                    get:function(){
                        return  drawConfig.activeFeature.geometry;
                    }
                },
                type:{
                    readOnly:true,
                    get:function(){
                        return "polyline";
                    }
                },
                isActive:{
                    readOnly:true,
                    get: function () {
                        return drawConfig.isActive;
                    }
                }



            },

            activate:function(symbol){
                drawConfig.isActive=true;
                drawConfig.activeFeature = null;
                if (symbol) {
                    drawConfig.symbol = symbol;
                }
                this._bindListeners();
            },

            deactivate:function(){
                drawConfig.isActive = false;
                if(this._listeners.length>0){
                    for(var i=0;i<this._listeners.length;i++){
                        this._listeners[i].remove();
                    }
                    this._listeners.length=0;
                }
                this.clear();
            },

            clear:function(){
                var self=this;
                var find = this.view.graphics.find(function(graphic) {
                    return graphic.geometry.type === self.type;
                });

                if (find) {
                    this.view.graphics.remove(find);
                }
            },

            _bindListeners:function(){
              var self=this;
              var  viewClickHandler=  this.view.on("click", function(event) {
                    event.stopPropagation();
                });

               var  pointerDownListener = this.view.on("pointer-down", function(event){
                  if(event.native.button!==0)
                      return;
                   self._addPoint(event);

                });

               var  pointerMoveListener = this.view.on("pointer-move", function(event) {
                   self._updateLastVertex(event);
                });

               var  doubleClickListener = this.view.on("double-click", function(event) {
                   self._finishDrawing(event);
                   event.stopPropagation();
                });

                this._listeners.push(viewClickHandler);
                this._listeners.push(pointerDownListener);
                this._listeners.push(pointerMoveListener);
                this._listeners.push(doubleClickListener);
            },

            _addPoint:function(event){
                var point = this.view.toMap(event);
                if (!drawConfig.activeFeature) {
                    var line = this._createLine(point, point);
                    drawConfig.activeFeature = new Graphic({
                        geometry: line,
                        symbol: drawConfig.symbol
                    });
                    this.view.graphics.add(drawConfig.activeFeature);
                } else {
                    var newLine = this._addVertex(drawConfig.activeFeature.geometry, point);
                    this._updateFeature(newLine);
                }
            },

            _createLine:function(startPosition, endPosition) {
                var startPointCoordinates = [ startPosition.x, startPosition.y ];
                var endPointCoordinates = [ endPosition.x, endPosition.y];

                var line = new Polyline({
                    spatialReference: this.view.spatialReference,
                    hasZ: false,
                    hasM: false,
                    paths: [ [
                        startPointCoordinates,
                        endPointCoordinates
                    ]
                    ]
                });
                return line;
            },

            _addVertex: function (line,newPoint) {
                var polyline = line.clone();
                var lastPointIndex = line.paths[0].length;
                polyline.insertPoint(0, lastPointIndex, newPoint);
                return polyline;
            },

            _updateFeature:function(polyline){
                this.clear();
                var newFeature = new Graphic({
                    geometry: polyline,
                    symbol: drawConfig.symbol
                });
                drawConfig.activeFeature = newFeature;

                this.view.graphics.add(newFeature);
            },

            _finishDrawing:function(event){
                var point = this.view.toMap(event);

                var polyline = drawConfig.activeFeature.geometry.clone();
                var finalLine = this._addVertex(polyline, point);

                finalLine=this._reCaculatePolyline(finalLine);
                this._updateFeature(finalLine);
                this.deactivate();
                this.emit("draw-complete",{feature:drawConfig.activeFeature});
            },

            //在双击绘制结束时point-down事件会在double-click事件前触发两次，因此会添加相同的点，要在此去除
            _reCaculatePolyline:function(line){
                var endIndex=line.paths[0].length-3;
                for(var i=line.paths[0].length-1;i>=endIndex;i--){
                    line.removePoint(0,i);
                }
                return line;
            },

            _updateLastVertex:function(event){
                if (drawConfig.activeFeature) {
                    var point = this.view.toMap(event);
                    var polyline = drawConfig.activeFeature.geometry.clone();

                    var lastPointIndex = polyline.paths[0].length - 1;

                    var updatedLine = polyline.setPoint(0, lastPointIndex, point);

                    this._updateFeature(updatedLine);
                }

            }
        });

        return drawline;
    });
