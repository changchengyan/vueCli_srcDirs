<template>

    <div id="pipeStandingBook">
       <div class="top-search">
           <div class="left">
               <div class="col">
                   <span>分区:</span>
                   <el-select v-model="areaItem" placeholder="请选择">
                       <el-option
                               v-for="item in areaList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                       </el-option>
                   </el-select>
               </div>
               <div class="col">
                   <span>管径:</span>
                   <el-select v-model="caliberItem" placeholder="请选择">
                       <el-option
                               v-for="item in caliberList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                       </el-option>
                   </el-select>

               </div>
               <div class="col">
                   <span>管材:</span>
                   <el-select v-model="materialItem" placeholder="请选择">
                       <el-option
                               v-for="item in materialList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                       </el-option>
                   </el-select>
               </div>
               <div class="col">
                   <span class="small">使用状态:</span>
                   <el-select class="small-select" v-model="statusItem" placeholder="请选择">
                       <el-option
                               v-for="item in statusList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                       </el-option>
                   </el-select>
               </div>
               <div class="col">
                   <span class="small">责任人:</span>
                   <el-input class="small-select" placeholder="责任人" clearable v-model="personName"></el-input>
               </div>
               <div class="col">
                   <span class="search">查询</span>
               </div>
           </div>
           <div class="right">
<!--               <div class="col"><input type="file"> <span>导入</span></div>-->
<!--               <div class="col"><span>导出</span></div>-->
                   <div class="col" @click="gotoAdd"><span>新增</span></div>
           </div>
       </div>
        <div class="main-table">
            <table-width-pagination :totalNum="totalPageNum" :currentPage="currentPage">
                <thead>
                    <tr>
                        <th><span></span></th>
                        <th><span>序号</span></th>
                        <th><span>管道名称</span></th>
                        <th><span>管道编号</span></th>
                        <th><span>分区</span></th>
                        <th><span>管径</span></th>
                        <th><span>管材</span></th>
                        <th><span>长度(m)</span></th>
                        <th><span>生产厂家</span></th>
                        <th><span>安装时间</span></th>
                        <th><span>使用寿命(年)</span></th>
                        <th><span>使用状态</span></th>
                        <th><span>操作</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span>测试</span></td>
                        <td><span>测试</span></td>
                        <td><span>测试</span></td>
                        <td><span>测试</span></td>
                        <td><span>测试</span></td>
                        <td><span>测试</span></td>
                        <td><span>测试</span></td>
                        <td><span>测试</span></td>
                        <td><span>测试</span></td>
                        <td><span>测试</span></td>
                        <td><span>测试</span></td>
                        <td><span>测试</span></td>
                        <td><span>测试</span></td>
                    </tr>
                </tbody>
            </table-width-pagination>
        </div>

    </div>

</template>

<script>

    import TableWidthPagination from '../../common/components/tableWidthPagination';
    export  default {
        components: {TableWidthPagination},
        data(){
            return{
                currentPage:1, //当前页的索引
                totalPageNum:1, //共多少页
                areaList: [
                    {
                        value: '1',
                        label: '新城区'
                    }, {
                        value: '2',
                        label: '老城区'
                    }
                ],
                areaItem:'',
                caliberList:[
                    {
                        value: '1',
                        label: 'DN50'
                    }, {
                        value: '2',
                        label: 'DN100'
                    }
                ], //管径
                caliberItem: '',
                materialList:[
                    {
                        value: '1',
                        label: '铸铁管'
                    }, {
                        value: '2',
                        label: '塑料管'
                    }
                ],
                materialItem: '',
                statusList:[
                    {
                        value: '1',
                        label: '正常'
                    }, {
                        value: '2',
                        label: '报废'
                    }
                ],
                statusItem:'',
                personName:'', //责任人

            };
        },
        methods:{
            gotoAdd(){
                this.$router.push({
                    name: 'pipeAdd'
                });
                this.$store.commit('set_asideStatus', false);
                this.$emit('hiddenAside');
            }
        }

    };

</script>

<style scoped lang="scss">
    #pipeStandingBook{
        width:100%;
        height: 100%;
        padding: 0 10px 10px;
        .top-search{
            width: 100%;
            height: 50px;
            padding: 10px 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left{
                /*width: 900px;*/
                display: flex;
                align-items: center;
                justify-content: space-between;
                .col{
                    width: calc(20% - 10px);
                    margin-right: 10px;
                    &:last-child{
                        width: 60px;
                    }
                    span{
                       display: inline-block;
                        width: 40px;
                        margin-right: 5px;
                        &.search{
                            height: 30px;
                            line-height: 30px;
                        }
                        &.small{
                            width: 60px;
                        }
                    }
                    .el-input{
                        width: calc(100% - 50px);
                        &.small-select{
                            width: calc(100% - 70px);
                        }
                    }
                    .el-select{
                        width: calc(100% - 50px);
                        &.small-select{
                            width: calc(100% - 70px);
                        }
                    }

                }
            }
            .right{
                width: 120px;
                display: flex;
                justify-content: space-between;
                .col{
                    width:50px;
                    text-align: center;
                    background: #0b83fe;
                    line-height: 30px;
                    height: 30px;
                    color:#fff;
                    cursor: pointer;
                    position: relative;
                    span{
                        display: inline-block;
                        width: 100%;
                    }
                    input{
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 100;
                        opacity: 0;
                        cursor: pointer;
                    }
                }
            }
        }
        .main-table{
            width: 100%;
            height: calc(100% - 50px);
            table{
                thead,tbody{
                    th:first-child,th:first-child{
                        width: 40px;
                    }

                }
            }
        }
    }


</style>