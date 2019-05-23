<template>
<div id="bigUser_manage">
    <template v-if="!ifShow">
        <div class="subTable">
            <!-- <div class="row">
                <div class="col">
                    <span>东经:</span>
                    <span>{{tempData.longitude|formate}}</span>
                </div>
                <div class="col">
                    <span>北纬:</span>
                    <span>{{tempData.latitude|formate}}</span>
                </div>
            </div> -->
            <div class="row">
                <div class="col">
                    <span>用户:</span>
                    <el-input v-model="inputs.name" clearable></el-input>
                </div>
                <div class="col">
                    <span>简称:</span>
                    <el-input v-model="inputs.shortName" clearable></el-input>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <span>用水类型:</span>
                    <el-select v-model="inputs.useType" placeholder="请选择">
                        <el-option v-for="item in waterSupply_type" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="col">
                    <span>联系人:</span>
                    <el-input v-model="inputs.contacts" clearable></el-input>
                </div>
            </div>
            <div class="row">

                <div class="col">
                    <span>所属区域:</span>
                    <el-select v-model="inputs.areaId" placeholder="请选择">
                        <el-option v-for="item in areaList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="col justify">
                    <span>所属管道:</span>
                    <fuzzy-search :closeList_flag="closeSubListFlag" @selectThis="searchPipeName" :defaultName="search_pipeName" :searchLists="searchPipeLists" @callBackList="fetchPipeListData"></fuzzy-search>
                </div>

            </div>
            <div class="row">
                <div class="col">
                    <span>固定电话:</span>
                    <el-input v-model="inputs.telephone" clearable></el-input>
                </div>
                <div class="col">
                    <span>手机号:</span>
                    <el-input v-model="inputs.phone" clearable></el-input>
                </div>
            </div>
            <div class="row">
                <div class="col long">
                    <span>计划用水(万m³):</span>
                    <el-input v-model="inputs.waterPlan" clearable></el-input>
                </div>
                <div class="col long">
                    <span>服务人口(万人):</span>
                    <el-input v-model="inputs.serviceNum" clearable></el-input>
                </div>
            </div>

        </div>
        <div class="actions">
            <div class="cancel" @click="cancel">取消</div>
            <div class="save" @click="save">保存</div>
        </div>
    </template>

    <template v-else>
        <div class="subTable">
            <!-- <div class="row ">
                <div class="col">
                    <span>东经:</span>
                    <span>{{showPoints.LGTD}}</span>
                </div>
                <div class="col">
                    <span>北纬:</span>
                    <span>{{showPoints.LTTD}}</span>
                </div>
            </div> -->
            <div class="row">
                <div class="col">
                    <span>用户:</span>
                    <span class="long" :title="showPoints.NAME">{{showPoints.NAME}}</span>
                </div>
                <div class="col">
                    <span>简称:</span>
                    <span>{{showPoints.SHORT_NAME}}</span>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <span>用水类型:</span>
                    <span>{{showPoints.USE_TYPE|formate_useType}}</span>
                </div>
                <div class="col">
                    <span>联系人:</span>
                    <span>{{showPoints.CONTACTS}}</span>
                </div>
            </div>
            <div class="row">

                <div class="col">
                    <span>所属区域:</span>
                    <span>{{showPoints.COMPANYNAMES}}</span>
                </div>
                <div class="col">
                    <span>固定电话:</span>
                    <span class="long-str" :title="showPoints.TELEPHONE">{{showPoints.TELEPHONE}}</span>
                </div>
            </div>
            <div class="row">
                <div class="col ">
                    <span class="strLong">计划用水(万m³):</span>
                    <span>{{showPoints.WATER_PLAN}}</span>
                </div>
                <div class="col ">
                    <span class="strLong">服务人口(万人):</span>
                    <span >{{showPoints.SERVICE_NUM}}</span>
                </div>
            </div>

        </div>
    </template>

</div>
</template>

<script>
import fuzzySearch from "@/common/components/fuzzy_search";
import {
    getPipeBaseInfo
} from "@/api/pipeNet_msg/msg";

import {
    saveOrUpdate
} from "@/api/pipeNet_msg/bagUser_manage";

export default {
    components: {
        fuzzySearch
    },
    data() {
        return {
            tempData: {}, // 临时数据
            temp_json: {
                test: "123"
            }, //临时需要传给父页面的数据
            search_pipeName: "", //查询的管线名字
            searchPipeLists: [], //查询的管线列表
            ownArea: "", //所属区域
            areaList: [], //区域列表
            userName: "", // 用户名字
            waterSupply_type: [], // 用水类型列表
            waterType: "", //用水类型
            closeSubListFlag: true, //搜索下拉框
            showPoints: {
                id: "",
                name: "",
                shortName: "",
                pointId: "",
                contacts: "",
                phone: "",
                areaId: "",
                waterPlan: "",
                insertTime: "",
                pipeCode: "",
                serviceNum: "0",
                status: "0",
                telephone: "",
                lgtd: "",
                lttd: "",
                useType: ""
            },
            inputs: {
                id: "",
                name: "",
                shortName: "",
                pointId: "",
                contacts: "",
                phone: "",
                areaId: "",
                waterPlan: "",
                insertTime: "",
                pipeCode: "",
                serviceNum: "0",
                status: "0",
                telephone: "",
                lgtd: "",
                lttd: "",
                useType: ""
            },
            status: [{
                    label: "正常状态",
                    value: "0"
                }, {
                    label: "恢复状态",
                    value: "1"
                },
                {
                    label: "报废状态",
                    value: "3"
                }
            ],
            ifShow: false,
            compyID: "", // 公司ID
        }
    },
    methods: {
         fetchAddUser(array) {
            let that = this;
            saveOrUpdate(
                array
            ).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.status == 1) {
                    // that.addPoint_status = false;
                    window.parent.this_.$message.success("保存成功!");
                    window.parent.this_.getAreaUserList("", "", "", "1");
                    // that.view.popup.close();
                    window.parent.this_.view.popup.close();
                }else{
                    window.parent.this_.$message.error("保存失败!");
                }
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
            });
        },
        validate(){
        	let reg = /^[1-9]\d*$/;//正整数
			let regnum = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
			let regtelephone = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
			let regphone =  /^1\d{10}$/;
			if (this.inputs.name == "") {
				this.$message.error("用户名称不能为空!")
                return false
			}else if (this.inputs.shortName == "") {
				this.$message.error("用户简称不能为空!")
                return false
			}else if (this.inputs.useType == "") {
				this.$message.error("用水类型不能为空!")
                return false
			}else if (this.inputs.contacts == "") {
				this.$message.error("联系人不能为空!")
                return false
			}else if (this.inputs.pipeCode == "") {
				this.$message.error("请在输入关键字后回车选取管道!")
                return false
			}else if (!regtelephone.test(this.inputs.telephone)) {
				this.$message.error("固定电话格式不对!")
                return false
			}else if (!regphone.test(this.inputs.phone)) {
				this.$message.error("手机号为1开头的十一位数!")
                return false
			}else if (!regnum.test(this.inputs.waterPlan)) {
				this.$message.error("计划用水为正数且最多保留两位小数!")
                return false
			}else if (!regnum.test(this.inputs.serviceNum)) {
				this.$message.error("服务人口为正数且最多保留两位小数!")
                return false
			}else{
				return true
			}
        },
        save() {
//
//          if(this.inputs.pipeCode == '' ){
//              window.parent.this_.$message.error("请在输入关键字后回车选取管道!")
//              return
//          }

            if(this.inputs.areaId=="全部城区"||this.inputs.areaId==undefined){
                this.inputs.areaId = ""
            }
			let isFull = this.validate();
			if(isFull){
				let temp_data = this.inputs;
	            // temp_data.status_ = false;
	            // window.parent.this_.addList.push(temp_data);
	            // let saveData =  window.parent.this_.addList;
	            // window.parent.this_.fetchAddUser(temp_data);
	            // window.parent.this_.view.popup.close();
	            this.fetchAddUser([temp_data]);
			}
//          if (this.inputs.name == '' || this.inputs.shortName == '' || this.inputs.contacts == '' || this.inputs.phone == '' || this.inputs.waterPlan == '' ||  this.inputs.serviceNum == '' || this.inputs.telephone == '' || this.inputs.useType == '') {
//              window.parent.this_.$message.error("必须全部填写完整！")
//              return
//          }
            
        },
        cancel() {
            let that = this;
            let temp_id =  parseInt(that.tempData.id);
            // console.log(temp_id)
            // window.parent.this_.view.graphics.splice(temp_id, 1);
            // console.log( window.parent.this_.view.graphics)
            window.parent.this_.view.graphics.removeAll()
            window.parent.this_.view.popup.close();
            window.parent.this_.addList.splice(temp_id, 1);
            window.parent.this_.newUserIndex = (window.parent.this_.newUserIndex - 1) <= 0 ? 0 : window.parent.this_.newUserIndex - 1
        },
        searchPipeName(val) {
            this.search_pipeName = val.PIPE_NAME;
            this.searchValue = val.ID;
            this.inputs.pipeCode = val.ID;
            this.closeSubListFlag = false;
            this.searchPipeLists = [];
        },
        search_fromName(name) {
            let that = this;
            getPipeBaseInfo({
                pipeName: "" + name,
                code: "",
                type: "1",
                factoryId: "" + that.compyID
            }).then(res => {
                if (res.msg == "no user") {
                    window.parent.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}`
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
        }
    },
    filters: {
        formate(val) {
            let temp_value = parseFloat(val);
            let du = parseInt(temp_value);
            let fen = parseInt((parseFloat(temp_value) - du) * 60);
            let miao = parseInt((temp_value - du - fen / 60) * 60 * 10000) / 10000;
            temp_value = du + "°" + fen + "′" + miao + "″";
            return temp_value
        },
        formate_useType(val) {
            let temp = val;
            switch (val) {
                case "8ae4b2d16554e60d0165565efff6000c":
                    temp = "行政事业";
                    break;
                case "8ae4b2d16554e60d01655660352b000d":
                    temp = "公用事业";
                    break;
                case "8ae4b2d16554e60d01655660eca1000e":
                    temp = "居民生活";
                    break;
                case "8ae4b2d16554e60d016556617cf6000f":
                    temp = "经营服务";
                    break;
                case "8ae4b2d16554e60d01655662133d0010":
                    temp = "特种行业";
                    break;
                case "8ae4b2d16554e60d01655662c5cf0011":
                    temp = "绿化灌溉";
                    break;
                case "8ae4b2d16554e60d01655663dad90012":
                    temp = "节水补灌";
                    break;
                case "8ae4b2d16554e60d0165566532e80014":
                    temp = "工业供水";
                    break;
            }
            return temp;
        },
        formate_areaId(val) {
            let temp = val;
            switch (val) {
                case "6E70FFDCCE8F2299E055000000000001":
                    temp = "新城区";
                    break;
                case "6E70FFDCCE8E2299E055000000000001":
                    temp = "老城区";
                    break;
                case "6E70FFDCCE902299E055000000000001":
                    temp = "开发区";
                    break;
            }
            return temp;
        }
    },
    created() {
        let that = this;
        let flag = parent.dse.globalData.show;
        let flag2 = parent.dse.globalData.AREA_ID;
        if (flag && flag2 != undefined) {
            this.ifShow = true;
            this.showPoints = parent.dse.globalData;
            return
        } else {
            this.ifShow = false;
            this.tempData.id = parent.dse.globalData.attributes;
            this.tempData.latitude = parent.dse.globalData.latitude;
            this.tempData.longitude = parent.dse.globalData.longitude;
            this.inputs.lgtd = this.tempData.longitude;
            this.inputs.lttd = this.tempData.latitude;
            let  temp_arr = window.parent.dse.temp_arr;
            if(temp_arr.length>1){
                this.areaList = window.parent.dse.temp_arr.slice(1, window.parent.dse.temp_arr.length);
            }
            // else{
            //      this.areaList = window.parent.dse.temp_arr;
            // }
           
            this.waterSupply_type =window.parent.dse.waterSupply_type;
        };
        this.compyID = parent.this_.componyID;

    },
    mounted(){
        // console.log(this.showPoints)
    }
}
</script>

<style lang="scss" scoped>
#bigUser_manage {
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #333;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .subTable {
        width: calc(100% - 20px);
        margin: 0 auto;
        // padding: 10px;
        // max-height: calc(100% - 40px); // overflow-y: auto;
        border: 1px solid #ccc;
        border-radius: 10px;
        // max-height: 260px;
        overflow-y: auto;
        height:100%;
        .row {
            width: 100%;
            // height: 25%;
            display: flex;
            justify-content: space-between;

            .col {
                width: 50%;
                // line-height: 40px;
                display: flex;
                align-items: center;
                border-right: 1px solid #ccc;
                border-bottom: 1px solid #ccc;

                &:last-child {
                    border-right: none;
                }

                &.justify {
                    display: flex;
                    justify-content: space-between;
                }

                span {
                    display: inline-block;
                    width: 120px;
                    line-height: 40px;
                    text-align: right;
                    padding-right: 10px;

                    &:last-child {
                        width: calc(100% - 120px);
                    }

                    &.long {
                        width: calc(100% - 120px);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    &:first-child{
                        background: #d6fafa;
                    }
                }

                .el-input {
                    width: calc(100% - 120px);
                }

                .el-select {
                    width: calc(100% - 120px);
                }

                #fuzzy_search {
                    width: calc(100% - 120px);
                }

                &.long {
                    span {
                        width: 120px;
                    }

                    .el-input {
                        width: calc(100% - 120px);
                    }
                }

                .long-str {
                    display: inline-block;
                    width: calc(100% - 120px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .strLong {
                    width: 120px;
                }
            }

            &:last-child {
                border-bottom:1px solid #ccc;
                .col {
                    border-bottom: none;
                }
            }
        }
    }

    .actions {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #dcdedd;

        div {
            display: inline-block;
            padding: 0 15px;
            line-height: 25px;
            margin-left: 10px;
            background: #0a82fe;
            cursor: pointer;
            border-radius: 5px;
            color: #fff;
        }
    }
}
</style>
