<template>
    <div id="pagination">
        <div class="prev" @click="prev" :class="{active:pages.clickPrev}"> <i class="el-icon-arrow-left"></i> </div>
        <div class="wrap-pages">
            <div class="page-item">
                {{pages.currentPage}}
            </div>
        </div>
        <div class="next" @click="next" :class="{active:pages.clickNext}"><i class="el-icon-arrow-right"></i></div>
        <div class="redirctPage">
            <span v-if="!small">跳转到</span>
            <input type="text" @keyup.enter="thisPage($event)" :class="{error:pages.glNum}">
        </div>
        <div class="totalPage" v-if="!small">
            <span>共</span>
            <span>{{totalPage}}</span>
            <span>页</span>
        </div>
    </div>
</template>

<script>
    export default {
        name:'simplePagination',
        props: ["noSmall", "totalPage"],
        data() {
            return {
                small: false,
                pages: {
                    currentPage: 1,
                    clickPrev: false,
                    clickNext: true,
                    glNum: false
                }
            };
        },
        methods: {
            prev() {
                if (this.pages.currentPage == 0) {
                    this.pages.currentPage = 1;
                    this.pages.clickPrev = false;
                    return null;
                }
                this.pages.clickNext = true;
                if (this.pages.currentPage > 1) {
                    this.pages.currentPage = this.pages.currentPage - 1;
                }
                let temp_pageNum = this.pages.currentPage;
                this.$emit("thisPage", temp_pageNum);
            },
            next() {
                if (this.pages.currentPage > this.totalPage) {
                    this.pages.currentPage = this.totalPage;
                    this.pages.clickNext = false;
                    return null;
                }
                this.pages.clickPrev = true;
                if (this.pages.currentPage < this.totalPage) {
                    this.pages.currentPage = this.pages.currentPage + 1;
                }
                let temp_pageNum = this.pages.currentPage;
                this.$emit("thisPage", temp_pageNum);
            },
            thisPage(event) {
                let temp_value = event.target.value;
                if (parseInt(temp_value) <= this.totalPage) {
                    this.pages.glNum = false;
                    this.pages.currentPage = parseInt(temp_value);
                    let temp_pageNum = this.pages.currentPage;
                    this.$emit("thisPage", temp_pageNum);
                } else {
                    this.pages.glNum = true;
                }
            }
        },
        created() {
            let that = this;
            let temp_ifSmall = that.noSmall ? true : false;
            if (document.body.clientWidth < 1600) {
                if (!temp_ifSmall) {
                    this.small = true;
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    #pagination {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .prev,
        .next {
            width: 25px;
            height: 25px;
            line-height: 23px;
            border: 1px solid #d2d2d2;
            text-align: center;
            cursor: pointer;
        }
        .wrap-pages {
            width: 50px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            & > div {
                width: 25px;
                height: 25px;
                line-height: 23px;
                border: 1px solid #d2d2d2;
                text-align: center;
                cursor: pointer;
            }
        }

        .redirctPage {
            line-height: 25px;

            margin-left: 10px;

            display: flex;

            align-items: center;

            span {
                font-size: 12px;

                color: #333;

                display: inline-block;

                margin-right: 5px;
            }

            input[type="text"] {
                width: 80px;

                padding-left: 5px;

                line-height: 13px;

                height: 25px;

                border: 1px solid #d2d2d2;

                &.error {
                    border: 1px solid red;
                }
            }
        }

        .totalPage {
            color: #333;

            font-size: 12px;

            line-height: 25px;

            margin-left: 5px;
        }
    }
</style>


