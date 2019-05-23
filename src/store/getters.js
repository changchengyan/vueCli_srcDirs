export default {
    get_companyId(state) {
        return state.comanyID
    },
    getUserName(state) {
        return state.userName
    },
    getCompyName(state) {
        return state.compyName
    },
    get_initRouteCount(state) {
        return state.firstInit_route
    },
    get_filePath(state) {
        return state.filePath
    },
    get_dept(state) {
        return state.dept
    },
    get_deptId(state) {
        return state.deptID
    },
    get_tel(state) {
        return state.tel;
    },
    get_areaName(state) {
        return state.areaName
    },
    get_orgTree(state) {
        return state.orgTree
    },
    get_cityAreas(state) {
        return state.cityAreas
    },
    get_cityPosition(state){
       return  state.cityPosition 
    },
    get_btnsIds(state){
        return  state.btnsIds
    },
    get_pages_btn_allow(state){
        return state.pages_btn_allow
    },
    get_menuList(state){
        return  state.menuList
    },
    get_pipe_defaultLayer(state){
       return state.pipe_defaultLayer
    },
    get_xfs_defaultLayer(state){
        return state.xfs_defaultLayer
    },
    get_fm_defaultLayer(state){
        return state.fm_defaultLayer
    }
}