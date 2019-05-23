<template>
    <div id="zoningTree">
        <div class="topHead">
            <div>固原市管网</div>
            <span @click="goHome">返回</span>
        </div>
        <div id="gis">
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        goHome(){
            this.$router.push({
                name: "pipe_leaktest_zoning_map"
            });
            // this.$store.commit("setAside_status", true);
            // this.$emit("showAside");
        }
    }
}
</script>
<style lang="scss" scoped>
#zoningTree{
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 14px;
    .topHead{
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: center;
        background: #ccc;
        align-items: center;
        span{
            display: inline-block;
            padding: 4px 5px;
            background: red;
            position: absolute;
            right: 20px;
            top: 4px;
            cursor: pointer;
            color: #fff;
        }
    }
    #gis{
        width: 100%;
        height: 100%;
        position: relative;
        .demo{
            width: 100px;
            height: 100px;
            background: blue;
            position: absolute;
            top: 50%;
            left: 50%;
            color: #fff;
            text-align: center;
            line-height: 100px;
            cursor: pointer;
        }
    }
}

</style>


