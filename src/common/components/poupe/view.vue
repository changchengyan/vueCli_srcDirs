<template>
    <div id="view" v-if="showViewModel">
       <div class="viewModel">
           <div class="model" :style="{width:wd?wd:'50%', height:ht?ht:''}">
               <div class="title">
                   <span>{{title}}</span>
                   <img src="../../../assets/images/common/modelHidden.png" alt="" @click='hiddenSelf'>
               </div>
               <div class="content" :style="{height:cht?cht:''}">
                   <slot></slot>
               </div>
           </div>
       </div>
    </div>
</template>


<script>

/**
 *     ********************************************
 *     *   title                               X  *
 *     * *****************************************
 *     *                                          *
 *     *                                          *
 *     *           <slot></slot>                  *
 *     *                                          *
 *     *                                          *
 *     *                                          *
 *     *******************************************
 */    
export default {
  props: ['showViewModel','title','wd','ht','cht'],
  data() {
    return {};
  },
  methods:{
      hiddenSelf(){
          this.$emit('hiddenSelf',false)
      },
      
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
#view {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 100;
  .viewModel {
    width: 100%;
    height: 100%;
    padding-top: 8%;
    .model {
      // height: 360px;
      // max-height: 450px;
    //   min-width: 600px;
      // position: absolute;
      // top: 15%;
      // left: 50%;
      margin: 0 auto;
      border-radius: 10px;
      background: #fff;
      // overflow: auto;
      // margin-top: -180px;
      // margin-left: -25%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
      .title {
        height: 40px;
        line-height: 40px;
        text-align: right;
        background: #2a91db;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        font-size: 16px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        img{
          width: 16px;
          cursor: pointer;
        }
      }
      &>.content {
        width: 100%;
        // overflow-y: auto;
        // padding: 10px 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>

