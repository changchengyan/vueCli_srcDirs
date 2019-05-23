<template>
<div id="edit">
    <tab-card :tabs_='tabs' @activedIndex="showThisContent" :activedIndex="tabActived_index">
        <template v-if="tabActived_index==0">
            <div class="addNews" :class="{ifAdd:addflag===false}">
                <span @click="addNews_"> <i class="el-icon-plus"></i> 新增</span>
            </div>
            <div class="news">
                <div class="listItem headTop">
                    <div class="col">
                        <span>标题</span>
                    </div>
                    <!-- <div class="col">
                        <span>内容</span>
                    </div> -->
                    <div class="col">
                        <span>发布时间</span>
                    </div>
                    <div class="col">
                        <span>操作</span>
                    </div>
                </div>
                <div class="innerContent">
                    <div class="listItem" v-for="(item,index) in newsList" :key="index">
                        <div class="col shownewsContent" @click="gotoDetailNews(item)">
                            <span :title="item.TITLE">{{item.TITLE}}</span>
                        </div>
                        <!-- <div class="col">
                            <span  v-html="item.CONTENT"></span>
                        </div> -->
                        <div class="col">
                            <span :title="item.PUBLISH_TIME">{{item.PUBLISH_TIME}}</span>
                        </div>
                        <div class="col actions" >
                            <i class="el-icon-delete" :class="{ifDel:delflag===false}" @click="showDelModel(item.ID,index)"></i>
                            <i class="el-icon-edit" :class="{ifEdit:editflag===false}" @click="edit(item)"></i>
                        </div>
                    </div>
                </div>
                <div class="footer-pages">
                    <el-pagination background layout="total,prev, pager, next" @current-change="handleCurrentChange" @prev-click="handlePrev" @next-click="handleNext" :total="totalPages">
                    </el-pagination>
                </div>
            </div>
        </template>
    </tab-card>
    <save-status :showModel="ifShowModel" :content="fetchContent" :delNum="del_id" @delThis="closeModel" :type="modelType" :flag="status" @sureDelThis="configDel"></save-status>
</div>
</template>

<script>
import saveStatus from "@/common/components/poupe/save_status";

import tabCard from "@/common/components/tabs/r-Tabcard"

import {
    saveOrUpdate,
    getPipeCommmonInfo,
    deleteCommonInfo
} from "@/api/pipeNet_msg/home"

export default {
    components: {
        saveStatus,
        tabCard
    },
    data() {
        return {
            ifShowModel: false,
            fetchContent: "",
            modelType: true,
            status: null,
            del_id: null,
            addflag: true, //新增按钮的权限控制
            delflag: true, //删除按钮的权限控制
            editflag:true,//编辑按钮的权限控制
            inputs: {
                title: "",
                content: ""
            },
            totalPages: 1,
            newsList: [],
            delIndex: null,
            tabs: [{
                name: "通知通告"
            }],
            tabActived_index: 0, //选中的tab
        }
    },
    methods: {

        closeModel(val) {
            this.ifShowModel = val.modelFlag
        },
        save() {
            let postData = this.inputs;
            let that = this;
            this.modelType = true;
            saveOrUpdate(postData).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.status == 1) {
                    that.ifShowModel = true;
                    that.status = true;
                    that.inputs.title = "";
                    that.inputs.content = "";
                    that.activedIndex = 0;
                    that.getPipeCommmonInfo_("1");
                } else {
                    that.ifShowModel = true;
                    that.status = false;
                }
                that.fetchContent = res.msg;
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
            });
        },
        getPipeCommmonInfo_(pages) {
            let that = this;
            let temp_companyID = this.$store.getters.get_companyId;
            getPipeCommmonInfo({
                years: "",
                companyId: "" + temp_companyID,
                page: "" + pages,
                pageSize: "10"
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.data) {
                    let temp_arr = res.data.rows;
                    let newsNum = res.data.total;
                    that.totalPages = parseInt(newsNum) || 1;
                    that.newsList = temp_arr || [];
                }
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
            });
        },
        deleteCommonInfo_(id) {
            let that = this;
            deleteCommonInfo({
                id: "" + id
            }).then(res => {
                if (res.msg == "no user") {
                    window.location.href = `${dse.base_api_url}/jump.jsp?jumpUrl=${dse.baseURL}?id=${id}`
                    return
                }
                if (res.msg == "操作失败") {
                    that.$message.error("服务错误!")
                    return
                }
                if (res.status == 1) {
                    that.ifShowModel = false;
                    that.newsList.splice(that.delIndex, 1);
                }
            }).catch(function (error) {
                // if (error == "Error: Network Error") {
                //     that.$message.error("网络错误")
                //     return;
                // }
                // that.$message.error("逻辑错误!")
            });
        },
        handleCurrentChange(val) {
            this.getPipeCommmonInfo_(val);
        },
        handlePrev(val) {
            this.getPipeCommmonInfo_(val);
        },
        handleNext(val) {
            this.getPipeCommmonInfo_(val);
        },
        configDel(obj) {
            this.deleteCommonInfo_(obj.num);
        },
        showDelModel(id, del_index) {
            let flag = this.delflag
            if(!flag){
                return
            }
            this.del_id = id;
            this.modelType = false;
            this.ifShowModel = true;
            this.delIndex = del_index;
        },
        gotoDetailNews(val) {
            this.$store.commit("set_news", val);
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
            this.$router.push({
                name: "pipeNet_newsItem"
            })
        },
        showThisContent(index) {
            this.tabActived_index = index;
        },
        addNews_() {
             let flag = this.addflag
            if(!flag){
                return
            }
            this.$router.push({
                name: "pipeNet_home_city_editNews"
            })
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
        },
        edit(v){
        	let flag = this.editflag
            if(!flag){
                return
            }
            this.$router.push({
                name: "pipeNet_home_city_editNews",
                query:{
                	id: "" + v.ID,
			        content: "" + v.CONTENT,
			        title: "" + v.TITLE,
			        edit:true
                }
            })
            this.$store.commit("setAside_status", false);
            this.$emit("hiddenAside");
        }
    },
    created() {
        console.log(this.$store.getters.get_pages_btn_allow)
        this.addflag = (this.$store.getters.get_pages_btn_allow).city_EditNotify.add;
        this.delflag = (this.$store.getters.get_pages_btn_allow).city_EditNotify.del;
		this.editflag = (this.$store.getters.get_pages_btn_allow).city_EditNotify.edit;
        this.getPipeCommmonInfo_("1");
    }
}
</script>

<style lang="scss" scoped>
#edit {
    width: 100%;
    height: 100%;
    padding: 20px;

    .addNews {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 20px;

        &.ifAdd {
            display: none;
        }

        span {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 5px;
            background: #0b83ff;
            color: #fff;
            cursor: pointer;
        }
    }

    .news {
        width: 100%;
        height: calc(100% - 70px);

        .listItem {
            width: 100%;
            display: flex;
            justify-content: space-between; // line-height: 40px;
            border-bottom: 1px solid #ccc;

            &.headTop {
                border-top: 1px solid #ccc;
                background: #e3edef;
            }

            .col {
                border-right: 1px solid #ccc;
                text-align: center;

                &:nth-child(1) {
                    width: calc(100% - 220px);
                }

                // &:nth-child(2){
                //     width: calc(100% - 420px);
                // }

                &:nth-child(2) {
                    width: 160px;
                }

                &:nth-child(3) {
                    width: 100px;
                    border-right: none;
                    cursor: pointer;
                }

                span {
                    display: inline-block;
                    width: calc(100%);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    line-height: 40px;
                }

                i {
                    line-height: 40px;
                }
            }
        }

        .innerContent {
            width: 100%;
            height: calc(100% - 70px);
            overflow-y: auto;

            .listItem {
                .shownewsContent {
                    color: #0b83ff;
                    text-decoration: underline;
                    cursor: pointer;
                }

                &:hover {
                    background: rgb(248, 247, 247);
                }

                .actions {
                	display: flex;
                	justify-content: space-around;
                    .ifDel,.ifEdit {
                    		display: none;
                            color: #fff;
                            cursor: not-allowed;
                    }
                }

                &:hover {
                    .actions {
                        i {
                            color: #0b83ff;
                        }
                    }
                }

            }
        }

        .footer-pages {
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

    }
}
</style>
