<template>
    <div id="menu">
        <div class="menuItem" v-for="(item,index) in menuList" :key="index">
            <template v-if="item.children&&item.children.length>0">
                <!-- :class="{actived:item.status}" -->
                <div class="firstLevel" @click="showTopSub(index)">
                    <i class="iconfont" :class="[item.icon]"></i>
                    <a>{{item.name}}</a>
                    <i class=" el-icon-caret-top showSub" :class="{animate:item.subShow}"></i>
                </div>
            </template>
            <template v-else>
                <!-- :class="{actived:item.status}" -->
                <div class="firstItem" :class="{actived:item.status}" @click="showTopNoSun(index)">
                    <i class="iconfont" :class="[item.icon]"></i>
                    <span>{{item.name}}</span>
                </div>
            </template>
            <template v-if="item.children&&item.children.length>0&&item.subShow">
                <div class="secondLevel" v-for="(v,i) in item.children" :key="i" >
                    <template v-if="v.children&&v.children.length>0">
                        <div class="secondToggole" :class="{actived:v.status}" @click="showSecondSub(index,i)">
                            <!-- <i class="iconfont" :class="[v.icon]"></i> -->
                            <a>{{v.name}}</a>
                            <i class=" el-icon-caret-top showSub" :class="{animate:v.subShow}"></i>
                        </div>
                    </template>
                    <template v-else>
                        <div class="secondItem" :class="{actived:v.status}" @click="showSecondNoSun(index,i)">
                            <!-- <i class="iconfont" :class="[v.icon]"></i> -->
                            <span>{{v.name}}</span>
                        </div>
                    </template>
                    <div class="threeToggle" v-if="v.children&&v.subShow">
                        <template v-if="v.children.length>0">
                            <div class="threeItem" :class="{actived:value.status}" @click="select(index,i,idx)" v-for="(value,idx) in v.children" :key="idx" >
                                <!-- <i class="iconfont" :class="[value.icon]"></i> -->
                                <a>{{value.name}}</a>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name:'MenuComponent',
        props: ['menu'],
        data() {
            return {
                menuList: [],
                timer: null
            };
        },
        methods: {
            showTopSub(index) {
                let that = this;
                this.menuList[index].subShow = !this.menuList[index].subShow;
                this.resetMenuList(index);
                this.menuList[index].status = true;
                this.menuList[index].children[0].status = true;
                if (this.menuList[index].children[0].children && this.menuList[index].children[0].children.length > 0) {
                    this.menuList[index].children[0].subShow = true;
                    this.menuList[index].children[0].children[0].status = true;
                }
                let temp_path = this.menuList[index].children[0].children ? this.menuList[index].children[0].children[0].path : this.menuList[index].children[0].path;
                this.$router.push({
                    path: '' + temp_path
                });

                this.$emit('activeBack', that.menuList);
            },
            showSecondSub(index, i) {
                let that = this;
                this.menuList[index].children[i].subShow = !this.menuList[index].children[i].subShow;
                this.resetMenuList(index);
                this.menuList[index].status = true;
                this.menuList[index].children[i].status = true;
                this.menuList[index].children[i].subShow = true;
                this.menuList[index].children[i].children[0].status = true;
                let temp_path = this.menuList[index].children[i].children ? this.menuList[index].children[i].children[0].path : this.menuList[index].children[i].path;
                this.$router.push({
                    path: '' + temp_path
                });
                this.$emit('activeBack', that.menuList);
            },
            select(index, i, idx) {
                let that = this;
                this.resetMenuList(index);
                this.menuList[index].status = true;
                this.menuList[index].children[i].status = true;
                this.menuList[index].children[i].subShow = true;
                this.menuList[index].children[i].children[idx].status = true;
                let temp_path = this.menuList[index].children[i].children[idx].path;
                this.$router.push({
                    path: '' + temp_path
                });
                this.$emit('activeBack', that.menuList);

            },
            resetMenuList(p) {
                let temp_list = JSON.parse(JSON.stringify(this.menuList));

                function resetSun(list) {
                    let temp_list = list;
                    for (let k = 0; k < temp_list.length; k++) {
                        temp_list[k].status = false;
                    }
                    return temp_list;
                }
                for (let i = 0; i < temp_list.length; i++) {
                    temp_list[i].status = false;
                    temp_list[i].subShow = false;
                    if (temp_list[i].children && temp_list[i].children.length > 0) {
                        for (let j = 0; j < temp_list[i].children.length; j++) {
                            temp_list[i].children[j].status = false;
                            temp_list[i].children[j].subShow = false;
                            if (temp_list[i].children[j].children && temp_list[i].children[j].children.length) {
                                temp_list[i].children[j].children = resetSun(temp_list[i].children[j].children);
                            }
                        }
                    }
                }
                temp_list[p].subShow = true;
                this.menuList = temp_list;

            },
            showTopNoSun(index) {
                let that = this;
                this.resetMenuList(index);
                this.menuList[index].status = true;
                this.$router.push({
                    path: '' + that.menuList[index].path
                });
                // this.$store.commit('addMenu',that.menuList);
                this.$emit('activeBack', that.menuList);

            },
            showSecondNoSun(index, i) {
                let that = this;
                this.resetMenuList(index);
                this.menuList[index].status = true;
                this.menuList[index].children[i].status = true;

                this.$router.push({
                    path: '' + that.menuList[index].children[i].path
                });
                // this.$store.commit('addMenu',that.menuList);
                this.$emit('activeBack', that.menuList);
            }
        },
        watch: {
            menu: {
                handler(curVal, oldVal) {
                    this.menuList = JSON.parse(JSON.stringify(curVal));
                },
                deep: true
            }
        },
        created() {
            let that = this;
            let countNum = that.$store.getters.get_initRouteCount;

            if (that.menu.length>0) {
                countNum = countNum + 1;
                this.$store.commit('set_initRouteCount', countNum);
                that.menuList = JSON.parse(JSON.stringify(that.menu));
                let temp_path = that.menu && that.menuList[0].children &&(that.menuList[0].children).length>0? (that.menuList[0].children[0].children && that.menuListp[0].children[0].children.length ? that.menuList[0].children[0].children[0].path : that.menuList[0].children[0].path) : that.menuList[0].path;
                if (countNum === 1) {
                    that.$router.push({
                        path: '' + temp_path
                    });
                }
            }else{
                if (countNum === 1) {
                    that.$router.push({
                        path: '/pipe/noData'
                    });
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    #menu {
        width: 100%;
        height: 100%;
        overflow-y: auto;

        // border: 1px solid rgb(238, 238, 238);
        .menuItem {
            line-height: 40px;
            text-align: left;
            font-size: 14px;
            font-weight: 600;
            color: #123d4d;

            i {
                display: inline-block;
                margin-right: 10px;
                color: #123d4d;
                font-size: 14px;
            }

            .firstLevel {
                padding-left: 15px;
                line-height: 40px;
                position: relative;
                background: #cfe4f5;
                cursor: pointer;
                font-size: 16px;

                i {
                    font-size: 16px;
                }

                i.showSub {
                    width: 16px;
                    position: absolute;
                    right: 20px;
                    top: 12px;
                    transition: all .5s linear;
                    transform: rotate(180deg);

                    &.animate {
                        transform: rotate(0deg);
                    }
                }

                border-bottom: 1px solid #fff;

                &.actived {
                    color: #fff;
                    background: #5a9fd6;

                    i {
                        color: #fff;
                    }
                }
            }

            .firstItem {
                font-size: 16px;
                padding-left: 15px;
                line-height: 40px;
                position: relative;
                background: #cfe4f5;
                border-bottom: 1px solid #fff;
                cursor: pointer;

                &.actived {
                    background: -ms-linear-gradient(left, #127cd0, #1bcbf1);
                    /* IE 10 */
                    background: -moz-linear-gradient(left, #127cd0, #1bcbf1);
                    /*火狐*/
                    background: -webkit-gradient(linear, from(#127cd0), to(#1bcbf1));
                    /* Safari 4-5, Chrome 1-9*/
                    background: -webkit-linear-gradient(left, #127cd0, #1bcbf1);
                    /*Safari5.1 Chrome 10+*/
                    background: -o-linear-gradient(left, #127cd0, #1bcbf1);
                    /*Opera 11.10+*/
                    background: linear-gradient(to right, #127cd0, #1bcbf1);
                    /* Standard syntax; must be last */
                    // background: linear-gradient(left, #127cd0, #1bcbf1);
                    color: #fff;

                    i {
                        color: #fff;
                    }
                }
            }

            .secondLevel {
                width: 100%;

                .secondToggole {
                    width: 100%;
                    position: relative;
                    cursor: pointer;
                    padding-left: 30px;
                    color: #88898b;
                    border-bottom: 1px solid #fff;

                    i.showSub {
                        width: 16px;
                        position: absolute;
                        right: 20px;
                        top: 12px;
                        transition: all .5s linear;
                        transform: rotate(180deg);

                        &.animate {
                            transform: rotate(0deg);
                        }
                    }

                    &.actived {
                        // color: #fff;
                        color: #333;
                        font-weight: 600;
                        background: -ms-linear-gradient(left, #baebfa, #fff);
                        /* IE 10 */
                        background: -moz-linear-gradient(left, #baebfa, #fff);
                        /*火狐*/
                        background: -webkit-gradient(linear, from(#baebfa), to(#fff));
                        /* Safari 4-5, Chrome 1-9*/
                        background: -webkit-linear-gradient(left, #baebfa, #fff);
                        /*Safari5.1 Chrome 10+*/
                        background: -o-linear-gradient(left, #baebfa, #fff);
                        /*Opera 11.10+*/
                        background: linear-gradient(to right, #baebfa, #fff);
                        /* Standard syntax; must be last */
                        // background: linear-gradient(left, #baebfa, #fff);
                        // i{
                        //     color: #fff;
                        // }
                    }
                }

                .secondItem {
                    background: #fff;
                    padding-left: 30px;
                    color: #88898b;
                    border-bottom: 1px solid #fff;

                    &.actived {
                        background: -ms-linear-gradient(left, #127cd0, #1bcbf1);
                        /* IE 10 */
                        background: -moz-linear-gradient(left, #127cd0, #1bcbf1);
                        /*火狐*/
                        background: -webkit-gradient(linear, from(#127cd0), to(#1bcbf1));
                        /* Safari 4-5, Chrome 1-9*/
                        background: -webkit-linear-gradient(left, #127cd0, #1bcbf1);
                        /*Safari5.1 Chrome 10+*/
                        background: -o-linear-gradient(left, #127cd0, #1bcbf1);
                        /*Opera 11.10+*/
                        background: linear-gradient(to right, #127cd0, #1bcbf1);
                        /* Standard syntax; must be last */
                        // background: linear-gradient(left, #127cd0, #1bcbf1);
                        color: #fff;

                        i {
                            color: #fff;
                        }
                    }
                }
            }

            .secondItem {
                padding-left: 45px;
                line-height: 40px;
                position: relative;
                cursor: pointer;

                &.actived {
                    background: -ms-linear-gradient(left, #127cd0, #1bcbf1);
                    /* IE 10 */
                    background: -moz-linear-gradient(left, #127cd0, #1bcbf1);
                    /*火狐*/
                    background: -webkit-gradient(linear, from(#127cd0), to(#1bcbf1));
                    /* Safari 4-5, Chrome 1-9*/
                    background: -webkit-linear-gradient(left, #127cd0, #1bcbf1);
                    /*Safari5.1 Chrome 10+*/
                    background: -o-linear-gradient(left, #127cd0, #1bcbf1);
                    /*Opera 11.10+*/
                    background: linear-gradient(to right, #127cd0, #1bcbf1);
                    /* Standard syntax; must be last */
                    // background: linear-gradient(left, #127cd0, #1bcbf1);
                    color: #fff;
                }
            }

            .threeItem {
                border-bottom: 1px solid #ccc;
                padding-left: 45px;
                width: 100%;
                color: #88898b;
                cursor: pointer;
                background: #fff;

                &.actived {
                    color: #fff;
                    background: -ms-linear-gradient(left, #127cd0, #1bcbf1);
                    /* IE 10 */
                    background: -moz-linear-gradient(left, #127cd0, #1bcbf1);
                    /*火狐*/
                    background: -webkit-gradient(linear, from(#127cd0), to(#1bcbf1));
                    /* Safari 4-5, Chrome 1-9*/
                    background: -webkit-linear-gradient(left, #127cd0, #1bcbf1);
                    /*Safari5.1 Chrome 10+*/
                    background: -o-linear-gradient(left, #127cd0, #1bcbf1);
                    /*Opera 11.10+*/
                    background: linear-gradient(to right, #127cd0, #1bcbf1);

                    /* Standard syntax; must be last */
                    // background: linear-gradient(left, #127cd0, #1bc8f0);
                    i {
                        color: #fff;
                    }
                }
            }
        }
    }
</style>
