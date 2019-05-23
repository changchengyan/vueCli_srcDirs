<template>
<div id="router">
    <el-container>
        <el-aside :style="{backgroundColor:'#cfe5f5',width:wd}" v-if='showAside'>
            <el-row class="tac">
                <el-col :span="24">
                    <menus :menu="MenuData" @activeBack="asyncMenuList"></menus>
                </el-col>
            </el-row>
        </el-aside>
        <el-main class="child-view" :style="{width:content_wd,left:asideLeft}">
            <router-view @thisTab="changeTabs" @hiddenAside="hidden_aside" @showAside="show_aside"  ></router-view>
        </el-main>
    </el-container>
</div>
</template>

<script>
import menus from '@/common/components/menu'
export default {
    components: {
        menus
    },
    data() {
        return {
            transitionName: "slide-left",
            tabIndex: "1",
            wd: "",
            content_wd: "",
            showAside: true,
            small: false,
            asideLeft: "",
            MenuData: [],
        };
    },
    methods: {
        handSelect(event) {
            this.tabIndex = event;
        },
        changeTabs(num) {
            this.tabIndex = num;
        },
        hidden_aside() {
            this.showAside = this.$store.state.pipeNet_msg_store.asideStatus;
            this.content_wd = "calc(100%)";
            this.asideLeft = "0px";
        },
        show_aside() {
            this.showAside = this.$store.state.pipeNet_msg_store.asideStatus;
            if (this.small) {
                this.content_wd = "calc(100% - 200px)";
                this.asideLeft = "200px";
            } else {
                this.content_wd = "calc(100%  - 260px)";
                this.asideLeft = "260px";
            }
        },
        asyncMenuList(arr){
            this.MenuData = JSON.parse(JSON.stringify(arr))
        }

    },
    created() {
        let sys_width = document.body.clientWidth;
        if (sys_width < 1600) {
            this.wd = "200px";
            this.small = true;
            this.asideLeft = "200px";
            this.content_wd = "calc(100%  - 200px)";
        } else {
            this.small = false;
            this.wd = "260px";
            this.content_wd = "calc(100% - 260px)";
            this.asideLeft = "260px";
        }
        if (ifHiddenSideMenu == '1') {
            this.showAside = false;
            this.content_wd = "100%"
            this.asideLeft = '0'
        }
        sessionStorage.setItem("initRoute", 0);
        // this.setSession();
        // this.getRouters();
        // this.getFilePathUrl_();
        this.MenuData = this.$store.getters.get_menuList
    }
};
</script>

<style lang="scss" scoped>
#router {
    width: 100%;
    height: 100%;
    aside {
        height: 100%;
        overflow-y: auto;
        font-weight: 600;
        border-right: none;
        background-color: rgb(207, 229, 245);
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.3);
        li {
            border-right: none;
            border-left: none;
            &:hover {
                background-image: linear-gradient(to right, #127cd1, #1edff9);
                color: #fff !important;
                i {
                    color: #fff !important;
                }
            }
        }
    }
    .child-view {
        position: absolute;
        left: 260px;
        top: 0;
        height: 100%;
    }
}
</style>
