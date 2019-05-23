<template>
<div id="pipeFrame">
    <div class="main">
        <div class="tabs">
            <div class="tab-item" :class="{actived:index==editOrShow.ModelTab_item}" @click="showThisTab(index)" v-for="(item,index) in editOrShow.ModelTabs" :key="index">
                <span>{{item.name}}</span>
            </div>
        </div>
        <template v-if="showEdit==true">
            <div class="subContent" :class="{bgHeight:editAdd_flag===false}">
                <template v-if="ownList&&editOrShow.editStatus==true">
                    <table>
                        <!-- <tr>
                            <td>
                                <i class="el-icon-star-on"></i>
                                <span>管道名称</span>
                            </td>
                            <td>
                                <el-input clearable type="text" placeholder="管道名称" v-model="editOrShow.inputs.pipeName"></el-input>
                            </td>
                        </tr> -->
                        <tr>
                            <td>
                                <i class="el-icon-star-on"></i>
                                <span>所属管线名称</span>
                            </td>
                            <td>
                                <el-input clearable type="text" placeholder="所属管线名称" v-model="editOrShow.inputs.pipelineName"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i class="el-icon-star-on"></i>
                                <span>安装时间</span>
                            </td>
                            <td class="bg">
                                <span class="bg-calander"></span>
                                <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="editOrShow.inputs.installTime" type="datetime" placeholder="选择日期">
                                </el-date-picker>
                            </td>
                        </tr>
                            <tr>
                                <td>
                                    <i class="el-icon-star-on"></i>
                                    <span>所属区域</span>
                                </td>
                                <td>
                                    <el-select v-model="editOrShow.inputs.areaId" placeholder="请选择">
                                        <el-option v-for="item in areaLists" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </td>
                            </tr>
                        <tr>
                            <td>
                                <span>管材</span>
                            </td>
                            <td>

                                <el-select v-model="editOrShow.inputs.pipeMaterial" placeholder="请选择" @change="getMaterialName">
                                    <el-option v-for="item in pipeMaterials" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>管径(mm)</span>
                            </td>
                            <td>
                                <el-select v-model="editOrShow.inputs.pipeRadius" placeholder="请选择" @change="getRadiusName">
                                    <el-option v-for="item in pipeRadius" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>管长(m)</span>
                            </td>
                            <td>
                                <el-input clearable type="text" placeholder="管长" v-model="editOrShow.inputs.pipeLength" @change="verify_float($event,'pipeLength')"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>管壁厚度(mm)</span>
                            </td>
                            <td>
                                <el-input clearable type="text" placeholder="管壁厚度" v-model="editOrShow.inputs.pipeThickness"  @change="verify_int($event,'pipeThickness')"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>使用寿命(年)</span>
                            </td>
                            <td>
                                <el-input clearable type="text" placeholder="使用寿命" v-model="editOrShow.inputs.useYear"  @change="verify_int($event,'useYear')"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>报废状态</span>
                            </td>
                            <td>
                                <el-select v-model="editOrShow.inputs.status" placeholder="请选择" @change="getValue">
                                    <el-option v-for="item in scrapState" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>接口类型</span>
                            </td>
                            <td>
                                <el-select v-model="editOrShow.inputs.interfaceType" placeholder="请选择" @change="getInterfaceType_name">
                                    <el-option v-for="item in interfaceTypes" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>输送介质</span>
                            </td>
                            <td>
                            	<el-input disabled type="text"  value="自来水"  ></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>输送温度(℃)</span>
                            </td>
                            <td>
                                <el-input clearable type="text" placeholder="输送温度" v-model="editOrShow.inputs.temperrature" @change="verify_float($event,'temperrature')"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>输送压力(Mpa)</span>
                            </td>
                            <td>
                                <el-input clearable type="text" placeholder="输送压力" v-model="editOrShow.inputs.pressure" @change="verify_float($event,'pressure')"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>流量阈值(m³/s)</span>
                            </td>
                            <td>
                                <el-input clearable type="text" placeholder="流量阈值" v-model="editOrShow.inputs.flowThreshold" @change="verify_float($event,'flowThreshold')"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>压力阈值(Mpa)</span>
                            </td>
                            <td>
                                <el-input clearable type="text" placeholder="压力阈值" v-model="editOrShow.inputs.presThreshold" @change="verify_float($event,'presThreshold')"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>设计单位</span>
                            </td>
                            <td>
                                <el-input clearable type="text" placeholder="设计单位" v-model="editOrShow.inputs.designDept"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>建设单位</span>
                            </td>
                            <td>
                                <el-input clearable type="text" placeholder="建设单位" v-model="editOrShow.inputs.buildDept"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>施工单位</span>
                            </td>
                            <td>
                                <el-input clearable type="text" placeholder="施工单位" v-model="editOrShow.inputs.constructionDept"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>监理</span>
                            </td>
                            <td>
                                <el-input clearable type="text" placeholder="监理单位" v-model="editOrShow.inputs.supervisorDept"></el-input>
                            </td>
                        </tr>
                    </table>
                </template>
                <template v-if="ownList&&editOrShow.editStatus==false">
                    <table>
                        <!-- <tr>
                            <td>
                                <span>管道编号</span>
                            </td>
                            <td>
                                <span :title="ownList.CODE">{{ownList.CODE}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>管道名称</span>
                            </td>
                            <td>
                                <span :title="ownList.PIPE_NAME">{{ownList.PIPE_NAME}}</span>
                            </td>
                        </tr> -->
                        <tr>
                            <td>
                                <span>所属管线名称</span>
                            </td>
                            <td>
                                <span :title="ownList.PIPELINE_NAME">{{ownList.PIPELINE_NAME}}</span>
                            </td>
                        </tr>
                        <!-- <tr>
                            <td>
                                <span>所属管线编码</span>
                            </td>
                            <td>
                                <span>{{ownList.PIPELINE_CODE}}</span>
                            </td>
                        </tr> -->
                        <tr>
                            <td>
                                <span>管材</span>
                            </td>
                            <td>
                                <span>{{ownList.PIPE_MATERIAL|formate_meterial}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>管径(mm)</span>
                            </td>
                            <td>
                                <span >{{ownList.PIPE_RADIUS|formate_radius}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>管长(m)</span>
                            </td>
                            <td>
                                <span>{{ownList.PIPE_LENGTH}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>管壁厚度(mm)</span>
                            </td>
                            <td>
                                <span>{{ownList.PIPE_THICKNESS}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>所属水司</span>
                            </td>
                            <td>
                                <!-- <span>{{editOrShow.inputs.companyId_name}}</span> -->
                                <span >{{ownList.BUILD_DEPT}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>安装时间</span>
                            </td>
                            <td>
                                <span>{{ownList.INSTALL_TIME}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>寿命(年)</span>
                            </td>
                            <td>
                                <span>{{ownList.USE_YEAR}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>使用年限(年)</span>
                            </td>
                            <td>
                                <span>{{ownList.USE_YEAR}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>报废状态</span>
                            </td>
                            <td>
                                <span>{{ownList.STATUS|getStatus}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>接口类型</span>
                            </td>
                            <td>
                                <span>{{ownList.INTERFACE_TYPE|getInterType}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>输送温度(℃)</span>
                            </td>
                            <td>
                                <span>{{ownList.TEMPERRATURE}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>输送介质</span>
                            </td>
                            <td>
                                <span>自来水</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>输送压力(Mpa)</span>
                            </td>
                            <td>
                                <span>{{ownList.PRESSURE}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>流量阈值(m³/s)</span>
                            </td>
                            <td>
                                <span>{{ownList.FLOW_THRESHOLD}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>压力阈值(Mpa)</span>
                            </td>
                            <td>
                                <span>{{ownList.PRES_THRESHOLD}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>设计单位</span>
                            </td>
                            <td>
                                <span>{{ownList.DESIGN_DEPT}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>建设单位</span>
                            </td>
                            <td>
                                <span :title="ownList.BUILD_DEPT">{{ownList.BUILD_DEPT}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>施工单位</span>
                            </td>
                            <td>
                                <span :title="ownList.CONSTRUCTION_DEPT">{{ownList.CONSTRUCTION_DEPT}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>监理单位</span>
                            </td>
                            <td>
                                <span :title="ownList.SUPERVISOR_DEPT">{{ownList.SUPERVISOR_DEPT}}</span>
                            </td>
                        </tr>
                    </table>
                </template>
            </div>
            <div class="fonter" v-if="editAdd_flag">
                <template v-if="editOrShow.editStatus==true">
                    <div id="save" class="save" @click="save">保存</div>
                </template>
                <template v-else>
                    <div class="edit" @click="toEdit">编辑</div>
                </template>
            </div>
        </template>
        <template v-else>
            <div class="subContent">
                <div class="wrap-timeLine">
                    <template v-if="editOrShow.timeLine.length">
                         <div class="timeLine-item" v-for="(item,index) in editOrShow.timeLine" :key="index" >
                            <div class="line">
                                <i class="el-icon-arrow-up topLeft"></i>
                            </div>
                            <span>时间:{{item.CREATE_TIME}}</span>
                            <span>{{item.EVENT_DESC}}</span>
                            <span>负责人:{{item.USER_NAME}}</span>
                            <div class="imgs" v-if="item.imgs&&item.imgs.length">
                                <img :src="val" alt="" v-for="(val,i) in item.imgs" :key="i">
                            </div>
                        </div>
                    </template>
                    </div>
                </div>
        </template>
    </div>
</div>
</template>

<script>
import componyTree from "@/common/components/selectWithTree"


import  Valid  from  "@/common/utils/inputs_valid"
import {
    getPipeLifeCycle,
    saveOrUpdate,
    getPipeBaseInfo_id
} from "@/api/pipeNet_msg/msg"
export default {
    components: {
        componyTree
    },
    data() {
        return {
            self:null, // 当前vue的实例
            timer: null,
            tree: "", // 组织库
            initCompony: "", // 初始化公司名字
            parentData: "",
            ownList: [],
            companyList: [], // 水施列表
            showEdit: true,
            editOrShow: {
                editStatus: false,
                showLiveCircle: true, // 显示生命周期的开关
                ModelTabs: [{
                        name: "基本信息"
                    },
                    {
                        name: "全生命周期"
                    }
                ],
                ModelTab_item: 0,
                areaList: [],
                ownUnits: [{
                        label: "属于水司",
                        value: "1"
                    },
                    {
                        label: "属于水厂",
                        value: "2"
                    }
                ],
                interfaceType: [],
                transMedium: [],
                status: [{
                    label: "正常状态",
                    value: "0"
                }, {
                    label: "恢复状态",
                    value: "1"
                }, {
                    label: "报废状态",
                    value: "3"
                }],
                pipeType: [],
                pipe_r: [], //管径
                edit_date: "", //编辑状态下的日期
                timeLine: [], // 生命周期
                inputs: {
                	"id":"",
                    "pipeName": "",
                    "code": "",
                    "pipelineCode": "",
                    "pipelineName": "",
                    "areaId": "",
                    "pipeMaterial": "",
                    "pipeLength": "",
                    "pipeRadius": "",
                    "pipeThickness": "",
                    "interfaceType": "",
                    "startPoint": "",
                    "endPoint": "",
                    "companyId": "",
                    "companyId_name": "",
                    "installTime": "",
                    "status": "",
                    "temperrature": "",
                    "transMedium": "water",
                    "pressure": "",
                    "flowThreshold": "",
                    "designDept": "",
                    "constructionDept": "",
                    "supervisorDept": "",
                    "buildDept": "",
                    "location": "",
                    "useYear": "",
                    "type": "",
                    "locationId": "",
                    "createUser": "",
                    "createTime": "",
                    "updateTime": "",
                    "updateUser": "",
                    "presThreshold": ""
                },
            },
            PIPE_MATERIAL_name: "",
            PIPE_RADIUS_name: "",
            INTERFACE_TYPE_name: "",
            TRANS_MEDIUM_name: "",
            editAdd_flag:false, //  按钮级的  前端控制

            factoryId:"", //睡死或者水厂的ID
            pipeId:"", //管道的ID
            areaLists:[], //分区
            pipeMaterials:[], //材料
            pipeRadius:[], //管径
            interfaceTypes:[], //接口
            scrapState:[  //报废状态
                {
                    label:"正常状态",
                    value:"0"
                },
                {
                    label:"恢复状态",
                    value:"1" 
                },
                 {
                    label:"报废状态",
                    value:"3" 
                }
            ]
        }
    },
    methods: {
        showThisTab(index) {
            this.editOrShow.ModelTab_item = index;
            if (index == 1) {
                this.showEdit = false;
            } else {
                this.showEdit = true;
            }
        },
        toEdit() {
            this.editOrShow.editStatus = true;
        },
        get_pipeMaterial_name(id) {
            let temp_pipeMaterial = (parent.dse.productLists).slice(1);
            let temp_name = ""
            for (let i = 0; i < temp_pipeMaterial.length; i++) {
                if (temp_pipeMaterial[i].value == id) {
                    temp_name = temp_pipeMaterial[i].label
                }
            }
            return temp_name
        },
        get_pipeRadius_name(id) {
            let temp_pipeRadius = (parent.dse.caliberLists).slice(1);
            let temp_name = ""
            for (let i = 0; i < temp_pipeMaterial.length; i++) {
                if (temp_pipeMaterial[i].value == id) {
                    temp_name = temp_pipeMaterial[i].label
                }
            }
            return temp_name
        },
        fetchEdit(obj) {
            let temp_inputs = this.editOrShow.inputs;
            let that = this;
            let date2 = new Date(obj.installTime);
            let localeString = date2.toLocaleDateString();
            let initTime = localeString.split("/");
            let timeStr = initTime[0] + "-" + (initTime[1].length < 2 ? "0" + initTime[1] : initTime[1]) + "-" + (initTime[2].length < 2 ? "0" + initTime[2] : initTime[2]);

            if ( this.editOrShow.inputs.pipelineName == '' || this.editOrShow.inputs.installTime == '' || this.editOrShow.inputs.areaId == ''||this.editOrShow.inputs.areaId == null) {
                that.$message.error("必填项必须填写!");
                return
            } 
            let flag  = null;
             flag =  new Valid().isNumber(that.editOrShow.inputs.pipeLength)
            if(!flag){
                this.$message.error("管长请输入带有小数的数字!")
                return
            }
            flag =  new Valid().isNumber(that.editOrShow.inputs.temperrature)
            if(!flag){
                this.$message.error("输送温度请输入带有小数的数字!")
                return
            }

            flag =  new Valid().isNumber(that.editOrShow.inputs.pressure)
            if(!flag){
                this.$message.error("输送压力请输入带有小数的数字!")
                return
            }

             flag =  new Valid().isNumber(that.editOrShow.inputs.flowThreshold)
            if(!flag){
                this.$message.error("流量阈值请输入带有小数的数字!")
                return
            }

             flag =  new Valid().isNumber(that.editOrShow.inputs.presThreshold)
            if(!flag){
                this.$message.error("压力阈值请输入带有小数的数字!")
                return
            }

             flag =  new Valid().isNumber(that.editOrShow.inputs.pipeThickness)
            if(!flag){
                this.$message.error("管壁厚度请输入带有小数的数字!")
                return
            }

             flag =  new Valid().isInt(that.editOrShow.inputs.useYear)
            if(!flag){
                this.$message.error("使用年限请输入整数!")
                return
            }

            saveOrUpdate({
                id: "" + (obj.id ? obj.id : ""),
                pipeName: "" + (obj.pipeName ? obj.pipeName : ""),
                code: "" + (obj.code ? obj.code : ""),
                pipelineCode: "" + (obj.pipelineCode ? obj.pipelineCode : ""),
                pipelineName: "" + (obj.pipelineName ? obj.pipelineName : ""),
                pipeLength: "" + (obj.pipeLength ? obj.pipeLength : ""),
                pipeThickness: "" + (obj.pipeThickness ? obj.pipeThickness : ""),
                pipeRadius:""+(obj.pipeRadius ? obj.pipeRadius : ""),
                pipeMaterial:""+ (obj.pipeMaterial ? obj.pipeMaterial : ""),
                interfaceType:""+ (obj.interfaceType ? obj.interfaceType : ""),
                startPoint: "" + (obj.startPoint ? obj.startPoint : ""),
                areaId: "" + (obj.areaId ? obj.areaId : ""),
                endPoint: "" + (obj.endPoint ? obj.endPoint : ""),
                companyId: "" + (obj.companyId ? obj.companyId : ""),
                installTime: "" + timeStr,
                status: "" + (obj.status ? obj.status : "0"),
                temperrature: "" + (obj.temperrature ? obj.temperrature : ""),
                transMedium: "" + (obj.transMedium ? obj.transMedium : ""),
                pressure: "" + (obj.pressure ? obj.pressure : ""),
                flowThreshold: "" + (obj.flowThreshold ? obj.flowThreshold : ""),
                designDept: "" + (obj.designDept ? obj.designDept : ""),
                constructionDept: "" + (obj.constructionDept ? obj.constructionDept : ""),
                supervisorDept: "" + (obj.supervisorDept ? obj.supervisorDept : ""),
                buildDept: "" + (obj.buildDept ? obj.buildDept : ""),
                location: "" + (obj.location ? obj.location : ""),
                useYear: "" + (obj.useYear ? obj.useYear : ""),
                type: "" + (obj.type ? obj.type : ""),
                locationId: "" + (obj.locationId ? obj.locationId : ""),
                createUser: "" + (obj.createUser ? obj.createUser : ""),
                createTime: "" + (obj.createTime ? obj.createTime : ""),
                updateTime: "" + (obj.updateTime ? obj.updateTime : ""),
                updateUser: "" + (obj.updateUser ? obj.updateUser : ""),
                presThreshold: "" + (obj.presThreshold ? obj.presThreshold : ""),
            }).then(res => {
                if (res.msg == "no user") {
                    window.parent.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.status == 1) {
                    this.editOrShow.editStatus = false;

                    let temp_factoryId = that.factoryId
                    let temp_pipeId = that.pipeId;
                    that.getPipeBaseInfo_id_(temp_factoryId,temp_pipeId)
                    window.parent.dse.this_.layer1.refresh()
                    window.parent.dse.this_.$message.success("保存成功!");
                }
            })
        },
        save() {
            // saveData()
            let temp_fetchData = this.editOrShow.inputs;

            // debugger

            this.fetchEdit(temp_fetchData);
        },
        getLiveCircle(id) {
            let that = this;
            getPipeLifeCycle({
                pipeId: "" + id
            }).then(res => {
                that.editOrShow.timeLine = res.data;
            })
        },
        searchObj(json) {
            if (json) {
                this.editOrShow.inputs.companyId = json.id;
                this.editOrShow.inputs.type = json.type;
            } else {
                this.editOrShow.inputs.companyId = "";
                this.editOrShow.inputs.type = "";
            }
        },
        getValue(val) {
            this.editOrShow.inputs.status = val;
        },
        formatePipeList(item) {
            let temp = item;
            let temp_materials = parent.dse.productLists;
            let temp_ridius = parent.dse.caliberLists;
            // let temp_compID = parent.dse.tree;
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
        formateMaterial(id) {
            let temp_metarial = this.editOrShow.pipeType;
            for (let i = 0; i < temp_metarial.length; i++) {
                if (temp_metarial[i].value == id) {
                    return temp_metarial[i].label;
                    break;
                }
            }
        },
        formateRadius(id) {
            let temp_r = this.editOrShow.pipe_r;
            for (let i = 0; i < temp_r.length; i++) {
                if (temp_r[i].value == id) {
                    return temp_r[i].label;
                    break;
                }
            }
        },
        formateInterfaceType_name(id) {
            let temp_interfaceType = this.interfaceTypes;
            for (let i = 0; i < temp_interfaceType.length; i++) {
                if (temp_interfaceType[i].value == id) {
                    return temp_interfaceType[i].label;
                    break;
                }
            }
        },
        formateTransMedium_name(id) {
            let temp_transMedium = this.editOrShow.transMedium;
            for (let i = 0; i < temp_transMedium.length; i++) {
                if (temp_transMedium[i].value == id) {
                    return temp_transMedium[i].label;
                    break;
                }
            }
        },
        getMaterialName(val) {
            let temp_name = this.formateMaterial(val);
            this.PIPE_MATERIAL_name = temp_name;
        },
        getRadiusName(val) {
            let temp_name = this.formateRadius(val);
            this.PIPE_RADIUS_name = temp_name;
        },
        getInterfaceType_name(val) {
            let temp_name = this.formateInterfaceType_name(val);
            this.INTERFACE_TYPE_name = temp_name;
        },
        getTransMedium_name(val) {
            let temp_name = this.formateTransMedium_name(val);
            this.TRANS_MEDIUM_name = temp_name;
        },
        getOrganDictTree_(id) {
            let that = this;
            getOrganDictTree({
                code: "CQ",
                organizationId: "" + id
            }).then(res => {

                let {
                    data
                } = res
                let temp_arr = [];
                for (let i = 0; i < data.length; i++) {
                    let temp_json = {};
                    temp_json.label = data[i].label;
                    temp_json.value = data[i].id;
                    temp_arr.push(temp_json)
                }
                that.editOrShow.areaList = temp_arr;
            }).catch(error => {
                console.log(error)
            })
        },
        verify_int(event,str){
            let that  = this
            let flag = true
            flag = new Valid().isInt(event)
            switch(str){
                case "useYear":
                    // that.editOrShow.inputs.useYear = flag?event:null
                     if(!flag){
                        that.$message.error("使用年限请输入整数!")
                     }
                    break
            } 
        },
        verify_float(event,str){
            let that  = this
            let flag = true
            flag = new Valid().isNumber(event)
            switch(str){
                case "pipeLength":
                 if(!flag){
                    that.$message.error("管长请输入小数!")
                 }
                //  that.editOrShow.inputs.pipeLength = flag?parseFloat(event).toFixed(2):null
                     
                    break
                case "temperrature":
                    if(!flag){
                        that.$message.error("输送温度请输入小数!")
                    }
                    // that.editOrShow.inputs.temperrature = flag?parseFloat(event).toFixed(2):null
                    break
                case "pressure":
                 if(!flag){
                    that.$message.error("输送压力请输入小数!")
                 }
                    // that.editOrShow.inputs.pressure = flag?parseFloat(event).toFixed(2):null
                    break
                case "flowThreshold":
                 if(!flag){
                    that.$message.error("流量阈值请输入小数!")
                 }
                    // that.editOrShow.inputs.flowThreshold = flag?parseFloat(event).toFixed(2):null
                    break
                 case "presThreshold":
                  if(!flag){
                    that.$message.error("压力阈值请输入小数!")
                  }
                    // that.editOrShow.inputs.presThreshold = flag?parseFloat(event).toFixed(2):null
                    break
                  case "pipeThickness":
                    // that.editOrShow.inputs.pipeThickness = flag?event:null
                    if(!flag){
                        that.$message.error("管壁厚度请输入带有小数的数字!")
                    }
                    break
            } 
        },
        getPipeBaseInfo_id_(factoryId,pipeId){
            let that  = this;
            getPipeBaseInfo_id({
                id:pipeId,
                factoryId:factoryId,
                type:"1"
            }).then(res=>{
                
               if(res.status==1){
                   that.ownList = res.data;

                   that.editOrShow.inputs.pipelineName = res.data.PIPELINE_NAME;

                   that.editOrShow.inputs.installTime = res.data.INSTALL_TIME;

                   that.editOrShow.inputs.areaId  =  res.data.AREAID;

                   that.editOrShow.inputs.pipeMaterial = res.data.PIPE_MATERIAL;

                   that.editOrShow.inputs.pipeRadius = res.data.PIPE_RADIUS;

                   that.editOrShow.inputs.pipeLength = res.data.PIPE_LENGTH;

                   that.editOrShow.inputs.pipeThickness = res.data.PIPE_THICKNESS;

                   that.editOrShow.inputs.useYear = res.data.USE_YEAR;

                   that.editOrShow.inputs.interfaceType = res.data.INTERFACE_TYPE;

                   that.editOrShow.inputs.temperrature = res.data.TEMPERRATURE;

                   that.editOrShow.inputs.pressure = res.data.PRESSURE;

                   that.editOrShow.inputs.flowThreshold = res.data.FLOW_THRESHOLD;

                   that.editOrShow.inputs.presThreshold = res.data.PRES_THRESHOLD;

                   that.editOrShow.inputs.designDept = res.data.DESIGN_DEPT;

                   that.editOrShow.inputs.buildDept = res.data.BUILD_DEPT;

                   that.editOrShow.inputs.constructionDept = res.data.CONSTRUCTION_DEPT;

                   that.editOrShow.inputs.supervisorDept = res.data.SUPERVISOR_DEPT;

                   that.editOrShow.inputs.status = res.data.STATUS;

                   that.editOrShow.inputs.pipelineCode = res.data.PIPELINE_CODE;

                   that.editOrShow.inputs.companyId = that.factoryId;



               }



            }).catch(error=>{
                console.log(error)
            })
        }
    },
    filters: {
        getStatus(val) {
            var temp_val = val;
            switch (temp_val) {
                case "0":
                    temp_val = "正常状态";
                    break;
                case "1":
                    temp_val = "恢复状态";
                    break;
                case "3":
                    temp_val = "报废状态";
                    break
            }
            return temp_val;
        },
        getInterType(val) {
            let temp_val = "";
            let list =   parent.dse.interFace;
                for(let i=0;i<list.length;i++){
                    if(val===list[i].value){
                        temp_val = list[i].label
                    }
                }
            return temp_val;
        },
        foramteMedium(val) {
            // let temp = val;
            let temp = '自来水';
            switch (val) {
                case "water":
                    temp = "自来水"
                    break;
                    return temp
            }
        },
        formate_meterial(val) {
            let temp = ''
            let list =  parent.dse.productLists;
            for(let i=0;i<list.length;i++){
                if(val===list[i].value){
                    temp = list[i].label
                }
            }
            return temp
        },
        formate_radius(val) {
            let temp = ''
            let list =  parent.dse.caliberLists;
            for(let i=0;i<list.length;i++){
                if(val===list[i].value){
                    temp = list[i].label
                }
            }
            return temp
        }
    },
    mounted() {
        let that = this;
        let temp_factoryId = this.factoryId
        let temp_pipeId = this.pipeId;
        this.getPipeBaseInfo_id_(temp_factoryId,temp_pipeId)
    },
    created() {
        let that  = this;
        that.factoryId = parent.dse.globalData.factoryId;
        that.pipeId = parent.dse.globalData.id;
        this.self = parent.dse.this_;
        this.editAdd_flag = parent.dse.globalData.editSave

        this.editOrShow.inputs.id = that.pipeId

        this.areaLists = parent.dse.globalData.areaLists;
        this.pipeMaterials = parent.dse.globalData.pipeMaterials;
        this.pipeRadius = parent.dse.globalData.pipeRadius;
        this.interfaceTypes = parent.dse.globalData.interfaceTypes;

        this.getLiveCircle(that.pipeId)
    }
}
</script>

<style lang="scss" scoped>

#pipeFrame .main {
    width: 100%;
    padding-top: 10px;
    font-size: 14px;
    .tabs {
        width: 100%;
        padding: 0 10px;
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;

        .tab-item {
            height: 25px;
            padding: 0 10px;
            line-height: 23px;
            font-size: 14px;
            color: #333;
            font-weight: 600;
            border: 1px solid #e1e1e3;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            margin-right: 10px;
            cursor: pointer;

            &.actived {
                background: #0b83fe;
                color: #fff;
            }
        }
    }

    .subContent {
        width: 100%; // margin-bottom: 10px;
        height: 425px;
        padding: 0 10px;
        overflow-y: auto;
        position: relative;
        &.bgHeight{
            height: 450px;
        }

        table {
            width: 100%;
            border-spacing: 0;
            text-align: center;
            border: 1px solid #ccc;
            border-bottom: none;

            tr {
                width: 100%;

                td {
                    height: 35px;
                    border-bottom: 1px solid #ccc;

                    &:first-child {
                        border-right: 1px solid #ccc;
                        background: #d6fafa;
                        width: 120px;
                    }

                    .el-select,
                    .el-date-editor {
                        width: 80%;
                    }

                    input {
                        display: inline-block;
                        border-radius: 3px;
                        border: 1px solid #ccc;
                        width: 80%;
                        padding-left: 10px;
                    }

                    i {
                        color: red;
                        font-size: 12px;
                    }

                    // span{
                    //     width: 100%;
                    //     display: inline-block;
                    //     overflow: hidden;
                    //     text-overflow: ellipsis;
                    //     white-space: nowrap;
                    // }
                }

                &:last-child {
                    td {
                        border-bottom: none;
                    }
                }

                .el-input {
                    width: 80%;
                }

                #selectTree {
                    width: 80%;
                    margin-left: 10%;
                    margin-top: 5px;
                }
            }
        }

        .wrap-timeLine {
            width: 100%;
            height: calc(100% - 50px);

            .timeLine-item {
                width: 100%;
                position: relative;
                border-left: 1px solid #0b83fe; // display: flex;
                // flex-direction: column;
                // align-items: center;
                // justify-content: center;
                padding: 0 10px;
                padding-bottom: 10px;

                i {
                    position: absolute;
                    height: 14px;
                    width: 14px;
                    font-size: 14px;
                    display: inline-block;
                    border-radius: 50%;
                    background: #0b83fe;
                    left: -7px;
                    top: 0;
                    color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                }

                span {
                    display: inline-block;
                    margin-bottom: 10px;
                }

                img {
                    display: block;
                    width: 100%;
                }
            }
        }
    }

    .fonter {
        position: absolute;
        bottom: 0;
        left: 10px;
        width: calc(100% - 10px);
        display: flex;
        justify-content: flex-end;
        align-items: center;
        background: #dcdedd;
        height: 30px;
        // border-bottom-left-radius: 10px;
        // border-bottom-right-radius: 10px;

        div {
            padding: 0 10px;
            height: 25px;
            line-height: 25px;
            margin-right: 10px;
            border-radius: 5px;
            background: #0b83fe;
            color: #fff;
            cursor: pointer;
        }
    }
}
</style>
