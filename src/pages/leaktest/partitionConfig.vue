<template>
  <div id="partitionConfig">
    <div id="gis"></div>
    <div class="gisTools">
      <gistools :defaultLayers="[]" @handleThisDom="thisDom"></gistools>
    </div>
    <div class="sideTable">
      <div class="toggleBar" @click="toggleShow">
        <template v-if="showTable">
          <i class="el-icon-arrow-right"></i>
        </template>
        <template v-else>
          <i class="el-icon-arrow-left"></i>
        </template>
      </div>
      <div class="mainContent" v-if="showTable">
        <div class="tophead">
          <span>分区信息</span>
        </div>
        <div class="selectObj">
          <span>选择对象:</span>
          <select-tree
            :waterWorksTree="tree"
            :defaultCompony="defaultCompany"
            :notTop="rootHeadNotAllow"
            @showSelectLists="getNodeData"
          ></select-tree>
        </div>
        <div class="wrap">
          <div class="first-lev">
            <span>一级分区:</span>
            <i class="el-icon-arrow-left" @click="prev_firstLev"></i>
            <div class="tabs">
              <div class="inner-wrapTabs" :style="{left:-transition_distance*first_prev_next+'px'}">
                <template v-if="zoonArea.length>0">
                  <div
                    class="tab-item"
                    v-for="(v,i) in zoonArea"
                    :key="i"
                    @click="select_firstLev(i,v)"
                  >
                    <div class="inner-wrap" :class="{if_firstLev_select:first_lev_index===i}">
                      <template v-if="!v.ifEdit">
                        <span class="textLimit" :title="v.label">{{v.label}}</span>
                      </template>
                      <template v-else>
                        <input
                          type="text"
                          v-focus
                          v-model="v.label"
                          @change="verifyStr_first($event)"
                          @keyup.enter="configThisName_firstLev"
                          @blur="changeCheck()"
                          @focus="focusThis('myIpt')"
                          ref="firstValue"
                        >
                      </template>
                    </div>
                    <div class="bg_bottom" :class="{hasBg:first_lev_index===i}"></div>
                    <div class="ifDel" @click.stop="showDelModel(v,'1')">
                      <i class="el-icon-close"></i>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <i class="el-icon-arrow-right" @click="next_firstLev"></i>
            <span class="add" @click="add_firstLev">
              <i class="el-icon-plus"></i>
            </span>
          </div>
          <div class="sub-wrap">
            <div class="second-lev">
              <span>二级分区:</span>
              <i class="el-icon-arrow-left" @click="prev_secondLev"></i>
              <div class="tabs">
                <div class="inner-wraps" :style="{left:-transition_distance*second_prev_next+'px'}">
                  <template v-if=" sub_secondLev.length>0">
                    <div
                      class="tab-item"
                      @click="select_secondLev(i,value)"
                      v-for="(value,i) in sub_secondLev"
                      :key="i"
                    >
                      <div class="inner-wrap" :class="{if_secondLev_select:second_lev_index===i}">
                        <template v-if="!value.ifEdit">
                          <span class="textLimit" :title="value.label">{{value.label}}</span>
                        </template>
                        <template v-else>
                          <input
                            type="text"
                            v-model="value.label"
                            @change="verifyStr_second($event)"
                            @keyup.enter="configThisName_secondLev"
                            v-focus
                            @blur="changeCheck()"
                            @focus="focusThis('myIpt')"
                            ref="secondValue"
                          >
                        </template>
                      </div>
                      <div class="sub-bg" :class="{hasBg:second_lev_index===i}"></div>
                      <div class="ifDel" @click.stop="showDelModel(value,'2',i)">
                        <i class="el-icon-close"></i>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <i class="el-icon-arrow-right" @click="next_secondLev"></i>
              <span class="add" @click="add_secondLev">
                <i class="el-icon-plus"></i>
              </span>
            </div>
            <div class="three-lev">
              <span>三级分区:</span>
              <i class="el-icon-arrow-left" @click="prev_threeLev"></i>
              <div class="tabs">
                <div class="inner-wraps" :style="{left:-transition_distance*three_prev_next+'px'}">
                  <template v-if="sub_threeLev.length>0">
                    <div
                      class="tab-item"
                      v-for="(value,i) in sub_threeLev"
                      :key="i"
                      @click="select_threeLev(i,value)"
                    >
                      <div class="inner-wrap" :class="{if_threeLev_select:three_lev_index===i}">
                        <template v-if="!value.ifEdit">
                          <span class="textLimit" :title="value.label">{{value.label}}</span>
                        </template>
                        <template v-else>
                          <input
                            type="text"
                            v-model="value.label"
                            @change="verifyStr_three($event)"
                            @keyup.enter="configThisName_threeLev"
                            v-focus
                            @blur="changeCheck()"
                            @focus="focusThis('myIpt')"
                            ref="threeValue"
                          >
                        </template>
                      </div>
                      <div class="ifDel" @click.stop="showDelModel(value,'3',i)">
                        <i class="el-icon-close"></i>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <i class="el-icon-arrow-right" @click="next_threeLev"></i>
              <span class="add" @click="add_threeLev">
                <i class="el-icon-plus"></i>
              </span>
            </div>
          </div>

          <div class="edit-table">
            <div class="top-tip-btn">
              <span class="limitText" :title="post_data.name+'分区设置'">{{post_data.name+" "}}分区设置</span>
              <span class="btn" :class="{canDraw:ifCan_save==='2'}" @click="drawArea">绘制分区</span>
            </div>
            <div class="row">
              <div class="col">
                <span>分区名称</span>
                <span class="star">*</span>
              </div>
              <div class="col">
                <!-- <span>{{post_data.name}}</span> -->
                <!-- <template v-if="ifUpdate_save"> -->
                <input
                  type="text"
                  placeholder="请输入用水户名字"
                  v-model="post_data.name"
                  @change="editName($event)"
                >
                <!-- </template>
                <template v-else>
                  <span>{{post_data.name}}</span>
                </template>-->
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span>用水户数</span>
              </div>
              <div class="col">
                <!-- <template v-if="ifUpdate_save"> -->
                <input
                  type="text"
                  placeholder="请输入用水户数"
                  v-model="post_data.userCount"
                  @change="verifyData($event,'userCount')"
                >
                <!-- </template>
                <template v-else>
                  <span>{{post_data.userCount}}</span>
                </template>-->
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span>边界管线个数</span>
              </div>
              <div class="col">
                <!-- <template v-if="ifUpdate_save"> -->
                <input
                  type="text"
                  placeholder="请输入边界管线个数"
                  v-model="post_data.pipeCount"
                  @change="verifyData($event,'pipeCount')"
                >
                <!-- </template>
                <template v-else>
                  <span>{{post_data.pipeCount}}</span>
                </template>-->
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span>边界阀门个数</span>
              </div>
              <div class="col">
                <!-- <template v-if="ifUpdate_save"> -->
                <input
                  type="text"
                  placeholder="请输入边界阀门个数"
                  v-model="post_data.valveCount"
                  @change="verifyData($event,'valveCount')"
                >
                <!-- </template>
                <template v-else>
                  <span>{{post_data.valveCount}}</span>
                </template>-->
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span>边界流量表个数</span>
              </div>
              <div class="col">
                <!-- <template v-if="ifUpdate_save"> -->
                <input
                  type="text"
                  placeholder="请输入边界流量表个数"
                  v-model="post_data.flowCount"
                  @change="verifyData($event,'flowCount')"
                >
                <!-- </template>
                <template v-else>
                  <span>{{post_data.flowCount}}</span>
                </template>-->
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span>用水量(m³)</span>
              </div>
              <div class="col">
                <!-- <template v-if="ifUpdate_save"> -->
                <input
                  type="text"
                  placeholder="请输入用水量(m³)"
                  v-model="post_data.consumption"
                  @change="verifyData($event,'consumption')"
                >
                <!-- </template>
                <template v-else>
                  <span>{{post_data.consumption}}</span>
                </template>-->
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span>区域管网总长(km)</span>
              </div>
              <div class="col">
                <!-- <template v-if="ifUpdate_save"> -->
                <input
                  type="text"
                  placeholder="请输入区域管网总长(km)"
                  v-model="post_data.pipeLength"
                  @change="verifyDecimal($event,'pipeLength')"
                >
                <!-- </template>
                <template v-else>
                  <span>{{post_data.pipeLength}}</span>
                </template>-->
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span>夜间最小流量上下限(m³/S)</span>
              </div>
              <div class="col twoInput">
                <!-- <template v-if="ifUpdate_save"> -->
                <input
                  type="text"
                  placeholder="流量上限"
                  v-model="post_data.flowHigh"
                  @change="verifyDecimal($event,'flowHigh')"
                >
                <span>--</span>
                <input
                  type="text"
                  placeholder="流量下限"
                  v-model="post_data.flowLow"
                  @change="verifyDecimal($event,'flowLow')"
                >
                <!-- </template>
                <template v-else>
                  <span>{{post_data.flowHigh}}</span>
                  <span>--</span>
                  <span>{{post_data.flowLow}}</span>
                </template>-->
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span>夜间最小压力上下限(MPa)</span>
              </div>
              <div class="col twoInput">
                <!-- <template v-if="ifUpdate_save"> -->
                <input
                  type="text"
                  placeholder="压力上限"
                  v-model="post_data.pressHigh"
                  @change="verifyDecimal($event,'pressHigh')"
                >
                <span>--</span>
                <input
                  type="text"
                  placeholder="压力下限"
                  v-model="post_data.pressLow"
                  @change="verifyDecimal($event,'pressLow')"
                >
                <!-- </template>
                <template v-else>
                  <span>{{post_data.pressHigh}}</span>
                  <span>--</span>
                  <span>{{post_data.pressLow}}</span>
                </template>-->
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span>区域管网基本信息</span>
              </div>
              <div class="col text">
                <!-- <template v-if="ifUpdate_save"> -->
                <textarea
                  placeholder="请输入区域管网基本信息"
                  @change="changeText($event,'pipeInfo')"
                  v-model="post_data.pipeInfo"
                ></textarea>
                <!-- </template>
                <template v-else>
                  <span>{{post_data.pipeInfo}}</span>
                </template>-->
              </div>
            </div>
          </div>
          <div class="actions">
            <template v-if="ifEdit===false">
              <span @click="commit" :class="{ifPost:ifCan_save==='2'}">提交</span>
            </template>
            <template v-else>
              <span class="edit" @click="updateArea">更新</span>
            </template>
          </div>
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
          <div class="row">
            <div class="col">
              <img src="../../assets/images/common/fm.png" alt>
              <span>阀门井</span>
            </div>
            <div class="col">
              <img src="../../assets/images/common/normal_bigUser.png" alt>
              <span>大用水户</span>
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
    <tip-component
      :showViewModel="polygonModelFlag"
      :title="'温馨提示'"
      :wd="'300px'"
      @hiddenSelf="hidden_ploygonModel"
    >
      <div class="sub-content">
        <template v-if="changCheck_flag===false">
          <div class="tips">
            <span>{{tipTitle}}</span>
          </div>
          <div class="actions">
            <span class="cancel" @click="hidden_ploygonModel">走开</span>
            <span class="config" @click="config_drawPloygon">绘制分区</span>
          </div>
        </template>
        <template v-else>
          <div class="tips">
            <span>您已经新建一个图层，确定要离开吗?</span>
          </div>
          <div class="actions">
            <span class="cancel" @click="checkCancel">取消</span>
            <span class="config" @click="checkConfig">确定</span>
          </div>
        </template>
      </div>
    </tip-component>
    <save-component
      :showModel="saveModelFlag"
      :type="saveType"
      :flag="saveStatusFlag"
      :content="saveMsg"
      @delThis="hiddenSaveModel"
      @sureDelThis="configDelThis"
    ></save-component>

    <warning-component
      :showDefinedModel="showWainingModelFlag"
      :title="'警告!'"
      @hiddenSelf="closedWarningModel"
    >
      <div class="warningContext">
        <div class="mainBody">
          <p>该分区下有子集分区,请谨慎删除!</p>
        </div>
        <div class="actions">
          <span class="cancel" @click="closedWarningModel">取消</span>
          <span class="delAll" @click="delAllLayer">删除全部</span>
        </div>
      </div>
    </warning-component>
  </div>
</template>

<script>
import gistools from "@/common/components/gis_units/tools";
import selectTree from "@/common/components/leak_selectWidthTree";
let _ = require("lodash");

import { uuid_ } from "@/common/utils/uuid";

import {
  addArea,
  getPipeWaterUserInfo,
  getAreaTree,
  updateArea,
  getAreaInfo
} from "@/api/leaktest/partitionConfig";

import * as esriLoader from "esri-loader";
esriLoader.loadCss(dse.arcgis_mainCss);
let startJs = dse.arcgis_startJS;
const options = {
  url: startJs,
  dojoConfig: dse.gisConfig
};
let pipeUrl = dse.pipe_default_layer_url;
let jxjUrl = dse.arcgis_jxj;
// let xfsUrl = dse.arcgis_pipe;
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
// import xfs2dConfig from "@/common/config/gis2d/xfs2dConfig";

import layerUtils from "@/common/utils/layerUtils";

let enableCreatePolygon = null; //绘制面图层的函数
import LegendComponent from "@/common/components/legend";
import tipComponent from "@/common/components/poupe/view";

import SaveComponent from "@/common/components/poupe/save_status";

import WarningComponent from "@/common/components/poupe/defined";

let fetch_drawPloygon = null; //获取接口中的 分区图

let fetch_draw_firstPloygon = null; //只显示一级图层的区块

let fetch_draw_secondPloygon = null; //只显示二级图层的区块

let fetch_draw_threePloygon = null; //只显示三级图层的区块

let drawPolygon_last = null; // 判断最后判断是否相交或者包含

let draw = null; // 绘图的对象

export default {
  components: {
    gistools,
    selectTree,
    LegendComponent,
    tipComponent,
    SaveComponent,
    WarningComponent
  },
  data() {
    return {
      view: null,
      map: null,
      layer1: null, //管道图层
      layer2: null, //检修井的图层
      // layer3: null, //消防栓的图层
      layer4: null, //阀门的图层
      bgUser_layer: null, // 大用水户的点图层
      fetch_drawPolygon_layer: null, //接口中获取的图层信息
      waterFlow_layer: null, //水流的图层
      waterPress_layer: null, //水压的图层
      firstLayer: null, //一级分区的图层
      drawTools: null, //gis工具栏  绘图工具
      distance: null, //gis工具栏  量测工具
      area: null, //gis工具栏  量测面积
      showTable: true, // 显示右侧窗口的开关
      selectItem: "", //选择对象
      compnyList: {}, // 待选择数据
      zoonArea: [],
      defaultCompany: "", //默认选择的水司名字
      tree: [], //组织树
      factoryId: "", //水司ID
      factoryType: "1", //  区分水司或者水厂的类型
      topTips: {
        top: [
          {
            color: "#44cef6",
            name: "输水管线"
          }
        ]
      },
      showLegend_flag: false, //显示图例
      transition_distance: 260, //默认情况下 往左或者往右走的距离
      first_lev_index: 0,
      first_with4_index: 0, //四个四个的往前或者往后切标签
      go_left_first: 0, //新增 260 * go_left_first
      first_prev_next: 0, // 往左还是往右 一次四个
      firstBorder_index: 0, // 当前点击的  变换为四个元素的索引
      firstLev_zu: [
        {
          name: ""
        },
        {
          name: ""
        },
        {
          name: ""
        },
        {
          name: ""
        }
      ],
      second_lev_index: null,
      second_with4_index: 0,
      go_left_second: 0, //新增 260 * go_left_first
      second_prev_next: 0, // 往左还是往右 一次四个
      secondBg_index: 0, // 当前点击的  变换为四个元素的索引
      secondLev_zu: [
        {
          name: ""
        },
        {
          name: ""
        },
        {
          name: ""
        },
        {
          name: ""
        }
      ],
      three_lev_index: null,
      three_with4_index: 0,
      go_left_three: 0, //新增 260 * go_left_first
      three_prev_next: 0, // 往左还是往右 一次四个
      threeBg_index: 0, // 当前点击的  变换为四个元素的索引
      threeLev_zu: [
        {
          name: ""
        },
        {
          name: ""
        },
        {
          name: ""
        },
        {
          name: ""
        }
      ],
      rootHeadNotAllow: true, // 是否允许 根 的  名字 被点击
      post_data: {
        companyId: "",
        pid: "",
        code: "",
        name: "",
        lev: "",
        zone: "",
        area: 0,
        userCount: 0,
        pipeLength: 0,
        pipeInfo: "",
        pipeCount: 0,
        valveCount: 0,
        flowCount: 0,
        consumption: "",
        monitorList: [],
        id: "",
        flowLow: null,
        flowHigh: null,
        pressLow: null,
        pressHigh: null
      },
      polygonModelFlag: false,
      tipTitle: "您还没有绘制分区",
      temp_levFlag: "", // 当前绘制 的等级图层
      temp_drawName: "", //  当前绘制的 图层的名字
      saveModelFlag: false,
      saveStatusFlag: null,
      saveType: true, // 成功或失败的弹窗
      saveMsg: "",
      setttingDev: {
        // 当前状态下的 区域ID
        areaId: ""
      },
      sub_secondLev: [], // 当前二级分区下的二级分区
      sub_threeLev: [], //当前一级分区下的 三级分区
      del_id: "", // 要删除的 图层ID
      ifCan_save: "1", // 默认情况下是 不可提交  "2"是 可以提交
      ifEdit: false, //默认显示 提交的按钮
      sum_postData_count: 0, //记录保存次数
      dynamicChangeCheck: true, //默认进行 动态变更检查
      changCheck_flag: false, //  提示框  默认 显示绘制提醒，触发脏检查会弹出是否执行当前操作的弹窗
      current_changeCheck: {
        firstIndex: null,
        secondIndex: null,
        threeIndex: null
      },
      // 显示删除有子图层的图层
      showWainingModelFlag: false,
      ifDoubleClick: false // 判断当前绘制面数据是否是经过了双击完成
    };
  },
  methods: {
    toggleShow() {
      this.showTable = !this.showTable;
    },
    // 判断是正整数
    ifNumber(data) {
      let flag = true;
      let re = /^[1-9]\d*$/;
      flag = re.test(data);
      return flag;
    },
    // 判断是带有小数的数字
    ifDecimal(data) {
      let flag = true;
      let re_decimal = /^\d+(\.\d+)?$/;
      flag = re_decimal.test(data);
      return flag;
    },
    // 校验 整数或者 小数
    verifyDecimal(event, dataStr) {
      let that = this;
      let valueData = event.target.value;
      if (this.ifCan_save === "1") {
        this.ifEdit = true;
      }
      if (valueData === "") {
        valueData = 0;
      }
      let flag = this.ifDecimal(valueData);
      if (!flag) {
        switch (dataStr) {
          case "pipeLength":
            that.post_data.pipeLength = 0;
            break;
          case "flowHigh":
            that.post_data.flowHigh = null;
            break;
          case "flowLow":
            that.post_data.flowLow = null;
            break;
          case "pressHigh":
            that.post_data.pressHigh = null;
            break;
          case "pressLow":
            that.post_data.pressLow = null;
            break;
        }
      }
    },
    // 校验输入框的数值
    verifyData(event, dataStr) {
      let that = this;
      let valueData = event.target.value;
      // this.sum_postData_count +=1;
      if (this.ifCan_save === "1") {
        this.ifEdit = true;
      }

      if (valueData === "") {
        valueData = 0;
      }
      let flag = this.ifNumber(valueData);
      if (!flag) {
        switch (dataStr) {
          case "userCount":
            that.post_data.userCount = 0;
            break;
          case "pipeCount":
            that.post_data.pipeCount = 0;
            break;
          case "valveCount":
            that.post_data.valveCount = 0;
            break;
          case "flowCount":
            that.post_data.flowCount = 0;
            break;
          case "consumption":
            that.post_data.consumption = 0;
            break;
        }
      }
    },
    //  监测文本域的 数据 变化
    changeText(event, dataStr) {
      if (this.ifCan_save === "1") {
        this.ifEdit = true;
      }
    },
    async createMap(position) {
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
            "esri/geometry/Polygon",
            "dse/utils/BaseMapUtils",
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
            Polygon,
            BaseMapUtils,
            webMercatorUtils,
            SpatialReference
          ]) => {
            layerUtils.bindAmdClass(QueryTask, Query, GraphicsLayer, Graphic);
            that.map = new Map({});
            let baseMapUtils = new BaseMapUtils({
              map: that.map,
              mapType: "2"
            });
            baseMapUtils.loadBaseLayers(dse.baseMapLayers);
            const staticBaseUrl = dse.static_baseUrl;

            const temp_baseUrl = that.DSE.baseURL;

            let fm_url =
              "" +
              temp_baseUrl +
              "/?id=" +
              id +
              "#/pipe/leaktest/gisFrame_leaktest_fm";
            let iframe_fm =
              '<iframe src="' +
              fm_url +
              '" height="100" width="500"  scrolling="no" frameborder="0"></iframe>';

            let flow_url =
              "" +
              temp_baseUrl +
              "/?id=" +
              id +
              "#/pipe/leaktest/gisFrame_leaktest_waterFlow";
            let iframe_flow =
              '<iframe src="' +
              flow_url +
              '" height="100" width="500"  scrolling="no" frameborder="0"></iframe>';

            // 管网图层.
            let pipeUrl = that.$store.getters.get_pipe_defaultLayer
            gw2dConfig.url = pipeUrl;
            gw2dConfig.popupTemplate.visible = false;
            that.layer1 = layerUtils.loadData(that.map, gw2dConfig);
            //===================================================

            // 检修井图层.
            jxj2dConfig.url = jxjUrl;
            jxj2dConfig.popupTemplate.visible = false;
            that.layer2 = layerUtils.loadData(that.map, jxj2dConfig);
            //===================================================

            // // 消防栓图层.
            // xfs2dConfig.url = xfsUrl;
            // xfs2dConfig.popupTemplate.visible = false;
            // that.layer3 = layerUtils.loadData(that.map, xfs2dConfig);
            // //===================================================

            //  大用水户的图层
            that.bgUser_layer = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.bgUser_layer);

            //接口绘制分区的图层
            that.fetch_drawPolygon_layer = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.fetch_drawPolygon_layer);

            //阀门的图层
            fmUrl = that.$store.getters.get_fm_defaultLayer
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
                    popupTemplate: {
                      title: "阀门",
                      content: "" + iframe_fm
                    }
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
                    popupTemplate: {
                      title: "" + addressName + "流量计",
                      content: "" + iframe_flow
                    }
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
                    },
                    attributes: val.attributes
                  });

                  that.waterPress_layer.add(point_marker);
                });
              })
              .catch(error => {
                console.log(error);
              });

            // 一级分区的图层
            that.firstLayer = new GraphicsLayer({
              graphics: []
            });
            that.map.add(that.firstLayer);

            getPipeWaterUserInfo({
              id: "",
              name: "",
              areaId: "",
              pageSize: "",
              page: "",
              factoryId: that.factoryId,
              type: that.factoryType
            })
              .then(res => {
                let { data } = res;
                if (data && data.length > 0) {
                  for (let i = 0; i < data.length; i++) {
                    let capacity = data[i].WATER_PLAN;
                    let id = data[i].id;

                    let point = {
                      type: "point",
                      x: parseFloat(data[i].LGTD),
                      y: parseFloat(data[i].LTTD),
                      spatialReference: that.view.spatialReference
                    };
                    let graphic = new Graphic({
                      geometry: point,
                      attributes: {
                        capacity: capacity,
                        id: id
                      },
                      symbol: {
                        type: "picture-marker",
                        url:
                          "" +
                          staticBaseUrl +
                          "/gis_temporary_pic/normal_bigUser.png",
                        outline: {
                          color: [255, 255, 0],
                          width: 3
                        }
                      }
                    });
                    that.bgUser_layer.add(graphic);
                  }
                }
              })
              .catch(error => {
                console.log(error);
              });

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
            draw = new Draw({
              view: that.view
            });
            // 当前分区的名字
            let lev_name_ = "";
            //  当前分区所在的层级
            let lev_flag_ = "";

            /**  一级图层 的颜色
             *    color :[163, 234, 201, 0.6]
             *    outline  color :[0, 86, 31]
             *
             *
             *   二级 分区的颜色
             *   color :[244, 227, 171, 0.6]
             *   outline  color :[236,105, 65]
             *
             *   三级分区
             *   color :[253, 200, 245, 0.6]
             *   outline  color :[255, 0, 255]
             *
             */
            //  面的 颜色
            let polygon_color = [];
            //  面的描边的颜色
            let polygon_stroke = [];

            //  当前图层的  一级图层
            let firstLev_name_ = "";
            //  当前图层的 二级图层
            let secondLev_name_ = "";
            enableCreatePolygon = function(
              lev_name,
              firstLev_name,
              secondLev_name,
              lev_flag
            ) {
              lev_name_ = lev_name;
              lev_flag_ = lev_flag;

              firstLev_name_ = firstLev_name;
              secondLev_name_ = secondLev_name;

              if (lev_flag_ === "1") {
                polygon_color = [163, 234, 201, 0.6];
                polygon_stroke = [0, 86, 31];
                that.post_data.lev = "1";
              }
              if (lev_flag_ === "2") {
                polygon_color = [244, 227, 171, 0.6];
                polygon_stroke = [236, 105, 65];
                that.post_data.lev = "2";
              }
              if (lev_flag_ === "3") {
                polygon_color = [253, 200, 245, 0.6];
                polygon_stroke = [255, 0, 255];
                that.post_data.lev = "3";
              }

              let view = that.view;
              let action = draw.create("polygon");
              view.focus();
              action.on("vertex-add", drawPolygon);
              // action.on("cursor-update", drawPolygon);
              // action.on("vertex-remove", drawPolygon);
              action.on("draw-complete", drawPolygon_last);
            };

            function drawPolygon(evt) {
              let vertices = evt.vertices;
              that.post_data.zone = vertices;
              that.firstLayer.graphics.removeAll();
              let polygon = createPolygon(vertices);
              let graphic = createGraphic(polygon);
              that.firstLayer.graphics.add(graphic);

              createPointMaker(vertices);
              let area = geometryEngine.geodesicArea(
                polygon,
                "square-kilometers"
              );
              // if (area < 0) {
              //     let simplifiedPolygon = geometryEngine.simplify(polygon);
              //     if (simplifiedPolygon) {
              //         area = geometryEngine.geodesicArea(simplifiedPolygon, "K㎡");
              //     }
              // }
              labelAreas(polygon);

              // let collisionFlag = checkCollision(polygon);
              // if (!collisionFlag) {
              //     that.$message.error(
              //         "当前图层不在当前激活图层之中或者与其他同级冲突!"
              //     );
              //     that.firstLayer.removeAll();
              //     that.post_data.pipeCount = 0;
              //     that.post_data.pipeLength = 0;
              //     that.post_data.monitorList = [];
              //     that.post_data.userCount = 0;
              //     that.post_data.consumption = 0;
              //     that.post_data.area = 0;
              //     that.post_data.zone = "";
              // }
            }

            drawPolygon_last = function(evt) {
              let vertices = evt.vertices;
              that.post_data.zone = vertices;
              that.firstLayer.graphics.removeAll();
              let polygon = createPolygon(vertices);
              let graphic = createGraphic(polygon);
              that.firstLayer.graphics.add(graphic);
              createPointMaker(vertices);
              let area = geometryEngine.geodesicArea(
                polygon,
                "square-kilometers"
              );
              // if (area <0) {
              //     let simplifiedPolygon = geometryEngine.simplify(polygon);
              //     if (simplifiedPolygon) {
              //         area = geometryEngine.geodesicArea(simplifiedPolygon, "K㎡");
              //     }
              // }

              that.post_data.area = area.toFixed(2);
              // let jxj_num = count_Contain_jxjPoints(polygon);
              let waterFlow = count_Content_waterFlowPoints(polygon);
              let waterPress = count_Content_waterPress(polygon);
              let pipe = count_intersect_pipeLine(polygon);
              let contain_pipeLen = count_Contain_pipeLine(polygon);
              let bgUser = count_Content_bgUser(polygon);
              that.post_data.pipeCount = pipe.sum_count;
              that.post_data.pipeLength = pipe.sum_count + contain_pipeLen;

              // console.log("++++++++++++++++++++++++++++++++++++++++++++++++");
              that.post_data.monitorList = [
                ...that.post_data.monitorList,
                ...waterFlow.devs,
                ...waterPress.devs
              ];
              //提交校验 时 用户会莫名其妙的 为零的问题
              if (bgUser.userCount !== 0) {
                that.post_data.userCount = bgUser.userCount;
                that.post_data.consumption = bgUser.sum_waterCapacity;
              }

              labelAreas(polygon);

              let collisionFlag = checkCollision(polygon);

              // console.log(collisionFlag)
              if (!collisionFlag) {
                that.$message.error(
                  "当前图层不在当前激活图层之中或者与其他同级冲突!"
                );
                that.firstLayer.removeAll();
                that.post_data.pipeCount = 0;
                that.post_data.pipeLength = 0;
                that.post_data.monitorList = [];
                that.post_data.userCount = 0;
                that.post_data.consumption = 0;
                that.post_data.area = 0;
                that.post_data.zone = "";
              }

              that.ifDoubleClick = true;
            };

            //构造一个 面要素
            function createPolygon(vertices) {
              return new Polygon({
                rings: vertices,
                attributes: {
                  id: 1
                },
                spatialReference: that.view.spatialReference
              });
            }
            //检查当前绘制的图层 与 同级别的图层是否碰撞
            function checkCollision(polygonGeometry) {
              let flag = true;
              let Layer = that.fetch_drawPolygon_layer;
              for (let i = 0; i < Layer.graphics.items.length; i++) {
                //检查 碰撞一级图层
                if (lev_flag_ === "1") {
                  let temp_ploygon = Layer.graphics.items[i].geometry;
                  if (
                    geometryEngine.intersects(polygonGeometry, temp_ploygon) ||
                    geometryEngine.contains(polygonGeometry, temp_ploygon)
                  ) {
                    flag = false;
                    break;
                  }
                }

                //判断   一级图层下的二级图层
                if (lev_flag_ === "2") {
                  let parentName =
                    Layer.graphics.items[i].attributes.firstLev_name;
                  let sub_parentName =
                    Layer.graphics.items[i].attributes.secondLev_name;
                  if (parentName === firstLev_name_ && sub_parentName === "") {
                    let temp_ploygon = Layer.graphics.items[i].geometry;
                    if (
                      !geometryEngine.contains(temp_ploygon, polygonGeometry)
                    ) {
                      flag = false;
                      break;
                    }
                  }
                  if (parentName === firstLev_name_ && sub_parentName !== "") {
                    let temp_ploygon = Layer.graphics.items[i].geometry;
                    if (
                      geometryEngine.intersects(
                        temp_ploygon,
                        polygonGeometry
                      ) ||
                      geometryEngine.contains(temp_ploygon, polygonGeometry)
                    ) {
                      flag = false;
                      break;
                    }
                  }
                }
                //判断   一级图层下的二级图层  下的 三级图层
                if (lev_flag_ === "3") {
                  let first_name =
                    Layer.graphics.items[i].attributes.firstLev_name;
                  let second_name =
                    Layer.graphics.items[i].attributes.secondLev_name;
                  let type = Layer.graphics.items[i].attributes.type;
                  let temp_ploygon = Layer.graphics.items[i].geometry;

                  // if (
                  //   Layer.graphics.items[i].attributes.firstLev_name !== "" &&
                  //   Layer.graphics.items[i].attributes.secondLev_name !== ""
                  // ) {
                  //   if (
                  //     !geometryEngine.contains(temp_ploygon, polygonGeometry)
                  //   ) {
                  //     flag = false;
                  //     break;
                  //   }
                  // }

                  if (first_name === firstLev_name_ && type === "2") {
                    if (
                      !geometryEngine.contains(temp_ploygon, polygonGeometry)
                    ) {
                      flag = false;
                      break;
                    }
                  }

                  if (first_name === firstLev_name_ && type === "3") {
                    if (
                      geometryEngine.intersects(
                        temp_ploygon,
                        polygonGeometry
                      ) ||
                      geometryEngine.contains(temp_ploygon, polygonGeometry)
                    ) {
                      flag = false;
                      break;
                    }
                  }
                }
              }
              return flag;
            }

            // 构造一个 点要素
            function createPointMaker(vertices) {
              let temp_arr = vertices;
              for (let i = 0; i < temp_arr.length; i++) {
                let point = {
                  type: "point",
                  x: temp_arr[i][0],
                  y: temp_arr[i][1],
                  spatialReference: that.view.spatialReference
                };
                let point_marker = new Graphic({
                  geometry: point,
                  symbol: {
                    type: "picture-marker",
                    url:
                      "" +
                      staticBaseUrl +
                      "/gis_temporary_pic/gis_drawPoint.svg",
                    outline: {
                      color: [255, 255, 0],
                      width: 3
                    }
                  }
                });
                that.firstLayer.graphics.add(point_marker);
              }
            }

            //  获取 检修井的个数
            function count_Contain_jxjPoints(polygonGeometry) {
              let sum = 0;
              let Layer = that.layer2;
              for (let i = 0; i < Layer.graphics.items.length; i++) {
                let point = Layer.graphics.items[i].geometry;
                if (polygonGeometry.contains(point)) {
                  sum += 1;
                }
              }
              return sum;
            }
            // 获取 流量计的个数
            function count_Content_waterFlowPoints(polygonGeometry) {
              let sum = 0;
              let temp_arr = [];
              let Layer = that.waterFlow_layer;
              for (let i = 0; i < Layer.graphics.items.length; i++) {
                let point = Layer.graphics.items[i].geometry;
                if (polygonGeometry.contains(point)) {
                  sum += 1;
                  temp_arr.push({
                    type: "2",
                    id: Layer.graphics.items[i].attributes.MONITOR_PID
                  });
                }
              }
              temp_arr = _.uniqBy(temp_arr, "id");
              return {
                sum: sum,
                devs: temp_arr
              };
            }
            //  获取 水压计的个数
            function count_Content_waterPress(polygonGeometry) {
              let sum = 0;
              let temp_arr = [];
              let Layer = that.waterPress_layer;
              for (let i = 0; i < Layer.graphics.items.length; i++) {
                let point = Layer.graphics.items[i].geometry;
                if (polygonGeometry.contains(point)) {
                  sum += 1;
                  temp_arr.push({
                    type: "3",
                    id: Layer.graphics.items[i].attributes.MONITOR_PID
                  });
                }
              }
              temp_arr = _.uniqBy(temp_arr, "id");
              return {
                sum: sum,
                devs: temp_arr
              };
            }

            let sp4326 = new SpatialReference({
              wkid: 4326
            });
            //获取  相交 管线的长度
            let sum_len = 0;

            function count_intersect_pipeLine(polygonGeometry) {
              let sum_count = 0;
              let Layer = that.layer1;
              for (let i = 0; i < Layer.graphics.items.length; i++) {
                let line = Layer.graphics.items[i].geometry;
                let polyline_ = new Polyline({
                  paths: line.paths,
                  spatialReference: sp4326
                });
                polyline_ = webMercatorUtils.geographicToWebMercator(polyline_);

                if (geometryEngine.intersects(polygonGeometry, polyline_)) {
                  sum_count += 1;
                  sum_len += parseFloat(
                    Layer.graphics.items[i].attributes.PIPE_LENGTH
                  );
                }
              }
              return {
                sum_count: sum_count,
                sum_len: sum_len
              };
            }
            //获取  包含 管线的长度
            function count_Contain_pipeLine(polygonGeometry) {
              let Layer = that.layer1;
              for (let i = 0; i < Layer.graphics.items.length; i++) {
                let line = Layer.graphics.items[i].geometry;
                let polyline_ = new Polyline({
                  paths: line.paths,
                  spatialReference: sp4326
                });
                polyline_ = webMercatorUtils.geographicToWebMercator(polyline_);

                if (geometryEngine.contains(polygonGeometry, polyline_)) {
                  sum_len += parseFloat(
                    Layer.graphics.items[i].attributes.PIPE_LENGTH
                  );
                }
              }
              return sum_len;
            }

            //  获取 水压计的个数
            function count_Content_bgUser(polygonGeometry) {
              let userCount = 0;
              let sum_waterCapacity = 0;
              let Layer = that.bgUser_layer;
              for (let i = 0; i < Layer.graphics.items.length; i++) {
                let point = Layer.graphics.items[i].geometry;
                let temp_capacity = Layer.graphics.items[i].attributes.capacity;
                if (polygonGeometry.contains(point)) {
                  userCount += 1;
                  sum_waterCapacity +=
                    sum_waterCapacity + parseFloat(temp_capacity);
                }
              }
              return {
                userCount: userCount,
                sum_waterCapacity: sum_waterCapacity
              };
            }
            //创建一个面图层
            function createGraphic(polygon) {
              let graphic = new Graphic({
                geometry: polygon,
                symbol: {
                  type: "simple-fill",
                  color: polygon_color,
                  style: "solid",
                  outline: {
                    color: polygon_stroke,
                    width: 2,
                    style: "dash-dot"
                  }
                }
              });
              return graphic;
            }
            //面图层的 文本
            function labelAreas(geom) {
              let graphic = new Graphic({
                geometry: geom.centroid,
                symbol: {
                  type: "text",
                  color: "black",
                  haloColor: "black",
                  haloSize: "1px",
                  text: "" + lev_name_,
                  xoffset: 3,
                  yoffset: 3,
                  font: {
                    size: 14,
                    family: "sans-serif"
                  }
                }
              });
              that.firstLayer.graphics.add(graphic);
            }

            /**  一级图层 的颜色
             *    color :[163, 234, 201, 0.6]
             *    outline  color :[0, 86, 31]
             *
             *
             *   二级 分区的颜色
             *   color :[244, 227, 171, 0.6]
             *   outline  color :[236,105, 65]
             *
             *   三级分区
             *   color :[253, 200, 245, 0.6]
             *   outline  color :[255, 0, 255]
             *
             */
            fetch_drawPloygon = function(arr) {
              if (!arr || arr.length == 0) {
                that.fetch_drawPolygon_layer.removeAll();
                return;
              }
              if (that.fetch_drawPolygon_layer) {
                that.fetch_drawPolygon_layer.removeAll();
              }
              for (let i = 0; i < arr.length; i++) {
                let colorJSON = {
                  polygon_color: [163, 234, 201, 0.6],
                  polygon_stroke: [0, 86, 31],
                  type: "1",
                  name: arr[i].label,
                  firstLev_name: arr[i].label,
                  secondLev_name: ""
                };
                draw_ploygon(colorJSON, arr[i].zone);
                if (arr[i].children && arr[i].children.length > 0) {
                  for (let j = 0; j < arr[i].children.length; j++) {
                    let colorJSON = {
                      polygon_color: [244, 227, 171, 0.6],
                      polygon_stroke: [236, 105, 65],
                      type: "2",
                      name: arr[i].children[j].label,
                      firstLev_name: arr[i].label,
                      secondLev_name: arr[i].children[j].label
                    };
                    draw_ploygon(colorJSON, arr[i].children[j].zone);
                    if (
                      arr[i].children[j].children &&
                      arr[i].children[j].children.length > 0
                    ) {
                      for (
                        let k = 0;
                        k < arr[i].children[j].children.length;
                        k++
                      ) {
                        let colorJSON = {
                          polygon_color: [253, 200, 245, 0.6],
                          polygon_stroke: [255, 0, 255],
                          type: "3",
                          name: arr[i].children[j].children[k].label,
                          firstLev_name: arr[i].label,
                          secondLev_name: arr[i].children[j].label
                        };
                        draw_ploygon(
                          colorJSON,
                          arr[i].children[j].children[k].zone
                        );
                      }
                    }
                  }
                }
              }
            };
            that.getAreaTree_();

            function draw_ploygon(colorJSON, data) {
              let vertice = JSON.parse(data);
              let polygon = new Polygon({
                rings: vertice,
                spatialReference: that.view.spatialReference
              });

              let attr = {
                type: colorJSON.type,
                name: colorJSON.name,
                firstLev_name: "",
                secondLev_name: ""
              };
              if (colorJSON.firstLev_name) {
                attr.firstLev_name = colorJSON.firstLev_name;
              } else {
                attr.firstLev_id = "";
              }
              if (colorJSON.secondLev_name) {
                attr.secondLev_name = colorJSON.secondLev_name;
              } else {
                attr.secondLev_name = "";
              }

              let graphic = new Graphic({
                geometry: polygon,
                attributes: attr,
                symbol: {
                  type: "simple-fill",
                  color: colorJSON.polygon_color,
                  style: "solid",
                  outline: {
                    color: colorJSON.polygon_stroke,
                    width: 2,
                    style: "dash-dot"
                  }
                }
              });
              that.fetch_drawPolygon_layer.add(graphic);
              let drawLabel = new Graphic({
                geometry: polygon.centroid,
                attributes: {
                  type: colorJSON.type,
                  name: colorJSON.name,
                  firstLev_name: "",
                  secondLev_name: ""
                },
                symbol: {
                  type: "text",
                  color: "black",
                  haloColor: "black",
                  haloSize: "1px",
                  text: "" + colorJSON.name,
                  xoffset: 3,
                  yoffset: 3,
                  font: {
                    size: 14,
                    family: "sans-serif"
                  }
                }
              });
              that.fetch_drawPolygon_layer.add(drawLabel);
            }

            fetch_draw_firstPloygon = function(arr) {
              if (!arr || arr.length == 0) {
                that.fetch_drawPolygon_layer.removeAll();
                return;
              }
              if (that.fetch_drawPolygon_layer) {
                that.fetch_drawPolygon_layer.removeAll();
              }
              for (let i = 0; i < arr.length; i++) {
                let colorJSON = {
                  polygon_color: [163, 234, 201, 0.6],
                  polygon_stroke: [0, 86, 31],
                  type: "1",
                  name: arr[i].label,
                  firstLev_name: arr[i].label,
                  secondLev_name: ""
                };
                draw_ploygon(colorJSON, arr[i].zone);
              }
            };

            fetch_draw_secondPloygon = function(arr, first_index) {
              if (!arr || arr.length == 0) {
                that.fetch_drawPolygon_layer.removeAll();
                return;
              }
              if (that.fetch_drawPolygon_layer) {
                that.fetch_drawPolygon_layer.removeAll();
              }
              for (let i = 0; i < arr.length; i++) {
                let colorJSON = {
                  polygon_color: [163, 234, 201, 0.6],
                  polygon_stroke: [0, 86, 31],
                  type: "1",
                  name: arr[i].label,
                  firstLev_name: arr[i].label,
                  secondLev_name: ""
                };
                if (i === first_index) {
                  draw_ploygon(colorJSON, arr[i].zone);
                  if (arr[i].children && arr[i].children.length > 0) {
                    for (let j = 0; j < arr[i].children.length; j++) {
                      let colorJSON = {
                        polygon_color: [244, 227, 171, 0.6],
                        polygon_stroke: [236, 105, 65],
                        type: "2",
                        name: arr[i].children[j].label,
                        firstLev_name: arr[i].label,
                        secondLev_name: arr[i].children[j].label
                      };
                      draw_ploygon(colorJSON, arr[i].children[j].zone);
                    }
                  }
                }
              }
            };

            fetch_draw_threePloygon = function(arr, first_index, second_index) {
              if (!arr || arr.length == 0) {
                that.fetch_drawPolygon_layer.removeAll();
                return;
              }
              if (that.fetch_drawPolygon_layer) {
                that.fetch_drawPolygon_layer.removeAll();
              }
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].children && arr[i].children.length > 0) {
                  for (let j = 0; j < arr[i].children.length; j++) {
                    let colorJSON = {
                      polygon_color: [244, 227, 171, 0.6],
                      polygon_stroke: [236, 105, 65],
                      type: "2",
                      name: arr[i].children[j].label,
                      firstLev_name: arr[i].label,
                      secondLev_name: arr[i].children[j].label
                    };
                    if (first_index === i && second_index === j) {
                      draw_ploygon(colorJSON, arr[i].children[j].zone);
                      if (
                        arr[i].children[j].children &&
                        arr[i].children[j].children.length > 0
                      ) {
                        for (
                          let k = 0;
                          k < arr[i].children[j].children.length;
                          k++
                        ) {
                          let colorJSON = {
                            polygon_color: [253, 200, 245, 0.6],
                            polygon_stroke: [255, 0, 255],
                            type: "3",
                            name: arr[i].children[j].children[k].label,
                            firstLev_name: arr[i].label,
                            secondLev_name: arr[i].children[j].label
                          };
                          draw_ploygon(
                            colorJSON,
                            arr[i].children[j].children[k].zone
                          );
                        }
                      }
                    }
                  }
                }
              }
            };

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
                    type: "simple-marker",
                    style: "circle",
                    color: [255, 250, 205, 0.3],
                    size: "60px",
                    outline: {
                      color: "yellow",
                      width: 1
                    }
                  }
                });
                that.view.graphics.add(tempGra);
                let params = window.graphic.attributes;
                let temp_iframedata = {
                  areaId: that.setttingDev.areaId,
                  monitorId: ""
                };
                if (params.MONITOR_PID) {
                  temp_iframedata.monitorId = params.MONITOR_PID;
                } else {
                  temp_iframedata.monitorId = params.ID;
                }
                dse.globalData = temp_iframedata;
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
    commit() {
      let that = this;
      //  "1"为第一级地图、 “2”为 第二级地图、“3” 为 第三级地图
      if (this.ifCan_save === "1") {
        return;
      }
      if (this.post_data.name === "") {
        this.$message.error("分区名称必填!");
        return;
      }

      if (this.post_data.zone.length > 0) {
        if (!this.ifDoubleClick) {
          draw.complete();
        }
      }

      if (this.post_data.monitorList.length === 0) {
        this.$message.error("至少指定一个进水和出水流量计!");
        return;
      }

      // 拦截是否指定了  进水流量计和出水流量计
      let temp_monitorList = this.post_data.monitorList;
      // 至少有一个 进水流量计和出水流量计
      let temp_inOrOut_Flow = 0;
      for (let i = 0; i < temp_monitorList.length; i++) {
        if (temp_monitorList[i].type == "0") {
          temp_inOrOut_Flow += 1;
        }
        if (temp_monitorList[i].type == "1") {
          temp_inOrOut_Flow += 1;
        }
      }

      if (temp_inOrOut_Flow < 2) {
        that.$message.error("至少指定一个进水和出水流量计!");
        return;
      }

      if (this.zoonArea.length > 0) {
        let firstIndex_max = this.zoonArea.length - 1;
        if (this.zoonArea[firstIndex_max].label === "") {
          this.changCheck_flag = true;
          this.polygonModelFlag = true;
          this.current_changeCheck.firstIndex = firstIndex_max;
          return;
        }
      }

      let activeFirst_max = this.first_lev_index;
      if (this.zoonArea[activeFirst_max].children.length > 0) {
        let secondIndex_max =
          this.zoonArea[activeFirst_max].children.length - 1;
        if (
          this.zoonArea[activeFirst_max].children[secondIndex_max].label === ""
        ) {
          this.changCheck_flag = true;
          this.polygonModelFlag = true;
          this.current_changeCheck.firstIndex = activeFirst_max;
          this.current_changeCheck.secondIndex = secondIndex_max;
          return;
        }
      }
      let activeSecond_max = this.second_lev_index;
      if (
        activeSecond_max &&
        this.zoonArea[activeFirst_max].children[activeSecond_max].children
          .length > 0
      ) {
        let threeIndex_max =
          this.zoonArea[activeFirst_max].children[activeSecond_max].children
            .length - 1;
        if (
          this.zoonArea[activeFirst_max].children[activeSecond_max].children[
            threeIndex_max
          ].label === ""
        ) {
          this.changCheck_flag = true;
          this.polygonModelFlag = true;
          this.current_changeCheck.firstIndex = activeFirst_max;
          this.current_changeCheck.secondIndex = activeSecond_max;
          this.current_changeCheck.threeIndex = threeIndex_max;
          return;
        }
      }

      this.saveType = true;
      let flag = null;
      if (!this.zoonArea.length > 0 && this.zoonArea[this.first_lev_index]) {
        return;
      }
      if (this.first_lev_index !== null) {
        flag = "1";
      }
      if (this.second_lev_index !== null) {
        flag = "2";
      }
      if (this.three_lev_index !== null) {
        flag = "3";
      }
      let name = this.post_data.name;
      this.temp_levFlag = flag;
      this.temp_drawName = name;
      if (this.post_data.zone === "") {
        this.polygonModelFlag = true;
        return;
      }

      let temp_userCount = this.post_data.userCount
        ? parseInt(that.post_data.userCount)
        : 0;

      let temp_valveCount = this.post_data.valveCount
        ? parseInt(that.post_data.valveCount)
        : 0;
      let temp_flowCount = this.post_data.flowCount
        ? parseInt(that.post_data.flowCount)
        : 0;
      let temp_consumption = this.post_data.consumption
        ? parseInt(that.post_data.consumption)
        : 0;
      let temp_pipeLength = this.post_data.pipeLength
        ? parseFloat(that.post_data.pipeLength)
        : 0;
      let temp_pipeCount = this.post_data.pipeCount
        ? parseInt(that.post_data.pipeCount)
        : 0;
      that.post_data.userCount = temp_userCount;
      that.post_data.valveCount = temp_valveCount;
      that.post_data.flowCount = temp_flowCount;
      that.post_data.consumption = temp_consumption;
      that.post_data.pipeCount = temp_pipeCount;
      that.post_data.pipeLength = parseFloat(temp_pipeLength.toFixed(2));

      let temp_flowHigh = this.post_data.flowHigh;
      let temp_flowLow = this.post_data.flowLow;
      if (temp_flowHigh && temp_flowLow) {
        if (parseFloat(temp_flowLow) > parseFloat(temp_flowHigh)) {
          that.$message.error("流量下限不能大于流量上限呦~~！");
          return;
        }
      }

      that.post_data.flowHigh = that.post_data.flowHigh
        ? parseFloat(that.post_data.flowHigh).toFixed(2)
        : null;
      that.post_data.flowLow = that.post_data.flowLow
        ? parseFloat(that.post_data.flowLow).toFixed(2)
        : null;

      let temp_pressHigh = this.post_data.pressHigh;
      let temp_pressLow = this.post_data.pressLow;
      if (temp_pressHigh && temp_pressLow) {
        if (parseFloat(temp_pressLow) > parseFloat(temp_pressHigh)) {
          that.$message.error("压力下限不能大于压力上限呦~~！");
          return;
        }
      }
      that.post_data.pressHigh = that.post_data.pressHigh
        ? parseFloat(that.post_data.pressHigh).toFixed(2)
        : null;
      that.post_data.pressLow = that.post_data.pressLow
        ? parseFloat(that.post_data.pressLow).toFixed(2)
        : null;

      that.post_data.companyId = that.factoryId;

      let params = this.post_data;
      
      this.addArea_(params);
    },
    getNodeData(data) {
      let temp_str = data.label;
      if (temp_str.indexOf("集团") > -1) {
        this.$message.error("集团不可见数据呦~");
        // this.factoryId = this.tree[0].children[0].id;
        return;
      }
      this.factoryId = data.id;
      // this.factoryType = data.type;
      this.post_data.companyId = data.id;
      this.getAreaTree_list();
      this.getAreaTree_();
      this.second_lev_index = null;
      this.three_lev_index = null;
    },
    closeLegend(flag) {
      this.showLegend_flag = true;
    },
    //  点击当前项之前，看看是否有需要保存的一项没有保存，如果没有保存，就删除掉
    verify_save_item() {
      let temp_firstLev_index = this.first_lev_index;
      let temp_secondLev_index = this.second_lev_index;
      let temp_threeLev_index = this.three_lev_index;
      let temp_verify_flag = null; //  判断当前激活项是否有  temp_add 是否为 true
      let flag = null;
      if (temp_firstLev_index !== null) {
        flag = "1";
      }
      if (temp_secondLev_index !== null) {
        flag = "2";
      }
      if (temp_threeLev_index !== null) {
        flag = "3";
      }

      if (flag === "1") {
        temp_verify_flag = this.zoonArea[temp_firstLev_index].temp_add?this.zoonArea[temp_firstLev_index].temp_add:false;
        let editFlag = this.zoonArea[temp_firstLev_index].ifEdit;
        if (!editFlag && temp_verify_flag) {
          this.zoonArea.splice(temp_firstLev_index, 1);
          this.first_lev_index =
            this.first_lev_index - 1 < 0 ? 0 : this.first_lev_index - 1;
        }
      }
      if (flag === "2") {
        temp_verify_flag = this.zoonArea[temp_firstLev_index].children[
          temp_secondLev_index
        ].temp_add? this.zoonArea[temp_firstLev_index].children[
          temp_secondLev_index
        ].temp_add:false;
        let editFlag = this.zoonArea[temp_firstLev_index].children[
          temp_secondLev_index
        ].ifEdit;

        if (!editFlag && temp_verify_flag) {
          this.zoonArea[temp_firstLev_index].children.splice(
            temp_secondLev_index,
            1
          );
          this.second_lev_index =
            this.second_lev_index - 1 < 0 ? 0 : this.second_lev_index - 1;
          if (this.zoonArea[temp_firstLev_index].children.length > 0) {
            this.second_lev_index = this.second_lev_index - 1;
          } else {
            this.second_lev_index = null;
          }
        }
      }

      if (flag === "3") {
        temp_verify_flag = this.zoonArea[temp_firstLev_index].children[
          temp_secondLev_index
        ].children[temp_threeLev_index].temp_add? this.zoonArea[temp_firstLev_index].children[
          temp_secondLev_index
        ].children[temp_threeLev_index].temp_add:false;
        let editFlag = this.zoonArea[temp_firstLev_index].children[
          temp_secondLev_index
        ].children[temp_threeLev_index].ifEdit;
        if (!editFlag && temp_verify_flag) {
          this.zoonArea[temp_firstLev_index].children[
            temp_secondLev_index
          ].children.splice(temp_threeLev_index, 1);
          if (
            this.zoonArea[temp_firstLev_index].children[temp_secondLev_index]
              .children.length > 0
          ) {
            this.three_lev_index = this.three_lev_index - 1;
          } else {
            this.three_lev_index = null;
          }
        }
      }
    },
    //第一层
    add_firstLev() {
      let that = this;
      if (this.zoonArea.length > 0) {
        let firstIndex_max = this.zoonArea.length - 1;
        if (this.zoonArea[firstIndex_max].label === "") {
          return;
        }
        let activeFirst_max = this.first_lev_index;
        if (this.zoonArea[activeFirst_max].children.length > 0) {
          let secondIndex_max =
            this.zoonArea[activeFirst_max].children.length - 1;
          if (
            this.zoonArea[activeFirst_max].children[secondIndex_max].label ===
            ""
          ) {
            return;
          }
        }
        let activeSecond_max = this.second_lev_index;

        if (
          activeSecond_max &&
          this.zoonArea[activeFirst_max].children[activeSecond_max].children
            .length > 0
        ) {
          let threeIndex_max =
            this.zoonArea[activeFirst_max].children[activeSecond_max].children
              .length - 1;
          if (
            this.zoonArea[activeFirst_max].children[activeSecond_max].children[
              threeIndex_max
            ].label === ""
          ) {
            return;
          }
        }
      }
      if(this.zoonArea.length>0){
        this.verify_save_item();
      }
      this.post_data = {
        companyId: "",
        pid: "",
        code: "",
        name: "",
        lev: "",
        zone: "",
        area: 0,
        userCount: "",
        pipeLength: "",
        pipeInfo: "",
        pipeCount: "",
        valveCount: "",
        flowCount: "",
        consumption: "",
        monitorList: [],
        id: "",
        flowLow: null,
        flowHigh: null,
        pressLow: null,
        pressHigh: null
      };

      let str = uuid_(32);
      this.post_data.id = str;
      this.zoonArea.push({
        label: "",
        ifEdit: true,
        id: str,
        children: [],
        temp_add: true // 判断当前项是否保存
      });
      let max_len = this.zoonArea.length;
      // this.current_changeCheck.firstIndex=
      this.first_lev_index = max_len - 1;
      // this.current_changeCheck.secondIndex= null
      // this.current_changeCheck.threeIndex= null
      // 清除二级和三级数据
      this.second_lev_index = null;
      this.three_lev_index = null;
      this.sub_secondLev = [];
      this.sub_threeLev = [];

      this.showThisArr(this.first_lev_index);
      this.dynamicChangeCheck = false;

      this.setttingDev.areaId = str;
      this.first_with4_index = Math.floor(max_len / 4);
      if (max_len > 1 && (max_len - 1) % 4 == 0) {
        this.go_left_first = this.go_left_first + 1;
        this.first_prev_next = this.go_left_first;
      }
      that.ifCan_save = "2";
      that.sum_postData_count = 0;
      this.only_showFirstLev();
    },
    only_showFirstLev() {
      let that = this;
      let temp_factoryId = this.factoryId;
      getAreaTree({
        companyId: temp_factoryId
      })
        .then(res => {
          let { data } = res;
          fetch_draw_firstPloygon(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    verifyStr_first(event) {
      let val = event.target.value;
      let max_len = this.zoonArea.length - 1;
      // if (val.length > 5) {
      //   this.zoonArea[max_len].label = val.substring(0, 5);
      // } else if (val === "") {
      //   this.zoonArea[max_len].label = "DMA-1" + max_len;
      // }

      this.zoonArea[max_len].label = val;
      this.zoonArea[max_len].ifEdit = false;
      this.temp_drawName = this.post_data.code = this.post_data.name = this.zoonArea[
        max_len
      ].label;
    },
    configThisName_firstLev() {
      let max_len = this.zoonArea.length - 1;
      let val = this.zoonArea[max_len].label;
      // if (val.length > 5) {
      //   this.zoonArea[max_len].label = val.substring(0, 5);
      // } else if (val === "") {
      //   this.zoonArea[max_len].label = "DMA-1" + max_len;
      // }
      // this.zoonArea[max_len].label = val

      this.zoonArea[max_len].ifEdit = false;
      this.temp_drawName = this.post_data.code = this.post_data.name = this.zoonArea[
        max_len
      ].label;
    },
    select_firstLev(i, v) {
      let that = this;
      if (
        this.$refs.firstValue &&
        this.$refs.firstValue.length > 0 &&
        this.$refs.firstValue[0].innerText === "" &&
        i !== 0 &&
        i !== this.zoonArea.length - 1
      ) {
        this.dynamicChangeCheck = true;
      }
      if (!v.ifEdit) {
        that.sum_postData_count = 0;
        this.ifEdit = false;
        this.ifCan_save = "1";
        this.verify_save_item();
      } else {
        this.dynamicChangeCheck = false;
      }
      let flag = this.dynamicChangeCheck;
      if (flag) {
        if (this.zoonArea.length > 0) {
          let firstIndex_max = this.zoonArea.length - 1;
          if (this.zoonArea[firstIndex_max].label === "") {
            this.changCheck_flag = true;
            this.polygonModelFlag = true;
            this.current_changeCheck.firstIndex = firstIndex_max;
            this.current_changeCheck.secondIndex = null;
            this.current_changeCheck.threeIndex = null;
            return;
          }
        }

        let activeFirst_max = this.first_lev_index;
        if (this.zoonArea[activeFirst_max].children.length > 0) {
          let secondIndex_max =
            this.zoonArea[activeFirst_max].children.length - 1;
          if (
            this.zoonArea[activeFirst_max].children[secondIndex_max].label ===
            ""
          ) {
            this.changCheck_flag = true;
            this.polygonModelFlag = true;
            this.current_changeCheck.firstIndex = activeFirst_max;
            this.current_changeCheck.secondIndex = secondIndex_max;
            this.current_changeCheck.threeIndex = null;
            return;
          }
        }
        let activeSecond_max = this.second_lev_index;
        if (
          activeSecond_max &&
          this.zoonArea[activeFirst_max].children[activeSecond_max].children
            .length > 0
        ) {
          let threeIndex_max =
            this.zoonArea[activeFirst_max].children[activeSecond_max].children
              .length - 1;
          if (
            this.zoonArea[activeFirst_max].children[activeSecond_max].children[
              threeIndex_max
            ].label === ""
          ) {
            this.changCheck_flag = true;
            this.polygonModelFlag = true;
            this.current_changeCheck.firstIndex = activeFirst_max;
            this.current_changeCheck.secondIndex = activeSecond_max;
            this.current_changeCheck.threeIndex = threeIndex_max;
            return;
          }
        }
      }

      this.first_lev_index = i;
      let count = i % 4;
      this.firstBorder_index = count;
      this.setttingDev.areaId = this.zoonArea[i].id;
      this.getAreaTree_();
      this.getAreaInfo_(this.zoonArea[i].id);

      if (this.zoonArea[i].children.length > 0) {
        this.sub_secondLev = this.zoonArea[i].children;
      } else {
        this.sub_secondLev = [];
      }
      if (
        this.zoonArea[i].children.length > 0 &&
        this.zoonArea[i].children[0].children &&
        this.zoonArea[i].children[0].children.length > 0
      ) {
        this.sub_threeLev = this.zoonArea[i].children[0].children;
      } else {
        this.sub_threeLev = [];
      }
      this.temp_drawName = this.post_data.code = this.post_data.name = this.zoonArea[
        i
      ].label;

      //  重置其他图层当前的激活装填
      this.second_lev_index = null;
      this.three_lev_index = null;
      this.dynamicChangeCheck = true;
    },
    prev_firstLev() {
      if (this.first_prev_next > 0) {
        this.first_prev_next = this.first_prev_next - 1;
      }
    },
    next_firstLev() {
      let max_index = this.go_left_first;
      if (this.first_prev_next < max_index) {
        this.first_prev_next = this.first_prev_next + 1;
      }
    },
    //第二层地图
    add_secondLev() {
      let that = this;

      if (this.zoonArea.length === 0) {
        this.$message.error("您还未指定一级分区!");
        return;
      }

      let firstIndex_max = this.zoonArea.length - 1;
      if (this.zoonArea[firstIndex_max].label === "") {
        return;
      }
      let activeFirst_max = this.first_lev_index;
      if (this.zoonArea[activeFirst_max].children.length > 0) {
        let secondIndex_max =
          this.zoonArea[activeFirst_max].children.length - 1;
        if (
          this.zoonArea[activeFirst_max].children[secondIndex_max].label === ""
        ) {
          return;
        }
      }
      let activeSecond_max = this.second_lev_index;
      if (
        activeSecond_max &&
        this.zoonArea[activeFirst_max].children[activeSecond_max].children
          .length > 0
      ) {
        let threeIndex_max =
          this.zoonArea[activeFirst_max].children[activeSecond_max].children
            .length - 1;
        if (
          this.zoonArea[activeFirst_max].children[activeSecond_max].children[
            threeIndex_max
          ].label === ""
        ) {
          return;
        }
      }
      this.verify_save_item();
      let temp_firstLev_index = this.first_lev_index;
      this.post_data = {
        companyId: "",
        pid: "",
        code: "",
        name: "",
        lev: "",
        zone: "",
        area: 0,
        userCount: "",
        pipeLength: "",
        pipeInfo: "",
        pipeCount: "",
        valveCount: "",
        flowCount: "",
        consumption: "",
        monitorList: [],
        id: "",
        flowLow: null,
        flowHigh: null,
        pressLow: null,
        pressHigh: null
      };

      let str = uuid_(32);
      this.post_data.id = str;
      this.zoonArea[temp_firstLev_index].children.push({
        label: "",
        ifEdit: true,
        id: str,
        children: [],
        temp_add: true // 判断当前项是否保存
      });
      this.sub_secondLev = this.zoonArea[temp_firstLev_index].children;

      // this.current_changeCheck.firstIndex= this.first_lev_index
      // this.current_changeCheck.secondIndex=

      this.second_lev_index = this.sub_secondLev.length - 1;
      // 清除三级菜单中的数据
      this.three_lev_index = null;
      this.sub_threeLev = [];
      this.showThisArr(this.first_lev_index);

      // this.current_changeCheck.threeIndex= null

      this.dynamicChangeCheck = false;
      this.post_data.id = str;

      this.setttingDev.areaId = str;
      let max_len = this.zoonArea[temp_firstLev_index].children.length;
      this.second_with4_index = Math.floor(max_len / 4);
      if (max_len > 1 && (max_len - 1) % 4 == 0) {
        this.go_left_second = this.go_left_second + 1;
        this.second_prev_next = this.go_left_second;
      }
      that.ifCan_save = "2";
      that.sum_postData_count = 0;
      this.only_showSecondLev(temp_firstLev_index);
    },
    only_showSecondLev(firstLev_index) {
      let that = this;
      let temp_factoryId = this.factoryId;
      getAreaTree({
        companyId: temp_factoryId
      })
        .then(res => {
          let { data } = res;
          fetch_draw_secondPloygon(data, firstLev_index);
        })
        .catch(error => {
          console.log(error);
        });
    },
    verifyStr_second(event) {
      let val = event.target.value;
      let temp_firstLev_index = this.first_lev_index;

      let max_len = this.zoonArea[temp_firstLev_index].children.length - 1;
      // if (val.length > 5) {
      //   this.zoonArea[temp_firstLev_index].children[
      //     max_len
      //   ].label = val.substring(0, 5);
      // } else if (val === "") {
      //   this.zoonArea[temp_firstLev_index].children[max_len].label =
      //     "DMA-1" + max_len;
      // }

      this.zoonArea[temp_firstLev_index].children[max_len].label = val;

      this.zoonArea[temp_firstLev_index].children[max_len].ifEdit = false;
      this.temp_drawName = this.post_data.name = this.zoonArea[
        temp_firstLev_index
      ].children[max_len].label;
      this.post_data.code = this.zoonArea[temp_firstLev_index].children[
        max_len
      ].label;
    },
    configThisName_secondLev() {
      let temp_firstLev_index = this.first_lev_index;

      let max_len = this.zoonArea[temp_firstLev_index].children.length - 1;
      let val = this.zoonArea[temp_firstLev_index].children[max_len].label;
      // if (val.length > 5) {
      //   this.zoonArea[temp_firstLev_index].children[
      //     max_len
      //   ].label = val.substring(0, 5);
      // } else if (val === "") {
      //   this.zoonArea[temp_firstLev_index].children[max_len].label =
      //     "DMA-1" + max_len;
      // }
      this.zoonArea[temp_firstLev_index].children[max_len].ifEdit = false;
      this.temp_drawName = this.post_data.code = this.post_data.name = this.zoonArea[
        temp_firstLev_index
      ].children[max_len].label;
    },
    select_secondLev(i, v) {
      let that = this;
      if (
        this.$refs.secondValue &&
        this.$refs.secondValue.length > 0 &&
        this.$refs.secondValue[0].innerText === "" &&
        i !== 0 &&
        i !== this.zoonArea.length - 1
      ) {
        this.dynamicChangeCheck = true;
      }
      if (!v.ifEdit) {
        that.sum_postData_count = 0;
        this.ifEdit = false;
        this.ifCan_save = "1";
        this.verify_save_item();
      } else {
        this.dynamicChangeCheck = false;
      }
      let flag = this.dynamicChangeCheck;
      if (flag) {
        if (this.zoonArea.length > 0) {
          let firstIndex_max = this.zoonArea.length - 1;
          if (this.zoonArea[firstIndex_max].label === "") {
            this.changCheck_flag = true;
            this.polygonModelFlag = true;
            this.current_changeCheck.firstIndex = firstIndex_max;
            this.current_changeCheck.secondIndex = null;
            this.current_changeCheck.threeIndex = null;
            return;
          }
        }

        let activeFirst_max = this.first_lev_index;
        if (this.zoonArea[activeFirst_max].children.length > 0) {
          let secondIndex_max =
            this.zoonArea[activeFirst_max].children.length - 1;
          if (
            this.zoonArea[activeFirst_max].children[secondIndex_max].label ===
            ""
          ) {
            this.changCheck_flag = true;
            this.polygonModelFlag = true;
            this.current_changeCheck.firstIndex = activeFirst_max;
            this.current_changeCheck.secondIndex = secondIndex_max;
            this.current_changeCheck.threeIndex = null;
            return;
          }
        }
        let activeSecond_max = this.second_lev_index;
        if (
          activeSecond_max &&
          this.zoonArea[activeFirst_max].children[activeSecond_max].children
            .length > 0
        ) {
          let threeIndex_max =
            this.zoonArea[activeFirst_max].children[activeSecond_max].children
              .length - 1;
          if (
            this.zoonArea[activeFirst_max].children[activeSecond_max].children[
              threeIndex_max
            ].label === ""
          ) {
            this.changCheck_flag = true;
            this.polygonModelFlag = true;
            this.current_changeCheck.firstIndex = activeFirst_max;
            this.current_changeCheck.secondIndex = activeSecond_max;
            this.current_changeCheck.threeIndex = threeIndex_max;
            return;
          }
        }
      }
      this.second_lev_index = i;
      let count = i % 4;
      this.secondBg_index = count;
      let temp_firstLev_index = this.first_lev_index;
      this.setttingDev.areaId = this.zoonArea[temp_firstLev_index].children[
        i
      ].id;

      this.getAreaInfo_(that.setttingDev.areaId);
      this.getAreaTree_();

      if (
        this.zoonArea[temp_firstLev_index].children.length > 0 &&
        this.zoonArea[temp_firstLev_index].children[i].children &&
        this.zoonArea[temp_firstLev_index].children[i].children.length > 0
      ) {
        this.sub_threeLev = this.zoonArea[temp_firstLev_index].children[
          i
        ].children;
      } else {
        this.sub_threeLev = [];
      }

      this.temp_drawName = this.post_data.code = this.post_data.name = this.zoonArea[
        temp_firstLev_index
      ].children[i].label;

      //  重置其他图层当前的激活装填
      this.three_lev_index = null;
    },
    prev_secondLev() {
      if (this.second_prev_next > 0) {
        this.second_prev_next = this.second_prev_next - 1;
      }
    },
    next_secondLev() {
      let max_index = this.go_left_second;
      if (this.second_prev_next < max_index) {
        this.second_prev_next = this.second_prev_next + 1;
      }
    },
    //第三层地图
    add_threeLev() {
      let that = this;
      let temp_secondLev_index = this.second_lev_index;

      if (temp_secondLev_index === null) {
        this.$message.error("您还未指定二级分区!");
        return;
      }

      let firstIndex_max = this.zoonArea.length - 1;
      if (this.zoonArea[firstIndex_max].label === "") {
        return;
      }
      let activeFirst_max = this.first_lev_index;
      if (this.zoonArea[activeFirst_max].children.length > 0) {
        let secondIndex_max =
          this.zoonArea[activeFirst_max].children.length - 1;
        if (
          this.zoonArea[activeFirst_max].children[secondIndex_max].label === ""
        ) {
          return;
        }
      }
      let activeSecond_max = this.second_lev_index;
      if (
        activeSecond_max &&
        this.zoonArea[activeFirst_max].children[activeSecond_max].children
          .length > 0
      ) {
        let threeIndex_max =
          this.zoonArea[activeFirst_max].children[activeSecond_max].children
            .length - 1;
        if (
          this.zoonArea[activeFirst_max].children[activeSecond_max].children[
            threeIndex_max
          ].label === ""
        ) {
          return;
        }
      }
      this.verify_save_item();
      let temp_firstLev_index = this.first_lev_index;

      if (this.zoonArea[activeFirst_max].children.length === 0) {
        this.getAreaInfo_(this.zoonArea[this.first_lev_index].id);
        return;
      }

      this.post_data = {
        companyId: "",
        pid: "",
        code: "",
        name: "",
        lev: "",
        zone: "",
        area: 0,
        userCount: "",
        pipeLength: "",
        pipeInfo: "",
        pipeCount: "",
        valveCount: "",
        flowCount: "",
        consumption: "",
        monitorList: [],
        id: "",
        flowLow: null,
        flowHigh: null,
        pressLow: null,
        pressHigh: null
      };

      let str = uuid_(32);
      this.post_data.id = str;
      this.zoonArea[temp_firstLev_index].children[
        temp_secondLev_index
      ].children.push({
        label: "",
        ifEdit: true,
        id: str,
        children: [],
        temp_add: true // 判断当前项是否保存
      });
      this.sub_threeLev = this.zoonArea[temp_firstLev_index].children[
        temp_secondLev_index
      ].children;

      // this.current_changeCheck.firstIndex= this.first_lev_index
      // this.current_changeCheck.secondIndex= this.second_lev_index = this.sub_secondLev.length-1
      // this.current_changeCheck.threeIndex=
      this.three_lev_index =
        this.zoonArea[temp_firstLev_index].children[temp_secondLev_index]
          .children.length - 1;
      this.showThisArr(this.first_lev_index);

      this.dynamicChangeCheck = false;

      this.setttingDev.areaId = str;
      let max_len = this.zoonArea[temp_firstLev_index].children[
        temp_secondLev_index
      ].children.length;
      this.three_with4_index = Math.floor(max_len / 4);
      if (max_len > 1 && (max_len - 1) % 4 == 0) {
        this.go_left_three = this.go_left_three + 1;
        this.three_prev_next = this.go_left_three;
      }
      that.ifCan_save = "2";
      that.sum_postData_count = 0;
      this.only_showThreeLev(temp_firstLev_index, temp_secondLev_index);
    },
    only_showThreeLev(firstLev_index, secondLev_index) {
      let that = this;
      let temp_factoryId = this.factoryId;
      getAreaTree({
        companyId: temp_factoryId
      })
        .then(res => {
          let { data } = res;
          fetch_draw_threePloygon(data, firstLev_index, secondLev_index);
        })
        .catch(error => {
          console.log(error);
        });
    },
    verifyStr_three(event) {
      let val = event.target.value;
      let temp_firstLev_index = this.first_lev_index;
      let temp_secondLev_index = this.second_lev_index;
      let max_len =
        this.zoonArea[temp_firstLev_index].children[temp_secondLev_index]
          .children.length - 1;
      // if (val.length > 5) {
      //   this.zoonArea[temp_firstLev_index].children[
      //     temp_secondLev_index
      //   ].children[max_len].label = val.substring(0, 5);
      // } else if (val === "") {
      //   this.zoonArea[temp_firstLev_index].children[
      //     temp_secondLev_index
      //   ].children[max_len].label = "DMA-1" + max_len;
      // }

      this.zoonArea[temp_firstLev_index].children[
        temp_secondLev_index
      ].children[max_len].label = val;

      this.zoonArea[temp_firstLev_index].children[
        temp_secondLev_index
      ].children[max_len].ifEdit = false;
      this.temp_drawName = this.post_data.code = this.post_data.name = this.zoonArea[
        temp_firstLev_index
      ].children[temp_secondLev_index].children[max_len].label;
    },
    configThisName_threeLev() {
      let temp_firstLev_index = this.first_lev_index;
      let temp_secondLev_index = this.second_lev_index;

      let max_len =
        this.zoonArea[temp_firstLev_index].children[temp_secondLev_index]
          .children.length - 1;
      let val = this.zoonArea[temp_firstLev_index].children[
        temp_secondLev_index
      ].children[max_len].label;
      // if (val.length > 5) {
      //   this.zoonArea[temp_firstLev_index].children[
      //     temp_secondLev_index
      //   ].children[max_len].name = val.substring(0, 5);
      // } else if (val === "") {
      //   this.zoonArea[temp_firstLev_index].children[
      //     temp_secondLev_index
      //   ].children[max_len].name = "DMA-1" + max_len;
      // }
      this.zoonArea[temp_firstLev_index].children[
        temp_secondLev_index
      ].children[max_len].ifEdit = false;
      this.temp_drawName = this.post_data.name = this.zoonArea[
        temp_firstLev_index
      ].children[temp_secondLev_index].children[max_len].label;
      this.post_data.code = this.zoonArea[temp_firstLev_index].children[
        temp_secondLev_index
      ].children[max_len].label;
    },
    select_threeLev(i, v) {
      let that = this;
      if (
        this.$refs.threeValue &&
        this.$refs.threeValue.length > 0 &&
        this.$refs.threeValue[0].innerText === "" &&
        i !== 0 &&
        i !== this.zoonArea.length - 1
      ) {
        this.dynamicChangeCheck = true;
      }
      if (!v.ifEdit) {
        that.sum_postData_count = 0;
        this.ifEdit = false;
        this.ifCan_save = "1";
        this.verify_save_item();
      } else {
        this.dynamicChangeCheck = false;
      }
      let flag = this.dynamicChangeCheck;
      if (flag) {
        if (this.zoonArea.length > 0) {
          let firstIndex_max = this.zoonArea.length - 1;
          if (this.zoonArea[firstIndex_max].label === "") {
            this.changCheck_flag = true;
            this.polygonModelFlag = true;
            this.current_changeCheck.firstIndex = firstIndex_max;
            this.current_changeCheck.secondIndex = null;
            this.current_changeCheck.threeIndex = null;
            return;
          }
        }

        let activeFirst_max = this.first_lev_index;
        if (this.zoonArea[activeFirst_max].children.length > 0) {
          let secondIndex_max =
            this.zoonArea[activeFirst_max].children.length - 1;
          if (
            this.zoonArea[activeFirst_max].children[secondIndex_max].label ===
            ""
          ) {
            this.changCheck_flag = true;
            this.polygonModelFlag = true;
            this.current_changeCheck.firstIndex = activeFirst_max;
            this.current_changeCheck.secondIndex = secondIndex_max;
            this.current_changeCheck.threeIndex = null;
            return;
          }
        }
        let activeSecond_max = this.second_lev_index;
        if (
          activeSecond_max &&
          this.zoonArea[activeFirst_max].children[activeSecond_max].children
            .length > 0
        ) {
          let threeIndex_max =
            this.zoonArea[activeFirst_max].children[activeSecond_max].children
              .length - 1;
          if (
            this.zoonArea[activeFirst_max].children[activeSecond_max].children[
              threeIndex_max
            ].label === ""
          ) {
            this.changCheck_flag = true;
            this.polygonModelFlag = true;
            this.current_changeCheck.firstIndex = activeFirst_max;
            this.current_changeCheck.secondIndex = activeSecond_max;
            this.current_changeCheck.threeIndex = threeIndex_max;
            return;
          }
        }
      }
      if (this.second_lev_index === null) {
        this.$message.error("请选择二级分区!");
        return;
      }

      this.three_lev_index = i;
      let count = i % 4;
      this.threeBg_index = count;
      let temp_firstLev_index = this.first_lev_index;
      let temp_secondLev_index = this.second_lev_index;
      this.setttingDev.areaId = this.zoonArea[temp_firstLev_index].children[
        temp_secondLev_index
      ].children[i].id;

      this.getAreaInfo_(that.setttingDev.areaId);

      this.temp_drawName = this.post_data.code = this.post_data.name = this.zoonArea[
        temp_firstLev_index
      ].children[temp_secondLev_index].children[i].label;
    },
    prev_threeLev() {
      if (this.three_prev_next > 0) {
        this.three_prev_next = this.three_prev_next - 1;
      }
    },
    next_threeLev() {
      let max_index = this.go_left_three;
      if (this.three_prev_next < max_index) {
        this.three_prev_next = this.three_prev_next + 1;
      }
    },
    addArea_(params) {
      let that = this;
      let temp_firstLev_index = this.first_lev_index;
      let temp_secondLev_index = this.second_lev_index;
      let flag = null;
      if (this.first_lev_index !== null) {
        flag = "1";
      }
      if (this.second_lev_index !== null) {
        flag = "2";
      }
      if (this.three_lev_index !== null) {
        flag = "3";
      }

      if (flag === "1") {
        params.pid = "";
      }
      let pid = "";
      if (flag === "2") {
        pid = this.zoonArea[temp_firstLev_index].id;
        params.pid = pid;
      }
      if (flag === "3") {
        pid = this.zoonArea[temp_firstLev_index].children[temp_secondLev_index]
          .id;
        params.pid = pid;
      }

      addArea({
        companyId: "" + params.companyId,
        pid: "" + params.pid,
        code: "" + params.code,
        name: "" + params.name,
        lev: "" + params.lev,
        zone: JSON.stringify(params.zone),
        area: parseFloat(params.area),
        userCount: parseFloat(params.userCount),
        pipeLength: parseFloat(params.pipeLength),
        pipeInfo: "" + params.pipeInfo,
        pipeCount: parseFloat(params.pipeCount),
        valveCount: parseFloat(params.valveCount),
        flowCount: parseFloat(params.flowCount),
        consumption: parseFloat(params.consumption),
        monitorList: params.monitorList,
        id: "" + params.id,
        flowLow: parseFloat(params.flowLow),
        flowHigh: parseFloat(params.flowHigh),
        pressLow: parseFloat(params.pressLow),
        pressHigh: parseFloat(params.pressHigh)
      })
        .then(res => {
          that.saveStatusFlag = res.status === 1;
          that.saveMsg = res.msg;
          that.saveModelFlag = true;

          if (res.status === 1) {
            that.sum_postData_count += that.sum_postData_count + 1;
            that.ifCan_save = "1";
            that.firstLayer.removeAll();
            that.first_lev_index = 0;
            that.second_lev_index = null;
            that.three_lev_index = null;
            that.getAreaTree_();
            that.getAreaTree_list();
            //  回复双击完成情况
            that.ifDoubleClick = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    hidden_ploygonModel(flag) {
      this.polygonModelFlag = false;
    },
    config_drawPloygon() {
      let name = this.temp_drawName;
      let flag = this.temp_levFlag;
      this.polygonModelFlag = false;

      let temp_firstLev_index = this.first_lev_index;
      let firstLev_name = this.zoonArea[temp_firstLev_index].label;

      let temp_secondLev_index = this.second_lev_index;
      let secondLev_name = "";
      if (temp_secondLev_index) {
        secondLev_name = this.zoonArea[temp_firstLev_index].children[
          temp_secondLev_index
        ].label;
      } else {
        secondLev_name = "";
      }
      enableCreatePolygon(name, firstLev_name, secondLev_name, flag);
    },
    hiddenSaveModel(flag) {
      this.saveModelFlag = false;
    },
    getAreaTree_() {
      let that = this;
      let temp_factoryId = this.factoryId;
      getAreaTree({
        companyId: temp_factoryId
      })
        .then(res => {
          let { data } = res;
          fetch_drawPloygon(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAreaTree_list() {
      let that = this;
      let temp_factoryId = this.factoryId;
      getAreaTree({
        companyId: temp_factoryId
      })
        .then(res => {
          let { data } = res;
          that.zoonArea = data ? data : [];
          that.first_lev_index = 0;
          if (that.zoonArea.length > 0) {
            that.getAreaInfo_(that.zoonArea[0].id);
          }

          if (that.zoonArea === null || that.zoonArea.length === 0) {
            that.ifEdit = false;
          }
          if (
            data &&
            data.length > 0 &&
            data[0].children &&
            data[0].children.length > 0
          ) {
            that.sub_secondLev = data[0].children;
            if (
              data[0].children[0].children &&
              data[0].children[0].children.length > 0
            ) {
              that.sub_threeLev = data[0].children[0].children;
            } else {
              that.sub_threeLev = [];
            }
          } else {
            that.sub_secondLev = [];
            that.sub_threeLev = [];
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 确定删除
    configDelThis(val) {
      let temp_id = this.del_id;
      // if(this.post_data.zone!==""){
      let first_index = this.first_lev_index;
      let second_index = this.second_lev_index;
      let three_index = this.three_lev_index;
      let flag = "";
      if (first_index !== null) {
        flag = "1";
      }
      if (second_index !== null) {
        flag = "2";
      }
      if (three_index !== null) {
        flag = "3";
      }

      if (flag === "1") {
        this.zoonArea.splice(first_index, 1);
        this.first_lev_index =
          this.first_lev_index - 1 < 0 ? 0 : this.first_lev_index - 1;
        this.ifEdit = false;
        this.ifCan_save = "1";
      }

      if (flag === "2") {
        this.zoonArea[first_index].children.splice(second_index, 1);
        if (this.zoonArea[first_index].children.length > 0) {
          this.second_lev_index =
            this.second_lev_index - 1 < 0 ? 0 : this.second_lev_index - 1;
        } else {
          this.second_lev_index = null;
          this.three_lev_index = null;
        }
        this.ifEdit = false;
        this.ifCan_save = "1";
      }
      if (flag === "3") {
        this.zoonArea[first_index].children[second_index].children.splice(
          three_index,
          1
        );

        if (
          this.zoonArea[first_index].children[second_index].children.length > 0
        ) {
          this.three_lev_index =
            this.three_lev_index - 1 < 0 ? 0 : this.three_lev_index - 1;
        } else {
          this.three_lev_index = null;
        }

        this.ifEdit = false;
        this.ifCan_save = "1";
      }

      this.saveModelFlag = false;
      this.saveType = true;

      this.post_data = {
        companyId: "",
        pid: "",
        code: "",
        name: "",
        lev: "",
        zone: "",
        area: 0,
        userCount: "",
        pipeLength: "",
        pipeInfo: "",
        pipeCount: "",
        valveCount: "",
        flowCount: "",
        consumption: "",
        monitorList: [],
        id: "",
        flowLow: null,
        flowHigh: null,
        pressLow: null,
        pressHigh: null
      };
      this.firstLayer.removeAll();
      //    return
      // }

      this.showThisArr(this.first_lev_index);

      this.getAreaTree_();
      this.delArea_(temp_id);
    },
    // 显示 删除的弹窗
    showDelModel(data, str_flag, index) {
      let that = this;
      let flag = false;
      let temp_firstLev_index = this.first_lev_index;
      let temp_secondLev_index = this.second_lev_index
        ? this.second_lev_index
        : index;
      let temp_threeLev_index = index;
      this.del_id = data.id;
      this.saveType = false;
      switch (str_flag) {
        case "1":
          flag =
            that.zoonArea[temp_firstLev_index].children &&
            that.zoonArea[temp_firstLev_index].children.length === 0;
          break;
        case "2":
          flag =
            that.zoonArea[temp_firstLev_index].children[temp_secondLev_index]
              .children &&
            that.zoonArea[temp_firstLev_index].children[temp_secondLev_index]
              .children.length === 0;
          break;
        default:
          flag = true;
      }
      if (flag) {
        this.saveModelFlag = true;
      } else {
        this.showWainingModelFlag = true;
      }
    },
    //  删除该图层下 所有的 图层
    delAllLayer() {
      this.configDelThis();
    },
    delArea_(id_) {
      let that = this;
      updateArea({
        id: id_,
        delFlag: "1"
      }).then(res => {
        that.saveStatusFlag = res.status === 1;
        that.saveMsg = res.msg;
        if (res.status === 1) {
          that.saveModelFlag = false;
          that.ifEdit = false;
          that.ifCan_save = "1";
          that.showWainingModelFlag = false;
          that.sum_postData_count = 0;
          that.getAreaTree_list();
          that.getAreaTree_();
          setTimeout(() => {
            that.saveType = true;
            that.saveModelFlag = true;
          }, 1000);
        }
      });
    },
    // 编辑当前激活图层
    updateArea() {
      let that = this;
      if (that.sum_postData_count > 1) {
        return;
      }
      if (this.post_data.name === "") {
        this.$message.error("分区名称必填!");
        return;
      }
      let temp_userCount = this.post_data.userCount
        ? parseInt(that.post_data.userCount)
        : 0;
      let temp_valveCount = this.post_data.valveCount
        ? parseInt(that.post_data.valveCount)
        : 0;
      let temp_flowCount = this.post_data.flowCount
        ? parseInt(that.post_data.flowCount)
        : 0;
      let temp_consumption = this.post_data.consumption
        ? parseInt(that.post_data.consumption)
        : 0;
      let temp_pipeLength = this.post_data.pipeLength
        ? parseFloat(that.post_data.pipeLength)
        : 0;
      that.post_data.userCount = temp_userCount;
      that.post_data.valveCount = temp_valveCount;
      that.post_data.flowCount = temp_flowCount;
      that.post_data.consumption = temp_consumption;
      that.post_data.pipeLength = temp_pipeLength;

      let temp_flowHigh = this.post_data.flowHigh;
      let temp_flowLow = this.post_data.flowLow;
      if (temp_flowHigh && temp_flowLow) {
        if (parseFloat(temp_flowLow) > parseFloat(temp_flowHigh)) {
          that.$message.error("流量下限不能大于流量上限呦~~！");
          return;
        }
      }

      that.post_data.flowHigh = that.post_data.flowHigh
        ? parseFloat(that.post_data.flowHigh)
        : null;
      that.post_data.flowLow = that.post_data.flowLow
        ? parseFloat(that.post_data.flowLow)
        : null;

      let temp_pressHigh = this.post_data.pressHigh;
      let temp_pressLow = this.post_data.pressLow;
      if (temp_pressHigh && temp_pressLow) {
        if (parseFloat(temp_pressLow) > parseFloat(temp_pressHigh)) {
          that.$message.error("压力下限不能大于压力上限呦~~！");
          return;
        }
      }

      that.post_data.pressHigh = that.post_data.pressHigh
        ? parseFloat(that.post_data.pressHigh)
        : null;
      that.post_data.pressLow = that.post_data.pressLow
        ? parseFloat(that.post_data.pressLow)
        : null;

      let params = this.post_data;
      that.first_lev_index = 0;
      updateArea(params)
        .then(res => {
          that.saveStatusFlag = res.status === 1;
          that.saveMsg = res.msg;
          that.saveModelFlag = true;
          if (res.status === 1) {
            that.sum_postData_count += that.sum_postData_count + 1;
            that.ifEdit = false;
            that.ifCan_save = "1";
            that.firstLayer.removeAll();
            that.getAreaTree_();
            that.getAreaTree_list();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    drawArea() {
      if (this.ifCan_save === "1") {
        return;
      }

      if (this.firstLayer) {
        this.firstLayer.removeAll();
      }

      let flag = null;
      if (this.first_lev_index !== null) {
        flag = "1";
      }
      if (this.second_lev_index !== null) {
        flag = "2";
      }
      if (this.three_lev_index !== null) {
        flag = "3";
      }
      let name = this.temp_drawName;

      let temp_firstLev_index = this.first_lev_index;
      let firstLev_name = this.zoonArea[temp_firstLev_index].label;

      let temp_secondLev_index = this.second_lev_index;
      let secondLev_name = "";
      if (temp_secondLev_index !== null) {
        secondLev_name = this.zoonArea[temp_firstLev_index].children[
          temp_secondLev_index
        ].label;
      } else {
        secondLev_name = "";
      }

      this.post_data.area = 0;
      this.post_data.userCount = 0;
      this.post_data.pipeLength = 0;
      this.post_data.pipeCount = 0;
      this.post_data.valveCount = 0;
      this.post_data.flowCount = 0;

      enableCreatePolygon(name, firstLev_name, secondLev_name, flag);
    },
    editName(event) {
      let temp_firstLev_index = this.first_lev_index;
      let temp_secondLev_index = this.second_lev_index;
      let temp_threeLev_index = this.three_lev_index;
      let name_ = event.target.value;
      if (this.ifCan_save === "1") {
        this.ifEdit = true;
      }
      // if (name_.length > 5) {
      //   name_ = name_.substring(0, 5);
      // } else if (name_ === "") {
      //   name_ = "DMA";
      // }
      this.post_data.name = name_;
      let flag = null;
      if (this.first_lev_index !== null) {
        flag = "1";
      }
      if (this.second_lev_index !== null) {
        flag = "2";
      }
      if (this.three_lev_index !== null) {
        flag = "3";
      }
      switch (flag) {
        case "1":
          this.zoonArea[temp_firstLev_index].label = name_;
          break;
        case "2":
          this.zoonArea[temp_firstLev_index].children[
            temp_secondLev_index
          ].label = name_;
          break;
        case "3":
          this.zoonArea[temp_firstLev_index].children[
            temp_secondLev_index
          ].children[temp_threeLev_index].label = name_;
          break;
      }
    },
    checkCancel() {
      this.polygonModelFlag = false;
      this.changCheck_flag = false;
      this.dynamicChangeCheck = false;
    },
    // 离开编辑  并删除当前编辑框
    showThisArr(firstIndex) {
      let that = this;
      let temp_firstLev_index = firstIndex;
      if(this.zoonArea.length===0){
        return
      }
      this.sub_secondLev = this.zoonArea[temp_firstLev_index].children;
      let temp_secondLev_index = this.second_lev_index;
      let temp_second_len = this.sub_secondLev.length;

      let temp_threeLev_index = this.three_lev_index;

      let flag = null;
      if (temp_firstLev_index !== null) {
        flag = "1";
      }
      if (temp_secondLev_index !== null) {
        flag = "2";
      }
      if (temp_threeLev_index !== null) {
        flag = "3";
      }
      if (flag === "1") {
        if (this.sub_secondLev.length > 0) {
          this.sub_threeLev = this.zoonArea[
            temp_firstLev_index
          ].children[0].children;
        } else {
          this.sub_threeLev = [];
        }
        this.getAreaInfo_(that.zoonArea[temp_firstLev_index].id);
      }
      if (flag === "2") {
        if (this.sub_secondLev.length > 0) {
          this.sub_threeLev = this.zoonArea[temp_firstLev_index].children[
            temp_secondLev_index
          ].children;
          this.getAreaInfo_(
            that.zoonArea[temp_firstLev_index].children[temp_secondLev_index].id
          );
        } else {
          this.getAreaInfo_(that.zoonArea[temp_firstLev_index].id);
          this.sub_threeLev = [];
        }
      }

      if (flag === "3") {
        this.getAreaInfo_(
          that.zoonArea[temp_firstLev_index].children[temp_secondLev_index]
            .children[temp_threeLev_index].id
        );
      }
    },
    checkConfig() {
      this.polygonModelFlag = false;
      let first_index = this.current_changeCheck.firstIndex;
      let second_index = this.current_changeCheck.secondIndex;
      let three_index = this.current_changeCheck.threeIndex;
      let flag = "";
      if (this.current_changeCheck.firstIndex !== null) {
        flag = "1";
      }
      if (this.current_changeCheck.secondIndex !== null) {
        flag = "2";
      }
      if (this.current_changeCheck.threeIndex !== null) {
        flag = "3";
      }

      if (flag === "1") {
        this.zoonArea.splice(first_index, 1);
        this.first_lev_index =
          this.first_lev_index - 1 < 0 ? 0 : this.first_lev_index - 1;
        this.ifEdit = false;
        this.ifCan_save = "1";
      }

      if (flag === "2") {
        this.zoonArea[first_index].children.splice(second_index, 1);
        if (this.zoonArea[first_index].children.length > 0) {
          this.second_lev_index =
            this.second_lev_index - 1 < 0 ? 0 : this.second_lev_index - 1;
        } else {
          this.second_lev_index = null;
          this.three_lev_index = null;
        }
        this.ifEdit = false;
        this.ifCan_save = "1";
      }
      if (flag === "3") {
        this.zoonArea[first_index].children[second_index].children.splice(
          three_index,
          1
        );
        if (
          this.zoonArea[first_index].children[second_index].children.length > 0
        ) {
          this.three_lev_index =
            this.three_lev_index - 1 < 0 ? 0 : this.three_lev_index - 1;
        } else {
          this.three_lev_index = null;
        }
        this.ifEdit = false;
        this.ifCan_save = "1";
      }
      this.showThisArr(this.first_lev_index);
      this.getAreaTree_();
    },
    // 失去焦点后进行的处理
    changeCheck() {
      let flag = this.dynamicChangeCheck;
      // this.ifEdit = false
      // this.ifCan_save = "1"
      if (!flag) {
        if (this.zoonArea.length > 0) {
          let firstIndex_max = this.zoonArea.length - 1;
          if (this.zoonArea[firstIndex_max].label === "") {
            this.changCheck_flag = true;
            this.polygonModelFlag = true;
            this.current_changeCheck.firstIndex = firstIndex_max;
            return;
          }
        }

        let activeFirst_max = this.first_lev_index;
        if (this.zoonArea[activeFirst_max].children.length > 0) {
          let secondIndex_max =
            this.zoonArea[activeFirst_max].children.length - 1;
          if (
            this.zoonArea[activeFirst_max].children[secondIndex_max].label ===
            ""
          ) {
            this.changCheck_flag = true;
            this.polygonModelFlag = true;
            this.current_changeCheck.firstIndex = activeFirst_max;
            this.current_changeCheck.secondIndex = secondIndex_max;
            return;
          }
        }
        let activeSecond_max = this.second_lev_index;
        if (
          activeSecond_max &&
          this.zoonArea[activeFirst_max].children[activeSecond_max].children
            .length > 0
        ) {
          let threeIndex_max =
            this.zoonArea[activeFirst_max].children[activeSecond_max].children
              .length - 1;
          if (
            this.zoonArea[activeFirst_max].children[activeSecond_max].children[
              threeIndex_max
            ].label === ""
          ) {
            this.changCheck_flag = true;
            this.polygonModelFlag = true;
            this.current_changeCheck.firstIndex = activeFirst_max;
            this.current_changeCheck.secondIndex = activeSecond_max;
            this.current_changeCheck.threeIndex = threeIndex_max;
            return;
          }
        }
      }
    },
    // 获取焦点后 进行的处理
    focusThis(str) {
      if (str === "myIpt") {
        this.ifCan_save = "2";
        this.ifEdit = false;
      }
    },
    getAreaInfo_(id) {
      let that = this;
      getAreaInfo({
        id: id
      })
        .then(res => {
          let { data } = res;
          if (data) {
            that.post_data.name = data.name;
            that.post_data.id = data.id;
            that.post_data.userCount = data.userCount;
            that.post_data.pipeCount = data.pipeCount;
            that.post_data.valveCount = data.valveCount;
            that.post_data.flowCount = data.flowCount;
            that.post_data.consumption = data.consumption;
            that.post_data.pipeLength = data.pipeLength;
            that.post_data.pipeInfo = data.pipeInfo;
            that.post_data.area = data.area;
            that.post_data.flowLow = data.flowLow;
            that.post_data.flowHigh = data.flowHigh;
            that.post_data.pressLow = data.pressLow;
            that.post_data.pressHigh = data.pressHigh;
          } else {
            that.post_data.name = "";
            that.post_data.userCount = 0;
            that.post_data.pipeCount = 0;
            that.post_data.valveCount = 0;
            that.post_data.flowCount = 0;
            that.post_data.consumption = 0;
            that.post_data.pipeLength = 0;
            that.post_data.pipeInfo = "";
            that.post_data.area = 0;
            that.post_data.flowLow = null;
            that.post_data.flowHigh = null;
            that.post_data.pressLow = null;
            that.post_data.pressHigh = null;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    closedWarningModel(flag) {
      this.showWainingModelFlag = false;
    }
  },
  created() {
    let tree = this.$store.getters.get_orgTree;
    this.tree = tree;
    if (tree[0].size === 0) {
      this.defaultCompany = tree[0].label;
      this.post_data.companyId = this.factoryId = tree[0].id;
      // this.factoryType = tree[0].type;
      if (tree[0].label.indexOf("集团") > -1) {
        this.rootHeadNotAllow = false;
        this.$message.error("集团自身没有数据呦~");
      }
    } else if (tree[0].size > 0 && tree[0].children[0].size === 0) {
      this.defaultCompany = tree[0].children[0].label;
      this.post_data.companyId = this.factoryId = tree[0].children[0].id;
      // this.factoryType = tree[0].children[0].type;
    } else if (tree[0].size > 0 && tree[0].children[0].size > 0) {
      this.defaultCompany = tree[0].children[0].children[0].label;
      this.post_data.companyId = this.factoryId =
        tree[0].children[0].children[0].id;
      // this.factoryType = tree[0].children[0].children[0].type;
    }
    if (this.rootHeadNotAllow) {
      this.getAreaTree_list();
    }
  },
  mounted() {
    dse.this_ = this;
    let position = this.$store.getters.get_cityPosition
    this.createMap(position);
  },
  beforeDestroy() {
    if (this.distance && this.area) {
      this.distance.clear();
      this.area.clear();
    }
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/resetCSS/legend_mixin.scss";
$baseFont: 14px;
$baseColor: #333;
$baseBorderColor: #ccc;

#partitionConfig {
  width: 100%;
  height: 100%;
  position: relative;
  font-size: $baseFont;
  color: $baseColor;

  #gis {
    width: 100%;
    height: 100%;
  }

  .star {
    color: red;
  }

  .sideTable {
    position: absolute;
    top: 60px;
    right: 20px;
    height: calc(100% - 80px);

    .toggleBar {
      position: absolute;
      top: 50%;
      left: -24px;
      width: 24px;
      height: 88px;
      line-height: 88px;
      cursor: pointer;
      margin-top: -30px;
      border: 1px solid #ccc;
      text-align: center;
      background: #fff;
    }

    .mainContent {
      width: 400px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      height: 100%;
      background: #fff;

      .tophead {
        width: 100%;
        background: #e3edef;
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
      }

      .selectObj {
        width: 100%;
        padding: 10px 10px;
        display: flex; // height: 30px;
        border-bottom: 1px solid $baseBorderColor;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        span {
          display: inline-block;
          width: 80px;
        }
      }

      .wrap {
        width: calc(100% - 20px);
        height: calc(100% - 120px);
        margin: 0 auto;

        .first-lev {
          width: 100%;
          // line-height: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          span {
            display: inline-block;
          }

          i {
            cursor: pointer;
          }

          .tabs {
            // width: 260px;
            position: relative;
            height: 30px;
            width: 260px;
            overflow-x: hidden;

            .inner-wrapTabs {
              position: absolute;
              top: 0;
              left: 0;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              height: 100%;
              margin-left: 5px;

              .tab-item {
                width: 60px;
                position: relative;
                margin-right: 5px;

                .inner-wrap {
                  width: 100%;
                  background: #fff;
                  font-size: 12px;
                  color: #0b83fe;
                  text-align: center;
                  border-top-left-radius: 5px;
                  border-top-right-radius: 5px;
                  line-height: 25px;
                  cursor: pointer;

                  &.if_firstLev_select {
                    background: #0b83fe;
                    color: #fff;
                  }

                  input {
                    width: 100%;
                    height: 100%;
                    border: 1px solid #ccc;
                    border-radius: 2px;
                  }
                }

                .bg_bottom {
                  position: absolute;
                  top: 21px;
                  left: 0;
                  width: 100%;
                  height: 6px;
                  background: #fff;
                  color: #333;

                  &.hasBg {
                    background: #0b83fe;
                    color: #fff;
                  }
                }

                .ifDel {
                  position: absolute;
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  top: -1px;
                  right: -4px;
                  background: gray;
                  color: #fff;
                  cursor: pointer;

                  i {
                    transform: scale(0.8);
                    position: absolute;
                    top: -1px;
                    left: -1px;
                  }
                }
              }
            }
          }

          span.add {
            background: #0b83fe;
            width: 20px;
            height: 20px;
            line-height: 20px;
            color: #fff;
            text-align: center;
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
          }
        }

        .bottomborder {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          span.head-nostr {
            display: inline-block;
            width: 80px;
            height: 9px;
          }

          span.last-nostr {
            display: inline-block;
            width: 30px;
            height: 9px;
          }

          .borders {
            width: calc(100% - 120px);
            height: 10px;
            display: flex;
            justify-content: flex-start;

            .subBorder-item {
              width: calc(25% - 5px);
              position: relative;
              margin-right: 5px;
              height: 11px;

              &.hasBorder {
                border-left: 1px solid #0b83fe;
                border-right: 1px solid #0b83fe;
                border-bottom: 1px solid #fff;
              }
            }
          }
        }

        .sub-wrap {
          width: 100%;
          border: 1px solid #70c6f3;
          border-radius: 5px;
          margin-bottom: 20px;
          padding-top: 10px;
        }

        .second-lev {
          width: 100%;
          // line-height: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          // margin-bottom: 6px;

          span {
            display: inline-block;
          }

          i {
            cursor: pointer;
          }

          .tabs {
            width: 260px;
            overflow-x: hidden;
            position: relative;
            height: 30px;

            .inner-wraps {
              position: absolute;
              top: 0;
              left: 0;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              height: 100%;
              margin-left: 5px;
            }

            .tab-item {
              width: 60px;
              position: relative;
              margin-right: 5px;

              .inner-wrap {
                width: 100%;
                background: #fff;
                font-size: 12px;
                color: #0b83fe;
                text-align: center;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                line-height: 25px;
                cursor: pointer;

                &.if_secondLev_select {
                  background: #cdfaff;
                  color: #333;
                }

                input {
                  width: 100%;
                  height: 100%;
                  border: 1px solid #ccc;
                  border-radius: 2px;
                }
              }

              .sub-bg {
                width: 100%;
                height: 2px;
                background: #fff;
                position: absolute;
                top: 25px;
                left: 0;
                z-index: 2;

                &.hasBg {
                  background: #cdfaff;
                  color: #333;
                }
              }

              .ifDel {
                position: absolute;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                top: -1px;
                right: -4px;
                background: gray;
                color: #fff;
                cursor: pointer;

                i {
                  transform: scale(0.8);
                  position: absolute;
                  top: -1px;
                  left: -1px;
                }
              }
            }
          }

          span.add {
            background: #0b83fe;
            width: 20px;
            height: 20px;
            line-height: 20px;
            color: #fff;
            text-align: center;
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
          }
        }

        .bg-color {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          span.head-long {
            display: inline-block;
            width: 80px;
            height: 9px;
          }

          span.last-long {
            display: inline-block;
            width: 30px;
            height: 9px;
          }

          .bg-tabs {
            width: 260px;
            height: 10px;
            display: flex;
            justify-content: flex-start;

            .bg-item {
              width: 60px;
              position: relative;
              margin-right: 5px;
              height: 11px;

              &.hasBorder {
                background: #cdfaff;
              }
            }
          }
        }

        .three-lev {
          width: 100%;
          height: 36px;
          line-height: 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #cdfaff;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;

          span {
            display: inline-block;
          }

          i {
            cursor: pointer;
          }

          .tabs {
            width: 260px;
            overflow-x: hidden;
            position: relative;
            height: 25px;

            .inner-wraps {
              position: absolute;
              top: 0;
              left: 0;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              height: 100%;
              margin-left: 5px;
            }

            .tab-item {
              width: 60px;
              position: relative;
              margin-right: 5px;

              .inner-wrap {
                width: 100%;
                // background: #fff;
                font-size: 12px;
                color: #0b83fe;
                text-align: center;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                line-height: 25px;
                cursor: pointer;

                &.if_threeLev_select {
                  background: #2dc0d9;
                  color: #fff;
                }

                input {
                  width: 100%;
                  height: 100%;
                  border: 1px solid #ccc;
                  border-radius: 2px;
                }
              }

              .ifDel {
                position: absolute;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                top: 1px;
                right: -4px;
                background: gray;
                color: #fff;
                cursor: pointer;

                i {
                  transform: scale(0.8);
                  position: absolute;
                  top: -1px;
                  left: -1px;
                }
              }
            }
          }

          span.add {
            background: #0b83fe;
            width: 20px;
            height: 20px;
            line-height: 20px;
            color: #fff;
            text-align: center;
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
          }
        }

        .edit-table {
          width: 100%;
          height: calc(100% - 170px);
          border: 1px solid #ccc;
          overflow-y: auto;

          .top-tip-btn {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            line-height: 30px;
            border-bottom: 1px solid #ccc;

            span.btn {
              display: inline-block;
              padding: 0px 10px;
              background: gray;
              color: #fff;
              line-height: 25px;
              border-radius: 5px;
              cursor: not-allowed;

              &.canDraw {
                background: #3a9a2e;
                color: #fff;
                cursor: pointer;
              }
            }
          }

          .row {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;

            .col {
              height: 30px;
              line-height: 30px;

              &:first-child {
                width: 180px;
                text-align: right;
              }

              &:last-child {
                width: calc(100% - 200px);

                input {
                  border: 1px solid #ccc;
                  padding-left: 5px;
                  line-height: 20px;
                }
              }

              &.text {
                height: 150px;

                textarea {
                  width: calc(100% - 10px);
                  height: 100%;
                  resize: none;
                  border: 1px solid #ccc;
                }
              }

              &.twoInput {
                // width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-right: 15px;

                input {
                  width: 60px;
                }
              }
            }
          }
        }

        .actions {
          width: 100%;
          background: #dcdede;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;

          span {
            display: inline-block;
            padding: 5px 20px;
            background: gray;
            border-radius: 5px;
            color: #fff;
            font-size: 16px;
            cursor: not-allowed;

            &.ifPost {
              background: #0b83fe;
              color: #fff;
              cursor: pointer;
            }

            &.edit {
              cursor: pointer;
              background: #0b83fe;

              &.hasEdit {
                background: gray;
                cursor: not-allowed;
              }
            }
          }
        }
      }
    }
  }

  .gisTools {
    width: 180px;
    height: 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 20px;
    right: 20px;
    border-radius: 5px;
    background: #fff;
  }

  @include legend;

  .sub-content {
    width: 100%;
    height: 100px;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .tips {
      margin-bottom: 20px;
      padding: 0 10px;
      width: 100%;
      display: flex;
      justify-content: center;

      span {
        color: red;
      }
    }

    .actions {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-end;

      span {
        display: inline-block;
        padding: 5px 15px;
        background: #0b83fe;
        border-radius: 5px;
        color: #fff;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }

  .warningContext {
    width: 100%;
    height: 100%;
    .mainBody {
      width: 100%;
      height: calc(100% - 40px);
      color: red;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .actions {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        display: inline-block;
        padding: 8px 0px;
        width: 70px;
        text-align: center;
        background: #0b83fe;
        color: #fff;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
        &.cancel {
          background: #ccccce;
        }
      }
    }
  }

  .textLimit {
    display: inline-block;
    width: 100%;
    height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .limitText {
    display: inline-block;
    width: 100px;
    height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
