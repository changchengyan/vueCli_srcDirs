<template>
    <div id="bgModel" v-if="modelShowFlag">
        <div class="model" :style="{width:width_,height:height_,top:top_,left:left_}">
            <div class="top-head">
                <div class="col">
                    <span>{{tips}}</span>
                </div>
                <div class="col">
                    <i class="el-icon-zoom-in" @click="bg_sm"></i>
                    <i class="el-icon-close" @click="closeModel"></i>
                </div>
            </div>
            <div class="main-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'bgModel',
        props:['id','tips'],
        data(){
            return{
                modelShowFlag:true,
                width_:'60%',
                height_:'60%',
                top_:'20%',
                left_:'20%',
                bgToggleFlag:true, //默认变大
            };
        },
        methods:{
            closeModel(){
                this.modelShowFlag = false;
            },
            showModel(){
                this.modelShowFlag = true;
            },
            bg_sm(){
                this.bgToggleFlag = !this.bgToggleFlag;
                if(this.bgToggleFlag){
                    this.width_ = '60%';
                    this.height_ = '60%';
                    this.top_ = '20%';
                    this.left_ = '20%';
                }else{
                    this.width_='100%';
                    this.height_='100%';
                    this.top_='0%';
                    this.left_='0%';
                }

            }
        }
    };
</script>

<style scoped lang="scss">
#bgModel{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba(0,0,0,0.15);
    .model{
        position: absolute;
        background: #fff;
        .top-head{
            width: 100%;
            height: 40px;
            position: relative;
            font-size: 20px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            border-bottom: 1px solid #ccc;
            background: #0b83fe;
            color: #fff;
            .col{
                flex: 1;
                padding: 0 10px;
                &:last-child{
                    text-align: right;
                }
            }
            i{
                cursor: pointer;
                font-size: 14px;

            }
        }
        .main-content{
            width: 100%;
            height: calc(100% - 40px);
            overflow: auto;
        }
    }

}
</style>