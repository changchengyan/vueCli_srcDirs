<template>
<div id="danger">
    <div class="row">
        <span>隐患时间:</span>
        <span>{{pointDetail.reportTime}}</span>
    </div>
    <div class="row">
        <span>地点:</span>
        <span :title="pointDetail.place">{{pointDetail.place}}</span>
    </div>
    <div class="row">
        <span>上报人:</span>
        <span>{{pointDetail.createUser}}</span>
    </div>
    <div class="row">
        <span>状态:</span>
        <span>{{pointDetail.probStatus|pro_str}}</span>
    </div>
    <div class="row">
        <span>隐患描述:</span>
        <span :title="pointDetail.proDescrip">{{pointDetail.proDescrip}}</span>
    </div>
    <div class="tips">
        <span class="rect"></span><span>现场实拍照片</span>
    </div>
    <div class="imgs">
        <img :src="pointDetail.staticFile+item.filePath" alt="" v-for="(item,index) in pointDetail.file" :key="index">
    </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            staticFilePath:"", //静态文件的路径
            pointDetail: {
                lttd: 0,
                probLevel: "",
                probType: "",
                reportType: "",
                hasFile: "",
                file: [],
                probStatus: "",
                lgtd: 0,
                createUser: "",
                proDescrip: "",
                id: "",
                place: "",
                probName: "",
                reportTime: ""
            }
        }
    },
    created(){
        this.pointDetail = window.parent.dse.globalData
    },
    methods:{
        
    },
    filters:{
        pro_str(str){
            let temp_num = null
            switch(str){
                case '0':
                    temp_num = "紧急"
                case '1':
                    temp_num = "严重"
                case '2':
                    temp_num = "一般"
                default:
                temp_num = "一般"
            }
            return  temp_num

        }
    }

}
</script>

<style lang="scss" scoped>
#danger {
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #333;
    padding: 10px;

    .row {
        width: 100%;
        // border-top: 1px solid #ccc;
        border-left: 1px solid #ccc;
        display: flex;
        justify-content: flex-start;

        &:first-child {
            border-top: 1px solid #ccc;
        }

        span {
            display: inline-block;
            border-right: 1px solid #ccc;
            height: 30px;
            line-height: 30px;
            padding-left: 5px;
            padding-right: 5px;
            border-bottom: 1px solid #ccc;

            &:first-child {
                width: 100px;
                text-align: right;
                background: #d6fafa;
                border-bottom: 1px solid #ccc;
            }

            &:last-child {
                width: calc(100% - 100px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

    .tips {
        width: 100%;
        height: 30px;
        display: flex;
        align-items: center;
        font-weight: 600;

        .rect {
            display: flex;
            width: 14px;
            height: 14px;
            border: 1px solid #ccc;
            background: #d6fafa;
            margin-right: 10px;
        }
    }

    .imgs {
        width: 100%;
        height: calc(100% - 180px);
        overflow-y: auto;
        display: flex;
        // justify-content: flex-start;
        flex-wrap: wrap;

        // flex-flow: row;
        img {
            width: 130px;
            margin: 10px;
            height: 130px;
        }
    }
}
</style>
