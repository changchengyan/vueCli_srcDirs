<template>
<div id="devs">
    <div class="date">
        <el-date-picker v-model="date_" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="getTime">
        </el-date-picker>
    </div>
    <div class="charts long" id="chart">
        <IEcharts :option="devs.line" :loading="devs.loading" :resizable="true" />
    </div>
    <div class="content short">
        <div class="row">
            <div class="col"><span>最小值</span></div>
            <div class="col"><span>{{tableContent.MINVAL}}</span></div>
            <div class="col"><span>发生时间</span></div>
            <div class="col"><span>{{tableContent.min_time}}</span></div>
        </div>
        <div class="row">
            <div class="col"><span>最大值</span></div>
            <div class="col"><span>{{tableContent.MAXVAL}}</span></div>
            <div class="col"><span>发生时间</span></div>
            <div class="col"><span>{{tableContent.max_time}}</span></div>
        </div>
    </div>

</div>
</template>

<script>
import {

    getPipeFlowDetailInfo,
    getPipeWaterGageDetailInfo
} from "@/api/monitor/surver"
import IEcharts from "vue-echarts-v3/src/full.js";
export default {
    components: {
        IEcharts
    },
    data() {
        return {
            date_: "",
            type: null, //设备类型
            devs: {
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
                        left: "50px",
                        right: "50px",
                        bottom: "50px"
                    },
                    xAxis: [{
                        name: "时间",
                        type: "category",
                        boundaryGap: false,
                        data: [],
                        axisLabel: {
                            'interval': 0,
                            rotate: 30
                        }
                    }],
                    yAxis: {
                        name: "(mg/L)",
                        type: "value",
                        splitLine: {
                            lineStyle: {
                               type:"dashed"
                            }
                        }
                    },
                    color: "#1cbbdf",
                  
                    series: [ {
                        data: [],
                        type: "line",
                        name: "最高限值",
                        step: 'end',
                        itemStyle: {
                            normal: {
                                color: '#f391a9',
                            }
                        },
                        lineStyle:{
                            type:"dashed",
                           opacity:0.8
                        }
                    },
                    {
                        data: [],
                        type: "line",
                        name: "实时值",
                        itemStyle: {
                            normal: {
                                color: '#0590fa'
                            }
                        }
                    }, {
                        data: [],
                        type: "line",
                        name: "最低限值",
                        step: 'end',
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
                max_time: "",
                MAXVAL: 0,
                min_time: "",
                MINVAL: 0
            },
            type_id:"", //水流或者水压的设备ID
        }
    },
    methods: {
        formateTime(str) {
            let temp_str = str;
            let hour_ = parseInt(temp_str.split(":")[0]) * 60;
            let min_ = parseInt(temp_str.split(":")[1]);
            return hour_ + min_;
        },
        getPipeWaterGageDetailInfo_() {
            let that = this;
            let temp_year = this.year;
            let temp_month = this.month;
            let temp_day = this.day;
            let temp_type = this.type_id;
            getPipeWaterGageDetailInfo({
                year: "" + temp_year,
                month: "" + temp_month,
                day: "" + temp_day,
                moniPointId: "" + temp_type
            }).then(res => {
                if (res.msg == "no user") {
                    window.parent.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                let line_normal_x = [];
                let line_normal_y = [];
                let line_min_y = [];
                let line_max_y = [];

                let min_max_json = [];
                let {
                    data
                } = res;
                let {
                    pipeFlowDetailInfo,
                    pipeFlowDetailRangeInfo,
                    pipeFlowDetaiMaxInfo,
                    pipeFlowDetailMinInfo
                } = data;

                if (pipeFlowDetailRangeInfo.length > 0) {
                    pipeFlowDetailRangeInfo.map(val => {
                        if (val.START_TIME && val.END_TIME) {
                            let tempJson = {};
                            tempJson.startTime = that.formateTime(val.START_TIME);
                              if(val.END_TIME=="00:00"){
                               tempJson.endTime = that.formateTime("24:00");
                            }else{
                               tempJson.endTime = that.formateTime(val.END_TIME);
                            }
                            tempJson.min = val.MINVALUE;
                            tempJson.max = val.MAXVALUE;
                            min_max_json.push(tempJson)
                        }
                    })
                }

                if (pipeFlowDetailInfo.length > 0) {
                    pipeFlowDetailInfo.map(val => {
                        let temp_time = val.COLLECT_TIME;
                        temp_time = temp_time.split(":")
                        temp_time = temp_time[0]+":"+temp_time[1]
                        line_normal_x.push(
                           temp_time
                        )
                        line_normal_y.push(
                            parseFloat(val.SUMVAL)
                        )
                        min_max_json.map(pl => {
                            let temp_real = that.formateTime(val.COLLECT_TIME);
                            if (temp_real > pl.startTime && temp_real < pl.endTime) {
                                line_min_y.push(pl.min);
                                line_max_y.push(pl.max);
                            }
                        })

                    })
                }

                that.devs.line.xAxis[0].data = line_normal_x;
                that.devs.line.series[0].data = line_max_y;
                that.devs.line.series[1].data = line_normal_y ;
                that.devs.line.series[2].data = line_min_y;
                that.tableContent.max_time =pipeFlowDetaiMaxInfo.length>0? pipeFlowDetaiMaxInfo[0].HAPPENDTIME : "";
                that.tableContent.MAXVAL =pipeFlowDetaiMaxInfo.length>0? pipeFlowDetaiMaxInfo[0].MAXVAL : "";
                that.tableContent.min_time = pipeFlowDetailMinInfo.length>0?pipeFlowDetailMinInfo[0].HAPPENDTIME : "";
                that.tableContent.MINVAL = pipeFlowDetailMinInfo.length>0?pipeFlowDetailMinInfo[0].MINVAL : "";
            })
        },
        getPipeFlowDetailInfo_(){
            let that = this;
            let temp_year = this.year;
            let temp_month = this.month;
            let temp_day = this.day;
            let temp_type = this.type_id;
            getPipeFlowDetailInfo({
                year: "" + temp_year,
                month: "" + temp_month,
                day: "" + temp_day,
                moniPointId: "" + temp_type
            }).then(res=>{
                if (res.msg == "no user") {
                    window.parent.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                let line_normal_x = [];
                let line_normal_y = [];
                let line_min_y = [];
                let line_max_y = [];

                let min_max_json = [];
                let {
                    data
                } = res;
                let {
                    pipeFlowDetailInfo,
                    pipeFlowDetailRangeInfo,
                    pipeFlowDetaiMaxInfo,
                    pipeFlowDetailMinInfo
                } = data;

                if (pipeFlowDetailRangeInfo.length > 0) {
                    pipeFlowDetailRangeInfo.map(val => {
                        if (val.START_TIME && val.END_TIME) {
                            let tempJson = {};
                            tempJson.startTime = that.formateTime(val.START_TIME);
                            if(val.END_TIME=="00:00"){
                               tempJson.endTime = that.formateTime("24:00");
                            }else{
                               tempJson.endTime = that.formateTime(val.END_TIME);
                            }
                            tempJson.min = val.MINVALUE;
                            tempJson.max = val.MAXVALUE;
                            min_max_json.push(tempJson)
                        }
                    })
                }

                if (pipeFlowDetailInfo.length > 0) {
                    pipeFlowDetailInfo.map(val => {
                        let temp_time = val.COLLECT_TIME;
                        temp_time = temp_time.split(":")
                        temp_time = temp_time[0]+":"+temp_time[1]
                        line_normal_x.push(
                           temp_time
                        )
                        line_normal_y.push(
                            parseFloat(val.SUMVAL)
                        )
                        min_max_json.map(pl => {
                            let temp_real = that.formateTime(val.COLLECT_TIME);
                            if (temp_real > pl.startTime && temp_real < pl.endTime) {
                                line_min_y.push(pl.min);
                                line_max_y.push(pl.max);
                            }
                        })

                    })
                }

                that.devs.line.xAxis[0].data = line_normal_x;
                that.devs.line.series[0].data =line_max_y ;
                that.devs.line.series[1].data = line_normal_y;
                that.devs.line.series[2].data = line_min_y;

                // console.log(line_max_y)
                
                that.tableContent.max_time =pipeFlowDetaiMaxInfo.length>0? pipeFlowDetaiMaxInfo[0].HAPPENDTIME : "";
                that.tableContent.MAXVAL =pipeFlowDetaiMaxInfo.length>0? pipeFlowDetaiMaxInfo[0].MAXVAL : "";
                that.tableContent.min_time = pipeFlowDetailMinInfo.length>0?pipeFlowDetailMinInfo[0].HAPPENDTIME : "";
                that.tableContent.MINVAL = pipeFlowDetailMinInfo.length>0?pipeFlowDetailMinInfo[0].MINVAL : "";
            }).catch(error=>{
                console.log(error)
            })
        },
        getTime(val) {
            this.year = val.split("-")[0];
            this.month = val.split("-")[1];
            this.day = val.split("-")[2];
            if(this.type == '3'){
               this.getPipeFlowDetailInfo_()
            }else{
              this.getPipeWaterGageDetailInfo_()
            }
        }
    },
    created() {
        let time = new Date();
        this.year = time.getFullYear();
        this.month = time.getMonth() + 1;
        this.day = time.getDate();
        this.date_ = this.year + "/" + this.month + "/" + this.day;
        sessionStorage.setItem("initRoute", 2);
        this.$router.push({
            name: "pipe_monitor_surver_pressAndFlow"
        })
        let data_ = parent.dse.globalData;
        if(data_.typeFlag=="水流"){
            this.type = "3"
        }else{
            this.type = "2"
        }
        this.type_id = data_.MONITOR_PID;
        if (data_.typeFlag=="水流") {
            this.devs.line.title.text = '流量';
            this.getPipeFlowDetailInfo_()
            this.devs.line.yAxis.name="m³/s"
        } else if(data_.typeFlag=="水压") {
            this.devs.line.title.text = '水压';
            this.getPipeWaterGageDetailInfo_();
            this.devs.line.yAxis.name="(mg/L)"
        }

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
</style>
