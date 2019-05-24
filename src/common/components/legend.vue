<template>
    <div id="legend">
        <template v-if="legendFlag">
            <div class="main-content">
                <div class="top-head">
                    <span>图例</span>
                    <i v-if="legendFlag" class="el-icon-close" @click="closeLegend"></i>
                </div>
                <slot></slot>
            </div>
        </template>
        <template v-else>
            <span class="cicle-legend" @click="showLegend">{{defualName?defualName:'图例'}}</span>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'legendModel',
        props:['defualName'],
        data(){
            return{
                legendFlag:true
            };
        },
        methods:{
            closeLegend(){
                this.legendFlag = false;
            },
            showLegend(){
                this.legendFlag = true;
            }
        }
    };
</script>

<style scoped lang="scss">
#legend{
    position: relative;
    padding-top: 10px;

    .main-content{
        width: 100%;
        background: #fff;
        .top-head{
            width: 100%;
            text-align: center;
            position: relative;
            font-size: 14px;
            font-weight: 600;
            border-bottom: 1px solid #ccc;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            background: #0b83fe;
            padding:  0 10px;
            height: 30px;
            i{
                display: inline-block;
                cursor: pointer;
                font-size: 16px;
            }
        }
    }
    .cicle-legend{
        display: inline-block;
        line-height: 60px;
        height: 60px;
        width: 60px;
        background: #0b83fe;
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
        text-align: center;
    }
}
</style>