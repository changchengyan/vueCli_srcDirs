<template>

    <div id="pipeMsg">
        <div class="top-select">
            <div class="col">
                <span>区选择</span>
                <el-select v-model="areaItem" placeholder="请选择">
                    <el-option
                            v-for="item in areaList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="col">
                <span>类型</span>
                <el-select v-model="typeItem" placeholder="请选择">
                    <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="col">
                <span>展示方式</span>
                <el-select v-model="wayItem" placeholder="请选择">
                    <el-option
                            v-for="item in showWayList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="col">
                <span>年份</span>
                <el-select v-model="yearItem" placeholder="请选择">
                    <el-option
                            v-for="item in yearList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="sub-content">
            <div class="row">
                <div class="col">
                    <div class="topTitle">
                        <span>管网信息统计表(直径)</span>
                    </div>
                    <div class="main-chart">
                        <Ichart :option="diameter.line" :loading="diameter.loading" :resizable="true" />
                    </div>
                </div>
                <div class="col">
                    <div class="topTitle">
                        <span>管网信息统计表(管材)</span>
                    </div>
                    <div class="main-chart">
                        <Ichart :option="material.bar" :loading="material.loading" :resizable="true" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="topTitle">
                        <span>设备数量统计表</span>
                    </div>
                    <div class="main-chart">
                        <Ichart :option="devs.bar" :loading="devs.loading" :resizable="true" />
                    </div>
                </div>
                <div class="col">
                    <div class="topTitle">
                        <span>阀门口径统计表</span>
                    </div>
                    <div class="main-chart">
                        <Ichart :option="fm.line" :loading="fm.loading" :resizable="true" />
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script>

    import Ichart from 'vue-echarts-v3/src/full';
    export  default {
        components:{
          Ichart
        },
        data(){
            return{
                areaList: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                areaItem: '',
                typeList:[
                    {
                        value: '选项1',
                        label: '黄金糕'
                    }, {
                        value: '选项2',
                        label: '双皮奶'
                    }, {
                        value: '选项3',
                        label: '蚵仔煎'
                    }
                ],
                typeItem:'',
                showWayList:[
                    {
                        value: '选项1',
                        label: '黄金糕'
                    }, {
                        value: '选项2',
                        label: '双皮奶'
                    }, {
                        value: '选项3',
                        label: '蚵仔煎'
                    }
                ],
                wayItem:'',
                yearList:[
                    {
                        value: '选项1',
                        label: '黄金糕'
                    }, {
                        value: '选项2',
                        label: '双皮奶'
                    }, {
                        value: '选项3',
                        label: '蚵仔煎'
                    }
                ],
                yearItem:'',
                diameter:{
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
                },
                material:{
                    loading:true,
                    bar:{
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
                            type: 'bar',
                            barWidth: '10%',
                            data:  [100,500,200,400,200]
                        }]
                    }
                },
                devs:{
                    loading:true,
                    bar:{
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
                            data:  [100,500,200,400,200]
                        },
                        yAxis: {
                            show: true,
                            name: '(管长m)'
                        },
                        color: '#2d9fff',
                        series: [{
                            name: '综合管线长度',
                            type: 'bar',
                            barWidth: '10%',
                            data: [100,500,200,400,200]
                        }]
                    }
                },
                fm:{
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
                            data: [100,500,200,400,200],
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
        },
        methods:{

        },
        created() {

        }

    };

</script>

<style scoped lang="scss">

#pipeMsg{
    width: 100%;
    height: 100%;
    .top-select{
        height: 50px;
        padding: 5px 1em;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .col{
            margin-right: 10px;
            span{
                display: inline-block;
                margin-right: 10px;
            }
        }
    }
    .sub-content{
        width: 100%;
        height: calc(100% - 50px);
        .row{
            width:100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: calc(50% - 10px);
            &:first-child{
                margin-bottom: 10px;
            }
            .col{
                width: calc(50% - 12.5px);
                margin: 0 auto;
                height: 100%;
                box-shadow: 0 0 5px rgba(0,0,0,0.3);
                .topTitle{
                    width: 100%;
                    text-align: center;
                    height: 40px;
                    line-height: 40px;
                    color: #333;
                    font-weight: 600;
                    font-size: 14px;
                }
                .main-chart{
                    width: 100%;
                    height: calc(100% - 40px);
                }

            }
        }
    }

}

</style>