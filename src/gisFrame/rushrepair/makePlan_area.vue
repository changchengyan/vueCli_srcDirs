<template>
<div id="makePlan_">
    <div class="name">
        <span>名字:</span>
        <el-input placeholder="请输入内容" v-model="name" clearable></el-input>
    </div>
    <!-- <div class="area">
        <span>区域面积:</span>
        <span>{{acriage|formate}}平方千米</span>
    </div> -->
    <div class="actions">
        <div class="cancel" @click="cancel">取消</div>
        <div class="save" @click="save">保存</div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            name: "",
            acriage: ""
        }
    },
    methods: {
        cancel() {
            window.parent.this_.view.graphics.items = [];
            window.parent.this_.view.graphics.removeAll();
            window.parent.this_.view.popup.close();
        },
        save() {
            if (this.name == "") {
                window.parent.this_.$message.warning("请输入名字!");
                return
            }
            window.parent.this_.polygon_postObj.areaName = this.name;
            window.parent.this_.view.popup.close();
        }
    },
    filters: {
        formate(val) {
            let temp = val;
            temp = parseInt(parseFloat(temp * 100)) / 100;
            return temp;
        }
    },
    created() {
        sessionStorage.setItem("initRoute", 2);
        this.$store.commit("setAside_status", false);
        this.$emit("hiddenAside");
        this.$router.push({
            name: "pipe_rushrepair_makePlan_area"
        })
    },
    watch: {
        acriage(newData, oldData) {
            return newData
        }
    }
}
</script>

<style lang="scss" scoped>
#makePlan_ {
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #333;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .name {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
            display: inline-block;
            width: 80px;
            text-align: right;
            padding-right: 10px;
        }

        .el-input {
            width: calc(100% - 100px);
        }
    }

    .area {
        width: 100%;
        height: 40px;

        span:first-child {
            display: inline-block;
            width: 90px;
            text-align: right;
            padding-right: 10px;
        }

        span:last-child {
            display: inline-block;
            width: calc(100% - 100px);
        }
    }

    .actions {
        width: 100%;
        display: flex;
        justify-content: center;

        div {
            display: inline-block;
            padding: 10px 20px;
            cursor: pointer;
            background: #0b83ff;
            border-radius: 5px;
            color: #fff;

            &:first-child {
                background: gray;
                margin-right: 10px;
            }
        }
    }
}
</style>
