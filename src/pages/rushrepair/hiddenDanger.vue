<template>
<div id="hiddenDanger">
    <div class="topHead">
        <div class="search">
            <span>从:</span>
            <el-date-picker v-model="startTime" type="date" placeholder="选择日期" @change="getStartTime">
            </el-date-picker>
            <span>到:</span>
            <el-date-picker v-model="endTime" type="date" placeholder="选择日期" @change="getEndTime">
            </el-date-picker>
             <span>类型:</span>
            <el-select v-model="problemType_item" placeholder="请选择" @change="getPro_Type">
                <el-option v-for="item in problem_type" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <span>状态:</span>
            <el-select v-model="status" placeholder="请选择" @change="getType">
                <el-option v-for="item in orders" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="descContent" placeholder="描述内容" clearable></el-input>
            <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div class="actions">
            <!-- <el-button :class="{ifAdd:addFlag===true}" type="primary" icon="el-icon-plus" @click="openAddModel">新增</el-button> -->
            <span class="add" :class="{ifAdd:addFlag===true}" @click="openAddModel">
               <i class="el-icon-plus"></i> 新增
            </span>
        </div>
    </div>
    <div class="table">
        <table>
            <thead>
                <tr>
                    <th class="sm"><span>序号</span></th>
                    <th class="md"><span>上报时间</span></th>
                    <th class="md"><span>来源</span></th>
                    <th class="md"><span>类型</span></th>
                    <th class="sm"><span>上报人</span></th>
                    <th class="sm"><span>状态</span></th>
                    <th><span>描述</span></th>
                    <th class="sm"><span>详情</span></th>
                    <th class="actions"><span>操作</span></th>
                </tr>
            </thead>
            <tbody>
                <template v-if="tableList.length>0">
                    <tr v-for="(item,index) in tableList" :key="index">
                        <td class="sm"><span>{{index + 1}}</span></td>
                        <td class="md"><span>{{item.reportTime}}</span></td>
                        <td class="md"><span>{{item.reportType}}</span></td>
                        <td class="md"><span>{{item.probType| trans_probType}}</span></td>
                        <td class="sm"><span>{{item.createUser}}</span></td>
                        <td class="sm">
                            <template v-if="item.probStatus =='0'">
                                <span class="noChecked" :class="{ifChecked:checkFlag===true}" @click="re_status(index,item.id)">未核实</span>
                            </template>
                            <template v-if="item.probStatus =='1'">
                                <span class="checked">已核实</span>
                            </template>
                            <template v-if="item.probStatus =='2'">
                                <span class="ordered">已派单</span>
                            </template>
                            <template v-if="item.probStatus =='3'">
                                <span class="doing">处理中</span>
                            </template>
                            <template v-if="item.probStatus =='4'">
                                <span class="down">已处理</span>
                            </template>
                        </td>
                        <td :title="item.proDescrip"><span class="longText">{{item.proDescrip}}</span></td>
                        <td class="sm border" @click="getDetail(item)"><span>详情</span></td>
                        <td class="actions" :class="{ifRepair:repairFlag===true}" @click="gotoForm(item,item.id,item.probStatus)">
                            <template v-if="item.probStatus=='0'">
                                <span class="gray">检修</span>
                            </template>
                            <template v-else-if="item.probStatus=='1'">
                                <span class="canEdit">新增派单</span>
                            </template>
                            <template v-else>
                                <span class="onlyRead">查看</span>
                            </template>
                        </td>
                    </tr>
                </template>

            </tbody>
        </table>
    </div>
    <div class="pagination">
        <el-pagination background layout="prev, pager, next" :total="totalPage" @current-change="handleCurrentPage" @prev-click="handlePrev" @next-click="handleNext">
        </el-pagination>
    </div>
    <add-model :showEditModel="toggleShowAdd"  :height_="'462px'" :title="'新增'" @hiddenSelf="hiddenAddModel" @saveUper="saveAddInputs">
        <div class="addContent">
            <div class="row">
                <div class="col">
                    <span>发生地点:</span>
                    <el-input placeholder="请输入内容" v-model="add_post.place" clearable>
                    </el-input>
                </div>
                <div class="col">
                    <span>隐患名字:</span>
                    <el-input placeholder="请输入内容" v-model="add_post.probName" clearable>
                    </el-input>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <span>获取点信息:</span>
                    <span class="getIntoMap" @click="getIntoMap">点击</span>
                    <span class="positions">经度:{{add_post.lgtd?(add_post.lgtd).toFixed(5):""}},纬度:{{add_post.lttd?(add_post.lttd).toFixed(5):""}}</span>
                </div>
                <div class="col">
                    <span>管道名称:</span>
                    <span class="leftAlign" :title="pipeName">{{pipeName}}</span>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <span>隐患类型:</span>
                    <el-select v-model="add_post.proInfoType" placeholder="请选择" @change="getType">
                        <el-option v-for="item in descType " :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="col">
                    <span>紧急程度:</span>
                    <el-select v-model="add_post.probLevel" placeholder="请选择">
                        <el-option v-for="item in lev " :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="row desc">
                <span>隐患描述:</span>
                <div class="edit-text">
                    <textarea v-model="add_post.descrip" @keyup="getStrNum($event)"></textarea>
                    <span class="btR">{{strNum}}/400</span>
                </div>
            </div>
            <div class="row showImgs">
                <span>现场照片:</span>
                <div class="imgs">
                    <div class="uploadImg">
                        <div><i class="iconfont icon-paizhao"></i></div>
                        <div>上传图片</div>
                        <input type="file" accept=".jpg,.png" @change="getFile($event)">
                        </div>
                        <div class="imgItem">
                            <img :src="addModel.urls" alt="">
                        </div>
                        </div>
                    </div>
                </div>
    </add-model>
    <desc-model :showViewModel="showDesc" :title="'详情'" @hiddenSelf="colseDescModel">
        <div class="subContent">
            <div class="descText">
                <div class="row">
                    <div class="col">
                        <span>隐患地点:</span>
                        <span class="overHiden" :title="desc_content.place">{{desc_content.place}}</span>
                    </div>
                    <div class="col">
                        <span>上报时间:</span>
                        <span>{{desc_content.reportTime}}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <span>隐患名称:</span>
                        <span class="overHiden" :title="desc_content.probName">{{desc_content.probName}}</span>
                    </div>
                    <div class="col">
                        <span>隐患类型:</span>
                        <span>{{desc_content.proInfoType | formateRepairType}}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <span>巡检人:</span>
                        <span>{{desc_content.createUser}}</span>
                    </div>
                    <div class="col">
                        <span>紧急程度:</span>
                        <span>{{desc_content.probLevel | formate_lev}}</span>
                    </div>
                </div>
                <div class="long-text">
                    <div class="col ">
                        <span>隐患描述:</span>
                    </div>
                    <div class="col ">
                        <span>{{desc_content.proDescrip}}</span>
                    </div>
                </div>
            </div>
            <div class="live-pics">
                <div class="tips"><span>现场照片</span></div>
                <div class="imgs">
                    <img :src="filePath+''+val.filePath" v-for="(val,i) in desc_content.file" :key="i"/>
                    </div>

                </div>
            </div>
    </desc-model>
    <div class="gisModel" id="gis" v-if="showGisModel">
        <i class="el-icon-error" @click="closeGisModel"></i>
    </div>
    <select-table :closedModel_flag="showSelect_model_flag" @closeModel="close_selectModel" @configSelect="configTable"></select-table>
</div>
</template>

<script>
import AddModel from '@/common/components/poupe/edit';
import selectTable from "@/common/components/select_into_table"

import {
    GetDate
} from "@/common/utils/getDate"
import {
    getInspectData,
    addDanger,
    updateDangerStatus
} from "@/api/rushrepair/hiddenDanger"
import {
    getWorkorderDetail
} from "@/api/rushrepair/workOrder"
import descModel from "@/common/components/poupe/view"
import TransformTime from "@/common/utils/utc_str_timeTrs"
import * as esriLoader from "esri-loader";

esriLoader.loadCss(dse.arcgis_mainCss);
let startJs = dse.arcgis_startJS;
const options = {
    url: startJs,
    dojoConfig: dse.gisConfig
};
let pipeUrl = dse.arcgis_belowMap;

let drawProblemPoint = null; //挂载画点的函数
let domainURL = dse.baseURL;

// 二维管网相关.
import popupUtils from '@/common/utils/popupUtils';
//管网图层配置
import gw2dConfig from '@/common/config/gis2d/gw2dConfig';
import layerUtils from '@/common/utils/layerUtils';
import Arcgis_mkt_jwd from "@/common/utils/arcgis_mkt_jwd"

export default {
    components: {
        AddModel,
        descModel,
        selectTable
    },
    data() {
        return {
            addFlag: false, //新增的按钮权限控制
            checkFlag: false, //核实的按钮权限控制
            repairFlag: false, //检修的按钮权限控制

            view: null, //gis 视图的实例
            map: null, //gis 地图类型的实例
            toggleShowAdd: false, //新增窗口的开关
            showGisModel: false, //显示gis地图的弹窗
            startTime: "",
            endTime: "",
            tableList: [],
            filePath: "", //静态文件路径
            orders: [ //派单状态
                {
                    label: "全部",
                    value: "",
                },
                {
                    label: "未核实",
                    value: "0"
                },
                {
                    label: "已核实",
                    value: "1"
                },
                {
                    label: "已派单",
                    value: "2"
                },
                {
                    label: "处理中",
                    value: "3"
                },
                {
                    label: "已处理",
                    value: "4"
                }
            ],
            status: "", //选择的派单
            descContent: "", //模糊查询描述
            lev: [],  //紧急程度
            descType: [], // 检修类型
            addModel: {
                address: "",
                time: "",
                repoter: "",
                tel: "",
                check: "",
                desc: "",
                urls: ''
            },
            totalPage: 1,
            showDesc: false,
            desc_content: {
                createUser: null,
                file: [],
                hasFile: "",
                id: "",
                phone: null,
                place: "",
                proDescrip: "",
                probLevel: "",
                probName: "",
                probStatus: "",
                probType: "",
                reportTime: "",
                reportType: ""
            }, //详情弹窗
            pipeName: "", //管道名称
            strNum: 0, //文本域中的字数
            add_post: {
                place: "", //发生地点
                probStatus: "0", //问题状态
                probLevel: "", // 紧急程度
                pipeCode: "", // 管道ID
                lgtd: "", //经度
                lttd: "", //纬度
                deviceName: "", //设备名称
                deviceCode: "", // 设备编号
                probName: "", //隐患名字
                proInfoType: "", //问题类型
                descrip: "", //隐患描述
                files: null, //文件
                reportType: "系统上报",
                probType: "1",
                planId: ""
            },
            showSelect_model_flag: false, //管网抢修 选择进入 标准工单 或者原用工单 弹窗
            gotoDetail_id: null, // 管网抢修进入详情页的id
            editStatus: false, //进入详情工单，默认不可编辑
            problem_type:[
                {
                    label:"全部",
                    value:""
                },
                 {
                    label:"隐患",
                    value:"1"
                },
                {
                    label:"其他",
                    value:"4"
                }
            ], //问题类型
            problemType_item:"", //问题类型  搜索用
        };
    },
    methods: {
        createMap(position) {
            let that = this;
            esriLoader
                .loadModules(
                    [
                        "dojo/on",
                        "esri/Map",
                        "esri/views/MapView",
                        "esri/layers/FeatureLayer",
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
                            // basemap: "osm",
                        });

                        let baseMapUtils = new BaseMapUtils({
                            map: that.map,
                            mapType: '2'
                        });

                        //

                        //debugger;
                        baseMapUtils.loadBaseLayers(dse.baseMapLayers);

                        // 管网图层.
                        let pipeUrl = that.$store.getters.get_pipe_defaultLayer
                        gw2dConfig.url = pipeUrl;
                        gw2dConfig.popupTemplate.visible = false;
                        that.layer1 = layerUtils.loadData(that.map, gw2dConfig);

                        // 查询临时显示图层.
                        let tempLayer = new GraphicsLayer({
                            id: '_temp_query_'
                        });
                        this.map.add(tempLayer);
                        //高亮符号.
                        let highlightSymbol = {
                            type: "simple-line",
                            color: "#FFFF37",
                            width: 4
                        };

                        that.view = new MapView({
                            container: "gis",
                            map: that.map,
                            zoom: 17,
                            center: position,
                            highlightOptions: {
                                color: [255, 255, 0, 1],
                                haloOpacity: 0.9,
                                fillOpacity: 0.2
                            }
                        });

                        function getMinDis_xfs(geometry_, sourceGeo) {
                            tempLayer.removeAll();
                            let temp_geometry = JSON.parse(JSON.stringify(geometry_));
                            let temp_rings = temp_geometry.rings[0];
                            let temp_arr = [];
                            for (let i = 0; i < temp_rings.length; i++) {
                                temp_arr.push(
                                    new Arcgis_mkt_jwd(temp_rings[i]).mercator2lonlat()
                                )
                            }
                            temp_geometry.rings = [temp_arr];
                            temp_geometry.type = "polygon";
                            temp_geometry.spatialReference = {
                                wkid: 4326
                            };

                            let queryTask = new QueryTask({
                                url: pipeUrl
                            });
                            let query = new Query();
                            query.returnGeometry = true;
                            query.outFields = ["*"];
                            query.geometry = temp_geometry;
                            query.outSpatialReference = that.view.spatialReference;
                            query.spatialRelationship = "index-intersects";

                            let nearestFeature = null;
                            let nearestDistance = 0;
                            queryTask.execute(query).then(function (results) {
                                let features = results.features;
                                features.forEach((feature, index) => {

                                    let distance = geometryEngine.distance(sourceGeo, feature.geometry, 'meters');
                                    if (index > 0) {
                                        if (distance < nearestDistance) {
                                            nearestDistance = distance;
                                            nearestFeature = feature;
                                        }
                                    } else {
                                        nearestFeature = feature;
                                        nearestDistance = distance;
                                    }
                                });
                                nearestFeature.symbol = highlightSymbol;
                                tempLayer.add(nearestFeature);
        
                                that.pipeName = nearestFeature.attributes['PIPELINE_NAME'];
                                that.add_post.pipeCode = nearestFeature.attributes["ID"];
                               
                            });
                           
                        }

                        function createPointGraphic(coordinates) {
                            let jwds = new Arcgis_mkt_jwd(coordinates).mercator2lonlat();
                            that.add_post.lgtd = jwds[0];
                            that.add_post.lttd = jwds[1]
                            
                            that.view.graphics.removeAll();
                            let point = {
                                type: "point",
                                x: coordinates[0],
                                y: coordinates[1],
                                spatialReference: that.view.spatialReference
                            };
                            let graphic = new Graphic({
                                geometry: point,
                                symbol: {
                                    type: "picture-marker", // autocasts as new PictureMarkerSymbol()
                                    url: "" + domainURL + "/static/gis_temporary_pic/normal_bigUser.png",
                                    width: "45px",
                                    height: "62px"
                                }
                            });
                            let temp_geometry = graphic.geometry;
                            let wellBuffer = geometryEngine.geodesicBuffer(temp_geometry, 120, "meters", true);

                            that.view.graphics.add(graphic);
                            let graphic_circle = new Graphic({
                                geometry: wellBuffer,
                                symbol: new SimpleFillSymbol({
                                    color: [236, 229, 185, 0.4],
                                    outline: "none"
                                }),
                            });
                            // that.view.graphics.removeAll();
                            that.view.graphics.add(graphic_circle);
                            getMinDis_xfs(wellBuffer, point);
                        }

                        drawProblemPoint = function () {
                            let drawPoint = new Draw({
                                view: that.view
                            })
                            let action = drawPoint.create("point");
                            // action.on("cursor-update", function (evt) {
                            //     createPointGraphic(evt.coordinates);
                            // });
                            action.on("draw-complete", function (evt) {
                                createPointGraphic(evt.coordinates);
                            });
                        }

                        that.view.on("click", function (event) {
                            drawProblemPoint();
                        });

                    }
                );
        },
        hiddenAddModel(val) {
            this.toggleShowAdd = val
            this.showGisModel = false;
        },
        saveAddInputs() {
            let that = this;
            if (that.add_post.descrip.length > 400) {
                this.$message.error("您输入的字数过多!")
                return
            }

            if (that.add_post.place == "" || that.add_post.probStatus == "" || that.add_post.probLevel == "" || that.add_post.pipeCode == "" || that.add_post.lgtd == "" || that.add_post.lttd == "" || that.add_post.probName == "" || that.add_post.descrip == "" || that.add_post.reportType == "" || that.add_post.probType == "") {
                that.$message.error("您输入的内容不全");
                return
            }
            if(!that.add_post.proInfoType){
                that.$message.error("请选择隐患类型!");
                return
            }
            if (that.add_post.files == []) {
                that.$message.error("至少需要上传一张图片!");
                return
            }
            

            let formdata = new FormData();
            formdata.append("place", that.add_post.place)
            formdata.append("probStatus", that.add_post.probStatus)
            formdata.append("probLevel", that.add_post.probLevel)
            formdata.append("pipeCode", that.add_post.pipeCode)
            formdata.append("lgtd", that.add_post.lgtd)
            formdata.append("lttd", that.add_post.lttd)
            formdata.append("deviceName", that.add_post.deviceName)
            formdata.append("deviceCode", that.add_post.deviceCode)
            formdata.append("probName", that.add_post.probName)
            formdata.append("proInfoType", that.add_post.proInfoType)
            formdata.append("descrip", that.add_post.descrip)
            formdata.append("files", that.add_post.files)
            formdata.append("reportType", that.add_post.reportType)
            formdata.append("probType", that.add_post.probType)
            formdata.append("planId", that.add_post.planId)
            addDanger(formdata).then(res => {
                if (res.status == 1) {
                    that.toggleShowAdd = false;
                    that.$message.success("保存成功!")
                    that.add_post = {
                        place: "", 
                        probStatus: "0", 
                        probLevel: "", 
                        pipeCode: "", 
                        lgtd: "", 
                        lttd: "", 
                        deviceName: "", 
                        deviceCode: "", 
                        probName: "", 
                        proInfoType: "", 
                        descrip: "", 
                        files: null, 
                        reportType: "系统上报",
                        probType: "1",
                        planId: ""
                    }
                    that.getList("1");
                } else {
                    that.$message.error("保存失败!")
                }
            })
        },
        openAddModel() {
            let flag = this.addFlag
            if (!flag) {
                return
            }
            this.add_post ={
                place: "", //发生地点
                probStatus: "0", //问题状态
                probLevel: "", // 紧急程度
                pipeCode: "", // 管道ID
                lgtd: "", //经度
                lttd: "", //纬度
                deviceName: "", //设备名称
                deviceCode: "", // 设备编号
                probName: "", //隐患名字
                proInfoType: "", //问题类型
                descrip: "", //隐患描述
                files: null, //文件
                reportType: "系统上报",
                probType: "1",
                planId: ""
            }
            this.pipeName = ''
            this.addModel.urls = ''

            this.toggleShowAdd = true;
        },
        getFile(even) {
            let that = this
            let file = even.target.files[0];
            let temp_fileName = file.name;
            let temp_fileName_arr = temp_fileName.split(".");
            if (temp_fileName_arr[temp_fileName_arr.length - 1] != "png" && temp_fileName_arr[temp_fileName_arr.length - 1] != "jpg") {
                that.$message.error("您上传的文件格式应该为：png、jpg");
                return
            }
            that.add_post.files = file;
            if (!even || !window.FileReader) return // 看支持不支持FileReader
            let reader = new FileReader()
            reader.readAsDataURL(file) // 这里是最关键的一步，转换就在这里
            reader.onloadend = function (res) {
                that.addModel.urls = res.target.result;
            }
        },
        getStrNum(e) {
            let temp_str = e.target.value;
            let strLen = temp_str.length;
            if (strLen > 400) {
                this.$message.error("您输入的字数过多!")
                return
            }
            this.strNum = strLen;
        },
        getList(page) {
            let that = this;
            let temp_startTime = that.startTime || "";
            let temp_endTime = that.endTime || "";
            let temp_status = that.status;
            let temp_descContent = that.descContent;

            let temp_startDate = new Date(temp_startTime);
            let temp_endTimeDate = new Date(temp_endTime);
            if (temp_endTimeDate < temp_startDate) {
                that.$message.error("开始时间不能大于结束时间!")
                return
            }
            let temp_probType = this.problemType_item
            getInspectData({
                id: "",
                startTime: "" + temp_startTime,
                endTime: "" + temp_endTime,
                name: "" + temp_descContent,
                type: ""+temp_probType,
                page: "" + page,
                pageSize: "10",
                status: "" + temp_status
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
                            dse.baseURL
                            }?id=${id}`;
                    return;
                } else if (res.msg == "操作失败") {
                    that.$message.error("服务错误!");
                    return;
                }

                if (res.status == 1 && res.data) {
                    let data = res.data;
                    let {
                        hiddenAndOtherData
                    } = res.data;
                    that.tableList = hiddenAndOtherData.rows || [];
                    that.totalPage = hiddenAndOtherData.total
                }

            }).catch(function (error) {
               console.log(error)
            });

        },
        handleCurrentPage(pageNum) {
            this.getList(pageNum);
        },
        handlePrev(pageNum) {
            this.getList(pageNum);
        },
        handleNext(pageNum) {
            this.getList(pageNum);
        },
        getStartTime(val) {
            this.startTime = new TransformTime(val).format_yymmdd();
        },
        getEndTime(val) {
            this.endTime = new TransformTime(val).format_yymmdd();
        },
        getType(val) {
            this.status = val;
        },
        search() {
            this.getList("1");
        },
        getDetail(item) {
            this.desc_content = item;
            this.showDesc = true;
        },
        gotoForm(item, id, flag) {
            let that = this;
            let flag_ = this.repairFlag
            if (!flag_) {
                return
            }

            if (flag == '0') {
                return
            }
            this.gotoDetail_id = id;
            if (item.probStatus == "0") {
                this.$message.warning("请重置状态！")
                return
            } else if (item.probStatus == "1") {
                this.editStatus = true
                // this.showSelect_model_flag = true;
                sessionStorage.setItem("hiddenDanger", JSON.stringify(item));

                 this.$router.push({
                    name: "pipe_rushrepair_form",
                    params: {
                        id: "" + id,
                        editFlag: "" +  that.editStatus 
                    }
                });
                this.$store.commit("setAside_status", false);
                this.$emit("hiddenAside");
                return
            }
            if (flag == "2" || flag == "3" || flag == "4") {
                getWorkorderDetail({
                    id: "",
                    questionId: "" + id
                }).then(res => {
                    let temp_type = parseInt(res.data.type);
                    let temp_editStatus = that.editStatus
                    if(flag!=='0'||flag!=="1"){
                        temp_editStatus = "false"
                        sessionStorage.setItem("dispatchFlag",'flase')
                    }
                    that.$router.push({
                        name: "pipe_rushrepair_form",
                        params: {
                            id: "" + id,
                            editFlag: "" + temp_editStatus,
                            tableType: temp_type
                        }
                    });
                    that.$store.commit("setAside_status", false);
                    that.$emit("hiddenAside");
                    sessionStorage.setItem("hiddenDanger", JSON.stringify(res.data));
                })
            }

        },
        colseDescModel(val) {
            this.showDesc = false;
        },
        getIntoMap() {
            this.showGisModel = true;
            let position = this.$store.getters.get_cityPosition
            setTimeout(() => {
                this.createMap(position);
            }, 1000)
        },
        close_selectModel(val) {
            this.showSelect_model_flag = false;
        },
        configTable(val) {
            let temp_id = this.gotoDetail_id;
            let temp_editStatus = this.editStatus
            this.$router.push({
                name: "pipe_rushrepair_form",
                params: {
                    id: "" + temp_id,
                    editFlag: "" + temp_editStatus,
                    tableType: val
                }
            });
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
        },
        closeGisModel() {
            this.showGisModel = false;
        },
        re_status(index, id) {
            let that = this;

            let flag = this.checkFlag
            if (!flag) {
                return
            }

            updateDangerStatus({
                id: "" + id
            }).then(res => {
                if (res.status == 1) {
                    that.$message.success("核实成功!")
                    that.tableList[index].probStatus = "1"
                } else {
                    that.$message.error("核实失败!")
                }
            })
        },
        getType(val){
            this.add_post.proInfoType = val;
        },
        getPro_Type(val){
            this.problemType_item = val;
        }
    },
    filters: {
        formateRepairType(val) {
            let temp = ''
            let list = dse.problem_type;
            for(let i =0;i<list.length;i++){
                if(list[i].value===val){
                    temp = list[i].label
                }
            }

            return temp;
        },
        formate_lev(val) {
            let temp = ''
            let list = dse.dangerlist;
            for(let i =0;i<list.length;i++){
                if(list[i].value===val){
                    temp = list[i].label
                }
            }
            
            return temp;
        },
        trans_probType(val){
            let temp = '';
            if(val==="1"){
                temp = "隐患"
            }else{
                temp = "其它"
            }
            return temp
        }
    },
    created() {
        let that = this
        // let data = new GetDate().getDate();
        that.addFlag = (that.$store.getters.get_pages_btn_allow).hiddenDanger.add;
        that.checkFlag = (that.$store.getters.get_pages_btn_allow).hiddenDanger.checked;
        that.repairFlag = (that.$store.getters.get_pages_btn_allow).hiddenDanger.repair;
        
        this.lev = dse.dangerlist
        this.descType = dse.problem_type

        this.getList("1");
        this.filePath = this.$store.getters.get_filePath;
    }
};
</script>

<style lang="scss" scoped>
// @import "../../../static/pipeFont/repair/iconfont.css";
#hiddenDanger {
    width: 100%;
    height: 100%;
    padding: 10px;
    font-size: 14px;
    color: #333;
    background: #ebebeb;
    position: relative;

    .gisModel {
        width: 600px;
        height: 500px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -250px;
        margin-left: -300px;
        background: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        z-index: 100;

        i {
            position: absolute;
            right: 5px;
            top: 5px;
            cursor: pointer;

            &:hover {
                color: #fff;
            }
        }
    }

    .addContent {
        width: 100%;
        height: 100%;
        overflow-y: auto;

        .row {
            width: 100%;
            display: flex;
            justify-content: space-between;

            .col {
                width: 50%;
                padding-right: 20px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 5px;

                span {
                    display: inline-block;
                    width: 80px;
                    text-align: right;
                    margin-right: 20px;
                    line-height: 35px;
                }

                .el-input {
                    width: calc(100% - 100px);
                }
                .positions{
                    display: inline-block;
                    width: 210px;
                }
                span.leftAlign{
                    width: calc(100% - 100px);
                    height: 35px;
                    line-height: 35px;
                    margin-right: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-align: left;
                }

                span.getIntoMap {
                    width: 60px;
                    background: #0b83fe;
                    border-radius: 5px;
                    cursor: pointer;
                    color: #fff;
                    margin-right: 0;
                    text-align: center;
                    line-height: 30px;
                }
            }

            &.ifCheck {
                width: 100%;
                height: 40px;
                line-height: 40px;
                margin-bottom: 10px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                background: #e7e9e8;
                padding-left: 10px;
                border-radius: 5px;

                span {
                    display: inline-block;
                    width: 100px;
                    margin-right: 20px;
                }
            }

            &.desc {
                width: 100%;
                height: 100px;
                margin-bottom: 10px;

                &>span {
                    display: inline-block;
                    width: 80px;
                    margin-right: 20px;
                    text-align: right;
                }

                .edit-text {
                    width: calc(100% - 80px);
                    position: relative;

                    textarea {
                        width: 100%;
                        height: 100%;
                        resize: none;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }

                    .btR {
                        position: absolute;
                        bottom: 10px;
                        right: 10px;
                    }
                }
            }

            &.showImgs {
                width: 100%;
                height: 90px;

                &>span {
                    display: inline-block;
                    width: 80px;
                    margin-right: 20px;
                    text-align: right;
                }

                .imgs {
                    width: calc(100% - 80px);
                    height: 100%;
                    display: flex; // flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;

                    .uploadImg {
                        width: 80px;
                        height: 80%;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        position: relative;
                        padding-top: 10px; // display: flex;
                        margin-right: 10px;
                        text-align: center;
                        color: #017eff;
                        cursor: pointer;

                        input {
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top: 0;
                            left: 0;
                            opacity: 0;
                            cursor: pointer;
                        }

                        i {
                            font-size: 40px;
                        }
                    }

                    .imgItem {
                        width: calc(100% - 80px);
                        height: 80%;
                        display: flex;
                        justify-content: flex-start;
                        overflow-x: auto;

                        img {
                            display: block;
                            width: 70px;
                            height: 70px;
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
    }

    .subContent {
        width: 100%;
        padding: 20px 20px;

        .descText {
            width: 100%;
            // height: 160px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;

            &>div.row {
                width: 100%;
                height: 25%;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #ccc;
                border-right: 1px solid #ccc;
                border-left: 1px solid #ccc;
                &:first-child{
                    border-top: 1px  solid #ccc;
                }
                .col {
                    width: 50%;
                    line-height: 40px;
                    display: flex;
                    align-items: center;
                    
                    span:first-child {
                        display: inline-block;
                        width: 120px;
                        text-align: center;
                        background: #D6FAFA;
                        // color: #fff;
                        font-weight: 600; 
                    }
                    span:last-child{
                        display: inline-block;
                        margin-left: 10px;
                    }
                    span.overHiden{
                        display: inline-block;
                        // padding-left: 10px;
                        width: calc(100% - 135px);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                }
            }

            .long-text {
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                // min-height: 40px;
                // max-height: 100px;
                // overflow-y: auto;

                .col:first-child {
                    width: 100px;
                    font-weight: 600;
                    line-height: 40px;
                }

                .col:last-child {
                    width: calc(100% - 100px);
                    min-height: 100px;
                    max-height: 180px;
                    overflow-y: auto;
					line-height: 40px;
                    span {
                        font-weight: 400;
                        word-break: break-all;
                        line-height: 16px;
                    }
                }
            }
        }

        .live-pics {
            width: 100%;
            height: 100px;

            .tips {
                width: 100%;
                line-height: 30px;
                height: 30px;
                font-weight: 600;
            }

            .imgs {
                width: 100%;
                height: calc(100% - 30px);
                display: flex;
                align-items: center;
                justify-content: space-around;

                img {
                    display: block;
                    width: 20%;
                    height: 80%;
                }
            }
        }

    }

    .topHead {
        width: 100%;
        height: 30px;
        line-height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .el-date-editor--date {
            margin-right: 10px;
        }

        span {
            display: inline-block;
            margin-right: 10px;
        }

        .el-input {
            width: 200px;
        }

        span.add{
            display: inline-block;
            // padding: 3px 10px;
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
            border-radius: 5px;
            background: gray;
            cursor: not-allowed;
            color: #fff;
            &.ifAdd{
                background: #0b83fe;
                cursor: pointer;
            }
        }
    }

    .table {
        width: 100%;
        height: calc(100% - 100px);
        overflow-y: auto;
        background: #fff;
        margin-bottom: 20px;
        table-layout: fixed;
        word-break: break-all;
        word-wrap: break-word;

        table {
            width: 100%;
            border-spacing: 0;
            text-align: center;
            border: 1px solid #ccc;
            border-bottom: none;

            thead,
            tbody {
                width: 100%;
            }

            thead {
                tr {
                    background: #e3edef;
                }
            }

            tr {
                width: 100%;

                td {
                    // line-height: 30px;
                    border-right: 1px solid #ccc;
                    border-bottom: 1px solid #ccc;

                    span {
                        display: inline-block;
                        line-height: 40px;
                    }

                    &:last-child {
                        border-right: none;
                    }

                    &.sm {
                        width: 80px;

                        &.border {
                            span {
                                font-size: 12px;
                                display: inline-block;
                                padding: 0px 10px;
                                line-height: 20px;
                                border: 1px solid #0b83fe;
                                color: #0b83fe;
                                cursor: pointer;
                                border-radius: 5px;
                            }
                        }

                        span.noChecked {
                            display: inline-block;
                            padding: 0px 5px;
                            line-height: 25px;
                            border-radius: 5px;

                            color: gray;
                            border:  1px solid gray;
                            cursor: not-allowed;
                            &.ifChecked {
                                color: #0b83fe;
                                border: 1px solid #0b83fe;
                                cursor: pointer;
                            }
                        }

                        span.checked {
                            display: inline-block;
                            padding: 0px 5px;
                            line-height: 25px;
                            border-radius: 5px;
                            color: #00bd12;
                        }

                        span.ordered {
                            display: inline-block;
                            padding: 0px 5px;
                            line-height: 25px;
                            border-radius: 5px;
                            color: #FF2C50;
                        }

                        span.doing {
                            display: inline-block;
                            padding: 0px 5px;
                            line-height: 25px;
                            border-radius: 5px;
                            color: #16BFB1;
                        }

                        span.down {
                            display: inline-block;
                            padding: 0px 5px;
                            line-height: 25px;
                            border-radius: 5px;
                            color: #F5971E;
                        }
                    }

                    &.md {
                        width: 160px;
                    }

                    &.actions {
                        width: 200px;

                        span {
                            font-size: 12px;
                            display: inline-block;
                            padding: 0px 10px;
                            line-height: 20px;
                            border: 1px solid gray;
                            color: #fff;
                            cursor: not-allowed;
                            border-radius: 5px;
                        }
                        &.ifRepair {
                            span.gray {
                                color: #ccc;
                                border: 1px solid #7a7c85;
                                cursor: not-allowed;
                            }
                            span.canEdit {
                                border: 1px solid #0b83fe;
                                color: #fff;
                                // background: #00bd12;
                                border: 1px solid #0b83fe;
                                color: #0b83fe;
                                cursor: pointer;
                            }

                            span.onlyRead {
                                border: 1px solid #0b83fe;
                                color: #0b83fe;
                                cursor: pointer;
                            }
                        }
                    }

                    span.longText {
                        width: 100%;
                        padding: 0 10px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }

                th {
                    line-height: 30px;
                    border-right: 1px solid #ccc;
                    border-bottom: 1px solid #ccc;

                    &:last-child {
                        border-right: none;
                    }

                    &.sm {
                        width: 80px;
                    }

                    &.md {
                        width: 160px;
                    }

                    &.actions {
                        width: 200px;
                    }
                }
            }
        }
    }

    .pagination {
        width: 100%;
        display: flex;
        justify-content: center;
    }

}
</style>
