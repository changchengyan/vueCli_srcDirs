import axios from 'axios'
axios.defaults.withCredentials=true;

const services = dse.base_api_url;
 
//查询预警记录列表
export function getWarnList(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeAreaMonitorController/getWarnList.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//流量监测折线图
export function getFlowLineChart(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeAreaMonitorController/getFlowLineChart.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//漏损分析折线图
export function getLeakLineChart(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeAreaMonitorController/getLeakLineChart.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//夜间最小流量折线图
export function getNightMinFlow(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeAreaMonitorController/getNightMinFlow.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}