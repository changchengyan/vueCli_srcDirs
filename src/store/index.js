import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';


//局部vuex
import pipeMonitor_store from '@/store/modules/pipeMonitor';
import pipeRecord_store from '@/store/modules/pipeRecord';
import pipeSetting_store from '@/store/modules/pipeSetting';
import pipeStatistic_store from '@/store/modules/pipeStatistic';
import root_store from '@/store/modules/root';
import home_store from '@/store/modules/home';


Vue.use(Vuex);

export default new Vuex.Store({

    modules: {
        home_store,
        pipeMonitor_store,
        pipeRecord_store,
        pipeSetting_store,
        pipeStatistic_store,
        root_store
    },
    strict: false,//此值不能设置为true，否则gis框架中vuex相关代码会出现循环调用
    // strict: process.env.NODE_ENV !== 'production'
    plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : []
});
