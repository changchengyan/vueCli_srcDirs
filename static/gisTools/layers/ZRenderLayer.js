/**

 */
define([
    "require",
    "esri/core/Accessor",
    "esri/core/Collection",
    "esri/core/promiseUtils",
    "esri/core/requireUtils",
    "esri/Graphic",


    'esri/layers/Layer',
    "esri/layers/mixins/ScaleRangeLayer",

    "dojo/_base/lang",


], function (require,Accessor,Collection,promiseUtils,requireUtils,Graphic,
             Layer,ScaleRangeLayer, lang) {

    var GraphicsControllerParam = Accessor.createSubclass({
        properties: {
            layer: null,
            layerView: null,
            graphics: null
        }
    });

   return  Layer.createSubclass([ScaleRangeLayer], {
         declaredClass: 'dse.layers.ZRenderLayer',
         viewModulePaths: {
             "2d": "./2d/ZRenderLayerView",
         },
         getDefaults: function () {
             return lang.mixin(this.inherited(arguments), { graphics: [] })
         },
         destroy: function () { this.removeAll() },
         _gfxHdl: null,
        properties:{
            graphics: {
                type: Collection.ofType(Graphic),
                set: function (value) {
                    var old = this._get("graphics");
                    old || (value.forEach(function (graphic) { graphic.layer = this }, this),
                        this._gfxHdl = value.on("change",
                            function (evt) {
                                var index, cur, temp;
                                temp = evt.added;
                                for (index = 0; cur = temp[index]; index++)
                                    cur.layer = this;

                                temp = evt.removed;
                                for (index = 0; cur = temp[index]; index++)
                                    cur.layer = null
                            }.bind(this)),
                        this._set("graphics", value), old = value);
                    old.removeAll();
                    old.addMany(value)
                }
            },
            type:{
                readOnly:true,
                value:"ZRenderLayer"
            }
        },

       createLayerView: function (view) {
           var layerViewPath = this.viewModulePaths[view.type];
           return requireUtils.when(require, layerViewPath).then(function (ZRenderLayerView) {
               return new ZRenderLayerView({ layer: this, view: view })
           }.bind(this));
       },

         add:function(graphic){
             this.graphics.add(graphic);
             return this
         },

         addMany:function(graphics){
             this.graphics.add(graphics);
             return this
         },

         remove: function (graphic) {
             this.graphics.remove(graphic) ;
             return this;
         },

         removeMany: function (graphics) {
             this.graphics.removeMany(graphics);
             return this;
         },

         removeAll:function(){
             this.graphics.removeAll();
             return this;
         },

         graphicChanged: function (a) {
             this.emit("graphic-update", a);
         },

         createGraphicsController: function (evt) {
             return promiseUtils.resolve(new GraphicsControllerParam({
                 layer: this,
                 layerView: evt.layerView,
                 graphics: this.graphics
             }))
         },



    });



});
