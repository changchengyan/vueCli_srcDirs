
import axios from 'axios'
import qs from 'qs';

axios.defaults.withCredentials = true;

const services = dse.base_api_url;
// export function getResourceByIdAndUser(params) {
//     return new Promise((resolve, reject) => {
//         let url = `${services}/CommonCtrl/getResourceByIdAndUser.do`;
//         axios.post(url, qs.stringify(params), {
//             headers: {
//                 "Content-type": "application/x-www-form-urlencoded"
//             }
//         })
//             .then(response => {
//                 resolve(response.data);
//             }).catch((error) => {
//                 reject(error);
//             })
//     })
// }

export function getResourceByIdAndUser(params) {
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
