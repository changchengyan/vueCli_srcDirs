export default {
    state: {
        headTabList:[{name:'管网信息',flag:true},{name:'工程信息',flag:false},{name:'巡检抢修',flag:false},{name:'设备运行',flag:false},{name:'监测信息',flag:false},{name:'分区计量',flag:false},{name:'管网模拟',flag:false}],
        sunTab_pipe: [{name:'管网',flag:true},{name:'阀门',flag:false},{name:'检修井',flag:false},{name:'消防栓',flag:false}],
        sunTab_project: [{name:'概览',flag:false},{name:'水库',flag:false},{name:'水厂',flag:false},{name:'大用水户',flag:false},{name:'泵站',flag:false},{name:'计量间',flag:false}],
        sunTab_monitor: [{name:'实时信息',flag:false},{name:'检修信息',flag:false},{name:'关阀历史信息',flag:false}], //巡检抢修 '人员定位'
        sunTab_devs: [''],// 设备运行  '设备运行'
        sunTab_msg: [{name:'流量',flag:false},{name:'压力',flag:false},{name:'水质',flag:false},{name:'视频',flag:false}], //监测信息 '监测信息'
        sunTab_zone: [''], //分区计量  '分区计量'
        sunTab_simulate: [''], //管网模拟，'管网模拟'
        treeSelectedList:[11], //树 被选择的列表  ,21,31,4,5,6,7
        videoPannelIndex:0 , //播放视频的索引

    },
    mutations: {
        set_headTabList(state,val){
            state.headTabList = val;
        },
        set_sunTab_pipe(state,val){
            state.sunTab_pipe = val;
        },
        set_sunTab_project(state,val){
            state.sunTab_project = val;
        },
        set_sunTab_monitor(state,val){
            state.sunTab_monitor = val;
        },
        set_sunTab_devs(state,val){
            state.sunTab_devs = val;
        },
        set_sunTab_msg(state,val){
            state.sunTab_msg = val;
        },
        set_sunTab_zone(state,val){
            state.sunTab_zone = val;
        },
        set_sunTab_simulate(state,val){
            state.sunTab_simulate = val;
        },
        set_treeSelectedList(state,val){
            state.treeSelectedList = val;
        },
        set_videoPannelIndex(state,val){
            state.videoPannelIndex = val;
        }
    },
    actions: {

    },
    getters: {
        get_headTabList(state) {
            return state.headTabList;
        },
        get_sunTab_pipe(state) {
            return state.sunTab_pipe;
        },
        get_sunTab_project(state) {
            return state.sunTab_project;
        },
        get_sunTab_monitor(state) {
            return state.sunTab_monitor;
        },
        get_sunTab_devs(state) {
            return state.sunTab_devs;
        },
        get_sunTab_msg(state) {
            return state.sunTab_msg;
        },
        get_sunTab_zone(state) {
            return state.sunTab_zone;
        },
        get_sunTab_simulate(state) {
            return state.sunTab_simulate;
        },
        get_treeSelectedList(state){
            return state.treeSelectedList;
        },
        get_videoPannelIndex(state){
            return state.videoPannelIndex ;
        }
    }
};