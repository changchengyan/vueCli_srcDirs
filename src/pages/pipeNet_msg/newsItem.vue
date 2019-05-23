<template>
    <div id="newsItem" >
        <div class="title">
            {{news.TITLE}}
        </div>
        <div class="back" @click="back">
            <span>返回</span>
        </div>
        <div class="row">
            <div class="col">
                <span>部门:{{news.DEPT_NAME}}</span>
            </div>
            <div class="col">
                <span>发表时间:{{news.PUBLISH_TIME}}</span>
            </div>
        </div>
        <div class="news-content ql-editor" v-html="news.CONTENT"> </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            news:{}
        }
    },
    methods:{
        back(){
            this.$router.push({
                name: "pipeNet_home_city_EditNotify"
            });
            this.$store.commit("setAside_status", true);
            this.$emit("showAside");
        }
    },
    created(){
        this.news = this.$store.getters.get_newsItem;
    }
}
</script>

<style lang="scss">
    #newsItem{
        width: 100%;
        height: 100%;
        padding: 20px;
        color: #333;
        font-size: 16px;
        position: relative;
        .title{
            width: 100%;
            height: 40px;
            font-size: 30px;
            font-weight: 600;
            text-align: center;
        }
        .row{
            width: 100%;
            height: 30px;
            display: flex;
            justify-content: space-between; 
        }
        .news-content{
            width: 100%;
            height: calc(100% - 100px);
            overflow-y: hidden;
            text-indent:2em;
            line-height: 30px;
        }
        .back{
            position: absolute;
            top: 10px;
            left: 20px;
            span{
                display: inline-block;
                padding: 5px 20px;
                background: #fe8a01;
                border-radius: 5px;
                cursor: pointer;
                color: #fff;
            }
        }
    }
</style>


