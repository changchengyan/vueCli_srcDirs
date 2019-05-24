<template>
    <div id="msg">
        <tabs-underline @tab_line_index="activedTab" :tabs="tabList" ref="tabsUnderline">
            <div class="row-search">
                <span>监测点名称:</span>
                <el-input clearable v-model="searchStr"  placeholder="模糊搜索测点名字"></el-input>
            </div>
            <template v-if="tabList&&tabList.list.length>0">
                <template v-if="tabIndex==0">
                    <table-list :totalNum="totalPages" :currentPage="currentPage">
                        <thead>
                        <tr>
                            <th><span>监测点</span></th>
                            <th><span>监测值</span></th>
                            <th><span>正常值</span></th>
                            <th><span>时间</span></th>
                            <th><span>操作</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><span>1#</span></td>
                            <td><span>0.56m³/s</span></td>
                            <td><span>≤0.5m³/s</span></td>
                            <td><span>3-28 15:14</span></td>
                            <td><span>处理</span></td>
                        </tr>
                        <tr>
                            <td><span>1#</span></td>
                            <td><span>0.56m³/s</span></td>
                            <td><span>≤0.5m³/s</span></td>
                            <td><span>3-28 15:14</span></td>
                            <td><span>忽略</span></td>
                        </tr>
                        </tbody>
                    </table-list>
                </template>
                <template v-if="tabIndex==1">
                    <table-list :totalNum="totalPages" :currentPage="currentPage">
                        <thead>
                        <tr>
                            <th><span>监测点</span></th>
                            <th><span>监测值</span></th>
                            <th><span>正常值</span></th>
                            <th><span>时间</span></th>
                            <th><span>操作</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><span>1#</span></td>
                            <td><span>0.56m³/s</span></td>
                            <td><span>≤0.5m³/s</span></td>
                            <td><span>3-28 15:14</span></td>
                            <td><span>处理</span></td>
                        </tr>
                        <tr>
                            <td><span>1#</span></td>
                            <td><span>0.56m³/s</span></td>
                            <td><span>≤0.5m³/s</span></td>
                            <td><span>3-28 15:14</span></td>
                            <td><span>处理</span></td>
                        </tr>
                        </tbody>
                    </table-list>
                </template>
                <template v-if="tabIndex==2">
                    <table-list :totalNum="totalPages" :currentPage="currentPage">
                        <thead>
                        <tr>
                            <th><span>监测点</span></th>
                            <th><span>监测值</span></th>
                            <th><span>正常值</span></th>
                            <th><span>时间</span></th>
                            <th><span>操作</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td rowspan="2"><span>3#</span></td>
                            <td><span>0.45mg/L</span></td>
                            <td><span>0.1-0.3mg/L</span></td>
                            <td rowspan="2"><span>3-28 15:14</span></td>
                            <td><span>处理</span></td>
                        </tr>
                        <tr>
                            <td><span>1.8NTU</span></td>
                            <td><span>≤1NTU</span></td>
                            <td><span>处理</span></td>
                        </tr>
                        <tr>
                            <td rowspan="2"><span>1#</span></td>
                            <td><span>--(掉线)</span></td>
                            <td><span>0.1-0.3mg/L</span></td>
                            <td rowspan="2"><span>3-28 15:14</span></td>
                            <td><span>处理</span></td>
                        </tr>
                        <tr>
                            <td><span>--(掉线)</span></td>
                            <td><span>≤1NTU</span></td>
                            <td><span>处理</span></td>
                        </tr>
                        </tbody>
                    </table-list>
                </template>
                <template v-if="tabIndex==3">
                    <table-list :totalNum="totalPages" :currentPage="currentPage">
                        <thead>
                        <tr>
                            <th><span>管道</span></th>
                            <th><span>状态</span></th>
                            <th><span>操作</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><span>1#</span></td>
                            <td><span>通信异常</span></td>
                            <td><span>处理</span></td>
                        </tr>
                        <tr>
                            <td><span>2#</span></td>
                            <td><span>通信异常</span></td>
                            <td><span>处理</span></td>
                        </tr>
                        </tbody>
                    </table-list>
                </template>
            </template>
        </tabs-underline>
    </div>
</template>

<script>
    import TableList from '../../common/components/tableList';
    import TabsUnderline from '../../common/components/tabsUnderline';
    import {mapGetters} from 'vuex';
    export default {
        name: 'msg',
        components:{
            TabsUnderline,
            TableList
        },
        data(){
            return{
                tabList:null,
                tabIndex:0, //默认的激活页签
                totalPages:1,
                currentPage:1,
                searchStr:''
            };
        },
        computed:{
            ...mapGetters({
                'get_sunTab_msg' :'get_sunTab_msg'
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
                this.tabIndex = index;
            },
        },
        created() {
            let that = this;
            this.tabList ={list:that.get_sunTab_msg,leftIds:[]} ;
        }
    };
</script>

<style scoped lang="scss">
#msg{
    width: 100%;
    height: 100%;
    .row-search{
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        line-height: 30px;
        padding:10px;
        span{
            display: inline-block;
            width: 100px;
            .el-input{
                width: calc(100% - 110px);
            }
        }
    }
    #table{
        height: calc(100% - 50px);

    }

}
</style>