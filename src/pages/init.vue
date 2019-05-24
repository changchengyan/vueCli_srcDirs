<template>
    <div id="init">
        <div class="stage">
            <div class="dot-pulse"></div>
        </div>
        <div class="tips">数据加载中...</div>
    </div>
</template>

<script>

    import {mapMutations} from 'vuex';

    import {
        getSessionUser,
        getFilePathUrl,
        getOrgTree,
        getResourceByIdAndUser
    } from '@/api/interfaces/common_api';

    export default {
        name: 'init',
        data() {
            return {};
        },
        methods: {
            ...mapMutations({
                'set_menuList': 'set_menuList',
                'set_companyName': 'set_companyName',
                'set_companyId': 'set_companyId',
                'set_userName': 'set_userName',
                'set_deptName': 'set_deptName',
                'set_deptId': 'set_deptId',
                'set_tel': 'set_tel',
                'set_btnsIds': 'set_btnsIds',
                'set_cityPosition': 'set_cityPosition',
                'set_orgTree': 'set_orgTree',
                'set_filePath':'set_filePath'
            }),
            btns_allowed(arr) {
                let temp_json = {
                    information: {
                        add: true
                    },
                    hiddenDanger: {
                        add: true,
                        checked: true,
                        repair: true
                    },
                    repair: {
                        add: true,
                        dispatch: true //派单
                    }
                };
                let local_json = window.DSE.allowBtns.rushrepair;
                let temp_arr = JSON.parse(JSON.stringify(arr));
                for (let i = 0; i < temp_arr.length; i++) {
                    if (temp_arr[i] === local_json.information.add) {
                        temp_json.information.add = false;
                    } else if (temp_arr[i] === local_json.hiddenDanger.add) {
                        temp_json.hiddenDanger.add = false;
                    } else if (temp_arr[i] === local_json.hiddenDanger.checked) {
                        temp_json.hiddenDanger.checked = false;
                    } else if (temp_arr[i] === local_json.hiddenDanger.repair) {
                        temp_json.hiddenDanger.repair = false;
                    } else if (temp_arr[i] === local_json.repair.add) {
                        temp_json.repair.add = false;
                    } else if (temp_arr[i] === local_json.repair.dispatch) {
                        temp_json.repair.dispatch = false;
                    }
                }
                return temp_json;
            },
            setSession() {
                let that = this;
                getSessionUser(that).then(res => {

                    let temp_session = JSON.stringify(res);
                    sessionStorage.setItem('user', temp_session);

                    that.set_companyId(res.organizationIds?res.organizationIds[0]:'');
                    that.set_companyName(res.organizationName);
                    that.set_userName(res.name);
                    that.set_deptName(res.departmentName);
                    that.set_deptId(res.mainDepartmentIds?res.mainDepartmentIds[0]:'');
                    that.set_tel(res.mobile);
                    that.set_btnsIds(res.resourceIds);

                    let temp_arr = res.positions&&res.positions[0] ? res.positions[0].split(',') : [];
                    if (temp_arr.length > 0) {
                        temp_arr[0] = parseFloat(temp_arr[0]);
                        temp_arr[1] = parseFloat(temp_arr[1]);
                    } else {
                        temp_arr = [106.290351, 36.001819];
                    }
                    that.set_cityPosition(temp_arr);
                    if(res.organizationIds&&res.organizationIds[0]){
                        that.getOrgTree_(res.organizationIds[0]);
                    }
                });
            },
            getRouters() {
                let that = this;
                getResourceByIdAndUser({
                    id: '' + window.id,
                    flag: '',
                    pid: ''
                },that).then(res => {

                    let temp_data = res && res.length ? res : [];
                    let routes = [];
                    if (res && res.length) {
                        for (let i = 0; i < temp_data.length; i++) {
                            routes.push({
                                path: temp_data[i].url,
                                name: temp_data[i].name,
                                icon: temp_data[i].img,
                                status: false
                            });
                        }
                        routes[0].status = true;
                    }
                    sessionStorage.setItem('routelist', routes);
                    that.set_menuList(routes);

                });
            },
            getFilePathUrl_() {
                let that = this;
                getFilePathUrl().then(res => {
                    let {data} = res;
                    that.set_filePath(data.filePathUrl);

                });
            },
            getOrgTree_(id) {
                let that = this;
                getOrgTree({
                    companyId: '' + id
                },that).then(res => {
                    that.set_orgTree([res.data]);
                });
            }
        },
        mounted() {
            let that = this;
            setTimeout(() => {
                that.$router.push({
                    path: '/mainContent'
                });
            }, 1000 * 1.5);
        },
        created() {
            this.setSession();
            this.getRouters();
            this.getFilePathUrl_();
        }
    };
</script>

<style scoped lang="scss">
    @keyframes dotPulse {
        0% {
            box-shadow: 9964px 0 0 -10px #0b83ff, 9999px 0 0 0 #0b83ff, 10044px 0 0 2px #0b83ff
        }

        25% {
            box-shadow: 9964px 0 0 0 #0b83ff, 9999px 0 0 2px #0b83ff, 10044px 0 0 0 #0b83ff
        }

        50% {
            box-shadow: 9964px 0 0 2px #0b83ff, 9999px 0 0 0 #0b83ff, 10044px 0 0 -10px #0b83ff
        }

        75% {
            box-shadow: 9964px 0 0 0 #0b83ff, 9999px 0 0 -10px #0b83ff, 10044px 0 0 0 #0b83ff
        }

        100% {
            box-shadow: 9964px 0 0 -10px #0b83ff, 9999px 0 0 0 #0b83ff, 10044px 0 0 2px #0b83ff
        }
    }

    #init {
        width: 100%;
        height: 100%;
        position: relative;

        .stage {
            width: 200px;
            height: 100px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -50px;
            margin-left: -100px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;

            .dot-pulse {
                position: relative;
                left: -9999px;
                width: 20px;
                height: 20px;
                border-radius: 10px;
                background-color: #0b83ff;
                color: #0b83ff;
                box-shadow: 9964px 0 0 0 #0b83ff, 9999px 0 0 0 #0b83ff, 10044px 0 0 0 #0b83ff;
                animation: dotPulse 1.5s infinite linear;
            }
        }

        .tips {
            width: 100px;
            height: 20px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: 30px;
            margin-left: -40px;
        }

    }
</style>