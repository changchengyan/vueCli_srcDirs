<template>
<div id="devs">
    <div class="date">
        <el-date-picker v-model="date_" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="getTime">
        </el-date-picker>
    </div>
    <div class="content long">
        <div class="headTop">
            <div class="col"><span>检测值</span></div>
            <div class="col"><span>数值</span></div>
            <div class="col"><span>参考值</span></div>
        </div>
        <div class="subContent ">
            <div class="item" @click="showThis(item)" v-for="(item,index) in detectionItems" :key="index">
                <div class="col" :title="item.ITEM_NAME"><span>{{item.ITEM_NAME}}</span></div>
                <div class="col"><span>{{item.REAL_VAL}}</span></div>
                <div class="col"><span>{{item.RANGE}}</span></div>
            </div>
        </div>
    </div>
    <div class="charts short" id="chart">
        <IEcharts :option="qc.line" :loading="qc.loading" :resizable="true" />
    </div>
</div>
</template>

<script>
import {
    getPipeWaterQualityDetailInfo,
    getPipeWaterQualityRangCurve
} from "@/api/monitor/surver"
import IEcharts from "vue-echarts-v3/src/full.js";
export default {
    components: {
        IEcharts
    },
    data() {
        return {
            date_: "",
            initTime: "", // 初始化时间
            qc: {
                year: "",
                month: "全年",
                loading: false,
                line: {
                    title: {
                        text: "",
                        left: "center"
                    },
                    tooltip: {
                        trigger: "axis"
                    },
                    grid: {
                        top: "35px",
                        left: "40px",
                        right: "20px",
                        bottom: "50px"
                    },
                    xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: [],
                        axisLabel: {
                            'interval': 0,
                            rotate: 30
                        }
                    },
                    yAxis: {
                        type: "value",
                        splitLine: {
                            show: true
                        }
                    },
                    color: "#1cbbdf",

                    series: [ {
                        data: [],
                        type: "line",
                        name: '最高限值',
                       itemStyle: {
                            normal: {
                                color: '#f391a9',
                            }
                        },
                        lineStyle:{
                            type:"dashed",
                           opacity:0.8
                        }
                    }, {
                        data: [],
                        type: "line",
                        name: '实际值',
                        itemStyle: {
                            normal: {
                                color: '#7fc9f7',
                            }
                        }
                    },{
                        data: [],
                        type: "line",
                        name: '最低限值',
                        itemStyle: {
                            normal: {
                                color: '#f391a9',
                            }
                        },
                        lineStyle:{
                            type:"dashed",
                           opacity:0.8
                        }
                    }]
                }
            },
            year: "",
            month: "",
            day: "",
            tableContent: {
                MONI_TYPE: "",
                MONI_VAL: "",
                NAME: "",
            },
            search_id: "", //  类型ID
            itemId: "", // 检测项ID
            detectionItems: []
        }
    },
    methods: {

        getChart(name) {
            let that = this;
            let temp_year = this.year;
            let temp_month = this.month;
            let temp_day = this.day;
            let temp_pid = this.search_id;
            let temp_itemID = this.itemId;
            getPipeWaterQualityRangCurve({
                year: "" + temp_year,
                month: "" + temp_month,
                day: "" + temp_day,
                itemCode: "" + temp_itemID,
                moniPointId: "" + temp_pid
            }).then(res => {
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.msg == "no user") {
                    window.parent.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.status === 1) {
                    let line_normal_x = [];
                    let line_normal_y = [];
                    let line_min_y = [];
                    let line_max_y = [];

                    let {
                        waterQualityCurve,
                        waterQualityRange,
                    } = res.data;
                    waterQualityCurve.map(val => {
                        let temp_time = val.COLLECT_TIME;
                        temp_time = temp_time.split(":")
                        temp_time = temp_time[0]+":"+temp_time[1]
                        line_normal_x.push(
                           temp_time
                        )
                        line_normal_y.push(
                            parseFloat(val.SUMVAL)
                        )
                        line_min_y.push(waterQualityRange[0].MIN_RANGE)
                        line_max_y.push(waterQualityRange[0].MAX_RANGE)
                    })
                    that.qc.line.xAxis.data = line_normal_x;
                    that.qc.line.title.text = name;
                    that.qc.line.yAxis.name = "(" + name + ")";
                    that.qc.line.series[0].data = line_max_y;
                    that.qc.line.series[1].data = line_normal_y ;
                    that.qc.line.series[2].data = line_min_y;
                } else {
                    that.$message({
                        content: res.msg
                    })
                }
            }).catch(error=>{
                console.log(error);
            })
        },
        showThis(item) {
            let that = this;
            that.itemId = item.ITEM_CODE;
            that.temp_pid = item.ID;
            let temp_name = item.ITEM_NAME
            this.getChart( temp_name);
        },
        getPipeWaterQualityDetailInfo_() {
            let that = this;
            let temp_year = this.year;
            let temp_month = this.month;
            let temp_day = this.day;
            let temp_pid = this.search_id;
            let temp_itemID = this.itemId;
            getPipeWaterQualityDetailInfo({
                year: "" + temp_year,
                month: "" + temp_month,
                day: "" + temp_day,
                itemCode: "" + temp_itemID,
                moniPointId: "" + temp_pid
            }).then(res => {
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.msg == "no user") {
                    window.parent.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                let {
                    data
                } = res;
                if (res.status == 1) {
                    that.detectionItems = data || [];
                    if (data.length > 0) {
                        that.itemId = data[0].ITEM_CODE;
                        that.temp_pid = data[0].ID;
                        let temp_name = data[0].ITEM_NAME
                        that.getChart( temp_name);
                    }
                }
            }).catch(error=>{
                console.log(error)
            })
        },
        getTime(val) {
            this.year = parseInt(val.split("-")[0]);
            this.month = parseInt(val.split("-")[1])<10?"0"+parseInt(val.split("-")[1]):parseInt(val.split("-")[1]);
            this.day = parseInt(val.split("-")[2])<10?"0"+parseInt(val.split("-")[2]):parseInt(val.split("-")[2]);
            this.getPipeWaterQualityDetailInfo_()
        }
    },
    created() {
        let time = new Date();
        this.year = time.getFullYear();
        this.month = (time.getMonth() + 1)<10?("0"+(time.getMonth() + 1)):(time.getMonth() + 1);
        this.day = time.getDate()<10?"0"+time.getDate():time.getDate();
        this.date_ = this.year + "/" + this.month + "/" + this.day;

        sessionStorage.setItem("initRoute", 2);
        this.$router.push({
            name: "pipe_monitor_surver_waterQc"
        })
        let data_ = parent.dse.globalData;
        // console.log(data_)
        this.tableContent = data_;
        let temp_pid = data_.MONITOR_PID;
        this.search_id = temp_pid;
        this.getPipeWaterQualityDetailInfo_()

    },
    filters: {
        formateName(val) {
            let temp_str = val;
            temp_str = temp_str.substring(0, 3);
            return temp_str
        },
        formateVal(val) {
            let temp_str = val;
            temp_str = temp_str.substring(3);
            return temp_str
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/resetCSS/monitor/devs.scss";

.long {
    width: 100%;
    height: 160px !important;
}

.short {
    width: 100%;
    height: calc(100% - 205px) !important;
}

.item {
    cursor: pointer;
}

.item:hover {
    background: rgba(0, 0, 0, 0.1);
}
</style>
