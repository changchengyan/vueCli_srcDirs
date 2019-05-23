import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

//全局vuex
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

//局部vuex
import pipeNet_msg_store from '@/store/modules/pipeNet_msg'
import repair_store from '@/store/modules/repair'
import monitor_store from '@/store/modules/monitor'


Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        pipeNet_msg_store,
        repair_store,
        monitor_store
    },
    actions,
    mutations,
    getters,
    state,
    strict: process.env.NODE_ENV !== 'production',
    plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : []
})