<template>

    <div id="siteMonitor">
        <r-table-card :tabs_="tabList" :activedIndex="activedTabIndex" @activedIndex="toggleThisTab">

            <template v-if="activedTabIndex==0" >
                <all-sites :siteId="siteId" @hiddenAside="hiddenMenu" @showAside="showMenu"/>
            </template>
            <template v-if="activedTabIndex==1" >
                <water-quality :siteId="siteId" @hiddenAside="hiddenMenu" @showAside="showMenu" />
            </template>
            <template v-else-if="activedTabIndex==2" >
                <water-press :siteId="siteId" @hiddenAside="hiddenMenu" @showAside="showMenu" />
            </template>
            <template v-else-if="activedTabIndex==3" >
                <water-flow :siteId="siteId" @hiddenAside="hiddenMenu" @showAside="showMenu" />
            </template>

        </r-table-card>
    </div>

</template>

<script>

    import RTableCard from '../../common/components/tabs/r_tableCard';
    import WaterQuality from './sites/waterQuality';
    import WaterPress from './sites/waterPress';
    import WaterFlow from './sites/waterFlow';
    import AllSites from './sites/allSites';

    import {mapGetters,mapMutations} from 'vuex';
    export  default {
        components: {AllSites, WaterFlow, WaterPress, WaterQuality, RTableCard},
        data(){
            return{
                tabList:[{name:'全部'},{name:'水质'},{name:'水压'},{name:'流量'}],
                activedTabIndex:0, //默认激活全部
                siteId:'', //站点的ID
            };
        },
        methods:{
            toggleThisTab(index){
                this.activedTabIndex = index;
                this.$store.commit('set_siteTabs_activedIndex',index);
            },
            ...mapMutations({
                'set_siteTabs_activedIndex':'set_siteTabs_activedIndex'
            }),
            hiddenMenu(){
                this.$emit('hiddenAside');
            },
            showMenu(){
                this.$emit('showAside');
            }
        },
        computed:{
            ...mapGetters({
                'activedTab_index':'get_siteTabs_activedIndex'
            })

        },
        created() {
            this.activedTabIndex = this.activedTab_index;
        }


    };

</script>

<style scoped lang="scss">
#siteMonitor{
    width: 100%;
    height: 100%;
}


</style>