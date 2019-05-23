export default {
    state: {
        menu: [],
        menuIndex: 1,
        asideStatus: true,
        newsItem:{},
        pipe_material:[], // 管网的材料列表
        pipe_radius:[], // 管网的 管径列表
        interface_type:[], //管网的 接口类型
        trans_medium:[], //输送介质
        dev_shebei:[], //设备
        water_type:[], //用水类型
    },
    mutations: {
        setAgree(state, agreeNum) {
            state.newsdetail.agree = agreeNum;
        },
        addMenu(state, data) {
            state.menu = [...data];
        },
        handleThisTabs(state, data) {
            state.menuIndex = data;
        },
        setAside_status(state, flag) {
            state.asideStatus = flag;
        },
        set_news(state,val){
            state.newsItem = val
        },
        set_pipe_material(state,val){
            state.pipe_material = val
        },
        set_pipe_radius(state,val){
            state.pipe_radius = val
        },
        set_interface_type(state,val){
            state.interface_type = val
        },
        set_trans_medium(state,val){
            state.trans_medium = val
        },
        set_dev_shebei(state,val){
            state.dev_shebei = val
        },
        set_water_type(state,val){
            state.water_type = val
        }
    },
    actions: {

    },
    getters: {
        getMenu(state){
            return state.menu;
        },
        get_newsItem(state){
            return state.newsItem;
        },
        get_pipe_material(state){
            return state.pipe_material
        },
        get_pipe_radius(state){
            return state.pipe_radius
        },
        get_interface_type(state){
            return  state.interface_type
        },
        get_trans_medium(state){
            return  state.trans_medium
        },
        get_dev_shebei(state){
            return  state.dev_shebei
        },
        get_water_type(state){
            return  state.water_type
        }
    }
}