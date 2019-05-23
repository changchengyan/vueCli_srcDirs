/**
 * Created by Dell on 2017/12/21.
 */
define([
    "dojo/_base/lang",
    "dojo/dom-construct","dojo/dom-style",
    "esri/core/Accessor","esri/core/Collection",
    "./zRenderObject",
    "../vendor/zrender",
], function (lang,domConstruct,domStyle,Accessor,Collection,zRenderObject, zRender) {


    return  Accessor.createSubclass({
        declaredClass: 'dse.shapes.zRenderSurface',
        constructor:function(){

        },
        properties:{
           view:{
               value:null,
               set:function(value){
                   var surface = value.surface;
                   this._displayDiv = domConstruct.create('div', {
                       style: 'width:100%;height:100%',
                       className:"DExtra—zRender-Layer"
                   }, surface,"first");
                   var zr=zrender.init(this._displayDiv,{
                       renderer:"svg"
                   });
                   this._set("view",value);
                   this._set("group",zr);
                   this.bindEvents();
               }
           },
            group:{
                value:null,
                readOnly:true,
            },
            objects:{
                value:new Collection(),
               readOnly:true,
            },
            animations:{
               value:new Collection(),
                readOnly:true,
            }
        },

        add:function(zRenderObject){
            zRenderObject.doRender(this.view);
            this.group.add(zRenderObject.shape);
            this.objects.add(zRenderObject);
        },

        addMany:function(zRenderObjects){
            zRenderObjects.forEach(function(obj){
                this.add(obj);
            }.bind(this));
        },

        remove:function(zRenderObject){
            this.group.remove(zRenderObject.shape);
            this.objects.remove(zRenderObject);
        },

        removeMany:function(zRenderObjects){
            zRenderObjects.forEach(function(obj){
                this.remove(obj);
            }.bind(this));
        },

        removeAll:function(){
            this.objects.forEach(function(obj){
                this.remove(obj);
            }.bind(this));
        },

        animateMoveTo:function(source,target){
          var animate=  source.animate("shape",true);
          var animateObj={
              animate:animate,
              opts:{
                  time:5000,
                  source:source,
                  target:target,
              }
          }

            animate.when(5000,{
                cx:target.shape.cx,
                cy:target.shape.cy,
            });

            animate.start();
            this.animations.add(animateObj)
        },

        refresh:function(){
            this.objects.forEach(function(obj){
                this.group.remove(obj.shape);
                obj.reDraw(this.view);
                this.group.add(obj.shape);
            }.bind(this))
        },

        bindEvents: function () {
            this.events = [];
            this.events.push(this.view.on( 'resize', lang.hitch(this, this.refresh, true)));

            this.events.push(this.view.watch("animation", lang.hitch(this, function (response) {
                if (response && response.state === "running") {
                    domStyle.set(this._displayDiv,"display","none");
                    this._stopAnimations();
                } else {
                    domStyle.set(this._displayDiv,"display","block");
                    this.refresh();
                    this._refreshAnimation();
                }
            })));

            this.events.push(this.view.on('drag', lang.hitch(this, function (evt) {
                if (this._startDragPosition) {
                    var dx = evt.x - this._startDragPosition.x;
                    var dy = evt.y - this._startDragPosition.y;
                    var translate = 'translate(' + dx + 'px,' + dy + 'px)';
                    domStyle.set(this._displayDiv, 'transform', translate);
                }

                if (evt.action === 'start') {
                    this._startDragPosition = evt;
                    this._stopAnimations();
                }
                if (evt.action === 'end') {
                    this._startDragPosition = null;
                    domStyle.set(this._displayDiv, 'transform', 'translate(0px,0px)');
                    this.refresh();
                    this._refreshAnimation();
                }
            })));
        },

        _stopAnimations:function(){
            this.animations.forEach(function(animationObj){

                animationObj.animate.stop();
            });
        },

        _refreshAnimation:function(){
            this.animations.forEach(function(animationObj){
               var animate= animationObj.opts.source.animate("shape",true);
                animationObj.animate=animate;
                animate .when(5000,{
                    cx:animationObj.opts.target.shape.cx,
                    cy:animationObj.opts.target.shape.cy,
                })
                animate.start();
            });
        }

    });



});
