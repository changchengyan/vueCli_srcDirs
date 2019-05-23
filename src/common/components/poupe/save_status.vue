<template>
    <div id="save_status" v-if='showModel'>
        <div class="wrap-model">
            <div class="model">
                <div class="title">
                    <span class="title-str">温馨提示</span>
                    <img src="../../../assets/images/common/modelHidden.png" alt="" @click='hiddenSelf'>
                </div>
                <template v-if='type'>
                    <template v-if='flag'>
                        <div class="content" style='height:calc(100% - 30px)'>
                            <img src="../../../assets/images/common/autoModel_seccess.png" alt="">
                            <div class="tips">{{content||""}}</div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="content" style='height:calc(100% - 30px)'>
                            <img src="../../../assets/images/common/autoModel_fail.png" alt="">
                            <div class="tips">{{content||""}}</div>
                        </div>
                    </template>
                </template>
                <template v-else>
                    <div class="content" style='justify-content: flex-start;padding-top: 20px'>
                        <img src="../../../assets/images/common/delConfig.png" alt="">
                        <div class="tips">{{definedContent||"您确认删除吗?"}}</div>
                    </div>
                </template>
                <template v-if='!type'>
                    <div class="footer">
                        <span class='cancel' id='cancel' @click="hiddenSelf">{{noText||"取消"}}</span>
                        <span class='config' id='config' @click="telUper_del">{{yesText||"删除"}}</span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>


<script>
export default {
  /**
   * 组件名字 根据需要  可以自己命名 我建议  命名 saveModel或者editModel
   * type: 如果为true,则显示保存成功或失败的 弹窗 ,如果为false 则显示是否删除的弹窗
   * flag: 在 type 为 true  的情况下 false则表示为保存失败，true 则保存成功
   * content  在 type 为true的情况下，当前的保存状态  内容从ajax接口中获取
   * noText 在 type 为false 的情况下 也就是删除的弹窗 中代表取消删除的按钮  默认显示为取消
   * yesText 在 type 为false 的情况下 也就是删除的弹窗 中代表取消确定的按钮  默认显示为确定
   * delNum 表示 在  type为false 的情况下，返回给父组件 要删除的索引
   * showModel 父组件用来开关弹窗
   *
   *
   *     ********************************************
   *     *   title                               X  *
   *     * ******************************************
   *     *                                          *
   *     *                                          *
   *     *            <img /> 您确定删除吗？         *
   *     *                                          *
   *     *                                          *
   *     *                                          *
   *     *                                          *
   *     *******************************************
   *     *      取消                        确认    *
   *     *******************************************
   *
   *     * ******************************************
   *     *   title                               X  *
   *     * ******************************************
   *     *                                          *
   *     *                                          *
   *     *            <img />  保存成功？ 失败       *
   *     *                                          *
   *     *                                          *
   *     *                                          *
   *     *                                          *
   *     *******************************************
   *
   *
   */
  props: [
    "showModel",
    "delNum",
    "type",
    "flag",
    "noText",
    "yesText",
    "content",
    "definedContent"
  ],
  data() {
    return {};
  },
  methods: {
    hiddenSelf() {
      this.$emit("delThis", { modelFlag: false });
    },
    telUper_del() {
      let that = this;
      that.$emit("sureDelThis", { num: that.delNum });
    }
  },
  updated() {
    let that = this;
    if (that.showModel && that.type) {
      setTimeout(() => {
        that.hiddenSelf();
      }, 2 * 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
#save_status {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 100;
  .wrap-model {
    width: 100%;
    height: 100%;
    .model {
      width: 260px;
      height: 136px;
      /*border: 1px solid #ccc;*/
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -130px;
      margin-top: -68px;
      background: #fff;
      /*border-radius: 10px;*/
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
      .title {
        width: 100%;
        padding: 0 20px;
        height: 30px;
        line-height: 30px;
        background: #2a91db;
        text-align: left;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-weight: 700;
        font-size: 14px;
        img {
          cursor: pointer;
          /*position: absolute;*/
          /*right: 10px;*/
          /*top: 5px;*/
          width: 16px;
          height: 16px;
        }
      }
      .content {
        width: 100%;
        padding: 0 20px;
        /*padding-top: 20px;*/
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        img {
          display: block;
          width: 30px;
          height: 30px;
          /*margin-bottom: 20px;*/
          margin-right: 10px;
        }
        & > div.tips {
          font-size: 14px;
          /*font-weight: 600;*/
          color: #333;
        }
      }
      .footer {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 0 10px 12px;
        display: flex;
        align-items: center;
        color: #fff;
        justify-content: flex-end;
        span {
          display: block;
          background: #ccccce;
          cursor: pointer;
          height: 28px;
          line-height: 28px;
          margin: 0 6px;
          padding: 0 15px;
          border: 1px solid #dedede;
          border-radius: 2px;
          font-weight: 400;
          color: #fff;
          &.config {
            background: #2a91db;
          }
        }
      }
    }
  }
}
</style>

