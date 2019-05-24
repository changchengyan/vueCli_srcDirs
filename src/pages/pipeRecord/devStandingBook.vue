<template>

    <div id="devStandingBook">
        <div class="top-search">
            <div class="left">
                <div class="col">
                    <span>设备名称:</span>
                    <el-input placeholder="设备名称" clearable></el-input>
                </div>
                <div class="col">
                    <span>属地部门:</span>
                    <el-input placeholder="属地部门" clearable></el-input>
                </div>
                <div class="col">
                    <span class="search">查询</span>
                </div>
            </div>
            <div class="right">
<!--                <div class="col"><input type="file"> <span>导入</span></div>-->
<!--                <div class="col"><span>导出</span></div>-->
                <div class="col"><span @click="gotoAdd">新增</span></div>
            </div>
        </div>
        <div class="main-table">
            <table-width-pagination :totalNum="totalPageNum" :currentPage="currentPage">
                <thead>
                <tr>
                    <th><span></span></th>
                    <th><span>序号</span></th>
                    <th><span>设备编号</span></th>
                    <th><span>设备名称</span></th>
                    <th><span>规格型号</span></th>
                    <th><span>设备类型</span></th>
                    <th><span>生产厂家</span></th>
                    <th><span>设备添加日期</span></th>
                    <th><span>属地部门</span></th>
                    <th><span>安装地点</span></th>
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
            };
        },
        methods:{
            gotoAdd(){
                this.$router.push({
                    name: 'addDeves'
                });
                this.$store.commit('set_asideStatus', false);
                this.$emit('hiddenAside');

            }
        }

    };

</script>

<style scoped lang="scss">
    #devStandingBook{
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
                /*width: 600px;*/
                display: flex;
                align-items: center;
                justify-content: space-between;
                .col{
                    width: calc(50% - 40px);
                    &:last-child{
                        width: 60px;
                    }
                    span{
                        display: inline-block;
                        width: 60px;
                        margin-right: 5px;
                        &.search{
                            height: 30px;
                            line-height: 30px;
                        }
                    }
                    .el-input{
                        width: calc(100% - 70px);
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