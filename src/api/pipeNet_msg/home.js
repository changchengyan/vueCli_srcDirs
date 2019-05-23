
import axios from 'axios'

axios.defaults.withCredentials=true;
const services = dse.base_api_url;
let hrefUrl = dse.href;
const sessionUrl = dse.base_api_url;




//获取首页基本信息
export function getPipeBasicData(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/home/getPipeBasicData.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
//session
export function getSessionUser() {
    return new Promise((resolve, reject) => {
        let url = `${sessionUrl}/sysController/getSessionUser.do?r=${Math.random()}`;
        axios.get(url)
        .then(response => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
    })
}


 //获取地市级首页信息  
 export function getCityHomeInfo(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/home/getCityHomeInfo.do`;
        axios.post(url,params)
        .then(response => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
    })
}


//接口名称: 查询公共信息
export function getPipeCommmonInfo(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeCommonInfoController/getPipeCommmonInfo.do`;
        axios.post(url,params)
        .then(response => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
    })
}

//接口名称: 保存公共信息
export function saveOrUpdate(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeCommonInfoController/saveOrUpdate.do`;
        axios.post(url,params)
        .then(response => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
    })
}

// 删除公共信息   

export function deleteCommonInfo(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeCommonInfoController/deleteCommonInfo.do`;
        axios.post(url,params)
        .then(response => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
    })
}
