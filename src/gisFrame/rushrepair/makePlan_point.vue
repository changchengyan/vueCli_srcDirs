<template>
<div id="makePlan_point">
    <div class="name">
        <span>名字:</span>
        <el-input placeholder="请输入内容" v-model="name" clearable></el-input>
    </div>
    <div class="item">
        <span>东经:</span>
        <span>{{parentData.longitude|formate_xy}}</span>
    </div>
    <div class="item">
        <span>北纬:</span>
        <span>{{parentData.latitude|formate_xy}}</span>
    </div>
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
            parentData: null
        }
    },
    methods: {
        cancel() {
            let temp_index = this.parentData.pointIndex + 1;
            window.parent.this_.view.graphics.splice(temp_index, 1);
            window.parent.this_.makeNum = window.parent.this_.makeNum - 1;
            window.parent.this_.markPoints = window.parent.this_.markPoints.splice(temp_index - 2, 1);
            window.parent.this_.view.popup.close();
        },
        save() {

            if(this.name==""){
                   window.parent.this_.$message.warning("请输入名字!");
                return
            }
            let temp_index = this.parentData.pointIndex - 1;
            // console.log( window.parent.this_.markPoints[temp_index]);
            window.parent.this_.markPoints[temp_index].pointName = this.name;
            window.parent.this_.view.popup.close();
        }
    },
    filters: {
        formate(val) {
            let temp = val;
            temp = parseInt(parseFloat(temp * 100)) / 100;
            return temp;
        },
        formate_xy(val) {
            let temp_value = parseFloat(val);
            let du = parseInt(temp_value);
            let fen = parseInt((parseFloat(temp_value) - du) * 60);
            let miao = parseInt((temp_value - du - fen / 60) * 60 * 10000) / 10000;
            temp_value = du + "°" + fen + "′" + miao + "″";
            return temp_value
        }
    },
    created() {
        this.parentData = parent.dse.globalData;
        sessionStorage.setItem("initRoute", 2);
        this.$store.commit("setAside_status", false);
        this.$emit("hiddenAside");
        this.$router.push({
            name: "pipe_rushrepair_makePlan_point"
        })
    }
}
</script>

<style lang="scss" scoped>
#makePlan_point {
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

    .item {
        width: 100%;
        height: 30px;
        text-align: center;
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
