/**
 * Created by DExtra on 2017/12/25.
 */
define(["esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol", "esri/symbols/TextSymbol"],
    function (GraphicsLayer,Graphic, Point, SimpleMarkerSymbol, TextSymbol) {
    return GraphicsLayer.createSubclass({
        declaredClass: "dse/layers/ClusterLayer",
        constructor: function () {
            this.on("layerview-create", function (evt) {

               return this._inital(evt.view)
            }.bind(this));
        },
        properties: {
            clusterTolerance: {
                value: 50
            },
            clusterData: {
                value: []
            },
            clusters: {
                value:[],
            },
            clusterLabelColor: {
                value: "#000",
            },
            clusterLabelOffset:{
              value:0,
            },
            singles:{
                value:[]
            },
            showSingles: {
                value: true,
            },
            singleSymbol: {
                value: new SimpleMarkerSymbol({
                    style: "circle",
                    size: 6,
                    color: "#888"
                }),
            },
            clusterSymbol:{
              value:new SimpleMarkerSymbol({
                  style: "circle",
                  size: 16,
                  color: [ 0, 204, 255,0.6 ],

                  outline: {  // autocasts as new SimpleLineSymbol()
                      color: [ 0, 204, 255,0.6 ],
                      width: 3  // points
                  }
              }),
            },
            maxSingles: {
                value: 1000
            },
        },

        _inital: function (view) {
            this._view = view;
            this._clusterResolution = this._view.extent.width / this._view.width;
            this._clusterGraphics();
            this._view.watch("stationary", function (response) {
                if (response && response.state === "running") {
                } else {
                    this._clusterResolution = this._view.extent.width / this._view.width;
                    this.removeAll();
                    this._clusterGraphics();
                }
            }.bind(this));

            this._view.on("click", function (evt) {
                if(evt.button===0){
                    this._onClick(evt)
                }

            }.bind(this));

        },

        add: function (p) {
            if (p.declaredClass==="esri.Graphic") {
                this.inherited(arguments);
                return this;
            }

            this.clusterData.push(p);
            var clustered = false;

            // debugger
            // look for an existing cluster for the new point
            for (var i = 0; i < this.clusters.length; i++) {
                var c = this.clusters[i];
                if (this._clusterTest(p, c)) {
                    // add the point to an existing cluster
                    this._clusterAddPoint(p, c);
                    // update the cluster's geometry
                    this._updateClusterGeometry(c);
                    // update the label
                    this._updateLabel(c);
                    clustered = true;
                    break;
                }
            }
            if (!clustered) {
                this._clusterCreate(p);

                p.attributes.clusterCount = 1;
                this._showCluster(p);
            }
        },

        removeAll: function () {
            // Summary:  Remove all clusters and data points.
            this.inherited(arguments);
            this.clusters.length = 0;
        },


        clearSingles: function (singles) {
            var s = singles || this.singles;
            s.forEach(function (g) {
                this.remove(g);
            }, this);
            this.singles.length = 0;
        },

        _clearClickSingles:function(singles){
            var s = singles || this.singles;
            s.forEach(function (g) {
                if(g.attributes.isClick)
                this.remove(g);
            }, this);
            this.singles.length = 0;
        },

        _onClick: function (evt) {
            // remove any previously showing single features
            this._clearClickSingles(this.singles);
            // find single graphics that make up the cluster that was clicked
            // would be nice to use filter but performance tanks with large arrays in IE
            var singles = [];
            var promises=[];

            for (let i = 0; i < this.clusterData.length; i++) {
                promises.push(this._view.hitTest(evt).then(function(response){
                    if (response.results.length>0&&response.results[0].graphic&&response.results[0].graphic.attributes.clusterId === this.clusterData[i].attributes.clusterId) {
                        this.clusterData[i].attributes.isClick=true;
                        singles.push(this.clusterData[i]);
                    }
                }.bind(this))) ;
            }
            Promise.all(promises).then(values=>{
                if (singles.length > this.maxSingles) {
                    alert("Sorry, that cluster contains more than " + this._maxSingles + " points. Zoom in for more detail.");

                } else {
                    // stop the click from bubbling to the map
                    evt.stopPropagation();
                    this._addSingles(singles);
                }
            })
        },

        _addSingles: function (singles) {
            // add single graphics to the map
            singles.forEach(function (p) {
                var g = new Graphic({
                    geometry: new Point({
                        x: p.x,
                        y: p.y,
                        spatialReference: this._view.spatialReference
                    }),
                        symbol:this.singleSymbol,
                        attributes:p.attributes,
                });
                this.singles.push(g);
                if (this.showSingles) {
                    this.add(g);
                }
            }, this);
        },

        _updateClusterGeometry: function (c) {
            // find the cluster graphic
            var cg = this.graphics.filter(function (g) {
                return  g.attributes.clusterId == c.attributes.clusterId;
            });

            if (cg.length == 1) {
                var point=cg.items[0]
                point.geometry.x = c.x;
                point.geometry.y = c.y;

            } else {
                // console.log("didn't find exactly one cluster geometry to update: ", cg);
            }
        },

        _updateLabel: function (c) {
            // find the existing label
            var label = this.graphics.filter(function (g) {
                return g.symbol && g.symbol.declaredClass == "esri.symbols.TextSymbol" && g.attributes.clusterId == c.attributes.clusterId;
            });

            if (label.length == 1) {
                // console.log("update label...found: ", label);
                this.remove(label[0]);
                var newLabel = {
                    type: "text",
                   // color: this._clusterLabelColor,
                    text: c.attributes.clusterCount.toString(),
                    xoffset: 0,
                    yoffset: this.clusterLabelOffset,
                    font: {  // autocast as new Font()
                        size: 12,
                        family: "sans-serif",
                        weight: "bolder"
                    }
                }
                this.add(
                    new Graphic({
                        geometry: new Point({x: c.x, y: c.y, spatialReference: this._view.spatialReference}),
                        symbol: newLabel,
                        attributes: c.attributs
                    })
                );
                // console.log("updated the label");
            } else {
                // console.log("didn't find exactly one label: ", label);
            }
        },


        _clusterGraphics: function () {
            for (let i = 0; i < this.clusterData.length; i++) {
                var point = this.clusterData[i];
                var clustered = false;
                for (let j = 0; j < this.clusters.length; j++) {
                    var clusterPoint = this.clusters[j];
                    if (this._clusterTest(point, clusterPoint)) {
                        this._clusterAddPoint(point, clusterPoint);
                        clustered = true;
                        break;
                    }
                }
                if (!clustered) {
                    this._clusterCreate(point);
                }
            }
            this._showAllClusters();
        },

        _clusterTest: function (point, cluster) {
            var distance = (
                Math.sqrt(
                    Math.pow((cluster.x - point.x), 2) + Math.pow((cluster.y - point.y), 2)
                ) / this._clusterResolution
            );
            return (distance <= this.clusterTolerance);
        },

        // points passed to clusterAddPoint should be included
        // in an existing cluster
        // also give the point an attribute called clusterId
        // that corresponds to its cluster
        _clusterAddPoint: function (p, cluster) {
            // average in the new point to the cluster geometry
            var count, x, y;
            count = cluster.attributes.clusterCount;
            x = (p.x + (cluster.x * count)) / (count + 1);
            y = (p.y + (cluster.y * count)) / (count + 1);
            cluster.x = x;
            cluster.y = y;

            // build an extent that includes all points in a cluster
            // extents are for debug/testing only...not used by the layer
            if (p.x < cluster.attributes.extent[0]) {
                cluster.attributes.extent[0] = p.x;
            } else if (p.x > cluster.attributes.extent[2]) {
                cluster.attributes.extent[2] = p.x;
            }
            if (p.y < cluster.attributes.extent[1]) {
                cluster.attributes.extent[1] = p.y;
            } else if (p.y > cluster.attributes.extent[3]) {
                cluster.attributes.extent[3] = p.y;
            }

            // increment the count
            cluster.attributes.clusterCount++;
            // attributes might not exist
            if (!p.hasOwnProperty("attributes")) {
                p.attributes = {};
            }
            // give the graphic a cluster id
            p.attributes.clusterId = cluster.attributes.clusterId;
        },

        // point passed to clusterCreate isn't within the
        // clustering distance specified for the layer so
        // create a new cluster for it
        _clusterCreate: function (p) {
            var clusterId = this.clusters.length + 1;
            // console.log("cluster create, id is: ", clusterId);
            // p.attributes might be undefined
            if (!p.attributes) {
                p.attributes = {};
            }
            p.attributes.clusterId = clusterId;
            // create the cluster
            var cluster = {
                "x": p.x,
                "y": p.y,
                "attributes": {
                    "clusterCount": 1,
                    "clusterId": clusterId,
                    "extent": [p.x, p.y, p.x, p.y]
                }
            };
            this.clusters.push(cluster);
        },

        _showAllClusters: function () {
            for (var i = 0 ; i < this.clusters.length; i++) {
                var c = this.clusters[i];

                this._showCluster(c);
            }
        },

        _showCluster: function (cluster) {
            if (cluster.attributes.clusterCount === 1) {
                var singles=[];
               for(let i=0;i<this.clusterData.length;i++){
                   if(this.clusterData[i].attributes.clusterId===cluster.attributes.clusterId){
                       this.clusterData[i].attributes.isClick=false;
                       singles.push(this.clusterData[i]);
                   }
               }
               this._addSingles(singles);

            }else{
                var point = new Point({
                    x: cluster.x,
                    y: cluster.y,
                    spatialReference: this._view.spatialReference
                });

                var clusterGraphic= new Graphic({
                    geometry: point,
                    symbol:this.clusterSymbol,
                    attributes: cluster.attributes,
                });


                var label =new TextSymbol({
                    text: cluster.attributes.clusterCount.toString(),
                    xoffset: 0,
                    yoffset: this.clusterLabelOffset,
                    font: {
                        size: 12,
                        family: "sans-serif",
                        weight: "bolder"
                    }
                });
                var clusterLabelGraphic= new Graphic({
                    geometry: point.clone(),
                    symbol: label,
                    attributes: cluster.attributes,
                });
                this.add(clusterGraphic);
                this.add(clusterLabelGraphic);

            }
        },


    });

});
