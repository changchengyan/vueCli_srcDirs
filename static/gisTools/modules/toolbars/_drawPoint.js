/**
 * Created by dell on 2017/8/9.
 * 绘制线，等后续api更新后可能会弃用QAQ
 */
define([
        "esri/geometry/Point",
        "esri/Graphic",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/geometry/geometryEngine",
        "esri/core/Accessor",
        "dojo/Evented",
    ],
    function (Point,Graphic,SimpleMarkerSymbol,geometryEngine,Accessor,Evented) {
        var drawConfig={
            isActive: false,
            // circle | extent | polygon | polyline | point
            type: "point",
            activeFeature: null,

            symbol: new SimpleMarkerSymbol({
                style: "circle",
                color: "#21BAED",
                size: "8px",  // pixels
                outline: {  // autocasts as esri/symbols/SimpleLineSymbol
                    color: [ 255, 255, 0 ],
                    width: 3  // points
                }
            })

        }


        var drawline=Accessor.createSubclass([Evented],{
            declaredClass: "dse.modules.toolbars._drawPoint",
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
                        return "point";
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
                    self._addPoint(event);
                });
                this._listeners.push(viewClickHandler);
            },

            _addPoint:function(event){
                var point = this.view.toMap(event);

                if (!drawConfig.activeFeature) {
                    drawConfig.activeFeature = new Graphic({
                        geometry: point,
                        symbol: drawConfig.symbol
                    });
                    this.emit("draw-complete",{feature:drawConfig.activeFeature});
                    this.deactivate();
                }
            },

        });

        return drawline;
    });
