<template>
    <div id="mainWidthMenu">
        <el-container>
            <el-aside :style="{backgroundColor:'#cfe5f5',width:wd}" v-if='showAside'>
                <el-row class="tac">
                    <el-col :span="24">
                        <menu-component :menu="MenuData" @activeBack="asyncMenuList" />
                    </el-col>
                </el-row>
            </el-aside>
            <el-main class="child-view" :style="{width:content_wd,left:asideLeft}">
                <transition :name="transitionName">
                    <router-view @thisTab="changeTabs" @hiddenAside="hidden_aside" @showAside="show_aside" ></router-view>
                </transition>
            </el-main>
        </el-container>
    </div>
</template>

<script>

    import MenuComponent from '../common/components/menu';

    import {mapGetters} from 'vuex';
    export default {
        name: 'mainWidthMenu',
        components: {MenuComponent},
        comments:{
            MenuComponent
        },
        data(){
            return{
                transitionName:'slide-left',
                activePage: 1,
                wd: '',
                content_wd: '',
                main_left: '260px',
                showAside: true,
                small: false,
                asideLeft: '',
                MenuData: []
            };
        },
        computed: {
            ...mapGetters({
                menuList:'get_menuList',
                asideStatus:'get_asideStatus'
            })
        },
        methods:{
            changeTabs(num) {
                this.MenuData = this.menuList;
            },
            hidden_aside() {

                this.showAside = this.asideStatus;
                this.content_wd = 'calc(100%)';
                this.asideLeft = '0px';
            },
            show_aside() {
                this.showAside = this.asideStatus;
                if (this.small) {
                    this.content_wd = 'calc(100% - 200px)';
                    this.asideLeft = '200px';
                } else {
                    this.content_wd = 'calc(100%  - 260px)';
                    this.asideLeft = '260px';
                }
            },
            asyncMenuList(arr){
                this.MenuData = JSON.parse(JSON.stringify(arr));
            }
        },
        created() {
            // this.$navigation.on('forward', (to, from) => {
            //     this.transitionName = 'slide-left'
            // })
            // this.$navigation.on('back', (to, from) => {
            //     this.transitionName = 'slide-right'
            // })
            let sys_width = document.body.clientWidth;
            if (sys_width < 1600) {
                this.wd = '200px';
                this.small = true;
                this.asideLeft = '200px';
                this.content_wd = 'calc(100%  - 200px)';
            } else {
                this.small = false;
                this.wd = '260px';
                this.content_wd = 'calc(100% - 260px)';
                this.asideLeft = '260px';
            }

            this.MenuData = this.menuList;
        },
        watch: {
            '$route' (to, from) {
                const toIndex = to.meta.index;
                const fromIndex = from.meta.index;

                this.transitionName = toIndex < fromIndex ? 'slide-right' : 'slide-left';
            }
        }
    };
</script>

<style scoped lang="scss">
    #mainWidthMenu {
        width: 100%;
        height: 100%;
        min-width: 1024px;
        // min-height: 768px;

        transition: all 0.3s;


        .slide-right-enter-active,
        .slide-right-leave-active,
        .slide-left-enter-active,
        .slide-left-leave-active {
            will-change: transform;
            transition: all 500ms;
            position: absolute;
        }

        .slide-right-enter {
            opacity: 0;
            transform: translate3d(-100%, 0, 0);
        }

        .slide-right-leave-active {
            opacity: 0;
            transform: translate3d(100%, 0, 0);
        }

        .slide-left-enter {
            opacity: 0;
            transform: translate3d(100%, 0, 0);
        }

        .slide-left-leave-active {
            opacity: 0;
            transform: translate3d(-100%, 0, 0);
        }

        .el-container{
            width: 100%;
            height: 100%;
        }
        aside {
            height: 100%;
            overflow-y: auto;
            font-weight: 600;
            border-right: none;
            box-shadow: 0 10px 10px rgba(0, 0, 0, 0.3);

            li {
                border-right: none;
                border-left: none;

                i {
                    color: #878687;
                    display: inline-block;
                    margin-right: 10px;
                }

                &:hover {
                    background-image: linear-gradient(to right, #1edff9, #127cd1);
                    color: #fff !important;

                    i {
                        color: #fff !important;
                    }
                }

                &.is-active {
                    i {
                        color: #fff;
                    }
                }
            }
        }

        .child-view {
            // width: calc(100% - 260px);
            position: absolute;
            top: 0;
            height: 100%;
            overflow: hidden;
        }
    }

</style>
