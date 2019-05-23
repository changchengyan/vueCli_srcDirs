import axios from 'axios'

axios.defaults.withCredentials = true;

const services = dse.base_api_url;
// 获取文件路径的前缀
export function getMapPro(params) {
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