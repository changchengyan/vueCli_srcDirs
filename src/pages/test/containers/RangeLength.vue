<template>
  <div class="hello">
    <div id="measureTools">
        <button class="measure-distance">距离</button>
        <button class="measure-area">面积</button>
    </div>
    <div id="viewDiv">
    </div>
  </div>
</template>  
<script  >
import * as esriLoader from "esri-loader";
const options2 = {
  dojoConfig: {
    async: true,
    packages: [
      {
        location: '/static/js/',
        name: 'tools'
      }
    ]
  }
};
export default {
  name: "RangeLength",
  data() {
    return {
      value:"",
      view:null,
      msg: "Welcome to Your Vue.js App"
    };
  },
  methods: {
    createMap: () => {
      const that = this;
      const options = {
        url:"https://js.arcgis.com/4.7/",
        css:"https://js.arcgis.com/4.7/esri/css/main.css"
      };
      esriLoader.loadModules([
        "esri/layers/FeatureLayer",
        "esri/Map",
        "tools/measureTools",
        "esri/views/MapView",
        "dojo/domReady!"], options2).then(([
            FeatureLayer,
            Map,
            MeasureTools,
            MapView
          ]) => {

            //1.创建要素图层
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

            // 2.创建地图
            const map = new Map({
              basemap: "streets",  // The initial basemap to toggle from
              ground: "world-elevation"
            });

            // 3.添加要素图层到地图
            map.layers.add(diamondSymbolLayer)


            //5.添加地图到容器
            const view = new MapView({
              container: "viewDiv",
              map: map,
              locale: "zh-cn", //语言
              center: [116.3031, 43.6088],
              zoom: 12
            });
            // 4.添加工具栏
            const measureTool=new MeasureTools({
                map:map,
                view:view
            },"measureTools")
        });
    }
  },
  mounted() {
    this.createMap();
  }
};
</script>

<style  lang="scss" scoped>
//  @import url("https://js.arcgis.com/4.7/esri/css/main.css"); 
#measureTools {
    position: absolute;
    top: 50px;
    left: 50px;
    z-index: 1000;
}

#viewDiv {
  height: 1000px;
  width: 100%;
  position: relative;
  .toggleBaseMap{
    position: absolute;
    top:10px;
    right:10px;
  }
}
</style>
