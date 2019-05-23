<template>
<div id="home">
    <div class="top-action group" :class="{small:small}">
        <span>年份:</span>
        <el-select v-model="currentYear" @change="showData($event)">
            <el-option v-for="item in years" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
    </div>
    <div class="content" :class="{small:small}">
        <div class="left-chart">
            <div class="chart-item nopadding" :class="{small:small}">
                <div class="row">
                    <div class="col">
                        <span>{{leftChart.peopleNum.number}}</span>
                        <span>服务人数(万人)</span>
                    </div>
                    <div class="logo">
                        <i class="iconfont icon-yonghu"></i>
                    </div>
                </div>
                <div class="row color1">
                    <div class="col">
                        <span>{{leftChart.peopleNum.D_value}}</span>
                        <template v-if="leftChart.peopleNum.D_value>0">
                            <span>增加(万人)</span>
                        </template>
                        <template v-else>
                            <span>减少(万人)</span>
                        </template>
                    </div>
                    <div class="logo">
                        <template v-if="leftChart.peopleNum.D_value>0">
                            <i class="iconfont icon-fuwurenshujia"></i>
                        </template>
                        <template v-else>
                            <i class="iconfont icon-fuwurenshujian"></i>
                        </template>
                    </div>
                </div>
            </div>
            <div class="chart-item nopadding" :class="{small:small}">
                <div class="row">
                    <div class="col">
                        <span>{{leftChart.watermeter.number}}</span>
                        <span>户表数(万户)</span>
                    </div>
                    <div class="logo">
                        <i class="iconfont icon-hubiaoshu"></i>
                    </div>
                </div>
                <div class="row color2">
                    <div class="col">
                        <span>{{leftChart.watermeter.D_value}}</span>
                        <template v-if="leftChart.watermeter.D_value>0">
                            <span>增加(万户)</span>
                        </template>
                        <template v-else>
                            <span>减少(万户)</span>
                        </template>
                    </div>
                    <div class="logo">
                        <template v-if="leftChart.watermeter.D_value>0">
                            <i class=" iconfont icon-hubiaoshujia"></i>
                        </template>
                        <template v-else>
                            <i class=" iconfont icon-hubiaoshujian"></i>
                        </template>
                    </div>
                </div>
            </div>
            <div class="chart-item nopadding" :class="{small:small}">
                <div class="row">
                    <div class="col">
                        <span>{{leftChart.turbeLong.number}}</span>
                        <span>管网总长(Km)</span>
                    </div>
                    <div class="logo">
                        <i class="iconfont icon-guanwangzongchang"></i>
                    </div>
                </div>
                <div class="row color3">
                    <div class="col">
                        <span>{{leftChart.turbeLong.D_value}}</span>
                        <template v-if="leftChart.turbeLong.D_value>0">
                            <span>增加管长(Km)</span>
                        </template>
                        <template v-else>
                            <span>减少管长(Km)</span>
                        </template>
                    </div>
                    <div class="logo">
                        <template v-if="leftChart.watermeter.D_value>0">
                            <i class="iconfont icon-guanwangzongchangjia"></i>
                        </template>
                        <template v-else>
                            <i class="iconfont icon-guanwangzongchangjian"></i>
                        </template>
                    </div>
                </div>
            </div>
            <div class="chart-item">
                <div class="card-top">
                    <div class="card-left">
                        <div class="str">漏损率</div>
                        <div class="num" :class="{small:leftChart.small}">{{leftChart.leak.number}}%</div>
                    </div>
                    <div class="card-right">
                        <el-progress type="circle" :stroke-width=3 :width="leftChart.circleWidth" :percentage="leftChart.leak.circlePercent" color="#fe6d3a"></el-progress>
                    </div>
                </div>
                <div class="card-content">
                    <div class="left-logo">
                        <img src="../../assets/images/pipeNet_manage/home/home_monitor.png" alt="" :class="{small:leftChart.small}">
                    </div>
                    <div class="chart">
                        <IEcharts :option="leftChart.leak.bar" :loading="leftChart.leak.loading" :resizable="true" />
                    </div>
                </div>
            </div>
            <div class="chart-item">
                <div class="card-top">
                    <div class="card-left">
                        <div class="str">产销差率</div>
                        <div class="num" :class="{small:leftChart.small}">{{leftChart.nrw.number}}%</div>
                    </div>
                    <div class="card-right">
                        <el-progress type="circle" :stroke-width=3 :width="leftChart.circleWidth" :percentage="leftChart.nrw.circlePercent" color="#fe6d3a"></el-progress>
                    </div>
                </div>
                <div class="card-content">
                    <div class="left-logo">
                        <img src="../../assets/images/pipeNet_manage/home/home_analysis.png" alt="" :class="{small:leftChart.small}">
                    </div>
                    <div class="chart">
                        <IEcharts :option="leftChart.nrw.bar" :loading="leftChart.nrw.loading" :resizable="true" />
                    </div>
                </div>
            </div>
        </div>
        <div class="map">
            <div class="wrap-map" ref="map">
                <img src="../../assets/images/pipeNet_manage/home/map.svg" alt="">
                <!-- @click="gotoMsg(index)"  -->
                <div class="ab-places" v-for="(item,index) in activePlaces" :key="index" :style="{top:item.top+'px',left:item.left+'px'}">
                    <img src="../../assets/images/pipeNet_manage/home/errorPosition.png" alt="" v-if="item.status">
                    <img src="../../assets/images/pipeNet_manage/home/normal.png" alt="" v-else>
                    <div class="tips">
                        {{item.name+'管网总长:'+item.tubeLong+'Km'}}
                    </div>
                </div>
            </div>
        </div>
        <div class="right-chart">
            <div class="chart-item">
                <div class="top">
                    <span class="logo"></span>
                    <span>水司管网长度统计(公里)</span>
                </div>
                <div class="chart-content">
                    <IEcharts :option="right.turbeLong.bar" :loading="right.turbeLong.loading" :resizable="true" />
                </div>
            </div>
            <div class="chart-item">
                <div class="top">
                    <span class="logo"></span>
                    <span>管材类别统计</span>
                </div>
                <div class="chart-content">
                    <div class="left-pie s-gray">
                        <IEcharts :option="right.turbeType.pie" :loading="right.turbeType.loading" :resizable="true" @click="typePie_onClick" />
                    </div>
                    <div class="right-identification">
                        <div class="type-item" :class="{active:item.active}" v-for="(item,index) in right.turbeType.types" :key="index">
                            <div class="logo" :style="{background:item.color}"></div>
                            <div class="str" :class="{small:leftChart.small}">{{item.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="chart-item">
                <div class="top">
                    <span class="logo"></span>
                    <span>管径类别统计(mm)</span>
                </div>
                <div class="chart-content">
                    <div class="left-pie s-red">
                        <IEcharts :option="right.turbeDiameter.pie" :loading="right.turbeDiameter.loading" :resizable="true" @click="D_Pie_onClick" />
                    </div>
                    <div class="right-identification">
                        <div class="type-item d" :class="{active:item.active}" v-for="(item,index) in right.turbeDiameter.types" :key="index">
                            <span class="logo" :style="{background:item.color}"></span>
                            <span class="str">{{item.name}}</span>
                        </div>
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
    getPipeBasicData
} from '@/api/pipeNet_msg/home'
export default {
    name: "Home",
    components: {
        IEcharts
    },
    data() {
        return {
            small: false,
            firstLongin: 1,
            groupID: "", // 集团ID
            fourMapPosition: [{
                    x: 104.154408011,
                    y: 39.392326951
                }, //左上
                {
                    x: 107.675526175,
                    y: 39.397820115
                }, //右上
                {
                    x: 104.154408011,
                    y: 35.234001755
                }, //左下
                {
                    x: 107.670033011,
                    y: 35.234001755
                } //右下
            ],
            temp_palces: [],
            activePlaces: [],
            active: true,
            showYears: false,
            showMonth: false,
            currentYear: "",
            leftChart: {
                circleWidth: "",
                small: "",
                peopleNum: {
                    D_value: 0,
                    number: "",
                },
                watermeter: {
                    D_value: 0,
                    number: "",
                },
                turbeLong: {
                    D_value: 0,
                    number: ""
                },
                leak: {
                    loading: false,
                    circlePercent: 0,
                    number: "",
                    bar: {
                        tooltip: {},
                        grid: {
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        },
                        xAxis: {
                            show: false,
                            data: ["一月", '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                        },
                        yAxis: {
                            show: false
                        },
                        color: "#1cbbdf",
                        series: [{
                            name: "漏损率",
                            type: "bar",
                            data: []
                        }]
                    }
                },
                nrw: {
                    loading: false,
                    circlePercent: 0,
                    bar: {
                        tooltip: {},
                        grid: {
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        },
                        xAxis: {
                            show: false,
                            data: ["一月", '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                        },
                        yAxis: {
                            show: false
                        },
                        color: "#1cbbdf",
                        series: [{
                            name: "产销差率",
                            type: "bar",
                            data: []
                        }]
                    }
                }
            },
            map: {},
            right: {
                turbeLong: {
                    loading: false,
                    bar: {
                        tooltip: {},
                        grid: {
                            top: "30px",
                            left: "40px",
                            right: "40px",
                            bottom: "48px"
                        },
                        xAxis: {
                            axisLabel: {
                                inteeval: 0,
                                rotate: 30
                            },
                            data: []
                        },
                        yAxis: {
                            name: "Km"
                        },
                        color: "#1cbbdf",
                        series: [{
                            name: "管网长度",
                            barWidth: "30",
                            type: "bar",
                            data: []
                        }]
                    }
                },
                turbeType: {
                    loading: false,
                    types: [],
                    pie: {
                        backgroundColor: "#fff",
                        title: {
                            text: "",
                            // subtext: "",
                            x: "center",
                            y: "center",
                            textStyle: {
                                fontWeight: "normal",
                                fontSize: 14
                            }
                        },
                        tooltip: {
                            show: true,
                            trigger: "item",
                            formatter: "{b}: {c} ({d}%)"
                        },
                        series: [{
                            type: "pie",
                            selectedMode: "single",
                            radius: ["45%", "80%"],
                            color: [],
                            label: {
                                normal: {
                                    show: false,
                                    position: "inner",
                                    formatter: "{d}%",
                                    textStyle: {
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: 14
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: []
                        }],
                        backgroundColor: "#eaeaeb"
                    }
                },
                turbeDiameter: {
                    loading: false,
                    types: [],
                    pie: {
                        backgroundColor: "#fff",
                        title: {
                            text: "",
                            // subtext: "",
                            x: "center",
                            y: "center",
                            textStyle: {
                                fontWeight: "normal",
                                fontSize: 14
                            }
                        },
                        tooltip: {
                            show: true,
                            trigger: "item",
                            formatter: "{b}: {c} ({d}%)"
                        },
                        series: [{
                            type: "pie",
                            selectedMode: "single",
                            radius: ["45%", "80%"],
                            color: ["#4b78ea", "#1dcef3", "#2d9fff", "#72c380", "#f7a53b"],
                            label: {
                                normal: {
                                    show: false,
                                    position: "inner",
                                    formatter: "{d}%",

                                    textStyle: {
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: 14
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: []
                        }],
                        backgroundColor: "#fee8e9"
                    }
                }
            }
        };
    },
    methods: {
        selectYear() {
            this.active = true;
        },
        selectMonth() {
            this.active = false;
        },
        getThisYear(val) {
            this.currentYear = val;
            this.showYears = !this.showYears;
        },
        getThisMonth(val) {
            this.currentMonth = val;
            this.showMonth = !this.showMonth;
        },
        showyears() {
            this.showYears = !this.showYears;
        },
        showMonthes() {
            this.showMonth = !this.showMonth;
        },
        doLoading() {
            const that = this;
            let data = [];
            //传递数据
            for (let i = 0, min = 5, max = 99; i < 6; i++) {
                data.push(Math.floor(Math.random() * (max + 1 - min) + min));
            }
            that.leftChart.peopleNum.loading = !that.leftChart.peopleNum.loading;
            that.leftChart.peopleNum.bar.series[0].data = data;
        },
        onReady(ins) {

        },
        onResize(width, height) {

        },
        onClick(event, instance, echarts) {},
        resetTypes(arr) {
            let temp_arr = arr;
            for (let i = 0; i < temp_arr.length; i++) {
                temp_arr[i].active = false;
            }
            return temp_arr;
        },
        typePie_onClick(event, instance, echarts) {
            let typeName = event.name;
            let temp_arr = this.right.turbeType.types;
            this.right.turbeType.types = this.resetTypes(temp_arr);
            temp_arr = this.right.turbeType.types;
            for (let i = 0; i < temp_arr.length; i++) {
                if (temp_arr[i].name == typeName) {
                    temp_arr[i].active = true;
                    break;
                }
            }
            this.right.turbeType.types = temp_arr;
        },
        D_Pie_onClick(event, instance, echarts) {
            let typeName = event.name;
            let temp_arr = this.right.turbeDiameter.types;
            this.right.turbeDiameter.types = this.resetTypes(temp_arr);
            temp_arr = this.right.turbeDiameter.types;
            for (let i = 0; i < temp_arr.length; i++) {
                if (temp_arr[i].name == typeName) {
                    temp_arr[i].active = true;
                    break;
                }
            }
            this.right.turbeDiameter.types = temp_arr;
        },
        getScale(total, part, realScale) {
            let temp_position = (part.position).split(",")
            let LGTD =  parseFloat(temp_position[0]);
            let LTTD = parseFloat(temp_position[1]);

            return {
                name: part.name,
                // status: part.status,
                tubeLong: part.yearPipeLength,
                left: parseInt(
                        (LGTD - 104.154408011) /
                        total.temp_D_x *
                        parseFloat(realScale.temp_width)
                    ) -
                    0.015 * parseInt(realScale.temp_width),
                top: parseInt(
                        (39.392326951 - LTTD) /
                        total.temp_D_y *
                        parseFloat(realScale.temp_height)
                    ) -
                    0.040 * parseInt(realScale.temp_height)
            };
        },
        gotoMsg(index) {
            this.$router.push({
                name: 'pipeNet_msg_2d'
            })
            // this.$emit('thisTab', '2');
        },
        showData(val) {
            this.currentYear = val;
            this.getdata();
        },
        getdata() {
            let that = this;
            getPipeBasicData({
                years: that.currentYear + "",
                companyId: ""
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                let temp = res.data ? res.data : null;
                if (temp) {
                    // 服务人数和户表数
                    let {
                        serviceData
                    } = res.data;
                    let D_people = parseInt((parseInt(serviceData.serviceNumGap) / 10000) * 100) / 100;
                    let peopleNum = parseInt((parseInt(serviceData.serviceNumNow) / 10000) * 100) / 100;
                    that.leftChart.peopleNum.D_value = D_people;
                    that.leftChart.peopleNum.number = peopleNum;
                    that.leftChart.watermeter.D_value = parseInt((parseInt(serviceData.householdTableGap) / 10000) * 100) / 100;
                    that.leftChart.watermeter.number = parseInt((parseInt(serviceData.householdTableNow) / 10000) * 100) / 100;
                    //管网总长
                    let {
                        pipeLengthData
                    } = res.data;
                    that.leftChart.turbeLong.number = parseInt((parseFloat(pipeLengthData.pipeLength)) * 100) / 100;
                    that.leftChart.turbeLong.D_value = parseInt((parseInt(pipeLengthData.pipeLengtheGap)) * 100) / 100;
                    //漏损率
                    let {
                        leakageMouthData
                    } = res.data;
                    let leakList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    let temp_leakageBar = leakageMouthData[0];

                    for (let key in temp_leakageBar) {
                        if (key == "Leakageone") {
                            leakList[0] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]

                        }
                        if (key == "Leakagetwo") {
                            leakList[1] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]

                        }
                        if (key == "Leakagethree") {
                            leakList[2] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]

                        }
                        if (key == "Leakagefour") {
                            leakList[3] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]

                        }
                        if (key == "Leakagetfive") {
                            leakList[4] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]

                        }
                        if (key == "Leakagesix") {
                            leakList[5] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]

                        }
                        if (key == "Leakageseven") {
                            leakList[6] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]

                        }
                        if (key == "Leakageeight") {
                            leakList[7] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]

                        }
                        if (key == "Leakagenine") {
                            leakList[8] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]

                        }
                        if (key == "Leakageten") {
                            leakList[9] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]

                        }
                        if (key == "Leakageeleven") {
                            leakList[10] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]

                        }
                        if (key == "Leakagetwelve") {
                            leakList[11] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]
                        }
                    }
                    //漏损百分率
                    let {
                        leakageYearData
                    } = res.data;
                    let leakPercent = leakageYearData.pipeLeakageGap;
                    that.leftChart.leak.circlePercent = parseFloat(leakPercent);
                    that.leftChart.leak.number = parseFloat(leakageYearData.pipeLeakageNow)
                    that.leftChart.leak.bar.series[0].data = leakList;

                    //产销率
                    let {
                        productivityMouthData
                    } = res.data;
                    let nrwList = [0,0,0,0,0,0,0,0,0,0,0,0];
                    let temp_productivityBar = productivityMouthData[0];
                    for (let key in temp_productivityBar) {
                       if (key == "Productivityone") {
                            nrwList[0] =
                                temp_productivityBar[key] < 0 ? 0 : temp_productivityBar[key]

                        }
                        if (key == "Productivitytwo") {
                            nrwList[1] =
                                temp_productivityBar[key] < 0 ? 0 : temp_productivityBar[key]

                        }
                        if (key == "Productivitythree") {
                            nrwList[2] =
                                temp_productivityBar[key] < 0 ? 0 : temp_productivityBar[key]

                        }
                        if (key == "Productivityfour") {
                            nrwList[3] =
                                temp_productivityBar[key] < 0 ? 0 : temp_productivityBar[key]

                        }
                        if (key == "Productivityfive") {
                            nrwList[4] =
                                temp_productivityBar[key] < 0 ? 0 : temp_productivityBar[key]

                        }
                        if (key == "Productivitysix") {
                            nrwList[5] =
                                temp_productivityBar[key] < 0 ? 0 : temp_productivityBar[key]

                        }
                        if (key == "Productivityseven") {
                            nrwList[6] =
                                temp_productivityBar[key] < 0 ? 0 : temp_productivityBar[key]

                        }
                        if (key == "Productivityeight") {
                            nrwList[7] =
                                temp_productivityBar[key] < 0 ? 0 : temp_productivityBar[key]

                        }
                        if (key == "Productivitynine") {
                            nrwList[8] =
                                temp_productivityBar[key] < 0 ? 0 : temp_productivityBar[key]

                        }
                        if (key == "Productivityten") {
                            nrwList[9] =
                                temp_productivityBar[key] < 0 ? 0 : temp_productivityBar[key]

                        }
                        if (key == "Productivityeleven") {
                            nrwList[10] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]

                        }
                        if (key == "Productivitytwelve") {
                            nrwList[11] =
                                temp_leakageBar[key] < 0 ? 0 : temp_leakageBar[key]
                        }
                    }
                    that.leftChart.nrw.bar.series[0].data = nrwList;
                    //产销差率百分比
                    let {
                        productivityYearData
                    } = res.data;
                    let productivityPercent = productivityYearData.productivityYearGap;
                    that.leftChart.nrw.circlePercent = parseFloat(productivityPercent);
                    that.leftChart.nrw.number = parseFloat(productivityYearData.productivityYearNow)
                    // 管网长度统计
                    let {
                        companyData
                    } = res.data;
                    that.temp_palces = companyData;
                    let company_dataX = [];
                    let company_dataY = [];
                    let sessionNum = 0;
                    for (let i = 0; i < companyData.length; i++) {
                        let temp_index = (companyData[i].name).lastIndexOf("公司");
                        let temp_name = "";
                        if (temp_index > 0) {
                            temp_name = (companyData[i].name).substring(0, temp_index);
                        } else {
                            temp_name = companyData[i].name;
                        }
                        company_dataX.push(temp_name)
                        company_dataY.push(
                            companyData[i].yearPipeLength
                        )
                        sessionNum += parseFloat(companyData[i].yearPipeLength);
                    }
                    if (that.firstLongin == 1) {
                        sessionStorage.setItem('pipeLong', sessionNum);
                    }
                    that.right.turbeLong.bar.xAxis.data = company_dataX;
                    that.right.turbeLong.bar.series[0].data = company_dataY;

                   

                    //管材类别统计
                    let {
                        materialData
                    } = res.data;
                    let material_dataX = [];
                    let material_data = [];
                    let material_color = [];
                    for (let i = 0; i < materialData.length; i++) {
                        material_dataX.push({
                            name: materialData[i].NAME,
                            active: false,
                            color: materialData[i].color
                        })
                        material_data.push({
                            value: materialData[i].pipe_material,
                            name: materialData[i].NAME
                        })
                        material_color.push(
                            materialData[i].color
                        )
                    }
                    that.right.turbeType.types = material_dataX;
                    that.right.turbeType.pie.title.text = that.currentYear;
                    that.right.turbeType.pie.series[0].color = material_color;
                    that.right.turbeType.pie.series[0].data = material_data;
                    //管径类别
                    let {
                        radiusData
                    } = res.data;
                    let radius_dataX = [];
                    let radius_data = [];
                    let radius_color = [];
                    for (let i = 0; i < radiusData.length; i++) {
                        radius_dataX.push({
                            name: radiusData[i].NAME,
                            active: false,
                            color: radiusData[i].color
                        })
                        radius_data.push({
                            value: radiusData[i].pipe_radius,
                            name: radiusData[i].NAME
                        })
                        radius_color.push(
                            radiusData[i].color
                        )
                    }
                    that.right.turbeDiameter.types = radius_dataX;
                    that.right.turbeDiameter.pie.title.text = that.currentYear;
                    that.right.turbeDiameter.pie.series[0].color = radius_color;
                    that.right.turbeDiameter.pie.series[0].data = radius_data;
                     setTimeout(() => {
                        let D_scale = {};
                        D_scale["temp_D_x"] = that.fourMapPosition[3].x - that.fourMapPosition[0].x;
                        D_scale["temp_D_y"] = that.fourMapPosition[0].y - that.fourMapPosition[3].y;
                        let temp_scale = {};
                        temp_scale["temp_height"] = that.$refs.map.offsetHeight;
                        temp_scale["temp_width"] = that.$refs.map.offsetWidth;

                        let temp_part = that.temp_palces;
                        let temp_arr = temp_part.map(item => {
                            return that.getScale(D_scale, item, temp_scale);
                        });
                        that.activePlaces = temp_arr;
                    }, 2000)
                } else {
                    // 服务人数和户表数
                    that.leftChart.peopleNum.D_value = '';
                    that.leftChart.peopleNum.number = '';
                    that.leftChart.watermeter.D_value = '';
                    that.leftChart.watermeter.number = '';
                    //管网总长
                    that.leftChart.turbeLong.number = '';
                    that.leftChart.turbeLong.D_value = '';
                    //漏损率
                    //漏损百分率
                    that.leftChart.leak.circlePercent = 0;
                    that.leftChart.leak.number = '';
                    that.leftChart.leak.bar.series[0].data = [];
                    //产销率
                    that.leftChart.nrw.bar.series[0].data = [];
                    //产销差率百分比
                    that.leftChart.nrw.circlePercent = 0;
                    that.leftChart.nrw.number = '';
                    // 管网长度统计
                    that.temp_palces = [];
                    that.right.turbeLong.bar.xAxis.data = [];
                    that.right.turbeLong.bar.series[0].data = [];
                    that.activePlaces[0].tubeLong = 0;
                    that.activePlaces[1].tubeLong = 0;
                    //管材类别统计
                    that.right.turbeType.types = [];
                    that.right.turbeType.pie.title.text = that.currentYear;
                    that.right.turbeType.pie.series[0].color = [];
                    that.right.turbeType.pie.series[0].data = [];
                    //管径类别
                    that.right.turbeDiameter.types = [];
                    that.right.turbeDiameter.pie.title.text = that.currentYear;
                    that.right.turbeDiameter.pie.series[0].color = [];
                    that.right.turbeDiameter.pie.series[0].data = [];
                }
                that.firstLongin = this.firstLongin + 1;

            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
            });
        }
    },
    computed: {
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
    mounted() {
        this.getdata();
    },
    created() {
        let that = this;
        let temp_time = new Date().getFullYear();
        this.currentYear = temp_time;
        let sys_width = document.body.clientWidth;
        if (sys_width < 1600) {
            this.small = true;
            this.leftChart.circleWidth = 40;
            this.leftChart.small = true;
        } else {
            this.small = false;
            this.leftChart.circleWidth = 50;
            this.leftChart.small = false;
        }
        // this.groupID = this.$store.getters.get_companyId;
        dse.compyID = this.$store.getters.get_companyId;
        dse.userName = this.$store.getters.getUserName;
        dse.compyName = this.$store.getters.getCompyName;
    }
};
</script>

<style lang="scss" scoped>
$base-font: 16px;
* {
    box-sizing: border-box;
}

#home {
    width: 100%;
    height: 100%;
    font-size: $base-font;
    padding-top: 43px;
    background: radial-gradient(circle, #fff, #cee9f7, #a0d8ff);
    .top-action {
        // width: 100%;
        // padding: 0 20px;
        height: 50px;
        width: 15%;
        position: absolute;
        top: 0;
        left: 18px; // background: #d7d7d7;
        background: transparent;
        color: #333;
        font-size: 16px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &.small {
            height: 40px;
            font-size: 12px;
            line-height: 40px;
        }
        span {
            display: inline-block;
            margin-right: 10px;
        }
        &.group{
            span{
                display: inline-block;
                width: 60px;
            }
            .el-select{
                width: calc(100% - 80px);
            }
        }

    }
    .content {
        padding: 0 20px;
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        display: flex;
        justify-content: space-between;
        &.small {
            height: 100%;
        }
        .left-chart {
            width: 15%;
            padding-top: 10px;
            height: 100%; // overflow-y: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            .chart-item {
                width: 100%;
                height: 18%;
                padding: 8px;
                background: #fff;
                margin-bottom: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                border: 1px solid #afb6ba;
                &.nopadding {
                    padding: 0;
                }
                .card-top {
                    width: 100%;
                    height: 60px;
                    display: flex;
                    justify-content: space-between;
                    .card-left {
                        width: 50%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around; // align-items: center;
                        .str {
                            font-size: 12px; //   transform: scale(0.8);
                            color: #676666;
                        }
                        .num {
                            font-size: 20px;
                            color: #333;
                            font-weight: 600;
                            &.small {
                                font-size: 14px;
                            }
                        }
                    }
                    .card-right {
                        width: 50%;
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                    }
                }
                .card-content {
                    width: 100%;
                    height: calc(100% - 60px);
                    display: flex;
                    justify-content: space-around;
                    align-items: flex-end;
                    .left-logo {
                        width: 40px; //    height: 100%;
                        img.small {
                            width: 20px;
                        }
                    }
                    .chart {
                        width: calc(100% - 70px);
                        height: 80%;
                    }
                }
                .row {
                    width: 100%;
                    height: 50%;
                    display: flex;
                    justify-content: space-between;
                    &.color1 {
                        background: #fdefd2;
                    }
                    &.color2 {
                        background: #fcd1db;
                    }
                    &.color3 {
                        background: #bdeff6;
                    }
                    div {
                        width: 50%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        color: #676666;
                        font-size: 14px;
                        span {
                            display: inline-block;
                            line-height: 25px;
                            &:first-child {
                                color: #333;
                                font-weight: 600;
                                font-size: 20px;
                            }
                        }
                        i {
                            color: #4ea8f3;
                            font-size: 30px;
                        }
                    }
                }
                &.small {
                    .row {
                        div {
                            font-size: 12px;
                            span {
                                line-height: 18px;
                                &:first-child {
                                    font-size: 14px;
                                }
                            }
                        }
                    }
                }
            }
        }
        .map {
            width: calc(100% - 40%);
            height: 100%; // padding: 10px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            .wrap-map {
                // display: inline-block !important;
                width: 100%;
                height: 100%;
                position: relative;
                text-align: center;
                img {
                    height: 100%; // width: 100%;
                    width: 100%;
                }
                .ab-places {
                    position: absolute;
                    z-index: 1;
                    cursor: pointer;
                    &:hover {
                        z-index: 100;
                    }
                    .tips {
                        position: absolute;
                        right: 35px;
                        top: -30px;
                        background: #f7f9fc;
                        border: 1px solid #7996a9;
                        padding: 5px 20px;
                        width: 200px;
                        border-radius: 5px;
                        font-size: 14px;
                        color: #333;
                    }
                }
            }
        }
        .right-chart {
            width: 25%;
            height: 100%;
            padding-top: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center; // overflow-y: auto;
            .chart-item {
                width: 100%;
                height: 32%;
                padding: 8px;
                margin-bottom: 10px;
                background: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                border: 1px solid #afb6ba;
                font-size: 14px;
                color: #333;
                font-weight: 600;
                .top {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    height: 36px;
                    line-height: 36px;
                    border-bottom: 1px solid #c5c5c5;
                    .logo {
                        display: inline-block;
                        width: 14px;
                        height: 14px;
                        background: #2cb8db;
                        margin-right: 20px;
                    }
                }
                .chart-content {
                    width: 100%;
                    height: calc(100% - 36px);
                    display: flex;
                    justify-content: space-between;
                    .left-pie {
                        width: 65%;
                    }
                    .right-identification {
                        width: 35%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        .type-item {
                            width: 100%;
                            padding: 10px;
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            color: #333;
                            font-size: 12px;
                            font-weight: normal;
                            &.active {
                                background: #cee9ea;
                            }
                            .logo {
                                display: block;
                                width: 12px;
                                height: 12px;
                                margin-right: 8px;
                            }
                            .str {
                                display: block;
                                width: calc(100% - 20px);
                                &.small {
                                    transform: scale(0.8);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
