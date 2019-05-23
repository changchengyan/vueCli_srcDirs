<template>
    <div id="edit" v-if="showEditModel">
       <div class="editModel">
           <div class="model" :style="{height:height_?height_:'400px'}">
               <div class="title">
                   <span>{{title}}</span>
                   <img src="../../../assets/images/common/modelHidden.png" alt="" @click='hiddenSelf'>
               </div>
               <div class="content">
                   <slot></slot>
               </div>
               <div class="footer">
                   <div class="del" @click='hiddenSelf'>取消</div>
                   <div class="save" @click="saveInputs">保存</div>
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
 *     *                                          *
 *     *******************************************
 *     *      取消                        确认    *
 *     *******************************************
 */ 
export default {
  props: ['showEditModel','title','height_'],
  data() {
    return {};
  },
  methods:{
      hiddenSelf(){
          this.$emit('hiddenSelf',false)
      },
      saveInputs(){
          this.$emit('saveUper',false)
      }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
#edit {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 100;
  .editModel {
    width: 100%;
    height: 100%;
    .model {
      width: 50%;
      // height: 400px;
      min-width: 600px;
      position: absolute;
      top: 30%;
      left: 50%;
      border-radius: 10px;
      background: #fff;
      margin-top: -150px;
      margin-left: -25%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
      .title {
        height: 40px;
        line-height: 40px;
        text-align: right;
        background: #2a91db;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        font-size: 18px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
      }
      .content {
        width: 100%;
        height: calc(100% - 100px);
        overflow-y: auto;
        padding: 10px 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #e3e3e3;
        height: 70px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        & > div {
          height: 40px;
          line-height: 40px;
          color: #fdfdff;
          font-size: 18px;
          padding: 0 40px;
          background: #ccccce;
          border-radius: 5px;
          margin-left: 25px;
          cursor: pointer;
          &:last-child{
              background: #2a91db;
          }
        }
      }
    }
  }
}
</style>

