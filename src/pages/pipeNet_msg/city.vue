<template>
  <div id="home" :class="{small:small}">
    <div class="top-action" :class="{small:small}">
      <el-select v-model="currentYear" @change="showData($event)">
        <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="content" :class="{small:small}">
      <div class="left-chart">
        <div class="chart-item nopadding" :class="{small:small}">
          <div class="row">
            <div class="col">
              <span>{{leftChart.pipeLong.pipeLen}}</span>
              <span>管网总长(km)</span>
            </div>
            <div class="logo">
              <i class="iconfont icon-yonghu"></i>
            </div>
          </div>
          <div class="row color1">
            <div class="col">
              <span>{{leftChart.pipeLong.pipeLengthEGap}}</span>
              <template v-if="leftChart.pipeLong.pipeLengthEGap>0">
                <span>增加管长(Km)</span>
              </template>
              <template v-else>
                <span>减少管长(Km)</span>
              </template>
            </div>
            <div class="logo">
              <template v-if="leftChart.pipeLong.pipeLengthEGap>0">
                <i class="iconfont icon-fuwurenshujia"></i>
              </template>
              <template v-else>
                <i class="iconfont icon-fuwurenshujian"></i>
              </template>
            </div>
          </div>
        </div>
        <div class="chart-item">
          <div class="card-top">
            <div class="card-left">
              <div class="str">检修井数</div>
              <div
                class="num"
                :class="{small:leftChart.small}"
              >{{leftChart.pipeDeviceInfo.overhaulWellCount}}个</div>
            </div>
            <div class="card-right">
              <el-progress
                type="circle"
                :stroke-width="3"
                :width="leftChart.circleWidth"
                :percentage="leftChart.pipeDeviceInfo.overhaulWellCountLast"
                color="#fe6d3a"
              ></el-progress>
            </div>
          </div>
          <div class="card-content">
            <div class="left-logo">
              <img
                src="../../assets/images/pipeNet_manage/home/home_monitor.png"
                alt
                :class="{small:leftChart.small}"
              >
            </div>
            <div class="chart">
              <IEcharts
                :option="leftChart.pipeDeviceNum.bar"
                :loading="leftChart.pipeDeviceNum.loading"
                :resizable="true"
              />
            </div>
          </div>
        </div>
        <div class="chart-item">
          <div class="card-top">
            <div class="card-left">
              <div class="str">事故数</div>
              <div
                class="num"
                :class="{small:leftChart.small}"
              >{{leftChart.problemCount.checkProblemCount}}件</div>
            </div>
            <div class="card-right">
              <el-progress
                type="circle"
                :stroke-width="3"
                :width="leftChart.circleWidth"
                :percentage="leftChart.problemCount.checkProblemCountLast"
                color="#fe6d3a"
              ></el-progress>
            </div>
          </div>
          <div class="card-content">
            <div class="left-logo">
              <img
                src="../../assets/images/pipeNet_manage/home/home_analysis.png"
                alt
                :class="{small:leftChart.small}"
              >
            </div>
            <div class="chart">
              <IEcharts
                :option="leftChart.problemNum.bar"
                :loading="leftChart.problemNum.loading"
                :resizable="true"
              />
            </div>
          </div>
        </div>
        <div class="chart-item">
          <div class="card-top">
            <div class="card-left">
              <div class="str">巡检数</div>
              <div
                class="num"
                :class="{small:leftChart.small}"
              >{{leftChart.recordCount.checkRecordCount}}次</div>
            </div>
            <div class="card-right">
              <el-progress
                type="circle"
                :stroke-width="3"
                :width="leftChart.circleWidth"
                :percentage="leftChart.recordCount.checkRecordCountLast"
                color="#fe6d3a"
              ></el-progress>
            </div>
          </div>
          <div class="card-content">
            <div class="left-logo">
              <img
                src="../../assets/images/pipeNet_manage/home/home_analysis.png"
                alt
                :class="{small:leftChart.small}"
              >
            </div>
            <div class="chart">
              <IEcharts
                :option="leftChart.routingNum.bar"
                :loading="leftChart.routingNum.loading"
                :resizable="true"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="map" id="gis"></div>
      <div class="right-chart">
        <div class="chart-item">
          <div class="card-top">
            <div class="card-left">
              <div class="str">漏损率</div>
              <!-- <div class="num" :class="{small:leftChart.small}">20</div> -->
              <div
                class="num"
                :class="{small:leftChart.small}"
              >{{right.leakageYearData.pipeLeakageNow}}%</div>
            </div>
            <div class="card-right">
              <el-progress
                type="circle"
                :stroke-width="3"
                :width="leftChart.circleWidth"
                :percentage="right.leakageYearData.pipeLeakageGap"
                color="#fe6d3a"
              ></el-progress>
            </div>
          </div>
          <div class="card-content">
            <div class="left-logo">
              <img
                src="../../assets/images/pipeNet_manage/home/home_analysis.png"
                alt
                :class="{small:leftChart.small}"
              >
            </div>
            <div class="chart">
              <IEcharts
                :option="right.leakageList.bar"
                :loading="right.leakageList.loading"
                :resizable="true"
              />
            </div>
          </div>
        </div>
        <div class="chart-item">
          <div class="card-top">
            <div class="card-left">
              <div class="str">产销差率</div>
              <div
                class="num"
                :class="{small:leftChart.small}"
              >{{right.productivityYearData.productivityYearNow}}%</div>
            </div>
            <div class="card-right">
              <el-progress
                type="circle"
                :stroke-width="3"
                :width="leftChart.circleWidth"
                :percentage="right.productivityYearData.v"
                color="#fe6d3a"
              ></el-progress>
            </div>
          </div>
          <div class="card-content">
            <div class="left-logo">
              <img
                src="../../assets/images/pipeNet_manage/home/home_analysis.png"
                alt
                :class="{small:leftChart.small}"
              >
            </div>
            <div class="chart">
              <IEcharts
                :option="right.product_sailList.bar"
                :loading="right.product_sailList.loading"
                :resizable="true"
              />
            </div>
          </div>
        </div>
        <div class="chart-item">
          <div class="top-border">
            <span class="rect"></span>
            <span class="headTop">昨日{{compyName}}供水情况</span>
          </div>
          <div class="processes">
            <!-- <div class="progressItem">
              <el-progress
                type="circle"
                :stroke-width="3"
                :width="leftChart.circleWidth"
                :percentage="right.productSaleResultRate.PRODUCTIVITYONE"
                color="#fe6d3a"
              ></el-progress>
              <div class="str">
                <span>产销差率</span>
              </div>
            </div> -->
            <div class="progressItem">
              <el-progress
                type="circle"
                :stroke-width="3"
                :width="leftChart.circleWidth"
                :percentage="right.passRate.PASSRATE"
                color="#fe6d3a"
              ></el-progress>
              <div class="str">
                <span>水质合格率</span>
              </div>
            </div>
            <div class="progressItem">
              <el-progress
                type="circle"
                :stroke-width="3"
                :width="leftChart.circleWidth"
                :percentage="right.pressurePassRate.PASSNUM"
                color="#fe6d3a"
              ></el-progress>
              <div class="str">
                <span>压力合格率</span>
              </div>
            </div>
          </div>
          <div class="littleCards">
            <div class="cardItem">
              <div class="row">
                <span class="bigNum">{{right.avgPressure.AVGNUM}}</span>
                <span class="small">Mpa</span>
              </div>
              <div class="row">
                <span>管网平均压力</span>
              </div>
            </div>
            <div class="cardItem">
              <div class="row">
                <span class="bigNum">{{right.waterTotalYesterday.TOTALNUM}}</span>
                <span class="small">万m³</span>
              </div>
              <div class="row">
                <span>昨日供水总量</span>
              </div>
            </div>
          </div>
        </div>
        <div class="chart-item small">
          <div class="top-border">
            <div class="col">
              <span class="rect"></span>
              <span class="title" :title="right.showOneNew.title">{{right.showOneNew.title}}</span>
            </div>
            <div class="col">
              <span>{{right.showOneNew.publishTime}}</span>
            </div>
          </div>
          <div class="subContent">
            <div class="newItem">
              <div class="content">
                <span v-html="right.showOneNew.content"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as esriLoader from "esri-loader";
// esriLoader.loadCss(dse.arcgis_themeCss);
esriLoader.loadCss(dse.arcgis_mainCss);
import IEcharts from "vue-echarts-v3/src/full.js";
// let pipeUrl = dse.arcgis_belowMap;

let startJs = dse.arcgis_startJS;

let areaUrl = dse.ningxia_layer;
const options = {
  url: startJs,
  dojoConfig: dse.gisConfig
};
// 二维管网相关.
import popupUtils from "@/common/utils/popupUtils";
//管网图层配置
import gw2dConfig from "@/common/config/gis2d/gw2dConfig";

// // 消防栓配置
// import xfs2dConfig from "@/common/config/gis2d/xfs2dConfig";

// // 阀门配置
// import fm2dConfig from "@/common/config/gis2d/fm2dConfig";

// //天然气配置
// import gas2dConfig from "@/common/config/gis2d/gas2dConfig";
// //电线配置
// import dx2dConfig from "@/common/config/gis2d/dx2dConfig";

import layerUtils from "@/common/utils/layerUtils";
import { getCityHomeInfo, getPipeCommmonInfo } from "@/api/pipeNet_msg/home";
export default {
  name: "Home",
  components: {
    IEcharts
  },
  data() {
    return {
      view: null,
      map: null,
      layer1: null, //管网图层
      drawTools: null,
      distance: null,
      area: null,
      small: false,
      firstLongin: 1,
      activePlaces: [],
      active: true,
      showYears: false,
      showMonth: false,
      currentYear: "",
      companyId: "", //公司ID
      leftChart: {
        circleWidth: "",
        small: "",

        pipeLong: {
          pipeLen: 0,
          pipeLengthEGap: 0
        },
        problemCount: {
          checkProblemCount: 0,
          checkProblemCountLast: 0,
          checkProblemCountLastByYear: []
        },
        pipeDeviceInfo: {
          overhaulWellCount: 0,
          overhaulWellCountLast: 0,
          overhaulWellCountLastByYear: []
        },
        recordCount: {
          checkRecordCountLast: 0,
          checkRecordCount: 0,
          checkRecordCountLastByYear: []
        },
        pipeDeviceNum: {
          loading: false,
          circlePercent: 0,
          number: "",
          bar: {
            tooltip: {},
            grid: {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            },
            xAxis: {
              show: false,
              data: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
              ]
            },
            yAxis: {
              show: false
            },
            color: "#1cbbdf",
            series: [
              {
                name: "检修井数",
                type: "bar",
                data: []
              }
            ]
          }
        },
        problemNum: {
          loading: false,
          circlePercent: 0,
          number: "",
          bar: {
            tooltip: {},
            grid: {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            },
            xAxis: {
              show: false,
              data: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
              ]
            },
            yAxis: {
              show: false
            },
            color: "#1cbbdf",
            series: [
              {
                name: "事故数",
                type: "bar",
                data: []
              }
            ]
          }
        },
        routingNum: {
          loading: false,
          circlePercent: 0,
          number: "",
          bar: {
            tooltip: {},
            grid: {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            },
            xAxis: {
              show: false,
              data: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
              ]
            },
            yAxis: {
              show: false
            },
            color: "#1cbbdf",
            series: [
              {
                name: "巡检数",
                type: "bar",
                data: []
              }
            ]
          }
        }
      },
      map: {},
      right: {
        leakageYearData: {
          pipeLeakageGap: 0,
          pipeLeakageNow: 0
        },
        leakageMouthData: [],
        productivityYearData: {
          productivityYearGap: 0,
          productivityYearNow: 0
        },
        productivityMouthData: [],
        pressurePassRate: {
          PASSNUM: 0
        },
        passRate: {
          PASSRATE: 0
        },
        productSaleResultRate: {
          PRODUCTIVITYONE: 0
        },
        avgPressure: {
          AVGNUM: ""
        },
        waterTotalYesterday: {
          TOTALNUM: 0
        },

        leakageList: {
          loading: false,
          circlePercent: 0,
          number: "",
          bar: {
            tooltip: {},
            grid: {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            },
            xAxis: {
              show: false,
              data: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
              ]
            },
            yAxis: {
              show: false
            },
            color: "#1cbbdf",
            series: [
              {
                name: "漏损率",
                type: "bar",
                data: []
              }
            ]
          }
        },
        product_sailList: {
          loading: false,
          circlePercent: 0,
          number: "",
          bar: {
            tooltip: {},
            grid: {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            },
            xAxis: {
              show: false,
              data: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
              ]
            },
            yAxis: {
              show: false
            },
            color: "#1cbbdf",
            series: [
              {
                name: "产销差率",
                type: "bar",
                data: []
              }
            ]
          }
        },
        news: [], // 新闻列表
        showOneNew: {
          id: "",
          publishTime: "",
          title: "",
          validTime: 7,
          content: "",
          deptCode: "",
          deptName: ""
        }, //展示一条新闻
        timer: null, // 定时切换新闻的定时器
        compyName: "" //公司名字
      },
      areaLayer: null //行政区划
    };
  },
  methods: {
    createMap(focusPosition) {
      // console.log(focusPosition);
      let that = this;
      esriLoader
        .loadModules(
          [
            "esri/Map",
            "esri/views/MapView",
            "esri/tasks/QueryTask",
            "esri/tasks/support/Query",
            "esri/layers/GraphicsLayer",
            "esri/layers/FeatureLayer",
            "dse/utils/BaseMapUtils",
            "dojo/domReady!"
          ],
          options
        )
        .then(
          ([
            Map,
            MapView,
            QueryTask,
            Query,
            GraphicsLayer,
            FeatureLayer,
            BaseMapUtils
          ]) => {
            layerUtils.bindAmdClass(QueryTask, Query, GraphicsLayer);
            // Create the map
            that.map = new Map({
              // basemap: "satellite"
            });
            let baseMapUtils = new BaseMapUtils({
              map: that.map,
              mapType: "2"
            });

            //debugger;
            baseMapUtils.loadBaseLayers(dse.baseMapLayers);
            that._changeBaseLayer("gvec");

            that.areaLayer = new FeatureLayer({
              url: "" + areaUrl,
              renderer: {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                  type: "simple-fill", // autocasts as new SimpleMarkerSymbol()
                  style: "solid",
                  color: [0, 0, 0, 0.1],
                  outline: {
                    color: "#FF8C00",
                    whith: "1px"
                  }
                }
              }
            });

            that.map.add(that.areaLayer);

            // 管网图层.
            let companyId = that.$store.getters.get_companyId
            let pipeUrl = that.$store.getters.get_pipe_defaultLayer
            gw2dConfig.url = pipeUrl;
            gw2dConfig.popupTemplate.visible = false;
            that.layer1 = layerUtils.loadData(that.map, gw2dConfig,companyId);
            //===================================================
            that.view = new MapView({
              container: "gis",
              map: that.map,
              zoom: 15,
              center: focusPosition
            });
          }
        );
    },
    //是否是底图
    _isBaseLayer(layerId) {
      //
      let items = dse.baseMapLayers.filter(function(layer) {
        //
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
    selectYear() {
      this.active = true;
    },
    selectMonth() {
      this.active = false;
    },
    //是否是底图
    _isBaseLayer(layerId) {
      let items = dse.baseMapLayers.filter(function(layer) {
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
    getThisYear(val) {
      this.currentYear = val;
      this.showYears = !this.showYears;
    },
    getThisMonth(val) {
      this.currentMonth = val;
      this.showMonth = !this.showMonth;
    },
    showyears() {
      this.showYears = !this.showYears;
    },
    showMonthes() {
      this.showMonth = !this.showMonth;
    },
    doLoading() {
      const that = this;
      let data = [];
      //传递数据
      for (let i = 0, min = 5, max = 99; i < 6; i++) {
        data.push(Math.floor(Math.random() * (max + 1 - min) + min));
      }
      that.leftChart.peopleNum.loading = !that.leftChart.peopleNum.loading;
      that.leftChart.peopleNum.bar.series[0].data = data;
    },
    onReady(ins) {},
    onResize(width, height) {},
    onClick(event, instance, echarts) {},
    resetTypes(arr) {
      let temp_arr = arr;
      for (let i = 0; i < temp_arr.length; i++) {
        temp_arr[i].active = false;
      }
      return temp_arr;
    },
    typePie_onClick(event, instance, echarts) {
      let typeName = event.name;
      let temp_arr = this.right.turbeType.types;
      this.right.turbeType.types = this.resetTypes(temp_arr);
      temp_arr = this.right.turbeType.types;
      for (let i = 0; i < temp_arr.length; i++) {
        if (temp_arr[i].name == typeName) {
          temp_arr[i].active = true;
          break;
        }
      }
      this.right.turbeType.types = temp_arr;
    },
    D_Pie_onClick(event, instance, echarts) {
      let typeName = event.name;
      let temp_arr = this.right.turbeDiameter.types;
      this.right.turbeDiameter.types = this.resetTypes(temp_arr);
      temp_arr = this.right.turbeDiameter.types;
      for (let i = 0; i < temp_arr.length; i++) {
        if (temp_arr[i].name == typeName) {
          temp_arr[i].active = true;
          break;
        }
      }
      this.right.turbeDiameter.types = temp_arr;
    },
    getScale(total, part, realScale) {
      return {
        name: part.name,
        status: part.status,
        tubeLong: part.tubeLong,
        left:
          parseInt(
            ((part.x - 104.154408011) / total.temp_D_x) *
              parseFloat(realScale.temp_width)
          ) -
          0.015 * parseInt(realScale.temp_width),
        top:
          parseInt(
            ((39.392326951 - part.y) / total.temp_D_y) *
              parseFloat(realScale.temp_height)
          ) -
          0.04 * parseInt(realScale.temp_height)
      };
    },
    gotoMsg(index) {
      this.$router.push({
        name: "pipeNet_msg"
      });
      this.$emit("thisTab", "2");
    },
    showData(val) {
      this.currentYear = val;

      this.getCityHomeInfo_(val);
    },
    getdata() {
      let that = this;
    },

    getCityHomeInfo_(years) {
      let that = this;
      let temp_companyID = this.$route.params.id;
      getCityHomeInfo({
        years: "" + years,
        companyId: "" + temp_companyID
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
          let {
            pipeLengthData,
            problemCount,
            pipeDeviceInfo,
            recordCount,
            leakageYearData,
            leakageMouthData,
            productivityYearData,
            pressurePassRate,
            passRate,
            productSaleResultRate,
            avgPressure,
            waterTotalYesterday,
            productivityMouthData,
            yearLeakAndPmrData
          } = res.data;
          // 官网长度
          that.leftChart.pipeLong.pipeLen = pipeLengthData.pipeLength || 0;
          that.leftChart.pipeLong.pipeLengthEGap =
            pipeLengthData.pipeLengtheGap || 0;
          sessionStorage.setItem("pipeLong", that.leftChart.pipeLong.pipeLen);
          // 事故数量
          that.leftChart.problemCount.checkProblemCount =
            problemCount.checkProblemCount || 0;
          that.leftChart.problemCount.checkProblemCountLast =
            parseFloat(problemCount.checkProblemCountLast) || 0;
          that.leftChart.problemCount.checkProblemCountLastByYear =
            problemCount.checkProblemCountLastByYear || [];
          let temp_problems_arr =
            that.leftChart.problemCount.checkProblemCountLastByYear;
          let temp_arr_problems =[];

          temp_arr_problems =(problemCount.checkProblemCountLastByYear).length>0&& problemCount.checkProblemCountLastByYear[0].data ?problemCount.checkProblemCountLastByYear[0].data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

          that.leftChart.problemNum.bar.series[0].data = temp_arr_problems;
          //检修井
          that.leftChart.pipeDeviceInfo.overhaulWellCount =  pipeDeviceInfo.overhaulWellCount || 0;
          that.leftChart.pipeDeviceInfo.overhaulWellCountLast =  parseFloat(pipeDeviceInfo.overhaulWellCountLast) || 0;
          that.leftChart.pipeDeviceInfo.overhaulWellCountLastByYear =  pipeDeviceInfo.overhaulWellCountLastByYear || [];

          let temp_device_arr = that.leftChart.pipeDeviceInfo.overhaulWellCountLastByYear;
          let temp_arr_devices = [];
          temp_arr_devices =(pipeDeviceInfo.overhaulWellCountLastByYear).length>0&& pipeDeviceInfo.overhaulWellCountLastByYear[0].data?pipeDeviceInfo.overhaulWellCountLastByYear[0].data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          that.leftChart.pipeDeviceNum.bar.series[0].data = temp_arr_devices;

          //巡检次数
          that.leftChart.recordCount.checkRecordCountLast = parseFloat(recordCount.checkRecordCountLast) || 0;
          that.leftChart.recordCount.checkRecordCount =recordCount.checkRecordCount || 0;
          that.leftChart.recordCount.checkRecordCountLastByYear =[];
          let temp_arr_recordCount = [];

          temp_arr_recordCount = (recordCount.checkRecordCountLastByYear).length>0&&recordCount.checkRecordCountLastByYear[0].data?recordCount.checkRecordCountLastByYear[0].data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          that.leftChart.routingNum.bar.series[0].data = temp_arr_recordCount;

          //漏损检查
          that.right.leakageYearData.pipeLeakageNow = yearLeakAndPmrData.curLeakRate?yearLeakAndPmrData.curLeakRate:0;
          that.right.leakageYearData.pipeLeakageGap = yearLeakAndPmrData.sameTimeLeakRate
          let temp_arr_leakageMouthData_arr = [];
          temp_arr_leakageMouthData_arr = leakageMouthData.length>0&&leakageMouthData[0].data?leakageMouthData[0].data: [0,0,0,0,0,0,0,0,0,0,0,0];
          that.right.leakageList.bar.series[0].data = temp_arr_leakageMouthData_arr;
          
          // 产销差率

          that.right.productivityYearData.productivityYearNow = yearLeakAndPmrData.curPmr;
          that.right.productivityYearData.v =yearLeakAndPmrData.sameTimePmr;
          let temp_arr_productivityMouthData =[];
          temp_arr_productivityMouthData =productivityMouthData.length>0&& productivityMouthData[0].data? productivityMouthData[0].data: [0,0,0,0,0,0,0,0,0,0,0,0]
          that.right.product_sailList.bar.series[0].data = temp_arr_productivityMouthData;

          // 昨日压力合格率
          that.right.pressurePassRate.PASSNUM = parseFloat(pressurePassRate.PASSNUM) || 0;
          //昨日水质
          that.right.passRate.PASSRATE = parseFloat(passRate.PASSRATE) || 0;
          // 昨日产销差率
          that.right.productSaleResultRate.PRODUCTIVITYONE = parseFloat(productSaleResultRate.PRODUCTIVITYONE) || 0;

          that.right.avgPressure.AVGNUM = avgPressure.AVGNUM || "";
          that.right.waterTotalYesterday.TOTALNUM = waterTotalYesterday.TOTALNUM || 0;
        })
        .catch(function(error) {
         console.log(error);
        });
    },
    getPipeCommmonInfo_(params) {
      let that = this;
      getPipeCommmonInfo({
        years: "",
        companyId: ""
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
          that.right.news = res.data || [];
          if (res.data && res.data.length) {
            let temp_arr = res.data;
            that.right.showOneNew = temp_arr[0];
            let len = temp_arr.length - 1;
            let index = 0;
            that.timer = setInterval(() => {
              index++;
              if (index > len) {
                index = 0;
              }
              that.right.showOneNew = temp_arr[index];
            }, 3 * 1000);
          }
        })
        .catch(function(error) {
          // if (error == "Error: Network Error") {
          //     that.$message.error("网络错误");
          //     return;
          // }
          // that.$message.error("逻辑错误!");
        });
    }
  },
  computed: {
    years() {
      let temp_time = new Date();
      let temp_years = [];
      let temp_year = parseInt(temp_time.getFullYear());
      let D_value = temp_year - 1970;
      for (let i = temp_year; i >= 1970; i--) {
        temp_years.push({
          value: i,
          label: i
        });
      }
      return temp_years;
    }
  },
  mounted() {

    //  得到 当前的 经纬度数据
    let  potions = this.$store.getters.get_cityPosition
    if(potions.length===0){
        potions = [106.290351, 36.001819]
    }
    this.createMap(potions);
    dse.compyID = this.$store.getters.get_companyId;
    dse.userName = this.$store.getters.getUserName;
    dse.compyName = this.$store.getters.getCompyName;
  },
  created() {
    let temp_time = new Date().getFullYear();
    this.currentYear = temp_time;
    let sys_width = document.body.clientWidth;
    if (sys_width < 1600) {
      this.small = true;
      this.leftChart.circleWidth = 40;
      this.leftChart.small = true;
    } else {
      this.small = false;
      this.leftChart.circleWidth = 50;
      this.leftChart.small = false;
    }

    this.getCityHomeInfo_(temp_time);
    this.getPipeCommmonInfo_();

    this.compyName = this.$store.getters.getCompyName;
  },
  beforeDestroy() {
    let that = this;
    clearInterval(that.timer);
  }
};
</script>

<style lang="scss" scoped>
$base-font: 16px;

* {
  box-sizing: border-box;
}

#home {
  width: 100%;
  height: 100%;
  font-size: $base-font; // padding-top: 43px;
  font-size: 14px;
  color: #333;

  &.small {
    font-size: 12px;
  }

  .top-action {
    // width: 100%;
    padding: 0 20px;
    height: 40px;
    position: absolute;
    top: 0;
    left: 0; // background: #d7d7d7;
    color: #333;
    font-size: 16px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #fff;
    z-index: 100;

    &.small {
      height: 40px;
      font-size: 12px;
      line-height: 40px;
    }

    span {
      display: inline-block;
      margin-right: 10px;
    }
  }

  .content {
    // padding: 0 20px;
    width: 100%;
    height: 100%;
    position: relative;

    &.small {
      height: 100%;
    }

    .left-chart,
    .right-chart {
      position: absolute;
      top: 40px;
      z-index: 10;
      width: 20%; // padding-top: 40px;
      height: calc(100% - 40px); // overflow-y: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      .chart-item {
        width: 100%;
        height: 22%;
        padding: 8px;
        background: #fff;
        margin-bottom: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border: 1px solid #afb6ba;

        &.nopadding {
          padding: 0;
        }

        .card-top {
          width: 100%;
          height: 60px;
          display: flex;
          justify-content: space-between;

          .card-left {
            width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: space-around; // align-items: center;

            .str {
              font-size: 12px; //   transform: scale(0.8);
              color: #676666;
            }

            .num {
              font-size: 20px;
              color: #333;
              font-weight: 600;

              &.small {
                font-size: 14px;
              }
            }
          }

          .card-right {
            width: 50%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
          }
        }

        .card-content {
          width: 100%;
          height: calc(100% - 60px);
          display: flex;
          justify-content: space-around;
          align-items: flex-end;

          .left-logo {
            width: 40px; //    height: 100%;

            img.small {
              width: 20px;
            }
          }

          .chart {
            width: calc(100% - 70px);
            height: 80%;
          }
        }

        .row {
          width: 100%;
          height: 50%;
          display: flex;
          justify-content: space-between;

          &.color1 {
            background: #fdefd2;
          }

          &.color2 {
            background: #fcd1db;
          }

          &.color3 {
            background: #bdeff6;
          }

          div {
            width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #676666;
            font-size: 14px;

            span {
              display: inline-block;
              line-height: 25px;

              &:first-child {
                color: #333;
                font-weight: 600;
                font-size: 20px;
              }
            }

            i {
              color: #4ea8f3;
              font-size: 30px;
            }
          }
        }

        &.small {
          .row {
            div {
              font-size: 12px;

              span {
                line-height: 18px;

                &:first-child {
                  font-size: 14px;
                }
              }
            }
          }
        }

        .top-border {
          padding-left: 10px;
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          border-bottom: 1px solid #ccc;

          .rect {
            display: inline-block;
            width: 14px;
            height: 14px;
            background: #2db8bd;
            margin-right: 20px;
          }

          .headTop {
            display: inline-block;
            width: calc(100% - 20px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .col {
            width: 50%;
            text-align: center;

            span.rect {
              display: inline-block;
              width: 14px;
              height: 14px;
              background: #2db8bd;
              margin-right: 10px;
            }

            span.title {
              display: inline-block;
              width: calc(100% - 30px);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        .processes {
          width: 100%;
          height: 50%;
          display: flex;
          justify-content: space-between;

          .progressItem {
            width: 33.33%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;

            .str {
              padding-top: 5px;
            }
          }
        }

        .littleCards {
          width: 100%;
          height: calc(50% - 30px);
          display: flex;
          justify-content: space-between;

          .cardItem {
            width: 48%;
            height: 100%;
            color: #fff;

            .row {
              width: 100%;
              display: flex;
              justify-content: center;
              text-align: center;
              align-items: center;

              .bigNum {
                font-size: 18px;
              }

              .small {
                transform: scale(0.6);
              }
            }

            &:first-child {
              background: rgb(53, 203, 209);
            }

            &:last-child {
              background: rgb(64, 147, 243);
            }
          }
        }

        .subContent {
          width: 100%;
          height: calc(100% - 30px);
          line-height: 16px;
          padding-top: 5px;
          word-break: break-all;
          word-wrap: break-word;
          overflow-y: auto;

          .newItem {
            padding: 10px; // border-bottom: 1px solid #ccc;
          }
        }
      }
    }

    .left-chart {
      left: 20px;
    }

    .right-chart {
      right: 20px;
    }

    .right-chart .chart-item {
      height: 20%;

      &:nth-child(3) {
        height: 30%;
      }

      &.small {
        height: 19%;
      }
    }

    .map {
      width: calc(100%);
      height: 100%; // padding: 10px 0;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
