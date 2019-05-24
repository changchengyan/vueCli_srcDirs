<template>
    <div id="addDeves">
        <div class="top-actions">
            <div class="back">
                <span class="go-back" @click="goback">返回</span>
            </div>
        </div>
        <div class="sub-content">
            <span>主要内容</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'addDeves',
        data(){
            return{

            };
        },
        methods:{
            goback(){
                this.$router.push({
                    name: 'devStandingBook'
                });
                this.$store.commit('set_asideStatus', true);
                this.$emit('showAside');
            }
        }
    };
</script>

<style scoped lang="scss">
#addDeves{
    width: 100%;
    height: 100%;
    .top-actions{
        width: 100%;
        height: 50px;
        padding: 10px 10px;
        position: relative;
        .back{
            width: 80px;
            height: 30px;
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10;
            text-align: center;
        }
    }
    .sub-content{
        width: 100%;
        height: calc(100% - 50px);
    }

}
</style>