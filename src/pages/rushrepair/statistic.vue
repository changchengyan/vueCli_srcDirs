<template>
<div id="statistic">
    <div class="tabs">
        <div class="tabItem" :class="{actived:index==activedTab}" @click="showThisTab(index)" v-for="(item,index) in tabs" :key="index">{{item.name}}</div>
    </div>
    <router-view></router-view>
</div>
</template>

<script>
export default {
    data() {
        return {
            tabs: [{
                    name: "巡检统计"
                },
                {
                    name: "绩效统计"
                }
            ],
            activedTab: 0,
        };
    },
    methods: {
        showThisTab( index){
            this.activedTab = index;
            if(index==0){
                this.$router.push({
                    name:"pipe_rushrepair_statistic_routing_statistic"
                })
            }else{
                 this.$router.push({
                    name:"pipe_rushrepair_statistic_performance"
                })
            }
        }

    },
    mounted() {
        this.loading = false;
    },
    created() {

    }
}
</script>

<style lang="scss" scoped>
$baseFont:14px;
$baseColor:#333;
$baseBorderColor:#ccc;
#statistic {
    width: 100%;
    height: 100%;
    padding: 10px;
    font-size: 14px;
    color: #333;
    .tabs {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        .tabItem {
            display: inline-block;
            padding: 10px 25px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-right: 20px;
            cursor: pointer;
            &.actived {
                background: #3a8ee6;
                color: #fff;
            }
        }
    }
    .year,
    .month {
        width: 100%;
        margin: 10px;
    }
}
</style>
