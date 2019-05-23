import axios from 'axios'
axios.defaults.withCredentials=true;

const services = dse.base_api_url;
 
//监测项列表查询(新增使用)
export function getMonitoringProgram(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/monitorBase/getMonitoringProgram.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

// 上传新增或编辑的基础设置 
export function addMonitor(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/monitorPoint/addMonitor.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

//监测点查询（监测项详情）   监测点查询（列表和详情） 
export function queryPointMonitor(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/monitorPoint/queryPointMonitor.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

// 编辑监测列表   

export function updateMonitor(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/monitorPoint/updateMonitor.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
