<template>
  <div id="statistic">
    <div class="year">
      <span>年度：</span>
      <el-date-picker v-model="year1" type="year" size="mini" placeholder="选择年" @change="getLine"></el-date-picker>
    </div>
    <template v-if="showChart===1">
      <div class="subChart">
        <div class="chartitem">
          <div class="inner">
            <div slot="header" class="clearfix">
              <i class="dse-rect-green"></i>
              <span>隐患分区折线图</span>
            </div>
            <IEcharts
              class="echarts"
              :resizable="true"
              :option="dangerArea"
              :loading="loading"
              @ready="onReady"
              @click="onClick"
            ></IEcharts>
          </div>
        </div>
        <div class="chartitem">
          <div class="inner">
            <div slot="header" class="clearfix">
              <i class="dse-rect-green"></i>
              <span>隐患类型分区折线图</span>
            </div>
            <IEcharts
              class="echarts"
              :resizable="true"
              :option="dangerTypePolyLine"
              :loading="loading"
              @ready="onReady"
              @click="onClick"
            ></IEcharts>
          </div>
        </div>
        <div class="chartitem">
          <div class="inner">
            <div slot="header" class="clearfix">
              <i class="dse-rect-green"></i>
              <span>年度巡检次数统计</span>
            </div>
            <IEcharts
              class="echarts"
              :resizable="true"
              :option="protalTotal"
              :loading="loading"
              @ready="onReady"
              @click="onClick"
            ></IEcharts>
          </div>
        </div>
        <div class="chartitem">
          <div class="inner">
            <div slot="header" class="clearfix">
              <i class="dse-rect-green"></i>
              <span>年度维护数统计</span>
            </div>
            <IEcharts
              class="echarts"
              :resizable="true"
              :option="repairRate"
              :loading="loading"
              @ready="onReady"
              @click="onClick"
            ></IEcharts>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="subChart">
        <div class="chartitem">
          <div class="inner">
            <div slot="header" class="clearfix">
              <i class="dse-rect-green"></i>
              <span>隐患分区折线图</span>
            </div>
           
          </div>
        </div>
        <div class="chartitem">
          <div class="inner">
            <div slot="header" class="clearfix">
              <i class="dse-rect-green"></i>
              <span>隐患类型分区折线图</span>
            </div>
          
          </div>
        </div>
        <div class="chartitem">
          <div class="inner">
            <div slot="header" class="clearfix">
              <i class="dse-rect-green"></i>
              <span>年度巡检次数统计</span>
            </div>
           
          </div>
        </div>
        <div class="chartitem">
          <div class="inner">
            <div slot="header" class="clearfix">
              <i class="dse-rect-green"></i>
              <span>年度维护数统计</span>
            </div>
         
          </div>
        </div>
      </div>
    </template>

    <div class="month">
      <span>月份:</span>
      <el-date-picker size="mini" v-model="month1" type="month" placeholder="选择月" @change="getPie"></el-date-picker>
    </div>
    <div class="subChart">
      <div class="chartitem">
        <div class="inner">
          <div slot="header" class="clearfix">
            <i class="dse-rect-green"></i>
            <span>隐患分布图</span>
          </div>
          <IEcharts
              class="echarts"
              :resizable="true"
              :option="dangerScatter"
              :loading="loading"
            ></IEcharts>
        </div>
      </div>
      <div class="chartitem">
        <div class="inner">
          <div slot="header" class="clearfix">
            <i class="dse-rect-green"></i>
            <span>隐患类型图</span>
          </div>
         <IEcharts
              class="echarts"
              :resizable="true"
              :option="dangerType"
              :loading="loading"
            ></IEcharts>
        </div>
      </div>
      <div class="chartitem">
        <div class="inner">
          <div slot="header" class="clearfix">
            <i class="dse-rect-green"></i>
            <span>巡检完成率</span>
          </div>
         <IEcharts
              class="echarts"
              :resizable="true"
              :option="doRate"
              :loading="loading"
            ></IEcharts>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IEcharts from "vue-echarts-v3/src/full.js";
import {
  getCheckReportByYearMonth,
  getCheckReportByYear
} from "@/api/rushrepair/statistic";
import TransformTime from "@/common/utils/utc_str_timeTrs";

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
      showChart:1,
      dangerScatter: {
        tooltip: {
          position: "top",
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}个 ({d}%)"
        },
        grid: {
          top: "40px",
          left: "40px",
          right: "45px",
          bottom: "30px"
        },
        legend: {
          orient: "vertical",
          left: "right",
          top: "middle",
          data: []
        },
        series: [
          {
            name: "隐患分布",
            type: "pie",
            radius: "60%",
            center: ["35%", "45%"],
            label: {
              normal: {
                show: false,
                position: "outside"
              },
              emphasis: {
                show: false
              }
            },
            color: ["#4babf5", "#feb547", "#51d6e6", "#feb547"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      dangerType: {
        tooltip: {
          position: "top",
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} 个({d}%)"
        },
        grid: {
          top: "40px",
          left: "40px",
          right: "45px",
          bottom: "30px"
        },
        legend: {
          orient: "vertical",
          left: "right",
          top: "middle",
          data: ["暗漏", "非法用水", "供水设备维修", "爆管", "供水管网压占"]
        },
        color: ["#4babf5", "#19ca70", "#51d6e6", "#f16f9d", "#feb547"],
        series: [
          {
            name: "隐患类型",
            type: "pie",
            radius: "60%",
            center: ["35%", "45%"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      dangerTypePolyLine: {
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            var res = "<div>当前月份：" + params[0].name + "月</div>";
            for (var i = 0; i < params.length; i++) {
              if (!params[i].data) {
                params[i].data = "- -";
              }
              res +=
                "<div>" +
                params[i].seriesName +
                ":  " +
                params[i].data +
                "个</div>";
            }
            return res;
          }
        },
        legend: {
          top: "0%",
          data: []
        },
        grid: {
          top: "80px",
          left: "40px",
          right: "45px",
          bottom: "30px"
        },
        xAxis: {
          type: "category",
          name: "月",
          boundaryGap: false,
          data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
          type: 'category',
          axisLine: { show: true,lineStyle:{ color:'#6173A3' }},
          axisLabel:{interval:0,textStyle:{color:'#9ea7c4',fontSize:14} },
          axisTick : {show: false}
        },
        yAxis: {
          type: "value",
          name: "隐患数量",
          nameLocation: "end",
          interval:1
        },
        series: []
      },
      dangerArea: {
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            var res = "<div>当前月份：" + params[0].name + "月</div>";
            for (var i = 0; i < params.length; i++) {
              if (!params[i].data) {
                params[i].data = "- -";
              }
              res +=
                "<div>" +
                params[i].seriesName +
                ":  " +
                params[i].data +
                "个</div>";
            }
            return res;
          }
        },
        legend: {
          top: "5%",
          data: ["老城区", "新城区", "开发区", "西南新区"]
        },
        grid: {
          top: "80px",
          left: "40px",
          right: "45px",
          bottom: "30px"
        },
        xAxis: {
          name: "月",
          type: "category",
          boundaryGap: false,
          data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
        },
        yAxis: {
          name: "隐患数量",
          type: "value",
          minInterval: 1
        },
        color: ["#4babf5", "#e79a28", "#6cb436", "#e79a28"],
        dataZoom: [
          {
            show: false
          }
        ],
        series: []
      },
      protalTotal: {
        color: ["#33c89B"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            var res = "<div>当前月份：" + params[0].name + "月</div>";
            for (var i = 0; i < params.length; i++) {
              if (!params[i].data) {
                params[i].data = "- -";
              }
              res +=
                "<div>" +
                params[i].seriesName +
                ":  " +
                params[i].data +
                "次</div>";
            }
            return res;
          }
        },
        grid: {
          top: "40px",
          left: "40px",
          right: "45px",
          bottom: "30px"
        },
        xAxis: [
          {
            type: "category",
            name: "月",
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
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "(次)",
            minInterval: 1
          }
        ],
        color: "#38c8df",
        dataZoom: [
          {
            show: false
          }
        ],
        series: [
          {
            name: "年度巡检次数",
            type: "bar",
            barWidth: "60%",
            data: []
          }
        ]
      },
      repairRate: {
        color: ["#33a8DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            var res = "<div>当前月份：" + params[0].name + "月</div>";
            for (var i = 0; i < params.length; i++) {
              if (!params[i].data) {
                params[i].data = "- -";
              }
              res +=
                "<div>" +
                params[i].seriesName +
                ":  " +
                params[i].data +
                "次</div>";
            }
            return res;
          }
        },
        grid: {
          top: "40px",
          left: "40px",
          right: "45px",
          bottom: "30px"
        },
        xAxis: [
          {
            type: "category",
            name: "月",
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
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "(次)",
            minInterval: 1
          }
        ],
        color: "#4babf5",
        series: [
          {
            name: "年度维护统计",
            type: "bar",
            barWidth: "60%",
            data: []
          }
        ]
      },
      doRate: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          },
          formatter: function(params) {
            var res = "<div>计划名称：" + params[0].name + "月</div>";
            var unit = "";
            for (var i = 0; i < params.length; i++) {
              if (!params[i].data) {
                params[i].data = "0";
              }
              if (params[i].componentSubType == "line") {
                unit = "%";
              } else {
                unit = "个";
              }
              res +=
                "<div>" +
                params[i].seriesName +
                ":  " +
                params[i].data +
                unit +
                "</div>";
            }
            return res;
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
          data: ["签到点", "已签到点", "完成率"]
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisPointer: {
              type: "shadow"
            },
            boundaryGap: true,
            name: ""
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
            minInterval: 1
          },
          {
            type: "value",
            name: "完成率(%)",
            minInterval: 1
          }
        ],
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            xAxisIndex: [0],
            filterMode: "filter"
          }
        ],
        series: [
          {
            name: "签到点",
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
            name: "已签到点",
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
      }
    };
  },
  methods: {
    onReady(instance) {},
    onClick(event, instance, echarts) {
      console.log(arguments);
    },
    getCheckReportByYearMonth_() {
      let that = this;
      let temp_year = that.post_year;
      let temp_month = that.post_month;
      getCheckReportByYearMonth({
        year: "" + temp_year,
        month: "" + temp_month
      })
        .then(res => {
          if (res.msg == "no user") {
            window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
              dse.baseURL
            }?id=${id}`;
            return;
          }
          if (res.msg == "操作失败") {
            that.$message.error("服务错误!");
            return;
          }
          if (res.data) {
            let {
              problemFinishRateReport,
              problemPieChart,
              problemTypePieChart
            } = res.data;

            // 巡检完成率
            let temp_problemTypeAreaReport_x = [];
            let temp_problemTypeAreaReport_plan = [];
            let temp_problemTypeAreaReport_real = [];
            let temp_problemTypeAreaReport_finish = [];
            if (problemFinishRateReport.length) {
              for (let i = 0; i < problemFinishRateReport.length; i++) {
                temp_problemTypeAreaReport_x.push(
                  problemFinishRateReport[i].planName
                );
                temp_problemTypeAreaReport_plan.push(
                  problemFinishRateReport[i].signNum
                );
                temp_problemTypeAreaReport_real.push(
                  problemFinishRateReport[i].signedNum
                );
                temp_problemTypeAreaReport_finish.push(
                  problemFinishRateReport[i].finishRate
                );
              }
            }
            that.doRate.xAxis[0].data = temp_problemTypeAreaReport_x;
            that.doRate.series[0].data = temp_problemTypeAreaReport_plan;
            that.doRate.series[1].data = temp_problemTypeAreaReport_real;
            that.doRate.series[2].data = temp_problemTypeAreaReport_finish;

            // that.dangerScatter.series = problemPieChart;
            // 隐患分布图  按月
            let temp_problemPieChart_arr = [];
            //隐患分布图的图例   按月
            let problemPieChart_legend_list = [];
            if (problemPieChart.length) {
              problemPieChart.map(item => {
                temp_problemPieChart_arr.push({
                  name: "" + item.NAME,
                  value: "" + item.NUM
                });
                problemPieChart_legend_list.push(item.NAME);
              });
            }
            that.dangerScatter.series[0].data = temp_problemPieChart_arr;
            that.dangerScatter.legend.data = problemPieChart_legend_list;
            //menu.vue
            let temp_problemTypePieChart_arr = [];
            if (problemTypePieChart.length) {
              for (let j = 0; j < problemTypePieChart.length; j++) {
                if (problemTypePieChart[j].NAME == "暗漏") {
                  temp_problemTypePieChart_arr.push({
                    name: "" + problemTypePieChart[j].NAME,
                    value: "" + problemTypePieChart[j].NUM
                  });
                }
                if (problemTypePieChart[j].NAME == "非法用水") {
                  temp_problemTypePieChart_arr.push({
                    name: "" + problemTypePieChart[j].NAME,
                    value: "" + problemTypePieChart[j].NUM
                  });
                }
                if (problemTypePieChart[j].NAME == "爆管") {
                  temp_problemTypePieChart_arr.push({
                    name: "" + problemTypePieChart[j].NAME,
                    value: "" + problemTypePieChart[j].NUM
                  });
                }
                if (problemTypePieChart[j].NAME == "供水设备维修") {
                  temp_problemTypePieChart_arr.push({
                    name: "" + problemTypePieChart[j].NAME,
                    value: "" + problemTypePieChart[j].NUM
                  });
                }
                if (problemTypePieChart[j].NAME == "供水管网压占") {
                  temp_problemTypePieChart_arr.push({
                    name: "" + problemTypePieChart[j].NAME,
                    value: "" + problemTypePieChart[j].NUM
                  });
                }
              }
            }
            that.dangerType.series[0].data = temp_problemTypePieChart_arr;
          }
        })
        .catch(function(error) {
          // if (error == "Error: Network Error") {
          //     that.$message.error("网络错误")
          //     return;
          // } else {
          //     that.$message.error("逻辑错误!")
          // }
        });
    },
    getCheckReportByYear_() {
      let that = this;
      let temp_year = that.post_year;
      getCheckReportByYear({
        year: "" + temp_year
      })
        .then(res => {
          // console.log(res);
          if (res.msg == "no user") {
            window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${
              dse.baseURL
            }?id=${id}`;
            return;
          }
          if (res.msg == "操作失败") {
            that.$message.error("服务错误!");
            return;
          }
         
          if (res.data) {
            let {
              checkNumReport,
              problemAreaReport,
              problemTypeAreaReport,
              repairNumReport
            } = res.data;
            // 隐患分区折线图  按年
            let temp_problemAreaReport_len = problemAreaReport.length;
            if (temp_problemAreaReport_len > 0) {
              that.dangerArea.series = [];
              for (let k = 0; k < temp_problemAreaReport_len; k++) {
                let temp_name = problemAreaReport[k].name;
                let temp_json = {
                  name: temp_name,
                  type: "line",
                  data: problemAreaReport[k].data
                };
                that.dangerArea.series.push(temp_json);
                that.dangerArea.legend.data.push(temp_name);
              }
            } else {
              that.dangerArea.legend.data = [];
              that.dangerArea.series= [];
            }

            //  隐患类型分区折线图   按年份
            let temp_problemTypeAreaReport_len = problemTypeAreaReport.length;
            if (temp_problemTypeAreaReport_len > 0) {
              that.dangerTypePolyLine.series = [];
              let temp_arr = [];
              for (let i = 0; i < temp_problemTypeAreaReport_len; i++) {
                let temp_name = problemTypeAreaReport[i].name;
                that.dangerTypePolyLine.legend.data.push(temp_name);
                let temp_json = {
                  name: temp_name,
                  type: "line",
                  data: problemTypeAreaReport[i].data
                };
                temp_arr.push(temp_json)
              }
              that.dangerTypePolyLine.series=temp_arr;
            } else {
              that.dangerTypePolyLine.legend.data = [];
              that.dangerTypePolyLine.series = [];
              
            }
            // 年度巡检次数
            that.protalTotal.series[0].data =
              checkNumReport && checkNumReport.length
                ? checkNumReport[0].data
                : [];
            // 年度维护数统计
            that.repairRate.series[0].data =
              repairNumReport && repairNumReport.length > 0
                ? repairNumReport[0].data
                : [];
          }

          that.showChart = 1;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    showThisTab(index) {
      this.activedTab = index;
    },
    getPie(val) {
      let temp = new TransformTime(val).format_yymm();
      this.post_year = temp.split("/")[0];
      this.post_month = parseInt(temp.split("/")[1]);
      this.getCheckReportByYearMonth_();
    },
    getLine(val) {
        let that = this;
      let temp = new TransformTime(val).format_yy();
      this.post_year = temp.split("/")[0];
      this.getCheckReportByYear_();
      // 为了切换图表
      this.showChart = 2;
    }
  },
  mounted() {
    this.loading = false;
  },
  created() {
    let time = new Date();
    let year = time.getUTCFullYear();
    let widthMonth =
      year +
      "-" +
      (time.getUTCMonth() + 1 < 10
        ? "0" + (time.getUTCMonth() + 1)
        : time.getUTCMonth() + 1);
    this.year1 = "" + year;
    this.year2 = "" + year;
    this.month1 = widthMonth;
    this.month = "" + (time.getUTCMonth() + 1);
    this.post_year = year;
    this.post_month = "" + (time.getUTCMonth() + 1);
    this.getCheckReportByYearMonth_();
    this.getCheckReportByYear_();
  }
};
</script>

<style lang="scss" scoped>
$baseFont: 14px;
$baseColor: #333;
$baseBorderColor: #ccc;
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
