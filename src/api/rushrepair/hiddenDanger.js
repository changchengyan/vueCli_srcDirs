import axios from 'axios'
axios.defaults.withCredentials = true;

const services = dse.base_api_url;


// 巡检工作查询 
export function getInspectData(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/InspectController/getInspectData.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
// 新增隐患 

export function addDanger(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/DangerController/addDanger.do`;
        axios.post(url, params, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//更新隐患状态    DangerController/updateDangerStatus.do
export function updateDangerStatus(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/DangerController/updateDangerStatus.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}