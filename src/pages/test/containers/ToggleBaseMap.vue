<template>
  <div class="hello">
    <div id="viewDiv">
      <div class="toggleBaseMap">
           <el-select v-model="value" placeholder="请选择" @change="selectChange">
              <el-option
                v-for="item in maps"
                :key="item.id"
                :label="item.type"
                :value="item.type">
                <div style="display:flex;justifyContent:space-between;alignItems:center">
                  <img :src="item.smallSimple" style="width:25px;height:90%" />
                  <span style="color: #8492a6; font-size: 13px">{{ item.type }}</span>
                </div>
              </el-option>
            </el-select>
      </div>
    </div>
  </div>
</template>

<script  >
import * as esriLoader from "esri-loader";
export default {
  name: "ToggleBaseMap",
  data() {
    return {
      value:"",
      view:null,
      maps:[
        {
          id:"001",
          type:"topo",
          smallSimple:"http://www.arcgis.com/sharing/rest/content/items/fb84ad313bd3432983488ed1ba1d5bf3/info/thumbnail/ago_downloaded.png"
        },
        {
          id:"002",
          type:"streets",
          smallSimple:"http://www.arcgis.com/sharing/rest/content/items/0c539fdb47d34b17bd1452f6b9f49e97/info/thumbnail/_E7_BC_A9_E7_95_A5_E5_9B_BE3.png"
        },
        {
          id:"003",
          type:"satellite",
          smallSimple:"http://www.arcgis.com/sharing/rest/content/items/74e992f4fce3450aaf57a9a0df0007c3/info/thumbnail/cn_canvas.jpg"
        },
        {
          id:"004",
          type:"hybrid",
          smallSimple:"http://www.arcgis.com/sharing/rest/content/items/bf024b8d0b4b48f5a486070214e87c5f/info/thumbnail/ago_downloaded.png "
        },
        {
          id:"005",
          type:"gray",
          smallSimple:"http://www.arcgis.com/sharing/rest/content/items/5cd32b831bfb43d08e5ee75e7b40d53d/info/thumbnail/ago_downloaded.png "
        },
        {
          id:"006",
          type:"oceans",
          smallSimple:"http://www.arcgis.com/sharing/rest/content/items/25cefd52161e44b8a5eec87768f79079/info/thumbnail/thumbnail.jpeg "
        },
      ],
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
      esriLoader.loadModules(["esri/layers/FeatureLayer","esri/Map", "esri/views/MapView","dojo/domReady!"], options).then(([FeatureLayer,Map, MapView]) => {
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
              basemap: "streets",  // The initial basemap to toggle from
              ground: "world-elevation"
            });
            map.layers.add(diamondSymbolLayer)
            // Create the MapView
             that.view = new MapView({
              container: "viewDiv",
              map: map,
              locale: "zh-cn", //语言
              center: [116.3031, 43.6088],
              zoom: 12
            });
        });
    },
    selectChange:(val)=>{
      this.view.map.basemap = val;
    }
  },
  mounted() {
    this.createMap();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss" scoped>
//  @import url("https://js.arcgis.com/4.7/esri/css/main.css"); 
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
