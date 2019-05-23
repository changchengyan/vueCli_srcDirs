<template>
<div id="fuzzy_search">
    <input  @keyup.13="getLists" v-model="pipeName" placeholder="回车获取数据" />
    <div class="sub_searchList" v-if="colseFlag&&lists&&lists.length>0" >
        <div class="searchItem"   @click="selectThis(item)" v-for="(item,index) in lists" :key="index" >
            <!-- <template v-if="index<=3"> -->
                {{item.PIPE_NAME}}
            <!-- </template> -->
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ["searchLists", "defaultName","closeList_flag"],
    data() {
        return {
            pipeName: "",
            colseFlag:true,
            lists:[]
        }
    },
    methods: {
        selectThis(val) {
            this.pipeName = val.name
            this.colseFlag = false
            this.$emit("selectThis", val);
        },
        getLists(event) {
            this.colseFlag = true;
            let temp_name = event.target.value
            this.$emit("callBackList",temp_name)
        }
    },
    computed: {
        pipeName_: {
            get: function () {
                return this.pipeName
            },
            set: function (newValue) {
                this.pipeName = newValue;
            }
        }
    },
    watch: {
        defaultName: function (val) {
            this.pipeName = val;
            // console.log(val)
        },
        closeList_flag:function(val){
            this.colseFlag = val;
            // console.log(val)
        },
        searchLists:{
            handler(newValue,oldValue){
                let temp_arr = newValue;
                if(temp_arr&&temp_arr.length&&temp_arr.length>10){
                    this.lists = temp_arr.splice(0,5);
                }else{
                    this.lists = newValue;
                }
                // console.log(this.lists)
            },
            immediate:true,
            deep:true
        }

    },
    created(){
        this.pipeName = this.defaultName;
       this.lists = this.searchLists;
    }

}
</script>

<style lang="scss" scoped>
#fuzzy_search {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    input{
        border: 1px solid #ccc;
        height: 30px;
        line-height: 28px;
        padding-left: 10px;
        border-radius: 5px;
        width: 100%;
    }
    .sub_searchList {
        width: 100%;
        height: 100px;
        // max-height: 200px;
        position: absolute;
        top: 40px;
        left: 0;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        border-radius: 5px;
        z-index: 100;
        background: #fff;
        overflow-y: auto;
        .searchItem {
            border-bottom: 1px solid #ccc;
            line-height: 25px;
            cursor: pointer;
            padding-left: 10px;
            &:hover {
                background: #66b1ff;
                color: #fff;
                border-radius: 5px;
            }
        }
    }
}
</style>
