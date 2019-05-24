<template>
    <div id="projectMsg">
        <tabs-underline @tab_line_index="activedTab" :tabs="tabList" ref="tabsUnderline">
            <template v-if="tabList&&tabList.list.length>0">
                <template v-if="tabIndex==0">
                    <div class="table-card">
                        <div class="row">
                            <table  class="innerTable">
                                <thead>
                                <tr>
                                    <th colspan="6"><span>水量数据</span></th>
                                </tr>
                                <tr>
                                    <th><span>单位</span></th>
                                    <th><span>昨日取水量(万方)</span></th>
                                    <th><span>同比</span></th>
                                    <th><span>昨日供水量(万方)</span></th>
                                    <th><span>同比</span></th>
                                    <th><span>自用水率</span></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><span>一水厂</span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                </tr>
                                <tr>
                                    <td><span>二水厂</span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                </tr>
                                <tr>
                                    <td><span>绿化泵站</span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                </tr>
                                <tr>
                                    <td><span>总水量</span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                    <td><span></span></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="row">
                            <table  class="innerTable">
                                <thead>
                                <tr>
                                    <th colspan="2"><span>水位数据</span></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><span>黄河水位(m)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>鸭子荡水库水位(m)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>当前库容(万方)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>可用库容(万方)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="row">
                            <table  class="innerTable">
                                <thead>
                                <tr>
                                    <th colspan="2"><span>今日水质</span></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><span>原水浊度(NTU)</span></td>
                                    <td><span>12</span></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>
                <template v-if="tabIndex==1">
                    <div class="table-card">
                        <table  class="innerTable">
                            <thead>
                            <tr>
                                <th colspan="3"><span>水库列表</span></th>
                            </tr>
                            <tr>
                                <th><span>单位</span></th>
                                <th><span>水位(m)</span></th>
                                <th><span>浊度(NTU)</span></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td><span>鸭子荡水库</span></td>
                                <td><span>1234.85</span></td>
                                <td><span>2.85</span></td>
                            </tr>
                            <tr>
                                <td><span>鸭子荡水库</span></td>
                                <td><span>1234.85</span></td>
                                <td><span>2.85</span></td>
                            </tr>
                            <tr>
                                <td><span>鸭子荡水库</span></td>
                                <td><span>1234.85</span></td>
                                <td><span>2.85</span></td>
                            </tr>
                            <tr>
                                <td><span>鸭子荡水库</span></td>
                                <td><span>1234.85</span></td>
                                <td><span>2.85</span></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
                <template v-if="tabIndex==2">
                    <div class="table-card">
                        <div class="row">
                            <table  class="innerTable">
                                <thead>
                                <tr>
                                    <th colspan="2"><span>一水厂</span></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><span>取水瞬时流量(m³/h)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>今日取水量(m³)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>供水瞬时流量(m³/h)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>今日取水量(m³)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>供水压力(Mpa)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>供水浊度(NTU)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>供水余氯(mg/L)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="row">
                            <table  class="innerTable">
                                <thead>
                                <tr>
                                    <th colspan="2"><span>二水厂</span></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><span>取水瞬时流量(m³/h)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>今日取水量(m³)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>供水瞬时流量(m³/h)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>
                <template v-if="tabIndex==3">
                    <div class="table-card">
                        <div class="row">
                            <table  class="innerTable">
                                <thead>
                                <tr>
                                    <th colspan="4"><span>大用水户列表</span></th>
                                </tr>
                                <tr>
                                    <th><span>单位</span></th>
                                    <th><span>上月用水量(万方)</span></th>
                                    <th><span>今年累计用水量(万方)</span></th>
                                    <th><span>上年累计用水量(万方)</span></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><span>xx公司</span></td>
                                    <td><span>1234.85</span></td>
                                    <td><span>取水瞬时流量(m³/h)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>xx公司</span></td>
                                    <td><span>1234.85</span></td>
                                    <td><span>取水瞬时流量(m³/h)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>xx公司</span></td>
                                    <td><span>1234.85</span></td>
                                    <td><span>取水瞬时流量(m³/h)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>
                <template v-if="tabIndex==4">
                    <div class="table-card">
                        <div class="row">
                            <table  class="innerTable">
                                <thead>
                                <tr>
                                    <th colspan="4"><span>大用水户列表</span></th>
                                </tr>
                                <tr>
                                    <th><span>单位</span></th>
                                    <th><span>上月用水量(万方)</span></th>
                                    <th><span>今年累计用水量(万方)</span></th>
                                    <th><span>上年累计用水量(万方)</span></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><span>xx公司</span></td>
                                    <td><span>1234.85</span></td>
                                    <td><span>取水瞬时流量(m³/h)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>xx公司</span></td>
                                    <td><span>1234.85</span></td>
                                    <td><span>取水瞬时流量(m³/h)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                <tr>
                                    <td><span>xx公司</span></td>
                                    <td><span>1234.85</span></td>
                                    <td><span>取水瞬时流量(m³/h)</span></td>
                                    <td><span>1234.85</span></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>
                <template v-if="tabIndex==5">
                    <div class="table-card">
                        <div class="row">
                            <table  class="innerTable">
                                <thead>
                                <tr>
                                    <th colspan="5"><span>计量间列表</span></th>
                                </tr>
                                <tr>
                                    <th><span>计量间</span></th>
                                    <th><span>用户</span></th>
                                    <th><span>计量设备</span></th>
                                    <th><span>瞬时流量(m³/h)</span></th>
                                    <th><span>累计流量(m³/h)</span></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><span>C点计量间</span></td>
                                    <td><span>新材料园区</span></td>
                                    <td><span>DN600电磁水表</span></td>
                                    <td><span>460</span></td>
                                    <td><span>2345</span></td>
                                </tr>
                                <tr>
                                    <td rowspan="3"><span>A1计量间</span></td>
                                    <td><span>A公司</span></td>
                                    <td><span>DN200超声水表</span></td>
                                    <td><span>320</span></td>
                                    <td><span>1234</span></td>
                                </tr>
                                <tr>
                                    <td><span>B公司</span></td>
                                    <td><span>DN200超声水表</span></td>
                                    <td><span>320</span></td>
                                    <td><span>1234</span></td>
                                </tr>
                                <tr>
                                    <td><span>C公司</span></td>
                                    <td><span>DN200超声水表</span></td>
                                    <td><span>320</span></td>
                                    <td><span>1234</span></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>
            </template>
        </tabs-underline>
    </div>
</template>

<script>
    import TabsUnderline from '../../common/components/tabsUnderline';
    import {mapGetters} from 'vuex';
    export default {
        name: 'projectMsg',
        components: {TabsUnderline},
        data(){
            return{
                tabList:null,
                tabIndex:0, //默认的激活页签
            };
        },
        computed:{
            ...mapGetters({
               'get_sunTab_project' :'get_sunTab_project'
            })
        },
        methods:{
            fromFather(obj){
                let that = this;
                this.tabList = obj;
                this.tabIndex = obj.currentIndex -1;
                that.$refs.tabsUnderline.fromFather(obj);
            },
            activedTab(index){
                this.tabIndex = index ;
            }
        },
        created() {
            this.tabList = {list:this.get_sunTab_project,leftIds:[]} ;
        }
    };
</script>

<style scoped lang="scss">
#projectMsg{
    width: 100%;
    height: 100%;
    table{
        thead{
            tr{
                th:first-child{
                   border-bottom: 1px solid #ccc;
                }
            }
        }
    }
    .table-card{
        width: 100%;
        height: 100%;
        .row{
            margin-bottom: 10px;
        }
    }

}
</style>