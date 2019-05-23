/**
 * Author:Baozi926 https://github.com/Baozi926
 * Source:https://github.com/Baozi926/DivLayer
 * Modify by DExtra on 2017/12/6.
 */
define([
    'dojo/_base/declare',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/Deferred',
    'dojo/Evented',
    'dojo/dom-construct',
    "dojo/_base/lang",
    "dojo/_base/array",
    'dojo/on',
    'dojo/dom-geometry',
    "esri/geometry/SpatialReference",
    'esri/layers/Layer',
    'esri/geometry/Point',
    'esri/geometry/geometryEngine',
    'esri/geometry/support/webMercatorUtils',
    "esri/geometry/support/normalizeUtils",
    "../modules/UtilityTools"

], function (declare, domClass, domStyle, Deferred, Evented, domConstruct, lang, arrayUtil, on, domGeometry,
             SpatialReference, Layer, Point, geometryEngine, webMercatorUtils, normalizeUtils,
             UitiltyTools) {
    var layerConfigs = {
        positions: ['bottom-right', 'top-mid', 'center'],
        offsets: [0, 0],
    }



    var clazz = Layer.createSubclass([], {
        declaredClass: 'dse.layers.OverlayLayer',
        constructor: function (options) {
            options = options || {};

            this.divLayerClass = options.divLayerClass || 'overlay-layer';
            this.popupEnabled = false;
            this.legendEnabled = false;

        },
        _startDragPosition: null,


        properties: {
            direction: 'center',
        },

        initialize: function (evt, aa) {
            // console.log(arguments);
        },

        createLayerView: function (view) {
            this._view = view;
            var surface = view.surface;

            this._displayDiv = domConstruct.create('div', {
                style: 'width:100%;height:100%',
                className: this.divLayerClass
            }, surface);

            this.bindEvents();
            this.refresh();

            if (view.type === '3d') {
                alert('not implemented for 3d');
            }

        },



        bindEvents: function () {

            this.events = [];

            this.events.push(on(this._view, 'resize', lang.hitch(this, this.refresh, true)));

            this.events.push(this._view.watch("animation", lang.hitch(this, function (response) {
                if (response && response.state === "running") {
                    // domStyle.set(this._displayDiv, 'opacity', 0.5);
                    domClass.add(this._displayDiv, 'zooming');
                } else {
                    // domStyle.set(this._displayDiv, 'opacity', 1);
                    domClass.remove(this._displayDiv, 'zooming');

                    //解决缩放后，再第一次移动时会抖动的bug
                    setTimeout(lang.hitch(this, function () {
                        this.refresh(true);
                    }), 30);
                }
            })));

            this.events.push(this._view.on('drag', lang.hitch(this, function (evt) {
                if (this._startDragPosition) {
                    var dx = evt.x - this._startDragPosition.x;
                    var dy = evt.y - this._startDragPosition.y;
                    layerConfigs.offsets = [dx, dy];
                    var translate = 'translate(' + dx + 'px,' + dy + 'px)';
                    domStyle.set(this._displayDiv, 'transform', translate);
                }

                if (evt.action === 'start') {
                    this._startDragPosition = evt;
                }
                if (evt.action === 'end') {
                    this._startDragPosition = null;
                    domStyle.set(this._displayDiv, 'transform', 'translate(0px,0px)');
                    this.refresh(true);
                }
            })));
        },

        destroyLayerView: function (param) {
            this.destroy();
        },

        load: function (param) {
            return this;
        },

        divs: [],
        checkInExtent: function (ele) {
            var extent = this._view.extent.clone();
            var point = ele.geometry.normalize();
            ele.geometry = point;


            return normalizeUtils.normalizeCentralMeridian([extent]).then(function (extents) {

                var bool = extents[0].intersects(point);

                return bool
            });
            // var bool= extent.intersects(point);
            // return bool
        },

        refresh: function (ifZoomEnd) {
            if (ifZoomEnd) {
                domClass.add(this._displayDiv, 'init');
            }

            domConstruct.empty(this._displayDiv);
            arrayUtil.forEach(this.divs, function (v) {
                // this._add(v, ifZoomEnd);
                // if (this.checkInExtent(v)) {
                //     this._add(v, ifZoomEnd);
                // }
                this.checkInExtent(v).then(function (flag) {
                    if (flag) {
                        this._add(v, ifZoomEnd);
                    }
                }.bind(this));
            }, this);
            domClass.remove(this._displayDiv, 'init');



        },



        _add: function (ele, ifZoomEnd) {
            if (lang.isString(ele.html)) {
                ele.node = domConstruct.create('div', {
                    innerHTML: ele.html,
                    style: 'position:absolute'
                }, this._displayDiv);
            } else {
                ele.node = domConstruct.create('div', {
                    style: 'position:absolute'
                }, this._displayDiv);
                domConstruct.place(ele.html, ele.node);
            }

            this.reposition(ele, ifZoomEnd).then(function () {
                //可以看出，若ele.geometry并不在地图范围内，即div显示在地图外，afterZoom不会触发
                if (ifZoomEnd && ele.afterZoom && lang.isFunction(ele.afterZoom)) {
                    ele.afterZoom(this);
                }
            }, function (error) {
                console.log(error)
            });


        },

        reposition: function (ele, ifZoomEnd) {

            return UitiltyTools.Coord2Screen(this._view, ele.geometry).then(function (res) {
                if (this._view) {
                    var sp = this._view.toScreen(ele.geometry.normalize());
                    //sp = res
                    sp = this._repositionForDirection(ele, sp);

                    domStyle.set(ele.node, {
                        top: sp.y + 'px',
                        left: sp.x + 'px'
                    });

                    ele.left = sp.x;
                    ele.top = sp.y;
                }
            }.bind(this));
        },

        _repositionForDirection: function (ele, sp) {
            var newSP = {};
            var eleGeometry = domGeometry.position(ele.node);

            switch (this.direction) {
                case 'top-mid':
                    {
                        newSP.y = sp.y - eleGeometry.h;
                        newSP.x = sp.x - eleGeometry.w / 2;
                        break;
                    }
                case 'center':
                    {
                        newSP.y = sp.y - eleGeometry.h / 2;
                        newSP.x = sp.x - eleGeometry.w / 2;
                        break;
                    }
                default:
                    {
                        newSP = sp;
                        break;
                    }

            }

            return newSP;
        },

        add: function (ele) {
            if (lang.isArray(ele)) {
                arrayUtil.forEach(ele, function (v) {
                    this.add(v);
                }, this);
            }
            ele = ele || {};
            var defaults = {
                geometry: null,
                html: 'overlay'
            }

            lang.mixin(defaults, ele);
            this._add(defaults);
            this.divs.push(defaults);
        },

        remove: function (ele) {

            if (lang.isArray(ele)) {
                arrayUtil
                    .forEach(ele, function (v) {
                        this.remove(v);
                    }, this);
            }

            this.divs = arrayUtil.filter(this.divs, function (v) {
                return ele != v;
            }, this);
            this.refresh();
        },

        removeAll: function () {
            domConstruct.empty(this._displayDiv);

            this.divs.length = 0;
            this.refresh();
        },

        destroy: function (evt) {

            this.divs = null;
            domConstruct.destroy(this._displayDiv);
        },




    });

    return clazz;

});
