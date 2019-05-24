<template>
    <div id="toggleTable_list">
        <div class="toggleBar" @click="toggleShow">
            <template v-if="showRight">
                <i class="el-icon-arrow-right" ></i>
            </template>
            <template v-else>
                <i class="el-icon-arrow-left" ></i>
            </template>
        </div>
        <div class="table-content" v-if="showRight" :style="{width:innerWidth+'px'}">
            <div class="main-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>

    /**
     *   右侧的带有列表的 table
     */
    export default {
        props:['innerWidth'],
        data() {
            return {
                showRight:true
            };
        },
        methods:{
            showThisPage(val){
                this.$emit('thisPage',val);
            },
            toggleShow(){
                let that = this;
                this.showRight = !this.showRight;
                this.$emit('toggleFlag',that.showRight);
            }
        }
    };
</script>

<style lang="scss" scoped>
    #toggleTable_list {
        /*width: 100%;*/
        height: 100%;
        position: relative;
        .toggleBar{
            width: 20px;
            height: 80px;
            position: absolute;
            left: -5px;
            top: 50%;
            margin-top: -40px;
            margin-left: -15px;
            border: 1px solid #ccc;
            text-align: center;
            line-height: 80px;
            border-radius: 5px;
            cursor: pointer;
            background: #fff;
            z-index: 999;
        }

        .table-content{
            width: calc(100% - 40px);
            height: 100%;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 10px;
            .main-content{
                width: 100%;
                height: 100% ;
            }
        }

    }
</style>
