<template>
  <div id="zoning_leakDetection">
    <layout-conponent :treeList="tree" :title="title" @select_thisTree="thisNode">
      <div class="sub-content">
        <div class="top-head">
          <span>{{title}}</span>
        </div>
        <div class="cards">
          <div class="card-item">
            <div class="content">
              <img src="../../assets/images/leaktest/D_percent.png" alt>
              <span v-if="pmr">{{pmr}}%</span>
            </div>
            <div class="footer">
              <span>上月产销差率</span>
            </div>
          </div>
          <div class="card-item last">
            <div class="content">
              <img src="../../assets/images/leaktest/lostFlow_percent.png" alt>
              <span v-if="leakRate">{{leakRate}}%</span>
            </div>
            <div class="footer">
              <span>上月管网漏损率</span>
            </div>
          </div>
          <div class="chart-card">
            <div class="tops">
              <span class="rect"></span>
              <span>漏损率统计(百分比)</span>
            </div>
            <div id="charts">
              <IEcharts
                :option="leakStatistic.line"
                :loading="leakStatistic.loading"
                :resizable="true"
              />
            </div>
          </div>
        </div>
        <div id="gis">
          <!-- <div class="demo" @click="gotoNewPage">跳转到二级分区</div> -->
        </div>
        <div class="legend legend-left">
          <legend-component
            :list="topTips"
            :topHeight="'40px'"
            :ifClosed="showLegend_flag"
            @closedSelf="closeLegend"
          >
            <div class="sub-tips">
              <div class="row">
                <div class="col">
                  <img src="../../assets/images/leaktest/firstLev.png" alt>
                  <span>一级分区</span>
                </div>
                <div class="col">
                  <img src="../../assets/images/common/jxj.png" alt>
                  <span>检修井</span>
                </div>
                <div class="col">
                  <img src="../../assets/images/common/fm.png" alt>
                  <span>阀门井</span>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <img src="../../assets/images/common/xfs.png" alt>
                  <span>消防栓</span>
                </div>
                <div class="col">
                  <img src="../../assets/images/common/flow.png" alt>
                  <span>流量计</span>
                </div>
                <div class="col">
                  <img src="../../assets/images/common/press.png" alt>
                  <span>压力计</span>
                </div>
              </div>
            </div>
          </legend-component>
        </div>
      </div>
    </layout-conponent>
  </div>
</template>

<script>
import IEcharts from "vue-echarts-v3/src/full.js";
import LayoutConponent from "@/common/components/layerOut"
import LegendComponent from "@/common/components/legend"
import {
  LoadSurface
} from '@/common/utils/mixins'
import {
  getAreaList,
  getLeakInfoByCompany,
  getSubareaLeakList,
  updateLeakRecord
} from "@/api/leaktest/zoning_leakDetection";
import {
  getOrganDictTree
} from "@/api/common/get_area";
import * as esriLoader from "esri-loader";
esriLoader.loadCss(dse.arcgis_mainCss);
let startJs = dse.arcgis_startJS;
const options = {
  url: startJs,
  dojoConfig: dse.gisConfig
};
let pipeUrl = dse.pipe_default_layer_url;
let jxjUrl = dse.arcgis_jxj;
let xfsUrl = dse.xfs_default_layer_url;
let fmUrl = dse.fm_default_layer_url;

//流量计
let flowUrl = dse.arcgis_devs_flow;
//水压计
let pressUrl = dse.arcgis_devs_press;
// 二维管网相关.
import popupUtils from "@/common/utils/popupUtils";
//管网图层配置
import gw2dConfig from "@/common/config/gis2d/gw2dConfig";
import jxj2dConfig from "@/common/config/gis2d/jxj2dConfig";
import xfs2dConfig from "@/common/config/gis2d/xfs2dConfig";

import layerUtils from "@/common/utils/layerUtils";

export default {
  components: {
    IEcharts,
    LayoutConponent,
    LegendComponent
  },
  data() {
    return {
      view: null,
      map: null,
      layer1: null, //管道图层
      layer2: null, //检修井的图层
      pipeIframe: "",
      areaList: [],//当前水司所有分区
      areaId: "",//所选分区id
      nowYear: "",//年份
      pmr: "",//产销差率
      leakRate: "",//上月漏损
      leakStatistic: {
        year: "",
        month: "全年",
        loading: false,
        line: {
          tooltip: {
            trigger: "axis",
            formatter: "{b}月<br/>漏损率:{c}%"
          },
          grid: {
            top: "35px",
            left: "40px",
            right: "30px",
            bottom: "30px"
          },
          xAxis: {
          	name: "月",
            type: "category",
            boundaryGap: false,
            data: [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12"
            ]
          },
          yAxis: {
            name: "(%)",
            type: "value",
            splitLine: {
              show: true
            }
          },
          color: "#1cbbdf",
          series: [{
            data: [5, 5.7, 6.2, 7.8, 8.5, 9.2, 5.7, 8.2, 6.7, 9.2, 6.7, 8.3],
            type: "line",
            areaStyle: {
              normal: {
                type: "default",
                color: "#a4d8cc"
              }
            },
            smooth: false,
            itemStyle: {
              normal: {
                areaStyle: {
                  type: "default"
                }
              }
            }
          }]
        }
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tree: [],
      title: "", //标题
      topTips: {
        top: [{
          color: "#44cef6",
          name: "输水管线"
        }]
      },
      showLegend_flag: false, //显示图例
      factoryId: "", //当前水司的ID
      leakAgeLayer: null,//分区图层

    };
  },
  mixins: [LoadSurface],
  methods: {
    handleNodeClick(val) {
     
    },
    gotoNewPage(id) {
      this.$router.push({
        name: "pipe_leaktest_zoning_map",
        query: {
          areaId: id,
          companyId: this.factoryId,
          companyName:this.title
        }
      });
      this.$store.commit("setAside_status", false);
      this.$emit("hiddenAside");
    },
    closeLegend(flag) {
      this.showLegend_flag = true;
    },
    async createMap() {
      let that = this;
      let temp_modelUrl = that.gisModel_iframe;
      await esriLoader
        .loadModules(
          [
            "dojo/on",
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer",
            "esri/layers/GraphicsLayer",
            "esri/geometry/geometryEngine",
            "esri/Graphic",
            "esri/widgets/Search",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/views/2d/draw/Draw",
            "esri/tasks/QueryTask",
            "esri/tasks/support/Query",
            "esri/symbols/SimpleFillSymbol",
            "esri/geometry/Polyline",
            "dse/utils/BaseMapUtils",
            "dojo/domReady!"
          ],
          options
        )
        .then(
          ([
            domOn,
            Map,
            MapView,
            FeatureLayer,
            GraphicsLayer,
            geometryEngine,
            Graphic,
            Search,
            SimpleMarkerSymbol,
            Draw,
            QueryTask,
            Query,
            SimpleFillSymbol,
            Polyline,
            BaseMapUtils
          ]) => {
            layerUtils.bindAmdClass(QueryTask, Query, GraphicsLayer, Graphic);
            that.map = new Map({});
            let baseMapUtils = new BaseMapUtils({
              map: that.map,
              mapType: "2"
            });
            baseMapUtils.loadBaseLayers(dse.baseMapLayers);
            const staticBaseUrl = dse.static_baseUrl;

            // 管网图层.
            gw2dConfig.url = that.$store.getters.get_pipe_defaultLayer;
            gw2dConfig.popupTemplate.visible = false;
            that.layer1 = layerUtils.loadData(that.map, gw2dConfig);
            //===================================================

            // 检修井图层.
            jxj2dConfig.url = jxjUrl;
            jxj2dConfig.popupTemplate.visible = false;
            that.layer2 = layerUtils.loadData(that.map, jxj2dConfig);
            //===================================================

            // 消防栓图层.
            xfs2dConfig.url = that.$store.getters.get_xfs_defaultLayer;
            xfs2dConfig.popupTemplate.visible = false;
            that.layer3 = layerUtils.loadData(that.map, xfs2dConfig);
            //===================================================
            //阀门的图层
            that.layer4 = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.layer4);
            let queryTask_fm = new QueryTask({
              url: fmUrl
            });
            let query_fm = new Query();
            query_fm.returnGeometry = true;
            query_fm.outFields = ["*"];
            query_fm.where = "1 = 1"; //阀门
            queryTask_fm
              .execute(query_fm)
              .then(featureSet => {
                let features = featureSet.features;
                features.map(val => {
                  let point_marker = new Graphic({
                    geometry: val.geometry,
                    symbol: {
                      type: "picture-marker",
                      url: "" + staticBaseUrl + "/gis_temporary_pic/fm.png",
                      width: "25px",
                      height: "25px"
                    },
                    attributes: val.attributes,
                    // popupTemplate: {
                    //   title: "阀门",
                    //   content: "" + iframe_fm
                    // }
                  });

                  that.layer4.add(point_marker);
                });
              })
              .catch(error => {
                console.log(error);
              });

            //  流量计的图层
            that.waterFlow_layer = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.waterFlow_layer);
            let queryTask_flow = new QueryTask({
              url: flowUrl
            });
            let query_flow = new Query();
            query_flow.returnGeometry = true;
            query_flow.outFields = ["*"];
            query_flow.where = "1 = 1"; //水流
            queryTask_flow
              .execute(query_flow)
              .then(featureSet => {
                let features = featureSet.features;
                features.map(val => {
                  let addressName = val.attributes.NAME || "";
                  let point_marker = new Graphic({
                    geometry: val.geometry,
                    symbol: {
                      type: "picture-marker",
                      url: "" + staticBaseUrl + "/gis_temporary_pic/flow.png",
                      width: "30px",
                      height: "30px"
                    },
                    attributes: val.attributes,
                    // popupTemplate: {
                    //   title: "" + addressName + "流量计",
                    //   content: "" + iframe_flow
                    // }
                  });

                  that.waterFlow_layer.add(point_marker);
                });
              })
              .catch(error => {
                console.log(error);
              });

            //  水压计的图层
            that.waterPress_layer = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.waterPress_layer);
            let queryTask_press = new QueryTask({
              url: pressUrl
            });
            let query_press = new Query();
            query_press.returnGeometry = true;
            query_press.outFields = ["*"];
            query_press.where = "2 = 2 "; //水压
            queryTask_press
              .execute(query_press)
              .then(featureSet => {
                let features = featureSet.features;
                features.map(val => {
                  let addressName = val.attributes.NAME || "";
                  let point_marker = new Graphic({
                    geometry: val.geometry,
                    symbol: {
                      type: "picture-marker",
                      url: "" + staticBaseUrl + "/gis_temporary_pic/press.png",
                      width: "30px",
                      height: "30px"
                    }
                  });

                  that.waterPress_layer.add(point_marker);
                });
              })
              .catch(error => {
                console.log(error);
              });

            that.leakAgeLayer = new GraphicsLayer({
              id: 'leakAge'
            });

            that.map.layers.add(that.leakAgeLayer);

            that.view = new MapView({
              container: "gis",
              map: that.map,
              zoom: 15,
              center: [106.290351, 36.001819],
              highlightOptions: {
                color: [255, 255, 0, 1],
                haloOpacity: 0.9,
                fillOpacity: 0.2
              }
            });


            //监听弹出框.
            that.view.popup.watch("selectedFeature", function (
              newView,
              oldValue,
              portery,
              object
            ) {
              window.graphic = that.view.popup.selectedFeature;
              that.iframe_width_flag = false;
              if (window.graphic) {
                that.view.graphics.removeAll();
                let tempGra = new Graphic({
                  geometry: window.graphic.geometry,
                  symbol: {
                    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                    style: "circle",
                    color: [255, 250, 205, 0.3],
                    size: "60px",
                    outline: {
                      // autocasts as new SimpleLineSymbol()
                      color: "yellow",
                      width: 1
                    }
                  }
                });
                that.view.graphics.add(tempGra);
                let params = window.graphic.attributes;
                dse.globalData = params;
              }
            });
            //关闭弹出框时恢复高亮显示的管线.
            that.view.popup.watch("visible", function (
              newView,
              oldValue,
              portery,
              object
            ) {
              if (!newView) {
                that.view.graphics.removeAll();
              }
            });

            that.view.on("click", function (event) {
              that.view.hitTest(event)
                .then(graphics => {
                  if (graphics.results && graphics.results[0].graphic && graphics.results[0].graphic.layer.id == 'leakAge') {
                    var areaId = graphics.results[0].graphic.attributes.leakInfo.id
                    that.gotoNewPage(areaId)
                  }
                });
            });
          }
        );
        let timer = null
	      timer = setInterval(() => {
	        let tree = this.$store.getters.get_orgTree
	        this.tree = tree;
	        // console.log(tree,"tree")
	        if (tree.length > 0) {
	          if (tree[0].size === 0) {
	            this.title = tree[0].label
	            this.factoryId = tree[0].id;
	          } else if (tree[0].size > 0 && tree[0].children[0].size === 0) {
	            this.title = tree[0].children[0].label
	            this.factoryId = tree[0].children[0].id;
	          } else if (tree[0].size > 0 && tree[0].children[0].size > 0) {
	            this.title = tree[0].children[0].children[0].label
	            this.factoryId = tree[0].children[0].children[0].id;
	          }
	          this.getArea();
	          this.getLeakInfoData();
	          clearInterval(timer)
	        }
	      }, 200)
    },
    thisNode(data) {
      let temp_str = data.label;
      if (temp_str.indexOf("集团") > -1) {
        this.$message.error("集团不可见数据呦~");
        return
      }
      if (data.size && data.size != "0") {
        return
      }
      if (this.leakAgeLayer) {
        this.leakAgeLayer.removeAll()
      }

      this.title = data.label;
      this.factoryId = data.id;
      this.getLeakInfoData();
      this.getArea();
    },
    getArea() {
      let that = this;
      getAreaList({
        "companyId": "" + that.factoryId,
        "lev": "1"
      }).then(res => {
        if (res.msg == "no user") {
          window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`;
          return;
        }
        if (res.msg == "操作失败") {
          that.$message.error("服务错误!");
          return;
        }
        if (res.status == 1) {
          that.areaList = res.data.length > 0 ? res.data : [];
          if (that.areaList.length > 0) {
            // that.areaId = that.areaList[0].id;

            that.areaList.forEach(item => {
              var obj = {
                leakInfo: item,
                lev: '1'
              }
              that.markProject(obj)
            })
          }
        }

      }).catch(error => {
        console.log(error)
      })
    },
    //画分区
    markProject(coord) {
      if (coord.leakInfo.zone) {
        this.LoadSurface({
          polygonInfo: coord.leakInfo.zone,
          attributes: {
            leakInfo: coord.leakInfo,
            lev: coord.lev
          }
        })
      }

    },
    getLeakInfoData() {
      let that = this;
      getLeakInfoByCompany({
        "companyId": "" + that.factoryId,
        "yearNum": "" + that.nowYear
      }).then(res => {
        if (res.msg == "no user") {
          window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`;
          return;
        }
        if (res.msg == "操作失败") {
          that.$message.error("服务错误!");
          return;
        }
        if (res.status == 1) {
          if (res.data) {
            that.leakStatistic.line.series[0].data = [];
            that.pmr = res.data.pmr ? res.data.pmr : "";
            that.leakRate = res.data.leakRate ? res.data.leakRate : "";
            if (res.data.leakList && res.data.leakList.length > 0) {
              res.data.leakList.map(item => {
                that.leakStatistic.line.series[0].data.push(item.rate);
              })
            }
          } else {
            that.pmr = "";
            that.leakRate = "";
            that.leakStatistic.line.series[0].data = [];
          }

        } else {
          that.pmr = "";
          that.leakRate = "";
          that.leakStatistic.line.series[0].data = [];
        }

      }).catch(error => {
        console.log(error)
      })
    }
  },
  created() {

    let that = this;
    this.map=null;
    this.view=null;
    let nowTime = new Date();
    let year = nowTime.getFullYear();
    this.nowYear = year;
  },
  mounted() {
    this.createMap()
  }
};
</script>

<style lang="scss" scoped>
#zoning_leakDetection {
  width: 100%;
  height: 100%;

  .sub-content {
    width: 100%;
    height: 100%;
    position: relative;

    .top-head {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.5);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      position: relative;
      z-index: 10;
      color: #fff;
      font-weight: 600;
    }

    .cards {
      position: absolute;
      right: 0px;
      top: 50px;
      width: 300px;
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      z-index: 2;

      & > div {
        height: 32%;
        background: #fff;
      }

      .card-item {
        width: 100%;

        .content {
          width: 100%;
          height: calc(100% - 30px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #fff;

          i {
            font-size: 50px;
            line-height: 55px;
          }

          span {
            font-size: 40px;
            line-height: 45px;
            font-weight: 600;
          }
        }

        .footer {
          height: 30px;
          width: 100%;
          text-align: center;
          line-height: 30px;
          font-size: 14px;
          color: #fff;
          background: rgba(0, 0, 0, 0.2);
        }

        &:first-child {
          background: #20bff9;
        }

        &.last {
          background: #f7a444;
        }
      }

      .chart-card {
        width: 100%;

        .tops {
          height: 30px;
          width: 100%;
          padding-left: 10px;
          border-bottom: 1px solid #ccc;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 14px;

          span.rect {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #2db8bd;
            margin-right: 10px;
          }
        }

        #charts {
          width: 100%;
          height: calc(100% - 30px);
        }
      }
    }

    #gis {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;

      // .demo {
      //   position: absolute;
      //   top: 50%;
      //   left: 50%;
      //   background: #fff;
      //   padding: 20px;
      //   cursor: pointer;
      // }
    }

    .legend {
      width: 300px;
      // height: 300px;
      position: absolute;
      left: 10px;
      bottom: 20px;
      z-index: 3;

      .sub-tips {
        width: 100%;

        .row {
          width: 100%;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .col {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            span {
              line-height: 30px;
            }

            img {
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
