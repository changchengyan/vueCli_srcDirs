<template>
<div id="msg_analysis">
    <div class="row">
        <div class="title">
            <span class="logo"></span>
            <span class="tip">管材信息统计</span>
        </div>
        <div class="wrap-cards">
            <div class="col">
                <div class="top-head">
                    <span>管线综合信息统计</span>
                </div>
                <div class="wrap-select">
                    <div class="select-item">
                        <el-select v-model="turbo_y" placeholder="请选择年" @change="turbo_year($event)">
                            <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="select-item">
                        <el-select v-model="turbo_m" placeholder="请选择月" @change="turbo_month($event)">
                            <el-option v-for="item in months" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div id="chart">
                    <IEcharts :option="pipe.bar" :loading="pipe.loading" :resizable="true" />
                </div>
            </div>
            <div class="col">
                <div class="top-head">
                    <span>{{pe_title}}道信息统计表</span>
                </div>
                <div class="wrap-select">
                    <div class="select-item">
                        <el-select v-model="pe_y" placeholder="请选择" @change="pe_year($event)">
                            <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="select-item">
                        <el-select v-model="pe_metrial" placeholder="请选择" @change="pe_metr($event)">
                            <el-option v-for="item in mrtrial_pipe.metrial" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>

                </div>
                <div id="chart">
                    <IEcharts :option="mrtrial_pipe.bar" :loading="mrtrial_pipe.loading" :resizable="true" />
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="title">
            <span class="logo"></span>
            <span class="tip">设备信息统计</span>
        </div>
        <div class="wrap-cards">
            <div class="col">
                <div class="top-head">
                    <span>设备数量统计表</span>
                </div>
                <div class="wrap-select">
                    <div class="select-item">
                        <el-select v-model="dev_y" placeholder="请选择" @change="dev_year($event)">
                            <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="select-item">
                        <el-select v-model="dev_m" placeholder="请选择" @change="dev_month($event)">
                            <el-option v-for="item in months" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>

                </div>
                <div id="chart">
                    <IEcharts :option="dev.bar" :loading="dev.loading" :resizable="true" />
                </div>
            </div>
            <div class="col">
                <div class="top-head">
                    <span>{{fireplug_title}}数量统计表</span>
                </div>
                <div class="wrap-select">
                    <div class="select-item">
                        <el-select v-model="fireplug_y" placeholder="请选择" @change="fireplug_year($event)">
                            <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="select-item">
                        <el-select v-model="fireplug_m" placeholder="请选择" @change="fireplug_month($event)">
                            <el-option v-for="item in devs" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>

                </div>
                <div id="chart">
                    <IEcharts :option="fireplug.bar" :loading="fireplug.loading" :resizable="true" />
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import IEcharts from "vue-echarts-v3/src/full.js";
import {
    getPipeDeviceNumReport,
    getPipeDeviceValveReport,
    getPipeRadiusReport
} from "@/api/pipeNet_msg/msg_analysis";
export default {
    components: {
        IEcharts
    },
    data() {
        return {
            pipe: {
                loading: false,
                bar: {
                    tooltip: {},
                    grid: {
                        top: "40px",
                        left: "40px",
                        right: "45px",
                        bottom: "30px"
                    },
                    xAxis: {
                        show: true,
                        name: "管径",
                        data: []
                    },
                    yAxis: {
                        show: true,
                        name: "(管长m)"
                    },
                    color: "#2d9fff",
                    series: [{
                        name: "综合管线长度",
                        type: "bar",
                        barWidth: "10%",
                        data: []
                    }]
                }
            },
            mrtrial_pipe: {
                metrial: [{
                        value: "pipe_pe",
                        label: "PE管"
                    },
                    {
                        value: "pipe_concrete",
                        label: "水泥管"
                    },
                    {
                        value: "pipe_steel",
                        label: "钢管"
                    },
                    {
                        value: "pipe_pvc",
                        label: "钢管"
                    },
                    {
                        value: "pipe_ball",
                        label: "球墨铸铁管"
                    },
                    {
                        value: "pipe_other",
                        label: "其他管"
                    }
                ],
                loading: false,
                bar: {
                    tooltip: {},
                    grid: {
                        top: "40px",
                        left: "40px",
                        right: "45px",
                        bottom: "30px"
                    },
                    xAxis: {
                        show: true,
                        name: "管径",
                        data: []
                    },
                    yAxis: {
                        show: true,
                        name: "(管长m)"
                    },
                    color: "#1dbbe0",
                    series: [{
                        name: "PE管线长度",
                        type: "bar",
                        barWidth: "10%",
                        data: []
                    }]
                }
            },
            dev: {
                loading: false,
                bar: {
                    tooltip: {},
                    grid: {
                        top: "40px",
                        left: "40px",
                        right: "45px",
                        bottom: "30px"
                    },
                    xAxis: {
                        show: true,
                        data: []
                    },
                    yAxis: {
                        show: true,
                        name: "设备数量(个)"
                    },
                    color: "#527696",
                    series: [{
                        name: "设备数量",
                        barWidth: "10%",
                        type: "bar",
                        data: []
                    }]
                }
            },
            fireplug: {
                loading: true,
                metrial: [],
                bar: {
                    tooltip: {
                        trigger: "axis",
                        formatter:'{b}月份:</br>{a}:{c}个'
                    },
                    grid: {
                        top: "40px",
                        left: "40px",
                        right: "45px",
                        bottom: "30px"
                    },
                    xAxis: {
                        type: "category",
                        name: "月份",
                        boundaryGap: false,
                        data: [
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                            "10",
                            "11",
                            "12"
                        ]
                    },
                    yAxis: {
                        type: "value",
                        name: "个数",
                        splitLine: {
                            show: true
                        }
                    },
                    color: "#0d9ef7",
                    series: [{
                        data: [],
                        name:"设备个数",
                        type: "line",
                        areaStyle: {
                            normal: {
                                type: "default",
                                color: "#5abbf6"
                            }
                        },
                        smooth: false,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: "default",
                                    color: "#5abbf6"
                                }
                            }
                        }
                    }]
                }
            },
            turbo_y: "",
            turbo_m: "",
            pe_y: "", // 年份表
            pe_metrial: "", // 所选材料
            pe_title: "",
            dev_y: "",
            dev_m: "",
            fireplug_y: "",
            fireplug_m: "",
            fireplug_title: "",
            currentYear: "",
            currentMonth: "",
            componyID:"",//水司id
            devs:[]
        };
    },
    methods: {
        turbo_year(val) {
            const that = this;
            this.turbo_y = val;
            let temp_month = this.turbo_m;
            //ajax请求
            that.getPipeStatic_data();
        },
        turbo_month(val) {
            const that = this;
            this.turbo_m = val;
            let temp_year = this.turbo_y;
            //ajax请求
            that.getPipeStatic_data();
        },
        pe_year(val) {
            const that = this;
            this.pe_y = val;
            //ajax请求
            that.getMaterial_data();
        },
        pe_metr(val) {
            const that = this;
            that.pe_metrial = val;
            let temp_list = that.mrtrial_pipe.metrial;
            let temp_label = "";
            for (let i = 0; i < temp_list.length; i++) {
                if (temp_list[i].value == val) {
                    temp_label = temp_list[i].label;
                    break;
                }
            }
            // let temp_tear = that.pe_y;
            // let temp_index = parseInt(val) - 1;
            this.pe_title = temp_label;
            //ajax请求
            that.getMaterial_data();
        },
        dev_year(val) {
            const that = this;
            this.dev_y = val;
            //ajax请求
            that.getPipeDeviceValve_data();
        },
        dev_month(val) {
            const that = this;
            let temp_year = this.dev_y;
            this.dev_m = val;
            //ajax请求
            that.getPipeDeviceValve_data();
        },
        fireplug_year(event) {
            const that = this;
            let devType = this.fireplug_m;
            this.fireplug_y = event;
            //ajax请求
            that.getPipeDeviceNum_data();
        },
        fireplug_month(val) {
            const that = this;
            this.fireplug_m = val;
            switch(val){
                case "8ae4b2d164bc35570164d0528f8d01ad":
                    this.fireplug_title = "阀门"
                    break;
                 case "8ae4b2d164bc35570164d055928d01ae":
                    this.fireplug_title = "消防栓"
                    break;
                 case "8ae4b2d164bc35570164d056260a01af":
                    this.fireplug_title = "流量计"
                    break;
                 case "8ae4b2d164bc35570164d056b3de01b0":
                    this.fireplug_title = "压力计"
                    break;
                 case "8ae4b2d164bc35570164d05754f001b1":
                    this.fireplug_title = "水质仪器"
                    break;
                 case "8ae4b2d164bc35570164d0585b6f01b2":
                    this.fireplug_title = "其他设备"
                    break;
            }
            let temp_year = this.fireplug_y;
            //ajax请求
            that.getPipeDeviceNum_data();
        },
        getPipeStatic_data() {
            let that = this;
            getPipeRadiusReport({
                areaId: "",
                year: "" + that.turbo_y,
                month: "" + that.turbo_m,
                material: "",
                companyId:"" + that.componyID
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.status == 1) {
                    if (res.data.length > 0) {
                        let temp_y = res.data.map(item => {
                            return item.SUMLENGTH;
                        });
                        let temp_x = res.data.map(item => {
                            return item.PIPE_RADIUS;
                        });
                        that.pipe.bar.series[0].data = temp_y;
                        that.pipe.bar.xAxis.data = temp_x;
                    } else {
                        that.pipe.bar.series[0].data = [];
                    }
                } else {
                    that.pipe.bar.series[0].data = [];
                }
                that.pipe.loading = false;
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
            });;
        },
        getMaterial_data() {
            let that = this;
            getPipeRadiusReport({
                areaId: "",
                year: "" + that.pe_y,
                month: "",
                material: "" + that.pe_metrial,
                companyId:"" + that.componyID
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.status == 1) {
                    if (res.data.length > 0) {
                        let temp_y = res.data.map(item => {
                            return item.SUMLENGTH;
                        });
                        let temp_x = res.data.map(item => {
                            // return item.PIPE_RADIUS.split("_")[1];
                            return item.PIPE_RADIUS;

                        });
                        that.mrtrial_pipe.bar.series[0].data = temp_y;
                        that.mrtrial_pipe.bar.xAxis.data = temp_x;
                    } else {
                        that.mrtrial_pipe.bar.series[0].data = [];
                    }
                } else {
                    that.mrtrial_pipe.bar.series[0].data = [];
                }
                that.mrtrial_pipe.loading = false;
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
            });;
        },
        getPipeDeviceNum_data() {
            let that = this;
            getPipeDeviceNumReport({
                year: "" + that.fireplug_y,
                deviceType: "" + that.fireplug_m,
                companyId:"" + that.componyID
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.status == 1) {
                    if (res.data.length > 0) {
                        let temp_y = res.data.map(item => {
                            return item.NUM;
                        });
                        that.fireplug.bar.series[0].data = temp_y;
                    } else {
                        that.fireplug.bar.series[0].data = [];
                    }
                }
                that.fireplug.loading = false;
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
            });;
        },
        getPipeDeviceValve_data() {
            let that = this;
            getPipeDeviceValveReport({
                year: "" + that.dev_y,
                month: that.dev_m,
                deviceType: "",
                isCaliber: false,
                companyId:"" + that.componyID
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.status == 1) {
                    if (res.data.length > 0) {
                        // this.fireplug.bar.series=res.data
                        let temp_y = res.data.map(item => {
                            return item.NUM;
                        });
                        let temp_x = res.data.map(item => {
                            return item.NAME;
                        });
                        that.dev.bar.series[0].data = temp_y;
                        that.dev.bar.xAxis.data = temp_x;
                    } else {
                        that.dev.bar.series[0].data = [];
                    }
                } else {
                    that.dev.bar.series[0].data = [];
                }
                that.dev.loading = false;
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
            });;
        }
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
    created() {
        const that = this;
        that.componyID = this.$store.getters.get_companyId;
        let temp_time = new Date();
        let temp_year = temp_time.getFullYear();
        let temp_month = temp_time.getMonth() + 1;
        this.currentYear = temp_year;
        this.turbo_y = temp_year;
        this.pe_y = temp_year;
        this.dev_y = temp_year;
        this.fireplug_y = temp_year;
        this.turbo_m = temp_month + "";

        this.devs = dse.devices;
        this.fireplug_m = (dse.devices[0]).value

        let temp_arr = JSON.parse(JSON.stringify(dse.productLists));
        this.fireplug.metrial = temp_arr.splice(1,temp_arr.length-1);
        this.pe_title = this.mrtrial_pipe.metrial[0].label;
        this.fireplug_title = this.devs[0].label;
        this.dev_m = temp_month + "";
        this.pe_metrial=  "pipe_pe";
        this.fireplug_m =this.devs[0].value;
        that.getPipeStatic_data();
        that.getMaterial_data();
        that.getPipeDeviceNum_data();
        that.getPipeDeviceValve_data();
    }
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

#msg_analysis {
    width: 100%;
    height: 100%;
    padding: 10px;
    background: #ebebeb;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .row {
        width: 100%;
        height: 48%;
        border: 1px solid #d9d8d8;
        background: #fff;
        .title {
            height: 20px;
            width: 100%;
            border-bottom: 1px solid #d9d8d8;
            line-height: 20px;
            font-size: 12px;
            color: #333;
            padding: 0 10px;
            .logo {
                display: inline-block;
                width: 12px;
                height: 12px;
                background: green;
                margin-right: 10px;
            }
        }
        .wrap-cards {
            width: 100%;
            height: calc(100% - 20px);
            display: flex;
            justify-content: space-between;
            .col {
                width: 50%;
                padding: 10px;
                &:first-child {
                    border-right: 1px solid #d9d8d8;
                }
                .top-head {
                    line-height: 30px;
                    font-size: 14px;
                    font-weight: 600;
                    text-align: center;
                }
                .wrap-select {
                    width: 100%;
                    height: 30px;
                    display: flex;
                    justify-content: flex-start;
                    .select-item {
                        width: 100px;
                        margin-right: 10px;
                        text-align: center;
                        position: relative;
                        background: #fff;
                        cursor: pointer;
                    }
                }
                #chart {
                    width: 100%;
                    height: calc(100% - 55px);
                }
            }
        }
    }
}
</style>
