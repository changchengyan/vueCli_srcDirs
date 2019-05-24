<template>
    <div id="calanderEvent">
        <div class="top-head">
            <div class="row">
                <el-button type="primary">批量排版</el-button>
            </div>
            <div class="row">
                <div class="col">
                    <span class="label">年份:</span>
                    <el-select v-model="yearItem" placeholder="请选择" @change="getYear">
                        <el-option
                                v-for="item in yearList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="col">
                    <span class="label">月份:</span>
                    <el-select v-model="monthItem" placeholder="请选择" @change="getMonth">
                        <el-option
                                v-for="item in monthList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="row">
                <span class="bg-rectangle"></span>
                <span>已排班</span>
            </div>
        </div>
        <div class="main-contnet">
            <div class="row first">
                <div class="col"><span>一</span></div>
                <div class="col"><span>二</span></div>
                <div class="col"><span>三</span></div>
                <div class="col"><span>四</span></div>
                <div class="col"><span>五</span></div>
                <div class="col"><span>六</span></div>
                <div class="col"><span>七</span></div>
            </div>
            <div class="calander-table">
                <template v-for="(val,index) in monthEventList">
                    <div class="row" :key="index" v-if="val.length>0">
                        <template v-for="(item,i) in val" >
                            <div class="calanderItem" :key="i">
                                <div class="day-number">
                                    <span class="day-label">{{item.day}}</span>
                                    <span class="order-status">{{item.status?'已排班':'未排班'}}</span>
                                    <div class="lunar">
                                        <span>{{item.lunar}}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import {monthDayList} from '../../mixins/common_mixins';

    export default {
        name: 'calanderEvent',
        data() {
            return {

                monthEventList:[],
            };
        },
        mixins:[monthDayList],
        methods: {
            getYear(event){
                let that  = this;
                this.yearItem = event;
                this.monthEventList = this.mergeFetchMonthList(that.yearItem, that.monthItem, []);
            },
            getMonth(event){
                let that  = this;
                this.monthItem = event;
                this.monthEventList = this.mergeFetchMonthList(that.yearItem, that.monthItem, []);
            }
        },
        created() {
            let that = this;
            let date = new Date();
            this.yearItem = date.getFullYear();
            this.monthItem = date.getMonth() + 1;
            this.yearList = this.yearList_();
            this.monthList = this.monthList_();
            this.monthEventList = this.mergeFetchMonthList(that.yearItem, that.monthItem, []);
        }
    };
</script>

<style scoped lang="scss">

    #calanderEvent {
        width: 100%;
        height: 100%;
        padding: 10px;
        .top-head{
            width: 100%;
            margin-bottom: 10px;
            .row{
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 5px;
                margin-right: 0;
                margin-left: 0;
                .col{
                    width: 160px;
                    span.label{
                        display: inline-block;
                        width: 40px;
                        /*margin-right: 10px;*/
                    }
                    .el-select{
                        width: calc(100% - 50px);
                    }
                }
                &:last-child{
                    justify-content: flex-end;
                }
            }
        }
        .main-contnet{
            width: 100%;
            height: calc(100% - 115px);
            box-shadow: 0 0 5px rgba(0,0,0,0.15);

            .row.first{
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-right: 0;
                margin-left: 0;
                .col{
                    flex: 1;
                    text-align: center;
                    height: 30px;
                    line-height: 30px;
                    background: #ededed;
                }
            }
            .calander-table{
                width: 100%;
                height: calc(100% - 30px);
                .row{
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    height: 20%;
                    border-bottom: 1px solid #ccc;
                    margin-right: 0;
                    margin-left: 0;
                    .calanderItem{
                        width: 14.28%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        &:hover{
                            background: rgba(0,0,0,0.15);
                        }
                        .day-number{
                            width: 100%;
                            text-align: center;
                            .day-label{
                                font-size: 16px;
                                font-weight: 600;
                            }
                            .order-status{
                                display: inline-block;
                                background: #0b83fe;
                                color: #fff;
                                padding: 3px;
                            }
                            .lunar{
                                padding-top: 5px;
                                font-weight: 600;
                            }
                        }
                    }
                }

            }

        }

    }
</style>
