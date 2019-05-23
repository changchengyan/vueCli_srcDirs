import axios from 'axios'
axios.defaults.withCredentials=true;

const services = dse.base_api_url;
 
//查询预警记录列表
export function addArea(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeAreaController/addArea.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

// 获取大用水户 
export function getPipeWaterUserInfo(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeWaterUserController/getPipeWaterUserInfo.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

// 新增边界设备

export function addFlow(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeAreaController/addFlow.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//  分区结构树
export function getAreaTree(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeAreaController/getAreaTree.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//  修改/删除分区
export function updateArea(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeAreaController/updateArea.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//  查看 分区详情  
export function getAreaInfo(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeAreaController/getAreaInfo.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}




