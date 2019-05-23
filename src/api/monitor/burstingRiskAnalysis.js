import axios from 'axios'
axios.defaults.withCredentials=true;

const services = dse.base_api_url;

//爆管风险列表
export function getPipeBurstRiskList(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeBurstRiskController/getPipeBurstRiskList.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//爆管历史信息
export function getPipeBurstHistory(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeBurstRiskController/getPipeBurstHistory.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}


//爆管风险分析   模拟爆管风险分析 
export function getSimulatePipeBurstRisk(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeBurstRiskController/getSimulatePipeBurstRisk.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
 
//  爆管风险分析   
export function getDsePipeBurstRiskInfo(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeBurstRiskController/getDsePipeBurstRiskInfo.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}



