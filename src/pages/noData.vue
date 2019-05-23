<template>
    <div id="noData">
        <div class="tips">
            <img src="../assets/images/common/noData.png" alt="">
            <span>您未配置任何功能,请联系管理员</span>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    }
}
</script>

<style lang="scss" scoped>
#noData{
    width:100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .tips{
        width: 300px;
        height: 40px;
        font-size: 20px;
        font-weight: 600;
        color: red;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img{
            margin-bottom: 20px;
        }
    }
}
</style>


