<template>
    <div id="separatingTabs">
        <div class="tabs-wrap">
            <div class="tabItem" v-for="(val,index) in tabs" :key="index" :class="{actived:index==activedTabIndex}" @click="thisTab(index)">
                <span>{{val}}</span>
            </div>
        </div>
        <div class="sub-main">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'separatingTabs',
        props:['tabs','id'],
        data(){
            return{
                activedTabIndex:0,
            };
        },
        methods:{
            thisTab(index){
                this.activedTabIndex = index;
                this.$emit('separatingTabIndex',index);
            }
        }
    };
</script>

<style scoped lang="scss">
#separatingTabs{
    width: 100%;
    height: 100%;
    padding: 10px;
    .tabs-wrap{
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: flex-start;
        .tabItem{
            width: 100px;
            margin-right: 10px;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
            &.actived{
                background: #0b83fe;
                color: #fff;
            }
        }

    }
    .sub-main{
        width: 100%;
        height: calc(100% - 30px);
    }


}
</style>