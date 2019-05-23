import axios from 'axios'
import qs from 'qs';

axios.defaults.withCredentials=true;
const services = dse.base_api_url;
let hrefUrl = dse.href;

//查询管道--根据年份、区域、管材、管径   //获取管道信息 
export function getPipeBaseInfo(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeBaseInfoController/getPipeBaseInfo.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
//官网更新时间 pipeBaseInfoController/getModifiedTime.do

export function getModifiedTime(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeBaseInfoController/getModifiedTime.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

// 修改管道信息或者删除管道
export function saveOrUpdate(params){
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeBaseInfoController/saveOrUpdate.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

// 查询管道生命周期信息
export function getPipeLifeCycle(params){
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeLifeCycleController/getPipeLifeCycle.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//模糊查询管线  
export function getPipeLine(params){
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeLineController/getPipeLine.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}





//查询管道基本信息  
export function getPipeBaseInfo_id(params){
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeBaseInfoController/getPipeBaseInfo.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
