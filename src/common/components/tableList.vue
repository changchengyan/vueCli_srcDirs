<template>
    <div id="table">
        <div class="table-wrap">
            <table  class="innerTable">
                <slot></slot>
            </table>
        </div>

        <div class="pages">
           <my-pagination :totalPage="totalNum"  :currentPage="currentPage" />
        </div>
    </div>
</template>

<script>
    import MyPagination from './myPagination';
    export default {
        name:'tableList',
        components: {MyPagination},
        props:['totalNum','currentPage'],
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
    #table {
        width: 100%;
        height: 100%;

        font-size: 14px;
        color: #333;
        .table-wrap{
            /*border: 1px solid #ccc;*/
            overflow-y: auto;
            /*border-radius: 10px;*/
            width: 100%;
            height: calc(100% - 36px);
            overflow-x: hidden;
        }

        .pages{
            width: 100%;
            padding: 10px 0;
            display: flex;
            justify-content: center;
        }
    }
</style>
