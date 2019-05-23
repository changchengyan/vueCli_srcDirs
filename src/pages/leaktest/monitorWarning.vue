<template>
  <div id="monitorWarning">
    <div class="gistools">
      <gis-tools :defaultLayers="[]" @handleThisDom="thisDom"></gis-tools>
    </div>
    <div id="warnGis"></div>
    <div class="rightSideTable">
      <div class="toggleBar" @click="toggleShow">
        <template v-if="showSelf">
          <i class="el-icon-arrow-right"></i>
        </template>
        <template v-else>
          <i class="el-icon-arrow-left"></i>
        </template>
      </div>
      <div class="rightTable" v-if="showSelf">
        <div class="topTip">
          <span>夜间最小流量及水压监测信息</span>
          <el-checkbox @change="selectWarning" v-model="checked">报警</el-checkbox>
        </div>
        <div class="select-item">
          <span>选择对象:</span>
          <select-tree
            :waterWorksTree="tree"
            @showSelectLists="selectItem"
            :defaultCompony="initCompony"
          ></select-tree>
        </div>
        <div class="content">
          <table>
            <thead>
              <tr>
                <th>
                  <span>分区名称</span>
                </th>
                <th>
                  <span>时间</span>
                </th>
                <th>
                  <span>流量值(上下限)</span>
                </th>
                <th>
                  <span>压力值(上下限)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item,index) in warnList"
                :key="index"
                :class="item.status == '0' ? 'warning' : ''"
              >
                <td @click="gotoChart(item)">
                  <span>{{item.name}}</span>
                </td>
                <td>
                  <span :title="item.warnStime">{{item.warnStime}}</span>
                </td>
                <td>
                  <span>{{item.nowMinFlow}}({{item.flowLow}}-{{item.flowHigh}})</span>
                </td>
                <td>
                  <span>{{item.nowMinPress}}({{item.pressLow}}-{{item.pressHigh}})</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="piginate">
          <pagination
            :currentPage="paginate.currentPage"
            :noSmall="paginate.ifSmall"
            :totalPage="paginate.totalPage"
            @thisPage="gotoThisPage"
          ></pagination>
        </div>
      </div>
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
              <img src="../../assets/images/leaktest/secondLev.png" alt>
              <span>二级分区</span>
            </div>
            <div class="col">
              <img src="../../assets/images/leaktest/threeLev.png" alt>
              <span>三级分区</span>
            </div>
            <div class="col">
              <img src="../../assets/images/common/jxj.png" alt>
              <span>检修井</span>
            </div>
          </div>
        </div>
      </legend-component>
    </div>
  </div>
</template>

<script>
import { getWarnList } from "@/api/leaktest/monitorWarning";
import gisTools from "@/common/components/gis_units/tools";
import pagination from "@/common/components/pagination";
import selectTree from "@/common/components/leak_selectWidthTree";

import LegendComponent from "@/common/components/legend";
import * as esriLoader from "esri-loader";
esriLoader.loadCss(dse.arcgis_mainCss);
let startJs = dse.arcgis_startJS;
const options = {
  url: startJs,
  dojoConfig: dse.gisConfig
};
let pipeUrl = dse.pipe_default_layer_url;
let jxjUrl = dse.arcgis_jxj;
// 二维管网相关.
import popupUtils from "@/common/utils/popupUtils";
//管网图层配置
import gw2dConfig from "@/common/config/gis2d/gw2dConfig";
import jxj2dConfig from "@/common/config/gis2d/jxj2dConfig";
import layerUtils from "@/common/utils/layerUtils";
import { LoadSurface } from "@/common/utils/mixins";
export default {
  components: {
    gisTools,
    pagination,
    selectTree,
    LegendComponent
  },
  mixins: [LoadSurface],
  data() {
    return {
      view: null,
      map: null,
      layer1: null, //管道图层
      layer2: null, //检修井的图层
      showSelf: true, // 开合右侧表格
      tree: [],
      checked: true, //报警
      initCompony: "", // 初始化组织公司
      companyId: "",
      warnStatus: "0",
      warnList: [],
      paginate: {
        //分页器
        ifSmall: true,
        totalPage: 1,
        currentPage: 1
      },
      leakAgeLayer: null, //分区图层
      topTips: {
        top: [
          {
            color: "#44cef6",
            name: "输水管线"
          }
        ]
      },
      //    rootHeadNotAllow:true, // 是否允许 根 的  名字 被点击
      showLegend_flag: false //显示图例
    };
  },
  methods: {
    closeLegend(flag) {
      this.showLegend_flag = true;
    },
    selectWarning(val) {
      //    console.log(val)
      let that = this;
      if (val) {
        that.warnStatus = "0";
      } else {
        that.warnStatus = "";
      }
      that.getWarnListData();
    },
    //画分区
    markProject(coord) {
      this.LoadSurface({
        polygonInfo: coord.leakInfo.zone,
        attributes: {
          leakInfo: coord.leakInfo,
          lev: coord.lev
        }
      });
    },
    getWarnListData() {
      let that = this;
      getWarnList({
        companyId: "" + that.companyId,
        pageNum: parseFloat(that.paginate.currentPage),
        pageSize: 10,
        status: that.warnStatus
      })
        .then(res => {
          if (res.msg == "no user") {
            window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
              dse.baseURL
              }?id=${id}`;
            return;
          }
          if (res.msg == "操作失败") {
            that.$message.error("服务错误!");
            return;
          }
          if (res.status == 1) {
            let { data } = res;
            that.warnList = data.rows.length > 0 ? data.rows : [];
            that.paginate.totalPage = Math.ceil(data.total / 10) || 1;
            if (this.leakAgeLayer) {
              this.leakAgeLayer.removeAll();
            }
            if (that.warnList.length > 0) {
              var list = that.warnList.slice(0)
              list.sort(this.compare('lev'))
              list.forEach(item => {
                var obj = {
                  leakInfo: item,
                  lev: item.lev
                };
                that.markProject(obj);
                // that.getLeakInfoData(id);
              });
            }
          } else {
            that.warnList = [];
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    },

    selectItem(val) {
      this.companyId = val.id;
      this.getWarnListData();
    },
    gotoThisPage(index) {
      this.paginate.currentPage = index;
      this.getWarnListData();
    },
    toggleShow() {
      this.showSelf = !this.showSelf;
    },
    gotoChart(v) {
      let id = v.areaId;
      this.$store.commit("setAside_status", false);
      this.$emit("hiddenAside");
      this.$router.push({
        name: "pipe_leaktest_monitor_chart",
        query: {
          areaId: id
        }
      });
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
            "dse//modules/toolbars/_Draw",
            "dse/modules/measure/_measureDistance",
            "dse/modules/measure/_measureArea",
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
            _Draw,
            _measureDistance,
            _measureArea,
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

            that.view = new MapView({
              container: "warnGis",
              map: that.map,
              zoom: 15,
              center: [106.290351, 36.001819],
              highlightOptions: {
                color: [255, 255, 0, 1],
                haloOpacity: 0.9,
                fillOpacity: 0.2
              }
            });
            that.drawTools = new _Draw({
              view: that.view
            });
            that.distance = new _measureDistance({
              view: that.view
            });
            that.area = new _measureArea({
              view: that.view
            });
            that.leakAgeLayer = new GraphicsLayer({
              id: "leakAge"
            });

            that.map.layers.add(that.leakAgeLayer);
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
          }
        );
        let timer = null
      timer = setInterval(() => {
        let tree = this.$store.getters.get_orgTree;
        that.tree = tree;
        if (tree.length > 0) {
          if (tree[0].size === 0) {
            this.initCompony = tree[0].label;
            this.companyId = tree[0].id;
          } else if (tree[0].size > 0 && tree[0].children[0].size === 0) {
            this.initCompony = tree[0].children[0].label;
            this.companyId = tree[0].children[0].id;
          } else if (tree[0].size > 0 && tree[0].children[0].size > 0) {
            this.initCompony = tree[0].children[0].children[0].label;
            this.companyId = tree[0].children[0].children[0].id;
          }
          that.getWarnListData();
          clearInterval(timer)
        }
      }, 200)
          

    },
    thisDom(obj) {
      let that = this;
      let temp_str = obj.tmpStr;
      switch (temp_str) {
        case "平面":
          this._changeBaseLayer("gvec");
          break;
        case "卫星":
          this._changeBaseLayer("gimg");
          break;
        case "地形":
          this._changeBaseLayer("gter");
          break;
        case "测距":
          that.distance.start();
          break;
        case "测面":
          that.area.start();
          break;
        case "标点":
          that.drawTools.activate("circle");
          break;
        case "标面":
          that.drawTools.activate("polygon");
          break;
        case "清除所有":
          that.distance.clear();
          that.area.clear();
          break;
      }
    },
    //是否是底图
    _isBaseLayer(layerId) {
      let items = dse.baseMapLayers.filter(function (layer) {
        return layer.id === layerId;
      });
      return items.length > 0 ? items[0] : null;
    },
    //切换底图状态.
    _changeBaseLayer(type) {
      //
      let self = this;
      //
      this.map.allLayers.forEach((layer, index) => {
        if (this._isBaseLayer(layer.id)) {
          // self.map.getLayer(lId).setVisibility(false);

          self.map.findLayerById(layer.id).visible = false;
          /**
           * 修复底图切换时，标签图层显示不正常
           * @author wangsl
           * @date 2017-05-24
           * */
          let lblLayer = self.map.findLayerById(layer.id + "w");
          //hide label layer.
          if (lblLayer) {
            // lblLayer.setVisibility(false);
            lblLayer.visible = false;
          }
        }
      });
      let vecLayer = this.map.findLayerById(type);
      let labelLayer = this.map.findLayerById(type + "w");
      //
      if (vecLayer) {
        vecLayer.visible = true;
      }
      if (labelLayer) {
        labelLayer.visible = true;
      }
    }
  },
  mounted() {
    this.createMap();
  },
  created() {
    let that  = this;
  },
  beforeDestroy() {
    if (this.distance && this.area) {
      this.distance.clear();
      this.area.clear();
    }
  }
};
</script>

<style lang="scss" scoped>
$baseFont: 14px;
$baseColor: #333;
$baseBorderColor: #ccc;

#monitorWarning {
  width: 100%;
  height: 100%;
  position: relative;
  .legend {
    width: 400px;
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
  #warnGis {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .gistools {
    width: 180px;
    height: 30px;
    position: absolute;
    right: 10px;
    top: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    z-index: 2;
    background: #fff;
  }

  .rightSideTable {
    position: absolute;
    top: 70px;
    right: 10px;
    height: calc(100% - 80px);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    z-index: 2;

    .toggleBar {
      width: 24px;
      height: 88px;
      position: absolute;
      left: -24px;
      top: 50%;
      cursor: pointer;
      border: 1px solid #ccc;
      line-height: 88px;
      text-align: center;
      background: #fff;

      i {
        line-height: 60px;
      }
    }

    .rightTable {
      width: 400px;
      height: 100%;
      font-size: $baseFont;
      color: $baseColor;
      background: #fff;

      .topTip {
        position: relative;
        width: 100%;
        height: 40px;
        padding-left: 10px;
        background: #e3edef;
        line-height: 40px;
        font-weight: 600;
        .el-checkbox {
          position: absolute;
          right: 10px;
        }
      }

      .select-item {
        width: 100%;
        height: 50px;
        line-height: 30px;
        padding: 10px;
        font-size: 14px;
        color: #333;
        display: flex;
        justify-content: space-between;
        width: calc(100%);
        padding-top: 0;
        padding: 10px;

        border-bottom: 1px solid #ccc;

        span {
          display: inline-block;
          width: 80px;
        }

        .el-button {
          line-height: normal;
        }
      }

      .content {
        width: 100%;
        height: calc(100% - 130px);
        margin-bottom: 10px;

        table {
          border-spacing: 0;
          width: 100%;
          font-size: 14px;
          text-align: center;

          thead {
            width: 100%;

            tr {
              width: 100%;
              th {
                width: 25%;
                height: 30px;
                line-height: 30px;
                text-align: center;
                border-right: 1px solid $baseBorderColor;
                border-bottom: 1px solid $baseBorderColor;

                &:last-child {
                  border-right: none;
                }
              }
            }
          }

          tbody {
            width: 100%;

            tr {
              width: 100%;
              &.warning {
                color: red;
                &:first-child {
                  span {
                    color: red;
                  }
                }
              }
              td {
                // line-height: 30px;
                width: 25%;
                text-align: center;
                border-right: 1px solid $baseBorderColor;
                border-bottom: 1px solid $baseBorderColor;

                &:first-child {
                  span {
                    text-decoration: underline;
                    color: #0b82ff;
                    cursor: pointer;
                  }
                }

                &:last-child {
                  border-right: none;
                }

                span {
                  display: inline-block;
                  width: 100%;
                  min-height: 20px;
                  line-height: 20px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
