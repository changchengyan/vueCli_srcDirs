<template>

    <div id="dutyRecord">
        <h1>值班记事</h1>
        <div class="test">
            <calander-event />
        </div>
    </div>

</template>

<script>

    import CalanderEvent from '../../common/components/calanderEvent';
    export  default {
        components: {CalanderEvent},
        data(){
            return{

            };
        }

    };

</script>

<style scoped lang="scss">

#dutyRecord{
    width: 100%;
    height: 100%;
    .test{
        width: 100%;
        height: calc(100% - 40px);
    }
}

</style>