export default {
    state: {
        menuList:[
            {
                icon:'el-icon-document',
                name:'首页',
                path:'/home',
                status:true,
                subShow:false,
                children:[]
            },
            {
                icon:'el-icon-document',
                name:'管网巡检',
                status:false,
                subShow:false,
                children:[
                    {
                        icon:'el-icon-document',
                        name:'交接班',
                        path:'/pipeMonitor/changeShifts',
                        status:false
                    },
                    {
                        icon:'el-icon-document',
                        path:'/pipeMonitor/monitorRecord',
                        name:'巡检记录',
                        status:false

                    },
                    {
                        icon:'el-icon-document',
                        path:'/pipeMonitor/dutyRecord',
                        name:'值班记事',
                        status:false
                    }
                ]
            },
            {
                icon:'el-icon-document',
                name:'管网档案',
                status:false,
                subShow:false,
                children:[
                    {
                        icon:'el-icon-document',
                        path:'/pipeRecord/pipeStandingBook',
                        name:'管网台账',
                        status:false
                    },
                    {
                        icon:'el-icon-document',
                        path:'/pipeRecord/devStandingBook',
                        name:'设备台账',
                        status:false
                    }
                ]
            },
            {
                icon:'el-icon-document',
                name:'统计分析',
                status:false,
                subShow:false,
                children:[
                    {
                        icon:'el-icon-document',
                        path:'/pipeStatistic/pipeMsg',
                        name:'管网信息',
                        status:false
                    },
                    {
                        icon:'el-icon-document',
                        path:'/pipeStatistic/monitorMsg',
                        name:'监测信息',
                        status:false
                    },
                    {
                        icon:'el-icon-document',
                        path:'/pipeStatistic/enterpriseTable',
                        name:'企业报表',
                        status:false
                    }
                ]
            },
            {
                icon:'el-icon-document',
                name:'系统配置',
                status:false,
                subShow:false,
                children:[
                    {
                        icon:'el-icon-document',
                        path:'/pipeSetting/siteMonitor',
                        name:'监测站点',
                        status:false
                    },
                    {
                        icon:'el-icon-document',
                        path:'/pipeSetting/zoneConfig',
                        name:'分区配置',
                        status:false
                    },
                    {
                        icon:'el-icon-document',
                        path:'/pipeSetting/projectConfig',
                        name:'工程配置',
                        status:false
                    }
                ]
            }
        ], //菜单列表
        asideStatus:true, //侧边菜单是否关闭 默认不关闭
        initRouteCount:0, // 初始化 路由调用的计数
        companyName:'', //公司名称
        companyId:'', //公司Id
        userName:'', //用户名称
        deptName:'', //部门名称
        deptId:'', //部门ID
        tel:'', //手机号
        btnsIds:[], //按钮级Id 资源
        cityPosition:[], //城市经纬度
        orgTree:[], //组织树
        filePath:'', //静态文件的绝对路径
    },
    mutations: {
        set_menuList(state,val){
            state.menuList = val;
        },
        set_asideStatus(state,val){
             state.asideStatus = val;
        },
        set_companyName(state,val){
             state.companyName = val;
        },
        set_companyId(state,val){
            state.companyId = val;
        },
        set_userName(state,val){
            state.userName = val;
        },
        set_deptName(state,val){
            state.deptName = val;
        },
        set_deptId(state,val){
            state.deptId = val;
        },
        set_tel(state,val){
            state.tel = val;
        },
        set_btnsIds(state,val){
            state.btnsIds = val;
        },
        set_initRouteCount(state,val){
            state.initRouteCount = val;
        },
        set_cityPosition(state,val){
            state.cityPosition = val;
        },
        set_orgTree(state,val){
            state.orgTree = val;
        },
        set_filePath(state,val){
            state.filePath = val;
        }

    },
    actions: {

    },
    getters: {
        get_menuList(state){
            return state.menuList;
        },
        get_asideStatus(state){
            return state.asideStatus;
        },
        get_initRouteCount(state){
            return state.initRouteCount;
        },
        get_companyName(state){
           return  state.companyName;
        },
        get_companyId(state){
            return  state.companyId;
        },
        get_userName(state){
           return  state.userName;
        },
        get_deptName(state){
           return  state.deptName;
        },
        get_deptId(state,val){
           return  state.deptId;
        },
        get_tel(state,val){
           return  state.tel;
        },
        get_btnsIds(state){
           return  state.btnsIds;
        },
        get_cityPosition(state){
           return  state.cityPosition;
        },
        get_orgTree(state){
           return  state.orgTree;
        },
        get_filePath(state,val){
            return state.filePath;
        }
    }
};