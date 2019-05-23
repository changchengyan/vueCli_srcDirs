<template>
<div id="selectTable" v-if="closedModel_flag==true">
    <div class="model">
        <div class="top-head">
            <span>请选择工单？</span>
            <i class="el-icon-close" @click="cancelSelf"></i>
        </div>
        <div class="subContent">
            <div class="row" :class="{actived:selectedIndex==index}" v-for="(item,index) in selects" :key="index" @click="selectThis(index)">
                <span class="radio">
                      <i class="dolt"></i>
                  </span>
                <span>{{item.name}}</span>
            </div>
        </div>
        <div class="actions">
            <span @click="cancelSelf">取消</span>
            <span @click="config">确定</span>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['closedModel_flag'],
    data() {
        return {
            selects: [{
                    name: "原有工单"
                },
                {
                    name: "标准工单"
                }
            ],
            selectedIndex: 0
        }
    },
    methods: {
        cancelSelf() {
            this.$emit("closeModel", false)
        },
        config() {
            let that = this
            this.$emit("configSelect", that.selectedIndex)
        },
        selectThis(index){
            this.selectedIndex = index;
        }
    },
    created() {
        this.closed = this.closedModel_flag;
    }
}
</script>

<style lang="scss" scoped>
#selectTable {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    font-size: 14px;
    color: #333;

    .model {
        width: 200px;
        height: 200px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -100px;
        margin-left: -100px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 10px rgba(0, 0, 0, 0.4);

        .top-head {
            width: 100%;
            height: 30px;
            font-weight: 600;
            background: #0b83fe;
            color: #fff;
            line-height: 30px;
            text-align: center;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            position: relative;

            i {
                position: absolute;
                top: 4px;
                right: 4px;
                cursor: pointer;
            }
        }

        .subContent {
            width: 100%;
            height: calc(100% - 60px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .row {
                width: 100%;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;

                span {
                    display: inline-block;
                    line-height: 30px;
                    margin-right: 20px;
                }

                .radio {
                    width: 14px;
                    height: 14px;
                    border-radius: 14px;
                    border: 1px solid #ccc;
                    position: relative;

                    i {
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        transform: scale(.5);
                        border-radius: 10px;
                        background: #000;
                        position: absolute;
                        top: 1px;
                        left: 1px;
                        opacity: 0;
                    }

                }

                &.actived {
                    .radio {
                        i {
                            opacity: 1;
                        }
                    }

                }

            }
        }

        .actions {
            width: 100%;
            display: flex;
            justify-content: center;
            background: #e3e3e3;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            height: 40px;
            align-items: center;
            span {
                display: inline-block;
                padding: 0px 15px;
                border-radius: 5px;
                background: #ccc;
                cursor: pointer;
                margin-right: 10px;
                height: 30px;
                line-height: 30px;
                &:last-child {
                    background: #0b83fe;
                    color: #fff;
                }
            }
        }
    }
}
</style>
