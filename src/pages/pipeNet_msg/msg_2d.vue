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
            <tools @handleThisDom="thisDom" :defaultLayers="layers" @showLayers="toggleSelectThis"></tools>
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
                <span>管线更新至{{updateTime.UPDATETIME}}</span>
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
                <el-select v-model="areaItem" placeholder="区域" @change="handleArea">
                    <el-option v-for="item in areaLists" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="productItem" placeholder="材质" @change="handleProduct">
                    <el-option v-for="item in productLists" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="caliberItem" placeholder="管径" @change="handleCaliber">
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
                        <!-- <el-button type="primary" style='opacity:0'>搜索</el-button> -->
                    </div>
                    <div class="f-item positions">
                        <span class="str">管线搜索:</span>
                        <el-input placeholder="请输入内容" v-model="searchValue" clearable>
                        </el-input>
                        <!-- <fuzzy-search  :closeList_flag="closeSubListFlag" @selectThis="searchPipeName" :defaultName="search_pipeName" :searchLists="searchPipeLists" @callBackList="fetchPipeListData"></fuzzy-search> -->
                        <!-- <el-button type="primary" @click="searclPipe">搜索</el-button> -->
                        <span class="search" @click="searclPipe" >搜索</span>
                    </div>
                </div>
                <div class="tabs">
                    <div class="f-export" @click="showPdfStatus">导出</div>
                </div>
                <div class="tab-content">
                    <div class="content-item  top-head">
                        <div class="head-select">
                            <span class="num">编号</span>
                        </div>
                        <div class="own">所属管线</div>
                        <div class="cycle">已用年限(使用寿命)</div>
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
                    <paginate :totalPage="totalPage"  @thisPage="gotoThisPage" :noSmall="'true'"></paginate>
                </div>
            </div>
        </div>
    </div>

    <process-model :showDefinedModel="processToggle" :title="'正在转换'" @hiddenSelf="closedPdfModel">
        <div class="wrap-inner">
            <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
            <div class="status">
                {{processStr}}
            </div>
        </div>
    </process-model>
    <iframe :src="downloadSrc" frameborder='0' style='width:0;height:0;'></iframe>
    <del-model :showModel="showDelModel" :delNum="delId" :type="delType" @delThis="hiddenDelModel" @sureDelThis="justDel"></del-model>
</div>
</template>

<script>
import * as esriLoader from "esri-loader";
import {
    getOrganDictTree
} from "@/api/common/get_area"
import {
    getPipeBaseInfo,
    getPipeLine,
    saveOrUpdate,
    getModifiedTime
} from "@/api/pipeNet_msg/msg";

import {
    getMapPro
} from "@/api/common/get_all_problemLayer"

import {
    dataTransform_pipeMsg
} from "@/common/config/dataTransform"
import tools from "@/common/components/gis_units/tools";
import selectTree from "@/common/components/selectWithTree";
import paginate from "@/common/components/pagination";
import fuzzySearch from "@/common/components/fuzzy_search";

import mapExportUtil from "@/common/utils/mapExportUtil";

// esriLoader.loadCss(dse.arcgis_themeCss);
esriLoader.loadCss(dse.arcgis_mainCss);

let pipeUrl = dse.arcgis_belowMap;
let xfsUrl = dse.arcgis_pipe;
let fmUrl = dse.arcgis_points;
let wireMap = dse.arcgis_wire;
let gasMap = dse.arcgis_gas;

let jxjMap = dse.arcgis_jxj;
let gzdMap = dse.arcgis_gzd;

let global_frame_data = dse.globalData;
let startJs = dse.arcgis_startJS;
const options = {
    url: startJs,
    dojoConfig: dse.gisConfig
};

let draw_area = null; //保存绘制在建区域的图层 函数
let queryPipeLayer_func = null; //保存查询管网的图层 函数
import processModel from "@/common/components/poupe/defined";
import addModel from "@/common/components/poupe/view";
import delModel from "@/common/components/poupe/save_status";

// 三维管网相关.
import popupUtils from '@/common/utils/popupUtils';
//管网图层配置
import gw2dConfig from '@/common/config/gis2d/gw2dConfig';
gw2dConfig.popupTemplate.visible = true;

// 消防栓配置
import xfs2dConfig from '@/common/config/gis2d/xfs2dConfig';

// 阀门配置
import fm2dConfig from '@/common/config/gis2d/fm2dConfig';

//天然气配置
import gas2dConfig from '@/common/config/gis2d/gas2dConfig';
//电线配置
import dx2dConfig from '@/common/config/gis2d/dx2dConfig';

//检修井
import jxj2dConfig from "@/common/config/gis2d/jxj2dConfig"

import layerUtils from '@/common/utils/layerUtils';

export default {
    name: "Home",
    components: {
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
            updateTime: "", //更新gis时间
            spaceItemActived: 0, //激活的2d视图页面
            title: "", // 弹窗题目
            view: null, // 全局化  gis底图实例
            map: null, //  挂载底图图层
            layer1: null, // 管网图层
            copy_pipe: null, //管网的副本
            layer2: null, // 消防栓图层
            layer3: null, // 阀门图层
            layer4: null, // 电线的图层
            layer5: null, //天然气的图层
            layer6: null, //检修井
            proBuild_layer: null, //再建区域的图层
            proJxj_layer: null, //检修井的弹窗
            newPipeLayer: null, //新建管网图层
            distance: null, // 量距离
            drawTools: null, //画基本图
            area: null, // 量面积
            searchGis: "", // 查询图层信息
            pipeLong: "",
            search_pipeName: "", //查询的管线名字
            searchPipeLists: [], //查询的管线列表
            closeSubListFlag: true,
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
            tree: [],
            tableStatus: true,
            timeLine_flag: false, // 是否显示时间轴的小窗口
            area_flag: false, //  是否显示区域的小窗口
            product_flag: false, //是否显示管材的小窗口
            mainPipe: [],
            caliber_falg: false, // 是否显示管径的小窗口
            activeFlag: null, // 时间轴的激活状态
            selectFlag: false, // 时间轴是否显示  按钮状态
            showAddModel: false, // 是否显示新增的弹窗
            showDelModel: false, // 是否显示删除的弹窗
            delType: false, //  显示删除的弹窗
            delList: [], //删除的 列表
            areaLists: [],
            productLists: [],
            caliberLists: [],
            totalPage: 1,
            currentPage: 1,
            initCompony: "", //初始化的公司名字
            delIndex: null, //删除的索引
            delId: null, //删除的ID
            gisModel_iframe: "", //gis的增加弹窗
            selectTime: "", //时间轴的所选年代
            areaItem: "", // 所选区域
            productItem: "", // 所选管材
            caliberItem: "", //所选管径,
            search_str: "", // 选择水厂或水施的 id
            search_pipe_type: "", //查询 是否是水司或者水厂
            searchValue: "", //搜索管线的名字
            model_outerSide_flag: false, //判断是否是外部触发弹窗
            iframe_str: "",
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
            cityAreaName: "", // 城市所在区域
            startYear:"",  //开始年份
            endYear:"",  // 结束年份
        };
    },
    methods: {
        createMap(companyId,positions) {
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
                        BaseMapUtils
                    ]) => {
                        layerUtils.bindAmdClass(QueryTask, Query, GraphicsLayer, Graphic);
                        let temp_baseUrl = that.DSE.baseURL;
                        let area_iframe_url = "" + temp_baseUrl + "/?id=" + id + "#/pipe/pipeNet_route/gisFrame_msg_pipe"
                        let iframe_area = '<iframe src="' + area_iframe_url + '" height="500" width="500"  scrolling="no" frameborder="0"></iframe>'

                        let proArea_iframe_url = "" + temp_baseUrl + "/?id=" + id + "#/pipe/pipeNet_route/gisFrame_msg_proArea"
                        let iframe_proArea = '<iframe src="' + proArea_iframe_url + '" height="396" width="500"  scrolling="no" frameborder="0"></iframe>'

                        let pro_jxj_iframe_url = "" + temp_baseUrl + "/?id=" + id + "#/pipe/pipeNet_route/gisFrame_msg_fm"
                        let iframe_pro_jxj = '<iframe src="' + pro_jxj_iframe_url + '" height="396" width="500"  scrolling="no" frameborder="0"></iframe>'
                        // Create the map
                        that.map = new Map({
                            //    basemap: "hybrid"
                            layers: []
                        });
                        let baseMapUtils = new BaseMapUtils({
                            map: that.map,
                            mapType: '2'
                        });

                        //debugger;
                        baseMapUtils.loadBaseLayers(dse.baseMapLayers);

                        // 电线图层
                        dx2dConfig.url = wireMap;
                        // that.layer4 = layerUtils.loadData(that.map, dx2dConfig,companyId);
                        //===================================================

                        // 天然气图层
                        gas2dConfig.url = gasMap;
                        // that.layer5 = layerUtils.loadData(that.map, gas2dConfig,companyId);
                        //===================================================

                         // 新建一个图层
                        that.newPipeLayer = new GraphicsLayer({
                            graphics: []
                        });
                        that.newPipeLayer.symbolInfo = {
                            type: "simple-line",
                            color: "#44cef6",
                            width: 4
                        };
                        that.map.add(that.newPipeLayer);
                        // 管网图层.
                        let pipeUrl = that.$store.getters.get_pipe_defaultLayer

                        gw2dConfig.url = pipeUrl;
                        gw2dConfig.popupTemplate.visible = true;
                        // that.copy_pipe = that.layer1 = layerUtils.loadData(that.map, gw2dConfig);
                        that.copy_pipe = that.layer1 = layerUtils.loadData(that.map, gw2dConfig,companyId);
                        //===================================================
                       
                        // // 阀门图层
                        let fmUrl = that.$store.getters.get_fm_defaultLayer
                        fm2dConfig.url = fmUrl;
                        that.layer3 = layerUtils.loadData(that.map, fm2dConfig,companyId);
                        // //===================================================

                        // //检修井
                        jxj2dConfig.url = jxjMap;
                        // that.layer6 = layerUtils.loadData(that.map, jxj2dConfig,companyId);
                        // //==================================================

                        setTimeout(() => {
                            that.map.layers.remove(that.layer4);
                            that.map.layers.remove(that.layer5);
                        }, 500)

                        // 消防栓图层
                        let xfsUrl = that.$store.getters.get_xfs_defaultLayer
                        xfs2dConfig.url = xfsUrl;
                        that.layer2 = layerUtils.loadData(that.map, xfs2dConfig,companyId);
                        //===================================================

                        that.proBuild_layer = new GraphicsLayer({
                            graphics: []
                        });
                        that.map.add(that.proBuild_layer)
                        that.view = new MapView({
                            container: "gis",
                            map: that.map,
                            zoom: 15,
                            center:positions
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

                        // 这里要传入值,从UI页面获取的。
                        that.getdata( that.startYear,  that.endYear, "", "", "", "1", that.search_str, "", that.search_pipe_type);

                        queryPipeLayer_func = function (parmas) {
                            let queryTask = new QueryTask({
                                url: xfsUrl
                            });
                            let query = new Query();
                            query.returnGeometry = true;
                            query.outFields = ["*"];
                            query.where = parmas;
                            queryTask.execute(query).then(function (results) {
                                let tempFeatures = results.features;
                                if (tempFeatures.length > 0) {
                                    that.view.remove(that.layer1);
                                    for (let i = 0; i < tempFeatures.length; i++) {
                                        that.view.graphics.add(tempFeatures[i]);
                                    }
                                }
                            });

                        }
                        that.view.on("click", function (event) {
                            that.model_outerSide_flag = false;
                        });
                        //监听弹出框.
                        that.view.popup.watch('selectedFeature', function (newView, oldValue, portery, object) {
                            window.graphic = that.view.popup.selectedFeature;
                            if (window.graphic) {

                                let temp_flag = that.model_outerSide_flag;
                                let compID = that.$store.getters.get_companyId;
                                if (!temp_flag) {
                                    that.view.graphics.removeAll();
                                    let tempGra = new Graphic({
                                        geometry: window.graphic.geometry,
                                        symbol: {
                                            color: "#FFFF00",
                                            type: "simple-line",
                                            width: "5"
                                        }
                                    });
                                    that.view.graphics.add(tempGra);
                                    // let params = window.graphic.attributes;
                                    // let temp_flag = params.openSelf == undefined ? "" : params;
                                    // let trans_item = null;

                                    // if (temp_flag == "") {
                                    //     let temp_obj = dataTransform_pipeMsg(params);
                                    //     trans_item = that.formatePipeList_(temp_obj);
                                    // } else {
                                    //     trans_item = params;
                                    // }

                                    // dse.globalData = trans_item;

                                    let  temp_areaList = JSON.parse(JSON.stringify(that.areaLists)) ;
                                    temp_areaList.forEach((val,index)=>{
                                        if(val.label==="全部城区"){
                                            temp_areaList.splice(index,1);
                                            return; 
                                        }
                                    })
                                     let  temp_productLists = JSON.parse((JSON.stringify(that.productLists))) ;
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

                        // temp_modelUrl
                        // 搜索查询对应的管道
                        let temp_gisID = 'SDEPIPEID';
                        that.searchLayer = new Search({
                            view: that.view,
                            allPlaceholder: "",
                            sources: [{
                                featureLayer: {
                                    url: pipeUrl,
                                    popupTemplate: {
                                        title: "管网",
                                        content: "" + iframe_area,
                                        overwriteActions: true
                                    }
                                },
                                searchFields: ["" + temp_gisID],
                                displayField: "" + temp_gisID,
                                exactMatch: false,
                                outFields: ["*"],
                                name: "显示管道信息",
                                placeholder: "查询字段",
                                resultSymbol: {
                                    color: "#FFFF00",
                                    type: "simple-line",
                                    width: "5"
                                }
                            }]
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
        formatePipeList(item) {
            let temp = item;
            let temp_materials = dse.productLists;
            let temp_ridius = dse.caliberLists;
            for (let i = 0; i < temp_materials.length; i++) {
                if (item.PIPE_MATERIAL == temp_materials[i].value) {
                    item.PIPE_MATERIAL_name = temp_materials[i].label;
                }
            }
            for (let j = 0; j < temp_ridius.length; j++) {
                if (item.PIPE_RADIUS == temp_ridius[j].value) {
                    item.PIPE_RADIUS_name = temp_ridius[j].label;
                }
            }
            return temp;
        },
        formatePipeList_(item) {
            let temp = item;
            let temp_materials = dse.productLists;
            let temp_ridius = dse.caliberLists;
            for (let i = 0; i < temp_materials.length; i++) {
                if (item.PIPE_MATERIAL == temp_materials[i].label) {
                    item.PIPE_MATERIAL = temp_materials[i].value;
                    item.PIPE_MATERIAL_name = temp_materials[i].label;
                }
            }
            for (let j = 0; j < temp_ridius.length; j++) {
                if (item.PIPE_RADIUS == temp_ridius[j].label) {
                    item.PIPE_RADIUS = temp_ridius[j].value;
                    item.PIPE_RADIUS_name = temp_ridius[j].label;
                }
            }
            return temp;
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
            if (index == 1) {
                this.$router.push({
                    name: "pipeNet_msg_3d"
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
            if(!this.selectFlag){
                this.selectTime = ''
                this.searclPipe()
            }
        },
        //点击获取年代
        heightLight(index) {
            let that = this;
            this.activeFlag = index;

            let temp_str = this.years[index];
            let temp_start = temp_str.split("-")[0];
            if (temp_start == "1949以前") {
                this.selectTime = "1900-1949"
            } else {
                this.selectTime = this.years[index];
            }
            this.searclPipe()
        },
        //滚动获取年代
        scrollSelf(e) {
            let that = this;
            let temp_offsetY = e.deltaY;
            let temp_index = this.activeFlag;
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
        // 点击获取区域
        handleArea(val) {

            this.areaItem = val;
        },
        // 点击获取材质
        handleProduct(event) {
            // console.log("材质" + event);
        },
        // 点击获取管径
        handleCaliber(event) {
            // console.log("管径" + event);
        },
        closed() {
            this.area_flag = false;
            this.product_flag = false;
            this.caliber_falg = false;
            this.timeLine_flag = !this.timeLine_flag;
        },
        closeLegend() {
            this.showLegend = false;
        },
        activeThis(index) {
            //展示跟导出相关的tab栏
            this.activeTap = index;
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
                    this._changeBaseLayer('gvec');
                    break;
                case "卫星":
                    this._changeBaseLayer('gimg');
                    break;
                case "地形":
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

            let pipeUrl = that.$store.getters.get_pipe_defaultLayer
            
            gas2dConfig.url = pipeUrl;
            layerUtils.queryFeatures(gw2dConfig, {
                where: queryString,
                returnGeometry: true,
                outFields :["*"]
            }, that.newPipeLayer, that.copy_pipe);
            let temp_areaId = areaId
            if (temp_areaId == "全部城区" || temp_areaId == undefined) {
                temp_areaId = ""
            }
            getPipeBaseInfo({
                startYear: "" + start_year,
                endYear: "" + end_year,
                areaId: "" + temp_areaId,
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
                console.log(error)
            });
        },
        //构建管线查询条件
        _createGwQueryParam() {

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

            if (temp_area == undefined || temp_area == "全部城区") {
                temp_area = ""
            }
            if (temp_product == undefined || temp_product == "全部管材") {
                temp_product = ""
            }
            if (temp_caliber == undefined || temp_caliber == "全部管径") {
                temp_caliber = ""
            }

            let queryString = ""
            if(this.selectTime!==""){
                queryString = `INSTALL_TIME between  '${startTime}' and '${endTime}'`;
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

            if( queryString.substring(0,3)==='and'){
                  queryString = queryString.substring(3)
            }
            return `${queryString}`;
        },
        searclPipe() {
            let json = {};
            let startTime = ''
             let endTime = ''
            if(this.selectTime!==""){
                startTime = this.selectTime.split("-")[0]
                endTime = this.selectTime.split("-")[1];
                this.startYear = startTime
                this.endYear = endTime;
            }
           
            let temp_area = this.areaItem;
            let temp_product = this.productItem;
            let temp_caliber = this.caliberItem;
            if (temp_area == "全部城区" || temp_area == undefined) {
                temp_area = "";
            }
            if (temp_product == "全部管材" || temp_product == undefined) {
                temp_product = "";
            }
             if (temp_caliber == "全部管径" || temp_caliber == undefined) {
                temp_caliber = "";
            }

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
            that.model_outerSide_flag = true;

            let temp_search = this.searchLayer;
            temp_search.searchTerm = id;
            temp_search.search()

            this.view.goTo({
                center: that.view.center,
                zoom: that.view.zoom
            });
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
            let  temp_caliberLists = JSON.parse(JSON.stringify(that.caliberLists)) ;
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
                console.log(error)
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
        searchPipeName(val) {
            // console.log(val)
            this.search_pipeName = val.lineName;
            this.searchValue = val.lineCode;
            this.closeSubListFlag = false;
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
                console.log(error)
            });
        },
        fetchPipeListData(val) {
            this.search_fromName(val);
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
            temp_list.push("1949以前");
            return temp_list;
        }
    },
    mounted() {
        let that = this;
        let temp_companyId = this.search_str;
        //  得到 当前的 经纬度数据
        let  potions = this.$store.getters.get_cityPosition
        if(potions.length===0){
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
        that.startYear = '';
        that.endYear = '';

        this.selectTime = '';
        this.areaLists = this.$store.getters.get_cityAreas;
        this.areaItem = "全部城区"
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
        this.productLists = this.$store.getters.get_pipe_material
        this.productItem = "全部管材"
        this.caliberLists = this.$store.getters.get_pipe_radius
        this.caliberItem = "全部管径"
        this.gisModel_iframe = this.DSE.pipeMsg_pipe;
        this.getUpdateTime();
        if (document.body.clientWidth < 1600) {
            this.small = true;
        }
        this.cityAreaName = this.$store.getters.get_areaName;
        let temp_tree = this.tree = this.$store.getters.get_orgTree;
        that.search_str = temp_tree[0].id;
        this.initCompony = temp_tree[0].label;
        this.search_pipe_type = temp_tree[0].type; 

    },
    beforeDestroy() {
        let that = this;
        if(that.distance){
            that.distance.clear();
        }
        if(that.area){
            that.area.clear();
        }
    },
    filters:{
         formate_time(val){
            let temp_val = val
            if(val){
                temp_val = temp_val.split(" ")
                temp_val = temp_val[0]
                let temp_year = temp_val.split("-")[0]+"年"
                let temp_month = temp_val.split("-")[1]+"月"
                let temp_day = temp_val.split("-")[2]+"日"
                return temp_year+temp_month+temp_day
            }else{
                return val
            }
            
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/resetCSS/pipeNet_msg/msg_2d_3d.scss";
</style>
