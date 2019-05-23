<template>
    <div id="preview">
        <div class="top-tips" @click="goback">
            返回
        </div>
        <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" :src="prev_view+'https://cdn.mozilla.net/pdfjs/tracemonkey.pdf'" ></iframe>
        <!-- <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" src="/static/pdfjs/web/viewer.html?file=C:\Users\Administrator\Downloads\王忠燕.pdf" ></iframe> -->
    </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      page: 1,
      numPages: 0,
      prev_view:""
    };
  },
  methods: {
    printPdf() {
      this.$refs.myPdfComponent.print();
    },
    pre() {
      let temp_page = parseInt(this.page);

      if (temp_page > 2) {
        temp_page--;
      } else {
        temp_page = 1;
      }
      this.page = temp_page;
    },
    next() {
      let temp_page = parseInt(this.page);
      let temp_numPages = parseInt(this.numPages);
      if (temp_page < temp_numPages) {
        temp_page++;
      } else {
        temp_page = temp_numPages;
      }
      this.page = temp_page;
    },
    goback() {
      this.$router.go("-1");
      this.$store.commit("setAside_status", true);
      this.$emit("showAside");
    }
  },
  beforeDestroy() {
    this.$router.push({ name: "pipeNet_msg" });
    this.$store.commit("setAside_status", true);
    this.$emit("showAside");
  },
  created() {
    this.prev_view = this.DSE.onlinePrev;
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
#preview {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
  background: rgb(82, 86, 89);
  overflow-y: hidden;
  .top-tips {
    font-size: 14px;
    width: 50px;
    height: 50px;
    z-index: 100;
    color: #fff;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -25px;
    border: 1px solid #fff;
    line-height: 50px;
    text-align: center;
    border-radius: 50px;
    transition: all .5s;
    transform: translateX(-25px);
    cursor: pointer;
    &:hover{
      transform: translateX(25px);
    }
  }
  iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
  }
}
</style>


