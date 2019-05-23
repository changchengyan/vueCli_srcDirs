/**
 * Created by Dell on 2017/12/21.
 */
define([
    "esri/core/Accessor",
    "esri/geometry/geometryEngine",
    "../vendor/zRender",

], function (Accessor, geometryEngine,zRender) {
    return  Accessor.createSubclass({
        declaredClass: 'dse.shapes.zRenderObject',

        properties:{
            graphic: {
                value:null,
            },
            symbol:{
                value:null,
            },
            geometry:{
                value:null,
            },
            shape:{
                value:null,
                readOnly:true,
            }
        },

        doRender:function(view){
            switch (this.geometry.type){
                case "point":
                 this._renderPoint(view);
                    break;
                case "polyline":
                     this._renderPolyline(view);
                    break;
                case "polygon":
                    this._renderPolygon(view);
                    break;
            }
            this.graphic._shape=this.shape;
        },

        reDraw:function(view){
            switch (this.geometry.type){
                case "point":
                    this._reDrawPoint(view)
                    break;
                case "polyline":
                    this._reDrawPolyline(view);
                    break;
                case "polygon":
                    this._reDrawPolygon(view);
                    break;
            }

        },

        _toScreen:function(view,geometry){

            geometry=geometryEngine.simplify(geometry);

            switch (geometry.type){
                case "point":
                    return this._toScreenPoint(view,geometry);
                case "polyline":
                    return this._toScreenPolyline(view,geometry);
                case "polygon":
                    return  this._toScreenPolygon(view,geometry)

            }
        },

        _toScreenPoint:function(view,geometry){
            var sp=view.toScreen(geometry);
            return [sp.x,sp.y]
        },

        _toScreenPolyline:function(view,geometry){
            var spLine=[];
             for(let i=0;i<geometry.paths[0].length;i++){
                 var point=geometry.getPoint(0,i);
                 var sp= this._toScreenPoint(view,point);
                 spLine.push(sp);
             }
             return spLine;
        },

        _toScreenPolygon:function(view,geometry){
            var spPolygon=[];
            for(let i=0;i<geometry.rings[0].length;i++){
                var point=geometry.getPoint(0,i);
                var sp= this._toScreenPoint(view,point);
                spPolygon.push(sp);
            }
            return spPolygon;
        },



        _renderPoint:function(view){
            var sp=this._toScreen(view,this.geometry);
            var size=this.symbol.size;
            var cx=sp[0],cy=sp[1];

            var pointShape=new zRender.Circle({
                shape:{
                    cx:cx,
                    cy:cy,
                    r:size/2
                },
                style:{
                    fill:this.symbol.color,
                    stroke: this.symbol.outline?this.symbol.outline.color:this.symbol.color,
                }
            });

            this._set("shape",pointShape);
        },

        _renderPolyline:function(view){
            var spline=this._toScreen(view,this.geometry);
            var width=this.symbol.width;
            var polyLineShape=new zRender.Polyline({
                shape:{
                    points:spline,
                },
                style:{
                    stroke:this.symbol.color,
                    lineWidth:width
                }
            });
            this._set("shape",polyLineShape);
        },

        _renderPolygon:function(view){
            var spline=this._toScreen(view,this.geometry);
            var width=this.symbol.outline.width;
            var polyLineShape=new zRender.Polygon({
                shape:{
                    points:spline,
                },
                style:{
                    fill:this.symbol.color,
                    stroke:this.symbol.outline.color,
                    lineWidth:width
                }
            });
            this._set("shape",polyLineShape);
        },

        _reDrawPoint:function(view){
            var sp=view.toScreen(this.geometry);
            var size=this.symbol.size;
            var cx=sp.x,cy=sp.y;

            var shape=this._get("shape");
            shape.attr({
                shape:{
                    cx:cx,
                    cy:cy,
                    r:size/2
                },
                style:{
                    fill:shape.style.fill,
                    stroke: shape.style.stroke,
                }
            })
        },

        _reDrawPolyline:function(view){
            var spline=this._toScreen(view,this.geometry);
            var width=this.symbol.width;
            var shape=this._get("shape");
            shape.attr({
                shape:{
                    points:spline,
                },
                style:{
                    stroke:shape.style.stroke,
                    lineWidth:width
                }
            });

        },

        _reDrawPolygon:function(view){
            var spline=this._toScreen(view,this.geometry);
            var width=this.symbol.width;
            var shape=this._get("shape");
            shape.attr({
                shape:{
                    points:spline,
                },
                style:{
                    fill:shape.style.fill,
                    stroke:shape.style.stroke,
                    lineWidth:width
                }
            });

        }
    });



});
