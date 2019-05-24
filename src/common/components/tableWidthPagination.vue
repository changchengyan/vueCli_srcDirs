<template>
    <div id="tableWidthPagination">
        <div class="table-wrap" >
            <table  class="innerTable">
                <slot></slot>
            </table>
        </div>

        <div class="pages">
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="totalNum"
                    @current-change="getThisPage"
                    @prev-click="getThisPage"
                    @next-click="getThisPage"
                    :current-page="currentPage">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        props:['totalNum','currentPage'],
        name: 'tableWidthPagination',
        data() {
            return {

            };
        },
        methods:{
            getThisPage(val){
                let temp_num = parseInt(val);
                this.$emit('goto_page',temp_num);
            }
        }
    };
</script>

<style lang="scss" scoped>
    #tableWidthPagination {
        width: 100%;
        height: 100%;

        font-size: 14px;
        color: #333;
        .table-wrap{
            border: 1px solid #ccc;
            overflow-y: auto;
            border-radius: 10px;
            width: 100%;
            height: calc(100% - 60px);
            &.hasPage{
                height: 100%;
            }
        }
        table {
            border-spacing: 0;
            width: 100%;
            table-layout: fixed;
            word-break: break-all;
            word-wrap: break-word;
            tr {
                width: 100%;
                td ,th{
                    border-right: 1px solid #ccc;
                    border-bottom: 1px solid #ccc;
                    text-align: center;
                    height: 40px;
                    span {
                        display: block;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        height: 35px;
                        line-height: 35px;
                    }
                    &.btns{
                        span{
                            width: 40px;
                            line-height: 22px;
                            border:1px solid #0b83fe;
                            border-radius: 5px;
                            cursor: pointer;

                            color: #0b83fe;
                        }
                    }
                    &.actions{
                        span{
                            display: inline-block;
                            width: 50px;
                            line-height: 22px;
                            color: #0b83fe;
                            cursor: pointer;
                            border: 1px solid #0b83fe;
                            margin-right: 5px;
                            border-radius: 5px;
                        }
                    }
                }
            }
            tbody{
                tr{
                    &:hover{
                        background: rgba(0,0,0,0.15);
                    }
                }
            }
            thead{
                tr{
                    th {
                        height: 50px;
                        font-weight: 600;
                        background: #e3ecef;
                        span{
                            display: block;
                            height: 50px;
                            line-height: 50px;
                        }
                    }
                }
            }
        }
        .pages{
            width: 100%;
            padding: 10px 0;
            display: flex;
            justify-content: center;
        }
    }
</style>
