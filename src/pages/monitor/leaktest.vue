<template>
  <div id="leaktest" :class="{frame_small:iframe_width_flag==true}">
    <div id="gis"></div>
    <div class="gistools">
      <gistools @handleThisDom="thisDom" @showLayers="toggleSelectThis" :defaultLayers="layers"></gistools>
    </div>
    <div class="aside-table">
      <div class="toggleBar" @click="toggleShow">
        <template v-if="tableShow">
          <i class="el-icon-arrow-right"></i>
        </template>
        <template v-else>
          <i class="el-icon-arrow-left"></i>
        </template>
      </div>
      <div class="inner_" v-if="tableShow">
        <div class="row">
          <div class="select-item">
            <span>选择对象:</span>
            <select-tree
              :waterWorksTree="tree"
              @showSelectLists="selectItem"
              :defaultCompony="initCompony"
            ></select-tree>
          </div>
          <div class="inner">
            <div class="col">
              <div class="select-item">
                <span>时间段:</span>
                <el-select v-model="search.startTimeType" placeholder="请选择" @change="getTime">
                  <el-option
                    v-for="item in timeTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="col">
              <el-button type="primary" @click="searchList" @keyup.enter="searchList">搜索</el-button>
            </div>
          </div>
          <div class="content">
            <div class="thead">
              <div class="col">
                <span>监测点名称</span>
              </div>
              <div class="col">
                <span>压差(Mpa)</span>
              </div>
              <div class="col">
                <span>采集时间</span>
              </div>
            </div>
            <div class="tbody" v-if="list.length>0">
              <div class="listItem" v-for="(item,index) in list" :key="index">
                <div class="col">
                  <span :title="item.name">{{item.name}}</span>
                </div>
                <div class="col">
                  <span>{{item.maxDp}}</span>
                </div>
                <div class="col">
                  <span>{{item.collectTime}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="pagenation">
            <pagenation
              :currentPage="paginate.currentPage"
              :noSmall="paginate.ifSmall"
              :totalPage="paginate.totalPage"
              @thisPage="gotoThisPage"
            ></pagenation>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getLeakageMutationList,
  getLeakageMapPoints
} from "@/api/monitor/leaktest";

import GetDate from "@/common/utils/getDate";

import Arcgis_mkt_jwd from "@/common/utils/arcgis_mkt_jwd";

import * as esriLoader from "esri-loader";
esriLoader.loadCss(dse.arcgis_mainCss);
let startJs = dse.arcgis_startJS;
const options = {
  url: startJs,
  dojoConfig: dse.gisConfig
};
let pipeUrl = dse.arcgis_belowMap;

let colse_viewPoupe = null;

// 二维管网相关.
import popupUtils from "@/common/utils/popupUtils";
//管网图层配置
import gw2dConfig from "@/common/config/gis2d/gw2dConfig";
import jxj2dConfig from "@/common/config/gis2d/jxj2dConfig";

import layerUtils from "@/common/utils/layerUtils";

import pagenation from "@/common/components/pagination";
import gistools from "@/common/components/gis_units/tools";
import selectTree from "@/common/components/selectWithTree";

let temp_staticPath = dse.static_baseUrl; //静态问价路径
let getLeakageMapPoints_ = null; // 获取位置点

import legendModel from "@/common/components/legend";
export default {
  components: {
    pagenation,
    gistools,
    selectTree,
    legendModel
  },
  data() {
    return {
      view: null,
      map: null,
      layer1: null, //管道图层
      errorPointLayer: null, //压差点的图层
      pointModel: null, // 点位的常驻窗口
      pointModel_title: "", //gis窗口的位点名字
      pointModel_value: "", //gis窗口的数据
      tableShow: true,
      tree: [], //水施数据
      searchName: "", // 查询的名字
      timeTypes: [
        {
          value: "0",
          label: "1小时以内"
        },
        {
          value: "1",
          label: "12小时以内"
        },
        {
          value: "2",
          label: "24小时以内"
        }
      ],
      timeStage: {
        startTime: "",
        endTime: ""
      }, //时间段
      search: {
        companyId: "",
        startTimeType: "0" //时间段选择
      },
      layers: [], //工具栏图层
      paginate: {
        //分页器
        ifSmall: true,
        totalPage: 1,
        currentPage: 1
      },
      list: [], //数据列表
      view: null, //arcgis的view
      map: null, //arcgis的map
      distance: null, //自定义量距
      area: null, //自定义画面
      iframe_width_flag: false, // 判断arcgis中的弹窗的宽度大小 如果是点击的弹窗则宽度为500，悬浮状态下的弹窗宽度为100，默认是500
      initCompony: "", // 初始化组织公司
      legend_show: false //是否关闭图例
    };
  },
  methods: {
    createMap(position) {
      let that = this;
      let temp_modelUrl = that.gisModel_iframe;
      esriLoader
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
            "esri/geometry/Point",
            "esri/geometry/support/webMercatorUtils",
            "esri/geometry/SpatialReference",
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
            BaseMapUtils,
            Point,
            webMercatorUtils,
            SpatialReference
          ]) => {
            layerUtils.bindAmdClass(QueryTask, Query, GraphicsLayer, Graphic);
            let sp4326 = new SpatialReference({
              wkid: 4326
            });
            that.map = new Map({
              // basemap: "satellite"
            });
            let baseMapUtils = new BaseMapUtils({
              map: that.map,
              mapType: "2"
            });

            //debugger;
            baseMapUtils.loadBaseLayers(dse.baseMapLayers);
            let temp_baseUrl = that.DSE.baseURL;

            let errorPoint_iframe_url =
              "" +
              temp_baseUrl +
              "/?id=" +
              id +
              "#/pipe/monitor/gisFrame_monitor_leaktest";
            let iframe_errorPoint =
              '<iframe src="' +
              errorPoint_iframe_url +
              '" height="500" width="500"  scrolling="no" frameborder="0"></iframe>';

            let errorPoint_pic =
              that.DSE.static_baseUrl + "/gis_temporary_pic/error_bigUser.png";
            let normal_pic =
              that.DSE.static_baseUrl + "/gis_temporary_pic/normal_bigUser.png";
            let temp_pic = null;

            let bg_model_error =
              that.DSE.static_baseUrl + "/gis_temporary_pic/error_gis.svg";
            let bg_model_normal =
              that.DSE.static_baseUrl + "/gis_temporary_pic/normal_gis.svg";
            let temp_bg_model = null;

            // 管网图层.
            let pipeUrl = that.$store.getters.get_pipe_defaultLayer;
            gw2dConfig.url = pipeUrl;
            gw2dConfig.popupTemplate.visible = false;
            that.layer1 = layerUtils.loadData(that.map, gw2dConfig);
            //===================================================
            that.view = new MapView({
              container: "gis",
              map: that.map,
              zoom: 15,
              center: position,
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

            that.errorPointLayer = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.errorPointLayer);

            that.pointModel = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.pointModel);

            that.pointModel_title = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.pointModel_title);

            that.pointModel_value = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.pointModel_value);

            getLeakageMapPoints_ = function() {
              let temp_companyID = that.search.companyId;
              if (that.errorPointLayer) {
                that.errorPointLayer.removeAll();
                that.pointModel.removeAll();
                that.pointModel_title.removeAll();
                that.pointModel_value.removeAll();
              }
              getLeakageMapPoints({
                companyId: "" + temp_companyID
              })
                .then(res => {
                  if (res.msg == "no user") {
                    window.location.href = `${
                      dse.base_api_url
                    }/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`;
                    return;
                  }
                  if (res.msg == "操作失败") {
                    that.$message.error("服务错误!");
                    return;
                  }
                  let { data } = res;
                  let flag = data && data.length;
                  if (flag) {
                    for (let i = 0; i < data.length; i++) {
                      if (data[i].lgtd !== null && data[i].lttd !== null) {
                        let temp_arr = [data[i].lgtd, data[i].lttd];
                        let formate_points = [];
                        let mp = new Point(temp_arr[0], temp_arr[1], sp4326);
                        mp = new webMercatorUtils.geographicToWebMercator(mp);
                        formate_points = [mp.x, mp.y];

                        let point = {
                          type: "point", // autocasts as /Point
                          x: formate_points[0],
                          y: formate_points[1],
                          spatialReference: that.view.spatialReference
                        };

                        // debugger

                        if (data[i].leakageRate < 1) {
                          temp_pic = normal_pic;
                          temp_bg_model = bg_model_normal;
                        } else {
                          temp_pic = errorPoint_pic;
                          temp_bg_model = bg_model_error;
                        }

                        let errorPoint = new Graphic({
                          geometry: point,
                          symbol: {
                            type: "picture-marker",
                            url: "" + temp_pic,
                            width: "47px",
                            height: "61px"
                          },
                          attributes: data[i],
                          popupTemplate: {
                            title: "" + data[i].name,
                            content: "" + iframe_errorPoint
                          }
                        });
                        that.errorPointLayer.add(errorPoint);

                        let str_len =
                          data[i].name.length > 6
                            ? data[i].name.length * 25
                            : 6 * 25;

                        let errorPoint_bg = new Graphic({
                          geometry: point,
                          symbol: {
                            type: "picture-marker",
                            url: "" + temp_bg_model,
                            width: "" + str_len + "px",
                            height: "66px",
                            yoffset: 0,
                            xoffset: str_len / 2
                          },
                          attributes: data[i],
                          popupTemplate: {
                            title: "" + data[i].name,
                            content: "" + iframe_errorPoint
                          }
                        });
                        that.pointModel.add(errorPoint_bg);
                        let point_titleText = new Graphic({
                          geometry: point,
                          symbol: {
                            type: "text",
                            color: "#333",
                            haloColor: "black",
                            haloSize: "1px",
                            font: {
                              size: 12,
                              weight: "bolder",
                              family: "weiruanyahei"
                            },
                            text: "" + data[i].name,
                            xoffset: str_len / 2,
                            yoffset: 5
                          },
                          attributes: data[i],
                          popupTemplate: {
                            title: "" + data[i].name,
                            content: "" + iframe_errorPoint
                          }
                        });
                        that.pointModel_title.add(point_titleText);
                        let point_valueText = new Graphic({
                          geometry: point,
                          symbol: {
                            type: "text",
                            color: "#333",
                            haloColor: "black",
                            haloSize: "1px",
                            font: {
                              size: 12,
                              weight: "bolder",
                              family: "weiruanyahei"
                            },
                            text: "" + data[i].dp,
                            xoffset: str_len / 2,
                            yoffset: -17
                          },
                          attributes: data[i],
                          popupTemplate: {
                            title: "" + data[i].name,
                            content: "" + iframe_errorPoint
                          }
                        });
                        that.pointModel_value.add(point_valueText);
                      }
                    }
                  }
                })
                .catch(function(error) {
                  console.log(error);
                });
            };

            getLeakageMapPoints_();

            //监听弹出框.
            that.view.popup.watch("selectedFeature", function(
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
                dse.this_ = that;
              }
            });
            //关闭弹出框时恢复高亮显示的管线.
            that.view.popup.watch("visible", function(
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
    },
    toggleShow() {
      this.tableShow = !this.tableShow;
    },
    selectItem(val) {
      this.search.companyId = val.id;
      getLeakageMapPoints_();
    },
    gotoThisPage(index) {
      this.currentPage = index;
      this.getLeakageMutationList_(index);
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
    toggleSelectThis(val) {
      let that = this;
      let temp_list = val;
    },
    getLeakageMutationList_(page) {
      let that = this;
      let temp_companyID = this.search.companyId;
      let temp_timeStage = this.timeStage;
      getLeakageMutationList({
        companyId: "" + temp_companyID,
        startTime: "" + temp_timeStage.startTime,
        endTime: "" + temp_timeStage.endTime,
        pageNum: page,
        pageSize: 10
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
            that.list = data.rows;
            that.paginate.totalPage = Math.ceil(data.total / 10) || 1;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    searchList() {
      this.paginate.currentPage = 1;
      this.getLeakageMutationList_(1);
    },
    closeLegend(flag) {
      this.legend_show = true;
    },
    showLegend_() {
      this.legend_show = false;
    },
    getTime(val) {
      let timeStage = "";
      if (val == "0") {
        timeStage = new GetDate().getDate_time("0");
      } else if (val == "1") {
        timeStage = new GetDate().getDate_time("1");
      } else {
        timeStage = new GetDate().getDate_time("2");
      }
      this.timeStage = timeStage;
    }
  },
  mounted() {
    let position = this.$store.getters.get_cityPosition;
    this.createMap(position);
  },
  created() {
    let that = this;
    let timer = null;
    let timeStage = new GetDate().getDate_time("0");
    this.timeStage = timeStage;
    that.tree = that.$store.getters.get_orgTree;
    that.initCompony = that.tree[0].label;
    that.search.companyId = that.tree[0].id;
    that.getLeakageMutationList_(1);
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

#leaktest {
  width: 100%;
  height: 100%;
  position: relative;

  #gis {
    width: 100%;
    height: 100%;
  }

  .gistools {
    width: 200px;
    height: 30px;
    background: #fff;
    position: absolute;
    right: 20px;
    top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;

    .el-dropdown {
      cursor: pointer;
    }
  }

  .aside-table {
    position: absolute;
    right: 20px;
    top: 70px;
    height: calc(100% - 90px);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

    .toggleBar {
      width: 24px;
      height: 88px;
      position: absolute;
      left: -24px;
      top: 50%;
      border: 1px solid #ccc;
      line-height: 88px;
      text-align: center;
      cursor: pointer;
      background: #fff;
    }

    .inner_ {
      position: relative;
      width: 460px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      background: #fff;

      .row:first-child {
        width: 100px;
        height: 100%;
        font-size: 14px;
        color: #333;

        .top-tabItem {
          width: 100%;
          height: 30px;
          line-height: 30px;
          background: #ccc;
          text-align: center;
        }
      }

      .row:last-child {
        width: calc(100%);
        padding-top: 0;
        border-left: 1px solid #ccc;

        & > .select-item {
          width: 100%;
          height: 50px;
          line-height: 30px;
          padding: 10px;
          font-size: 14px;
          color: #333;
          display: flex;
          justify-content: space-between;

          span {
            display: inline-block;
            width: 80px;
          }

          .el-button {
            line-height: normal;
          }
        }

        .inner {
          width: 100%;
          padding: 10px;
          display: flex;
          justify-content: space-between; // margin-bottom: 10px;

          .col:first-child {
            width: calc(100% - 60px);

            .select-item {
              width: 100%;
              height: 40px;
              font-size: 14px;
              color: #333;
              line-height: 30px;
              padding-bottom: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;

              &:last-child {
                height: 30px;
                padding-bottom: 0;
              }

              span {
                display: inline-block;
                width: 80px;
              }

              .el-select {
                width: calc(100% - 80px);
                height: 30px;
                line-height: 30px;
              }

              input {
                width: calc(100% - 80px);
                height: 30px;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding-left: 10px;
              }
            }
          }

          .col:last-child {
            width: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        .timer-select {
          height: 30px;
          margin-bottom: 10px;
          padding: 0 10px;
        }

        .content {
          width: 100%;
          height: calc(100% - 140px);
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;

          .thead {
            width: 100%;
            display: flex;
            justify-content: space-between;
            // padding: 0 10px;
            font-weight: 600;
            background: #e3edef;

            .col {
              width: calc(50% - 80px);
              border-right: 1px solid #ccc;
              border-bottom: 1px solid #ccc;
              text-align: center;

              &:last-child {
                width: 160px;
                border-right: none;
              }

              span {
                display: inline-block;
                line-height: 30px;
              }
            }
          }

          .tbody {
            width: 100%;
            height: calc(100% - 30px);
            overflow-y: auto;

            // padding: 0 10px;
            .listItem {
              width: 100%;
              display: flex;

              .col {
                width: calc(50% - 80px);
                text-align: center;
                border-right: 1px solid #ccc;
                border-bottom: 1px solid #ccc;

                span {
                  line-height: 30px;
                  width: 100%;
                  display: inline-block;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                &:last-child {
                  width: 160px;
                  border-right: none;
                }
              }
            }
          }
        }

        .pagenation {
          width: 100%;
          padding: 10px;
        }
      }
    }
  }

  .layerSelect {
    position: absolute;
    top: 10px;
    left: 60px;
    width: 300px;
    height: 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 14px;
    background: #fff;
    border-radius: 5px;

    .col {
      width: 33.33%;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
      cursor: pointer;

      .rect {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 1px solid #ccc;
        margin-right: 5px;
        border-radius: 14px;
        position: relative;

        .dolt {
          position: absolute;
          top: 4px;
          left: 4px;
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 10px;
          background: #000;
          opacity: 0;
        }
      }

      &.actived {
        span.rect {
          .dolt {
            border-radius: 10px;
            opacity: 1;
          }

          // background: url("../../assets/images/common/select.png") no-repeat;
          // background-size: 100% 100%;
        }
      }
    }
  }

  .subContent_ {
    width: 100%;
    height: 100%;
    font-size: 14px;

    .topHead {
      width: 100%;
      height: 60px;
      padding: 0 10px;
      padding-top: 10px;

      .row {
        width: 100%;
        height: 25px;
        display: flex;
        justify-content: space-between;
        line-height: 25px;

        .col {
          width: 50%;
        }
      }
    }

    .tips {
      width: calc(100% - 20px);
      height: 60px;
      margin: 0 auto;
      line-height: 18px;
      overflow-y: auto;

      textarea {
        width: 100%;
        height: 90%;
        border: 1px solid #ccc;
        // border-radius: 10px;
        padding: 5px;
        resize: none;
      }
    }

    .selectTable {
      width: 100%;

      .row {
        width: 100%;
        height: 30px;
        line-height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        span {
          display: inline-block;
          margin-right: 20px;
        }

        .radio {
          width: 14px;
          height: 14px;
          border-radius: 14px;
          border: 1px solid #ccc;
          position: relative;

          i {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background: #333;
            transform: scale(0.5);
            position: absolute;
            top: 1px;
            left: 1px;
            opacity: 0;
          }
        }

        &.actived {
          .radio {
            i {
              opacity: 1;
            }
          }
        }
      }
    }

    .actions {
      width: 100%;
      background: #e3e3e3;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 0;
      left: 0;

      span {
        display: inline-block;
        padding: 5px 15px;
        background: #2a8b2a;
        border-radius: 5px;
        color: #fff;
        margin-right: 10px;
        cursor: pointer;

        &.ifClick {
          cursor: not-allowed;
          background: #7a7c85;
        }
      }
    }
  }

  .legend_ {
    width: 240px;
    height: 130px;
    position: absolute;
    bottom: 44px;
    left: 20px;

    #legend .card .sub {
      height: 75px;
    }

    #legend span.line {
      width: calc(100% - 60px) !important;
    }

    .devs {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: flex-start;

      .col {
        width: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
          margin-bottom: 5px;
        }
      }
    }
  }

  .legend-btn {
    position: absolute;
    bottom: 50px;
    left: 20px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 50%;
    cursor: pointer;
    background: #0b83fe;
    color: #fff;
    text-align: center;
    font-size: 12px;
  }
}
</style>
