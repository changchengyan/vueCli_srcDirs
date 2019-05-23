export default {
    state: {
        menu: []
    },
    mutations: {
        setAgree(state, agreeNum) {
            state.newsdetail.agree = agreeNum;
        },
        addMenu(state, data) {
            state.menu = [...data];
            // console.log(state.menu);
        }
    },
    actions: {
        ADD_MENU({ commit }, permission) {
            // if (permission) {
            //     getMenu.then(data => {
            //         commit('addMenu', data);
            //     })
            // } else {
            //     this.$message.error('抱歉,您没有权限进入!!');
            // }

        }
    },
    getters: {

    }
}