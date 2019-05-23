<template>
<div id="pipe_">
    <div class="top">
        <span>{{cityAreaName}}管网总长度为</span>
        <span class="s-weight">{{pipeLong}}</span>
        <span>km</span>
    </div>
    <div class="gis-content">
        <div id="gis" ref="gis"></div>
        <div class="top-tabs">
            <tools :defaultLayers="layers" @handleThisDom="thisDom" @showLayers="toggleSelectThis"></tools>
        </div>
        <div class="toggoleSpace">
            <div class="spaceItem" @click="spaceSelect(index)" :class="{actived:index==spaceItemActived}" v-for="(item,index) in spaceList" :key="index">
                {{item.name}}
            </div>
        </div>
        <template v-if="showLegend">
            <div class="legend">
                <span class='close' @click="closeLegend">
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
                        <img src="../../assets/images/pipeNet_manage/msg/fm.png" alt="">
                        <span>阀门</span>
                    </div>
                    <div class="sm-item">
                        <img src="../../assets/images/pipeNet_manage/msg/jxj.png" alt="">
                        <span>检修井</span>
                    </div>
                    <div class="sm-item">
                        <img src="../../assets/images/pipeNet_manage/msg/xfs.png" alt="">
                        <span>消防栓</span>
                    </div>
                    <div class="sm-item">
                        <img src="../../assets/images/pipeNet_manage/msg/proj_place.png" alt="">
                        <span>工作点</span>
                    </div>
                </div>
            </div>
            <div class="socket">
                <span>管线更新至{{updateTime.UPDATETIME}}年</span>
            </div>
        </template>
        <template v-else>
            <div class="legend-btn" @click="showLegend_">
                <span>图例</span>
            </div>
        </template>
        <div class="featureToggle" v-if="tableStatus">
            <div class="tips">
                <i class="el-icon-view"></i>
                <span>查看方式</span>
            </div>
            <div class="select-tabs">
                <!-- <span class="select-item" :class="{active:item.active}" v-for="(item,index) in tabType" :key="index" @click="selectThis(index)">{{item.name}}</span> -->
                <div class="select-item" :class="{actived:selectFlag}" @click="selectThis">年代</div>
                <el-select v-model="areaItem" placeholder="区域">
                    <el-option v-for="item in areaLists" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="productItem" placeholder="材质">
                    <el-option v-for="item in productLists" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="caliberItem" placeholder="管径">
                    <el-option v-for="item in caliberLists" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
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
            <div class="time-picker" @mousewheel="scrollSelf" v-if="tableStatus&&timeLine_flag">
                <div class="bolls">
                    <div class="translate-wrap">
                        <div class="inner-wrap" :style="{top:topDis+'px'}">
                            <div class="boll_line"></div>
                            <div class="time-line" v-for="(item,index) in years" :key='index'>
                                <template v-if='index==0'>
                                    <div class="time-ball big"></div>
                                </template>
                                <template v-else>
                                    <div class="time-ball "></div>
                                </template>
                                <div class='years-str' :class="{active:index==activeFlag}" @click="heightLight(index)">{{item}}
                                </div>
                            </div>
                            <div class="last-ball"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wrap-table" v-if="tableStatus">
                <div class="wrap-search">
                    <div class="f-item obj">
                        <span class="str">选择对象:</span>
                        <select-tree :waterWorksTree="tree" @showSelectLists="searchObj" :defaultCompony="initCompony"></select-tree>
                        <el-button type="primary" style='opacity:0'>搜索</el-button>
                    </div>
                    <div class="f-item positions">
                        <span class="str">管线搜索:</span>
                        <el-input placeholder="请输入内容" v-model="searchValue" clearable>
                        </el-input>
                        <!-- <el-button type="primary" @click="searclPipe">搜索</el-button> -->
                        <span class="search" @click="searclPipe" >搜索</span>
                    </div>
                </div>
                <!-- <div class="actions">
                                <div class="add" @click="openAddModel">
                                    <i class="el-icon-plus"></i>
                                    <span>新增</span>
                                </div>
                            </div> -->
                <div class="tabs">
                    <div class="tab-item" @click="activeThis(index)" :class="{active:index==activeTap}" v-for="(item,index) in contentTap" :key="index">{{item.name}}
                    </div>
                    <!--ArcGIS JS API 3D 导出功能API没实现，暂时隐藏-->
                    <div v-show="false" class="f-export" @click="showPdfStatus">导出</div>

                    <el-checkbox class="u-ground" v-model="show_sub_3d" @change="handleCheckAllChange">地下管网
                    </el-checkbox>
                </div>
                <div class="tab-content">
                    <div class="content-item  top-head">
                        <div class="head-select">
                            <!-- <span class="tangle"></span> -->
                            <span class="num">序号</span>
                        </div>
                        <div class="own">所属管线</div>
                        <div class="cycle">已用(年限)</div>
                        <div class="action head-action">操作</div>
                    </div>
                    <template v-if="mainPipe.length>0">
                         <div class="content-item" v-for="(item,index) in mainPipe" :key="index" >
                            <div class="head-select">
                                <!-- <i class="el-icon-delete" @click="show_delModel(index,item.ID)"></i> -->
                                <span class="num">{{item.CODE}}</span>
                            </div>
                            <div class="own">
                                <span :title="item.PIPE_NAME">{{item.PIPE_NAME}}</span>
                            </div>
                            <div class="cycle">{{item.USETIME + " (" + item.USE_YEAR + ")"}}</div>
                            <div class="action" @click="showDetail(index,item.ID,item)">详情</div>
                        </div>
                    </template>
                </div>
                <div class="pages">
                    <paginate :totalPage="totalPage"   @thisPage="gotoThisPage" :noSmall="'true'"></paginate>
                </div>
            </div>
        </div>
    </div>

    <process-model :showDefinedModel="processToggle" :title="'正在转换'" @hiddenSelf="closedPdfModel">
        <iframe :src="downloadSrc" frameborder="0" style="width:0;height:0;"></iframe>
        <img src="../../assets/images/pipeNet_manage/msg/xfs.png" alt="">
        <div class="process">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="percent"></el-progress>
        </div>
        <div class="status">
            {{processStr}}
        </div>
    </process-model>
    <del-model :showModel="showDelModel" :delNum="delId" :type="delType" @delThis="hiddenDelModel" @sureDelThis="justDel"></del-model>
</div>
</template>

<script>
import * as esriLoader from "esri-loader";
//    import {
//        getPipeBaseInfo
//    } from "@/api/pipeNet_msg/msg";
//    import {
//        saveOrUpdate
//    } from "@/api/pipeNet_msg/msg";
import tools from "@/common/components/gis_units/tools";
import selectTree from "@/common/components/selectWithTree";
import paginate from "@/common/components/pagination";

// 三维管网相关.
import popupUtils from '@/common/utils/popupUtils';
//管网图层配置
import gw3dConfig from '@/common/config/gis3d/gw3dConfig';
// 消防栓配置
import xfs3dConfig from '@/common/config/gis3d/xfs3dConfig';

// 阀门配置
import fm3dConfig from '@/common/config/gis3d/fm3dConfig';

//天然气配置
import gas3dConfig from '@/common/config/gis3d/gas3dConfig';
//电线配置
import dx3dConfig from '@/common/config/gis3d/dx3dConfig';
//检修井
import jxj3dConfig from "@/common/config/gis2d/jxj2dConfig"
// 工作点
import gzd3dConfig from "@/common/config/gis2d/gzd2dConfig"

import layerUtils from '@/common/utils/layerUtils';

import fuzzySearch from "@/common/components/fuzzy_search";
import {
    getPipeBaseInfo,
    getPipeLine,
    saveOrUpdate,
    getModifiedTime
} from "@/api/pipeNet_msg/msg";

import {
    getOrganDictTree
} from "@/api/common/get_area"

// esriLoader.loadCss(dse.arcgis_themeCss);
esriLoader.loadCss(dse.arcgis_mainCss);
let belowMap = dse.arcgis_belowMap; // 管网
let pipeMap = dse.arcgis_pipe; // 消防栓
let ponitsMap = dse.arcgis_points; //阀门
let wireMap = dse.arcgis_wire; // 电缆
let gasMap = dse.arcgis_gas; //天然气
let jxjMap = dse.arcgis_jxj; //检修井
let gzdMap = dse.arcgis_gzd; // 工作区
let global_frame_data = dse.globalData;
let startJs = dse.arcgis_startJS;
const options = {
    url: startJs,
    dojoConfig: dse.gisConfig
};

let point, geodesicBuffer, xfs_func;
import processModel from "@/common/components/poupe/defined";
import addModel from "@/common/components/poupe/view";
import delModel from "@/common/components/poupe/save_status";
import {
    dataTransform_pipeMsg
} from "@/common/config/dataTransform"

import {
    getMapPro
} from "@/api/common/get_all_problemLayer"
//import ElCheckbox from "../../../node_modules/element-ui/packages/checkbox/src/checkbox.vue";

export default {
    name: "Home",
    components: {
        //        ElCheckbox,
        tools,
        processModel,
        addModel,
        delModel,
        selectTree,
        paginate,
        fuzzySearch
    },
    data() {
        return {
            //二维和三维的切换
            spaceList: [{
                    name: '2D'
                },
                {
                    name: "3D"
                }
            ],
            spaceItemActived: 1, //激活的2d视图页面
            updateTime: "", //更新gis时间
            title: "", // 弹窗题目
            view: null, // 全局化  gis底图实例
            map: null, //  挂载底图图层
            layer1: null, // 管网图层
            copy_pipe: null, //管网的复制图层
            layer2: null, // 消防栓图层
            layer3: null, // 阀门图层
            layer4: null, // 电线的图层
            layer5: null, //天然气的图层
            layer6: null, //检查井的图层
            newPipeLayer: null, //新建管网图层
            distance: null, // 量距离
            drawTools: null, //画基本图
            area: null, // 量面积
            searchGis: "", // 查询图层信息
            pipeLong: "",
            xfsGeometries: "", //所有消防算的物体集合
            searchLayer: "", //查询所添加的条件的要素
            small: false, // 判断当前窗口是否小于 1600
            showLegend: true, // 是否显示图例
            percent: 0, //转换pdf的进度
            dom: "",
            topDis: 0, // 时间线向上滚动的距离
            processToggle: false, // 是否显示pdf弹窗
            showFireplug: "消防栓",
            processStr: "正在导出，请耐心等待！",
            detailModel: false, //  显示详情的弹窗
            downloadSrc: "",
            search_str: "", // 选择对象的 值
            tree: [],
            contentTap: [{
                name: "供水干管",
                active: true
            }],
            activeTap: 0,
            fireplugtabs: [
                // 消防相关的 tab栏
                {
                    name: "消防分析",
                    active: true
                },
                {
                    name: "消防模拟",
                    active: false
                }
            ],
            fireplug_item: 1,
            radius: 50, //消防分析半径
            tableStatus: true,
            timeLine_flag: false, // 是否显示时间轴的小窗口
            area_flag: false, //  是否显示区域的小窗口
            product_flag: false, //是否显示管材的小窗口
            mainPipe: [],
            caliber_falg: false, // 是否显示管径的小窗口
            searchValue: "", //搜索管线的名字
            activeFlag: null, // 时间轴的激活状态
            selectFlag: false, // 时间轴是否显示  按钮状态
            selectTime: "", //时间轴的所选年代
            showAddModel: false, // 是否显示新增的弹窗
            showDelModel: false, // 是否显示删除的弹窗
            delType: false, //  显示删除的弹窗
            delList: [], //删除的 列表
            areaLists: [],
            areaItem: "", // 所选区域
            productLists: [],
            productItem: "", // 所选管材
            caliberLists: [],
            caliberItem: "", //所选管径,
            totalPage: 1,
            currentPage: 1,
            search_pipeName: "", //查询的管线名字
            searchPipeLists: [], //查询的管线列表
            delIndex: null, //删除的索引
            delId: null, //删除的ID
            gisModel_iframe: "", //gis的增加弹窗
            search_pipe_type: null, //查询 是否是水司或者水厂
            show_sub_3d: false, //显示地下3D 管网
            initCompony: "", //初始化显示的公司名字
            model_outerSide_flag: false, //判断是否是外部触发弹窗
            layers: [{
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
            //显示地下管网临时图层
            tempLayers: [],
        };
    },
    methods: {
        createMap(companyId,potions) {
            let that = this;
            let temp_baseUrl = that.DSE.baseURL;
            let area_iframe_url = "" + temp_baseUrl + "/?id=" + id + "#/pipe/pipeNet_route/gisFrame_msg_pipe" // 上线版
            // let area_iframe_url = "" + temp_baseUrl + "/#/pipe/pipeNet_route/gisFrame_msg_pipe" // 开发版
            let iframe_area = '<iframe src="' + area_iframe_url + '" height="500" width="500"  scrolling="no" frameborder="0"></iframe>'
            esriLoader
                .loadModules(
                    [
                        "dojo/on",
                        "esri/Map",
                        "esri/layers/FeatureLayer",
                        "dse/modules/toolbars/_Draw",
                        "dse/modules/measure/_measureDistance3D",
                        "dse/modules/measure/_measureArea3D",
                        "esri/views/SceneView",
                        "esri/layers/GraphicsLayer",
                        "esri/geometry/geometryEngine",
                        "esri/Graphic",
                        "esri/widgets/Search",
                        "esri/tasks/QueryTask",
                        "esri/tasks/support/Query",
                        "dse/utils/BaseMapUtils",
                        "dojo/domReady!"
                    ],
                    options
                )
                .then(
                    ([
                        domOn,
                        Map,
                        FeatureLayer,
                        Draw,
                        _measureDistance,
                        _measureArea,
                        SceneView,
                        GraphicsLayer,
                        geometryEngine,
                        Graphic,
                        Search,
                        QueryTask,
                        Query,
                        BaseMapUtils
                    ]) => {
                        let proArea_iframe_url = "" + temp_baseUrl + "/?id=" + id + "#/pipe/pipeNet_route/gisFrame_msg_proArea"
                        let iframe_proArea = '<iframe src="' + proArea_iframe_url + '" height="396" width="500"  scrolling="no" frameborder="0"></iframe>'
                        let wellBuffer, wellsGeometries, magnitude;
                        // Create the map
                        layerUtils.bindAmdClass(QueryTask, Query, GraphicsLayer, Graphic);
                        //
                        that.map = new Map({
                            //    basemap: "hybrid",
                            layers: [],
                            ground: "world-elevation"
                        });
                        let baseMapUtils = new BaseMapUtils({
                            map: that.map,
                            mapType: '2'
                        });

                        //debugger;
                        baseMapUtils.loadBaseLayers(dse.baseMapLayers);

                        that.view = new SceneView({
                            container: "gis",
                            map: that.map,
                            highlightOptions: {
                                color: [255, 255, 0, 1],
                                haloOpacity: 0.9,
                                fillOpacity: 0.2
                            },
                            center: potions,
                            zoom: 15,
                            camera: { // autocasts as new Camera()
                                position: potions,
                                tilt: 45
                            }
                        });

                        //
                        that.view.when(function () {
                            that.map.ground.surfaceColor = "#fff";
                            that.map.ground.navigationConstraint = {
                                type: "none"
                            };
                            that.map.ground.opacity = 0.4;
                        });

                        that.view.on("click", function (event) {
                            that.model_outerSide_flag = false;
                        });

                        //监听弹出框.
                        that.view.popup.watch('selectedFeature', function (newView, oldValue, portery, object) {
                            //
                            window.graphic = this.view.popup.selectedFeature;
                            if (window.graphic) {
                                let temp_flag = that.model_outerSide_flag;
                                if (!temp_flag) {
                                    // let params = window.graphic.attributes;
                                    // let temp_obj = dataTransform_pipeMsg(params);
                                    // dse.globalData = temp_obj
                                    // dse.globalData.editSave = that.$store.getters.get_pages_btn_allow.pipe_2d3d.editSave;

                                     let  temp_areaList = JSON.parse(JSON.stringify(that.areaLists)) ;
                                    temp_areaList.forEach((val,index)=>{
                                        if(val.label==="全部城区"){
                                            temp_areaList.splice(index,1);
                                            return; 
                                        }
                                    })
                                     let  temp_productLists =JSON.parse(JSON.stringify(that.productLists)) ;
                                    temp_productLists.forEach((val,index)=>{
                                        if(val.label==="全部管材"){
                                            temp_productLists.splice(index,1);
                                            return; 
                                        }
                                    })
                                     let  temp_caliberLists =JSON.parse(JSON.stringify(that.caliberLists)) ;
                                    temp_caliberLists.forEach((val,index)=>{
                                        if(val.label==="全部管径"){
                                            temp_caliberLists.splice(index,1);
                                            return; 
                                        }
                                    })


                                    let pipe_id = window.graphic.attributes.ID;
                                    dse.globalData = {
                                        factoryId :that.search_str,
                                        id:pipe_id,
                                        areaLists:temp_areaList,
                                        pipeMaterials:temp_productLists,
                                        pipeRadius:that.caliberLists,
                                        interfaceTypes:dse.interFace
                                    }

                                    dse.globalData.staticFilePath = that.$store.getters.get_filePath
                                    dse.globalData.editSave = that.$store.getters.get_pages_btn_allow.pipe_2d3d.editSave;
                                    dse.this_ = that
                                }
                            }
                        });
                        //关闭弹出框时恢复高亮显示的管线.
                        that.view.popup.watch('visible', function (newView, oldValue, portery, object) {
                            if (!newView) {
                                that.view.graphics.removeAll();
                            }
                        });

                        // 新建一个图层
                        that.newPipeLayer = new GraphicsLayer({
                            graphics: [],
                            elevationInfo: {
                                mode: 'relative-to-ground',
                                offset: -15
                            }
                        });
                        that.newPipeLayer.symbolInfo = {
                            type: "line-3d",
                            symbolLayers: [{
                                type: "path",
                                size: 6,
                                material: {
                                    color: "#44cef6"
                                }
                            }]

                        };
                        that.map.add(that.newPipeLayer);

                        // 电线图层
                        dx3dConfig.url = wireMap;
                        // that.layer4 = layerUtils.loadData(that.map, dx3dConfig);

                        //===================================================
                        // 天然气图层
                        gas3dConfig.url = gasMap;
                        // that.layer5 = layerUtils.loadData(that.map, gas3dConfig);

                        // 管网图层.
                        //===================================================
                        let belowMap  = that.$store.getters.get_pipe_defaultLayer
                        gw3dConfig.url = belowMap;
                        // gw3dConfig
                         gw3dConfig.popupTemplate.visible = false;
                        that.copy_pipe = that.layer1 = layerUtils.loadData(that.map, gw3dConfig,companyId);
                        // 检查井
                        jxj3dConfig.url = jxjMap;
                        // that.layer6 = layerUtils.loadData(that.map, jxj3dConfig);
                        // 阀门图层
                        let ponitsMap = that.$store.getters.get_fm_defaultLayer
                        fm3dConfig.url = ponitsMap;
                        that.layer3 = layerUtils.loadData(that.map, fm3dConfig,companyId);
                        //===================================================
                        //消防栓
                        //===================================================
                        let pipeMap = that.$store.getters.get_xfs_defaultLayer
                        xfs3dConfig.url = pipeMap;
                        xfs3dConfig.depth = 5;
                        that.layer2 = layerUtils.loadData(that.map, xfs3dConfig,companyId);
                        //===================================================
                        setTimeout(() => {
                            that.map.layers.remove(that.layer4);
                            that.map.layers.remove(that.layer5);
                        }, 500)

                        let bufferLayer = new GraphicsLayer();
                        let pointLayer = new GraphicsLayer();
                        that.map.add([bufferLayer, pointLayer]);

                        that.drawTools = new Draw({
                            view: that.view
                        });
                        that.distance = new _measureDistance({
                            view: that.view
                        });
                        that.area = new _measureArea({
                            view: that.view
                        });
                         // 这里要传入值,从UI页面获取的。
                        that.getdata( that.startYear,  that.endYear, "", "", "", "1", that.search_str, "", that.search_pipe_type);

                        function addCircle(values) {
                            let bufferDistance = parseInt(that.radius);
                            let wellBuffers = geometryEngine.geodesicBuffer(values, [
                                    bufferDistance
                                ], "meters",
                                true);
                            wellBuffer = wellBuffers[0];
                            let bufferGraphic = new Graphic({
                                geometry: wellBuffer,
                                symbol: {
                                    type: "simple-fill",
                                    outline: {
                                        width: 1.5,
                                        color: [255, 128, 0, 1]
                                    },
                                    color: '#0056c1',
                                    style: "none"
                                }
                            });
                            that.view.graphics.removeAll();
                            that.view.graphics.add(bufferGraphic);
                        }

                        xfs_func = addCircle;
                        // 搜索查询对应的管道
                        let temp_gisID = 'SDEPIPEID';
                        that.searchLayer = new Search({
                            view: that.view,
                            allPlaceholder: "",
                            sources: [{
                                featureLayer: {
                                    url: belowMap,
                                    popupTemplate: { // autocasts as new PopupTemplate()
                                        title: "管网",
                                        content: iframe_area,
                                        overwriteActions: true
                                    }
                                },
                                searchFields: ["" + temp_gisID],
                                displayField: "" + temp_gisID,
                                exactMatch: false,
                                outFields: ["" + temp_gisID],
                                name: "显示管道信息",
                                placeholder: "查询字段",
                            }],
                            resultSymbol: {
                                type: "line-3d",
                                symbolLayers: [{
                                    type: "path",
                                    size: 2,
                                    material: {
                                        color: "#44cef6"
                                    }
                                }]
                            }
                        });
                        let companyId = that.search_str 
                        getMapPro({
                            companyId: ""+companyId
                        }).then(res => {
                            if (res.msg == "no user") {
                                window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                                return
                            }
                            if (res.msg == "操作失败") {
                                that.$message.error("服务错误!")
                                return
                            }
                            let {
                                data
                            } = res;
                            let {
                                buildData
                            } = data;

                            draw_area = function (buildData) {
                                that.proBuild_layer.removeAll();
                                let temp_areaList = buildData;
                                let graphic_polygon = null;
                                for (let i = 0; i < temp_areaList.length; i++) {
                                    let points_area = JSON.parse(temp_areaList[i].planArea)
                                    let points = points_area.rings;
                                    // let color = temp_areaList[i].areaColor;
                                    // color = JSON.parse(color);
                                    temp_areaList[i].openSelf = true;
                                    let polygon = {
                                        type: "polygon", // autocasts as Polygon
                                        rings: points,
                                        spatialReference: {
                                            wkid: 102100
                                        }
                                    };
                                    graphic_polygon = new Graphic({
                                        geometry: polygon,
                                        symbol: {
                                            type: "simple-fill", // autocasts as SimpleFillSymbol
                                            color: [243, 104, 56, 0.6],
                                            style: "solid",
                                            outline: { // autocasts as SimpleLineSymbol
                                                color: "white",
                                                width: 2,
                                                style: "dash-dot"
                                            }
                                        },
                                        popupTemplate: {
                                            title: "在建工程",
                                            content: "" + iframe_proArea
                                        },
                                        attributes: temp_areaList[i]
                                    });
                                    that.proBuild_layer.add(graphic_polygon);
                                }

                            }
                            draw_area(buildData);

                        }).catch(err => {
                            console.log(err)
                        })
                    }
                );
        },
        closedPdfModel(flag) {
            this.processToggle = flag;
        },
        searchObj(json) {
            if (json) {
                this.search_str = json.id;
                this.getOrganDictTree_(json.id);
                this.search_pipe_type = json.type;
            } else {
                this.search_str = "";
            }
        },
        showPdfStatus() {
            let that = this;
            this.processToggle = true;
            let temp_url = that.DSE.pipeMsg_mkpdf;
            let temp_printURL = that.DSE.arcgisExportMap;
            let tempList = JSON.parse(JSON.stringify(that.mainPipe));
            if (that.mainPipe.length) {
                for (let i = 0; i < tempList.length; i++) {
                    tempList[i] = that.formatePipeList(tempList[i]);
                }
            }
            let random = Math.random();
            mapExportUtil.exportMap(esriLoader, that.view, temp_printURL).then((image) => {
                console.log(image);
                this.processToggle = false;

                dse.globalData = {
                    image: image,
                    // pipeLis: tempList,
                    // lists: that.mainPipe
                    lists: tempList

                }
                let name = that.$store.getters.getUserName;
                that.downloadSrc = temp_url + "?name=" + name + "&random=" + random;
            });
        },

        spaceSelect(index) {
            //点击切换2d和3d视图
            this.spaceItemActived = index;
            if (index == 0) {
                this.$router.push({
                    name: "pipeNet_msg_2d"
                })
            }
        },
        toggleShow() {
            this.tableStatus = !this.tableStatus;
        },
        resetStatus(arr) {
            let list = arr;
            if (list.length > 0) {
                list.map(item => {
                    item.active = false;
                });
            }
            return list;
        },
        months() {
            let temp_yearsList = [];
            let oldYear = 1980;
            let time = new Date();
            let nowYear = time.getFullYear();
            let D_year = nowYear - oldYear + 1;
            for (let i = 0; i < D_year; i++) {
                temp_yearsList.push({
                    label: nowYear - i,
                    value: nowYear - i
                });
            }
            return temp_yearsList;
        },
        selectThis(index) {
            let that = this;
            that.selectFlag = !that.selectFlag;
            that.closed();
        },

        scrollSelf(e) {
            let that = this;
            let temp_offsetY = e.deltaY;
            let temp_index = this.activeFlag;
            // if(this.years.length==9){
            //   return null;
            // }
            let maxLength = this.years.length;
            if (temp_offsetY <= 0) { // 向上
                if (temp_index <= 0) {
                    temp_index = 0;
                    that.topDis = 0;
                    return null;
                } else {
                    if (temp_index > 0 && maxLength > 9 && (maxLength - temp_index) > 9) {
                        that.topDis -= 50.72;
                    }
                    temp_index--;

                }
            } else { // 向下
                if (temp_index >= maxLength - 1) {
                    temp_index = maxLength;
                    that.topDis = -(maxLength - 9) * 50.72;
                    return null;
                } else {
                    if (temp_index < maxLength && maxLength > 9 && (maxLength - temp_index) > 9) {
                        that.topDis = -temp_index * 50.72;
                    }
                    temp_index++;
                }
            }
            this.activeFlag = temp_index;
            this.selectTime = this.years[temp_index];
            this.searclPipe()
        },
        getThisArea(name, index) {
            this.areaSelect_index = index;
        },
        getThisProduct(name, index) {
            this.productSelect_index = index;
        },
        getThisCaliber(name, index) {
            this.caliberSelect_index = index;
        },
        closed() {
            this.area_flag = false;
            this.product_flag = false;
            this.caliber_falg = false;
            this.timeLine_flag = !this.timeLine_flag;
        },
        heightLight(index) {
            this.activeFlag = index;
            this.selectTime = this.years[index];
            this.searclPipe()
        },
        closeLegend() {
            this.showLegend = false;
        },
        activeThis(index) {
            //展示跟导出相关的tab栏
            this.activeTap = index;
        },
        showThisFireplug(index) {
            //展示 消防栓的 tab栏
            let that = this;
            this.fireplug_item = index;
            if (index == 0) {
                that.view.when(function () {
                        return that.layer3.when(function () {
                            var query = that.layer3.createQuery();
                            return that.layer3.queryFeatures(query);
                        });
                    })
                    .then(getValues)
                    .then(xfs_func)

                function getValues(response) {
                    let Geometries = response.features;
                    let values = Geometries.map(function (feature) {
                        return feature.geometry
                    });
                    that.xfsGeometries = values;
                    return values;
                }
            } else {
                that.view.graphics.removeAll();
            }
        },
        formatTooltip(val) {

            return val;
        },
        //是否是底图
        _isBaseLayer(layerId) {
            //
            let items = dse.baseMapLayers.filter(function (layer) {
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
        thisDom(obj) {
            let that = this;
            let temp_str = obj.tmpStr;
            switch (temp_str) {
                case "平面":

                    //                        that.view.map.basemap = "streets";
                    this._changeBaseLayer('gvec');
                    break;
                case "卫星":
                    //                        that.view.map.basemap = "satellite";
                    this._changeBaseLayer('gimg');
                    break;
                case "地形":
                    //                        that.view.map.basemap = "hybrid";
                    this._changeBaseLayer('gter');
                    break;
                case "测距":
                    that.distance.clear();
                    that.area.clear();
                    that.distance.start();
                    break;
                case "测面":
                    that.distance.clear();
                    that.area.clear();
                    that.area.start();
                    break;
                case "标点":
                    that.distance.clear();
                    that.area.clear();
                    that.drawTools.activate("circle");
                    break;
                case "标面":
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
        closeAddModel(flag) {
            this.showAddModel = flag;
        },
        saveInputs(flag) {
            this.showAddModel = flag;
        },
        openAddModel() {
            this.title = "新增";
            this.editOrShow.editStatus = true;
            this.showAddModel = true;
        },
        openDelModel() {
            this.showDelModel = true;
        },
        hiddenDelModel(val) {
            this.showDelModel = val.modelFlag;
        },
        getdata(start_year,
            end_year,
            areaId,
            material,
            radius,
            page,
            factoryId,
            pipelineName,
            type) {
            let that = this;
            let queryString = that._createGwQueryParam();
            gw3dConfig.url = belowMap;
            layerUtils.queryFeatures(gw3dConfig, {
                where: queryString,
                returnGeometry: true,
                outFields: ["*"]
            }, that.newPipeLayer, that.copy_pipe);
            getPipeBaseInfo({
                startYear: "" + start_year,
                endYear: "" + end_year,
                areaId: "" + areaId,
                material: "" + material,
                radius: "" + radius,
                page: "" + page,
                pageSize: "10",
                factoryId: "" + factoryId,
                pipelineName: "" + pipelineName,
                type: "" + type
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                let data = res.data;
                if (data) {
                    let {
                        total
                    } = data;
                    if (total) {
                        that.totalPage = Math.ceil(parseInt(total) / 10);
                    }else{
                         that.totalPage = 1
                    }
                    that.currentPage = 1;

                    let {
                        rows
                    } = data;
                    if (rows.length) {
                        that.mainPipe = rows;
                    } else {
                        that.mainPipe = [];
                    }
                }
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
            });
        },

        //构建管线查询条件
        _createGwQueryParam(pipes) {
            let startTime ="";
            let endTime = "";
            if(this.selectTime){
                startTime = this.selectTime.split("-")[0] + '-01-01 00:00:00';
                endTime = this.selectTime.split("-")[1] + '-12-31 24:00:00';
            }


            let temp_area = this.areaItem;
            let temp_product = this.productItem;
            let temp_caliber = this.caliberItem;
            let temp_compony = this.search_str;
            let temp_searchName = this.searchValue;

            let queryString = ""
            if(this.selectTime!==""){
                queryString = `INSTALL_TIME between  '${startTime}' and '${endTime}'`;
            }
            if (temp_area == undefined || temp_area == "全部城区") {
                temp_area = ""
            }
            if (temp_area) {
                queryString += `and AREAID = '${temp_area}'`;
            }
            if (temp_product) {
                queryString += `and PIPE_MATERIAL = '${temp_product}'`;
            }
            if (temp_caliber) {
                queryString += `and PIPE_RADIUS = '${temp_caliber}'`;
            }
            if (temp_compony) {
                queryString += `and COMPANY_ID = '${temp_compony}'`;
            }
            if (temp_searchName) {
                queryString += `and PIPELINE_NAME = '${temp_searchName}'`;
            }
            return `${queryString}`;
        },

        searclPipe() {
            let json = {};
            let startTime = this.selectTime.split("-")[0];
            let endTime = this.selectTime.split("-")[1];
            let temp_area = this.areaItem;
            if (temp_area == "全部城区" || temp_area == undefined) {
                temp_area = "";
            }
            let temp_product = this.productItem;
            let temp_caliber = this.caliberItem;
            let temp_compony = this.search_str;
            let temp_searchName = this.searchValue;
            let temp_type = this.search_pipe_type;
            let page = "1";
            this.getdata(
                startTime,
                endTime,
                temp_area,
                temp_product,
                temp_caliber,
                page,
                temp_compony,
                temp_searchName,
                temp_type
            );
        },
        showThisTab(index) {
            let that = this;
            if (that.editOrShow.editStatus == false) {
                this.editOrShow.ModelTab_item = index;
            }
        },
        gotoThisPage(val) {
            let temp_index = val + "";
            this.currentPage = temp_index;
            let json = {};
            let startTime = this.selectTime.split("-")[0];
            let endTime = this.selectTime.split("-")[1];
            let temp_area = this.areaItem;
            let temp_product = this.productItem;
            let temp_caliber = this.caliberItem;
            let temp_compony = this.search_str;
            let temp_searchName = this.searchValue;
            let temp_type = this.search_pipe_type;
            let page = "" + temp_index;
            if (temp_area == undefined || temp_area == "全部城区") {
                temp_area = ""
            }
            this.getdata(
                startTime,
                endTime,
                temp_area,
                temp_product,
                temp_caliber,
                page,
                temp_compony,
                temp_searchName,
                temp_type
            );
        },
        showDetail(index, id, item) {
            let that = this;
            let temp_search = this.searchLayer;
            that.model_outerSide_flag = true;
            temp_search.searchTerm = id;
            temp_search.search();
            this.view.goTo({
                center: that.view.center,
                zoom: that.view.zoom
            });
            let  temp_areaList =JSON.parse(JSON.stringify(that.areaLists))  ;
            temp_areaList.forEach((val,index)=>{
                if(val.label==="全部城区"){
                    temp_areaList.splice(index,1);
                    return;
                }
            })
            let  temp_productLists = JSON.parse(JSON.stringify(that.productLists)) ;
            temp_productLists.forEach((val,index)=>{
                if(val.label==="全部管材"){
                    temp_productLists.splice(index,1);
                    return;
                }
            })
            let  temp_caliberLists =JSON.parse(JSON.stringify(that.caliberLists)) ;
            temp_caliberLists.forEach((val,index)=>{
                if(val.label==="全部管径"){
                    temp_caliberLists.splice(index,1);
                    return;
                }
            })


            let pipe_id = id;
            dse.globalData = {
                factoryId :that.search_str,
                id:pipe_id,
                areaLists:temp_areaList,
                pipeMaterials:temp_productLists,
                pipeRadius:that.caliberLists,
                interfaceTypes:dse.interFace
            }

            dse.globalData.staticFilePath = that.$store.getters.get_filePath
            dse.globalData.editSave = that.$store.getters.get_pages_btn_allow.pipe_2d3d.editSave;
            dse.this_ = that;


        },
        show_delModel(index, id) {
            this.delId = id;
            this.delIndex = index;
            this.showDelModel = true;
        },
        justDel() {
            let temp_delId = this.delId;
            let temp_delIndex = this.delIndex;
            this.configDel(temp_delId, temp_delIndex);
        },
        configDel(id, index) {
            let that = this;
            saveOrUpdate({
                "id": "" + id,
                "status": "3"
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.status) {
                    that.mainPipe.splice(index, 1);
                    that.showDelModel = false;
                }
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
            });
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
        getSliderValue(val) {
            let that = this;
            that.radius = val;
            let temp = that.xfsGeometries;
            xfs_func(temp)
        },
        searchPipeName(val) {
            this.search_pipeName = val.name;
        },
        search_fromName(name) {
            getPipeLine({
                lineName: name
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                this.searchPipeLists = res.data;
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
            });
        },
        fetchPipeListData(val) {
            this.search_fromName(val);
        },
        //显示地下管网.
        handleCheckAllChange(isChecked) {
            //
            if (isChecked) {
                //                this.map.ground.navigationConstraint = {
                //                    type: "none"
                //                };
                //                this.map.ground.opacity = 0.4;
                //显示地下管网.
                this.tempLayers = [];
                dse.baseMapLayers.forEach((layerItem) => {
                    let layer = this.map.findLayerById(layerItem.id);
                    if (layer) {
                        this.tempLayers.push({
                            //
                            layerId: layer.id,
                            visible: layer.visible
                        });
                        //
                        layer.visible = false;
                    }
                });

            } else {
                //
                //                this.map.ground.navigationConstraint = {
                //                    type: "stay-above"
                //                };
                //                this.map.ground.opacity = 1;
                this.tempLayers.forEach((layerItem) => {
                    //
                    let tempLayer = this.map.findLayerById(layerItem.layerId);
                    if (tempLayer) {
                        //
                        tempLayer.visible = layerItem.visible;
                    }
                });
            }
        },
        getUpdateTime() {
            let that = this;
            getModifiedTime({
                year: ""
            }).then(res => {
                // console.log(res);
                that.updateTime = (res.data && res.data[0]) ? res.data[0] : ""
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
            })
        },
        getOrganDictTree_(id) {
            let that = this;
            getOrganDictTree({
                code: "CQ",
                organizationId: "" + id
            }).then(res => {
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                let {
                    data
                } = res;
                let tempList = [];
                if (data.length > 0) {
                    tempList.push({
                        label: "全部城区",
                        id: ""
                    })
                    for (let i = 0; i < data.length; i++) {
                        let temp_json = {};
                        temp_json.label = data[i].label;
                        temp_json.value = data[i].id;
                        tempList.push(temp_json);
                    }
                    that.areaLists = tempList;
                    that.areaItem = "全部城区"
                } else {
                    that.areaLists = [{
                        label: "全部城区",
                        value: ""
                    }]
                }
            }).catch(error => {
                console.log(error);
            })
        },
        showLegend_() {
            this.showLegend = true;
        }
    },
    computed: {
        years() {
            let temp_year = new Date().getFullYear();
            let yearStr = String(temp_year);
            let thisFront_year = yearStr.substring(0, yearStr.length - 1);
            thisFront_year = parseInt(thisFront_year + "0");
            let endYear = 1940;
            let D_year = (thisFront_year - endYear) / 10 + 1;
            let temp_list = [];
            for (let i = 0; i < D_year; i++) {
                temp_list.push(
                    thisFront_year - i * 10 + "-" + (thisFront_year - i * 10 + 9)
                );
            }
            temp_list.push("1940以前");
            return temp_list;
        }
    },
    filters: {
        formate_time(val) {
            let temp_val = val
            if (val) {
                temp_val = temp_val.split(" ")
                temp_val = temp_val[0]
                let temp_year = temp_val.split("-")[0] + "年"
                let temp_month = temp_val.split("-")[1] + "月"
                let temp_day = temp_val.split("-")[2] + "日"
                return temp_year + temp_month + temp_day
            } else {
                return val
            }
        }
    },
    mounted() {
        let that = this;
        this.selectTime = this.years[0];
        let temp_companyId = this.search_str;
        //  得到 当前的 经纬度数据
        let  potions = this.$store.getters.get_cityPosition
        if(potions===[]){
            potions = [106.290351, 36.001819]
        }
        that.createMap(temp_companyId,potions);
        setTimeout(()=>{
            that.createMap(temp_companyId,potions);
        },2500)
    },

    created() {
        let that = this;
        dse.this_ = this;
        this.pipeLong = sessionStorage.getItem("pipeLong");
        let time = new Date();
        // let temp_year = String(time.getFullYear());
        // let temp_years = temp_year.substring(0, temp_year.length - 1);
        // temp_years = temp_years + "0";
        // let endYear = temp_year;

        that.startYear = '';
        that.endYear = '';

        this.areaLists = this.$store.getters.get_cityAreas;
        this.areaItem = "全部城区"
        let temp_tree = this.tree = this.$store.getters.get_orgTree;

        let temp_yearsList = [];
        let oldYear = 1980;
        let nowYear = time.getFullYear();
        let D_year = nowYear - oldYear + 1;
        for (let i = 0; i < D_year; i++) {
            temp_yearsList.push({
                label: nowYear - i,
                value: nowYear - i
            });
        }
        this.productLists = this.DSE.productLists;
        this.caliberLists = this.DSE.caliberLists;
        this.gisModel_iframe = this.DSE.pipeMsg_pipe;
        this.getUpdateTime();
        this.cityAreaName = this.$store.getters.get_areaName;
        that.search_str = temp_tree[0].id;
        this.initCompony = temp_tree[0].label;
        this.search_pipe_type = temp_tree[0].type;
        // 这里要传入值,从UI页面获取的。
        // this.getdata(temp_years, temp_year, "", "", "", "1", that.search_str, "", that.search_pipe_type);
        if (document.body.clientWidth < 1600) {
            this.small = true;
        }
    },
    beforeDestroy() {
        let that = this;
        // that.distance.clear();
        // that.area.clear();
    }

};
</script>

<style lang="scss" scoped>
@import "@/assets/resetCSS/pipeNet_msg/msg_2d_3d.scss";

.u-ground {
    position: absolute;
    right: 45px;
    width: 50px;
    height: 20px;
    line-height: 20px;
    border-radius: 5px;
    cursor: pointer;
}
</style>
