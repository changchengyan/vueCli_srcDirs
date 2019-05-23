
import axios from 'axios'
import qs from 'qs';

axios.defaults.withCredentials=true;

const services = dse.base_api_url;
let hrefUrl = dse.href;

/**
 * 查询分区用户信息
 * id String  用水户主键
 * name  String 用水户名称
 * areaId   String   分区区域id
 * pageSize  String 
 * page  String   
 */
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

// 删除用水大户  或者新增大用水户
export function saveOrUpdate(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeWaterUserController/saveOrUpdate.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//模糊查询管线

export function getPipeLine(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeLineController/getPipeLine.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}


// 编辑大用水户   /pipeWaterUserController/updateWaterUser.do
export function updateWaterUser( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeWaterUserController/updateWaterUser.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}