<template>
    <div id="cardTab">
        <div class="tabsList_">
            <template v-if="tabs_.length>0">
                <div class="tabItem" :class="{actived:activedIndex_==index}" @click="getThisTab(index)" v-for="(item,index) in tabs_" :key="index" >
                    <span>{{item.name}}</span>
                </div>
            </template>
        </div>
        <div class="wrap-card">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props:['tabs_','activedIndex'],
        name:'rTableCard',
        data(){
            return{
                activedIndex_:0,
            };
        },

        methods:{
            getThisTab(index){
                this.activedIndex_ = index;
                this.$emit('activedIndex',index);
            }
        },
        created(){
            this.activedIndex_ = this.activedIndex;
        }
    };
</script>

<style lang="scss" scoped>
    #cardTab {
        width: 100%;
        height: 100%; // background: #ccc;
        padding: 20px;
        padding-top: 0;
        font-size: 14px;
        color: #333;

        .tabsList_ {
            width: 100%;
            height: 40px;
            display: flex;
            justify-content: flex-start;
            align-items: flex-end;

            .tabItem {
                display: inline-block;
                padding: 0px 30px;
                line-height: 30px;
                border: 1px solid #ccc;
                border-bottom: none;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                margin-right: 10px;
                cursor: pointer;
                background: #fff;

                &.actived {
                    background: #0b83fe;
                    border: 1px solid #0b83fe;
                    color: #fff;
                }
            }


        }
        .wrap-card {
            width: 100%;
            height: calc(100% - 40px);
            border: 1px solid #0b83fe;
            border-radius: 5px;
            // padding-top: 10px;
        }

    }
</style>
