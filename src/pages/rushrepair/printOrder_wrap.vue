<template>
<div id="print">
    <div class="goBack">
        <span @click="goback">返回</span>
    </div>
    <iframe :src="url" frameborder="0" scrolling="no" ></iframe>
</div>
</template>

<script>
export default {
    data() {
        return {
            url: ""
        }
    },
    methods: {
        goback() {
            this.$router.push({
                name: "pipe_rushrepair_repair"
            });
            this.$store.commit("setAside_status", true);
            this.$emit("showAside");
        }
    },

    created() {
        let that = this;
        let temp_index = this.$route.params.index;
        if (temp_index) {
            sessionStorage.setItem("index", temp_index);
        } else {
            temp_index = sessionStorage.getItem("index");
        }
        this.url = `${this.DSE.baseURL}/?id=${id}&index=${temp_index}#/pipe/rushrepair/print_order`
        // window.open(that.url);
    }
}
</script>

<style lang="scss" scoped>
#print {
    width: 100%;
    height: 100%;
    font-size: 14px;

    .goBack {
        width: 100%;
        padding: 10px 10px;

        span {
            display: inline-block;
            padding: 5px 20px;
            border-radius: 5px;
            background: #ef8a01;
            color: #fff;
        }
    }

    iframe {
        width: 100%;
        height: calc(100% - 60px);
    }
}
</style>
