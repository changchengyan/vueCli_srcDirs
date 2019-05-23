import axios from 'axios'
axios.defaults.withCredentials=true;

const services = dse.base_api_url;
 
//查询监测预警列表（包含水质、水压、流量） 
export function getPipeMonitorWarnList(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeMonitorWarnController/getPipeMonitorWarnList.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}