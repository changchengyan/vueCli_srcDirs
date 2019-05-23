<template>
    <div id="selectTime">
        <div class="inner-wrap" :style="{borderColor:borderColor}">
            <div class="f-select years" @click="showSub">
                <span class="currentYear">{{current}}</span>
                <i class="icon">↓</i>
                <div class="subYears" v-show="showList">
                    <div class="item year" v-for="(item,index) in list" :key="index" @click.stop="select(item)">
                        {{item}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: ["list",'current','borderColor'],
  data() {
    return {
        showList:false
    };
  },
  methods: {
    showSub() {
        this.showList = true;
    },
    select(item) {
        this.$emit('showThis',item);
        this.showList = false;
    }
  },
  created() {
   
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
#selectTime {
  width: 100%;
  // padding-top: 10px;
  .inner-wrap {
    width: 80px;
    display: flex;
    justify-content: space-between;
    border-width: 1px ;
    border-style: solid;
    border-radius: 5px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #fff;
    cursor: pointer;
    .f-select {
      width: 100%;
      border-right: 1px solid #ccc;
      position: relative;
      &:last-child {
        border-right: none;
      }
      .subYears {
        width: 100%;
        height: 100px;
        position: absolute;
        top: 30px;
        left: 0;
        z-index: 1000;
        overflow-y: auto;
        background: #fff;
        border: 1px solid #ccc;
        .item:hover {
          background: #007dff;
          color: #fff;
        }
      }
    }
  }
}
</style>


