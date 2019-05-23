<template>
<div id="selectTree">
    <div class="dse-select">
        <div class="dse-input"  @click.stop="showSubTree">
            <input type="text" readonly v-model="searchNames" >
            <i class="el-icon-arrow-down" :class="{rotateEle:rotateEle}"></i>
        </div>
        <div class="sub-model" v-show="data_.length&&subTreeFlag">
            <!-- <v-jstree :data="data_"  show-checkbox multiple=false allow-batch whole-row @item-click="itemClick"></v-jstree> -->
            <el-tree :data="data_" :props="defaultProps" accordion @node-click="handleNodeClick" default-expand-all>
            </el-tree>
            <!-- <div class="config">
          <el-button type="primary" class="gray" @click="cancel">取消</el-button>
          <el-button type="primary" @click="config">确定</el-button>
        </div> -->
        </div>
    </div>
</div>
</template>

<script>
/**
 *
 *      --------------------------
 *      |   XXX,YYY               |
 *      --------------------------
 *      ---------------------------
 *      |  + AAA                  |
 *      |       - AAA1            |
 *      |       - AAA2            |
 *      |  + BBB                  |
 *      |       - BBB1            |
 *      |                         |
 *      |  取消            确定    |
 *      |_________________________|
 *
 *  传值 树的数组 waterWorksTree
 * 往外发射 选中的值 showSelectLists
 */
window.onclick = function(){
    if(dse.this_){
        dse.this_.subTreeFlag = false
    }
    
}
export default {
    components: {},
    props: ["waterWorksTree", "defaultCompony","notTop"],
    data() {
        return {
            rotateEle: false,
            subTreeFlag: false,
            temp_searchNames: "",
            searchNames: "",
            data_: [],
            defaultProps: {
                children: "children",
                label: "label",
                id: "id"
            },
            selected: null
        };
    },
    methods: {
        cancelSelect(arr, selectIndex) {
            let temp_arr = arr;
            let len = temp_arr.length;
            if (temp_arr.length > 0) {
                for (let i = 0; i < len; i++) {
                    if (i != selectIndex) {
                        temp_arr[i].selected = false;
                        if (temp_arr[i].children && temp_arr[i].children.length) {
                            for (let j = 0; j < temp_arr[i].children.length; j++) {
                                temp_arr[i].children[j].selected = false;
                            }
                        }
                    }
                }
            }
            return temp_arr;
        },
        pearentFlag(arr) {
            let temp_arr = arr;
            let flag = false;
            if (temp_arr.length) {
                for (let i = 0; i < temp_arr.length; i++) {
                    if (temp_arr[i].selected == true) {
                        flag = true;
                        break;
                    }
                }
            }
            return flag;
        },
        itemClick(node, item, e) {},
        showSubTree() {
            this.rotateEle = true;
            this.subTreeFlag = true;
        },
        config() {
            let that = this;
            this.subTreeFlag = false;
            this.rotateEle = false;
            // this.searchNames = this.temp_searchNames;
            this.searchNames = this.selected.label;
            this.$emit("showSelectLists", that.selected);
        },
        cancel() {
            this.subTreeFlag = false;
            this.rotateEle = false;
            let temp_json = {}
            temp_json.name = this.DSE.tree[0].label;
            temp_json.id = this.DSE.tree[0].id;
            temp_json.type = this.DSE.tree[0].type;
            this.searchNames = temp_json.name;
            this.$emit("showSelectLists", temp_json);
        },
        handleNodeClick(data) {
            let that = this;
            let flag = this.notTop
            this.selected = data;
            this.subTreeFlag = false;
            this.rotateEle = false;
            this.searchNames = this.selected.label;
            this.$emit("showSelectLists", that.selected);
        },
        closeSub() {
            this.subTreeFlag = false;
        }
    },
    mounted() {
      
    },
    created() {
        let that = this
        let timer = null
        dse.this_ = this;
        timer = setInterval(()=>{
            that.data_ = that.waterWorksTree
            if(that.data_.length>0){
                that.searchNames = that.defaultCompony
                clearInterval(timer)
            }
        },100)
    }
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

#selectTree {
    width: 100%;

    //   height: 100%;
    .dse-select {
        width: 100%;
        position: relative;

        .dse-input {
            width: 100%;
            height: 25px;
            line-height: 25px;
            position: relative;
            margin-bottom: 10px;
            cursor: pointer;

            input {
                display: inline-block;
                width: 100%;
                height: 30px;
                line-height: 30px;
                cursor: pointer;
                border-radius: 5px;
                border: 1px solid #c0c4cc;
                padding-left: 5px;
                font-size: 12px;
                color: #333;
            }

            i {
                position: absolute;
                right: 8px;
                top: 8px;
                transform: rotate(-90deg);
                transition: all 1s;
            }

            i.rotateEle {
                transform: rotate(0deg);
            }
        }

        .sub-model {
            width: 100%;
            //   height: 150px;
            overflow: auto;
            background: #fff;
            transition: all 1s;
            position: absolute;
            z-index: 100;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

            .config {
                width: 100%;
                padding: 10px;
                display: flex;
                justify-content: center;

                .el-button {
                    padding: 5px 10px !important;

                    &.gray {
                        background: #ccc !important;
                        border: 1px solid #ccc !important;
                    }
                }
            }
        }
    }
}

/* .sub-model:before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 30px solid red;
} */
</style>
