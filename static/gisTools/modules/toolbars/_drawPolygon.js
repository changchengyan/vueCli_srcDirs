/**
 * Created by DExtra on 2017/8/9.
 * 绘制面，等后续api更新后可能会弃用QAQ
 * 已弃用，不建议继续使用
 */
define([
        "esri/geometry/Polygon",
        "esri/Graphic",
        "esri/symbols/SimpleFillSymbol",
        "esri/geometry/geometryEngine",
        "esri/core/Accessor",
        "dojo/Evented",
    ],
    function (Polygon,Graphic,SimpleFillSymbol,geometryEngine,Accessor,Evented) {
        var drawConfig={
            isActive: false,
            // circle | extent | polygon | polyline | point
            type: "polygon",
            activeFeature: null,

            symbol:  new SimpleFillSymbol({
                color: [102, 0, 255, 0.4],
                outline: {
                    color: "#6600FF",
                    width: 3
                }
            }),

        }


        var drawPolygon=Accessor.createSubclass([Evented],{
            declaredClass: "dse.modules.toolbars._drawPolygon",
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
                    readOnly:true,
                    get:function(){
                        return  drawConfig.activeFeature.geometry;
                    }
                },
                type:{
                    readOnly:true,
                    get:function(){
                        return "polygon";
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
                var point = this._createPoint(event);
                this._addVertex(point);
            },

            _createPoint:function(event) {
                return this.view.toMap(event);
            },

            _addVertex: function (point, isFinal) {
                var polygon = drawConfig.activeFeature==null?null:drawConfig.activeFeature.geometry;
                var ringLength;

                if (!polygon) {
                    polygon = new Polygon({ spatialReference: this.view.spatialReference  });
                    polygon.addRing([point, point]);
                } else {
                    ringLength = polygon.rings[0].length;
                    polygon.insertPoint(0, ringLength - 1, point);
                }
                 this._updateFeature(polygon, isFinal);
            },

            _updateFeature:function(polygon,finished){
                var geometry = finished ? geometryEngine.simplify(polygon) : polygon;
                if (!geometry && finished) {
                    console.log( "Cannot finish polygon. It must be a triangle at minimum. Resume drawing..." );
                    return null;
                }
                this.clear();
                var newFeature= new Graphic({
                    geometry: geometry,
                    symbol:  drawConfig.symbol
                });

                this.view.graphics.add(newFeature);
                drawConfig.activeFeature=newFeature;
            },

            _finishDrawing:function(event){
                this._addVertex(event.mapPoint, true);
                this.emit("draw-complete",{feature:drawConfig.activeFeature});
                this.deactivate();
            },

            _updateLastVertex:function(event){
                if(drawConfig.activeFeature){
                    var point = this._createPoint(event);
                    var polygon = drawConfig.activeFeature.geometry.clone();
                    var ringLength = polygon.rings[0].length;

                    polygon.setPoint(0, ringLength - 1, point);
                    this._updateFeature(polygon);
                }
            }
        });

        return drawPolygon;
    });
