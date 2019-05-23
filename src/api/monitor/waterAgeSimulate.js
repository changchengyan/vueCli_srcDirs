import axios from 'axios'
axios.defaults.withCredentials=true;

const services = dse.base_api_url;
 

//爆管风险列表
export function getWaterAgeData(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeEpaController/getWaterAgeData.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
