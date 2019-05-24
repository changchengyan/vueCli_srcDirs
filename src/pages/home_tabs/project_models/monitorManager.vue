<template>
    <div id="monitorMsg">
       <div class="table-view">
           <table class="innerTable">
               <thead>
                   <tr>
                       <th><span>监测项</span></th>
                       <th><span>检测值</span></th>
                   </tr>
               </thead>
               <tbody>
                   <tr>
                       <td><span>瞬时流量(m³/h)</span></td>
                       <td><span>1234</span></td>
                   </tr>
                   <tr>
                       <td><span>今日供水量(m³)</span></td>
                       <td><span>1234</span></td>
                   </tr>
                   <tr>
                       <td><span>出厂压力(Mpa)</span></td>
                       <td><span>1234</span></td>
                   </tr>
               </tbody>
           </table>
       </div>
        <div class="chart-card">
            <div class="top-title">
                <span>流量</span>
            </div>
            <div class="time-select">
                <div class="col">
                    <span>起始时间:</span>
                    <el-date-picker
                            v-model="startTime"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
                <div class="col">
                    <span class="textLeft">至</span>
                    <el-date-picker
                            v-model="endTime"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div>
            <div class="chart-main">
                <i-echart :option="flow.line" :resizable="flow.resize" :loading="flow.loading" />
            </div>
        </div>
    </div>
</template>

<script>

    import IEchart from 'vue-echarts-v3/src/full';
    export default {
        name: 'monitorManager',
        components:{
            IEchart
        },
        data(){
            return{
               flow:{
                  loading:true,
                   resize:true,
                  line:{
                      tooltip: {},
                      grid: {
                          top: '40px',
                          left: '40px',
                          right: '45px',
                          bottom: '30px'
                      },
                      xAxis: {
                          show: true,
                          name: '管径',
                          data: []
                      },
                      yAxis: {
                          show: true,
                          name: '(管长m)'
                      },
                      color: '#2d9fff',
                      series: [{
                          name: '综合管线长度',
                          type: 'line',
                          barWidth: '10%',
                          data:  [100,500,200,400,200],
                          lineStyle: {
                              opacity: 1,
                              color: {
                                  type: 'linear',
                                  x: 0,
                                  y: 0,
                                  x2: 0,
                                  y2: 1,
                                  colorStops: [{
                                      offset: 0,
                                      color: '#5666f4' // 0% 处的颜色
                                  },
                                      {
                                          offset: 1,
                                          color: '#5666f4' // 100% 处的颜色
                                      }
                                  ],
                                  globalCoord: false // 缺省为 false
                              }
                          },
                          areaStyle: {
                              opacity: 1,
                              color: {
                                  type: 'linear',
                                  x: 0,
                                  y: 0,
                                  x2: 0,
                                  y2: 1,
                                  colorStops: [{
                                      offset: 0,
                                      color: '#5666f4' // 0% 处的颜色
                                  },
                                      {
                                          offset: 1,
                                          color: '#5acef7' // 100% 处的颜色
                                      }
                                  ],
                                  globalCoord: false // 缺省为 false
                              }
                          },
                          smooth:true
                      }]
                  }
               },
                startTime:'',
                endTime:''
            };
        }
    };
</script>

<style scoped lang="scss">
    #monitorMsg{
        width: 100%;
        height: 100%;
        .table-view{
            width: 100%;
            padding: 0 10px;
            height: 140px;
            overflow: auto;
        }
        .chart-card{
            width: 100%;
            height: calc(100% - 140px);
            .top-title{
                width: 100%;
                height: 30px;
                line-height: 30px;
                border-bottom: 1px solid #ccc;
                font-size: 16px;
                font-weight: 600;
                text-align: left;
            }
            .time-select{
                width: 100%;
                height: 30px;
                display: flex;
                justify-content: flex-start;
                margin-right: 10px;
                .col{
                    width: 300px;
                    span{
                        display: inline-block;
                        width: 60px;
                        text-align: right;
                        margin-right: 5px;
                        &.textLeft{
                            text-align: left;
                            width: 20px;
                        }
                    }

                }
            }
            .chart-main{
                width: 100%;
                height: calc(100% - 60px);
            }
        }
    }
</style>