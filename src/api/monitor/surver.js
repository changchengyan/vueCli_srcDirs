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

//水质详情  
export function getPipeWaterQualityDetailInfo(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeWaterQualityController/getPipeWaterQualityDetailInfo.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}


//查询监测点流量监测曲线详情  
export function getPipeFlowDetailInfo(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeFlowController/getPipeFlowDetailInfo.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//查询监测点水压监测曲线详情 
export function getPipeWaterGageDetailInfo(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeWaterGageController/getPipeWaterGageDetailInfo.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//处理预警（修改预警状态为正常）

export function handleMonitorWarnInfo(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeMonitorWarnController/handleMonitorWarnInfo.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}


//查询水质曲线

export function getPipeWaterQualityRangCurve(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeWaterQualityController/getPipeWaterQualityRangCurve.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}








