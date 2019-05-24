<template>
    <div id="slideTableList">
        <div class="table-wrap">
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
        name: 'slideTableList'
    };
</script>

<style scoped lang="scss">
    #slideTableList {
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
        }
        table {
            border-spacing: 0;
            width: 100%;
            // height: 100%;
            table-layout: fixed;
            word-break: break-all;
            word-wrap: break-word;
            tr {
                width: 100%;
                td {
                    border-right: 1px solid #ccc;
                    border-bottom: 1px solid #ccc;
                    text-align: center;
                    // width: 145px;

                    span {
                        display: inline-block;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        line-height: 30px;
                    }
                    &.btns{
                        span{
                            width: 40px;
                            // padding: px 0;
                            line-height: 22px;
                            border:1px solid #0b83fe;
                            border-radius: 5px;
                            cursor: pointer;
                            margin-right: 20px;
                            color: #0b83fe;
                        }
                    }
                    &.actions{
                        span{
                            display: inline-block;
                            // padding: 4px 10px;
                            width: 50px;
                            line-height: 22px;
                            // border:1px solid  #0b83fe;
                            color: #0b83fe;
                            cursor: pointer;
                            border: 1px solid #0b83fe;
                            margin-right: 5px;
                            border-radius: 5px;
                        }
                    }
                }
                &:first-child {
                    td {
                        background: #e3ecef;
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