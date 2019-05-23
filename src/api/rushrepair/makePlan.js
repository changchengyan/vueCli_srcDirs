import axios from 'axios'
axios.defaults.withCredentials=true;
const services = dse.base_api_url;



// 获取组织下的部门 下的全体员工
export function getDepartAndUser( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/User/getDepartAndUser.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}



// 添加巡检区域
export function addPlanArea( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/InspectController/addPlanArea.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
// 添加巡检签到点
export function addSignPoint( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/SignController/addSignPoint.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
// 添加巡检计划
export function addInspectorPlan( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/InspectController/addInspectorPlan.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
//添加巡查人员  
export function addPlanPerson( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/User/addPlanPerson.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}