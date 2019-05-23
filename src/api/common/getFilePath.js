import axios from 'axios'

axios.defaults.withCredentials = true;

const services = dse.base_api_url;
// 获取文件路径的前缀
export function getFilePathUrl() {
    return new Promise((resolve, reject) => {
        let url = `${services}/CommonCtrl/getFilePathUrl.do`;
        axios.get(url)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}