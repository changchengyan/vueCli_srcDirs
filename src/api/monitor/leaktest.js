import axios from 'axios'
axios.defaults.withCredentials=true;

const services = dse.base_api_url;
 
//获取漏损突变监测列表
export function getLeakageMutationList(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeWaterGageController/getLeakageMutationList.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//获取水压测点漏损分布
export function getLeakageMapPoints(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeWaterGageController/getLeakageMapPoints.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}


//  查询测点近三天水压监测曲线

export function getWaterGage3Days(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeWaterGageController/getWaterGage3Days.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}