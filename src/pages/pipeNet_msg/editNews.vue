<template>
<div id="editNews">
    <div class="title">
        <span>标题:</span>
        <input placeholder="请输入标题" clearable v-model="inputs.title" @keyup.space="get_str">
    </div>
    <div class="content">
        <!-- <textarea placeholder="请输入内容" v-model="inputs.content" @keyup="getStr_num"></textarea>-->
        <span class="floatStr">最大输入字数为500字</span> 
        <quill-editor v-model="inputs.content"
                ref="myQuillEditor"
               @change="onEditorKeyUp($event)">
  </quill-editor>
    </div>
    <div class="actions">
        <span @click="save">保存</span>
        <span @click="goBack">返回</span>
    </div>
    <save-status :showModel="ifShowModel" @delThis="closeModel" :content="fetchContent" :type="modelType" :flag="status"></save-status>
</div>
</template>

<script>
import saveStatus from "@/common/components/poupe/save_status";

import {
    saveOrUpdate
} from "@/api/pipeNet_msg/home"
export default {
    components: {
        saveStatus
    },
    data() {
        return {
            ifShowModel: false,
            fetchContent: "",
            modelType: true,
            status: null,
            inputs: {
            	id:"",
                title: "",
                content: ""
            },
            edit: false,
            currentNum:0
        }
    },
    methods: {
        save() {
            let postData = this.inputs;
            let that = this;

            let temp_title = this.inputs.title;
            if(temp_title==''){
                this.$message.error("请给个标题吧")
                return
            }
            let  temp_content = this.inputs.content;

             if(temp_content==''){
                this.$message.error("需要写点什么才可以")
                return
            }

            if(this.inputs.title.length>30){
                this.$message.error("您输入标题的字数大于30个字!")
                return
            }

            this.inputs.content = (this.inputs.content).replace("<p>",'')
            this.inputs.content = (this.inputs.content).replace("</p>",'')

            if(this.inputs.content.length>500){
                this.$message.error("您输入的字数超过500字!")
                return
            }

            saveOrUpdate(postData).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                that.ifShowModel = true;
                that.status = (res.status == 1);
                that.fetchContent = res.msg;
                if (res.status == 1) {
                    setTimeout(() => {
                        this.$router.go(-1);
                        this.$store.commit("setAside_status", true);
                        this.$emit("showAside");
                    }, 2500)

                }
            }).catch(function (error) {
                console.log(error)
            });
        },
        closeModel(val) {
            this.ifShowModel = val.modelFlag
        },
        goBack() {
            this.$router.go(-1);
            this.$store.commit("setAside_status", true);
            this.$emit("showAside");
        },
        onEditorKeyUp(event){
            let temp_str = event.text;
             let temp_len = temp_str.length-1
             this.currentNum = temp_len;
             if(temp_len>500){
                this.$message.error("您输入的字数不能超过500字!")
                // this.inputs.content = this.inputs.content.substring(0,500);
                // this.currentNum = 500;
             }
        },
        get_str(event){
            let temp_str = event.target.value;
            let  temp_len = temp_str.length;
            console.log(temp_str)
            console.log(temp_len)
            if(temp_len>30){
                this.$message.error("您输入的文字不能超过30字!")
                //  this.inputs.title = temp_str.substring(0,30)
            }

        }
    },
    created(){
    	let that = this;
    	this.edit = that.$route.query.edit;
    	if(this.edit){
    		this.inputs.id = that.$route.query.id;
    		this.inputs.content = that.$route.query.content;
    		this.inputs.title = that.$route.query.title;
    	}
    }
}
</script>

<style lang="scss" scoped>
#editNews {
    width: 100%;
    height: 100%;
    padding: 20px;

    .title {
        width: 60%;
        margin: 0 auto;
        height: 30px;

        input {
            width: calc(100% - 80px);
            height: 30px;
            line-height: 28px;
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 2px;
            padding-left: 1em;
        }

        margin-bottom: 20px;
    }

    .content {
        width: 60%;
        margin: 0 auto;
        height: calc(100% - 200px);
        margin-bottom: 20px;
        position: relative;
        textarea {
            width: 100%;
            height: 100%;
            resize: none;
            border-radius: 10px;
            border: 1px solid #ccc;
            padding: 20px;
            line-height: 30px;
        }
        .floatStr{
            position: absolute;
            bottom: 30px;
            right: 20px;
            color: red;
            transform: scale(0.8);
        }
    }

    .actions {
        width: 100%;
        display: flex;
        justify-content: center;

        span {
            display: inline-block;
            padding: 10px 20px;
            background: #0b83ff;
            border-radius: 5px;
            color: #fff;
            margin-right: 20px;
            cursor: pointer;
        }
    }

}
</style>
