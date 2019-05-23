<template>
    <div id="surver" :class="{frame_small:iframe_width_flag==true}">
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
                                <span>所属区域:</span>
                                <el-select v-model="search.areaId" placeholder="请选择" @change="getArea">
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
                                <span>监测点名称</span>
                            </div>
                            <div class="col">
                                <span>实际检测值</span>
                            </div>
                            <div class="col">
                                <span>正常范围</span>
                            </div>
                            <div class="col">
                                <span>开始时间</span>
                            </div>
                            <div class="col">
                                <span>状态</span>
                            </div>
                        </div>
                        <div class="tbody">
                            <template v-if="list.length>0">
                                <div class="listItem" v-for="(item,index) in list" :key="index">
                                    <div class="col">
                                        <span :title="item.MONI_NAME">{{item.MONI_NAME}}</span>
                                    </div>
                                    <div class="col">
                                        <span>{{item.MONI_VAL}}</span>
                                    </div>
                                    <div class="col">
                                        <span :title="item.VAL_RANGE">{{item.VAL_RANGE}}</span>
                                    </div>
                                    <div class="col" :title="item.START_TIME">
                                        <span>{{item.START_TIME}}</span>
                                    </div>
                                    <div class="col actions">
                                        <template v-if="item.HANDLE_STATE=='1'">
                      <span
                              :class="{success:item.HANDLE_STATE=='1'}"
                      >{{item.HANDLE_STATE|formateStatus}}</span>
                                        </template>
                                        <template v-if="item.HANDLE_STATE=='2'">
                      <span
                              @click="show_doModel(item)"
                              :class="{down:item.HANDLE_STATE=='2',ifDo:actionFlag===false}"
                      >{{item.HANDLE_STATE|formateStatus}}</span>
                                        </template>
                                        <template v-else>
                      <span
                              :class="{doing:item.HANDLE_STATE=='3'}"
                      >{{item.HANDLE_STATE|formateStatus}}</span>
                                        </template>
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
        <div class="layerSelect">
            <div
                    class="col"
                    :class="{actived:index==activedLayer}"
                    v-for="(item,index) in layers_"
                    :key="index"
                    @click="selectThis(index)"
            >
        <span class="rect">
          <span class="dolt"></span>
        </span>
                <span>{{item.name}}</span>
            </div>
        </div>
        <dispatch-table-model
                :showDefinedModel="toggoleShowDispatach"
                :title="'请派单'"
                @hiddenSelf="hiddenDispatchModel"
        >
            <div class="subContent_">
                <div class="topHead">
                    <div class="row">
                        <div class="col">
                            <span>监测点名称:{{dispatch_data.MONI_NAME}}</span>
                        </div>
                        <div class="col">
                            <span></span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span>检测项类型:{{dispatch_data.MONI_TYPE|formateType}}</span>
                        </div>
                        <div class="col">
                            <span>实时检测值:{{dispatch_data.MONI_VAL}}</span>
                        </div>
                    </div>
                </div>
                <div class="tips">
                    <textarea v-model="problem_desc" placeholder="请填写描述信息"></textarea>
                </div>
                <!-- <div class="selectTable">
                  <div
                    class="row"
                    v-for="(item,index) in select_tables"
                    :key="index"
                    :class="{actived:activedIndex==index}"
                    @click="selectThisTable(index)"
                  >
                    <span class="radio">
                      <i class="dolt"></i>
                    </span>
                    <span>{{item.name}}</span>
                  </div>
                </div> -->
                <div class="actions">
                    <template v-if="problem_desc==''">
                        <span :class="{ifClick:problem_desc==''}">派单</span>
                        <span :class="{ifClick:problem_desc==''}">处理</span>
                    </template>
                    <template v-else>
                        <span @click="dispatch">派单</span>
                        <span @click="down">处理</span>
                    </template>
                </div>
            </div>
        </dispatch-table-model>

        <div class="legend_ legend-left">
            <!-- <template v-if="legend_show==false"> -->
            <legend-model
                    :list="legendList"
                    :topHeight="'40px'"
                    :ifClosed="legend_show"
                    @closedSelf="closeLegend"
                    :textWidth="60"
            >
                <div class="devs">
                    <div class="col">
                        <img src="../../assets/images/common/flow.png" alt>
                        <span>流量</span>
                    </div>
                    <div class="col">
                        <img src="../../assets/images/common/qc.png" alt>
                        <span>水质</span>
                    </div>
                    <div class="col">
                        <img src="../../assets/images/common/press.png" alt>
                        <span>水压</span>
                    </div>
                    <div class="col">
                        <img src="../../assets/images/common/jxj.png" alt>
                        <span>检修井</span>
                    </div>
                </div>
            </legend-model>
            <!-- </template>
            <template v-else>
              <div class="legend-btn" @click="showLegend_">
                <span>图例</span>
              </div>
            </template> -->
        </div>
    </div>
</template>

<script>
    import {
        getPipeMonitorWarnList,
        handleMonitorWarnInfo
    } from "@/api/monitor/surver";
    import {getOrganDictTree} from "@/api/common/get_area";
    import * as esriLoader from "esri-loader";

    esriLoader.loadCss(dse.arcgis_mainCss);
    let startJs = dse.arcgis_startJS;
    const options = {
        url: startJs,
        dojoConfig: dse.gisConfig
    };
    let pipeUrl = dse.arcgis_belowMap;

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

    import pagenation from "@/common/components/pagination";
    import gistools from "@/common/components/gis_units/tools";
    import selectTree from "@/common/components/selectWithTree";

    let temp_staticPath = dse.static_baseUrl; //静态问价路径

    import dispatchTableModel from "@/common/components/poupe/defined";

    import legendModel from "@/common/components/legend";

    export default {
        components: {
            pagenation,
            gistools,
            selectTree,
            dispatchTableModel,
            legendModel
        },
        data() {
            return {
                actionFlag: true, //处理按钮的权限控制
                problem_desc: "", //派单弹窗的 编辑文字
                toggoleShowDispatach: false, //显示派单弹窗的开关
                title: "", //派单弹窗题目
                dispatch_data: {
                    MONI_NAME: "",
                    MONI_TYPE: "",
                    MONI_VAL: "",
                    ID: ""
                }, //派单弹窗中的数据
                view: null,
                map: null,
                layer1: null, //管道图层
                layer2: null, //检修井的图层
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
                layers_: [
                    // 图层列表
                    {
                        name: "流量"
                    },
                    {
                        name: "水压"
                    },
                    {
                        name: "水质"
                    }
                ],
                activedLayer: 0, //左侧图层切换的激活状态
                paginate: {
                    //分页器
                    ifSmall: true,
                    totalPage: 1
                },
                list: [], //数据列表
                view: null, //arcgis的view
                map: null, //arcgis的map
                distance: null, //自定义量距
                area: null, //自定义画面
                qc_layer: [], //水质的数据
                press_layer: [], // 水压的数据
                flow_layer: [], // 水流的数据
                iframe_width_flag: false, // 判断arcgis中的弹窗的宽度大小 如果是点击的弹窗则宽度为500，悬浮状态下的弹窗宽度为100，默认是500
                legendList: {
                    top: [
                        {
                            color: "#44cef6",
                            name: "输水管线"
                        }
                    ]
                },
                select_tables: [
                    {
                        name: "原有工单"
                    },
                    {
                        name: "标准工单"
                    }
                ],
                activedIndex: 0, //工单选择的索引
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

                            //debugger;
                            baseMapUtils.loadBaseLayers(dse.baseMapLayers);
                            let temp_baseUrl = that.DSE.baseURL;
                            let pressFlow_iframe_url =
                                "" +
                                temp_baseUrl +
                                "/?id=" +
                                id +
                                "#/pipe/monitor/gisFrame_monitor_pressAndFlow";
                            let qc_iframe_url =
                                "" +
                                temp_baseUrl +
                                "/?id=" +
                                id +
                                "#/pipe/monitor/gisFrame_monitor_waterQc";
                            let iframe_pressFlow =
                                '<iframe src="' +
                                pressFlow_iframe_url +
                                '" height="396" width="500"  scrolling="no" frameborder="0"></iframe>';
                            let iframe_qc =
                                '<iframe src="' +
                                qc_iframe_url +
                                '" height="396" width="500"  scrolling="no" frameborder="0"></iframe>';

                            let error_iframe_url =
                                "" +
                                temp_baseUrl +
                                "/?id=" +
                                id +
                                "#/pipe/monitor/gisFrame_monitor_errorPoint";
                            let iframe_error =
                                '<iframe src="' +
                                error_iframe_url +
                                '" height="100" width="100"  scrolling="no" frameborder="0"></iframe>';

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

                            //设备的图层  水质
                            that.waterQc_layer = new GraphicsLayer({
                                graphics: []
                            });
                            //设备的图层  水压
                            that.waterPress_layer = new GraphicsLayer({
                                graphics: []
                            });
                            //设备的图层  水流
                            that.waterFlow_layer = new GraphicsLayer({
                                graphics: []
                            });
                            that.map.addMany([
                                that.waterQc_layer,
                                that.waterPress_layer,
                                that.waterFlow_layer
                            ]);
                            let queryTask_qc = new QueryTask({
                                url: qcUrl
                            });
                            let query_qc = new Query();
                            query_qc.returnGeometry = true;
                            query_qc.outFields = ["*"];
                            query_qc.where = " 1 = 1 "; //水质
                            queryTask_qc
                                .execute(query_qc)
                                .then(featureSet => {
                                    that.waterQc_layer.removeAll();
                                    let features = featureSet.features;
                                    features.map(val => {
                                        let temp_json = val;
                                        let error_pic = `${temp_staticPath}/gis_temporary_pic/qc_error.gif`;
                                        let pic = `${temp_staticPath}/gis_temporary_pic/qc.png`;
                                        let error_pic_ = `${temp_staticPath}/gis_temporary_pic/error_gis.svg`;
                                        let normal_pic_ = `${temp_staticPath}/gis_temporary_pic/normal_gis.svg`;
                                        let temp_pic_point = null; // 设备点上的图片
                                        let temp_pic_model = null; // 设备点 旁边的弹窗

                                        val.attributes.typeFlag = "水质";

                                        let addressName = val.attributes.NAME || "";


                                        if (val.attributes.ISWARN == 1) {
                                            temp_pic_point = error_pic;
                                            temp_pic_model = error_pic_;
                                        } else {
                                            temp_pic_point = pic;
                                            temp_pic_model = normal_pic_;
                                        }
                                        let point_marker = new Graphic({
                                            geometry: val.geometry,
                                            symbol: {
                                                type: "picture-marker",
                                                url: "" + temp_pic_point,
                                                width: "30px",
                                                height: "30px"
                                            },
                                            attributes: val.attributes,
                                            popupTemplate: {
                                                title: "" + addressName + "水质",
                                                content: "" + iframe_qc
                                            }
                                        });
                                        that.qc_layer.push(point_marker);

                                        let water_data = val.attributes.MONI_VAL || "";
                                        let max_len =
                                            addressName.length > water_data.length
                                                ? addressName.length * 20
                                                : water_data.length * 20;

                                        let point_normalPoupe = new Graphic({
                                            geometry: val.geometry,
                                            symbol: {
                                                type: "picture-marker",
                                                url: "" + temp_pic_model,
                                                width: "" + max_len + "px",
                                                height: "66px",
                                                yoffset: 0,
                                                xoffset: max_len / 2
                                            },
                                            attributes: val.attributes,
                                            popupTemplate: {
                                                title: "" + addressName + "水质",
                                                content: "" + iframe_qc
                                            }
                                        });
                                        that.qc_layer.push(point_normalPoupe);
                                        let point_titleText = new Graphic({
                                            geometry: val.geometry,
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
                                                text: "" + addressName,
                                                xoffset: max_len / 2,
                                                yoffset: 5
                                            },
                                            attributes: val.attributes,
                                            popupTemplate: {
                                                title: "" + addressName + "水质",
                                                content: "" + iframe_qc
                                            }
                                        });
                                        that.qc_layer.push(point_titleText);

                                        let point_subText = new Graphic({
                                            geometry: val.geometry,
                                            symbol: {
                                                type: "text",
                                                color: "#fff",
                                                haloColor: "black",
                                                haloSize: "1px",
                                                font: {
                                                    size: 12,
                                                    family: "sweiruanyahei"
                                                },
                                                text: "" + water_data,
                                                xoffset: max_len / 2,
                                                yoffset: -15
                                            },
                                            attributes: val.attributes,
                                            popupTemplate: {
                                                title: "" + addressName + "水质",
                                                content: "" + iframe_qc
                                            }
                                        });
                                        that.qc_layer.push(point_subText);
                                    });
                                })
                                .catch(error => {
                                    console.log(error);
                                });

                            let queryTask_press = new QueryTask({
                                url: pressUrl
                            });
                            let query_press = new Query();
                            query_press.returnGeometry = true;
                            query_press.outFields = ["*"];
                            query_press.where = " 2 = 2 "; //水压
                            queryTask_press
                                .execute(query_press)
                                .then(featureSet => {
                                    that.waterPress_layer.removeAll();
                                    let features = featureSet.features;
                                    features.map(val => {
                                        let temp_json = val;
                                        let error_pic = `${temp_staticPath}/gis_temporary_pic/press_error.gif`;
                                        let pic = `${temp_staticPath}/gis_temporary_pic/press.png`;
                                        let error_pic_ = `${temp_staticPath}/gis_temporary_pic/error_gis.svg`;
                                        let normal_pic_ = `${temp_staticPath}/gis_temporary_pic/normal_gis.svg`;

                                        let temp_pic_point = null; // 设备点上的图片
                                        let temp_pic_model = null; // 设备点 旁边的弹窗

                                        val.attributes.typeFlag = "水压";

                                        let addressName = val.attributes.NAME || "";

                                        if (val.attributes.ISWARN == 1) {
                                            temp_pic_point = error_pic;
                                            temp_pic_model = error_pic_;
                                        } else {
                                            temp_pic_point = pic;
                                            temp_pic_model = normal_pic_;
                                        }
                                        let point_marker = new Graphic({
                                            geometry: val.geometry,
                                            symbol: {
                                                type: "picture-marker",
                                                url: "" + temp_pic_point,
                                                width: "30px",
                                                height: "30px"
                                            },
                                            attributes: val.attributes,
                                            popupTemplate: {
                                                title: "" + addressName + "水压",
                                                content: "" + iframe_pressFlow
                                            }
                                        });
                                        that.press_layer.push(point_marker);


                                        let water_data = val.attributes.MONI_VAL || "";
                                        if (water_data) {
                                            water_data = water_data + "Mpa";
                                        }

                                        let max_len =
                                            addressName.length > water_data.length
                                                ? addressName.length * 20
                                                : water_data.length * 20;
                                        let point_errorPoupe = new Graphic({
                                            geometry: val.geometry,
                                            symbol: {
                                                type: "picture-marker",
                                                url: "" + temp_pic_model,
                                                width: "" + max_len + "px",
                                                height: "66px",
                                                yoffset: 0,
                                                xoffset: max_len / 2
                                            },
                                            attributes: val.attributes,
                                            popupTemplate: {
                                                title: "" + addressName + "水压",
                                                content: "" + iframe_pressFlow
                                            }
                                        });
                                        that.press_layer.push(point_errorPoupe);

                                        let point_titleText = new Graphic({
                                            geometry: val.geometry,
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
                                                text: "" + addressName,
                                                xoffset: max_len / 2,
                                                yoffset: 5
                                            },
                                            attributes: val.attributes,
                                            popupTemplate: {
                                                title: "" + addressName + "水压",
                                                content: "" + iframe_pressFlow
                                            }
                                        });
                                        that.press_layer.push(point_titleText);

                                        let point_subText = new Graphic({
                                            geometry: val.geometry,
                                            symbol: {
                                                type: "text",
                                                color: "#fff",
                                                haloColor: "black",
                                                haloSize: "1px",
                                                font: {
                                                    size: 12,
                                                    family: "sweiruanyahei"
                                                },
                                                text: "" + water_data,
                                                xoffset: max_len / 2,
                                                yoffset: -15
                                            },
                                            attributes: val.attributes,
                                            popupTemplate: {
                                                title: "" + addressName + "水压",
                                                content: "" + iframe_pressFlow
                                            }
                                        });
                                        that.press_layer.push(point_subText);
                                    });
                                })
                                .catch(error => {
                                    console.log(error);
                                });

                            let queryTask_flow = new QueryTask({
                                url: flowUrl
                            });
                            let query_flow = new Query();
                            query_flow.returnGeometry = true;
                            query_flow.outFields = ["*"];
                            query_flow.where = " 3 = 3 "; // 水流
                            queryTask_flow
                                .execute(query_flow)
                                .then(featureSet => {
                                    that.waterFlow_layer.removeAll();
                                    let features = featureSet.features;
                                    features.map(val => {
                                        let temp_json = val;
                                        let error_json = val;

                                        val.attributes.typeFlag = "水流";

                                        let error_pic = `${temp_staticPath}/gis_temporary_pic/flow_error.gif`;
                                        let pic = `${temp_staticPath}/gis_temporary_pic/flow.png`;

                                        let error_pic_ = `${temp_staticPath}/gis_temporary_pic/error_gis.svg`;
                                        let normal_pic_ = `${temp_staticPath}/gis_temporary_pic/normal_gis.svg`;

                                        let addressName = val.attributes.NAME || "";

                                        let water_data = val.attributes.MONI_VAL || "";
                                        if (water_data) {
                                            water_data = water_data + "m³/s";
                                        }
                                        let max_len =
                                            addressName.length > water_data.length
                                                ? addressName.length * 15 + 20
                                                : water_data.length * 15 + 20;

                                        let temp_pic_point = null; // 设备点上的图片
                                        let temp_pic_model = null; // 设备点 旁边的弹窗

                                        if (val.attributes.ISWARN == 1) {
                                            temp_pic_point = error_pic;
                                            temp_pic_model = error_pic_;
                                        } else {
                                            temp_pic_point = pic;
                                            temp_pic_model = normal_pic_;
                                        }
                                        let point_marker = new Graphic({
                                            geometry: val.geometry,
                                            symbol: {
                                                type: "picture-marker",
                                                url: "" + temp_pic_point,
                                                width: "30px",
                                                height: "30px"
                                            },
                                            attributes: val.attributes,
                                            popupTemplate: {
                                                content: "" + iframe_pressFlow,
                                                title: addressName + "流量"
                                            }
                                        });
                                        that.waterFlow_layer.add(point_marker);
                                        that.flow_layer.push(point_marker);

                                        let point_errorPoupe = new Graphic({
                                            geometry: val.geometry,
                                            symbol: {
                                                type: "picture-marker",
                                                url: "" + temp_pic_model,
                                                width: "" + max_len + "px",
                                                height: "60px",
                                                yoffset: 0,
                                                xoffset: max_len / 2
                                            },
                                            attributes: val.attributes,
                                            popupTemplate: {
                                                content: "" + iframe_pressFlow,
                                                title: addressName + "流量"
                                            }
                                        });
                                        that.waterFlow_layer.add(point_errorPoupe);
                                        that.flow_layer.push(point_errorPoupe);

                                        let point_titleText = new Graphic({
                                            geometry: val.geometry,
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
                                                text: "" + addressName,
                                                xoffset: max_len / 2,
                                                yoffset: 4
                                            },
                                            attributes: val.attributes,
                                            popupTemplate: {
                                                content: "" + iframe_pressFlow,
                                                title: addressName + "流量"
                                            }
                                        });
                                        that.waterFlow_layer.add(point_titleText);
                                        that.flow_layer.push(point_titleText);
                                        let point_subText = new Graphic({
                                            geometry: val.geometry,
                                            symbol: {
                                                type: "text",
                                                color: "#fff",
                                                haloColor: "black",
                                                haloSize: "1px",
                                                font: {
                                                    size: 12,
                                                    family: "weiruanyahei"
                                                },
                                                text: "" + water_data,
                                                xoffset: max_len / 2,
                                                yoffset: -15
                                            },
                                            attributes: val.attributes,
                                            popupTemplate: {
                                                content: "" + iframe_pressFlow,
                                                title: addressName + "流量"
                                            }
                                        });
                                        that.waterFlow_layer.add(point_subText);
                                        that.flow_layer.push(point_subText);
                                    });
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

                            // let pointPoupe = null;
                            // pointPoupe = that.view.on("pointer-move", etc => {
                            //     // if(pointPoupe){
                            //     //     pointPoupe.cancel()
                            //     // }
                            //     that.view.popup.close();
                            //     that.iframe_width_flag = true;
                            //     pointPoupe = that.view.hitTest(etc).then(res => {
                            //         let results_ = res.results;
                            //         if (results_.length > 0) {
                            //             if (results_[0].graphic.geometry.type == 'point') {
                            //                 dse.globalData = results_[0].graphic.attributes;
                            //                 that.view.popup.open({
                            //                     title: "警告",
                            //                     content: "" + iframe_error,
                            //                     updateLocationEnabled: true,
                            //                     location: results_[0].mapPoint
                            //                 });
                            //             }
                            //         }
                            //     })

                            // })

                            colse_viewPoupe = function () {
                                that.view.graphics.removeAll();
                                that.view.popup.close();
                            };
                        }
                    );
            },
            toggleShow() {
                this.tableShow = !this.tableShow;
            },
            selectItem(val) {
                this.search.companyId = val.id;
                this.getOrganDictTree_(val.id);
            },
            gotoThisPage(index) {
                this.getPipeMonitorWarnList_(index);
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
                    colse_viewPoupe();
                } else if (index == 1) {
                    that.waterQc_layer.removeAll();
                    that.waterFlow_layer.removeAll();
                    that.waterPress_layer.addMany(that.press_layer);
                    colse_viewPoupe();
                } else {
                    that.waterFlow_layer.removeAll();
                    that.waterPress_layer.removeAll();
                    that.waterQc_layer.addMany(that.qc_layer);
                    colse_viewPoupe();
                }
            },
            getPipeMonitorWarnList_(page) {
                let that = this;
                let temp_companyID = this.search.companyId;
                let temp_areaId = this.search.areaId;
                let temp_searchName = this.search.searchName;
                getPipeMonitorWarnList({
                    companyId: "" + temp_companyID,
                    areaId: "" + temp_areaId,
                    moniPointName: "" + temp_searchName,
                    page: "" + page,
                    pageSize: "10"
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
                            let {data} = res;
                            that.list = data.rows;
                            that.paginate.totalPage = Math.ceil(data.total / 10) || 1;
                        }
                    })
                    .catch(function (error) {
                        // if (error == "Error: Network Error") {
                        //     that.$message.error("网络错误")
                        //     return;
                        // } else {
                        //     that.$message.error("逻辑错误!")
                        // }
                    });
            },
            searchList() {
                this.getPipeMonitorWarnList_("1");
            },
            show_doModel(data_) {
                let flag = this.actionFlag
                if (!flag) {
                    return
                }
                this.toggoleShowDispatach = true;
                this.dispatch_data = data_;
            },
            hiddenDispatchModel(val) {
                this.toggoleShowDispatach = false;
            },
            dispatch() {
                let that = this;
                let temp_id = this.dispatch_data.ID;
                this.handleMonitorWarnInfo_(temp_id, that.problem_desc, "2");
            },
            down() {
                let that = this;
                let temp_id = this.dispatch_data.ID;
                this.handleMonitorWarnInfo_(temp_id, that.problem_desc, "1");
            },
            handleMonitorWarnInfo_(id, remarks, status) {
                let that = this;
                // 0 为 原有工单  1为标准工单
                let temp_tableSelect = this.activedIndex;
                handleMonitorWarnInfo({
                    id: "" + id,
                    remarks: "" + remarks,
                    state: "" + status
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
                        that.toggoleShowDispatach = false;
                        that.$message.success("保存成功!");
                        that.getPipeMonitorWarnList_("1");
                        if (status == "2") {
                            setTimeout(() => {
                                that.$router.push({
                                    name: "pipe_monitor_dispatch",
                                    params: {
                                        id: id,
                                        tableType: temp_tableSelect
                                    }
                                });
                                that.$store.commit("setAside_status", false);
                                that.$emit("hiddenAside");
                            }, 1500);
                        }
                    }
                });
            },
            selectThisTable(index) {
                this.activedIndex = index;
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
                        let {data} = res;
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
                            that.search.areaId = "全部区域";
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
            closeLegend(flag) {
                this.legend_show = true;
            },
            showLegend_() {
                this.legend_show = false;
            },
            getArea(val) {
                console.log(val);
            }
        },
        filters: {
            formateStatus(val) {
                let temp = val;
                switch (val) {
                    case "1":
                        temp = "已处理";
                        break;
                    case "2":
                        temp = "处理";
                        break;
                    case "3":
                        temp = "处理中";
                        break;
                }
                return temp;
            },
            formateType(val) {
                let temp = val;
                switch (val) {
                    case "1":
                        temp = "水质";
                        break;
                    case "2":
                        temp = "水压";
                        break;
                    case "3":
                        temp = "水流";
                        break;
                }
                return temp;
            }
        },
        mounted() {
            let position = this.$store.getters.get_cityPosition
            this.createMap(position);
        },
        created() {
            let that = this;
            that.tree = that.$store.getters.get_orgTree;
            that.areaList = that.$store.getters.get_cityAreas;
            that.areaItem = that.areaList[0].value;
            that.initCompony = that.tree[0].label;
            that.actionFlag = (that.$store.getters.get_pages_btn_allow).surver.action;

            this.search.areaId = this.areaItem;
            this.search.companyId = (this.tree)&&(this.tree).length>0?(this.tree)[0].id:'';
            that.getPipeMonitorWarnList_("1");
        }
    };
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }

    #surver {
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
                                width: calc(25% - 20px);
                                border-right: 1px solid #ccc;
                                border-bottom: 1px solid #ccc;
                                text-align: center;

                                &:last-child {
                                    width: 80px;
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
                                    width: calc(25% - 20px);
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
                                        width: 80px;
                                        border-right: none;
                                    }

                                    &.actions {
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        cursor: pointer;

                                        span {
                                            display: inline-block;
                                            width: 60px;
                                            line-height: 20px;
                                            border-radius: 5px;
                                            color: #333;

                                            &.success {
                                                border: 1px solid #0b83fe;
                                                color: #7a7c85;
                                                cursor: not-allowed;
                                            }

                                            &.down {
                                                border: 1px solid #0b83fe;
                                                color: #2a8b2a;
                                                cursor: pointer;
                                            }

                                            &.ifDo {
                                                border: 1px solid gray;
                                                color: gray;
                                                cursor: not-allowed;
                                            }

                                            &.doing {
                                                border: 1px solid #0b83fe;
                                                cursor: not-allowed;
                                                color: #7a7c85;
                                            }
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
            bottom: 10px;
            left: 10px;
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
