<template>
    <div id="tabsToggle">
        <div class="top-actions">
            <div class="prev" @click="prev" :class="{notAllow:startStop}">
                <i class="el-icon-arrow-left"></i>
            </div>
            <div class="tabs-wrap">
                <template v-if="list&&list.length>0">
                    <div class="inner-wrap" :style="{left:rockCount*100+'px'}">
                        <div class="tabItem" v-for="(val,index) in list"  :key="index" @click="selectThis(index,val)" :class="{activTab:index===activedTabIndex,notAllow:val.flag==false}">
                            <span>{{val.name}}</span>
                        </div>
                    </div>
                </template>
            </div>
            <div class="next" @click="next" :class="{notAllow:endStop}">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <div class="main-content">
           <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'tabsToggle',
        props:['tabList'],
        data(){
            return{
                rockCount:0, //记录左右晃动的次数，负数为左，正数为右
                activedTabIndex:0, //当前激活的tab
                list:[],
                startStop:false,
                endStop:true
            };
        },
        methods:{
          prev(){
              let len = this.list?this.list.length:0;
              if(len<=1){
                  return;
              }
              if(this.rockCount<-(len-2)){
                  this.startStop = true;
                  return;
              }
             this.rockCount = this.rockCount-1;
              this.endStop = false;

          },
          next(){
              let len = this.list?this.list.length:0;
              if(len<=1){
                  return;
              }
              if(this.rockCount>-1){
                  this.endStop = true;
                  return;
              }
              this.rockCount = this.rockCount+1;
              this.startStop = false;

          }, 
          selectThis(index,val){
              if(!val.flag){
                  return ;
              }
              this.activedTabIndex = index;
              this.$emit('myActivedIndex',{activedIndex:index,flag:true});
          },
          fromFather(list){
              this.list = list;
          },
          fromFather_activedTab(obj){
              let temp_len = obj.leftIds.length;

              if(this.funTool.indexOf(obj.leftIds,obj.index)>-1){
                  this.activedTabIndex = obj.index;
              }else{
                  this.activedTabIndex = (obj.leftIds).length==0?0:( parseInt((obj.leftIds)[temp_len-1])-1);
              }

          },
          activedTab_reduce(index){
              this.activedTabIndex= index;
              this.$emit('myActivedIndex',{activedIndex:index,flag:false});

          }
        },
        created() {
            this.list = this.tabList;
        }
    };
</script>

<style scoped lang="scss">
#tabsToggle{
    width: 100%;
    height: 100%;

    .top-actions{
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        border-bottom: 1px solid #ccc;
        font-size:16px;
        .prev,.next{
            width: 30px;
            height: 100%;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
            /*background: #1bcbf1;*/
            color: #fff;
            &:hover{
                background: #1edff9;
            }
            &.notAllow{
                background: gray;
                cursor: not-allowed;
                i{
                    color: #fff;
                }
            }
            i{
                color: #333;
            }
        }
        .tabs-wrap{
            width: calc(100% - 60px);
            height: 100%;

            overflow-x: hidden;
            position: relative;
            transition: all .5s ease-in-out;
            .inner-wrap{
                position: absolute;
                top: 0;
                height: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .tabItem{
                    width: 100px;
                    height: 100%;
                    text-align: center;
                    line-height: 30px;
                    font-weight: 600;
                    border-right: 1px solid #fff;
                    cursor: pointer;
                    font-weight: 600;
                    &.notAllow{
                        color: gray;
                        cursor: not-allowed;
                    }
                    &.activTab{
                        background: #04a4fa;
                        color: #fff;
                    }
                }
            }
        }
    }
    .main-content{
        width: 100%;
        height: calc(100% - 45px);
    }

}
</style>