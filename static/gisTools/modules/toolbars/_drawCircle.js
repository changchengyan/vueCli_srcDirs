/**
 * Created by dell on 2017/8/9.
 * 绘制线，等后续api更新后可能会弃用QAQ
 */
define([
        "esri/geometry/Circle",
        "esri/geometry/Polyline",
        "esri/Graphic",
        "esri/symbols/SimpleFillSymbol",
        "esri/geometry/geometryEngine",
        "esri/core/Accessor",
        "dojo/Evented",
    ],
    function (Circle,Polyline,Graphic,SimpleFillSymbol,geometryEngine,Accessor,Evented) {
        var drawConfig={
            isActive: false,
            // circle | extent | polygon | polyline | point
            type: "circle",
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
            declaredClass: "dse.modules.toolbars._drawCircle",
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
                        return "circle";
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
                var find = this.view.graphics.find(function(graphic) {
                    return graphic.geometry.type === "polygon";
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



            _getRadius:function(startPosition, endPosition) {
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
                if(this.view.spatialReference.isWGS84||this.view.spatialReference.isWebMercator){
                    radius=geometryEngine.geodesicLength(line,"meters");
                }else{
                    radius=geometryEngine.planarLength(line,"meters");
                }

                return radius;
            },

            /**
             * 通过圆心和终点画圆，通过圆心和终点确定圆的半径
             * 如果已经有绘制的圆，就去当前圆的圆心
             * 如果终点的值为空则默认半径为10米
             *
             * @param {esri/geometry/Point} center - 圆心.
             * @param {esri/geometry/Point} endPoint - 终点.
             *
             * @returns {esri/geometry/Polyline} 返回绘制的圆.
             */
            _createCircle:function(center,endPoint){
                if(drawConfig.activeFeature){//如果已经有绘制的圆，就去当前圆的圆心。
                    center=drawConfig.activeFeature.geometry.center;
                }

                //如果终点的值为空则默认半径为10米
                var radius= endPoint===undefined?10:this._getRadius(center,endPoint);

                var circle=new Circle({
                    radius:radius,
                    center:center,
                    spatialReference:this.view.spatialReference,
                });
                return circle;
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

            _startDrawing:function(event){
                var center=this.view.toMap(event);
                var circle=this._createCircle(center);
                this._updateFeature(circle);
            },

            _updateDrawing:function(event){
                var endPoint=  this.view.toMap(event);
                var circle=this._createCircle(null,endPoint);
                this._updateFeature(circle);
            },

            _finishDrawing:function(event){
                var endPoint=  this.view.toMap(event);
                var circle=this._createCircle(null,endPoint);
                this._updateFeature(circle);
                this.deactivate();
                this.emit("draw-complete",{feature:drawConfig.activeFeature});
                this.clear();
            },

        });

        return drawCircle;
    });
