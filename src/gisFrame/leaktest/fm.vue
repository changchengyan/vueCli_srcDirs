
<template>
    <div id="fm">
          <div class="select" @click="selectThisArea">
            <span class="bg" :class="{selected: selectArea==true}"></span>
            <span>当前所在分区</span>
          </div>

        <div class="actions">
            <span @click="save">确定</span>
        </div>
    </div>
</template>

<script>
import {addFlow}  from "@/api/leaktest/partitionConfig"

export default {
    data(){
        return{
            selectArea:false,
            selectRadio:null,
            parentThat:null,
            comeData:{}
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
            
            if(!this.selectArea){
                window.parent.dse.this_.$message.error('当前分区未被激活！')
                return
            }

             if(!this.comeData.areaId){
                window.parent.dse.this_.$message.error('您未绑定一个图层!')
                return
            }

            this.addFlow_()
        },
         addFlow_(){
            let that = this;
            let  temp_areaId = this.comeData.areaId
            let temp_monitorId = this.comeData.monitorId
            addFlow({
                areaId: temp_areaId,
                monitorId: temp_monitorId,
                type: "4"
            }).then(res=>{
                if(res.status==1){
                  window.parent.dse.this_.$message.success('保存成功!')
                  window.parent.dse.this_.post_data.monitorList.push({
                      id:temp_monitorId,
                      type: "4"
                  })
                   window.parent.dse.this_.post_data.valveCount += window.parent.dse.this_.post_data.valveCount

                   window.parent.dse.this_.view.popup.close()
                }else{
                  window.parent.dse.this_.$message.error('保存失败!')
                }
            }).catch(error=>{
                console.log(error)
            })
        }
    },
    created(){
        this.comeData = parent.dse.globalData
    }
}
</script>

<style lang="scss" scoped>
#fm{
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
                background: url("../../assets/images/common/mult_selected.png") no-repeat;
                background-size: 100% 100%;
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


