export default {
    state: {
        siteTabs_activedIndex:0, //默认的页签切换
    },
    mutations: {
        set_siteTabs_activedIndex(state,val){
            state.siteTabs_activedIndex = val;
        }
    },
    actions: {

    },
    getters: {
        get_siteTabs_activedIndex(state){
            return state.siteTabs_activedIndex ;
        }
    }
};