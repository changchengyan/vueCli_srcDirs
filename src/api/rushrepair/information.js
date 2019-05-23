import axios from 'axios'
axios.defaults.withCredentials=true;

const services = dse.base_api_url;

 
// 实时查询     
export function queryOnlinePerson( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/InspectController/queryOnlinePerson.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

// 巡检记录查询 
export function queryInspectionInfo( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/InspectController/queryInspectionInfo.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//获取标记点  
export function querySignPoint( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/SignController/querySignPoint.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
//  巡检计划  
export function queryInspectorPlanInfo( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/InspectController/queryInspectorPlanInfo.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//管网更新时间  pipeBaseInfoController/getModifiedTime.do
export function getModifiedTime( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeBaseInfoController/getModifiedTime.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//获取所有工单信息 
export function getWorkorderList( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/WorkorderController/getWorkorderList.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}


// 地图加载（隐患，其它，道路，在建）
export function getMapPro( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/work/getMapPro.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//查询巡检轨迹（暂时弃用）
export function getUserRecord( params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/DangerController/getUserRecord.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

