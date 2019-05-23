import axios from 'axios'

axios.defaults.withCredentials=true;

const services = dse.base_api_url;

/**
 * 所有  接口调用使用 全部使用 接口最后的关键字  采用驼峰命名法   
 * 
 * 在 文件中调用  示例  
 *  import ｛gedata｝  from '@/api/index'
 *                                       解构赋值
 * let saveData= getData(params).then( ({ data })=>{   }    )
 */


// 查询分区用户信息
export function getPipeWaterUserInfo( params) {
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

//删除用水大户  或者修改用水大户信息 
export function saveOrUpdate( params) {
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

// 编辑大用水户    或者删除
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



//模糊查询管道 
export function getPipeBaseInfo( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeBaseInfoController/getPipeBaseInfo.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
 
