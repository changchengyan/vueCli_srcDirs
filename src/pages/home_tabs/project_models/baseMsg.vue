<template>
    <div id="baseMsg">
        <div class="table-view">
            <table class="innerTable">
                <thead>
                <tr>
                    <th><span>关键项</span></th>
                    <th><span>参数值</span></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><span>设计规模(万方/天)</span></td>
                    <td><span>40</span></td>
                </tr>
                <tr>
                    <td><span>扬程(m)</span></td>
                    <td><span>75</span></td>
                </tr>
                <tr>
                    <td><span>装机容量(KW)</span></td>
                    <td><span>1234</span></td>
                </tr>
                <tr>
                    <td><span>运行方式</span></td>
                    <td><span>三用一备</span></td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="img-cards">
            <div class="top-title">
                <span>图片</span>
            </div>
            <div class="imgs">

            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'baseMsg',
        data(){
            return{
                flow:{
                    loading:true,
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
                }
            };
        }
    };
</script>

<style scoped lang="scss">
    #baseMsg{
        width: 100%;
        height: 100%;
        .table-view{
            width: 100%;
            padding: 0 10px;
            height: 180px;
            overflow: auto;
        }
        .img-cards{
            width: 100%;
            height: calc(100% - 180px);
            .top-title{
                width: 100%;
                height: 30px;
                line-height: 30px;
                border-bottom: 1px solid #ccc;
                font-size: 16px;
                font-weight: 600;
                text-align: left;
            }
            .imgs{
                width: 100%;
                height: calc(100% - 30px);
                display: flex;
                justify-content: flex-start;
            }
        }
    }
</style>