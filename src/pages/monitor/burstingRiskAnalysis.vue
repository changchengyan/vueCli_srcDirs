<template>
  <div id="burstingRiskAnalysis">
    <div id="gis"></div>
    <div class="gistools">
      <gistools @handleThisDom="thisDom" @showLayers="toggleSelectThis" :defaultLayers="layers"></gistools>
    </div>
    <div class="ledgend">
      <div class="top">
        <span>风险等级</span>
      </div>
      <div class="list">
        <div class="item" v-for="(item,index) in timeLine" :key="index">
          <span>{{item}}</span>
        </div>
      </div>
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
              :defaultCompony="initCompony"
              :waterWorksTree="tree"
              @showSelectLists="selectItem"
            ></select-tree>
          </div>
          <div class="inner">
            <div class="col">
              <div class="select-item">
                <span>所属区域:</span>
                <el-select v-model="search.areaId" placeholder="请选择">
                  <el-option
                    v-for="item in areaList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="select-item">
                <span>测点名称:</span>
                <input type="text" placeholder="请输入测点名称" v-model="search.searchName">
              </div>
            </div>
            <div class="col">
              <el-button type="primary" @click="searchList" @keyup.enter="searchList">搜索</el-button>
            </div>
          </div>
          <div class="content">
            <div class="thead">
              <div class="col">
                <span>所属管道</span>
              </div>
              <div class="col">
                <span>爆管可能程度</span>
              </div>
              <div class="col">
                <span>爆管次数</span>
              </div>
              <div class="col">
                <span>分析结果</span>
              </div>
              <div class="col">
                <span>爆管历史信息</span>
              </div>
            </div>
            <div class="tbody">
              <template v-if="list.length>0">
                <div class="listItem" v-for="(item,index) in list" :key="index">
                  <div class="col">
                    <span>{{item.PIPE_NAME}}</span>
                  </div>
                  <div class="col">
                    <span>{{item.FINAL_VAL}}</span>
                  </div>
                  <div class="col">
                    <span>{{item.BURST_NUM}}</span>
                  </div>
                  <div class="col actions" @click="resultModel(item)">
                    <span>分析</span>
                  </div>
                  <div class="col actions">
                    <span @click="historyModel(item)">详情</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="pagenation">
            <pagenation
              :noSmall="paginate.ifSmall"
              :totalPage="paginate.totalPage"
              @thisPage="gotoThisPage"
            ></pagenation>
          </div>
        </div>
      </div>
    </div>
    <model-muil :showViewModel="showModel" :title="'爆管分析'" @hiddenSelf="hiddenModel">
      <div class="subcontent">
        <template v-if="showHistory_result==1">
          <div class="historyContent">
            <table>
              <tr>
                <td class="sm">
                  <span>序号</span>
                </td>
                <td class="lg">
                  <span>爆管地点</span>
                </td>
                <!-- <td class="sm"><span>上报人</span></td> -->
                <td class="md">
                  <span>上报时间</span>
                </td>
                <td class="sm">
                  <span>检修人</span>
                </td>
                <td class="md">
                  <span>检修时间</span>
                </td>
              </tr>
              <template v-if="history_msg.length>0">
                <tr v-for="(item,index) in history_msg" :key="index">
                  <td class="sm">
                    <span>{{index+1}}</span>
                  </td>
                  <td class="lg" :title="item.PLACE">
                    <span>{{item.PLACE}}</span>
                  </td>
                  <!-- <td class="sm"><span>{{item.REPORT_TIME}}</span></td> -->
                  <td class="md">
                    <span>{{item.REPORT_TIME}}</span>
                  </td>
                  <td class="sm">
                    <span>{{item.ASSIGN_USER}}</span>
                  </td>
                  <td class="md">
                    <span>{{item.FINISH_TIME}}</span>
                  </td>
                </tr>
              </template>
            </table>
          </div>
        </template>
        <template v-else>
          <div class="contentTable">
            <table>
              <tr>
                <td>
                  <span>风险类型</span>
                </td>
                <td>
                  <span>风险权重</span>
                </td>
                <td>
                  <span>条件</span>
                </td>
                <td>
                  <span>风险数</span>
                </td>
                <td>
                  <span>爆管系数</span>
                </td>
              </tr>
              <!-- <tr>
                                <td><span>{{dsePipeBurstConditionInfo}}</span></td>
              </tr>-->
              <template v-if="dsePipeBurstConditionInfo.length>0">
                <tr v-for="(val,index) in dsePipeBurstConditionInfo" :key="index">
                  <td>
                    <span>{{val.CON_TYPE|formateType}}</span>
                  </td>
                  <td>
                    <span>{{val.PERCENT}}%</span>
                  </td>
                  <td>
                    <template v-if="val.CON_TYPE=='1'">
                      <el-select
                        v-model="val.DIC_ITEM_NAME"
                        placeholder="请选择"
                        @change="get_meterial"
                      >
                        <el-option
                          v-for="(v,i) in meterials_"
                          :key="i"
                          :label="v.label"
                          :value="v.value"
                        ></el-option>
                      </el-select>
                    </template>
                    <template v-if="val.CON_TYPE=='2'">
                      <el-select v-model="val.DIC_ITEM_NAME" placeholder="请选择" @change="get_radius">
                        <el-option
                          v-for="item in radius"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </template>
                    <template v-if="val.CON_TYPE=='4'">
                      <el-input v-model="val.DIC_ITEM_NAME" clearable @change="get_ages"></el-input>
                    </template>
                    <template v-if="val.CON_TYPE=='3'">
                      <el-select v-model="val.DIC_ITEM_NAME" placeholder="请选择" @change="get_depth">
                        <el-option
                          v-for="item in interfaceTypes"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </template>
                    <template v-if="val.CON_TYPE=='5'">
                      <el-input v-model="val.DIC_ITEM_NAME" clearable @change="get_depth"></el-input>
                    </template>
                    <template v-if="val.CON_TYPE=='6'">
                      <el-select
                        v-model="val.DIC_ITEM_NAME"
                        placeholder="请选择"
                        @change="get_roadWeights"
                      >
                        <el-option
                          v-for="item in roadWeights"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </template>
                    <template v-if="val.CON_TYPE=='7'">
                      <el-input v-model="val.DIC_ITEM_NAME" clearable @change="get_historyCount"></el-input>
                    </template>
                  </td>
                  <td>
                    <span>{{val.COEFFICIENT}}</span>
                  </td>
                  <td :rowspan="dsePipeBurstConditionInfo.length" v-if="index==0">
                    <span>{{sumRate |formate_fixed2}}</span>
                  </td>
                </tr>
              </template>
            </table>
            <div class="actions">
              <span class="cancel" @click="cancel">取消</span>
              <span class="config" @click="simulation">模拟</span>
            </div>
          </div>
        </template>
      </div>
    </model-muil>

    <div class="legend legend-left">
      <template v-if="closeLegend==false">
        <legend-component
          :list="legend_"
          :ifClosed="closeLegend"
          @closedSelf="close_legend"
          :topHeight="'100px'"
        >
          <div class="sub-row">
            <div class="col">
              <img src="../../assets/images/common/xfs.png" alt>
              <span>消防栓</span>
            </div>
            <div class="col">
              <img src="../../assets/images/common/jxj.png" alt>
              <span>检修井</span>
            </div>
          </div>
        </legend-component>
      </template>
      <template v-else>
        <div class="legend-btn" @click="showLegend_">
          <span>图例</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {
  getPipeBurstRiskList,
  getPipeBurstHistory,
  getSimulatePipeBurstRisk,
  getDsePipeBurstRiskInfo
} from "@/api/monitor/burstingRiskAnalysis";
import { getOrganDictTree } from "@/api/common/get_area";
import * as esriLoader from "esri-loader";

import calculateModle from "@/common/components/poupe/view";

esriLoader.loadCss(dse.arcgis_mainCss);
let startJs = dse.arcgis_startJS;
const options = {
  url: startJs,
  dojoConfig: dse.gisConfig
};
let pipeUrl = dse.pipe_default_layer_url;
let jxjeUrl = dse.xfs_default_layer_url;
let xfsUrl = dse.fm_default_layer_url;

let qcUrl = dse.arcgis_devs;
let jxjUrl = dse.arcgis_jxj;

// 二维管网相关.
import popupUtils from "@/common/utils/popupUtils";
//管网图层配置
import gw2dConfig from "@/common/config/gis2d/gw2dConfig";
import jxj2dConfig from "@/common/config/gis2d/jxj2dConfig";
import xfs2dConfig from "@/common/config/gis2d/xfs2dConfig";

import layerUtils from "@/common/utils/layerUtils";

import pagenation from "@/common/components/pagination";
import gistools from "@/common/components/gis_units/tools";
import selectTree from "@/common/components/selectWithTree";

import modelMuil from "@/common/components/poupe/view";

import legendComponent from "@/common/components/legend";

let get_search_attr = null; //获取 当前管道的属性 的 函数
let pipe_risk = null; //爆管渲染的函数
export default {
  components: {
    pagenation,
    gistools,
    selectTree,
    modelMuil,
    legendComponent,
    calculateModle
  },
  data() {
    return {
      view: null,
      map: null,
      distance: null, //自定义量距
      area: null, //自定义画面
      layer1: null, //管道图层
      layer2: null, //检修井 图层
      layer3: null, //消防栓 图层
      simulate_layer: "", //模拟的图层
      searchLayer: null, // 查询图层
      waterQc_layer: null, //水质图层
      waterPress_layer: null, //水压图层
      waterFlow_layer: null, //水流图层
      tableShow: true,
      showSimulate: false, // 爆管模拟 弹窗
      showHistory: false, // 历史详情 弹窗
      areaList: [], // 区域列表
      areaItem: "", //选中的区域
      tree: [], //水施数据
      searchName: "", // 查询的名字
      search: {
        companyId: "",
        areaId: "",
        searchName: ""
      },
      layers: [], //工具栏图层
      paginate: {
        //分页器
        ifSmall: true,
        totalPage: 1
      },
      list: [], //数据列表
      showModel: false,
      title: "",
      showHistory_result: null, //判断展示历史详情或者模拟结果  1 为 历史详情  2 为模拟结果
      dsePipeBurstConditionInfo: [],
      sumRate: 0.364,
      legend_: {
        //图例
        top: [
          {
            color: "#44cef6",
            name: "输水管线"
          },
          {
            color: "#ff051e",
            name: "爆管"
          },
          {
            color: "#b00a18",
            name: "风险等级高"
          },
          {
            color: "#eece38",
            name: "风险等级中"
          },
          {
            color: "#3a9a2e",
            name: "风险等级低"
          }
        ]
      },
      options: [
        {
          value: 0.1,
          label: "PE管"
        },
        {
          value: 0.1,
          label: "钢管"
        },
        {
          value: 0.1,
          label: "球墨铸铁管"
        },
        {
          value: 0.2,
          label: "铸铁管"
        },
        {
          value: 0.2,
          label: "混凝土管"
        },
        {
          value: 0.3,
          label: "水泥管"
        },
        {
          value: 0.3,
          label: "其他管材"
        }
      ],
      value: "",
      calcuteItems: {
        materialDicId: "", //管材
        radiusDicId: "", // 管径
        interfaceTypeDicId: "", // 接口类型
        roadWeightDicId: "", // 路面荷载
        pipeAge: "", // 管龄
        pipeDeep: "", // 管道埋深
        burstNum: "" // 爆管次数
      },
      meterials_: [
        {
          value: "0.1)",
          label: "PE管"
        },
        {
          value: "0.1?",
          label: "钢管"
        },
        {
          value: "0.1&",
          label: "球墨铸铁管"
        },
        {
          value: "0.2(",
          label: "铸铁管"
        },
        {
          value: "0.2?",
          label: "混凝土管"
        },
        {
          value: "0.3*",
          label: "水泥管"
        },
        {
          value: "0.3)",
          label: "其他管材"
        }
      ], //管材
      radius: [
        {
          value: "0.1",
          label: "DN1000以上"
        },
        {
          value: "0.15",
          label: "DN600-DN1000"
        },
        {
          value: "0.2",
          label: "DN400-DN600"
        },
        {
          value: "0.25",
          label: "DN200-DN400"
        },
        {
          value: "0.3",
          label: "DN200以下"
        }
      ], // 管径
      interfaceTypes: [
        {
          value: "0.1?",
          label: "法兰"
        },
        {
          value: "0.3",
          label: "承插"
        },
        {
          value: "0.2?",
          label: "粘结"
        },
        {
          value: "0.1*",
          label: "焊接(热熔、电焊)"
        },
        {
          value: "0.2&",
          label: "其他"
        }
      ], //接口
      roadWeights: [
        {
          value: "0.5",
          label: "主干路(重)"
        },
        {
          value: "0.3",
          label: "次干路(中)"
        },
        {
          value: "0.1",
          label: "支路及辅路(轻)"
        }
      ], // 路面荷载
      history_msg: [], //历史详情列表
      simulated_pipe_id: "", //模拟管网的ID
      closeLegend: false,
      initCompony: "", //初始化公司
      post_pipe_data: {}, //提交模拟gis
      timeLine: [1.0, 0.8, 0.6, 0.4]
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
            that.map = new Map({
              // basemap: "satellite"
            });
            let baseMapUtils = new BaseMapUtils({
              map: that.map,
              mapType: "2"
            });

            let pipeUrl =  that.$store.getters.get_pipe_defaultLayer;


            //debugger;
            baseMapUtils.loadBaseLayers(dse.baseMapLayers);
            // 管网图层.
            gw2dConfig.url =  pipeUrl;
            gw2dConfig.popupTemplate.visible = false;
            that.layer1 = layerUtils.loadData(that.map, gw2dConfig);
            //===================================================

            // 检修井图层.
            jxj2dConfig.url = jxjUrl;
            jxj2dConfig.popupTemplate.visible = false;
            that.layer2 = layerUtils.loadData(that.map, jxj2dConfig);
            //===================================================

            // 消防栓图层.
            xfs2dConfig.url =  that.$store.getters.get_xfs_defaultLayer;
            xfs2dConfig.popupTemplate.visible = false;
            that.layer3 = layerUtils.loadData(that.map, xfs2dConfig);
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

            that.boosterLayer = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.boosterLayer);
            that.lev_1 = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.lev_1);

            that.lev_2 = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.lev_2);

            that.lev_3 = new GraphicsLayer({
              graphics: []
            });
            that.lev_4 = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.lev_4);

            that.simulate_layer = new GraphicsLayer({
              graphics: []
            });

            that.map.add(that.simulate_layer);

            pipe_risk = function(num) {
            //   that.lev_1.removeAll();
            //   that.lev_2.removeAll();
            //   that.lev_3.removeAll();
            //   that.lev_4.removeAll();

              let temp_num = parseFloat(num);

              let sql = null;

              let color_ = "";

              if (temp_num >= 0 && temp_num < 0.4) {
                sql = ` FINAL_VAL >= 0 and FINAL_VAL <0.4 `;
                color_ = "#3a9a2e";
              } else if (temp_num >= 0.4 && temp_num < 0.6) {
                sql = ` FINAL_VAL >= 0.4 and FINAL_VAL <0.6  `;
                color_ = "#eece38";
              } else if (temp_num >= 0.6 && temp_num < 0.8) {
                sql = ` FINAL_VAL >= 0.6 and FINAL_VAL < 0.8  `;
                color_ = "#b00a18";
              } else {
                sql = ` FINAL_VAL >= 0.8 `;
                color_ = "#ff051e";
              }

              let queryTask = new QueryTask({
                url: pipeUrl
              });
              let query = new Query();
              query.returnGeometry = true;
              query.outFields = ["*"];
              query.where = sql;
              queryTask.execute(query).then(function(results) {
                let tempFeatures = results.features;

                let gra = null;
                if (tempFeatures && tempFeatures.length > 0) {
                  tempFeatures.forEach((val, index) => {
                    gra = new Graphic({
                      geometry: val.geometry,
                      symbol: {
                        type: "simple-line",
                        color: color_,
                        width: 4
                      }
                    });

                    if (temp_num >= 0 && temp_num < 0.4) {
                      that.lev_1.add(gra);
                    } else if (temp_num >= 0.4 && temp_num < 0.6) {
                      that.lev_2.add(gra);
                    } else if (temp_num >= 0.6 && temp_num < 0.8) {
                      that.lev_3.add(gra);
                    } else {
                      that.lev_4.add(gra);
                    }
                  });
                }
              });
            };

            // 搜索查询对应的管道
            let temp_gisID = "SDEPIPEID";
            that.searchLayer = new Search({
              view: that.view,
              sources: [
                {
                  featureLayer: {
                    url: pipeUrl
                  },
                  searchFields: ["" + temp_gisID],
                  displayField: "" + temp_gisID,
                  exactMatch: false,
                  outFields: ["*"],
                  popupEnabled: false,
                  resultSymbol: {
                    color: "#fff",
                    type: "simple-line",
                    width: "1"
                  }
                }
              ]
            });

            get_search_attr = function( num) {

              that.simulate_layer.removeAll();

              let temp_num = parseFloat(num);
              let sql = null;
              let color_ = "";

              if (temp_num >= 0 && temp_num < 0.4) {
                sql = ` FINAL_VAL >= 0 and FINAL_VAL <0.4 `;
                color_ = "#3a9a2e";
              } else if (temp_num >= 0.4 && temp_num < 0.6) {
                sql = ` FINAL_VAL >= 0.4 and FINAL_VAL <0.6  `;
                color_ = "#eece38";
              } else if (temp_num >= 0.6 && temp_num < 0.8) {
                sql = ` FINAL_VAL >= 0.6 and FINAL_VAL < 0.8  `;
                color_ = "#b00a18";
              } else {
                sql = ` FINAL_VAL >= 0.8 `;
                color_ = "#ff051e";
              }


              let queryTask = new QueryTask({
                url: pipeUrl
              });
              let query = new Query();
              query.returnGeometry = true;
              query.outFields = ["*"];
              query.where = sql;
              queryTask
                .execute(query)
                .then(function(results) {
                  let tempFeatures =  results.features;
                   let gra = null;
                    if (tempFeatures && tempFeatures.length > 0) {
                      tempFeatures.forEach((val, index) => {
                        gra = new Graphic({
                          geometry: val.geometry,
                          symbol: {
                            type: "simple-line",
                            color: color_,
                            width: 4
                          }
                        });
                        that.simulate_layer.add(gra);
                      });
                    }
                 
                })
                .catch(error => {
                  console.log(error);
                });
            };
          }
        );
    },
    close_legend(val) {
      this.closeLegend = true;
    },
    showLegend_() {
      this.closeLegend = false;
    },
    toggleShow() {
      this.tableShow = !this.tableShow;
    },
    selectItem(val) {
      this.search.companyId = val.id;
      this.getOrganDictTree_(val.id);
    },
    gotoThisPage(index) {
      let temp_index = parseInt(index);
      this.getPipeBurstRiskList_(temp_index);
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
    selectThis(index) {
      let that = this;
      this.activedLayer = index;
      if (index == 0) {
        that.waterQc_layer.removeAll();
        that.waterPress_layer.removeAll();
        that.waterFlow_layer.addMany(that.flow_layer);
      } else if (index == 1) {
        that.waterQc_layer.removeAll();
        that.waterFlow_layer.removeAll();
        that.waterPress_layer.addMany(that.press_layer);
      } else {
        that.waterFlow_layer.removeAll();
        that.waterPress_layer.removeAll();
        that.waterQc_layer.addMany(that.qc_layer);
      }
    },
    searchList() {
      this.getPipeBurstRiskList_("1");
    },
    getPipeBurstRiskList_(page) {
      let that = this;
      let temp_commpanyID = this.search.companyId;
      let temp_areaID = this.search.areaId;
      let temp_searchName = this.search.searchName;
      getPipeBurstRiskList({
        companyId: "" + temp_commpanyID,
        areaId: "" + temp_areaID,
        pipelineName: "" + temp_searchName,
        page: "" + page,
        pageSize: "10"
      }).then(res => {
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
          let { total, rows } = data;
          that.paginate.totalPage = Math.ceil(parseInt(total) / 10) || 1;
          that.list = rows;
          let temp_arr = rows && rows.length > 0 ? rows : [];

          for (let i = 0; i < temp_arr.length; i++) {
            if (pipe_risk) {
              pipe_risk(temp_arr[i].FINAL_VAL);
            }
          }
        }
      });
    },
    getPipeBurstHistory_(id, page) {
      // 历史信息
      let that = this;
      getPipeBurstHistory({
        pipeId: "" + id,
        page: "" + page,
        pageSize: "10"
      }).then(res => {
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
        this.showModel = true;
        if (res.status == 1) {
          let { data } = res;
          let { pipeBurstHistoryPhotos, pipeBurstHistory } = data;
          that.history_msg =
            pipeBurstHistory.rows && pipeBurstHistory.rows.length > 0
              ? pipeBurstHistory.rows
              : [];
        }
      });
    },
    getSimulatePipeBurstRisk_(id) {
      //模拟结果
      let that = this;
      getSimulatePipeBurstRisk({
        pipeId: "" + id
      }).then(res => {
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
          let { dsePipeBurstConditionInfo, dsePipeBurstRiskInfo } = data;

          // that.result.dsePipeBurstConditionInfo= dsePipeBurstConditionInfo;
          // that.result.dsePipeBurstRiskInfo.FINAL_VAL = dsePipeBurstRiskInfo.FINAL_VAL;
        }
      });
    },
    simulated_burstingTube() {
      getSimulatePipeBurstRisk({
        materialDicId: "",
        radiusDicId: "",
        interfaceTypeDicId: "",
        roadWeightDicId: "",
        pipeAge: "",
        pipeDeep: "",
        burstNum: ""
      }).then(res => {
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
        // console.log(res)
      });
    },
    resultModel(item) {
      let that = this;
      this.showHistory_result = 2;
      this.title = "分析结果";
      this.simulated_pipe_id = item.ID;
      this.getDsePipeBurstRiskInfo_(item.ID);
      let temp_search = this.searchLayer;
      temp_search.searchTerm = item.ID;
      temp_search.search();
      this.view.goTo({
        center: that.view.center,
        zoom: that.view.zoom
      });


    },
    historyModel(item) {
      this.showHistory_result = 1;
      this.title = "爆管历史信息";
      this.getPipeBurstHistory_(item.ID, "1");
    },
    hiddenModel(val) {
      this.showModel = false;
    },
    get_meterial(val) {
      this.dsePipeBurstConditionInfo[0].COEFFICIENT = parseFloat(val);
      this.emulate();
    },
    get_radius(val) {
      this.dsePipeBurstConditionInfo[1].COEFFICIENT = parseFloat(val);
      this.emulate();
    },
    get_interfaceType(val) {
      this.dsePipeBurstConditionInfo[3].COEFFICIENT = parseFloat(val);
      this.emulate();
    },
    get_roadWeights(val) {
      this.dsePipeBurstConditionInfo[5].COEFFICIENT = parseFloat(val);
      this.emulate();
    },
    get_ages(val) {
      let that = this;
      let temp = val ? val : 0;
      let reg_test = /[0-9]+/;
      let flag = reg_test.test(temp);
      if (flag) {
        temp = parseInt(temp);
      } else {
        this.$message.error("请输入数字!");
        temp = 0;
      }
      let temp_arr = JSON.parse(JSON.stringify(that.dsePipeBurstConditionInfo));
      temp_arr[2].DIC_ITEM_NAME = temp;
      if (temp <= 5) {
        temp_arr[2].COEFFICIENT = 0.1;
      } else if (temp > 5 && temp <= 10) {
        temp_arr[2].COEFFICIENT = 0.2;
      } else if (temp > 10 && temp <= 20) {
        temp_arr[2].COEFFICIENT = 0.4;
      } else if (temp > 20 && temp <= 30) {
        temp_arr[2].COEFFICIENT = 0.6;
      } else {
        temp_arr[2].COEFFICIENT = 0.8;
      }
      this.dsePipeBurstConditionInfo = temp_arr;
      this.emulate();
    },
    get_depth(val) {
      let that = this;
      let temp = val ? val : 0;
      let reg_test = /[0-9]+/;
      let flag = reg_test.test(temp);
      if (flag) {
        temp = parseInt(temp);
      } else {
        this.$message.error("请输入数字!");
        temp = 0;
      }
      let temp_arr = JSON.parse(JSON.stringify(that.dsePipeBurstConditionInfo));
      temp_arr[4].DIC_ITEM_NAME = temp;

      if (temp <= 0.7) {
        temp_arr[4].COEFFICIENT = 0.5;
      } else if (temp > 0.7 && temp <= 1.5) {
        temp_arr[4].COEFFICIENT = 0.3;
      } else {
        temp_arr[4].COEFFICIENT = 0.1;
      }
      this.dsePipeBurstConditionInfo = temp_arr;
      this.emulate();
    },
    get_historyCount(val) {
      let that = this;
      let temp = val ? val : 0;
      let reg_test = /[0-9]+/;
      let flag = reg_test.test(temp);
      if (flag) {
        temp = parseInt(temp);
      } else {
        this.$message.error("请输入数字!");
        temp = 0;
      }
      let temp_arr = JSON.parse(JSON.stringify(that.dsePipeBurstConditionInfo));
      temp_arr[6].DIC_ITEM_NAME = temp;
      if (temp == 0) {
        temp_arr[6].COEFFICIENT = 0.1;
      } else if (temp > 0 && temp <= 3) {
        temp_arr[6].COEFFICIENT = 0.3;
      } else {
        temp_arr[6].COEFFICIENT = 0.5;
      }
      this.dsePipeBurstConditionInfo = temp_arr;
      this.emulate();
    },
    emulate() {
      let temp_rate = parseFloat(
        (this.dsePipeBurstConditionInfo[0].COEFFICIENT *
          this.dsePipeBurstConditionInfo[0].PERCENT) /
          100 +
          (this.dsePipeBurstConditionInfo[1].COEFFICIENT *
            this.dsePipeBurstConditionInfo[1].PERCENT) /
            100 +
          (this.dsePipeBurstConditionInfo[2].COEFFICIENT *
            this.dsePipeBurstConditionInfo[2].PERCENT) /
            100 +
          (this.dsePipeBurstConditionInfo[3].COEFFICIENT *
            this.dsePipeBurstConditionInfo[3].PERCENT) /
            100 +
          (this.dsePipeBurstConditionInfo[4].COEFFICIENT *
            this.dsePipeBurstConditionInfo[4].PERCENT) /
            100 +
          (this.dsePipeBurstConditionInfo[5].COEFFICIENT *
            this.dsePipeBurstConditionInfo[5].PERCENT) /
            100 +
          (this.dsePipeBurstConditionInfo[6].COEFFICIENT *
            this.dsePipeBurstConditionInfo[6].PERCENT) /
            100
      ).toFixed(3);

      this.sumRate = temp_rate;
    },
    getOrganDictTree_(id) {
      let that = this;
      getOrganDictTree({
        code: "CQ",
        organizationId: "" + id
      })
        .then(res => {
          if (res.msg == "操作失败") {
            that.$message.error("服务错误!");
            return;
          }
          if (res.msg == "no user") {
            window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
              dse.baseURL
            }?id=${id}`;
            return;
          }
          let { data } = res;
          let tempList = [];
          if (data.length > 0) {
            tempList.push({
              label: "全部城区",
              id: ""
            });
            for (let i = 0; i < data.length; i++) {
              let temp_json = {};
              temp_json.label = data[i].label;
              temp_json.value = data[i].id;
              tempList.push(temp_json);
            }
            that.areaList = tempList;
            that.search.areaId = "";
          } else {
            that.areaList = [
              {
                label: "全部城区",
                value: ""
              }
            ];
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDsePipeBurstRiskInfo_(pipeId) {
      let that = this;
      getDsePipeBurstRiskInfo({
        pipeId: "" + pipeId
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
          this.showModel = true;
          let { dsePipeBurstConditionInfo, dsePipeBurstRiskInfo } = res.data;
          let temp_data =
            dsePipeBurstConditionInfo && dsePipeBurstConditionInfo.length
              ? dsePipeBurstConditionInfo
              : [];
          for (let i = 0; i < temp_data.length; i++) {
            let temp_type = temp_data[i].CON_TYPE;
            if (temp_type == "1") {
              that.dsePipeBurstConditionInfo[0] = temp_data[i];
            } else if (temp_type == "2") {
              that.dsePipeBurstConditionInfo[1] = temp_data[i];
            } else if (temp_type == "3") {
              that.dsePipeBurstConditionInfo[3] = temp_data[i];
            } else if (temp_type == "4") {
              temp_data[i].DIC_ITEM_NAME = parseInt(temp_data[i].DIC_ITEM_NAME);
              that.dsePipeBurstConditionInfo[2] = temp_data[i];
            } else if (temp_type == "5") {
              temp_data[i].DIC_ITEM_NAME = parseInt(temp_data[i].DIC_ITEM_NAME);
              that.dsePipeBurstConditionInfo[4] = temp_data[i];
            } else if (temp_type == "6") {
              that.dsePipeBurstConditionInfo[5] = temp_data[i];
            } else {
              temp_data[i].DIC_ITEM_NAME = parseInt(temp_data[i].DIC_ITEM_NAME);
              that.dsePipeBurstConditionInfo[6] = temp_data[i];
            }
          }
          that.sumRate = dsePipeBurstRiskInfo[0].FINAL_VAL || that.emulate();
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancel() {
      this.showModel = false;
    },
    simulation() {
      let that = this;
      this.showModel = false;
      // that.layer1.reload()
      let temp_sumRate = parseFloat(that.sumRate);
    
      get_search_attr(temp_sumRate);
    }
  },
  mounted() {
    let position = this.$store.getters.get_cityPosition;
    this.createMap(position);
    this.search.areaId = "";
  },
  filters: {
    formateType(val) {
      let temp = val;
      switch (val) {
        case "1":
          temp = "管材";
          break;
        case "2":
          temp = "管径";
          break;
        case "3":
          temp = "接口类型";
          break;
        case "4":
          temp = "管龄";
          break;
        case "5":
          temp = "埋深";
          break;
        case "6":
          temp = "路面荷载";
          break;
        case "7":
          temp = "爆管次数";
          break;
      }
      return temp;
    },
    formate_fixed2(val) {
      let temp = "0.00";

      if (val !== null || val !== "") {
        temp = parseFloat(val).toFixed(2);
      }

      return temp;
    }
  },
  created() {
    this.tree = this.$store.getters.get_orgTree;
    this.areaList = this.$store.getters.get_cityAreas;
    this.initCompony = this.tree[0].label;
    this.search.companyId = this.tree[0].id;

    this.getPipeBurstRiskList_("1");
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

#burstingRiskAnalysis {
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

  .ledgend {
    width: 100px;
    height: 200px;
    position: absolute;
    top: 20px;
    left: 50px;
    background: #fff;
    border-radius: 5px;
    opacity: 0.8;
    font-size: 14px;

    .top {
      width: 100%;
      line-height: 25px;
      font-weight: 600;
      text-align: center;
    }

    .list {
      width: 100%;
      height: calc(100% - 25px);

      .item {
        width: 10px;
        height: 30px;
        margin-left: 20px;
        position: relative;

        &:nth-child(1) {
          background: #ff051e;
        }

        &:nth-child(2) {
          background: #b00a18;
        }

        &:nth-child(3) {
          background: #eece38;
        }

        &:nth-child(4) {
          background: #3a9a2e;
        }
        &:nth-child(5) {
          background: #44cef6;
        }

        span {
          width: 40px;
          font-weight: 600;
          position: absolute;
          left: 15px;
          top: 0px;
        }
      }
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
      top: 45%;
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
          height: calc(100% - 180px);
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
              display: flex;
              justify-content: center;
              align-items: center;
              width: calc(25% - 15px);
              border-right: 1px solid #ccc;
              border-bottom: 1px solid #ccc;
              text-align: center;

              &:last-child {
                width: 60px;
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
                width: calc(25% - 15px);
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
                  width: 60px;
                  border-right: none;
                }

                &.actions {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;

                  span {
                    display: inline-block;
                    width: 40px;
                    line-height: 25px;
                    border-radius: 5px;
                    color: #fff;
                    background: #0b83fe;
                  }
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

  .subcontent {
    width: 100%;
    height: 100%;

    .contentTable {
      width: 100%;
      min-height: 300px;
      max-height: 400px;
      overflow: auto;
      padding: 10px 0;

      table {
        width: 100%;
        border-spacing: 0;
        border-top: 1px solid #ccc;

        // border-bottom: 1px solid #ccc;
        tr {
          width: 100%;

          td {
            width: 20%;
            border-bottom: 1px solid #ccc;
            border-right: 1px solid #ccc;
            text-align: center;

            &:last-child {
              // border-right: none;
            }

            span {
              display: inline-block;
              width: 100%;
              line-height: 35px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          &:first-child {
            td {
              background: #e2eaec;
            }
          }
        }
      }

      .actions {
        width: 100%;
        padding: 10px 0;
        text-align: center;

        span {
          display: inline-block;
          padding: 5px 15px;
          background: #0b83fe;
          color: #fff;
          cursor: pointer;
          border-radius: 5px;
        }
      }
    }

    .historyContent {
      width: 100%;
      min-height: 300px;
      max-height: 400px;
      overflow: auto;
      padding: 10px;
      font-size: 14px;
      color: #333;

      table {
        width: 100%;
        border-spacing: 0;
        border: 1px solid #ccc;

        tr {
          width: 100%;

          td {
            border-right: 1px solid #ccc;
            border-bottom: 1px solid #ccc;

            &:last-child {
              border-right: none;
            }

            text-align: center;

            &.sm {
              width: 100px;
            }

            &.md {
              width: 120px;
            }

            &.lg {
              width: calc(100% - 540px);
            }

            span {
              height: 30px;
              line-height: 30px;
              display: inline-block;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
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

  .legend {
    width: 300px;
    height: 200px;
    position: absolute;
    left: 20px;
    bottom: 20px;

    #legend .card .top-head {
      width: 100%;
      overflow-y: auto;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    .sub-row {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;

      .col {
        width: 60px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
          margin-bottom: 10px;
        }
      }
    }
  }

  .legend-btn {
    position: absolute;
    bottom: 50px;
    left: 50px;
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

  .subContent_ {
    width: 100%;
    max-height: 340px;
    overflow: auto;

    .row {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .col {
        width: 50%;
        height: 40px;
        text-align: center;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        line-height: 40px;

        &:first-child {
          background: #d6fafa;
        }
      }
    }

    .actions {
      width: 100%;
      padding: 10px 0;
      text-align: center;

      span {
        display: inline-block;
        padding: 5px 15px;
        background: #0b83fe;
        color: #fff;
        border-radius: 5px;
      }
    }
  }
}
</style>
