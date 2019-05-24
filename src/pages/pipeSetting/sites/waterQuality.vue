<template>
    <div id="waterQuality" class="sites">
        <div class="wrap-card">
            <div class="search-wrap">
                <div class="col">
                    <el-input placeholder="请输入名称" clearable prefix-icon="el-icon-search" v-model="all.search">
                    </el-input>
                    <el-button @click="search" type="primary" @keyup.enter="search">搜索</el-button>
                </div>
                <div class="col">
                    <el-button  :class="{ifAdd:addFlag===false}"  @click="gotoAddModel('1')" type="primary"><i class="el-icon-plus"></i>新增</el-button>
                </div>
            </div>
            <div class="tableItem">
                <div class="table-head">
                    <div class="col sm">
                        <span>编号</span>
                    </div>
                    <div class="col">
                        <span>测点名称</span>
                    </div>
                    <div class="col sm">
                        <span>测点项类型</span>
                    </div>
                    <div class="col">
                        <span>仪表编号</span>
                    </div>
                    <div class="col">
                        <span>测点经度</span>
                    </div>
                    <div class="col">
                        <span>测点纬度</span>
                    </div>
                    <div class="col sm">
                        <span>状态</span>
                    </div>
                    <div class="col">
                        <span>数据标识</span>
                    </div>
                    <div class="col md">
                        <span>配置时间</span>
                    </div>
                    <div class="col md">
                        <span>操作</span>
                    </div>
                </div>
                <div class="subContent">
                    <div class="table-content" v-for="(item,index) in all.list" :key="index">
                        <div class="col sm">
                            <span>{{ (all.currentPage-1)*10+(index+1)}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.MONITORNAME}}</span>
                        </div>
                        <div class="col sm">
                            <span>{{item.MONITORTYPE|formateType}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.DEVICECODE}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.LGTD}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.LTTD}}</span>
                        </div>
                        <div class="col sm">
                            <span>{{item.SUBISVALID|formateStatus}}</span>
                        </div>
                        <div class="col">
                            <span>{{item.DATACODE}}</span>
                        </div>
                        <div class="col md">
                            <span>{{item.CREATETIME}}</span>
                        </div>
                        <div class="col md">
                            <span  :class="{ifEdit:editFlag===false}" @click="gotoDetail(item)">编辑</span>
                            <span  :class="{ifDel:delFlag===false}"  @click="delate(item.MONITORID,index)">删除</span>
                        </div>
                    </div>
                </div>
                <div class="pagenation">
                    <el-pagination background  :current-page="currentPage" layout="total, prev, pager, next" :total="all.totalPage" @current-change="handleCurrent" @prev-click="handlePrev" @next-click="handleNext">
                    </el-pagination>
                </div>
            </div>
        </div>

        <save-status :showModel="ifShowModel" :content="fetchContent" :delNum="del_id" @delThis="closeModel" :type="modelType" :flag="status" @sureDelThis="configDel" />
    </div>
</template>

<script>
    import {deleteMonitor, getPipeMonitorPoint} from '../../../api/interfaces/pipeSetting_api';
    import {sitesAction} from '../../../mixins/pipeSetting_sites_mixin';
    import SaveStatus from '../../../common/components/toast/saveStatus';

    export default {
        name: 'waterQuality',
        components: {SaveStatus},
        props:['siteId'],
        mixins:[sitesAction],
        methods:{
            getPipeMonitorPoint_(page, name, type) {
                let that = this;
                getPipeMonitorPoint({
                    page: '' + page,
                    pageSize: '10',
                    name: '' + name,
                    type: '' + type
                }).then(res => {
                    if (res.msg == 'no user') {
                        window.location.href = `${window.DSE.base_api_url}/jump.jsp?jumpUrl=${window.DSE.baseURL}?id=${window.id}`;
                        return;
                    }
                    if (res.msg == '操作失败') {
                        that.$message.error('服务错误!');
                        return;
                    }
                    if (res.status == 1) {
                        let {
                            data
                        } = res;
                        if (type == '') {
                            that.all.list = data.rows || [];
                            that.all.totalPage = data.total;
                        } else if (type == '1') {
                            that.qulity.list = data.rows || [];
                            that.qulity.totalPage = data.total;
                        } else if (type == '2') {
                            that.press.list = data.rows || [];
                            that.press.totalPage = data.total;
                        } else {
                            that.flow.list = data.rows || [];
                            that.flow.totalPage = data.total;
                        }

                    }
                });
            },
            deleteMonitor_(id, index, type) {
                let that = this;
                deleteMonitor({
                    id: '' + id
                }).then(res => {
                    if (res.status == 1) {
                        that.ifShowModel = false;
                        switch (type) {
                            case '':
                                that.all.list.splice(index, 1);
                                break;
                            case '1':
                                that.qulity.list.splice(index, 1);
                                break;
                            case '2':
                                that.press.list.splice(index, 1);
                                break;
                            case '3':
                                that.flow.list.splice(index, 1);
                                break;
                        }
                    }
                });
            },
        },
        created() {
            // let temp_id = this.siteId;
        }
    };
</script>

<style scoped lang="scss">
#waterQuality{
    width: 100%;
    height: 100%;
}
</style>