<template>
<div id="legend">
    <template v-if="closeFlag==false">
        <div class="card" :class="{ifOpacity:closeFlag==true}">
            <div class="closed" @click="closed">
                <i class="el-icon-close"></i>
            </div>
            <div class="top-head" :style="{height:topHeight?topHeight:'150px'}">
                <div class="row" v-for="(val,i) in list.top" :key="i">
                    <span  class="line" :style="{background:`${val.color}`,width:textWidth?`calc(100% - ${textWidth}px)`:`calc(100% - ${textWidth}px)`}"></span><span>{{val.name}}</span>
                </div>
            </div>
            <div class="sub">
                <slot></slot>
            </div>
        </div>
        <div class="updateTime">
            <created-time></created-time>
        </div>
    </template>
    <template v-else>
        <div class="btn-legend" @click="showLegend_">
            <span>图例</span>
        </div>
    </template>

</div>
</template>

<script>
// list: {
//                 top: [{
//                         color: "red",
//                         name: "爆管"
//                     },
//                     {
//                         color: "green",
//                         name: "风险等级低"
//                     }
//                 ],
//                 sub: [{
//                         url: "../../assets/images/common/jxj.png",
//                         name: "检修井"
//                     },
//                     {
//                         url: "../../assets/images/common/xfs.png",
//                         name: "消防栓"
//                     }
//                 ]
//             },
import createdTime from "@/common/components/createdTime"
export default {
    props: ["list", 'topHeight', 'ifClosed', 'textWidth'],
    components: {
        createdTime
    },
    data() {
        return {
            closeFlag: false
        }
    },
    methods: {
        closed() {
            this.closeFlag = true;
            // this.$emit("closedSelf", true)
        },
        showLegend_() {
            this.closeFlag = false;
        }
    },
    watch: {
        ifClosed: {
            handler(newValue, oldValue) {
                this.closeFlag = newValue
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        this.closeFlag = this.ifClosed;
    }
}
</script>

<style lang="scss" scoped>
#legend {
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #333;

    .card {
        width: 100%;
        background: #fff;
        border-radius: 10px;
        margin-bottom: 10px;
        position: relative;
        padding: 5px;
        border: 1px solid #ccc;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

        &.ifOpacity {
            opacity: 0;
        }

        .closed {
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
        }

        .top-head {
            width: 100%;
            padding-top: 10px;
            height: 150px;
            overflow-y: auto;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;

            .row {
                width: 50%;
                padding: 0 10px;
                height: 30px;
                line-height: 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                // .col {
                //     width: 50%;
                //     height: 30px;
                //     display: flex;
                //     justify-content: center;
                //     align-items: center;
                span.line {
                    display: inline-block;
                    width: calc(100% - 80px);
                    height: 15px;
                    // margin: 0 auto;
                }

                // }
            }
        }

        .sub {
            width: 100%;
            // height: 65px;
            overflow-x: auto;
            min-height: 70px;
        }
    }

    .updateTime {
        width: 100%;
        padding: 5px 0;
        background: #fff;
        border-radius: 5px;
        box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
    }

    .btn-legend {
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 50%;
        background: #0b83fe;
        color: #fff;
        position: absolute;
        top: -40px;
        right: 20px;
        cursor: pointer;
    }

}
</style>
