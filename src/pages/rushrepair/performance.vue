<template>
<div id="statistic">
    <div class="year">
        <span>月份：</span>
        <el-date-picker v-model="year1" type="month" size="mini" placeholder="选择年" @change="getBar">
        </el-date-picker>
    </div>
    <div class="subChart long">
        <div class="chartitem">
            <div class="inner">
                <div slot="header" class="clearfix">
                    <i class="dse-rect-green"></i> <span>出勤率统计表</span>
                </div>
                <IEcharts class="echarts" :resizable="true" :option="attendanceRate" :loading="loading"></IEcharts>
            </div>
        </div>
        <!--<div class="chartitem">
            <div class="inner">
                <div slot="header" class="clearfix">
                    <i class="dse-rect-green"></i> <span>巡检完成率</span>
                </div>
                <IEcharts class="echarts" :resizable="true" :option="doRate" :loading="loading" @ready="onReady" @click="onClick"></IEcharts>
            </div>
        </div>-->
        <div class="chartitem">
            <div class="inner">
                <div slot="header" class="clearfix">
                    <i class="dse-rect-green"></i> <span>上报隐患数量统计表</span>
                </div>
                <IEcharts class="echarts" :resizable="true" :option="reportRate" :loading="loading" @ready="onReady" @click="onClick"></IEcharts>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import IEcharts from "vue-echarts-v3/src/full.js";
import {
    getCheckRecordReportByYearMonth
} from "@/api/rushrepair/statistic";
import TransformTime from "@/common/utils/utc_str_timeTrs"

// {
//                     show: true,
//                     height: 20,
//                     xAxisIndex: [0],
//                     bottom: 0,
//                     type: 'slider',
//                     start: 1,
//                     end: 35,
//                     handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
//                     handleSize: '110%',
//                     handleStyle: {
//                         color: '#9B4E4E'
//                     }
//                 }
export default {
    name: "StatisticalAnalysis",
    components: {
        IEcharts
    },
    data() {
        return {
            loading: true,
            month1: "", //包含 年月
            month: "", // 只包含月份
            year1: "", // 年份
            post_year: "",
            post_month: "",
            attendanceRate: {
                color: ["#d398DB"],
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: "40px",
                    left: "60px",
                    right: "45px",
                    bottom: "60px",
//                  containLabel: true
                },
                xAxis: [{
                    type: "category",
                    data: [],
                    axisPointer: {
                        type: 'shadow'
                    },
                    splitLine: {
                        show: false
                    },
                    boundaryGap: true,
                    name: ""
                }],
                legend: {
                    show: false
                },
                yAxis: [{
                    type: "value",
                    name: "出勤次数"
                }],
                dataZoom: [{
                    id: 'dataZoomX',
                    type: 'slider',
                    xAxisIndex: [0],
                    filterMode: 'filter'
                    }
                ],
                color: "#68ab4a",
                series: [{
                    name: "出勤次数",
                    type: "bar",
                    barWidth: "20%",
                    data: []
                }]
            },
            doRate: {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        crossStyle: {
                            color: "#999"
                        }
                    }
                },
                grid: {
                    top: "40px",
                    left: "40px",
                    right: "45px",
                    bottom: "60px"
                },
                legend: {
                    top: "3%",
                    data: ["计划数量", "实际数量", "完成率"]
                },
                xAxis: [{
                    type: "category",
                    data: [],
                    axisPointer: {
                        type: "shadow"
                    },
                    boundaryGap: true,
                    name: ""
                }],
                yAxis: [{
                        type: "value",
                        name: "数量"
                    },
                    {
                        type: "value",
                        name: "完成率(%)"
                    }
                ],
                dataZoom: [{
                    id: 'dataZoomX',
                    type: 'slider',
                    xAxisIndex: [0],
                    filterMode: 'filter'
                    }
                ],
                series: [{
                        name: "计划数量",
                        type: "bar",
                        barWidth: "20%",
                        itemStyle: {
                            normal: {
                                color: "#2e8ed8"
                            }
                        },
                        data: []
                    },
                    {
                        name: "实际数量",
                        type: "bar",
                        barWidth: "20%",
                        itemStyle: {
                            normal: {
                                color: "#c0504d"
                            }
                        },
                        data: []
                    },
                    {
                        name: "完成率",
                        type: "line",
                        itemStyle: {
                            normal: {
                                color: "#97b852"
                            }
                        },
                        yAxisIndex: 1,
                        data: []
                    }
                ]
            },
            reportRate: {
                color: ["#e3989B"],
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: "40px",
                    left: "40px",
                    right: "45px",
                    bottom: "60px"
                },

                xAxis: [{
                    type: "category",
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    },
                    boundaryGap: true,
                    name: ""
                }],
                yAxis: [{
                    type: "value",
                    name: "数量"
                }],
                dataZoom: [{
                    id: 'dataZoomX',
                    type: 'slider',
                    xAxisIndex: [0],
                    filterMode: 'filter'
                    }],
                color: "#df9424",
                series: [{
                    name: "隐患数量",
                    type: "bar",
                    barWidth: "20%",
                    data: []
                }]
            }
        };
    },
    methods: {
        onReady(instance) {},
        onClick(event, instance, echarts) {
            // console.log(arguments);
        },
        getCheckRecordReportByYearMonth_() {
            let that = this;
            let temp_year = that.post_year;
            let temp_month = that.post_month;
            getCheckRecordReportByYearMonth({
                year: "" + temp_year,
                month: "" + temp_month
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`;
                    return;
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!");
                    return;
                }
                if (res.status == 1) {
                    let {
                        checkNumReport,
                        problemAreaReport,
                        problemTypeAreaReport
                    } = res.data;
                    //出勤率统计表
                    let temp_problemAreaReport_x = [];
                    let temp_problemAreaReport_y = [];

                    let temp_problemAreaReport = problemAreaReport || [];
                    if (temp_problemAreaReport.length) {
                        for (let i = 0; i < temp_problemAreaReport.length; i++) {
                            temp_problemAreaReport_x.push(
                                temp_problemAreaReport[i].NAME
                            )
                            temp_problemAreaReport_y.push(
                                temp_problemAreaReport[i].NUM
                            )
                        }
                    }
                    that.attendanceRate.xAxis[0].data = temp_problemAreaReport_x;
                    that.attendanceRate.series[0].data = temp_problemAreaReport_y;

                    // 巡检完成率
                    let temp_problemTypeAreaReport = problemTypeAreaReport || [];
                    let temp_problemTypeAreaReport_x = [];
                    let temp_problemTypeAreaReport_plan = [];
                    let temp_problemTypeAreaReport_real = [];
                    let temp_problemTypeAreaReport_finish = [];
                    if (temp_problemTypeAreaReport.length) {
                        for (let i = 0; i < temp_problemTypeAreaReport.length; i++) {
                            temp_problemTypeAreaReport_x.push(
                                temp_problemTypeAreaReport[i].NAME
                            )
                            temp_problemTypeAreaReport_plan.push(
                                temp_problemTypeAreaReport[i].PLANNUM
                            )
                            temp_problemTypeAreaReport_real.push(
                                temp_problemTypeAreaReport[i].REALNUM
                            )
                            temp_problemTypeAreaReport_finish.push(
                                temp_problemTypeAreaReport[i].FINISHRATE
                            )
                        }
                    }
                    that.doRate.xAxis[0].data = temp_problemTypeAreaReport_x;
                    that.doRate.series[0].data = temp_problemTypeAreaReport_plan;
                    that.doRate.series[1].data = temp_problemTypeAreaReport_real;
                    that.doRate.series[2].data = temp_problemTypeAreaReport_finish;

                    // 上报隐患数量统计表
                    let temp_checkNumReport = checkNumReport || [];
                    let temp_checkNumReport_x = [];
                    let temp_checkNumReport_y = [];
                    if (temp_checkNumReport.length) {
                        for (let i = 0; i < temp_checkNumReport.length; i++) {
                            temp_checkNumReport_x.push(
                                temp_checkNumReport[i].NAME
                            )
                            temp_checkNumReport_y.push(
                                temp_checkNumReport[i].PROBNUM
                            )
                        }
                    }
                    that.reportRate.xAxis[0].data = temp_checkNumReport_x;
                    that.reportRate.series[0].data = temp_checkNumReport_y;

                }
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // } else {
                //     that.$message.error("逻辑错误!")
                // }
            });
        },
        getBar(val) {
            let temp = new TransformTime(val).format_yymm();
            this.post_year = temp.split("/")[0];
            this.post_month = parseInt(temp.split("/")[1]);
            this.getCheckRecordReportByYearMonth_();
        }

    },
    mounted() {
        this.loading = false;
    },
    created() {
        let time = new Date();
        let year = time.getUTCFullYear();
        let widthMonth = year + "-" + (time.getUTCMonth() + 1 < 10 ? "0" + (time.getUTCMonth() + 1) : time.getUTCMonth() + 1);
        this.year1 = widthMonth;
        this.month1 = widthMonth
        this.month = "" + (time.getUTCMonth() + 1);
        this.post_year = year;
        this.post_month = "" + (time.getUTCMonth() + 1);
        this.getCheckRecordReportByYearMonth_();
    }
}
</script>

<style lang="scss" scoped>
$baseFont:14px;
$baseColor:#333;
$baseBorderColor:#ccc;
#statistic {
    width: 100%;
    height: calc(100% - 40px);
    padding: 10px;
    font-size: 14px;
    color: #333;
    .tabs {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        .tabItem {
            display: inline-block;
            padding: 10px 25px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-right: 20px;
            cursor: pointer;
            &.actived {
                background: #3a8ee6;
                color: #fff;
            }
        }
    }
    .year,
    .month {
        width: 100%;
        margin: 10px;
    }
    .subChart {
        width: 100%;
        height: calc(50% - 75px);
        display: flex;
        justify-content: flex-start;
        .chartitem {
            width: 25%;
            padding-right: 10px; // &:first-child {
            //     width: 20%;
            // }
            &:last-child {
                padding-right: 0px;
            }
            .inner {
                width: 100%;
                height: 100%;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                .clearfix {
                    height: 30px;
                    line-height: 30px;
                    font-size: $baseFont;
                    padding-left: 10px;
                    border-bottom: 1px solid #ccc;
                }
                .datechoose {
                    width: 100%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    margin: 10px 0;
                    padding-right: 25px;
                    .el-date-editor {
                        margin-left: 10px;
                    }
                }
                .echarts {
                    height: calc(100% - 30px) !important;
                }
            }
        }
        &.long {
            .chartitem {
                width: 33.33%;
            }
        }
    }
}
</style>
