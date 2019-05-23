<template>
    <div id="error">
        <div class="errorList">
            <div class="item">
                <div class="topHead">
                    {{testValue.NAME}}
                </div>
                <div class="content">
                   {{testValue.MONI_VAL}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            testValue:null
        }
    },
    created(){
      this.testValue=window.parent.dse.globalData  ;
    }
}
</script>

<style lang="scss" scoped>
    #error{
        width: 100%;
        height: 100%;
        font-size: 14px;
        color: #333;
        .errorList{
            height: 100%;
            max-height: 200px;
            overflow-y: auto;
            display: flex;
            justify-content: center;
            align-items: center;
            .item{
                width: 100%;
                line-height: 30px;
                // padding: 0 5px;
                text-align: center;
                background: #fff7f8;
                .content{
                    background: #fd0001;
                    color: #fff;
                }
            }
        }
    }
</style>


