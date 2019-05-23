import axios from 'axios'
axios.defaults.withCredentials=true;

const services = dse.base_api_url;
 
//监测点列表查询
export function getPipeMonitorPoint(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/monitorBase/getPipeMonitorPoint.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
 // 删除监测点 
 export function deleteMonitor(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/monitorPoint/deleteMonitor.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
