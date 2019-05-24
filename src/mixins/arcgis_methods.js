

//测线
export let drawTool = {
    methods: {
      drawTool() { // 计算距离
        return esriLoader.loadModules([
          "esri/Graphic",
          "esri/geometry/Point",
          "esri/views/2d/draw/Draw",
          "esri/geometry/geometryEngine",
          "esri/geometry/Polyline"
        ], window.DSE.options).then(([Graphic, Point, Draw, geometryEngine, Polyline]) => {
  
          let _this = this;
          
          this.draw = new Draw({
            view: this.view
          });
         
          
          var action = this.draw.create("polyline");
          action.on("vertex-add", drawLine);
          action.on("cursor-update", drawLine);
          action.on("vertex-remove", drawLine);
          action.on("draw-complete", drawLine);
          this.view.focus();
          function drawLine(evt) {
  
            let vertices = evt.vertices;
  
            // create a new polygon
            var polyline = createLine(vertices);
  
            // create a new graphic representing the polygon, add it to the view
            var graphic = createGraphic(polyline);
            _this.view.graphics.add(graphic);
  
            // _this.pointLine_layer.add(graphic);
  
            // calculate the area of the polygon
            var length = geometryEngine.geodesicLength(polyline, "meters");
  
            // start displaying the area of the polygon
  
            labelLength(vertices[vertices.length-1], length);
            //Label polyon with its area
            function createLine(vertices) {
              var polyline = new Polyline({
                paths: vertices,
                spatialReference: _this.view.spatialReference,
              });
              return polyline
            }
  
            function createGraphic(line) {
              // a graphic representing the polyline that is being drawn
              let graphic = new Graphic({
                geometry: line,
                symbol: {
                  type: "simple-line",  // autocasts as SimpleLineSymbol()
                  color: [226, 119, 40],
                  width: 4
                },
                // attributes: 'drawline',
                type:"drawline"
              });
              return graphic
            }
            function labelLength(geom, length) {
              // console.log(geom.paths[0][0])
              var firstPoint = mercator2lonlat(geom)
              var point = new Point({
                longitude: firstPoint[0],
                latitude: firstPoint[1],
              })
              // console.log(point)
              let graphic = new Graphic({
                geometry: point,
                symbol: {
                  type: "text",  // autocasts as new TextSymbol()
                  text: length.toFixed(2) + 'm',
                  xoffset: 3,
                  yoffset: 3,
                  font: {  // autocast as new Font()
                    size: 12,
                    family: "sans-serif",
                    weight: "bolder"
                  }
                },
                // attributes: 'drawline',
                type:"drawline"
              });
            _this.view.graphics.add(graphic);
              
              // _this.pointLine_layer.add(graphic);
            }
          }
        })
      }
    }
  }
  
  //测面
  export let drawThing = {
    methods: {
      drawThing(evt) {
        return esriLoader.loadModules([
          "esri/Graphic",
          "esri/geometry/Point",
          "esri/views/2d/draw/Draw",
          "esri/geometry/geometryEngine",
          "esri/geometry/Polygon",
        ], window.DSE.options).then(([Graphic, Point, Draw, geometryEngine, Polygon]) => {
         
          var _this = this;
  
          _this.draw = new Draw({
            view: this.view
          });
          
  
          var action = _this.draw.create("polygon");;
          action.on("vertex-add", drawPolygon);
          action.on("cursor-update", drawPolygon);
          action.on("vertex-remove", drawPolygon);
          action.on("draw-complete", drawPolygon);
          this.view.focus();
  
          function createGraphic(polygon) {
            return new Graphic({
              geometry: polygon,
              symbol: {
                type: "simple-fill", // autocasts as SimpleFillSymbol
                color: [178, 102, 234, 0.8],
                style: "solid",
                outline: { // autocasts as SimpleLineSymbol
                  color: [255, 255, 255],
                  width: 2
                }
              },
              // attributes: 'drawPolygon',
              type:"drawPolygon"
            });
  
          }
          //Label polyon with its area
          function labelAreas(geom, area) {
            var graphic = new Graphic({
              geometry: geom.centroid,
              symbol: {
                type: "text",
                color: "black",
                haloColor: "black",
                haloSize: "1px",
                text: area.toFixed(2) + " 平方米",
                xoffset: 3,
                yoffset: 3,
                font: { // autocast as Font
                  size: 12,
                  family: "sans-serif"
                }
              },
              // attributes: 'drawPolygon',
              type:"drawPolygon"
            });
            // _this.pointLine_layer.add(graphic);
            _this.view.graphics.add(graphic);
          }
  
          function createPolygon(vertices) {
            return new Polygon({
              rings: vertices,
              spatialReference: _this.view.spatialReference
            });
          }
  
  
          function drawPolygon(evt) {
            var vertices = evt.vertices;
            let graphics = _this.view.graphics.items;
            for (var i = 0; i < graphics.length; i++) {
              if (graphics[i].type) {
  
                if (graphics[i].type == 'drawPolygon') {
                  _this.view.graphics.remove(graphics[i])
                  i--
                }
              }
            }
  
            var polygon = createPolygon(vertices);
  
            var graphic = createGraphic(polygon);
  
            _this.view.graphics.add(graphic);
  
            var area = geometryEngine.geodesicArea(polygon, "square-meters");
            if (area < 0) {
              var simplifiedPolygon = geometryEngine.simplify(polygon);
              if (simplifiedPolygon) {
                area = geometryEngine.geodesicArea(simplifiedPolygon, "square-meters");
              }
            }
  
            labelAreas(polygon, area);
  
          }
        })
      }
    }
  }
  
  //清除画图
  export let drawClear = {
    methods: {
      drawClear() {
        let graphics = this.view.graphics.items;
        for (var i = 0; i < graphics.length; i++) {
          if (graphics[i].type) {
  
            if (graphics[i].type == 'drawline'||graphics[i].type == 'drawPolygon') {
              this.view.graphics.remove(graphics[i])
              i--
            }
          }
        }
  
        this.draw.complete();
      }
    }
  }
  