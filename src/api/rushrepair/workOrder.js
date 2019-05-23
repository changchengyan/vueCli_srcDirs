
import axios from 'axios'
import qs from 'qs';
axios.defaults.withCredentials = true;

const services = dse.base_api_url;

// 新增或修改工单  
export function saveOrUpdateWorkorder(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/WorkorderController/saveOrUpdateWorkorder.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//获取部门下的所有员工  
export function queryPersonByDept(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/CommonCtrl/getUserByDepartment.do`;
        axios.post(url, qs.stringify(params), {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

// 获取指定工单信息  
export function getWorkorderDetail(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/WorkorderController/getWorkorderDetail.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//  导出 工单为excel   
export function expWorkWorder2xls(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/WorkorderController/expWorkWorder2xls.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}


