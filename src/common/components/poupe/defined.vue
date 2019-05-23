<template>
<div id="defined" v-if="showDefinedModel">
    <div class="definedModel">
        <div class="model" :style="{height:modelHeight?modelHeight:'200px'}">
            <div class="title">
                <span>{{title}}</span>
                <img src="../../../assets/images/common/modelHidden.png" alt="" @click='hiddenSelf'>
            </div>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</div>
</template>

<script>
/**
 *     ********************************************
 *     *   title                               X  *
 *     * *****************************************
 *     *                                          *
 *     *                                          *
 *     *           <slot></slot>                  *
 *     *                                          *
 *     *                                          *
 *     *                                          *
 *     *******************************************
 */

export default {
    props: ["showDefinedModel", "title",'modelHeight'],
    data() {
        return {};
    },
    methods: {
        hiddenSelf() {
            this.$emit("hiddenSelf", false);
        }
    }
};
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

#defined {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 100;
    .definedModel {
        width: 100%;
        height: 100%;
        .model {
            width: 400px;
            overflow: hidden;
            position: absolute;
            top: 50%;
            left: 50%;
            border-radius: 10px;
            background: #fff;
            margin-top: -100px;
            margin-left: -200px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
            .title {
                height: 30px;
                line-height: 30px;
                text-align: right;
                background: #2a91db;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                font-size: 14px;
                color: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 15px;
                img {
                    width: 14px;
                }
            }
            .content {
                width: 100%;
                height: calc(100% - 30px);
                overflow-y: auto; // padding: 10px 20px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
        }
    }
}
</style>
