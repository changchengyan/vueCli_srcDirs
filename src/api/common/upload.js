
import axios from 'axios'

axios.defaults.withCredentials = true;

const services = dse.base_api_url;
// 上传文件
export function uploadFiles(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/cmUploadFilesController/uploadFiles.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}