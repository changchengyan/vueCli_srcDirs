<template>
  <div class="hello">
    <div id="viewDiv"></div>
  </div>
</template>

<script  >
import * as esriLoader from "esri-loader";
export default {
  name: "Test",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  methods: {
    createMap: () => {
      const options = {
        url:"https://js.arcgis.com/4.7/",
        css:"https://js.arcgis.com/4.7/esri/css/main.css"
      };
      esriLoader.loadModules(["esri/renderers/support/jsonUtils","esri/layers/FeatureLayer","esri/tasks/Locator","esri/Map", "esri/views/MapView","esri/layers/TileLayer","dojo/domReady!"], options).then(([rendererJsonUtils,FeatureLayer,Locator,Map, MapView,TileLayer]) => {
            var locatorTask = new Locator({
              url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
            });
            var rendererJson = {
              "authoringInfo":null,
              "type":"uniqueValue",
              "field1":"CLASS",
              "field2":null,
              "field3":null,
              "expression":null,
              "fieldDelimiter":null,
              "defaultSymbol":{
                  "color":[
                    235,
                    235,
                    235,
                    255
                  ],
                  "type":"esriSLS",
                  "width":3,
                  "style":"esriSLSShortDot"
              },
              "defaultLabel":"Other major roads",
              "uniqueValueInfos":[
                  {
                    "value":"I",
                    "symbol":{
                        "color":[
                          255,
                          170,
                          0,
                          255
                        ],
                        "type":"esriSLS",
                        "width":10,
                        "style":"esriSLSSolid"
                    },
                    "label":"Interstate"
                  },
                  {
                    "value":"U",
                    "symbol":{
                        "color":[
                          223,
                          115,
                          255,
                          255
                        ],
                        "type":"esriSLS",
                        "width":7,
                        "style":"esriSLSSolid"
                    },
                    "label":"US Highway"
                  }
              ]
            };
            // Create a renderer object from its JSON representation
            var flRenderer = rendererJsonUtils.fromJSON(rendererJson);
           const diamondSymbol = {
              type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
              style: "diamond",
              color: [ 255, 128, 45 ],  // autocasts as new Color()
              outline: {              // autocasts as new SimpleLineSymbol()
                style: "dash-dot",
                color: [ 255, 128, 45 ] // Again, no need for specifying new Color()
              }
            };

            const diamondSymbolLayer = new FeatureLayer({
              url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/WorldCities/FeatureServer/0",
              renderer: {
                type: "simple",  // autocasts as new SimpleRenderer()
                symbol: diamondSymbol
              }
            });

            // Create the Map
            const map = new Map({
              basemap: "streets-navigation-vector"
            });
            map.layers.add(diamondSymbolLayer)
            // Create the MapView
            const view = new MapView({
              container: "viewDiv",
              map: map,
              locale: "zh-cn", //语言
              center: [-116.3031, 43.6088],
              zoom: 12
            });
            view.on("click", function(event){
            event.stopPropagation();
            //获取经纬度
            var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
            var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
            
            view.popup.open({
              title: "Popup dock positions",
              location: event.mapPoint,
              visible:true,
              updateLocationEnabled: true,
              content: "Use the control in the center of the map to change the location where the popup will dock."
            });
            view.popup.open({
                title: "Reverse geocode: [" + lon + ", " + lat + "]",
                location: event.mapPoint
            });
            //定位服务，可以省略，不是本例中的主要内容
            locatorTask.locationToAddress(event.mapPoint)
            .then(function(response) {
              var address = response.address.Match_addr;
              view.popup.content = address;
            })
            .otherwise(function(err) {
              view.popup.content =
                "No address was found for this location";
            });
          });
        });
    } //我们需要执行的方法都定义在该属性里
  },
  mounted() {
    this.createMap();
  }
};
</script>

<style  lang="scss" scoped>

#viewDiv {
  height: 1000px;
  width: 100%;
}
</style>
