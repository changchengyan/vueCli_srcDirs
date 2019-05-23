<template>
    <div id="press">
          <div class="select" @click="selectThisArea">
            <span class="bg" :class="{selected: selectArea==true}"></span>
            <span>当前所在分区</span>
        </div>
        <div class="row">
            <div class="col"  @click="selectThis('1')" :class="{ifSelect:selectArea==false}">
                <span class="outerCircel">
                    <i class="innerPoint" :class="{selectThis:selectRadio=='1'}"></i>
                </span>
                <span>进水流量计</span>
            </div>
            <div class="col" @click="selectThis('2')" :class="{ifSelect:selectArea==false}">
                <span class="outerCircel">
                    <i class="innerPoint" :class="{selectThis:selectRadio=='2'}"></i>
                </span>
                <span>出水流量计</span>
            </div>
        </div>

        <div class="actions">
            <span @click="save">确定</span>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            selectArea:false,
            selectRadio:null,
            parentThat:null,
        }
    },
    methods:{
        selectThis(str){
            if(!this.selectArea){
                return
            }
            this.selectRadio = str;
        },
        selectThisArea(){
            this.selectArea = !this.selectArea;
            if(!this.selectArea){
                this.selectRadio = null;
            }
        },
        save(){
            window.parent.dse.this_.$message.error('保存失败!')
        }
    },
    created(){
    }
}
</script>

<style lang="scss" scoped>
#press{
    width: 100%;
    height: 100%;
    padding: 20px;
    font-size: 14px;
    color: #333;
    .select{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        margin-bottom: 10px;
        .bg{
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 1px solid #ccc;
            margin-right: 10px;
            &.selected{
                background: blue;
            }
        }
    }

    .row{
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 10px;
        .col{
            flex: 1;
            display: flex;
            justify-content:center;
            align-items: center;
            cursor: pointer;
            &.ifSelect{
                cursor: not-allowed;
            }
            .outerCircel{
                display: inline-block;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                border: 1px solid #ccc;
                margin-right: 10px;
                i{
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    background: #0b83fe;
                    border-radius: 50%;
                    transform: scale(0.5);
                    opacity: 0;
                    &.selectThis{
                        opacity: 1;
                    }
                }
            }

            
        }
    }

    .actions{
        width: 100%;
        display: flex;
        justify-content: center;
        span{
            display: inline-block;
            padding: 5px 10px;
            background: #0b83fe;
            cursor: pointer;
            border-radius: 5px;
            color: #fff;
        }
    }

}
</style>


