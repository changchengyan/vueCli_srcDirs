import axios from 'axios'
import qs from 'qs';

axios.defaults.withCredentials = true;

const services = dse.base_api_url;
// 获取文件路径的前缀
export function getOrganDictTree(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/productStructController/getOrganDictTree.do`;
        axios.post(url,qs.stringify(params), {
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