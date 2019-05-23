/**
 * Created by Dell on 2017/12/21.
 */
define(["dojo/dom-construct",
    "esri/core/HandleRegistry",
    "esri/views/layers/LayerView",

    "../../shapes/zRenderSurface",
    "../../shapes/zRenderObject",
   ],function(domConstruct,HandleRegistry,LayerView,zRenderSurface,zRenderObject){
    return LayerView.createSubclass({
        declaredClass: 'dse.layers.2d.ZRenderLayerView',
        constructor:function(){
            this._handles = new HandleRegistry();
            this._objects=new Map();//用于存储图形
            this.watch("graphics", function () {
                return this._reset()
            }.bind(this), !0);
        },

        properties:{
            view:{
                value:null,
            },
            graphics:{
                value:null,
            },
            surface:{
                readOnly:true,
            }
        },

        attach:function(){
            this.layer.createGraphicsController({layerView:this}).then(function(evt){
                var surface=new zRenderSurface({view:this.view});
                this._set("surface",surface);
                this.graphics=this.layer.graphics;
            }.bind(this),function(error){
                console.error(error);
            });
        },
        detach:function(){},
        update:function(){},
        moveStart:function(){},
        viewChange:function(){},
        moveEnd:function(){},

        _reset:function(){
            var self = this;
            this._handles.remove("graphics");
            this._objects.forEach(function (shape) {
              this.surface.remove(shape);
            }.bind(this));
            this._objects.clear();
            this.graphics && (this.graphics.forEach(this._add, this),
                this._handles.add(this.graphics.on("change", function (b) {
                        return self._graphicsChangeHandler(b)
                    }), "graphics"))
        },

        _add:function(graphic){
            if (!this._objects.has(graphic)) {
                var object= new zRenderObject({
                    graphic:graphic,
                    symbol:graphic.symbol,
                    geometry:graphic.geometry
                });
                this._objects.set(graphic,object);
                this.surface.add(object);
            }
        },

        _remove:function(graphic){
            var object = this._objects.get(graphic);
            object && (this._objects.delete(graphic), this.surface.remove(object))
        },

        _graphicsChangeHandler:function(obj){
            var a=null;
            for (var b = obj.removed, c = 0, d = obj.added; c < d.length; c++)
                a = d[c], this._add(a);
            for (c = 0; c < b.length; c++)
                a = b[c], this._remove(a)
        }

    });

});