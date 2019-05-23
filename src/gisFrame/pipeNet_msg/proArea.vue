<template>
<div id="proArea">
    <div class="row">
        <div class="col"><span>项目地址:</span></div>
        <div class="col"><span>{{buildMsg.areaName}}</span></div>
    </div>
    <div class="row">
        <div class="col"><span>项目名称:</span></div>
        <div class="col"><span>{{buildMsg.areaName}}</span></div>
    </div>
    <div class="row">
        <div class="col"><span>施工单位:</span></div>
        <div class="col"><span>{{buildMsg.buildTeam}}</span></div>
    </div>
    <div class="row">
        <div class="col"><span>开竣工时间:</span></div>
        <div class="col" :title="buildMsg.startDate+'-'+buildMsg.endDate" ><span>{{buildMsg.startDate+" "}} 至 {{" "+buildMsg.endDate}}</span></div>
    </div>
    <div class="row">
        <div class="col"><span>联系人:</span></div>
        <div class="col"><span>{{buildMsg.linkMan}}</span></div>
    </div>
    <div class="row">
        <div class="col"><span>联系方式:</span></div>
        <div class="col"><span>{{buildMsg.phone}}</span></div>
    </div>
    <div class="row">
        <div class="col"><span>现场描述:</span></div>
        <div class="col" :title="buildMsg.remark"><span>{{buildMsg.remark}}</span></div>
    </div>
    <div class="img-pics">
        <div class="name">
            <span class="rect"></span>
            <span>施工现场照片</span>
        </div>
        <div class="imgs">
            <template  v-if="buildMsg.file.length>0">
                 <img :src="staticPath+''+item.fileCompress" alt=""  v-for="(item,index) in buildMsg.file" :key="index">
            </template>
        </div>
    </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            staticPath:"",
            buildMsg: {
                areaColor: null,
                areaName: "",
                buildTeam: "",
                createTime: 0,
                createUser: "",
                endDate: "",
                id: "",
                linkMan: "",
                phone: "",
                planArea: "",
                probStatus: null,
                probType: "",
                reportTime: "",
                reportType: "",
                startDate: "",
                file: [],
                remark:""
            }
        }
    },
    created() {
        this.buildMsg = window.parent.dse.globalData;
        this.staticPath = window.parent.dse.globalData.staticFilePath
    }
}
</script>

<style lang="scss" scoped>
#proArea {
    width: 100%;
    height: 100%;
    padding: 20px;
    font-size: 14px;
    color: #333;

    .row {
        width: 100%;
        height: 30px;
        line-height: 30px;
        display: flex;
        justify-content: space-between;
        border-left: 1px solid #ccc;

        &:first-child {
            border-top: 1px solid #ccc;
        }

        .col {
            border-right: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            padding: 0 5px;

            &:first-child {
                text-align: center;
                width: 100px;
                background: #e3edef;
            }

            &:last-child {
                width: calc(100% - 100px);
                text-align: left;

                span {
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

    .img-pics {
        width: 100%;
        height: calc(100% - 210px);

        .name {
            width: 100%;
            line-height: 30px;
            height: 30px;
            display: flex;
            align-items: center;

            .rect {
                display: inline-block;
                width: 14px;
                height: 14px;
                background: #2db8bd;
                margin-right: 10px;
            }

        }

        .imgs {
            width: 100%;
            height: calc(100% - 30px);
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            overflow-y: auto;

            img {
                width: 100px;
                height: 100%;
                margin: 0 10px;
            }
        }
    }

}
</style>
