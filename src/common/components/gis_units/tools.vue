<template>
<div id="measureTools">
    <div class="layers" v-if="layerList.length>0">
        <div class="topShow" id="subLayers">
            <i class="iconfont icon-shebeizhonglei"></i>
            <span>{{dev_item}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
            <div class="subLayers">
                <div class="innerwrap">
                    <div class="layerItem" v-for="(item,index) in layerList" :key="index" @click.stop="select(index,item.name)">
                        <span class="rect">
                    <template v-if="item.active">
                        <i class="el-icon-check" :class="{active:item.active}" ></i>
                    </template>
                </span>
                        <span>{{item.name}}</span>
                    </div>
                </div>

                <!-- <div class="footer">
                <div class="cancel" @click.stop="cancel">取消</div>
                <div class="config" @click.stop="config">确定</div>
            </div> -->
            </div>
        </div>
    </div>
    <el-dropdown @command="type">
        <span class="el-dropdown-link">
                <i class="iconfont icon-ditu"></i>
                  {{type_item}}
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item ref="d_2" id="d_2" command="d_2">平面</el-dropdown-item>
            <el-dropdown-item ref="earthMap" id="earthMap" command="earthMap">卫星</el-dropdown-item>
            <el-dropdown-item ref="d_3" id="d_3" command="d_3">地形图</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown @command="measure">
        <span class="el-dropdown-link">
                <i class="el-icon-view"></i>
                  {{measure_item}}
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item ref="measuringDistance" id="measure_distance" command="measuringDistance">测距</el-dropdown-item>
            <el-dropdown-item ref="measuringSurface" id="measure_area" command="measuringSurface">测面</el-dropdown-item>
             <el-dropdown-item ref="dot" id="dot" command="dot">标点</el-dropdown-item>
            <!-- <el-dropdown-item ref="furface" id="furface" command="furface">标面</el-dropdown-item> -->
            <el-dropdown-item ref="clearAll" id="clearAll" command="clearAll">清除所有</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</div>
</template>

<script>
/**
 * 图层列表
 * [
 *   {
                    name: "所有设备",
                    id: "allDev",
                    active: true
                },
                {
                    name: "管网",
                    id: "turbe",
                    active: true
                },
                {
                    name: "阀门",
                    id: "tap",
                    active: true
                },
                {
                    name: "消防栓",
                    id: "fireplug",
                    active: true
                },
                {
                    name: "检测仪器",
                    id: "monitor",
                    active: true
                },
                {
                    name: "其他",
                    id: "others",
                    active: true
                }
 * ]
 */
export default {
    props: ["defaultLayers"],
    data() {
        return {
            dev_item: "所有设备",
            type_item: "底图",
            measure_item: "工具",
            showSubLayer: false,
            layerList: []
        };
    },
    methods: {
        type(val) {
            let temp_val = val;
            let temp_ele = "";
            let that = this;
            switch (temp_val) {
                case "d_2":
                    temp_ele = that.$refs.d_2;
                    that.type_item = "平面";
                    break;
                case "earthMap":
                    temp_ele = that.$refs.earthMap;
                    that.type_item = "卫星";
                    break;
                case "d_3":
                    temp_ele = that.$refs.d_3;
                    that.type_item = "地形";
                    break;
            }
            let temp_str = that.type_item;
            this.$emit("handleThisDom", {
                ele: temp_ele,
                tmpStr: temp_str
            });
        },
        measure(val) {
            let temp_val = val;
            let temp_ele = "";
            let that = this;
            switch (temp_val) {
                case "measuringDistance":
                    temp_ele = that.$refs.measuringDistance;
                    that.measure_item = "测距";
                    break;
                case "measuringSurface":
                    temp_ele = that.$refs.measuringSurface;
                    that.measure_item = "测面";
                    break;
                    case "dot":
                        temp_ele = that.$refs.dot;
                        that.measure_item = "标点";
                        break;
                    // case "furface":
                    //     temp_ele = that.$refs.furface;
                    //     that.measure_item = "标面";
                    //     break;
                case "clearAll":
                    temp_ele = that.$refs.clearAll;
                    that.measure_item = "清除所有";
                    break;
            }
            let temp_str = that.measure_item;
            this.$emit("handleThisDom", {
                ele: temp_ele,
                tmpStr: temp_str
            });
        },
        resetLayerList(flag) {
            let temp_list = this.layerList;
            for (let i = 0; i < temp_list.length; i++) {
                if (flag) {
                    temp_list[i].active = true;
                } else {
                    temp_list[i].active = false;
                }
            }
            return temp_list;
        },
        fullReset() {
            let temp_list = this.layerList;
            let temp_flag = true;
            for (let i = 1; i < temp_list.length; i++) {
                if (!temp_list[i].active) {
                    temp_flag = false;
                    break;
                }
            }
            return temp_flag;
        },
        select(index, name) {
            if (index == 0) {
                this.layerList[0].active = !this.layerList[0].active;
                let temp_flag = this.layerList[index].active;
                this.layerList = this.resetLayerList(temp_flag);

                this.dev_item = "显示图层";
            } else {
                this.layerList[index].active = !this.layerList[index].active;
                if (!this.layerList[index].active) {
                    this.layerList[0].active = false;
                }
                let temp_flag = this.fullReset();
                this.dev_item = "显示图层";
                if (temp_flag) {
                    this.layerList[0].active = true;
                    this.dev_item = "所有设备";
                }
                let flag = this.layerList[index].active;
                // this.$emit("handleSelect", {
                //     name: name,
                //     flag: flag
                // });
            }
            let temp_list = this.layerList.slice(1);
            this.$emit("showLayers", temp_list);

        },
        showSub() {
            this.showSubLayer = !this.showSubLayer;

        },
        config() {
            this.showSubLayer = false;
            let temp_list = this.layerList.slice(1);
            this.$emit("showLayers", temp_list);
        },
        cancel() {
            let that = this;
            this.showSubLayer = false;
            this.layerList = this.resetLayerList(true);
            let temp_list = that.layerList.slice(1)
            this.$emit("showLayers", temp_list);
            this.dev_item = "所有设备";
        }
    },
    created() {
        this.layerList = this.defaultLayers;
    }
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

#measureTools {
    width: 100%;
    height: 100%;
    line-height: 30px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    // position: absolute;

    .el-dropdown {
        cursor: pointer;
    }

    i {
        color: rgb(158, 153, 153);
    }

    .layers {
        position: relative;
        width: 33%;
        font-size: 14px;
        color: #333;
        cursor: pointer;

        .topShow {
            width: 100%;
            position: relative;
            .subLayers {
                position: absolute;
                display: none;
                top: 30px;
                left: 0;
                width: 100%;
                background: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                z-index: 999;
                font-size: 12px;
                color: #333;

                .innerwrap {
                    width: 100%;
                    max-height: 180px;
                    overflow-y: auto;

                    .layerItem {
                        width: 100%;
                        padding-left: 10px;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;

                        &:hover {
                            background: #0b83fe;
                            color: #fff;

                            i {
                                color: #fff !important;
                            }
                        }
                        .rect {
                            display: inline-block;
                            width: 14px;
                            height: 14px;
                            border: 1px solid #ccc;
                            position: relative;
                            margin-right: 10px;

                            i {
                                font-size: 14px;
                                position: absolute;
                                top: 0;
                                left: 0;

                                &.active {
                                    color: #0b83fe;
                                }
                            }
                        }
                    }
                }

                // .footer {
                //     width: 100%;
                //     display: flex;
                //     justify-content: center;
                //     align-items: center;
                //     margin-bottom: 10px;

                //     &>div {
                //         padding: 0px 4px;
                //         line-height: 20px;
                //         background: #0b83fe;
                //         color: #fff;
                //         border-radius: 3px;
                //         margin-right: 10px;
                //         cursor: pointer;

                //         &:last-child {
                //             margin-right: 0;
                //         }

                //         &:first-child {
                //             background: gray;
                //         }
                //     }
                // }
            }
            &:hover{
                .subLayers{
                    display: block;
                }
            }
        }

    }
}
</style>
