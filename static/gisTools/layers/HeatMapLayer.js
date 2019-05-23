/**
 * Created by DExtra on 2017/12/14.
 */
define([
    'dojo/_base/declare',
    'dojo/dom-class',
    'dojo/dom-style',
    "dojo/query",
    'dojo/dom-construct',
    'dojo/on',
    "dojo/_base/lang",

    'esri/layers/Layer',
    'esri/geometry/Point',

    "esri/geometry/support/normalizeUtils",
    "../vendor/heatmap.min",
], function (declare, domClass, domStyle,query,  domConstruct,  on,_lang,
             Layer, Point,normalizeUtils) {
    var layerConfigs={
        useLocalMaximum: false,
        config:{
            radius: 15,
            debug: false,
            visible: true,
            gradient: {
                0.45: "rgb(000,000,255)",
                0.55: "rgb(000,255,255)",
                0.65: "rgb(000,255,000)",
                0.95: "rgb(255,255,000)",
                1.00: "rgb(255,000,000)"
            }
        }
    }



    return Layer.createSubclass([], {
        declaredClass: 'dse.layers.HeatMapLayer',
        constructor: function (options) {
            options = options || {};

            this.divLayerClass = options.divLayerClass || 'heatmap-layer';
            this.popupEnabled = false;
            this.legendEnabled = false;
            this.config=_lang.mixin({}, layerConfigs.config, options.config);



        },



        properties:{
            useLocalMaximum: {
                value:false,
            },
            heatMap:{
                readOnly:true,
            },
            globalMax:{
                value:0
            },
            data:{
                value:[],
                set:function(value){
                    // set width/height
                    this.resizeHeatmap(this._view.width, this._view.height);

                    // create data and then store it
                    this.parseHeatmapData(value);
                    // redraws the heatmap
                    this._set("data",value)
                }
            }

        },

        initialize: function (evt, aa) {

        },

        createLayerView: function (view) {

            this._view = view;
            var surface = view.surface;
            this.config.width=view.width;
            this.config.height=view.height;
            this._displayDiv = domConstruct.create('div', {
                style: {
                    position:"absolute",
                    "width": layerConfigs.config.width + 'px',
                    "height": layerConfigs.config.height + 'px'

                },
                className: this.divLayerClass
            }, surface);

            this.config.container =this._displayDiv;
            var heatMap=h337.create(this.config);

            this._set("heatMap",heatMap);

           this.bindEvents();




            if (view.type === '3d') {
                alert('not implemented for 3d');
            }
            // console.log(view);
        },

        resizeHeatmap:function(width, height) {

            this.heatMap._renderer.setDimensions(width,height);
            domStyle.set(this._displayDiv, {
                "width": width + 'px',
                "height": height + 'px'
            });
            var child = query(':first-child', this._displayDiv);

            if (child) {
                child.attr('width', width);
                child.attr('height', height);
            }
            //this.refresh();
        },

        storeHeatmapData: function(heatPluginData) {

            this.heatMap.setData(heatPluginData);
        },

        bindEvents: function () {

            this.events = [];

            this.events.push(on(this._view, "resize",function(evt){
                this.resizeHeatmap(evt.width,evt.height);
            }.bind(this)));

            this.events.push(this._view.on('drag', function (evt) {
                if (this._startDragPosition) {
                    var dx = evt.x - this._startDragPosition.x;
                    var dy = evt.y - this._startDragPosition.y;

                    var translate = 'translate(' + dx + 'px,' + dy + 'px)';
                    domStyle.set(this._displayDiv, 'transform', translate);
                }

                if (evt.action === 'start') {
                    this._startDragPosition = evt;
                    domStyle.set(this._displayDiv,"display","none");
                }
                if (evt.action === 'end') {
                    this._startDragPosition = null;
                    domStyle.set(this._displayDiv, 'transform', 'translate(0px,0px)');
                    domStyle.set(this._displayDiv,"display","block");
                    this.refresh();
                }
            }.bind(this)));

            this.events.push(this._view.watch("animation", function(response){
                if(response&&response.state=="running"){
                    domStyle.set(this._displayDiv,"display","none");
                }else {
                    domStyle.set(this._displayDiv,"display","block");
                    this.refresh();
                }


            }.bind(this)));


        },

        destroyLayerView: function (param) {

            this.events.forEach(function(event){
                event.remove();
            });
            this.destroy();
        },




        refresh: function () {
            var data=this.data;
            this.data=data;

        },



        convertHeatmapData: function(parsedData) {
            var xParsed, yParsed, heatPluginData, screenGeometry;
            // set heat plugin data object
            heatPluginData = {
                max: parsedData.max,
                data: [] // empty data
            };
            // if data
            if (parsedData.data) {
                // for all x values
                for (xParsed in parsedData.data) {
                    // if data[x]
                    if (parsedData.data.hasOwnProperty(xParsed)) {
                        // for all y values and count
                        for (yParsed in parsedData.data[xParsed]) {
                            if (parsedData.data[xParsed].hasOwnProperty(yParsed)) {
                                // make sure extent is normalized
                                var normalizedExtent = this._view.extent;
                                // convert data point into screen geometry
                                screenGeometry = this._view.toScreen( parsedData.data[xParsed][yParsed].dataPoint);
                                // push to heatmap plugin data array
                                heatPluginData.data.push({
                                    x: screenGeometry.x,
                                    y: screenGeometry.y,
                                    count: parsedData.data[xParsed][yParsed].count // count value of x,y
                                });
                            }
                        }
                    }
                }
            }
            // store in heatmap plugin which will render it
            this.storeHeatmapData(heatPluginData);
        },
        // runs through data and calulates weights and max
        parseHeatmapData: function(features) {
            // variables
            var i, parsedData, dataPoint, attributes;
            // if data points exist
            if (features) {
                // create parsed data object
                parsedData = {
                    max: 0,
                    data: []
                };
                if (!this.useLocalMaximum) {
                    parsedData.max = this.globalMax;
                }
                // for each data point
                for (i = 0; i < features.length; i++) {
                    // get geometry and normalize it
                    var geo = features[i].geometry;
                    // create geometry point
                    dataPoint = new Point({
                        longitude:geo.longitude,
                        latitude:geo.latitude,
                        spatialReference:this._view.spatialReference
                    });
                    // get extent and normalize it.
                    var normalizedExtent = normalizeUtils.normalizeCentralMeridian([this._view.extent]);
                    // check point
                    var validPoint = false;
                    // if not using local max, point is valid
                    if (!this.useLocalMaximum) {
                        validPoint = true;
                    }
                    // using local max, make sure point is within extent
                    else if (normalizedExtent.intersects(dataPoint)) {
                        validPoint = true;
                    }
                    if (validPoint) {
                        // attributes
                        attributes = features[i].attributes;
                        // if array value is undefined
                        if (!parsedData.data[dataPoint.x]) {
                            // create empty array value
                            parsedData.data[dataPoint.x] = [];
                        }
                        // array value array is undefined
                        if (!parsedData.data[dataPoint.x][dataPoint.y]) {
                            // create object in array
                            parsedData.data[dataPoint.x][dataPoint.y] = {};
                            // if count is defined in datapoint
                            if (attributes && attributes.hasOwnProperty('count')) {
                                // create array value with count of count set in datapoint
                                parsedData.data[dataPoint.x][dataPoint.y].count = attributes.count;
                            } else {
                                // create array value with count of 0
                                parsedData.data[dataPoint.x][dataPoint.y].count = 0;
                            }
                        }
                        // add 1 to the count
                        parsedData.data[dataPoint.x][dataPoint.y].count += 1;
                        // store dataPoint var
                        parsedData.data[dataPoint.x][dataPoint.y].dataPoint = dataPoint;
                        // if count is greater than current max
                        if (parsedData.max < parsedData.data[dataPoint.x][dataPoint.y].count) {
                            // set max to this count
                            parsedData.max = parsedData.data[dataPoint.x][dataPoint.y].count;
                            if (!this._get("useLocalMaximum")) {
                                this._set("globalMax", parsedData.data[dataPoint.x][dataPoint.y].count);
                            }
                        }
                    }
                }

                // convert parsed data into heatmap plugin formatted data
                this.convertHeatmapData(parsedData);
            }
        },
        // set data function call
        // setData: function(features) {
        //
        // },
        // add one feature to the heatmap
        addDataPoint: function(feature) {
            if (feature) {
                // push to data
                var data = this.get("data");
                data.push(feature);
                // set data
                this.data=data;
            }
        },

        // clear data function
        clearData: function() {
            // empty heat map
            this.heatMap.clear();
            // empty array
            var empty = [];
            this.date=[];
            // set data to empty array

        },

        setHeatMapData:function(data){
            this.data=data;
        },


        // get image
        getImageUrl: function(extent, width, height, callback) {
            // create heatmap data using last data
            this.parseHeatmapData(this.get("data"));
            // image data
            var imageUrl = this.heatMap.getDataURL();
            // callback
            callback(imageUrl);
        }


    });



});
