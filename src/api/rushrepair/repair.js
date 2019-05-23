import axios from 'axios'
axios.defaults.withCredentials=true;

const services = dse.base_api_url;
//获取所有工单   
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