<template>
<div id="addBase">
    <div class="top-head">
        <div class="tips">
            <span class="rect"></span>
            <span>基本信息</span>
        </div>
        <div class="subInputs">
            <div class="row">
                <div class="col">
                    <i class="el-icon-star-on"></i>
                    <span>测点名称</span>
                </div>
                <div class="col">
                    <el-input clearable placeholder="请输入测点名" v-model="postData.name" @change="get_name_len"></el-input>
                </div>
                <div class="col">
                    <i class="el-icon-star-on"></i>
                    <span>检测项类型</span>
                </div>
                <div class="col ">
                    <template v-if="!ifFromEdit">
                        <el-radio v-model="postData.moniType" @change="showThisRadio" label="3">流量</el-radio>
                        <el-radio v-model="postData.moniType" @change="showThisRadio" label="2">水压</el-radio>
                        <el-radio v-model="postData.moniType" @change="showThisRadio" label="1">水质</el-radio>
                    </template>
                    <template v-else>
                        <span>{{waterType|fortmateType}}</span>
                    </template>

                </div>
                <div class="col">
                    <i class="el-icon-star-on"></i>
                    <span>数据标识</span>
                </div>
                <div class="col">
                    <el-input placeholder="请输入数据标识" clearable v-model="postData.dataCode"  @change="get_dataCode_len"></el-input>
                </div>
            </div>
            <div class="row">
                <div class="col">
                        <i class="el-icon-star-on"></i>
                    <span>位置</span>
                </div>
                <div class="col">
                    <template v-if="postData.lgtd!=''">
                        <img src="../../assets/images/common/mark.png" alt="">
                        <span class="gisBtn" @click="showGisModel">重新选择</span>
                    </template>
                    <template v-else>
                        <span class="gisBtn" @click="showGisModel">点击获取经纬度</span>
                    </template>
                </div>
                <div class="col">
                    <i class="el-icon-star-on"></i>
                    <span>状态</span>
                </div>
                <div class="col ">
                    <el-radio v-model="postData.isValid" label="1">启用</el-radio>
                    <el-radio v-model="postData.isValid" label="2">停用</el-radio>
                </div>
                <div class="col">
                    <i class="el-icon-star-on"></i>
                    <span>监测仪器编号</span>
                </div>
                <div class="col">
                    <el-input placeholder="请输入仪器编号" clearable v-model="postData.deviceCode"  @change="get_deviceCode_len"></el-input>
                </div>
            </div>
            <div class="row">
                <div class="col">
                        <i class="el-icon-star-on"></i>
                    <span>东经</span>
                </div>
                <div class="col">
                    <span>{{xy.lgtd_formate}}</span>
                </div>
                <div class="col">
                        <i class="el-icon-star-on"></i>
                    <span>北纬</span>
                </div>
                <div class="col ">
                    <span>{{xy.lttd_formate}}</span>
                </div>
                <div class="col">
                    <span></span>
                </div>
                <div class="col">
                </div>
            </div>
        </div>
    </div>
    <template v-if="postData.moniType==1">
        <div class="detectionItem">
            <span @click="showProgectsModel">选择检测项</span>
        </div>
        <div class="detectionList">
            <div class="row head">
                <div class="col">
                    <span>检测项</span>
                </div>
                <div class="col">
                    <span>正常范围</span>
                </div>
                <div class="col">
                    <span>数据标识</span>
                </div>
                <div class="col">
                    <span>操作</span>
                </div>
            </div>
            <div class="subContent">
                <div class="innerWrap" v-if="ifFromEdit">
                    <div class="row" v-for="(item,index) in fromEditList" :key="index">
                        <div class="col"><span>{{item.itemName}}</span></div>
                        <div class="col">
                            <span>{{item.range}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.identify}}</span>
                        </div>
                        <div class="col" @click="delSelf_fromEdit(index)"><span class="delBtn">删除</span></div>
                    </div>
                </div>
                <div class="innerWrap" v-for="(item,index) in selectProject" :key="index">
                    <template  v-for="(val,i) in item.subitemList"  >
                          <div class="row"  v-if="val.itemFlag==true" :key="i">
                            <div class="col"><span>{{val.ITEMNAME}}</span></div>
                            <div class="col">
                                <span>{{val.RANGE}}</span>
                            </div>
                            <div class="col">
                                <el-input v-model="val.identify" clearable></el-input>
                            </div>
                            <div class="col" @click="delSelf(val)"><span class="delBtn">删除</span></div>
                        </div>
                    </template>
                </div>

            </div>
            <div class="earlyWarning">
                <div class="topTips">
                    <span class="rect"></span>
                    <span>预警信息</span>
                </div>
                <div class="row">
                    <div class="col">
                        <i class="el-icon-star-on"></i>
                        <span>设备离线时长</span>
                    </div>
                    <div class="col">
                        <el-input placeholder="请输入离线时长" @blur="ifValid" clearable v-model="postData.deviceOffline"></el-input>
                        <span>小时</span>
                    </div>
                </div>
            </div>
            <div class="actions">
                <span @click="save">确定</span>
                <span @click="goBack_">返回</span>
            </div>
        </div>
    </template>
    <template v-else>
        <div class="shortInput">
            <div class="topTips">
                <span class="rect"></span>
                <span>预警信息</span>
            </div>
            <div class="subContent">
                <div class="col">
                    <div class="row">
                        <div class="col">
                            <span>时间设置</span>
                        </div>
                        <div class="col">
                            <div class="time-col">
                                <span>开始时间:{{water_time[0].STARTTIME}}</span>
                                <span>结束时间:{{water_time[0].ENDTIME}}</span>
                            </div>
                            <div class="time-col">
                                <span>开始时间:{{water_time[1].STARTTIME}}</span>
                                <span>结束时间:{{water_time[1].ENDTIME}}</span>
                            </div>
                            <div class="time-col">
                                <span>开始时间:{{water_time[2].STARTTIME}}</span>
                                <span>结束时间:{{water_time[2].ENDTIME}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span>{{postData.moniType|fortmateType}}上限</span>
                        </div>
                        <div class="col">
                            <div class="time-col">
                                <el-input clearable :placeholder="getTips_up" v-model="water_time[0].MAXVALUE" @change="get_max_1"></el-input>{{postData.moniType|formate_unit}}
                            </div>
                            <div class="time-col">
                                <el-input clearable :placeholder="getTips_up" v-model="water_time[1].MAXVALUE" @change="get_max_2"></el-input>{{postData.moniType|formate_unit}}
                            </div>
                            <div class="time-col">
                                <el-input clearable :placeholder="getTips_up" v-model="water_time[2].MAXVALUE" @change="get_max_3"></el-input>{{postData.moniType|formate_unit}}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <span>{{postData.moniType|fortmateType}}下限</span>
                        </div>
                        <div class="col">
                            <div class="time-col">
                                <el-input className="sm" clearable :placeholder="getTips_down" v-model="water_time[0].MINVALUE" @change="get_min_1"></el-input>{{postData.moniType|formate_unit}}
                            </div>
                            <div class="time-col">
                                <el-input className="sm" clearable :placeholder="getTips_down" v-model="water_time[1].MINVALUE" @change="get_min_2"></el-input>{{postData.moniType|formate_unit}}
                            </div>
                            <div class="time-col">
                                <el-input className="sm" clearable :placeholder="getTips_down" v-model="water_time[2].MINVALUE" @change="get_min_3"></el-input>{{postData.moniType|formate_unit}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="heightRow">
                        <div class="col">
                            <span>设备离线时长</span>
                        </div>
                        <div class="col">
                            <el-input placeholder="设备离线时长" @blur="ifValid" v-model="postData.deviceOffline"></el-input>h
                        </div>
                    </div>
                </div>
            </div>

            <div class="footers">
                <span @click="save_">确定</span>
                <span @click="goBack_">返回</span>
            </div>
        </div>

    </template>
    <div class="select-items" v-if="toggoleShowProModel">
        <div class="top-head">
            <span>监测点选择</span>
            <i @click="closeProgects" class="el-icon-close"></i>
        </div>
        <div class="projects">
            <template v-if="selectProject.length>0">
                 <div class="item" v-for="(item,index) in selectProject" :key="index" >
                    <div class="title">
                        <span class="noWrap" :title="item.NAME">{{item.NAME}}</span>
                        <i class="el-icon-caret-top" :class="{rotate90:item.showSubListFlag==true}" @click="showSub(index)"></i>
                    </div>
                    <div class="subContent" v-if="item.showSubListFlag==true">
                        <template v-if="item.subitemList.length>0">
                              <div class="detail-item" v-for="(val,i) in item.subitemList" :key="i" >
                                <span  @click="selectSub_item(index,i,val.CODE)" class="circle" :class="{actived:val.itemFlag==true}"></span>
                                <span class="noWrap" :title="val.ITEMNAME">{{val.ITEMNAME}}</span>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </div>
       <div class="getGisPositionModel" v-if="toggoleShowGisModel" @click="closedGisModel">
        <div class="tips"><span>点击获取经纬度</span> <i  @click="colseGIS" class="el-icon-close"></i></div>
        <div id="gis"></div>
    </div>
    <save-status :showModel="ifShowModel" :content="fetchContent" @delThis="closeModel" :type="modelType" :flag="status" @sureDelThis="configDel"></save-status>
</div>
</template>

<script>
import saveStatus from "@/common/components/poupe/save_status";
import Valid from "@/common/utils/inputs_valid"
import {
    getMonitoringProgram,
    addMonitor,
    queryPointMonitor,
    updateMonitor
} from "@/api/monitor/addBase"
import * as esriLoader from "esri-loader";
esriLoader.loadCss(dse.arcgis_mainCss);
let startJs = dse.arcgis_startJS;
const options = {
    url: startJs,
    dojoConfig: dse.gisConfig
};
let pipeUrl = dse.arcgis_belowMap;
// 二维管网相关.
import popupUtils from '@/common/utils/popupUtils';
//管网图层配置
import gw2dConfig from '@/common/config/gis2d/gw2dConfig';
import layerUtils from '@/common/utils/layerUtils';

import Arcgis_mkt_jwd from "@/common/utils/arcgis_mkt_jwd"

export default {
    components: {
        saveStatus
    },
    data() {
        return {
            getTips_up: "", //placehoder
            getTips_down: "", //placehoder
            waterType: "", //水的类型
            ifFromEdit: false, //是否从编辑中来
            ifShowModel: false,
            fetchContent: "",
            modelType: true,
            status: null,
            map: null,
            view: null,
            layer1: null, // 管网
            toggoleShowGisModel: false, //gis 获取经纬度的弹窗
            toggoleShowProModel: false, //选择项的弹窗
            comeFrme_editID: "", //来自编辑的id
            postData: {
                "name": "",
                "pipeCode": "",
                "lgtd": "",
                "lttd": "",
                "depth": "",
                "altitude": "",
                "deviceCode": "",
                "moniType": "1",
                "dataCode": "",
                "isValid": "1",
                "baseinfEntityList": [], //水质
                "configEntityList": [], //水流水压
                "deviceOffline": 3.0
            },
            water_time: [{
                "MAXVALUE": "",
                "MINVALUE": "",
                "STARTTIME": "00:00:00",
                "ENDTIME": "01:59:59"
            }, {
                "MAXVALUE": "",
                "MINVALUE": "",
                "STARTTIME": "02:00:00",
                "ENDTIME": "03:59:59"
            }, {
                "MAXVALUE": "",
                "MINVALUE": "",
                "STARTTIME": "04:00:00",
                "ENDTIME": "23:59:59"
            }],
            temp_offTime: 3.0, //缓存下线时间
            temp_time: [{ //缓存 时间分组
                "MAXVALUE": "",
                "MINVALUE": "",
                "STARTTIME": "00:00:00",
                "ENDTIME": "01:59:59"
            }, {
                "MAXVALUE": "",
                "MINVALUE": "",
                "STARTTIME": "02:00:00",
                "ENDTIME": "03:59:59"
            }, {
                "MAXVALUE": "",
                "MINVALUE": "",
                "STARTTIME": "04:00:00",
                "ENDTIME": "23:59:59"
            }],
            xy: {
                gtd_formate: "",
                lttd_formate: "",
            },
            new_: {
                dcgj_mark: ""
            },
            selectProject: [],
            showSubList_index: null, //点击展示某个分类的下级列表
            showSubList_item_index: null, //下级列表的文件索引
            endTime: "",
            getTips: "", //输入框提示
            fromEditList: [], //来自编辑的检测项
            valid_number: true, // 离线时长的输入校验
            fromActived_index:0, //来至哪个索引
        }
    },
    methods: {
        closeModel(val) {
            this.ifShowModel = val.modelFlag
        },
        configDel(obj) {
            this.deleteCommonInfo_(obj.num);
        },
        showGisModel() {
            let that = this;
            this.toggoleShowGisModel = true;
            setTimeout(() => {
                that.createMap();
            }, 1000)
        },
        closedGisModel() {
            // this.toggoleShowGisModel = false;
        },
        closeProgects() {
            this.toggoleShowProModel = false
        },
        showProgectsModel() {
            this.toggoleShowProModel = true;
        },
        filterActiveItem() {
            let temp_arr = this.selectProject;
            let that = this;
            let temp = [];
            if (temp_arr.length > 0) {
                for (let i = 0; i < temp_arr.length; i++) {
                    for (let j = 0; j < temp_arr[i].subitemList.length; j++) {
                        if (temp_arr[i].subitemList[j].itemFlag) {
                            let temp_json = {};
                            temp_json["range"] = temp_arr[i].subitemList[j].RANGE;
                            temp_json["itemName"] = temp_arr[i].subitemList[j].ITEMNAME;
                            temp_json["identify"] = temp_arr[i].subitemList[j].identify || "";
                            temp_json["itemCode"] = temp_arr[i].subitemList[j].CODE;
                            temp.push(temp_json)
                        }

                    }
                }
            }
            return temp;
        },
        save() {
            let that = this
            if (!this.valid_number) {
                this.$message.error("请输入数字或者带有小数的数字!");
                return
            }
            let postData_ = this.postData;
            if (postData_.pipeCode === "" ||postData_.pipeCode===null) {
                this.$message.error("请在管线上拾取坐标点!")
                return
            }

            if (postData_.name == "" || postData_.name == "" || postData_.deviceCode == "" || postData_.dataCode == "" || postData_.deviceOffline == "") {
                this.$message.error("请输入完整!");
                return
            }

            let post_arr = this.filterActiveItem();
            this.postData.baseinfEntityList = [...post_arr, ...that.fromEditList];
            this.postData.deviceOffline = parseFloat(that.postData.deviceOffline);
            if (!this.ifFromEdit) {
                this.addMonitor_(postData_)
            } else {
                postData_["id"] = that.comeFrme_editID;
                this.updateMonitor_(postData_)
            }
        },
        formate_xy(val) {
            let temp_value = parseFloat(val);
            let du = parseInt(temp_value);
            let fen = parseInt((parseFloat(temp_value) - du) * 60);
            let miao = parseInt((temp_value - du - fen / 60) * 60 * 10000) / 10000;
            temp_value = du + "°" + fen + "′" + miao + "″";
            return temp_value
        },
        createMap() {
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
                        layerUtils.bindAmdClass(QueryTask, Query, GraphicsLayer);
                        // Create the map
                        that.map = new Map({
                            // basemap: "satellite"
                        });

                        let baseMapUtils = new BaseMapUtils({
                            map: that.map,
                            mapType: '2'
                        });
                        baseMapUtils.loadBaseLayers(dse.baseMapLayers);
                        // 管网图层.
                        gw2dConfig.url = pipeUrl;
                        gw2dConfig.popupTemplate.visible = false;
                        that.layer1 = layerUtils.loadData(that.map, gw2dConfig);
                        //===================================================

                        that.map.add(that.newGraphicsLayer_marks);
                        that.view = new MapView({
                            container: "gis",
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
                        that.view.on("click", function (event) {
                            that.view.graphics.removeAll();
                            let temp_json = event.mapPoint;
                            let xy = new Arcgis_mkt_jwd([temp_json.x, temp_json.y]).mercator2lonlat()
                            that.postData.lgtd = xy[0];
                            that.postData.lttd = xy[1];
                            that.xy.lgtd_formate = that.formate_xy(xy[0])
                            that.xy.lttd_formate = that.formate_xy(xy[1])
                            that.postData.pipeCode = "";
                            that.view.hitTest(event).then(function (response) {
                                if (response.results.length) {
                                    let temp = response.results[0].graphic;
                                    that.postData.pipeCode = temp.attributes.ID;
                                    let geo = temp.geometry;
                                    let tempGra = new Graphic({
                                        geometry: geo,
                                        symbol: {
                                            color: "#FFFF00",
                                            type: "simple-line",
                                            width: "5"
                                        }
                                    });
                                    that.view.graphics.add(tempGra);
                                }
                            });
                        });

                    }
                );
        },
        colseGIS() {
            this.toggoleShowGisModel = false;
        },
        getMonitoringProgram_() {
            let that = this
            getMonitoringProgram({
                flag: '0'
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
                    that.selectProject = res.data || [];
                    if (that.selectProject.length > 0) {
                        let temp_arr = that.selectProject
                        for (let i = 0; i < temp_arr.length; i++) {
                            temp_arr[i].showSubListFlag = false;
                            for (let j = 0; j < temp_arr[i].subitemList.length; j++) {
                                temp_arr[i].subitemList[j].itemFlag = false;
                                temp_arr[i].subitemList[j].identify = ""
                                temp_arr[i].subitemList[j].parintIndex = i;
                                temp_arr[i].subitemList[j].selfIndex = j;
                            }
                        }
                        that.selectProject = temp_arr;
                    }
                }
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // } else {
                //     that.$message.error("逻辑错误!")
                // }
            });
        },
        showSub(index) {
            let temp_arr = JSON.parse(JSON.stringify(this.selectProject));
            temp_arr[index].showSubListFlag = !temp_arr[index].showSubListFlag;
            this.selectProject = temp_arr
        },
        delCommonItem(code) {
            let that = this;
            let temp_fromEditList = this.fromEditList;
            for (let i = 0; i < temp_fromEditList.length; i++) {
                if (temp_fromEditList[i].itemCode == code) {
                    that.fromEditList.splice(i, 1);
                    break;
                }
            }
        },
        selectSub_item(index, i, code) {
            let temp_arr = JSON.parse(JSON.stringify(this.selectProject));
            temp_arr[index].subitemList[i].itemFlag = !temp_arr[index].subitemList[i].itemFlag;
            this.selectProject = temp_arr;
            this.delCommonItem(code);
        },
        addMonitor_(params) {
            let that = this;
            addMonitor(params).then(res => {
                that.ifShowModel = true;
                that.status = (res.status == 1);
                that.fetchContent = res.msg;
                if (res.status == 1) {
                    setTimeout(() => {
                        this.$router.push({
                            name: "pipe_monitor_baseSet"
                        });
                        this.$store.commit("setAside_status", true);
                        this.$emit("showAside");
                    }, 2500)

                }
            })
        },
        isNUll(arr){
            let temp = arr;
            let flag=0;
            if(arr.length>0){
                for(let i=0;i<temp.length;i++){
                    if(temp[i].MAXVALUE!=''&&temp[i].MINVALUE!=''){
                        flag += 1;
                    }
                }
            }
            return flag == temp.length
        },
        save_() {
            let that = this;
            let postData_ = this.postData;
            if (postData_.pipeCode === "" ||postData_.pipeCode===null) {
                this.$message.error("请在管线上拾取坐标点!")
                return
            }

            this.postData.configEntityList = this.water_time;
            if(this.postData.moniType =="2" ||this.postData.moniType =="3" ){
                if(!this.isNUll(that.water_time)){
                    this.$message.error("预警信息填写不全或者为空!")
                    return 
                }
            }

            this.postData.deviceOffline = parseFloat(that.postData.deviceOffline);
            if (!this.ifFromEdit) {
                this.addMonitor_(that.postData);
            } else {
                that.postData["id"] = that.comeFrme_editID;
                this.updateMonitor_(that.postData);
            }
        },
        goBack_() {
            this.$router.push({
                name: "pipe_monitor_baseSet"
            });
            this.$store.commit("setAside_status", true);
            this.$emit("showAside");
        },
        queryPointMonitor_point(id, type) {
            let that = this;
            queryPointMonitor({
                id: "" + id,
                type: "" + type
            }).then(res => {
                if (res.status == 1) {
                    let {
                        data
                    } = res;
                    let temp_arr = that.temp_time;
                    if (data.length) {
                        if (type != '1') {
                            if (data.length == 1) {
                                temp_arr[0] = data[0];
                            } else if (data.length == 2) {
                                temp_arr[0] = data[0];
                                temp_arr[1] = data[1];
                            } else {
                                temp_arr = data;
                            }
                        } else {
                            let count = 0;
                            let temp_arr = [];
                            data.map(val => {
                                let temp_json = {};
                                temp_json["range"] = val.RANGE;
                                temp_json["itemName"] = val.ITEMNAME;
                                temp_json["identify"] = val.IDENTIFY || "";
                                temp_json["itemCode"] = val.CODE;
                                temp_arr.push(temp_json)
                            })
                            that.fromEditList = temp_arr || [];
                        }

                    }
                    that.temp_time = temp_arr;
                }
            })
        },
        delSelf(val) {
            let parent_index = val.parintIndex;
            let self_index = val.selfIndex;
            this.selectProject[parent_index].subitemList[self_index].itemFlag = false;
        },
        showThisRadio(val) {
            if (val == 2) {
                this.getTips_up = "请输入水压上限";
                this.getTips_down = "请输入水压下限";
            } else if (val == 3) {
                this.getTips_up = "请输入水流上限";
                this.getTips_down = "请输入水流下限";
            }
        },
        updateMonitor_(params) {
            let that = this;
            updateMonitor(params).then(res => {
                that.ifShowModel = true;
                that.status = (res.status == 1);
                that.fetchContent = res.msg;
                if (res.status == 1) {

                    setTimeout(() => {
                        this.$router.push({
                            name: "pipe_monitor_baseSet"
                        });
                        this.$store.commit("setAside_status", true);
                        this.$emit("showAside");
                    }, 2500)

                }
            })
        },
        delSelf_fromEdit(index) {
            this.fromEditList.splice(index, 1);
        },
        ifValid(e) {
            let temp = e.target.value;
            // console.log(temp);
            let flag = new Valid().isNumber(temp);
            this.valid_number = flag;
            if (!flag) {
                this.$message.error("请输入带有小数点的数字 例如 3.2")
            }
        },
        get_max_1(val) {
            let flag = new Valid().isNumber(val);
            if (!flag) {
                this.water_time[0].MAXVALUE = 0.0
                this.$message.error("请输入带有小数点的数字 例如 3.2");
                return
            }
        },
        get_max_2(val) {
            let flag = new Valid().isNumber(val);
            if (!flag) {
                this.water_time[1].MAXVALUE = 0.0
                this.$message.error("请输入带有小数点的数字 例如 3.2");
                return
            }
        },
        get_max_3(val) {
            let flag = new Valid().isNumber(val);
            if (!flag) {
                this.water_time[2].MAXVALUE = 0.0
                this.$message.error("请输入带有小数点的数字 例如 3.2");
                return
            }
        },
        get_min_1(val) {
            let flag = new Valid().isNumber(val);
            if (!flag) {
                this.water_time[0].MINVALUE = 0.0
                this.$message.error("请输入带有小数点的数字 例如 3.2");
                return
            }
            let temp_value = parseFloat(this.water_time[0].MAXVALUE);
            let temp_min = parseFloat(val);
            if (temp_value < temp_min) {
                this.$message.error("最大值不能小于最小值");
                this.water_time[0].MINVALUE = temp_value
                return
            }

        },
        get_min_2(val) {
            let flag = new Valid().isNumber(val);
            if (!flag) {
                this.water_time[1].MINVALUE = 0.0
                this.$message.error("请输入带有小数点的数字 例如 3.2");
                return
            }
            let temp_value = parseFloat(this.water_time[1].MAXVALUE);
            let temp_min = parseFloat(val);
            if (temp_value < temp_min) {
                this.$message.error("最大值不能小于最小值");
                this.water_time[1].MINVALUE = temp_value
                return
            }
        },
        get_min_3(val) {
            let flag = new Valid().isNumber(val);
            if (!flag) {
                this.water_time[2].MINVALUE = 0.0
                this.$message.error("请输入带有小数点的数字 例如 3.2");
                return
            }
            let temp_value = parseFloat(this.water_time[2].MAXVALUE);
            let temp_min = parseFloat(val);
            if (temp_value < temp_min) {
                this.$message.error("最大值不能小于最小值");
                this.water_time[0].MINVALUE = temp_value
                return
            }
        },
        get_name_len(val){
            let temp_value = val;
            if(val==""){
                this.$message.warning("输入不能为空!")
                return
            }
            let temp_len = temp_value.length
            if(temp_len>25){
                 this.$message.warning("输入的文字不能超过25个字!")
                temp_value = temp_value.substring(0,25)
            }
            this.postData.name = temp_value
        },
        get_dataCode_len(val){
            let temp_value = val;
            if(val==""){
                this.$message.warning("输入不能为空!")
                return
            }
            let temp_len = temp_value.length
            if(temp_len>50){
                temp_value = temp_value.substring(0,30)
            }
            this.postData.dataCode = temp_value
        },
        get_deviceCode_len(val){
             let temp_value = val;
            if(val==""){
                this.$message.warning("输入不能为空!")
                return
            }
            let temp_len = temp_value.length
            if(temp_len>50){
                temp_value = temp_value.substring(0,30)
            }
            this.postData.deviceCode = temp_value
        }
    },
    mounted() {
        let that = this;
        this.getMonitoringProgram_();
        let coout = 0;
        let timer = setInterval(() => {
            that.water_time = that.temp_time;
            that.postData.deviceOffline = that.temp_offTime;
            coout++;
            if (coout == 2) {
                clearInterval(timer);
            }
        }, 500)
    },
    computed: {
        timeList() {
            let time = [];

            return time
        }
    },
    filters: {
        fortmateType(val) {
            let temp = val;
            switch (val) {
                case "1":
                    temp = "水质";
                    break;
                case "2":
                    temp = "水压";
                    break;
                case "3":
                    temp = "流量";
                    break;
            }
            return temp;
        },
        formate_unit(val) {
            let temp = val;
            switch (val) {
                case "2":
                    temp = "MPa";
                    break;
                case "3":
                    temp = "m³/s";
                    break;
            }
            return temp;
        }
    },
    created() {
        let temp = this.$route.params.edit;

        this.postData.moniType= ""+this.$route.params.activedIndex;
        if (temp) {
            this.ifFromEdit = this.$route.params.editAble;
            this.waterType = this.postData.moniType = temp.MONITORTYPE;
            if (temp.MONITORTYPE == "2") {
                this.getTips_up = "请输入水压上限";
                this.getTips_down = "请输入水压下限";
            } else if (temp.MONITORTYPE == "3") {
                this.getTips_up = "请输入水流上限";
                this.getTips_down = "请输入水流下限";
            }
            this.comeFrme_editID = temp.id;
            this.postData.isValid = temp.SUBISVALID;
            this.postData.name = temp.MONITORNAME;
            this.postData.dataCode = temp.DATACODE;
            this.postData.lgtd = temp.LGTD;
            this.postData.lttd = temp.LTTD;
            this.xy.lgtd_formate = this.formate_xy(temp.LGTD);
            this.xy.lttd_formate = this.formate_xy(temp.LTTD);
            this.postData.deviceCode = temp.DEVICECODE;
            this.postData.pipeCode = temp.PIPECODE;
            this.temp_offTime = temp.OFLINE;
            this.queryPointMonitor_point(temp.id, temp.MONITORTYPE);
        }

    }
}
</script>

<style lang="scss" scoped>
#addBase {
    width: 60%;
    margin: 0 auto;
    height: 100%;
    font-size: 14px;
    color: #333;
    padding: 10px;
    position: relative;

    i{
        color: red;
    }

    .top-head {
        width: 100%;

        .tips {
            width: 100%;
            height: 20px;
            display: flex;
            align-items: center;

            span.rect {
                display: inline-block;
                width: 14px;
                height: 14px;
                background: #d6fafa;
                font-weight: 600;
                margin-right: 10px;
            }
        }

        .subInputs {
            width: 100%;
            border-top: 1px solid #ccc;

            .row {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 50px; // padding: 10px 0;
                border-bottom: 1px solid #ccc;

                .col {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    width: 120px;
                    text-align: center;

                    &:nth-child(odd) {
                        background: #d6fafa;
                        line-height: 49px;
                    }

                    &.short {
                        width: 160px !important;
                    }

                    &:nth-child(even) {
                        width: calc(50% - 260px);
                    }

                    .el-input {
                        width: 80%;
                    }

                    .gisBtn {
                        display: inline-block;
                        padding: 10px 10px;
                        background: #0b83fe;
                        border-radius: 5px;
                        cursor: pointer;
                        color: #fff;
                        margin-left: 10px;
                    }

                    img {
                        width: 24px;
                    }
                }
            }
        }
    }

    .detectionItem {
        width: 100%;
        height: 50px;
        padding: 10px 0;

        span {
            line-height: 30px;
            display: inline-block;
            padding: 0 20px;
            background: #3c9a3e;
            color: #fff;
            border-radius: 5px;
            cursor: pointer;
        }
    }

    .detectionList {
        width: 100%;
        border: 1px solid #ccc;
        height: calc(100% - 230px);
        position: relative;

        &>.row {
            width: 100%;
            display: flex;
            justify-content: space-between;
            height: 30px;
            line-height: 30px;

            &.head {
                background: #e3edef;
                font-weight: 600;
                font-size: 16px;
            }

            .col {
                width: 25%;
                text-align: center;
                border-right: 1px solid #ccc; // border-bottom: 1px solid #ccc;

                &:last-child {
                    border-right: none;
                }
            }
        }

        .subContent {
            width: 100%;
            height: calc(100% - 160px);
            overflow-y: auto;

            .innerWrap {
                width: 100%;

                .row {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    line-height: 50px;

                    .col {
                        width: 25%;
                        text-align: center;
                        border-right: 1px solid #ccc;
                        border-bottom: 1px solid #ccc;

                        &:last-child {
                            border-right: none;
                        }

                        .el-input {
                            width: 80%;
                        }

                        span.delBtn {
                            display: inline-block;
                            padding: 0px 10px;
                            line-height: 30px;
                            background: #0b83fe;
                            border-radius: 5px;
                            color: #fff;
                            cursor: pointer;
                        }
                    }
                }
            }
        }

        .earlyWarning {
            width: 100%;

            .topTips {
                width: 100%;
                line-height: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                padding: 0 10px;

                .rect {
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    background: #3c9a3e;
                    margin-right: 10px;
                }
            }

            .row {
                width: 100%;
                display: flex;
                justify-content: space-between;

                .col {
                    width: 50%;
                    text-align: center;
                    line-height: 30px;

                    .el-input {
                        width: calc(100% - 80px);
                    }

                    &:first-child {
                        background: #d6fafa;
                    }
                }
            }
        }

        .actions {
            width: 100%;
            height: 60px;
            position: absolute;
            bottom: 0px;
            left: 0;
            background: #e3e3e3;
            display: flex;
            justify-content: center;
            align-items: center;

            span {
                display: inline-block;
                padding: 10px 20px;
                background: #0b83fe;
                border-radius: 5px;
                color: #fff;
                cursor: pointer;
                margin-right: 20px;
            }
        }
    }

    .getGisPositionModel {
        width: 50%;
        height: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -25%;
        margin-left: -25%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        border-radius: 10px;

        .tips {
            width: 100%;
            padding: 0 10px;
            height: 30px;
            background: #0b83fe;
            line-height: 30px;
            text-align: center;
            color: #fff;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            i {
                cursor: pointer;
            }
        }

        #gis {
            width: 100%;
            height: calc(100% - 30px);
        }
    }

    .select-items {
        width: 200px;
        position: absolute;
        min-height: 300px;
        left: 50%;
        top: 50%;
        margin-top: -150px;
        margin-left: -150px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        border-radius: 5px;
        background: #fff;

        .top-head {
            width: 100%;
            height: 20px;
            background: #0b83fe;
            line-height: 20px;
            color: #fff;
            text-align: center;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;

            i {
                cursor: pointer;
            }
        }

        .projects {
            width: 100%;
            max-height: 280px;
            overflow-y: auto;

            .item {
                width: 100%;

                .title {
                    width: 100%;
                    line-height: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 10px;

                    span.noWrap {
                        display: inline-block;
                        width: calc(100% - 20px);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    i {
                        transition: all 1s linear;
                        cursor: pointer;
                    }

                    i.rotate90 {
                        transform: rotate(-180deg);
                    }
                }

                .subContent {
                    width: 100%;
                    padding: 0 15px;
                    line-height: 25px;

                    .detail-item {
                        width: 100%;
                        display: flex;
                        align-items: center;

                        span:first-child {
                            display: inline-block;
                            width: 14px;
                            height: 14px;
                            border: 1px solid #ccc;
                            // border-radius: 14px;
                            margin-right: 10px;

                            &.actived {
                                background: url('../../assets/images/common/select.png') no-repeat;
                                background-size: 100% 100%;
                            }
                        }

                        span:last-child {
                            display: inline-block;
                            width: calc(100% - 20px);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                    }
                }
            }
        }
    }

    .shortInput {
        width: 100%;
        height: calc(100% - 240px);

        .topTips {
            width: 100%;
            height: 30px;
            display: flex;
            align-items: center;

            .rect {
                display: inline-block;
                width: 14px;
                height: 14px;
                background: #d6fafa;
                font-weight: 600;
                margin-right: 10px;
            }
        }

        .subContent {
            width: 100%;
            height: calc(100% - 30px);
            overflow-y: auto;
            display: flex;
            justify-content: space-between;

            // align-items: center;
            .col {
                width: calc(100% - 300px);

                &:last-child {
                    width: 300px;
                }

                .row {
                    width: 100%;
                    height: 60px;
                    line-height: 60px;
                    display: flex;
                    justify-content: space-between;

                    &>.col {

                        border-left: 1px solid #ccc;
                        border-top: 1px solid #ccc;

                        &:nth-child(odd) {
                            width: 100px;
                            text-align: center;
                            background: #d6fafa;
                            font-weight: 600;
                        }

                        &:nth-child(even) {
                            width: calc(100% - 100px);
                            display: flex;
                            justify-content: space-around;
                        }

                        .time-col {
                            width: 33.33%;
                            display: flex;
                            justify-content: space-around;

                            border-right: 1px solid #ccc;

                            .el-input--suffix {
                                width: 80%;
                            }

                            .el-date-editor {
                                width: 44%;
                            }
                        }

                    }

                    &:last-child {
                        .col {
                            border-bottom: 1px solid #ccc;
                        }
                    }
                }

                .heightRow {
                    width: 100%;
                    height: 180px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .col {
                        height: 100%;
                        line-height: 180px;
                        text-align: center;

                        &:first-child {
                            width: 100px;
                            background: #d6fafa;
                            font-weight: 600;
                        }

                        &:last-child {
                            width: calc(100% - 100px);
                        }

                        .el-input {
                            width: 80%;
                        }
                    }
                }
            }
        }

        .footers {
            width: 100%;
            padding: 10px 0;
            display: flex;
            justify-content: center;
            background: #e3e3e3;
            border-radius: 10px;

            span {
                display: inline-block;
                padding: 0px 20px;
                line-height: 40px;
                background: #0b83fe;
                cursor: pointer;
                margin-right: 20px;
                border-radius: 5px;
                color: #fff;
            }
        }

    }

}
</style>
