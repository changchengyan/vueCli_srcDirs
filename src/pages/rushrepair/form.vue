<template>
  <div id="form">
    <standard-form @goback="goBack"></standard-form>
  </div>
</template>

<script>
import standardForm from "./dangerForm/standard.vue";
export default {
  components: {
    standardForm
  },
  data() {
    return {};
  },
  methods: {
    goBack(str) {
      let that = this;
      this.$router.push({
        name: "pipe_rushrepair_hiddenDanger"
      });
      that.$store.commit("setAside_status", true);
      that.$emit("showAside");
      sessionStorage.setItem("dispatchFlag", "false");
    }
  },
  created() {},
  beforeDestroy() {
    sessionStorage.setItem("dispatchFlag", "false");
  }
};
</script>

<style lang="scss" scoped>
#form {
  width: 100%;
  height: 100%;
}
</style>
