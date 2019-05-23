// CommonCtrl/getDictByPCode.do

import axios from 'axios'

axios.defaults.withCredentials = true;

const services = dse.base_api_url;
// 获取 基础的类型配置
export function getDictByPCode(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/CommonCtrl/getDictByPCode.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}