<template>
<div id="updateTime">
    <span>管线更新至{{updateTime.UPDATETIME}}年</span>
</div>
</template>

<script>
import {
    getModifiedTime
} from "@/api/pipeNet_msg/msg";
export default {
    data() {
        return {
            updateTime: ""
        }
    },
    methods: {
        getUpdateTime() {
            let that = this;
            getModifiedTime({
                year: ""
            }).then(res => {
                // console.log(res);
                that.updateTime = (res.data && res.data[0]) ? res.data[0] : ""
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
            })
        }
    },
    filters: {
        formate_time(val) {
            let temp_val = val
            if (val) {
                temp_val = temp_val.split(" ")
                temp_val = temp_val[0]
                let temp_year = temp_val.split("-")[0] + "年"
                let temp_month = temp_val.split("-")[1] + "月"
                let temp_day = temp_val.split("-")[2] + "日"
                return temp_year + temp_month + temp_day
            } else {
                return val
            }

        }
    },
    created() {
        this.getUpdateTime();
    }
}
</script>

<style lang="scss" scoped>
#updateTime {
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #333;
    text-align: center;
}
</style>
