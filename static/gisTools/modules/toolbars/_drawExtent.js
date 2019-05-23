/**
 * Created by DExtra on 2017/8/9.
 * 绘制矩形，等后续api更新后可能会弃用QAQ
 */
define([
        "esri/geometry/Extent",
        "esri/geometry/Polyline",
        "esri/Graphic",
        "esri/symbols/SimpleFillSymbol",
        "esri/geometry/geometryEngine",
        "esri/core/Accessor",
        "dojo/Evented",
    ],
    function (Extent,Polyline,Graphic,SimpleFillSymbol,geometryEngine,Accessor,Evented) {
        var drawConfig={
            isActive: false,
            // circle | extent | polygon | polyline | point
            type: "extent",

            origin:null,
            activeFeature: null,
            symbol:  new SimpleFillSymbol({
                color: [102, 0, 255, 0.4],
                outline: {
                    color: "#6600FF",
                    width: 3
                }
            }),

        }


        var drawCircle=Accessor.createSubclass([Evented],{
            declaredClass: "dse.modules.toolbars._drawExtent",
            constructor:function(options){
                this.view=options.view;
                this._listeners = [];
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
                        return "extent";
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
                var find = this.view.graphics.find(function (graphic) {
           
                    return graphic.geometry.type === "extent";
                });
               
                if (find) {
                    this.view.graphics.remove(find);
                }
            },

            _bindListeners:function(){
              var self=this;
               var  dragListener = this.view.on("drag", function(event) {
                   switch (event.action){
                       case "start":
                         
                           self._startDrawing(event);
                           break;
                       case "update":
                           console.log("update");
                           self._updateDrawing(event);
                           break;
                       case "end":
                
                           self._finishDrawing(event);
                           break;
                   }
                   event.stopPropagation();
                });

                this._listeners.push(dragListener);
            },


            _createExtent:function(movePoint){
                var extent=null;
                if(drawConfig.activeFeature){
                    extent=drawConfig.activeFeature.geometry;
                }
                if (extent == null) {
           
                    drawConfig.origin=movePoint;
                    extent=new Extent({
                        xmax:movePoint.x,
                        ymax:movePoint.y,
                        xmin:movePoint.x,
                        ymin:movePoint.y,
                        spatialReference:this.view.spatialReference
                    });
                  
                }else{
                    var dir= this._identifyDirection(drawConfig.origin,movePoint);
                    switch (dir){
                        case "top-right":
                            extent.xmax=movePoint.x;
                            extent.ymax=movePoint.y;
                            break;
                        case "bottom-right":
                            extent.xmin=drawConfig.origin.x;
                            extent.ymin=movePoint.y;
                            extent.xmax=movePoint.x;
                            extent.ymax=drawConfig.origin.y;
                            break;
                        case "bottom-left":
                            extent.xmin=movePoint.x;;
                            extent.ymin=movePoint.y;
                            break;
                        case "top-left":
                            extent.xmin=movePoint.x;
                            extent.ymin=drawConfig.origin.y;
                            extent.xmax=drawConfig.origin.x;
                            extent.ymax=movePoint.y;
                            break;
                    }

                }
                return extent;
            },

            _updateFeature:function(geometry){
                this.clear();
                var newFeature = new Graphic({
                    geometry: geometry,
                    symbol: drawConfig.symbol
                });
                drawConfig.activeFeature = newFeature;
          
                this.view.graphics.add(newFeature);
            },

            _startDrawing: function (event) {        
                var start = this.view.toMap(event);  
                var extent = this._createExtent(start);
                this._updateFeature(extent);
            },

            _updateDrawing:function(event){
                var movePoint=  this.view.toMap(event);
                var extent=this._createExtent(movePoint);
                this._updateFeature(extent);
            },

            _finishDrawing:function(event){
                var movePoint=  this.view.toMap(event);
                var extent=this._createExtent(movePoint);
                this._updateFeature(extent);
                this.deactivate();
                this.emit("draw-complete",{feature:drawConfig.activeFeature});
                this.clear();
            },

            _identifyDirection:function(startPoint,endPoint){
                var dir1,dir2;
                if(endPoint.y-startPoint.y>0){
                    dir1="top"
                }else if(endPoint.y-startPoint.y<0){
                    dir1="bottom"
                }else{
                    dir1=""
                }

                if(endPoint.x-startPoint.x>0){
                    dir2="right"
                }else if(endPoint.x-startPoint.x<0){
                    dir2="left"
                }else{
                    dir2=""
                }



                if(dir1!==""&&dir2!=="")
                    return dir1+"-"+dir2;
                if(dir1===""&&dir2==="")
                    return "center";
                if(dir1!==""&&dir2==="")
                    return dir1;
                if(dir1===""&&dir2!=="")
                    return dir2;
            }

        });

        return drawCircle;
    });
