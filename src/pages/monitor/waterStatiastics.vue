<template>
<div id="waterStatiastics">
    <div class="left-table">
        <div class="time-picker">
            <el-select v-model="searchYear" placeholder="请选择" @change="getYear_selected($event)">
                <el-option v-for="item in commonYears" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="table-item">
            <div class="inner-table">
                <div class="top-head">
                    <span class="tangle"></span>
                    <span>{{currentYear}}年度实际用水量</span>
                </div>
                <div class="chart">
                    <IEcharts :option="realWaterSupply.bar" :loading="realWaterSupply.loading" :resizable="true" />
                </div>
            </div>
        </div>
        <div class="table-item">
            <div class="inner-table">
                <div class="top-head">
                    <span class="tangle"></span>
                    <span>{{currentYear}}年度管网末梢余氯</span>
                </div>
                <div class="chart">
                    <IEcharts :option="left_cl.bar" :loading="left_cl.loading" :resizable="true" />
                </div>
            </div>
        </div>
        <div class="table-item">
            <div class="inner-table">
                <div class="top-head">
                    <span class="tangle"></span>
                    <span>{{currentYear}}年度平均压力</span>
                </div>
                <div class="chart">
                    <IEcharts :option="range_waterPress.bar" :loading="range_waterPress.loading" :resizable="true" />
                </div>
            </div>
        </div>
        <div class="table-item">
            <div class="inner-table">
                <div class="top-head">
                    <span class="tangle"></span>
                    <span>{{currentYear}}年度管网水质PH值</span>
                </div>
                <div class="chart">
                    <IEcharts :option="ph.bar" :loading="ph.loading" :resizable="true" />
                </div>
            </div>
        </div>
    </div>
    <div class="right-tree">
        <div class="top-head">
            <span>水投集团</span>
        </div>
        <div class="tree">
            <el-tree :data="tree" :props="defaultProps" accordion @node-click="handleNodeClick">
            </el-tree>
        </div>
    </div>
</div>
</template>

<script>
import IEcharts from "vue-echarts-v3/src/full.js";
import {
    getPipeWaterConsumption
} from "@/api/monitor/waterStatiastics";
export default {
    name: "waterStatiastics",
    components: {
        IEcharts
    },
    data() {
        return {
            currentYear: "",
            tree: [],
            defaultProps: {
                children: "children",
                label: "label"
            },
            commonYears: [],
            commonMonth: [{
                    value: 0,
                    label: "全年"
                },
                {
                    value: 1,
                    label: "1月"
                },
                {
                    value: 2,
                    label: "2月"
                },
                {
                    value: 3,
                    label: "3月"
                },
                {
                    value: 4,
                    label: "4月"
                },
                {
                    value: 5,
                    label: "5月"
                },
                {
                    value: 6,
                    label: "6月"
                },
                {
                    value: 7,
                    label: "7月"
                },
                {
                    value: 8,
                    label: "8月"
                },
                {
                    value: 9,
                    label: "9月"
                },
                {
                    value: 10,
                    label: "10月"
                },
                {
                    value: 11,
                    label: "11月"
                },
                {
                    value: 12,
                    label: "12月"
                }
            ],
            searchYear: "",
            company_Id: "",
            realWaterSupply: {
                loading: false,
                bar: {
                    tooltip: {
                        trigger: 'axis',
                        textStyle: {
                            color: '#fff',
                            fontSize: 12,
                        },
                        extraCssText: 'box-shadow: 0 0 5px rgba(205,217,240);',
                        borderColor: '#DAE1F4',
                        borderWidth: 1,
                        formatter: "{b}月<br/>{a0}:{c0}m³</br>"
                    },
                    grid: {
                        top: "35px",
                        left: "80px",
                        right: "50px",
                        bottom: "30px"
                    },
                    xAxis: {
                        show: true,
                        data: []
                    },
                    yAxis: {
                        show: true,
                        name: "(m³)"
                    },
                    color: "#15b5f0",
                    series: [{
                        name: "实际用水量",
                        type: "bar",
                        data: []
                    }]
                }
            },
            left_cl: {
                year: "",
                month: "全年",
                loading: false,
                bar: {
                    tooltip: {
                        trigger: 'axis',
                        textStyle: {
                            color: '#fff',
                            fontSize: 12,
                        },
                        extraCssText: 'box-shadow: 0 0 5px rgba(205,217,240);',
                        borderColor: '#DAE1F4',
                        borderWidth: 1,
                        formatter: "{b}月<br/>{a0}:{c0}mg/L</br>"
                    },
                    grid: {
                        top: "35px",
                        left: "80px",
                        right: "50px",
                        bottom: "30px"
                    },
                    xAxis: {
                        show: true,
                        data: []
                    },
                    yAxis: {
                        show: true,
                        name: "(mg/L)"
                    },
                    color: "#1cbbdf",
                    series: [{
                        name: "管网末梢余氯",
                        type: "bar",
                        data: []
                    }]
                }
            },
            range_waterPress: {
                year: "",
                month: "全年",
                loading: false,
                bar: {
                    tooltip: {
                        trigger: 'axis',
                        textStyle: {
                            color: '#fff',
                            fontSize: 12,
                        },
                        extraCssText: 'box-shadow: 0 0 5px rgba(205,217,240);',
                        borderColor: '#DAE1F4',
                        borderWidth: 1,
                        formatter: "{b}月<br/>{a0}:{c0}Mpa</br>"
                    },
                    grid: {
                        top: "35px",
                        left: "80px",
                        right: "50px",
                        bottom: "30px"
                    },
                    xAxis: {
                        show: true,
                        data: []
                    },
                    yAxis: {
                        show: true,
                        name: "(Mpa)"
                    },
                    color: "#1cbbdf",
                    series: [{
                        name: "平均压力",
                        type: "bar",
                        data: []
                    }]
                }
            },
            ph: {
                year: "",
                month: "全年",
                loading: false,
                bar: {
                    tooltip: {
                        trigger: 'axis',
                        textStyle: {
                            color: '#fff',
                            fontSize: 12,
                        },
                        extraCssText: 'box-shadow: 0 0 5px rgba(205,217,240);',
                        borderColor: '#DAE1F4',
                        borderWidth: 1,
                        formatter: "{b}月<br/>{a0}:{c0}</br>"
                    },
                    grid: {
                        top: "35px",
                        left: "80px",
                        right: "50px",
                        bottom: "30px"
                    },
                    xAxis: {
                        type: "category",
                        //          boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        name: "(PH)",
                        type: "value",
                        splitLine: {
                            show: true
                        }
                    },
                    color: "#1cbbdf",
                    series: [{
                        name: "水质PH值",
                        type: "bar",
                        data: []
                    }]
                }
            },

        };
    },
    methods: {
        handleNodeClick(obj) {
            let that = this;
            that.company_Id = obj.id;
            that.getRealWaterSupply_data();
        },
        getYear_selected(val) {
            const that = this;
            this.searchYear = val;
            //ajax请求
            this.currentYear = val;
            that.getRealWaterSupply_data();
        },
        getRealWaterSupply_data() {
            let that = this;
            let temp_id = that.company_Id;
            getPipeWaterConsumption({
                years: "" + that.searchYear,
                companyId: "" + temp_id,
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
                    //获取年度实际用水情况
                    let actual_water = res.data.actualWaterData;
                    //              	 console.log(res.data);               	 
                    actual_water.sort(function (x, y) {
                        return x.mouths > y.mouths ? 1 : -1;
                    });

                    if (actual_water.length > 0) {
                        let temp_y = actual_water.map(item => {
                            return item.count;
                        });
                        let temp_x = actual_water.map(item => {
                            return item.mouths;
                        });
                        that.realWaterSupply.bar.series[0].data = temp_y;
                        that.realWaterSupply.bar.xAxis.data = temp_x;
                    } else {
                        that.realWaterSupply.bar.series[0].data = [];
                    }


                    
                    //获取年度管网末梢余氯数据
                    let chlorine_data = res.data.chlorineData[0];

                    let change = {
                        one: 1,
                        two: 2,
                        three: 3,
                        four: 4,
                        five: 5,
                        six: 6,
                        seven: 7,
                        eight: 8,
                        nine: 9,
                        ten: 10,
                        eleven: 11,
                        twelve: 12
                    }

                    function replace(target, change) {
                        for (var key in target) {
                            target[change[key]] = target[key];
                            delete target[key];
                        }
                    }
                    replace(chlorine_data, change);
                    let chlorine_arr = [];
                    for (let key in chlorine_data) {
                        chlorine_arr.push({
                            month: key,
                            value: chlorine_data[key]
                        });
                    }

                    chlorine_arr.sort(function (x, y) {
                        return parseInt(x.month) > parseInt(y.month) ? 1 : -1;
                    });
                    if (chlorine_arr.length > 0) {
                        let temp_y1 = chlorine_arr.map(item => {
                            return item.value;
                        });
                        let temp_x1 = chlorine_arr.map(item => {

                            return item.month;
                        });
                        that.left_cl.bar.series[0].data = temp_y1;
                        that.left_cl.bar.xAxis.data = temp_x1;
                    } else {
                        that.left_cl.bar.series[0].data = [];
                    }
                    //获取年度平均压力
                    let pressure_data = res.data.pressureData[0];
                    replace(pressure_data, change);
                    let pressure_arr = [];
                    for (let key in pressure_data) {
                        pressure_arr.push({
                            month: key,
                            value: pressure_data[key]
                        });
                    }
                    pressure_arr.sort(function (x, y) {
                        return parseInt(x.month) > parseInt(y.month) ? 1 : -1;
                    });
                    if (pressure_arr.length > 0) {
                        let temp_y1 = pressure_arr.map(item => {
                            return item.value;
                        });
                        let temp_x1 = pressure_arr.map(item => {

                            return item.month;
                        });
                        that.range_waterPress.bar.series[0].data = temp_y1;
                        that.range_waterPress.bar.xAxis.data = temp_x1;
                    } else {
                        that.range_waterPress.bar.series[0].data = [];
                    }
                    //获取全年官网水质ph质
                    let waterph_data = res.data.waterPHData[0];
                    replace(waterph_data, change);
                    let waterph_arr = [];
                    for (let key in waterph_data) {
                        waterph_arr.push({
                            month: key,
                            value: waterph_data[key]
                        })
                    }
                    //                console.log(waterph_arr,233333) ;
                    waterph_arr.sort(function (x, y) {
                        return parseInt(x.month) > parseInt(y.month) ? 1 : -1;
                    });
                    if (waterph_arr.length > 0) {
                        let temp_y1 = waterph_arr.map(item => {

                            return item.value;
                        });
                        let temp_x1 = waterph_arr.map(item => {

                            return item.month;
                        });
                        that.ph.bar.series[0].data = temp_y1;
                        that.ph.bar.xAxis.data = temp_x1;
                    } else {
                        that.ph.bar.series[0].data = [];
                    }
                } else {
                    that.realWaterSupply.bar.series[0].data = [];
                    that.left_cl.bar.series[0].data = [];
                    that.range_waterPress.bar.series[0].data = [];
                    that.ph.bar.series[0].data = [];
                }
                that.realWaterSupply.loading = false;
                that.left_cl.loading = false;
                that.range_waterPress.loading = false;
                that.ph.loading = false;
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
                console.log(error)
            });
        },
        handleCommand(command) {
            this.$message("click on item " + command);
        },
        years() {
            let temp = [];
            let currentYear = parseInt(new Date().getFullYear());
            let startYear = 1970;
            let D_year = currentYear - startYear;
            for (let i = 0; i < D_year; i++) {
                temp.push({
                    value: currentYear - i,
                    label: currentYear - i + "年"
                });
            }
            return temp;
        },

    },
    created() {
        const that = this;
        let currentYear = new Date().getFullYear();
        this.currentYear = currentYear;
        let temp = this.years();
        this.commonYears = temp;
        // this.tree = this.DSE.tree;
        this.tree = this.$store.getters.get_orgTree;
        that.company_Id = this.tree[0].id;
        this.searchYear = currentYear;
        that.getRealWaterSupply_data();

    }
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

#waterStatiastics {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #ccc;
    display: flex;
    justify-content: space-between;

    .time-picker {
        width: 100%;
        padding: 10px;
        height: 40px;
        padding: 10px;
        display: flex;
        justify-content: flex-end;

        .el-select {
            width: 100px;
            margin-right: 10px;
        }
    }

    .left-table {
        width: 82.5%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .table-item {
            /*width: 32%;*/
            width: 49%;
            /*height: 50%;*/
            height: 47%;
            padding-bottom: 2%;

            .inner-table {
                border: 1px solid #fff;
                height: 100%;
                background: #fff;

                .top-head {
                    width: 100%;
                    height: 25px;
                    line-height: 25px;
                    border-bottom: 1px solid #ccc;
                    padding-left: 20px;
                    font-size: 14px;
                    color: #333;

                    .tangle {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        background: #2db8bd;
                        margin-right: 10px;
                    }
                }

                .chart {
                    width: 100%;
                    height: calc(100% - 65px);
                }
            }
        }
    }

    .right-tree {
        width: 16%;
        height: 100%;
        border: 1px solid #fff;
        background: #fff;

        .top-head {
            width: 100%;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #fff;
            padding: 0 10px;
            font-size: 14px;
            color: #fff;
            font-weight: 600;
            background: #e3edef;
            color: #333;
            font-size: 16px;

        }

        .tree {
            width: 100%;
            height: calc(100% - 40px);
            overflow-y: auto;
        }
    }
}
</style>
