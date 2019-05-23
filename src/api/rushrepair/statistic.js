import axios from 'axios'
axios.defaults.withCredentials=true;
const services = dse.base_api_url;

//含有年月 的巡检统计   
export function getCheckReportByYearMonth( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/InspectController/getCheckReportByYearMonth.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//含有年 的 巡检统计   
export function getCheckReportByYear( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/InspectController/getCheckReportByYear.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

// 绩效统计   
export function getCheckRecordReportByYearMonth( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}//InspectController/getCheckRecordReportByYearMonth.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}