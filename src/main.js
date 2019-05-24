/**
 * @description 该文件为框架在开发时使用的主文件，在开发时为了能够预览各个模块的开发效果， 需要在此文件中引入当前模块中引入对应的库
 *
 * 例如： ./components 中的ImageCard.vue 文件使用了 bootstrap-vue这个库，则需要在这里引入才能在开发时看到效果。
 * */
import Vue from 'vue';

import ELEMENT from 'element-ui';
import App from './App';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';

import dse from './config/inner_config';

import router from './router';
import VeeValidate from 'vee-validate';
import zh_CN from 'vee-validate/dist/locale/zh_CN'; //引入中文包，提示信息可以以中文形式显示

import _ from 'lodash';

VeeValidate.Validator.localize(zh_CN);
const config = {
    errorBagName: 'errors',
    fieldsBagName: 'fields',
    delay: 100,
    locale: 'zh_CN',
    strict: true,
    enableAutoClasses: true,
    events: 'blur',
    inject: true
};
Vue.use(VeeValidate, config);

Vue.config.productionTip = false;

Vue.prototype.funTool = _;

Vue.use(ELEMENT);


Vue.prototype.DSE = dse;
window.DSE = dse;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});


