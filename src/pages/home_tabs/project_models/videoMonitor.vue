<template>
    <div id="videoMonitor">
       <live-video :videoList_="videoList"/>
    </div>
</template>

<script>
    import LiveVideo from '../../../common/components/liveVideo';
    export default {
        name: 'videoMonitor',
        components: {LiveVideo},
        data(){
            return{
                videoList:[]
            };
        }
    };
</script>

<style scoped lang="scss">
    #videoMonitor{
        width: 100%;
        height: 100%;

    }
</style>