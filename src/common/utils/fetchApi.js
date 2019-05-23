import axios from 'axios'
import qs from 'qs'
const axiosIns = axios.create({});
if (process.env.NODE_ENV == 'development') {
    axiosIns.defaults.baseURL = 'http://www.whdse.cn:56038/pipe/';
} else if (process.env.NODE_ENV == 'production') {
    axiosIns.defaults.baseURL = 'http://www.whdse.cn:56038/pipe/';
}
//axiosIns.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
//axiosIns.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.responseType = 'json';
// axiosIns.defaults.transformRequest = [function (data) {
//     console.log(data);
//     return qs.stringify(data);
// }];
axiosIns.defaults.validateStatus = function (status) {
    return true;
};
axiosIns.interceptors.request.use(function (config) {
    //配置config
    config.headers.Accept = 'application/json';
    return config;
},
function (error) {
    // 请求失败的处理
    return Promise.reject(error);
});
axiosIns.interceptors.response.use(function (response) {
    //let data = response.data;
    // let status = response.status;
    if(response.status===0){
        top.location.replace("http://www.whdse.cn:56012/znb")
    }else{
        if (response) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    }
    
},
function (error) {
    // 请求失败的处理
    return Promise.reject(error);
});
const ajaxMethod = ['get', 'post'];
const fetchApi = {};
ajaxMethod.forEach((method) => {
    fetchApi[method] = function (uri, data, config={},QS=false) {
        return new Promise(function (resolve, reject) {
            axiosIns[method](uri, data=QS?qs.stringify(data):data,config).then((response) => {
                resolve(response);
            }).catch((response) => {
                reject(response);
            })
        })
    }
});
export default fetchApi;