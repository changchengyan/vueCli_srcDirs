
import axios from 'axios'
import qs from 'qs';

axios.defaults.withCredentials=true;

const services = dse.base_api_url;
let hrefUrl = dse.href;


//根据年月统计管网信息
export function getPipeRadiusReport(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeBaseInfoController/getPipeRadiusReport.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//  根据年月、设备类型统计设备数量
export function getPipeDeviceValveReport(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeDeviceController/getPipeDeviceValveReport.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

// // 根据年和设备类型统计设备数量   如果使用  application/x-www-form-urlencoded   必须构造成这个样子 不然 post容易出错   必须引入包 qs
// export function getPipeDeviceNumReport(params) {
//     return new Promise((resolve, reject) => {
//         let url = `${services}/pipeDeviceController/getPipeDeviceNumReport.do`;
//         axios.post(url, QS.stringify(params), {
//                 headers: {
//                     "Content-type": "application/x-www-form-urlencoded"
//                 }
//             })
//             .then(response => {
//                 resolve(response.data);
//             }).catch((error) => {
//                 reject(error);
//             })
//     })
// }
// 根据年和设备类型统计设备数量
export function getPipeDeviceNumReport(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeDeviceController/getPipeDeviceNumReport.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}