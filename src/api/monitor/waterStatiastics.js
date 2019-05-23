import axios from 'axios'
// import {BASE_DOMAIN_URL} from'@/common/config/common_domain'   引入配置文件中的域名或者URl，方便部署
// 获取单词管理列表
// const services = 'http://114.215.110.243:9999/Word/WordBook';

/**
 * 所有  接口调用使用 全部使用 接口最后的关键字  采用驼峰命名法   
 * 
 * 在 文件中调用  示例  
 *  import ｛gedata｝  from '@/api/index'
 *                                       解构赋值
 * let saveData= getData(params).then( ({ data })=>{   }    )
 */
const services = dse.base_api_url;

//获取GetWordAppContent所有课程
export function getNew(type, page) {
    return new Promise((resolve, reject) => {
        let url = `/api/satinApi?type=${type}&page=${page}`;
        axios.get(url)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
//获取年度水类统计分析数据
export function getPipeWaterConsumption(params) {
    return new Promise((resolve, reject) => {
        let url = `${services}/monitorCount/getPipeBasicData.do`;
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}
