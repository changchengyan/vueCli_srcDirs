import axios from 'axios'
axios.defaults.withCredentials=true;

const services = dse.base_api_url;
 
//根据水司查询分区
export function getAreaList(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeAreaController/getAreaList.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//查询水司漏损率
export function getLeakInfoByCompany(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeLeakController/getLeakInfoByCompany.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//查询分区漏损率
export function getLeakInfo(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeLeakController/getLeakInfo.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//查询子分区漏损详情
export function getSubareaLeakList(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeLeakController/getSubareaLeakList.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//编辑分区漏损记录
export function updateLeakRecord(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeLeakController/updateLeakRecord.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//查看分区详情
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

//查看分区结构树
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