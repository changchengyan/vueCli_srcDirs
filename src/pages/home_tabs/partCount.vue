<template>
    <div id="partCount">
       <div class="search-wrap">
           <label for="searchName">分区名字:</label>
           <el-input placeholder="请输入分区名字" v-model="name" clearable id="searchName"></el-input>
           <el-button class="defaultShow">搜索</el-button>
       </div>
        <div class="time-search">
            <span>时间:</span>
            <el-select v-model="yearItem" placeholder="请选择">
                <el-option
                        v-for="item in yearList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="monthItem" placeholder="请选择">
                <el-option
                        v-for="item in monthList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="table-contnent">
            <table-list :currentPage="currentPage" :totalNum="totalNum">
                <thead>
                <tr>
                    <th>
                        <span>管道名称</span>
                    </th>
                    <th>
                        <span>管道编号</span>
                    </th>
                    <th>
                        <span>管径</span>
                    </th>
                    <th>
                        <span>材质</span>
                    </th>
                    <th>
                        <span>已用年限(使用寿命)</span>
                    </th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span>宁东路东路段</span></td>
                        <td><span>NDSS0001</span></td>
                        <td><span>120</span></td>
                        <td><span>水泥管</span></td>
                        <td><span>20</span></td>
                    </tr>
                    <tr>
                        <td><span>宁东路东路段</span></td>
                        <td><span>NDSS0001</span></td>
                        <td><span>120</span></td>
                        <td><span>水泥管</span></td>
                        <td><span>20</span></td>
                    </tr>
                </tbody>
            </table-list>
        </div>
    </div>
</template>

<script>
    import TableList from '../../common/components/tableList';
    export default {
        name: 'partCount',
        components: {TableList},
        data(){
            return{
                name:'',
                yearItem:'',
                monthItem:'',
                monthList:[
                    {
                        label:1,
                        value:1
                    },
                    {
                        label:2,
                        value:2
                    },
                    {
                        label:3,
                        value:3
                    },
                    {
                        label:4,
                        value:4
                    },
                    {
                        label:5,
                        value:5
                    },
                    {
                        label:6,
                        value:6
                    },
                    {
                        label:7,
                        value:7
                    },
                    {
                        label:8,
                        value:8
                    },
                    {
                        label:9,
                        value:9
                    },
                    {
                        label:10,
                        value:10
                    },
                    {
                        label:11,
                        value:11
                    },
                    {
                        label:12,
                        value:12
                    }
                ],
                currentPage:1,
                totalNum:1
            };
        },
        computed:{
            yearList:()=>{

                let time = new Date();
                let currentYear = time.getFullYear();
                let temp_list = [];
                for(let i=0;i<5;i++){
                    let temp_json = {};
                    temp_json.label = ''+currentYear-i;
                    temp_json.value = currentYear-i;
                    temp_list.push(temp_json);
                }
                return temp_list;
            }
        },
        methods:{

        },
        created() {
            let  time = new Date();
            this.yearItem = time.getFullYear();
            this.monthItem = time.getMonth();
        }
    };
</script>

<style scoped lang="scss">
#partCount{
    width: 100%;
    height: 100%;
    .search-wrap{
        width: 100%;
        height: 50px;
        padding: 10px 5px;
        label{
            display: inline-block;
            width: 70px;
        }
        .el-input{
            width: calc(100% - 140px);
        }
    }
    .time-search{
        width: 100%;
        height: 50px;
        line-height: 30px;
        padding: 10px;
        padding-top: 0px;
        &>span{
           display: inline-block;
            width: 50px;
        }
        .el-select{
            width: calc(50% - 30px);
        }
    }
    .table-contnent{
        width: 100%;
        height: calc(100% - 89px);
        overflow-y: auto;
    }
}
</style>