/**
 * Created by dell on 2017/8/9.
 * 绘制工具，目前可以绘制点，线，面，圆，等后续api更新后可能会弃用QAQ
 * version:0.2.0;
 */
define([
        "dojo/on",
        "dse/modules/toolbars/_drawPoint",
        "dse/modules/toolbars/_drawLine",
        "dse/modules/toolbars/_drawLine3D",
        "dse/modules/toolbars/_drawPolygon",
        "dse/modules/toolbars/_drawCircle",
        "dse/modules/toolbars/_drawExtent",
        "dse/modules/toolbars/_drawText",
        "esri/core/Accessor",
        "dojo/Evented",
    ],
    function (on, _DrawPoint, _DrawLine, _DrawLine3D, _DrawPolygon, _DrawCircle, _DrawExtent, _DrawText,Accessor, Evented) {
        var Draw=Accessor.createSubclass([Evented],{
            declaredClass: "dse.modules.toolbars.Draw",
            constructor:function(options){
                this.view=options.view;
                this._init(options);
            },
            properties: {
                view: null,
         
                geometry:{
                    get:function(){
                        return  drawConfig.activeFeature.geometry;
                    }
                }
            },

            _init: function (options) {

                this._draws=[];
                this._draws.push(new _DrawPoint({view:options.view}));
                this._draws.push(new _DrawLine({view:options.view}));
                this._draws.push(new _DrawLine3D({view:options.view}));
                this._draws.push(new _DrawPolygon({view:options.view}));
                this._draws.push(new _DrawCircle({ view: options.view }));
                this._draws.push(new _DrawExtent({ view: options.view }));
                this._draws.push(new _DrawText({ view: options.view }));
                var self=this;

                this._draws.forEach(function(draw){
                     on(draw,"draw-complete",function(evt){
                         self.emit("draw-complete",evt);
                     })
                });
            },

            activate:function(type,symbol){
                var draws=this._draws;
                draws.forEach(function(draw){
                    if(draw.type===type){
                        draw.activate(symbol);
                    }else{
                        draw.deactivate();
                        draw.clear();
                    }
                });
            },
            deactivate:function(){
                var draws=this._draws;
                draws.forEach(function(draw){
                    if(draw.isActive){
                        draw.deactivate();
                    }
                });
            },

            clear:function(){
                this._draws.forEach(function(draw){
                        draw.deactivate();
                        draw.clear();
                });
            },




        });

        return Draw;
    });
