<template>
<div id="wrap">

</div>
</template>

<script>
export default {
    name: "Home",
    data() {
        return {
            timer: "",
            flag: false,
        };
    },
    methods: {},
    computed: {},
    mounted() {},
    created() {
        let that = this;
        
        that.timer = setInterval(() => {
            let temp_id = that.$store.getters.get_companyId;
            let temp_name= this.$store.getters.getCompyName;
            if(temp_name){
                clearInterval(that.timer);
            }
            let flag = temp_name.includes("集团");
              if (flag) {
                    // if (that.flag) {
                    that.$router.push({
                        name: "pipeNet_home_group",
                        params: {
                            id: ""
                        }
                    });
                } else {
                    that.$router.push({
                        name: "pipeNet_home_city",
                        params: {
                            id: "" + temp_id
                        }
                    });
                }
        }, 500)

    }
};
</script>

<style lang="scss" scoped>

</style>
