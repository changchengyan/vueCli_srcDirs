import axios from 'axios'
axios.defaults.withCredentials=true;

const services = dse.base_api_url;
// 获取指定工单  
export function getWorkorderDetail( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/WorkorderController/getWorkorderDetail.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
 
// 获取工单流程   
export function getOrderFlow( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/WorkorderController/getOrderFlow.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
// 新增或修改工单  
export function saveOrUpdateWorkorder( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/WorkorderController/saveOrUpdateWorkorder.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}