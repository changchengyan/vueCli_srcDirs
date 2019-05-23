<template>
  <div id="App">
    <!-- <img src="./assets/images/pipeNet_manage/home/map_bg.png" alt="" v-show='false'> -->
      <router-view></router-view>  
  </div>
</template>

<script >
export default {
  name: "App"
};
</script>


<style lang="scss">
@import 'normalize.css/normalize.css';
@import "@/assets/resetCss/resetApp.scss";
@import '@/assets/resetCss/resetHome.scss';
@import '@/assets/resetCss/pipeNet_msg/pipeNet_msg.scss';
@import '@/assets/resetCss/monitor/index.scss';
@import '@/assets/resetCss/rushrepair/index.scss';
@import "../static/pipeFont/iconfont.css";

#App{
  width: 100%;
  height: 100%;
}
</style>
