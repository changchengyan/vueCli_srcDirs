<template>
    <div id="init">
        <div class="stage">
            <div class="dot-pulse"></div>
        </div>
        <div class="tips">数据加载中...</div>
    </div>
</template>

<script>
import {
    getSessionUser
} from '@/api/pipeNet_msg/home'

import {
    getResourceByIdAndUser
} from "@/api/common/getRouter"
import {
    getFilePathUrl
} from "@/api/common/getFilePath"

import {
    getOrganizationTree
} from "@/api/common/get_organization"
import {
    getOrganDictTree
} from "@/api/common/get_area"

import {
    getDictByPCode
} from "@/api/common/base_dirct"
export default {
    data(){
        return{

        }
    },
    methods:{
         btns_allowed(arr) {
            let temp_json = {
                pipe_2d3d:{
                    editSave:false
                },
                waterInformation: {
                    add: false,
                    edit: false,
                    del: false
                },
                city_EditNotify: {
                    add: false,
                    edit: false,
                    del: false
                }
            }
            let local_json = dse.allowBtns.pipeMsg
            let temp_arr = JSON.parse(JSON.stringify(arr))
            for (let i = 0; i < temp_arr.length; i++) {
                if (temp_arr[i] === local_json.waterInformation.add) {
                    temp_json.waterInformation.add = true
                }else if(temp_arr[i] === local_json.waterInformation.edit){
                    temp_json.waterInformation.edit = true
                }else if(temp_arr[i] === local_json.waterInformation.del){
                    temp_json.waterInformation.del = true
                }else if(temp_arr[i] === local_json.city_EditNotify.add){
                    temp_json.city_EditNotify.add = true
                }else if(temp_arr[i] === local_json.city_EditNotify.edit){
                    temp_json.city_EditNotify.edit = true
                }else if(temp_arr[i] === local_json.city_EditNotify.del){
                    temp_json.city_EditNotify.del = true
                }else if(temp_arr[i] === local_json.pipe_2d3d.editSave){
                    temp_json.pipe_2d3d.editSave = true
                }
            }

            return temp_json
        },
        setSession() {
            let that = this;
            getSessionUser().then(res => {
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.status == 1) {
                    let temp_session = JSON.stringify(res);
                    sessionStorage.setItem("user", temp_session);
                    that.$store.commit("set_comanyID", res.organizationIds[0]);

                    let orgId = res.organizationIds[0]
                    if(orgId==='402881d162b284680162b3a41362012a'||orgId==="8ae4b2d5645e202701645ec426720013"){
                        that.$store.commit("set_pipe_defaultLayer",orgId)
                        that.$store.commit("set_xfs_defaultLayer",orgId)
                        that.$store.commit("set_fm_defaultLayer",orgId)
                    }else{
                         that.$store.commit("set_pipe_defaultLayer",'402881d162b284680162b3a41362012a')
                         that.$store.commit("set_xfs_defaultLayer",'402881d162b284680162b3a41362012a')
                         that.$store.commit("set_fm_defaultLayer",'402881d162b284680162b3a41362012a')
                    }

                    that.$store.commit("set_compyName", res.organizationName);
                    that.$store.commit("set_userName", res.name);
                    that.$store.commit("set_areaName", res.organizationName);
                    that.$store.commit("set_btnsIds", res.resourceIds)
                    let temp_arr = res.positions[0] ? res.positions[0].split(',') : []
                    if(temp_arr.length>0){
                        temp_arr[0] =  parseFloat(temp_arr[0]) 
                        temp_arr[1] =  parseFloat(temp_arr[1]) 
                    }else{
                          temp_arr = [106.290351, 36.001819]
                    }
                    that.$store.commit("set_cityPosition", temp_arr);
                    that.getOrganizationTree_();
                    that.getOrganDictTree_();

                    let temp_btnAllowed = that.btns_allowed(res.resourceIds)
                    that.$store.commit("set_pages_btn_allow",temp_btnAllowed)
                }
            }).catch(function (error) {
                console.log(error)
            });
        },
        getRouters() {
            let that = this;
            getResourceByIdAndUser({
                id: "" + id,
                flag: "",
                pid: ""
            }).then(res => {
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }

                let temp_data = res&&res.length ? res : [];
                let routes = [];
                if (res&&res.length>0) {
                    for (let i = 0; i < temp_data.length; i++) {
                        routes.push({
                            path: temp_data[i].url,
                            name: temp_data[i].name,
                            icon: temp_data[i].img,
                            status: false
                        })
                    }
                    routes[0].status = true;
                }
                // that.MenuData = routes;
                sessionStorage.setItem("routelist",routes)
                that.$store.commit("set_menuList",routes)

            }).catch(function (error) {
                console.log(error)
            });
        },
        getFilePathUrl_() {
            let that = this;
            getFilePathUrl().then(res => {
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.status == 1) {
                    let {
                        data
                    } = res;
                    that.$store.commit("set_filePath", data.filePathUrl);
                }

                that.get_pipe_material()
                that.get_pipe_radius()
                that.get_interface_type()
                that.get_trans_medium()
                that.get_dev_shebei()
                that.get_water_type()

            }).catch(function (error) {
                console.log(error)
            });
        },
        getOrganizationTree_() {
            let that = this;
            let temp_name = this.$store.getters.getCompyName;
            let temp_companyID = this.$store.getters.get_companyId;
            if (temp_name.includes("集团")) {
                temp_companyID = "";
            }
            getOrganizationTree({
                organizationId: "" + temp_companyID
            }).then(res => {
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                that.$store.commit("set_orgTree", res.data)
            }).catch(error => {
                console.log(error);
            })
        },
        getOrganDictTree_() {
            let that = this;
            let temp_name = this.$store.getters.getCompyName;
            let temp_companyID = this.$store.getters.get_companyId;

            let flag = temp_name.includes("集团")
            if (flag) {
                that.$store.commit("set_cityAreas", [{
                    label: "全部城区",
                    value: ""
                }]);
                return
            }
            getOrganDictTree({
                code: "CQ",
                organizationId: "" + temp_companyID
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

                    that.$store.commit("set_cityAreas", tempList)
                } else {
                    that.$store.commit("set_cityAreas", [{
                        label: "全部城区",
                        value: ""
                    }]);
                }
            }).catch(error => {
                console.log(error);
            })
        },
        get_pipe_material(){
            let that = this;
            let formdata = new FormData()
            formdata.append("pcode","pipe_material")
            getDictByPCode(formdata).then(res=>{
              
                let temp_arr = []
                let arr= res&&res.length?res:[]
                temp_arr.push({
                    label:"全部管材",
                    value:""
                })
                for(let i=0;i<arr.length;i++){
                    let temp_json ={}
                    temp_json.label = arr[i].name
                    temp_json.value = arr[i].id
                    temp_arr.push(temp_json)
                }
            that.$store.commit("set_pipe_material",temp_arr)
            dse.productLists = temp_arr
            }).catch(error=>{
                console.log(error)
            })
        },
        get_pipe_radius(){
            let that = this;
            let formdata = new FormData()
            formdata.append("pcode","pipe_radius")
            getDictByPCode(formdata).then(res=>{
                let temp_arr = []
                let arr= res&&res.length?res:[]
                 temp_arr.push({
                    label:"全部管径",
                    value:""
                })
                for(let i=0;i<arr.length;i++){
                    let temp_json ={}
                    temp_json.label = arr[i].name
                    temp_json.value = arr[i].id
                    temp_arr.push(temp_json)
                }
                that.$store.commit("set_pipe_radius",temp_arr)
                dse.caliberLists = temp_arr
            }).catch(error=>{
                console.log(error)
            })
        },
        get_interface_type(){
            let that = this;
            let formdata = new FormData()
            formdata.append("pcode","interface_type")
            getDictByPCode(formdata).then(res=>{
                let temp_arr = []
                let arr= res&&res.length?res:[]
                for(let i=0;i<arr.length;i++){
                    let temp_json ={}
                    temp_json.label = arr[i].name
                    temp_json.value = arr[i].id
                    temp_arr.push(temp_json)
                }
                that.$store.commit("set_interface_type",temp_arr)
                dse.interFace = temp_arr
            }).catch(error=>{
                console.log(error)
            })
        },
        get_trans_medium(){
            let that = this;
            let formdata = new FormData()
            formdata.append("pcode","trans_medium")
            getDictByPCode(formdata).then(res=>{
                let temp_arr = []
                let arr= res&&res.length?res:[]
                for(let i=0;i<arr.length;i++){
                    let temp_json ={}
                    temp_json.label = arr[i].name
                    temp_json.value = arr[i].id
                    temp_arr.push(temp_json)
                }
                that.$store.commit("set_trans_medium",temp_arr)
                dse.transmissionMedium = temp_arr
            }).catch(error=>{
                console.log(error)
            })
        },
        get_dev_shebei(){
            let that = this;
            let formdata = new FormData()
            formdata.append("pcode","dev_shebei")
            getDictByPCode(formdata).then(res=>{
                let temp_arr = []
                let arr= res&&res.length?res:[]
                for(let i=0;i<arr.length;i++){
                    let temp_json ={}
                    temp_json.label = arr[i].name
                    temp_json.value = arr[i].id
                    temp_arr.push(temp_json)
                }
                that.$store.commit("set_dev_shebei",temp_arr)
                dse.devices = temp_arr
            }).catch(error=>{
                console.log(error)
            })
        },
        get_water_type(){
             let that = this;
            let formdata = new FormData()
            formdata.append("pcode","water_type")
            getDictByPCode(formdata).then(res=>{
                let temp_arr = []
                let arr= res&&res.length?res:[]
                for(let i=0;i<arr.length;i++){
                    let temp_json ={}
                    temp_json.label = arr[i].name
                    temp_json.value = arr[i].id
                    temp_arr.push(temp_json)
                }
                that.$store.commit("set_water_type",temp_arr)
                dse.waterSupply_type = temp_arr
            }).catch(error=>{
                console.log(error)
            })
        }
    },
    mounted(){
        let  that = this
        setTimeout(()=>{
             that.$router.push({
                path: "/pipe/pipeNet_route" 
            })
        },1000*1.5)
    },
    created(){
        if(window.personalTimer){
            clearInterval(personalbar)
        }
         sessionStorage.setItem("initRoute", 0);
        this.setSession();
        this.getRouters();
        this.getFilePathUrl_();
    }
}
</script>

<style lang="scss" scoped>

@keyframes dotPulse {
    0% {
        box-shadow: 9964px 0 0 -10px #0b83ff,9999px 0 0 0 #0b83ff,10044px 0 0 2px #0b83ff
    }

    25% {
        box-shadow: 9964px 0 0 0 #0b83ff,9999px 0 0 2px #0b83ff,10044px 0 0 0 #0b83ff
    }

    50% {
        box-shadow: 9964px 0 0 2px #0b83ff,9999px 0 0 0 #0b83ff,10044px 0 0 -10px #0b83ff
    }

    75% {
        box-shadow: 9964px 0 0 0 #0b83ff,9999px 0 0 -10px #0b83ff,10044px 0 0 0 #0b83ff
    }

    100% {
        box-shadow: 9964px 0 0 -10px #0b83ff,9999px 0 0 0 #0b83ff,10044px 0 0 2px #0b83ff
    }
}

#init{
    width: 100%;
    height: 100%;
    position: relative;
    .stage{
        width: 200px;
        height: 100px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -50px;
        margin-left: -100px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
         .dot-pulse{
            position: relative;
            left: -9999px;
            width: 20px;
            height: 20px;
            border-radius: 10px;
            background-color: #0b83ff;
            color: #0b83ff;
            box-shadow: 9964px 0 0 0 #0b83ff, 9999px 0 0 0 #0b83ff, 10044px 0 0 0 #0b83ff;
            animation: dotPulse 1.5s infinite linear;
        }
    }
    .tips{
        width: 100px;
        height: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: 30px;
        margin-left: -40px;
    }
   
}
</style>

