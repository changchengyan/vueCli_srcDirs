<template>
    <div id="tabsUnderline">
        <div class="tabs">
            <template v-if="list.length>0">
                <div class="tabItem" v-for="(val,index) in list" :key="index" @click="activedTab(index,val)" :class="{actived:index===activedTabIndex,notAllow:val.flag==false}">
                    <span>{{val.name}}</span>
                </div>
            </template>

        </div>
        <div class="sub-content">
           <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'tabsUnderline',
        props:['tabs'],
        data(){
            return{
                activedTabIndex:0,
                list:[]
            };
        },
        methods:{
            activedTab(index,val){
                if(!val.flag){
                    return ;
                }
                this.activedTabIndex = index;
                this.$emit('tab_line_index',index);
            },
            fromFather(obj){
                this.list = obj.list;
                this.activedTabIndex = obj.currentIndex -1<0?0:obj.currentIndex - 1;
            }
        },
        created() {
            this.list = this.tabs?this.tabs.list : [] ;
        }
    };
</script>

<style scoped lang="scss">
#tabsUnderline{
    width: 100%;
    height: 100%;
    .tabs{
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0 10px;
        font-size: 14px;
        margin-bottom: 5px;
        .tabItem{
            margin-right: 15px;
            font-weight: 600;

            span{
                line-height: 28px;
            }
            cursor: pointer;
            &.notAllow{
                color: gray;
                cursor: not-allowed;
            }
            &.actived{
                border-bottom: 2px solid #0b83fe;
            }
        }
    }
    .sub-content{
        width: 100%;
        height: calc(100% - 30px);
        overflow: auto;
        overflow-x: hidden;
    }
}
</style>