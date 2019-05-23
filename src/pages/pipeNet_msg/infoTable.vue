<template>
<div id="infoTable">
    <div class="top-head">
        <span class="title">{{title}}</span>
        <span class="back" @click='goHome'>返回</span>
    </div>
    <div class="wrap-content">
        <div class="card-item">
            <div class="wrap-select">
                <div class="inner-item">
                    <el-select v-model="everyday.everyday_y" placeholder="请选择" @change="everyday_year($event)">
                        <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <span>年</span>
                </div>
                <div class="inner-item">
                    <el-select v-model="everyday.everyday_m" placeholder="请选择" @change="everyday_month($event)">
                        <el-option v-for="item in months" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <span>月</span>
                </div>
            </div>
            <div id="chart">
                <IEcharts :option="everyday.bar" :loading="everyday.loading" :resizable="true" />
            </div>
            <div class="table-card">
                <div class="head">
                    <div class="item">
                        <div><span>日期</span></div>
                        <div><span>用水量(m³/天)</span></div>
                    </div>
                    <div class="item">
                        <div><span>日期</span></div>
                        <div><span>用水量(m³/天)</span></div>
                    </div>
                    <div class="item">
                        <div><span>日期</span></div>
                        <div><span>用水量(m³/天)</span></div>
                    </div>
                    <div class="item">
                        <div><span>日期</span></div>
                        <div><span>用水量(m³/天)</span></div>
                    </div>
                </div>
                <div class="content">
                    <div class="item" :class="{nth4:(index+1)%4==0}" v-for="(item,index) in everyday.tableData" :key="index" v-if="everyday.tableData.length>0">
                        <div>{{item.DAY}}</div>
                        <div>{{item.SUMNUM}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-item">
            <div class="wrap-select">
                <div class="inner-item">
                    <el-select v-model="year.year_y" placeholder="请选择" @change="year_year($event)">
                        <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <span>年</span>
                </div>
            </div>
            <div id="chart">
                <IEcharts :option="year.bar" :loading="year.loading" :resizable="true" />
            </div>
            <div class="table-card">
                <div class="head">
                    <div class="item">
                        <div>月份</div>
                        <div>用水量(m³/月)</div>
                    </div>
                    <div class="item">
                        <div>月份</div>
                        <div>用水量(m³/月)</div>
                    </div>
                    <div class="item">
                        <div>月份</div>
                        <div>用水量(m³/月)</div>
                    </div>
                    <div class="item">
                        <div>月份</div>
                        <div>用水量(m³/月)</div>
                    </div>
                </div>
                <div class="content">
                    <div class="item" :class="{nth4:(index+1)%4==0}" v-for="(item,index) in year.tableData" :key="index" v-if="year.tableData.length>0">
                        <div>{{item.MONTH}}</div>
                        <div>{{item.SUMNUM}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-item">
            <div class="wrap-select">
                <div class="inner-item">
                    <el-select v-model="quarter.quarter_y" placeholder="请选择" @change="quarter_year($event)">
                        <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <span>年</span>
                </div>
            </div>
            <div id="chart">
                <IEcharts :option="quarter.bar" :loading="quarter.loading" :resizable="true" />
            </div>
            <div class="table-card">
                <div class="head-two">
                    <div class="item">
                        <div><span>年份</span> </div>
                        <div><span>用水量(m³/年)</span></div>
                    </div>
                    <div class="item">
                        <div><span>年份</span> </div>
                        <div><span>用水量(m³/年)</span></div>
                    </div>
                </div>
                <div class="content-two">
                    <div class="item" v-for="(item,index) in quarter.tableData" :key="index" v-if="quarter.tableData.length>0">
                        <div>{{item.YEAR}}</div>
                        <div>{{item.NUM}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import IEcharts from "vue-echarts-v3/src/full.js";
import {
    getPipeWaterTotal
} from "@/api/pipeNet_msg/infoTable";
export default {
    components: {
        IEcharts
    },
    data() {
        return {
            title: "",
            currentYear: "",
            currentMonth: null,
            areaId: "",
            userId: "",
            monthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            everyday: {
                everyday_y: "",
                everyday_m: "",
                loading: false,
                tableData: [],
                bar: {
                    tooltip: {
                        trigger: "axis",
                        formatter: function (params) {
                        // var res='<div><p>当前日期：'+params[0].name+'日</p></div>' 
                        var res='' ;						
                        for(var i=0;i<params.length;i++){
                        	if(!params[i].data){
                        		params[i].data = "- -"
                        	}
                         res+='<p>'+params[i].name+'日'+params[i].seriesName+':  '+params[i].data+'m³</p>'
                        }
                        return res;
                        }
                    },
                    title: {
                        left: "center",
                        text: "每日用水量",
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    grid: {
                        top: "40px",
                        left: "40px",
                        right: "45px",
                        bottom: "30px"
                    },
                    xAxis: {
                        show: true,
                        name: "天",
                        data: []
                    },
                    yAxis: {
                        show: true,
                        name: "(m³)"
                    },
                    color: "#3b76b5",
                    series: [{
                        name: "用水量",
                        type: "line",
                        data: []
                    }]
                }
            },
            year: {
                year_y: "",
                year_m: "",
                loading: false,
                tableData: [],
                bar: {
                    tooltip: {
                        trigger: "axis",
                        formatter: function (params) {
                        // var res='<div><p>当前日期：'+params[0].name+'日</p></div>' 
                        var res='' ;						
                        for(var i=0;i<params.length;i++){
                        	if(!params[i].data){
                        		params[i].data = "- -"
                        	}
                         res+='<p>'+params[i].name+'月'+params[i].seriesName+':  '+params[i].data+'m³</p>'
                        }
                        return res;
                        }
                    },
                    title: {
                        left: "center",
                        text: "年用水量",
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    grid: {
                        top: "40px",
                        left: "40px",
                        right: "45px",
                        bottom: "30px"
                    },
                    xAxis: {
                        show: true,
                        name: "月",
                        data: []
                    },
                    yAxis: {
                        show: true,
                        name: "(m³)"
                    },
                    color: "#3288f2",
                    series: [{
                        name: "用水量",
                        type: "bar",
                        data: []
                    }]
                }
            },
            quarter: {
                quarter_y: "",
                quarter_m: "",
                loading: false,
                tableData: [],
                bar: {
                    tooltip: {
                        trigger: "axis",
                        formatter: function (params) {
                        // var res='<div><p>当前日期：'+params[0].name+'日</p></div>' 
                        var res='' ;						
                        for(var i=0;i<params.length;i++){
                        	if(!params[i].data){
                        		params[i].data = "- -"
                        	}
                         res+='<p>'+params[i].name+''+params[i].seriesName+':  '+params[i].data+'m³</p>'
                        }
                        return res;
                        }
                    },
                    title: {
                        left: "center",
                        text: "季度(用水量)",
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    grid: {
                        top: "40px",
                        left: "40px",
                        right: "45px",
                        bottom: "30px"
                    },
                    xAxis: {
                        show: true,
                        name: "季度",
                        data: ["1", "2", "3", "4"]
                    },
                    yAxis: {
                        show: true,
                        name: "(m³)"
                    },
                    color: "#1cbbdf",
                    series: [{
                        name: "季度用水量",
                        data: [0, 0, 0, 0],
                        type: "line",
                        areaStyle: {
                            normal: {
                                type: "default",
                                color: "#0fd1cb"
                            }
                        },
                        smooth: false,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: "default"
                                }
                            }
                        }
                    }]
                }
            }
        };
    },
    computed: {
        months() {
            let temp_months = [];
            for (let i = 1; i <= 12; i++) {
                temp_months.push({
                    value: i,
                    label: i
                });
            }
            return temp_months;
        },
        years() {
            let temp_time = new Date();
            let temp_years = [];
            let temp_year = parseInt(temp_time.getFullYear());
            let D_value = temp_year - 1970;
            for (let i = temp_year; i >= 1970; i--) {
                temp_years.push({
                    value: i,
                    label: i
                });
            }
            return temp_years;
        }
    },
    methods: {
        nowYear(num) {
            this.currentYear = num;
        },
        nowMonth(num) {
            this.currentMonth = num;
        },
        goHome() {
            // this.$router.push({
            //     name: "pipeNet_waterInformation"
            // });

            // this.$router.push({
            //     path:"/pipe/pipeNet_route/pipeNet_waterInformation"
            // })
            this.$router.go(-1);
            this.$store.commit("setAside_status", true);
            this.$emit("showAside");
        },
        everyday_year(event) {
            this.everyday.everyday_y = event;
            this.getDayChart();
        },
        everyday_month(event) {
            this.everyday.everyday_m = event;
            this.getDayChart();
        },
        year_year(event) {
            this.year.year_y = event;
            this.getYearChart();
        },
        quarter_year(event) {
            this.quarter.quarter_y = event;
            this.getQChart();
        },
        getAllChart(month) {
            let that = this;
            if(month){
                this.currentMonth = month;
            }
            getPipeWaterTotal({
                id: "" + that.userId,
                areaId: "" + that.areaId,
                year: "" + that.currentYear,
                month: "" + that.currentMonth
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                let data = res.data;
                let everyday_dataY = [];
                let everyday_dataX = [];
                let year_dataX = [];
                let year_dataY = [];
                if (data) {
                    let {
                        perMonth
                    } = data;
                    that.year.tableData = perMonth;
                    let table_year = [];
                    for (let i = 0; i < perMonth.length; i++) {
                        table_year.push({
                            MONTH: perMonth[i].MONTH.split("MONTH")[1],
                            SUMNUM: perMonth[i].SUMNUM
                        });
                    }
                    that.year.tableData = table_year;
                    for (let i = 0; i < perMonth.length; i++) {
                        let temp = perMonth[i].SUMNUM;
                        year_dataY.push(temp);
                        let temp_str = perMonth[i].MONTH.split("MONTH");
                        let temp_x = parseInt(temp_str[1]);
                        year_dataX.push(temp_x);
                    }
                    that.year.bar.xAxis.data = year_dataX;
                    that.year.bar.series[0].data = year_dataY;
                    let {
                        perDay
                    } = data;
                    let table_every = [];
                    for (let i = 0; i < perDay.length; i++) {
                        table_every.push({
                            DAY: perDay[i].DAY.split("DAY")[1],
                            SUMNUM: perDay[i].SUMNUM
                        });
                    }
                    that.everyday.tableData = table_every;
                    for (let i = 0; i < perDay.length; i++) {
                        let temp = perDay[i].SUMNUM;
                        everyday_dataY.push(temp);
                        let temp_str = perDay[i].DAY.split("DAY");
                        let temp_x = parseInt(temp_str[1]);
                        everyday_dataX.push(temp_x);
                    }
                    that.everyday.bar.xAxis.data = everyday_dataX;
                    that.everyday.bar.series[0].data = everyday_dataY;
                    let {
                        perQ
                    } = data;
                    let qList = [0, 0, 0, 0];
                    for (let i = 0; i < perQ.length; i++) {
                        let temp_index = parseInt(perQ[i].TIME) - 1;
                        qList[temp_index] = perQ[i].COUNT;
                    }
                    that.quarter.bar.series[0].data = qList;
                    let {
                        perYear
                    } = data;
                    that.quarter.tableData = perYear;
                }
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
            });;
        },
        getDayChart() {
            let that = this;
            getPipeWaterTotal({
                id: "" + that.userId,
                areaId: "" + that.areaId,
                year: "" + that.everyday.everyday_y,
                month: "" + that.everyday.everyday_m
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                let data = res.data;
                let everyday_dataY = [];
                let everyday_dataX = [];
                if (data) {
                    let {
                        perDay
                    } = data;
                    let table_every = [];
                    for (let i = 0; i < perDay.length; i++) {
                        table_every.push({
                            DAY: perDay[i].DAY.split("DAY")[1],
                            SUMNUM: perDay[i].SUMNUM
                        });
                    }
                    that.everyday.tableData = table_every;
                    for (let i = 0; i < perDay.length; i++) {
                        let temp = perDay[i].SUMNUM;
                        everyday_dataY.push(temp);
                        let temp_str = perDay[i].DAY.split("DAY");
                        let temp_x = parseInt(temp_str[1]);
                        everyday_dataX.push(temp_x);
                    }
                    that.everyday.bar.xAxis.data = everyday_dataX;
                    that.everyday.bar.series[0].data = everyday_dataY;
                }
            }).catch(function (error) {
                if (error == "Error: Network Error") {
                    that.$message.error("网络错误")
                    return;
                }
                that.$message.error("逻辑错误!")
            });;
        },
        getYearChart() {
            let that = this;
            getPipeWaterTotal({
                id: "" + that.userId,
                areaId: "" + that.areaId,
                year: "" + that.year.year_y,
                month: ""
            }).then(res => {
                  if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                let data = res.data;
                let year_dataX = [];
                let year_dataY = [];
                if (data) {
                    let {
                        perMonth
                    } = data;
                    that.year.tableData = perMonth;
                    let table_year = [];
                    for (let i = 0; i < perMonth.length; i++) {
                        table_year.push({
                            MONTH: perMonth[i].MONTH.split("MONTH")[1],
                            SUMNUM: perMonth[i].SUMNUM
                        });
                    }
                    that.year.tableData = table_year;
                    for (let i = 0; i < perMonth.length; i++) {
                        let temp = perMonth[i].SUMNUM;
                        year_dataY.push(temp);
                        let temp_str = perMonth[i].MONTH.split("MONTH");
                        let temp_x = parseInt(temp_str[1]);
                        year_dataX.push(temp_x);
                    }
                    that.year.bar.xAxis.data = year_dataX;
                    that.year.bar.series[0].data = year_dataY;
                }
            }).catch(function (error) {
                if (error == "Error: Network Error") {
                    that.$message.error("网络错误")
                    return;
                }
                that.$message.error("逻辑错误!")
            });;
        },
        getQChart() {
            let that = this;
            getPipeWaterTotal({
                id: "" + that.userId,
                areaId: "" + that.areaId,
                year: "" + that.quarter.quarter_y,
                month: ""
            }).then(res => {
                  if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                let data = res.data;
                if (data) {
                    let {
                        perQ
                    } = data;
                    let qList = [0, 0, 0, 0];
                    for (let i = 0; i < perQ.length; i++) {
                        let temp_index = parseInt(perQ[i].TIME) - 1;
                        qList[temp_index] = perQ[i].COUNT;
                    }
                    that.quarter.bar.series[0].data = qList;
                }
            }).catch(function (error) {
                if (error == "Error: Network Error") {
                    that.$message.error("网络错误")
                    return;
                }
                that.$message.error("逻辑错误!")
            });;
        }
    },
    created() {
        let temp_year = new Date().getFullYear();
        let temp_month = new Date().getMonth() + 1;
        this.everyday.everyday_y = temp_year;
        this.year.year_y = temp_year;
        this.quarter.quarter_y = temp_year;
        this.currentYear = temp_year;
        this.everyday.everyday_y = temp_year;
        this.everyday.everyday_m = temp_month;
        this.currentMonth = temp_month;
        // console.log(temp_month)

        this.year.year_y = temp_year;
        this.quarter.quarter_y = temp_year;
        this.title = this.$route.params.title;
        this.areaId = this.$route.params.areaId;
        this.userId = this.$route.params.userId;
        this.getAllChart(temp_month);
    },
    beforeDestroy() {
        this.$router.push({
            name: "pipeNet_waterInformation"
        });
        this.$store.commit("setAside_status", true);
        this.$emit("showAside");
    }
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

div {
    margin: 0;
    padding: 0;
}

#infoTable {
    width: 100%;
    height: 100%;
    background: #ebebeb;
    padding: 0px 1% 0;
    .top-head {
        text-align: center;
        font-weight: 600;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        position: relative;
        .back {
            position: absolute;
            right: 20px;
            top: 5px;
            color: #0c83ff;
            text-decoration: underline;
            cursor: pointer;
        }
    }
    .wrap-content {
        width: 100%;
        height: calc(100% - 30px);
        display: flex;
        justify-content: space-between;
        .card-item {
            width: 35%;
            height: 100%;
            padding: 10px;
            background: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            &:last-child {
                width: 28%;
            }
            .wrap-select {
                width: 100%;
                display: flex;
                justify-content: flex-start;
                height: 30px;
                line-height: 30px;
                .inner-item {
                    display: flex;
                    justify-content: space-between;
                    height: 100%;
                    margin-right: 10px;
                    width: 150px;
                    >span {
                        display: inline-block;
                        margin-left: 10px;
                    }
                }
                .btn {
                    height: 30px;
                    line-height: 30px;
                    color: #fff;
                    background: #0a83fe;
                    border-radius: 5px;
                    padding: 0 10px;
                    cursor: pointer;
                }
            }
            #chart {
                width: 100%;
                height: 45%;
            }
            .table-card {
                width: 100%;
                height: 45%;
                overflow-y: auto;
                border: 1px solid #ccc;
                font-size: 14px;
                .head {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    background: #e3ecee;
                    font-weight: 600;
                    .item {
                        width: 25%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        div {
                            width: 50%;
                            text-align: center;
                            height: 50px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            line-height: 25px;
                            border-right: 1px solid #ccc;
                            border-bottom: 1px solid #ccc;
                        }
                        &:nth-child(2n + 4) {
                            div:last-child {
                                border-right: none;
                            }
                        }
                    }
                }
                .head-two {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    background: #e3ecee;
                    font-weight: 600;
                    .item {
                        width: 50%;
                        display: flex;
                        justify-content: space-between;
                        div {
                            width: 50%;
                            height: 50px;
                            border-right: 1px solid #ccc;
                            border-bottom: 1px solid #ccc;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        &:nth-child(even) {
                            div:last-child {
                                border-right: none;
                            }
                        }
                    }
                }
                .content-two {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                    .item {
                        width: 50%;
                        display: flex;
                        justify-content: space-between;
                        line-height: 35px;
                        align-items: center;
                        div {
                            width: 50%;
                            text-align: center;
                            border-right: 1px solid #ccc;
                            border-bottom: 1px solid #ccc;
                            &:first-child{
                            	background: #d6fafa;
                            }
                        }
                        &:nth-child(even) {
                            div:last-child {
                                border-right: none;
                            }
                        }
                    }
                }
                .content {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    .item {
                        width: 25%;
                        display: flex;
                        justify-content: space-between;
                        border-right: 1px solid #ccc;
                        border-bottom: 1px solid #ccc;
                        div {
                            width: 50%;
                            height: 35px;
                            line-height: 35px;
                            text-align: center;
                            &:first-child {
                                border-right: 1px solid #ccc;
                                background: #d6fafa;
                            }
                        }
                        &.nth4 {
                            border-right: none;
                        }
                    }
                }
            }
            .pages {
                width: 100%;
                display: flex;
                justify-content: center;
            }
        }
    }
}
</style>
