<template>
<div id="leaktest">
    <IEcharts :option="press.line" :loading="press.loading" :resizable="true" />
</div>
</template>

<script>
import {
    getWaterGage3Days
} from "@/api/monitor/leaktest"
import IEcharts from "vue-echarts-v3/src/full.js";
export default {
    components: {
        IEcharts
    },
    data() {
        return {
            press: {
                year: "",
                month: "全天",
                loading: false,
                line: {
                    title: {
                        text: "近三天管网压力曲线",
                        left: "center",
                        top: "10"
                    },
                    tooltip: {
                        trigger: "axis",
                        formatter: function (params) {
                            let res = "<div>当前时刻:<span>" + params[0].name + "</span></div>"
                            for (var i = 0; i < params.length; i++) {
                                res += '<p>' + params[i].seriesName + ':' + params[i].data + 'MPa</p>'
                            }
                            return res
                        }
                    },
                    legend: {
                        show: true,
                        x: 'center',
                        y: '60',
                        data: ["今天水压", "昨天水压", "前天水压"]
                    },
                    grid: {
                        top: "100px",
                        left: "40px",
                        right: "50px",
                        bottom: "100px"
                    },
                    xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: [1, 2, 3],
                        axisLabel: {
                            'interval': 0,
                            rotate: 30
                        },
                        name: "时刻"
                    },
                    yAxis: {
                        type: "value",
                        name: "MPa"
                    },
                    dataZoom: {
                        show: true,
                        start: 0,
                        end: 50,
                        maxSpan: 80
                    },
                    series: [{
                        data: [100, 200, 300],
                        type: "line",
                        name: '今天水压',
                        itemStyle: {
                            normal: {
                                color: '#f391a9',
                            }
                        },
                        lineStyle: {
                            shadowBlur: 10,
                            shadowColor: '#f391a9',
                            shadowOffsetY: 5
                        }
                    }, {
                        data: [200, 300, 400],
                        type: "line",
                        name: '昨天水压',
                        itemStyle: {
                            normal: {
                                color: '#7fc9f7',
                            }
                        },
                        lineStyle: {
                            shadowBlur: 10,
                            shadowColor: '#7fc9f7',
                            shadowOffsetY: 5
                        }
                    }, {
                        data: [300, 100, 200],
                        type: "line",
                        name: '前天水压',
                        itemStyle: {
                            normal: {
                                color: '#f391a9',
                            }
                        },
                        lineStyle: {
                            shadowBlur: 10,
                            shadowColor: '#f391a9',
                            shadowOffsetY: 5
                        }
                    }]
                }
            },
            pointId:"",
            year:"",
            month:"",
            day:"",
            that_:null, //引入父窗口中的当前vue实例的this
        }
    },
    methods: {
        getWaterGage3Days_() {
            let that = this
            let temp_year = this.year
            let temp_month = this.month
            let temp_day = this.day
            let temp_id = this.pointId
            getWaterGage3Days({
                moniPointId: "" + temp_id,
                year: "" + temp_year,
                month: "" + temp_month,
                day: "" + temp_day
            }).then(res => {
                if (res.msg == "no user") {
                    window.parent.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`;
                    return;
                }
                if (res.msg == "操作失败") {
                    window.parent.that_.$message.error("服务错误!");
                    return;
                }
               let {data} = res
               let x_list = []
               let current_y = []
               let before_y = []
               let last_y = []
               for(let  i=0;i<data.length;i++){


               }
                
            }).catch(error => {
                console.log(error)
            })
        }
    },
    created(){
        this.pointId = parent.dse.globalData.id;
        this.that_ = parent.dse.this_;
        let time = new Date()
        this.year = time.getFullYear()+""
        this.month = time.getMonth()+1<10?"0"+(time.getMonth()+1): time.getMonth()+1+""
        this.day = time.getDate()<10?"0"+time.getDate():time.getDate()+""

        this.getWaterGage3Days_()
    }
}
</script>

<style lang="scss" scoped>
#leaktest {
    width: 100%;
    height: 100%;
}
</style>
