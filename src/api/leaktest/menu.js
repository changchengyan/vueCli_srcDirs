import axios from 'axios'
axios.defaults.withCredentials=true;

const services = dse.base_api_url;
 
//获取菜单列表
export function listAllUserChildrenById(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/resourceController/listAllUserChildrenById.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

// 获取组织树   

export function getOrgTree(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeLeakController/getOrgTree.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}

