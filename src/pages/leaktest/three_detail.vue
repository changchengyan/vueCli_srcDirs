<template>
  <div id="three_detail">
    <h1>我是三级分区详情</h1>
    <button @click="goback">返回</button>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    goback() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
#three_detail {
  width: 100%;
  height: 100%;
}
</style>

