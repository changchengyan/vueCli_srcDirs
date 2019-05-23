import actions from './actions-type'
export default {
    [actions.MENUSHOW](state, data) {
        state.menushow = data
    },
    set_comanyID(state,value){
        state.comanyID = value;
    },
    set_userName(state,value){
        state.userName= value;
    },
    set_compyName(state,value){
        state.compyName = value
    },
    set_routeCount(state,value){
        state.firstInit_route = value
    },
    set_filePath(state,value){
        state.filePath = value
    },
    set_dept(state,value){
        state.dept = value;
    },
    set_deptID(state,value){
        state.deptID = value;
    },
    set_tel(state,val){
        state.tel = val;
    },
    set_areaName(state,val){
        state.areaName = val
    },
    set_orgTree(state,val){
        state.orgTree = val
    },
    set_cityAreas(state,val){
        state.cityAreas = val
    },
    set_cityPosition(state,val){
        state.cityPosition = val
    },
    set_btnsIds(state,val){
        state.btnsIds = val
    },
    set_pages_btn_allow(state,val){
        state.pages_btn_allow = val
    },
    set_initRouteCount(state,val){
        state.firstInit_route = val
    },
    set_menuList(state,val){
        state.menuList = val
    },
    set_pipe_defaultLayer(state,val){
       state.pipe_defaultLayer = dse.pipe_default_layer_url+val+"/MapServer/0";
        // state.pipe_defaultLayer = dse.pipe_default_layer_url
    },
    set_xfs_defaultLayer(state,val){
        state.xfs_defaultLayer = dse.xfs_default_layer_url+val+"/MapServer/0"
        // state.xfs_defaultLayer = dse.xfs_default_layer_url

    },
    set_fm_defaultLayer(state,val){
        state.fm_defaultLayer = dse.fm_default_layer_url+val+"/MapServer/0"
        // state.fm_defaultLayer = dse.fm_default_layer_url

    }
}