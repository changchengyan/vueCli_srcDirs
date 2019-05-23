<template>
  <div id="zoningMap">
    <div class="top">
      <span>{{companyName}}管网二级分区</span>
      <span class="goBack" @click="goback">返回</span>
    </div>
    <div id="gisTwo">
      <!-- <div class="demo" @click="go_subMap">跳转到第三级页面</div> -->
    </div>
    <div class="gisTools">
      <tools :defaultLayers="[]" @handleThisDom="thisDom"></tools>
    </div>
    <div class="rightTable">
      <div class="toggoleBar" @click="toggleShow_">
        <template v-if="toggle_showTable==true">
          <i class="el-icon-arrow-right"></i>
        </template>
        <template v-else>
          <i class="el-icon-arrow-left"></i>
        </template>
      </div>
      <div class="contentTable" v-if="toggle_showTable==true">
        <div class="row">
          <span>一级分区{{parentName}}</span>
        </div>
        <div class="row">
          <div class="col">
            <div class="topTip">
              <span>上月漏损量</span>
            </div>
            <div class="Num">
              <span class="number">{{lastLeak}}</span>
              <span>m³</span>
            </div>
          </div>
          <div class="col">
            <div class="left">
              <div class="top">上月漏损率</div>
              <div>
                <span class="rect top1"></span>
                <span>高漏损率</span>
              </div>
              <div>
                <span class="rect top2"></span>
                <span>中漏损率</span>
              </div>
              <div>
                <span class="rect top3"></span>
                <span>低漏损率</span>
              </div>
            </div>
            <div class="right">
              <IEcharts :resizable="true" :option="overhualRate"></IEcharts>
            </div>
          </div>
        </div>
        <div class="lineChart">
          <div class="tophead">
            <span class="rect"></span>
            <span>漏损率变化曲线</span>
          </div>
          <div class="lineChart">
            <div class="top">
              <el-date-picker
                v-model="yearItem"
                @change="selectYear"
                type="year"
                placeholder="选择年"
                value-format="yyyy"
                format="yyyy"
              ></el-date-picker>
            </div>
            <div class="line_chart">
              <IEcharts class="box-card-leaktotal" :resizable="true" :option="leakRateData"></IEcharts>
            </div>
          </div>
        </div>
        <div class="subTable">
          <table>
            <thead>
              <tr>
                <th>
                  <span>二级分区名称</span>
                </th>
                <th>
                  <span>漏损量(m³)</span>
                </th>
                <th>
                  <span>漏损率(%)</span>
                </th>
                <th>
                  <span>操作</span>
                </th>
              </tr>
            </thead>
            <tbody v-if="childZoneList.length>0">
              <tr v-for="(item,index) in childZoneList" :key="index">
                <td>
                  <span @click="openZoneModel(item)">{{item.name}}</span>
                </td>
                <td>
                  <span>{{item.leakSum}}</span>
                </td>
                <td>
                 <template v-if="item.leakRate&&item.leakRate>=20">
                		<span class="red">{{item.leakRate}}</span>
                		<!--fa2805-->
                	</template>	
                	<template v-if="item.leakRate&&item.leakRate<=20&&item.leakRate>=15">
                		<span class="orange">{{item.leakRate}}</span>
                	</template>	
                	<template v-if="item.leakRate&&item.leakRate<=15&&item.leakRate>=10">
                		<span class="yellow">{{item.leakRate}}</span>
                	</template>	
                	<template v-if="item.leakRate&&item.leakRate<10">
                		<span class="green">{{item.leakRate}}</span>
                	</template>	
                	<template v-if="!item.leakRate">
                		<span class="normal">{{item.leakRate}}</span>
                	</template>
                </td>
                <td @click="gotoDetail(item)">
                  <span>计算详情</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--<div class="pagination">
					<el-pagination background layout="prev, pager, next" :total="totalNum" v-if="totalNum!=0"></el-pagination>
        </div>-->
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
              <img src="../../assets/images/common/jxj.png" alt>
              <span>检修井</span>
            </div>
          </div>
        </div>
      </legend-component>
    </div>
    <zone-Model
      :showViewModel="showModelFlag"
      :title="title"
      :wd="wd"
      cht="calc(100% - 40px)"
      @hiddenSelf="colseModel"
    >
      <div class="zoneInfo">
        <div class="row">
          <div class="col">
            <span>分区名称</span>
          </div>
          <div class="col">
            <span>{{thisZone.name}}</span>
          </div>
          <div class="col">
            <span>用水量(m³)</span>
          </div>
          <div class="col">
            <span>{{thisZone.consumption}}</span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <span>用水户数</span>
          </div>
          <div class="col">
            <span>{{thisZone.userCount}}</span>
          </div>
          <div class="col">
            <span>区域管网总长(km)</span>
          </div>
          <div class="col">
            <span>{{thisZone.pipeLength}}</span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <span>边界管线个数</span>
          </div>
          <div class="col">
            <span>{{thisZone.pipeCount}}</span>
          </div>
          <div class="col">
            <span>区域管网基本信息</span>
          </div>
          <div class="col">
            <span class="pipeInfo" :title="thisZone.pipeInfo">{{thisZone.pipeInfo}}</span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <span>边界阀门个数</span>
          </div>
          <div class="col">
            <span>{{thisZone.valveCount}}</span>
          </div>
          <div class="col">
            <span>边界流量表个数</span>
          </div>
          <div class="col">
            <span>{{thisZone.flowCount}}</span>
          </div>
        </div>
      </div>
    </zone-Model>
  </div>
</template>

<script>
import tools from "@/common/components/gis_units/tools";
import IEcharts from "vue-echarts-v3/src/full.js";
import {
  LoadSurface,
  LoadLeakLabel
} from '@/common/utils/mixins'
import {
  getLeakInfo,
  getSubareaLeakList,
  updateLeakRecord,
  getAreaInfo
} from "@/api/leaktest/zoning_leakDetection";
import * as esriLoader from "esri-loader";
esriLoader.loadCss(dse.arcgis_mainCss);
let startJs = dse.arcgis_startJS;
const options = {
  url: startJs,
  dojoConfig: dse.gisConfig
};
let pipeUrl = dse.fm_default_layer_url;
import zoneModel from "@/common/components/poupe/view"
let jxjUrl = dse.arcgis_jxj;

let qcUrl = dse.arcgis_devs_qc;
let flowUrl = dse.arcgis_devs_flow;
let pressUrl = dse.arcgis_devs_press;

let colse_viewPoupe = null;

// 二维管网相关.
import popupUtils from "@/common/utils/popupUtils";
//管网图层配置
import gw2dConfig from "@/common/config/gis2d/gw2dConfig";
import jxj2dConfig from "@/common/config/gis2d/jxj2dConfig";
import layerUtils from "@/common/utils/layerUtils";

import LegendComponent from "@/common/components/legend";

export default {
  components: {
    tools,
    IEcharts,
    LegendComponent,
    zoneModel
  },
  mixins: [LoadSurface, LoadLeakLabel],
  data() {
    return {
      view: null,
      map: null,
      layer1: null, //管道图层
      layer2: null, //检修井的图层
      drawTools: null, //gis工具栏  绘图工具
      distance: null, //gis工具栏  量测工具
      area: null, //gis工具栏  量测面积
      areaId: null, //父级分区id
      companyId:"",
      companyName:"",
      yearItem: "", //选中的年份
      lastLeak: "", //上月漏损量
      leakRate: "", //上月漏损
      //				totalNum:0,//
      thisYear: "",//查询子分区列表年份
      thisMonth: "",//查询子分区列表月份
      childZoneList: [],//子分区列表
      parentName: "",//父分区名称
      showModelFlag: false,//
      zoneDetailsId: "",//查看分区详情的id
      title: "分区详情",
      wd: "40%",
      thisZone: "",
      overhualRate: {
        tooltip: {
          //						formatter: "{a} <br/>{b} : {c}%"
        },
        series: [{
          type: "gauge",
          center: ["50%", "55%"], // 默认全局居中
          radius: "100%",
          axisLine: {
            show: true,
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: [
                //表盘颜色
                [0, "#20AE51"],
                [0.2, "#20AE51"],
                [0.3, "#FF9618"],
                [0.3, "#DA462C"],
                [1, "#DA462C"]
              ],
              width: 10 //表盘宽度
            }
          },
          splitLine: {
            //分割线样式（及10、20等长线样式）
            length: 10,
            lineStyle: {
              // 属性lineStyle控制线条样式
              width: 1
            }
          },
          axisTick: {
            //刻度线样式（及短线样式）
            length: 10,
            width: 8
          },
          axisLabel: {
            //文字样式（及“10”、“20”等文字样式）
            color: "black",
            distance: 1 //文字离表盘的距离
          },
          pointer: {
            //指针样式
            length: "90%",
            width: "10%"
          },
          itemStyle: {
            color: "#f13800"
          },
          detail: {
            formatter: "{score|{value}%}",
            offsetCenter: [0, "40%"],
            width: 20,
            rich: {
              score: {
                fontFamily: "微软雅黑",
                fontSize: 12,
                color: "#d6462c"
              }
            }
          },
          data: [{
            value: 0,
            label: {
              textStyle: {
                fontSize: 12
              }
            }
          }]
        }]
      },
      leakRateData: {
        grid: {
          left: "20px",
          bottom: "20px",
          top: "35px",
          right: "35px",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b}月<br/>漏损率:{c}%",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
              height: 30
            }
          }
        },
        xAxis: [{
        	name:"月",
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
        }],
        yAxis: {
        	name:"(%)",
          type: "value"
        },
        series: [{
          name: "漏损率",
          data: [
            //						90, 43, 91, 44, 49, 56, 78, 38, 55, 77, 52, 88
          ],
          type: "line",
          lineStyle: {
            opacity: 1,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: "#5666f4" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#5666f4" // 100% 处的颜色
              }
              ],
              globalCoord: false // 缺省为 false
            }
          },
          areaStyle: {
            opacity: 1,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: "#5666f4" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#5acef7" // 100% 处的颜色
              }
              ],
              globalCoord: false // 缺省为 false
            }
          }
        }]
      },
      toggle_showTable: true, //切换显示右侧报表
      topTips: {
        top: [{
          color: "#44cef6",
          name: "输水管线"
        }]
      },
      showLegend_flag: false, //显示图例
      leakAgeLayer: null
    };
  },
  methods: {
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
              container: "gisTwo",
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
              id: 'leakAge'
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

            that.view.on("click", function (event) {
              that.view.hitTest(event)
                .then(graphics => {
                  // console.log(graphics)
                  if (graphics.results && graphics.results[0].graphic && graphics.results[0].graphic.layer.id == 'leakAge'&&graphics.results[0].graphic.attributes.lev=='2') {
                    var areaId = graphics.results[0].graphic.attributes.leakInfo.areaId
                    that.go_subMap(areaId)
                  }
                });
            });
          }
        );
      if (this.areaId) {
        this.getLeakInfoData();
        this.getSubareaLeakListData();
      }
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
    },
    goback() {
      let that = this;
      this.$router.push({
        name: "pipe_leaktest_zoning_leakDetection"
      });
      this.$store.commit("setAside_status", true);
      this.$emit("showAside");
    },
    go_subMap(id) {
      // this.sun_areaId = this.childZoneList[0].areaId;
      this.$router.push({
        name: "pipe_leaktest_lastZoning_map",
        query: {
          areaId: id,
          companyId: this.companyId,
          companyName:this.companyName
        }
      });
    },
    toggleShow_() {
      this.toggle_showTable = !this.toggle_showTable;
    },
    gotoDetail(v) {
      let that = this;
      this.$router.push({
        name: "pipe_leaktest_secend_detail",
        query: {
          areaId: v.areaId,
          companyId: this.companyId,
          zone_name: v.name
        }
      });
    },
    closeLegend(flag) {
      this.showLegend_flag = true;
    },
    getLeakInfoData() {
      let that = this;
      getLeakInfo({
        "areaId": "" + that.areaId,
        "yearNum": "" + that.yearItem
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
          that.leakRateData.series[0].data = [];
          that.lastLeak = res.data.lastLeak ? res.data.lastLeak : "";
          that.overhualRate.series[0].data[0].value = res.data.leakRate ? res.data.leakRate : 0;
          if (res.data.leakList.length > 0) {
            res.data.leakList.map(item => {
              that.leakRateData.series[0].data.push(item.rate);
            })
          }
        } else {
          that.lastLeak = "";
          that.overhualRate.series[0].data.value = 0;
          that.leakStatistic.series[0].data = [];
        }

      }).catch(error => {
        console.log(error)
      })
    },
    //画分区
    markProject(coord) {
      this.LoadSurface({
        polygonInfo: coord.leakInfo.zone,
        attributes: {
          leakInfo: coord.leakInfo,
          lev: coord.lev
        }
      })
    },
    //分区标签
    markLable(coord) {
      if (coord.zone) {
        this.LoadLeakLabel({
          polygonInfo: coord.zone,
          attributes: coord
        })
      }
    },
    getSubareaLeakListData() {
      let that = this;
      getSubareaLeakList({
        "areaId": "" + that.areaId,
        "yearNum": "" + that.thisYear,
        "monthNum": "" + that.thisMonth
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
          that.childZoneList = res.data.children.length > 0 ? res.data.children : [];
          that.parentName = res.data.name ? res.data.name : "";
          var fatherObj = {
            leakInfo: res.data,
            lev: '1'
          }
          that.markProject(fatherObj)
          if (that.childZoneList.length > 0) {
            that.childZoneList.forEach(item => {
              var obj = {
                leakInfo: item,
                lev: '2'
              }
              that.markProject(obj)
              that.markLable(item)
            })
          }
        } else {
          that.childZoneList = []
        }

      }).catch(error => {
        console.log(error)
      })
    },
    selectYear(val) {
      this.yearItem = val;
      this.getLeakInfoData();
    },
    colseModel() {
      this.showModelFlag = false;
    },
    openZoneModel(v) {
      this.showModelFlag = true;
      this.title = v.name;
      this.zoneDetailsId = v.areaId;
      this.getAreaInfoData();

    },
    getAreaInfoData() {
      let that = this;
      getAreaInfo({
        "id": "" + that.zoneDetailsId
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
          that.thisZone = res.data ? res.data : "";

        } else {
          that.thisZone = "";
          that.$message.error(res.msg + "!")
        }

      }).catch(error => {
        console.log(error)
      })
    }
  },
  mounted() {
    this.createMap();
  },
  created() {
    let that = this;
    let nowTime = new Date();
    let year = nowTime.getFullYear();
    let month = nowTime.getMonth();
    this.map = null;
    this.view = null;
    if (month == "0") {
      this.thisYear = year - 1;
      this.thisMonth = 12;
    } else {
      this.thisYear = year;
      this.thisMonth = month;
    }
    this.yearItem = year + "";
    this.areaId = this.$route.query.areaId;
    this.companyId = this.$route.query.companyId;
    this.companyName = this.$route.query.companyName;
  },
  beforeDestroy() {
    let that = this;
    if (that.distance && that.area) {
      that.distance.clear();
      that.area.clear();

    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/resetCSS/legend_mixin.scss";
#zoningMap {
  width: 100%;
  height: 100%;
  position: relative;
  font-size: 14px;
  color: #333;
  & > .top {
    width: 100%;
    background: #ebebeb;
    // position: absolute;
    // top: 0;
    // left: 0;
    text-align: center;
    span:first-child {
      line-height: 30px;
    }
    span.goBack {
      position: absolute;
      right: 20px;
      top: 4px;
      display: inline-block;
      padding: 4px 10px;
      background: #fe8a01;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  #gisTwo {
    width: 100%;
    height: calc(100% - 30px);
    position: relative;
    .demo {
      position: absolute;
      top: 50%;
      left: 50%;
      background: #fff;
      padding: 20px;
      cursor: pointer;
    }
  }
  .gisTools {
    width: 180px;
    height: 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 40px;
    right: 20px;
    border-radius: 5px;
    background: #fff;
  }
  .rightTable {
    height: calc(100% - 100px);
    position: absolute;
    top: 80px;
    right: 20px;
    background: #fff;
    border-radius: 5px;
    .toggoleBar {
      width: 30px;
      height: 88px;
      position: absolute;
      top: 50%;
      left: -30px;
      margin-top: -44px;
      text-align: center;
      border: 1px solid #ccc;
      background: #fff;
      i {
        line-height: 88px;
        cursor: pointer;
      }
    }
    .contentTable {
      width: 500px;
      height: 100%;
      overflow-y: auto;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
      border-radius: 5px;
      padding: 10px;
      .row:first-child {
        width: 100%;
        height: 30px;
        span {
          line-height: 30px;
        }
      }
      .row:nth-child(2) {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 120px;
        padding-bottom: 5px;
        border-bottom: 1px solid #ccc;
        .col {
          width: 50%;
          height: 100%;
          &:first-child {
            background: #6194cb;
            color: #fff;
            padding: 10px;
            .topTip {
              span {
                line-height: 30px;
              }
            }
            .Num {
              padding: 20px;
              text-align: center;
              .number {
                font-size: 30px;
                font-weight: 600;
              }
            }
          }
          &:last-child {
            display: flex;
            justify-content: space-between;
            div.left {
              width: 100px;
              padding: 10px;
              .top {
                font-size: 16px;
                line-height: 26px;
              }
              div {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 10px;
                span.rect {
                  display: inline-block;
                  width: 14px;
                  height: 14px;
                  border-radius: 5px;
                  margin-right: 5px;
                  &.top1 {
                    background: #ef0000;
                  }
                  &.top2 {
                    background: #f3b708;
                  }
                  &.top3 {
                    background: #278728;
                  }
                }
              }
            }
            div.right {
              width: calc(100% - 100px);
            }
          }
        }
      }
      .lineChart {
        .tophead {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 30px;
          span {
            line-height: 30px;
            &.rect {
              display: inline-block;
              width: 14px;
              height: 14px;
              background: #2db8bd;
              margin-right: 5px;
            }
          }
        }
        .lineChart {
          width: 100%;
          height: 250px;
          .top {
            height: 30px;
          }
          .line_chart {
            width: 100%;
            height: calc(100% - 30px);
          }
        }
      }
      .subTable {
        width: 100%;
        /*height: calc(100% - 435px);*/
        /*overflow-y: auto;*/
        table {
          border-spacing: 0;
          width: 100%;
          border: 1px solid #ccc;
          thead,
          tbody {
            width: 100%;
          }
          thead {
            tr {
              th {
                text-align: center;
                line-height: 25px;
                /*border-right: 1px solid #ccc;*/
                border-bottom: 1px solid #ccc;
                background: #e3edee;
                &:last-child {
                  border-right: none;
                }
                &:nth-child(2) {
                  width: 80px;
                }
                &:nth-child(3) {
                  width: 80px;
                }
                &:nth-child(4) {
                  width: 80px;
                }
              }
            }
          }
          tbody {
            tr {
              td {
              	.red,.orange,.yellow,.green{
              		width: 80%;
              		margin-bottom: 2px;
              		color: #fff;
              	}
              	.red{
              		background: #fa2805;
              	}
              	.orange{
              		background: #f3bb04;
              	}
              	.yellow{
              		background: #ece415;
              	}
              	.green{
              		background: #268726;
              	}
                &:first-child {
                  span {
                    text-decoration: underline;
                    color: #0b82ff;
                    cursor: pointer;
                  }
                }
                &:last-child {
                  span {
                    border: 1px solid #0b82ff;
                    border-radius: 5px;
                    height: 25px;
                    line-height: 25px;
                    padding: 0 5px;
                    color: #0b82ff;
                    cursor: pointer;
                  }
                }
                text-align: center;
                line-height: 25px;
                /*border-right: 1px solid #ccc;*/
                border-bottom: 1px solid #ccc;
                &:last-child {
                  border-right: none;
                }
                &:nth-child(2) {
                  width: 80px;
                }
                &:nth-child(3) {
                  width: 80px;
                }
                &:nth-child(4) {
                  width: 80px;
                }
              }
              &:last-child {
                td {
                  border-bottom: none;
                }
              }
            }
          }
        }
      }
      .pagination {
        width: 100%;
        padding-top: 10px;
        display: flex;
        justify-content: center;
      }
    }
  }
  @include legend;
  .zoneInfo {
    width: calc(100% - 20px);
    margin: 10px;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    .row {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      .col {
        width: 150px;
        border-right: 1px solid #c9c9c9;
        border-bottom: 1px solid #c9c9c9;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          &.pipeInfo {
            text-align: start;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
            height: 100%;
            text-align: center;
            line-height: 40px;
          }
        }
        input {
          width: 100%;
          height: 100%;
          text-align: center;
          border: none;
          &.textRed {
            color: red;
          }
        }

        &:last-child {
          border-right: none;
        }
        &:nth-child(even) {
          width: calc(50% - 150px);
        }
        &:nth-child(odd) {
          background: #d6fafa;
          font-weight: 600;
          text-align: center;
        }
        &.noborder {
          border-bottom: none;
        }
        .doc {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>