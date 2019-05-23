export default {
    state: {
        activedTab:0, // 右侧表格上的tab切换复位
        topActivedTab:0, // 上部表格的tab切换
        danger:[], //工单的紧急程度
        problem_type:[], //工单的问题类型
        orderStatus:[], //工单的派单状态
    },
    mutations: {
        setTab(state, index) {
            state.activedTab = index;
        },
        setToptab(state,index){
            state.topActivedTab = index;
        },
        set_danger(state,val){
            state.danger = val
        },
        set_problem_type(state,val){
            state.problem_type = val
        },
        set_orderStatus(state,val){
            state.set_orderStatus = val
        }
    },
    actions: {
    },
    getters: {
        getActived(state){
            return state.activedTab
        },
        getTopActivedTab(state){
            return state.topActivedTab;
        },
        get_danger(state){
            return  state.danger
        },
        get_problem_type(state){
            return state.problem_type
        },
        get_orderStatus(state){
            return  state.orderStatus
        }
    }
}