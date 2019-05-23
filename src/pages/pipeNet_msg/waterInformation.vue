<template>
  <div id="waterInformation">
    <div class="top-tabs">
      <tools :defaultLayers="layers" @handleThisDom="thisDom" @showLayers="toggleSelectThis"></tools>
    </div>
    <div class="search-table">
      <div class="toggle-tab" @click="toggleShow">
        <template v-if="tableStatus">
          <i class="el-icon-arrow-right"></i>
        </template>
        <template v-else>
          <i class="el-icon-arrow-left"></i>
        </template>
      </div>
      <div class="wrap-table" v-if="tableStatus">
        <div class="wrap-search">
          <div class="searchObj">
            <span>选择对象:</span>
            <select-tree
              :waterWorksTree="tree"
              @showSelectLists="searchObj"
              :defaultCompony="initCompony"
            ></select-tree>
          </div>
          <div class="inner-select">
            <div class="row first">
              <div class="col">
                <span>所属区域:</span>
                <el-select v-model="areas_item" placeholder="请选择" @change="getAreaID">
                  <el-option
                    v-for="item in areas"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="col">
                <span>用户名称:</span>
                <el-input placeholder="请输入内容" v-model="inputSomething" clearable></el-input>
              </div>
            </div>
            <div class="row last">
              <!-- <el-button class="search" type="success" @click="search">搜索</el-button> -->
              <span class="search" type="success" @click="search">搜索</span>
            </div>
          </div>
        </div>
        <div class="actions" :class="{ifAllowed:addFlag===false}">
        	<span class="notice">*点击新增后请在地图上进行定位选点</span>
          <div class="add" @click="addUser">
            <i class="el-icon-plus"></i>
            <span>新增</span>
          </div>
          <!-- <div class="remove" @click="removeUser" :class="{actived:removeCreateUsers.length}">
                    <i class="el-icon-delete"></i>
                    <span>删除</span>
          </div>-->
        </div>
        <div class="contentLists">
          <div class="inner-wrap">
            <table>
              <tr class="content-item top-head">
                <td class="ownArea item">
                  <span>所属区域</span>
                </td>
                <td class="userUnit">
                  <span>用户单位</span>
                </td>
                <td class="detail item">
                  <span>详情</span>
                </td>
                <td class="action item">
                  <span>分析</span>
                </td>
              </tr>
              <template v-if="area_users.length>0">
                <tr class="content-item content" v-for="(item,index) in area_users" :key="index">
                  <td class="ownArea item">
                    <span>{{item.COMPANYNAMES}}</span>
                  </td>
                  <td class="userUnit">
                    <i class="el-icon-delete" @click="toggleSelect(index,item.ID)"></i>
                    <span :title="item.NAME" class="name_">{{item.NAME}}</span>
                  </td>
                  <td @click="showModelDetail(item.ID)" class="cursor detail item">
                    <span>详情</span>
                  </td>
                  <td
                    class="cursor action item"
                    @click="gotoDetail(item.AREA_ID,item.ID,item.NAME)"
                  >
                    <span>分析</span>
                  </td>
                </tr>
              </template>
            </table>
          </div>

          <div class="pages">
            <pagenation :noSmall="'true'" :totalPage="totalPage" @thisPage="gotoThisPage"></pagenation>
          </div>
        </div>
      </div>
    </div>
    <template v-if="showLegend">
      <div class="wrap-legend">
        <div class="legend">
          <span class="close" @click="closeLegend">
            <i class="el-icon-close"></i>
          </span>
          <div class="pipe-desc">
            <div class="col">
              <div class="pipe-item">
                <span class="water"></span>
                <span>输水管线</span>
              </div>
              <div class="pipe-item">
                <span class="gas"></span>
                <span>燃气管道</span>
              </div>
            </div>
            <div class="col">
              <div class="pipe-item">
                <span class="wire"></span>
                <span>地下高压线</span>
              </div>
              <div class="pipe-item">
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <div class="sm-desc">
            <div class="sm-item">
              <img src="../../assets/images/pipeNet_manage/msg/fm.png" alt>
              <span>阀门</span>
            </div>
            <div class="sm-item">
              <img src="../../assets/images/pipeNet_manage/msg/jxj.png" alt>
              <span>检修井</span>
            </div>
            <div class="sm-item">
              <img src="../../assets/images/pipeNet_manage/msg/xfs.png" alt>
              <span>消防栓</span>
            </div>
            <div class="sm-item">
              <img src="../../assets/images/pipeNet_manage/msg/proj_place.png" alt>
              <span>工作点</span>
            </div>
            <div class="sm-item">
              <img src="../../assets/images/common/normal_bigUser.png" alt>
              <span>用户</span>
            </div>
          </div>
        </div>
        <div class="socket">
          <span>管线更新至{{updateTime.UPDATETIME}}年</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="legend-btn" @click="showLegend_">
        <span>图例</span>
      </div>
    </template>

    <del-model
      :showModel="showDelFlag"
      :delNum="delId"
      :type="modelType"
      @delThis="hiddenDelModel"
      @sureDelThis="justDel"
    ></del-model>
  </div>
</template>

<script>
import tools from "@/common/components/gis_units/tools";
import DelModel from "@/common/components/poupe/save_status";
import pagenation from "@/common/components/pagination";
import selectTree from "@/common/components/selectWithTree";
import { getPipeWaterUserInfo } from "@/api/pipeNet_msg/waterInformation";
import {
  saveOrUpdate,
  updateWaterUser
} from "@/api/pipeNet_msg/bagUser_manage";

import { getModifiedTime } from "@/api/pipeNet_msg/msg";

import { getOrganDictTree } from "@/api/common/get_area";
import * as esriLoader from "esri-loader";
// esriLoader.loadCss(dse.arcgis_themeCss);
esriLoader.loadCss(dse.arcgis_mainCss);

let pipeUrl = dse.arcgis_belowMap;
let xfsUrl = dse.arcgis_pipe;
let fmUrl = dse.arcgis_points;
let wireMap = dse.arcgis_wire;
let gasMap = dse.arcgis_gas;
let jxjMap = dse.arcgis_jxj;

let startJs = dse.arcgis_startJS;
const options = {
  url: startJs,
  dojoConfig: dse.gisConfig
};
let userPoint = ""; //大用水户生成的函数
// window.delPoint = function (index) {
//     view.graphics.splice(index, 1);
//     view.popup.close();
// }
// 二维管网相关.
import popupUtils from "@/common/utils/popupUtils";
//管网图层配置
import gw2dConfig from "@/common/config/gis2d/gw2dConfig";

// 消防栓配置
import xfs2dConfig from "@/common/config/gis2d/xfs2dConfig";

// 阀门配置
import fm2dConfig from "@/common/config/gis2d/fm2dConfig";

//天然气配置
import gas2dConfig from "@/common/config/gis2d/gas2dConfig";
//电线配置
import dx2dConfig from "@/common/config/gis2d/dx2dConfig";
//检修井
import jxj2dConfig from "@/common/config/gis2d/jxj2dConfig";

import layerUtils from "@/common/utils/layerUtils";

let showUserListPoints = null; //函数  显示出有经纬度的点
let temp_creatPoint = []; // 临时上传的用户点的数据
let temp_baseUrl = dse.baseURL;

let queryUserPoint = null; // 查询用户点的函数
let temp_staticPath = dse.static_baseUrl; //静态问价路径
// let area_iframe_url = "" + temp_baseUrl + "/#/pipe/pipeNet_route/gisFrame_bigUser_manage"   //  开发环境
let area_iframe_url =
  "" +
  temp_baseUrl +
  "/?id=" +
  id +
  "#/pipe/pipeNet_route/gisFrame_bigUser_manage"; // 生产环境
let iframe_area =
  '<iframe src="' +
  area_iframe_url +
  '" height="300" width="500"  scrolling="no" frameborder="0"></iframe>';
export default {
  components: {
    tools,
    pagenation,
    selectTree,
    DelModel
  },
  data() {
    return {
      addFlag: true, //当前页面按钮级的权限  新增按钮
      showLegend: true,
      view: null,
      map: null,
      layer1: null,
      layer2: null,
      layer3: null,
      layer4: null,
      layer5: null,
      layer6: null,
      userLayer: null,
      distance: null, // 量距离
      drawTools: null, //画基本图
      area: null, // 量面积
      small: false,
      tableStatus: true,
      search_str: "", //查询对象 的数值
      areas: [],
      areas_item: "", // 选择区域id
      searchValue: "", // 查询的名字
      activeFlag: 0,
      inputSomething: "",
      tree: [],
      area_users: [],
      modelType: false, // 显示删除的弹窗
      delList: [], // 要删除的id 数组
      showDelFlag: false, //  开关删除的弹窗
      showEditFlag: false, //开关  编辑的弹窗
      totalPage: 1,
      delId: null, //要删除的ID
      del_areaIndex: null, //要删除的区域索引
      del_userIndex: null, //要删除的用户索引
      newUserIndex: 0, // 新增用水户索引
      addPoint_status: false, //是否切换新增的列表
      addList: [], //新增点的数据
      removeCreateUsers: [], //删除的创建用户
      cancelUser_index: null, //选择删除的用户的索引
      cancelAllStatus: false, //删除全部用户的状态
      search_pipe_type: null, //用户属性 类型  水司或水厂 1.水司 2.水厂
      componyID: null, //水司或水厂id
      initCompony: "", //初始化的公司名字
      model_outerSide_flag: false, //判断是否是外部触发弹窗
      layers: [
        {
          name: "所有设备",
          id: "allDev",
          active: true
        },
        {
          name: "管网",
          id: "turbe",
          active: true
        },
        {
          name: "阀门",
          id: "tap",
          active: true
        },
        {
          name: "消防栓",
          id: "fireplug",
          active: true
        },
        {
          name: "检修井",
          id: "repairWells",
          active: true
        },
        {
          name: "天然气",
          id: "gas",
          active: false
        },
        {
          name: "电缆",
          id: "cable",
          active: false
        },
        {
          name: "计量仪器",
          id: "monitor",
          active: true
        },
        {
          name: "其他",
          id: "others",
          active: true
        }
      ],
      searchLayer: null, //查询图层的弹窗
      updateTime: {
        UPDATETIME: ""
      } //gis更新时间
    };
  },
  methods: {
    closeLegend() {
      this.showLegend = false;
    },
    showLegend_() {
      this.showLegend = true;
    },
    createMap(companyId,potions) {
      let that = this;
      esriLoader
        .loadModules(
          [
            "esri/Map",
            "esri/views/MapView",
            "dse//modules/toolbars/_Draw",
            "dse/modules/measure/_measureDistance",
            "dse/modules/measure/_measureArea",
            "esri/Graphic",
            "esri/views/2d/draw/Draw",
            "esri/widgets/Search",
            "esri/tasks/QueryTask",
            "esri/tasks/support/Query",
            "esri/layers/GraphicsLayer",
            "dse/utils/BaseMapUtils",
            "dojo/domReady!"
          ],
          options
        )
        .then(
          ([
            Map,
            MapView,
            _Draw,
            _measureDistance,
            _measureArea,
            Graphic,
            Draw,
            Search,
            QueryTask,
            Query,
            GraphicsLayer,
            BaseMapUtils
          ]) => {
            layerUtils.bindAmdClass(QueryTask, Query, GraphicsLayer, Graphic);
            // Create the map
            that.map = new Map({
              // basemap: "hybrid"
            });

            let baseMapUtils = new BaseMapUtils({
              map: that.map,
              mapType: "2"
            });

            //debugger;
            baseMapUtils.loadBaseLayers(dse.baseMapLayers);

            // 电线图层
            dx2dConfig.url = wireMap;
            // that.layer4 = layerUtils.loadData(that.map, dx2dConfig);
            //===================================================

            // 天然气图层
            gas2dConfig.url = gasMap;
            // that.layer5 = layerUtils.loadData(that.map, gas2dConfig);
            //===================================================
            // 管网图层.
            let pipeUrl = that.$store.getters.get_pipe_defaultLayer

            gw2dConfig.url = pipeUrl;
            gw2dConfig.popupTemplate.visible = false;
            that.layer1 = layerUtils.loadData(that.map, gw2dConfig,companyId);
            //===================================================
            //检修井
            jxj2dConfig.url = jxjMap;
            // that.layer6 = layerUtils.loadData(that.map, jxj2dConfig);
            //==================================================

            // 阀门图层
            let fmUrl = that.$store.getters.get_fm_defaultLayer
            fm2dConfig.url = fmUrl;
            that.layer3 = layerUtils.loadData(that.map, fm2dConfig,companyId);
            //===================================================
            // 消防栓图层
            let xfsUrl = that.$store.getters.get_xfs_defaultLayer
            xfs2dConfig.url = xfsUrl;
            that.layer2 = layerUtils.loadData(that.map, xfs2dConfig,companyId);
            //===================================================
            setTimeout(() => {
              that.map.layers.remove(that.layer4);
              that.map.layers.remove(that.layer5);
            }, 500);
            //  用户点的 图层
            that.userLayer = new GraphicsLayer({
              graphics: [],
              outFields: ["*"]
            });
            that.map.add(that.userLayer);

            that.view = new MapView({
              container: "waterInformation",
              map: that.map,
              zoom: 15,
              center: potions
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
            userPoint = function() {
              let drawPoint = new Draw({
                view: that.view
              });
              let action = drawPoint.create("point");
              // action.on("vertex-add", function (evt) {
              //     createPointGraphic(evt.coordinates);
              // });
              action.on("draw-complete", function(evt) {
                createPointGraphic(evt.coordinates);
              });
            };

            function createPointGraphic(coordinates) {
              //   view.graphics.removeAll();
              let point = {
                type: "point",
                x: coordinates[0],
                y: coordinates[1],
                spatialReference: that.view.spatialReference
              };
              that.newUserIndex = that.newUserIndex + 1;

              let graphic = new Graphic({
                geometry: point,
                attributes: {
                  id: that.newUserIndex - 1
                },
                symbol: {
                  type: "picture-marker",
                  url:
                    "" +
                    temp_staticPath +
                    "/gis_temporary_pic/normal_bigUser.png",
                  width: "20px",
                  height: "28px"
                },
                popupTemplate: {
                  content: iframe_area,
                  title: "新增点"
                }
              });
              that.view.graphics.add(graphic);
              let temp_json = {};
              temp_json.attributes = graphic.attributes.id;
              temp_json.latitude = graphic.geometry.latitude;
              temp_json.longitude = graphic.geometry.longitude;
              dse.globalData = temp_json;

              dse.temp_arr = that.areas;

              that.view.popup.open({
                title: "新增用水户",
                content: "" + iframe_area,
                location: point
              });
            }

            // setTimeout(() => {
            let temp_arr = that.area_users;
            if (temp_arr.length) {
              for (let i = 0; i < temp_arr.length; i++) {
                if (temp_arr[i].LGTD) {
                  that.newUserIndex = that.newUserIndex + 1;
                  let point = {
                    type: "point",
                    longitude: temp_arr[i].LGTD,
                    latitude: temp_arr[i].LTTD
                  };

                  let temp_point = new Graphic({
                    geometry: point,
                    attributes: temp_arr[i],
                    symbol: {
                      type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                      url:
                        "" +
                        temp_staticPath +
                        "/gis_temporary_pic/normal_bigUser.png",
                      width: "20px",
                      height: "28px"
                    },
                    popupTemplate: {
                      content: iframe_area,
                      title: "用水户",
                      attributes: temp_arr[i]
                    }
                  });
                  that.userLayer.add(temp_point);
                }
              }
            }
            // }, 1000)

            showUserListPoints = function(rows) {
              let temp_arr = rows;

              if(that.userLayer){
                that.userLayer.removeAll();
              }

              if (temp_arr.length) {
                // that.view.graphics.removeAll();
                that.userLayer.removeAll();
                that.newUserIndex = 0;
                for (let i = 0; i < temp_arr.length; i++) {
                  if (temp_arr[i].LGTD) {
                    that.newUserIndex = that.newUserIndex + 1;
                    let point = {
                      type: "point",
                      longitude: temp_arr[i].LGTD,
                      latitude: temp_arr[i].LTTD
                    };

                    let temp_point = new Graphic({
                      geometry: point,
                      attributes: temp_arr[i],
                      symbol: {
                        type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                        url:
                          "" +
                          temp_staticPath +
                          "/gis_temporary_pic/normal_bigUser.png",
                        width: "20px",
                        height: "28px"
                      },
                      popupTemplate: {
                        content: iframe_area,
                        title: "用户",
                        attributes: temp_arr[i]
                      }
                    });
                    // that.view.graphics.add(temp_point);
                    that.userLayer.add(temp_point);
                  }
                }
              } else {
                // that.view.graphics.removeAll();
                that.userLayer.removeAll();
              }
            };

            that.view.on("click", function(event) {
              that.model_outerSide_flag = false;
            });
            //监听弹出框.
            that.view.popup.watch("selectedFeature", function(
              newView,
              oldValue,
              portery,
              object
            ) {
              window.graphic = that.view.popup.selectedFeature;
              if (window.graphic) {
                let temp_flag = that.model_outerSide_flag;
                if (!temp_flag) {
                  let params = window.graphic.attributes;
                  params.show = true;
                  dse.globalData = params;

                  if (params.AREA_ID == undefined) {
                    let temp_json = {};
                    temp_json.attributes = graphic.attributes.id;
                    temp_json.latitude = graphic.geometry.latitude;
                    temp_json.longitude = graphic.geometry.longitude;
                    dse.globalData = temp_json;
                  }
                }
              }
            });

            //搜索查询对应的用户点
            queryUserPoint = function(id) {
              let temp_arr = that.userLayer;
              let points = temp_arr.graphics.items;
              let point_modle = null;
              if (points.length > 0) {
                for (let i = 0; i < points.length; i++) {
                  if (points[i].attributes.ID == id) {
                    that.view.popup.open({
                      title: "用户",
                      content: "" + iframe_area,
                      updateLocationEnabled: true,
                      location: points[i].geometry
                    });
                    dse.globalData = points[i].attributes;
                    dse.globalData.show = true;
                    break;
                  }
                }
              }
            };
          }
        );
    },
    gotoDetail(areaId, userId, name) {
      this.$router.push({
        name: "infoTable",
        params: {
          areaId: areaId,
          userId: userId,
          title: name
        }
      });
      this.$store.commit("setAside_status", false);
      this.$emit("hiddenAside");
    },
    showModelDetail(id) {
      let that = this;
      queryUserPoint(id);
    },
    toggleShow() {
      this.tableStatus = !this.tableStatus;
      if (this.tableStatus == true && this.timeLine_flag == false) {
        this.timeLine_flag = true;
      } else {
        this.timeLine_flag = false;
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
          that.distance.clear();
          that.area.clear();
          that.distance.start();
          break;
        case "测面":
          that.area.clear();
          that.distance.clear();
          that.area.start();
          break;
        case "画点":
          that.distance.clear();
          that.area.clear();
          that.drawTools.activate("point");
          break;
        case "画面":
          that.distance.clear();
          that.area.clear();
          that.drawTools.activate("polygon");
          break;
        case "清除所有":
          that.distance.clear();
          that.area.clear();
          break;
      }
    },
    analysis() {},
    searchObj(json_) {
      if (json_) {
        this.search_str = json_;
        this.componyID = json_.id;
        this.getOrganDictTree_(json_.id);
      } else {
        this.search_str = {
          label: "全部城区",
          id: ""
        };
      }
    },
    toggleSelect(index, id) {
      this.delId = id;
      this.del_areaIndex = index;
      // this.del_userIndex = i);
      this.showDelFlag = true;
    },
    showDelModel() {
      let that = this;
      if (that.delList.length == 0) {
        return;
      }
      this.showDelFlag = true;
    },
    hiddenDelModel(val) {
      let that = this;
      this.showDelFlag = val.modelFlag;
    },
    justDel(val) {
      let that = this;
      // let temp_id = val.num;
      // let tepm_ids = val.num[0];
      let temp_delId = this.delId;
      that.sureDel(temp_delId);
    },
    showEditModel() {
      this.showEditFlag = true;
    },
    hiddenEditModel(val) {
      this.showEditFlag = false;
    },
    saveEditInputs(val) {
      this.showEditFlag = false;
      // ajax  保存请求
    },
    getAreaUserList(id, name, areaId, page) {
      let that = this;
      let temp_id = that.componyID;
      let temp_type = that.search_pipe_type;
      getPipeWaterUserInfo({
        id: "" + id,
        name: "" + name,
        areaId: "" + areaId,
        pageSize: "10",
        page: "" + page,
        type: "" + temp_type,
        factoryId: "" + temp_id
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
          let data = res.data;
          if (data) {
            let { rows } = data;
            that.area_users = rows || [];
            showUserListPoints(rows);
            let { total } = data;
            if (total) {
              that.totalPage = Math.ceil(parseInt(total) / 10);
            }
          } else {
            that.area_users = [];
          }
        })
        .catch(function(error) {
          if (error == "Error: Network Error") {
            that.$message.error("网络错误");
            return;
          }
          that.$message.error("逻辑错误!");
        });
    },
    sureDel(id) {
      let that = this;
      updateWaterUser({
        id: "" + id,
        status: "3"
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
          let temp_userIndex = that.temp_userIndex;
          if (res.status) {
            that.showDelFlag = false;
            that.area_users.splice(temp_userIndex, 1);
          }
        })
        .catch(function(error) {
          // if (error == "Error: Network Error") {
          //     that.$message.error("网络错误")
          //     return;
          // }
          // that.$message.error("逻辑错误!")
        });
    },
    gotoThisPage(val) {
      let temp_page = val + "";
      this.getAreaUserList("", "", "", temp_page);
    },
    search() {
      this.addPoint_status = false;
      this.view.graphics.items = [];
      this.addList = [];
      this.removeCreateUsers = [];
      let temp_search_company = this.search_str.id ? this.search_str.id : "";
      let temp_areaId = this.areas_item;

      if (temp_areaId == "全部城区" || temp_areaId == undefined) {
        temp_areaId = "";
      }
      // let temp_searchValue = this.searchValue;
      let temp_searchValue_ = this.inputSomething;
      this.getAreaUserList(
        "",
        // temp_searchValue,
        temp_searchValue_,
        temp_areaId,
        "1"
      );
    },
    toggleSelectThis(val) {
      let that = this;
      let temp_list = val;
      for (let i = 0; i < temp_list.length; i++) {
        if (temp_list[i].active) {
          switch (temp_list[i].name) {
            case "管网":
              that.map.layers.remove(that.layer1);
              that.map.add(that.layer1);
              break;
            case "阀门":
              that.map.layers.remove(that.layer3);
              that.map.add(that.layer3);
              break;
            case "消防栓":
              // that.view.graphics.removeAll();
              that.map.layers.remove(that.layer2);
              that.map.add(that.layer2);
              break;
            case "天然气":
              // that.view.graphics.removeAll();
              that.map.layers.remove(that.layer5);
              that.map.add(that.layer5);
              break;
            case "电缆":
              that.map.layers.remove(that.layer4);
              that.map.add(that.layer4);
              break;
            case "检修井":
              that.map.layers.remove(that.layer6);
              // that.view.graphics.removeAll();
              that.map.add(that.layer6);
              break;
            case "监测仪器":
              // that.map.add(that.layer1);
              break;
            case "其它":
              // that.map.add(that.layer1);
              break;
          }
        } else {
          switch (temp_list[i].name) {
            case "管网":
              that.map.layers.remove(that.layer1);
              break;
            case "阀门":
              that.map.layers.remove(that.layer3);
              break;
            case "消防栓":
              that.map.layers.remove(that.layer2);
              break;
            case "天然气":
              that.map.layers.remove(that.layer5);
              break;
            case "电缆":
              that.map.layers.remove(that.layer4);
              break;
            case "检修井":
              that.map.layers.remove(that.layer6);
              break;
            case "监测仪器":
              // that.map.add(that.layer1);
              break;
            case "其它":
              // that.map.add(that.layer1);
              break;
          }
        }
      }
    },
    addUser() {
      // view.graphics.removeAll();
      let that = this;
      let flag = this.addFlag;
      if (!flag) {
        return;
      }
    //  let temp_companyId =  that.componyID
    //  let temp_inputSomething = this.inputSomething
    //  let temp_areas_item = this.areas_item
    //  this.getAreaUserList(temp_companyId, temp_inputSomething, temp_areas_item, '1')
     that.view.graphics.removeAll()
     that.view.popup.close()
    userPoint();
    this.addPoint_status = true;
    window.this_ = this;
    },
    fetchAddUser(array) {
      let that = this;
      saveOrUpdate(array)
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
            that.addPoint_status = false;
            that.$message.success("保存成功!");
            that.getAreaUserList("", "", "", "1");
            // that.view.popup.close();
          } else {
            that.$message.error("保存失败!");
          }
        })
        .catch(function(error) {
          // if (error == "Error: Network Error") {
          //     that.$message.error("网络错误")
          //     return;
          // }
          // that.$message.error("逻辑错误!")
        });
    },
    saveUsers() {
      let saveData = this.addList;
      this.fetchAddUser(saveData);
    },

    removeUser() {
      let that = this;
      let temp_addList = that.addList;
      let temp_removeCreateUsers = that.removeCreateUsers;
      let configRemove_indexs = [];
      if (temp_removeCreateUsers.length) {
        for (let i = 0; i < temp_addList.length; i++) {
          let flag = false;
          for (let j = 0; j < temp_removeCreateUsers.length; j++) {
            if (temp_removeCreateUsers[j] == i) {
              flag = true;
              break;
            }
            if (j == temp_removeCreateUsers.length - 1 && !flag) {
              configRemove_indexs.push(i);
            }
          }
        }
        async function dataAction() {
          let view_gis = [];
          let points = [];
          for (let k = 0; k < configRemove_indexs.length; k++) {
            view_gis.push(that.view.graphics.items[configRemove_indexs[k]]);
            points.push(that.addList[configRemove_indexs[k]]);
          }
          return {
            view_gis: view_gis,
            points: points
          };
        }
        dataAction().then(res => {
          that.view.graphics.items = res.view_gis;
          that.addList = res.points;
          this.cancelAllStatus = false;
          that.removeCreateUsers = [];
        });
      }
    },
    resetAllUser(flag) {
      let temp_arr = this.addList;
      for (let i = 0; i < temp_arr.length; i++) {
        if (flag) {
          temp_arr[i].status = true;
        } else {
          temp_arr[i].status = false;
        }
      }
      return temp_arr;
    },
    justifyAllUser_flag() {
      let temp = this.addList;
      let sumCount = 0;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].status_) {
          sumCount += 1;
        }
      }
      return sumCount == temp.length;
    },
    cancelAll() {
      let that = this;
      this.cancelAllStatus = !this.cancelAllStatus;
      if (this.cancelAllStatus) {
        this.addList = this.resetAllUser(true);
        for (let i = 0; i < that.addList.length; i++) {
          that.removeCreateUsers.push(i);
        }
      } else {
        this.addList = this.resetAllUser(false);
        this.removeCreateUsers = [];
      }
    },
    selectThisUser(index) {
      let that = this;
      this.cancelUser_index = index;
      this.addList[index].status_ = !this.addList[index].status_;
      if (this.addList[index].status_) {
        this.removeCreateUsers.push(index);
      } else {
        if (this.removeCreateUsers.length > 0) {
          let temp_arr = this.removeCreateUsers;
          for (let j = 0; j < temp_arr.length; j++) {
            if (temp_arr[j] == index) {
              temp_arr.splice(j, 1);
              break;
            }
          }
          this.removeCreateUsers = temp_arr;
        }
      }
      let flag = this.justifyAllUser_flag();
      if (flag) {
        this.cancelAllStatus = true;
      } else {
        this.cancelAllStatus = false;
      }
    },
    getAreaID(val) {
      this.areas_item = val;
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
            that.areas = tempList;
            that.areas_item = "全部城区";
          } else {
            that.areas = [
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
    getUpdateTime() {
      let that = this;
      getModifiedTime({
        year: ""
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
        that.updateTime = res.data && res.data[0] ? res.data[0] : "";
      });
    }
  },
  mounted() {
    let that = this;
    let temp_companyId = that.componyID;
    //  得到 当前的 经纬度数据
    let  potions = this.$store.getters.get_cityPosition
    if(potions===[]){
        potions = [106.290351, 36.001819]
    }
    that.createMap(temp_companyId,potions);

  },
  created() {
    let that = this;
    if (document.body.clientWidth < 1600) {
      this.small = true;
    }
    this.areas = this.$store.getters.get_cityAreas;
    let temp_tree = (this.tree = this.$store.getters.get_orgTree);
    this.areas_item = "全部城区";
    that.componyID = this.$store.getters.get_companyId;
    this.initCompony = temp_tree[0].label;
    this.search_pipe_type = temp_tree[0].type;
    this.addFlag = this.$store.getters.get_pages_btn_allow.waterInformation.add;
    this.getAreaUserList("", "", "", "1");
    this.getUpdateTime();
  },
  beforeDestroy() {
    let that = this;
    // that.distance.clear();
    // that.area.clear();
  },
  filters: {
    formate_time(val) {
      let temp_val = val;
      temp_val = temp_val.split(" ");
      temp_val = temp_val[0];
      let temp_year = temp_val.split("-")[0] + "年";
      let temp_month = temp_val.split("-")[1] + "月";
      let temp_day = temp_val.split("-")[2] + "日";
      return temp_year + temp_month + temp_day;
    }
  }
};
</script>

<style lang="scss" scoped>
$base-font: 14px;
$weight: 600;

* {
  box-sizing: border-box;
}

#waterInformation {
  width: 100%;
  height: 100%;

  .top-tabs {
    width: 350px;
    height: 30px;
    position: absolute;
    top: 10px;
    right: 10px;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    border-radius: 5px;

    &.small {
      width: 240px;
    }
  }

  .wrap-legend {
    width: 300px;
    height: 170px;
    position: absolute;
    bottom: 10px;
    left: 20px;

    .legend {
      width: 300px;
      height: 130px;
      padding: 10px;
      background: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
      position: relative;

      margin-bottom: 10px;

      .close {
        position: absolute;
        right: 3px;
        top: 3px;
        display: inline-block;
        font-size: 12px;
        cursor: pointer;
      }

      .pipe-desc {
        width: 100%;
        height: 64px;
        overflow-y: auto;

        .col {
          width: 100%;
          display: flex;
          justify-content: space-between;

          .pipe-item {
            width: 100%;
            padding: 5px;
            height: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #333;
            text-align: center;

            span {
              display: inline-block;
              width: 50%;
              height: 10px;

              &.water {
                background: #44cef6;
              }

              &.gas {
                background: #ff4777;
              }

              &.wire {
                background: #ff2121;
              }
            }
          }
        }
      }

      .sm-desc {
        width: 100%;
        height: 50px;
        background: #e5e2e2;
        overflow-x: auto;
        display: flex;
        justify-content: center;

        .sm-item {
          width: 50px;
          height: 100%;
          padding: 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 12px;

          img {
            height: 16px;
            display: inline-block;
            margin-bottom: 5px;
          }
        }
      }
    }

    .socket {
      width: 300px;
      height: 30px;
      line-height: 30px;
      background: #fff;
      font-size: 12px;
      color: #333;
      padding-left: 10px;
      text-align: center;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    }
  }

  .legend-btn {
    position: absolute;
    bottom: 50px;
    left: 20px;
    width: 40px;
    height: 40px;
    font-size: 12px;
    line-height: 40px;
    border-radius: 50%;
    cursor: pointer;
    background: #0b83fe;
    color: #fff;
    text-align: center;
  }

  .search-table {
    position: absolute;
    right: 10px;
    top: 50px;
    height: calc(100% - 70px);
    margin-bottom: 20px;
    z-index: 100;
    background: #fff;

    .toggle-tab {
      position: absolute;
      top: 50%;
      left: -12px;
      width: 24px;
      height: 88px;
      border: 1px solid #ccccc8; // border-right: none;
      line-height: 86px;
      cursor: pointer;
      margin-top: -44px;
      margin-left: -12px;
      background: #fff;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      text-align: center;
    }

    .wrap-table {
      width: 350px;
      height: 100%;
      border: 1px solid #c2c2c2;

      &.small {
        width: 240px;
      }

      &.small .select-tabs > span {
        font-size: 12px;
        padding: 0 5px !important;
      }

      &.small .f-item {
        font-size: 12px;

        .el-select {
          width: 120px !important;
          margin-right: 10px;
        }

        .el-input {
          width: 120px !important;
        }

        .el-button {
          font-size: 12px;
        }
      }

      .wrap-search {
        width: 100%; // height: 100%;
        padding: 10px 10px;

        .searchObj {
          height: 30px;
          line-height: 30px;
          width: 100%;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;

          & > span {
            display: inline-block;
            width: 75px;
          }

          .el-select {
            width: calc(100% - 80px);
          }

          #selectTree {
            width: calc(100% - 80px);
          }
        }

        .inner-select {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .row {
            width: 100%;

            .col {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;

              &:last-child {
                margin-bottom: 0;
              }

              & > span {
                display: inline-block;
                width: 80px;
              }

              .el-select {
                width: calc(100% - 80px);
              }

              .el-input {
                width: calc(100% - 80px);
              }
            }

            &.first {
              width: calc(100% - 55px);
            }

            &.last {
              width: 50px;
            }
            span.search {
              display: inline-block;
              text-align: center;
              color: #fff;
              background: #0b83fe;
              border-radius: 5px;
              width: 50px;
              padding: 7px 0;
              cursor: pointer;
            }
          }
        }
      }

      .actions {
        height: 35px;
        width: 100%;
        background: #dcdedd;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 14px;
        padding: 0 10px;
				.notice{
					color: red;
				}
        &.ifAllowed {
          display: none;
        }

        div {
          display: inline-block;
          padding: 0 10px;
          background: #0b83fe;
          line-height: 25px;
          border-radius: 5px;
          cursor: pointer;
          margin-left: 20px;
          color: #fff;
          span {
          }
        }
      }

      .contentLists {
        width: 100%;
        height: calc(100% - 116px); // overflow-y: auto;
        .inner-wrap {
            width: 100%;
            height: calc(100% - 89px);
            overflow: auto;
          table {
            width: 100%;
            border-spacing: 0;

            tr {
              width: 100%;

              td {
                text-align: center;
                min-height: 34px;
                border-right: 1px solid #ccc;

                span {
                  display: inline-block;
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  line-height: 30px;
                }
              }
            }
          }
        }

        .content-item {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #333;
          border-bottom: 1px solid #ccc;

          & > td {
            display: flex;
            align-items: center;
            text-align: center;
            line-height: 30px;

            &.cursor {
              cursor: pointer;
              color: #0a83fe;
            }

            .row {
              border-left: 1px solid #ccc;
              border-bottom: 1px solid #ccc;
              border-right: 1px solid #ccc;

              &:last-child {
                border-bottom: none;
              }
            }
          }

          .item {
            width: 60px;
          }

          &.content {
            .item {
              border-right: 1px solid #ccc;

              &:last-child {
                border-right: none;
              }
            }
          }

          .ownArea {
            position: relative;
            overflow-x: hidden;
          }

          .userUnit {
            width: calc(100% - 180px);
            border-right: 1px solid #ccc;
            position: relative;
            overflow-x: hidden;
            padding-right: 20px;

            i {
              position: absolute;
              right: -40px;
              top: 10px;
              width: 12px;
              height: 12px;
              display: inline-block; // border: 1px solid #ccc;
              // margin-right: 10px;
              cursor: pointer;
              transition: all 0.5s linear; // &.ifDel {
              //   background: url("../../assets/images/pipeNet_manage/waterInformation/selected.png")
              //     no-repeat center center;
              //   background-size: cover;
              // }
            }

            &:hover {
              i {
                right: 10px;
              }
            }

            .row {
              width: 100%;
              padding: 0 10px;
              text-align: left;
              display: flex;
              align-items: center;
              position: relative;
              overflow-x: hidden;

              .unitName {
                display: inline-block;
                margin-left: 30px;
                width: calc(100% - 40px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }

          &.top-head {
            font-weight: 600;
            background: #e2edef;

            & > div {
              & > div {
                border-right: 1px solid #ccc;
              }

              &:last-child > div {
                border-right: none;
              }
            }
          }

          & > div.short {
            width: 120px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-left: 10px;
            cursor: pointer;
            border-right: 1px solid #ccc;

            span:first-child {
              display: inline-block;
              width: 14px;
              height: 14px;
              border: 1px solid #ccc;
              margin-right: 10px;

              &.actived {
                background: url("../../assets/images/common/select.png")
                  no-repeat center center;
                background-size: 100% 100%;
              }
            }
          }

          & > div.long {
            width: calc(100% - 120px);
          }
        }

        .add-list {
          width: 100%;
          height: calc(100% - 70px);

          .content-item {
            width: 100%;
            height: 30px;
            line-height: 29px;
            border-bottom: 1px solid #ccc;

            .col {
              height: 30px;
            }

            .col:first-child {
              width: 120px;
              cursor: pointer;
              border-right: 1px solid #ccc;
              text-align: left;
              padding-left: 10px;
              display: flex;
              align-items: center;

              span {
                display: inline-block;
                width: 14px;
                height: 14px;
                border: 1px solid #ccc;

                &.actived {
                  background: url("../../assets/images/common/select.png")
                    no-repeat center center;
                  background-size: 100% 100%;
                }
              }
            }

            .col:last-child {
              width: calc(100% - 120px);
            }
          }
        }

        .actions {
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: center;
        }
      }

      &.samll .pages {
        font-size: 12px;
      }

      .pages {
        width: 100%;
        // position: absolute;
        // bottom: 10px;
        // left: 0;
        height: 40px;
        line-height: 40px;
        background: #fff;
      }
    }
  }
}
</style>
