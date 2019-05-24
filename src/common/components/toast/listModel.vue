<template>
    <div id="listModel" v-if="modelShowFlag">
        <div class="model">
            <div class="top-head">
                <span>{{tips}}</span>
                <i class="el-icon-close" @click="closeModel"></i>
            </div>
            <div class="sub-wrap">
                <slot></slot>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'listModel',
        props:['list','tips'],
        data(){
            return{
                modelShowFlag:false
            };
        },
        methods:{
            closeModel(){
                this.modelShowFlag = false;
            },
            showModel(){
                this.modelShowFlag = true;
            }
        }
    };
</script>

<style scoped lang="scss">
#listModel{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.15);
    z-index: 100;
    position: fixed;
    left: 0;
    top: 0;
    .model{
        width: 400px;
        height: 600px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -300px;
        margin-left: -200px;
        overflow: auto;
        overflow-x: hidden;
        background: #fff;
        .top-head{
            width: 100%;
            height: 30px;
            line-height: 30px;
            text-align: center;
            position: relative;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #0b83fe;
            color: #fff;
            padding: 0 10px;
            i{
                cursor: pointer;
                font-size: 18px;
            }
        }
        .sub-wrap{
            width: 100%;
            height: calc(100% - 30px);
        }
    }
}
</style>