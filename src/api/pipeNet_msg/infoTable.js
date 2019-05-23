/**
 * 根据年月统计用水量
 * id String  大用户id
 * areaId   String   分区区域id
 * year  String 
 * month  String   
 */
import axios from 'axios'
import qs from 'qs';

axios.defaults.withCredentials=true;

const services = dse.base_api_url;
let hrefUrl = dse.href;


export function getPipeWaterTotal(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/pipeWaterUserController/getPipeWaterTotal.do`;
        axios.post(url,params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}