import axios from 'axios'
// 获取单词管理列表
const services = 'http://114.215.110.243:9999/Word/WordBook';


/**
 * 所有  接口调用使用 全部使用 接口最后的关键字  采用驼峰命名法   
 * 
 * 在 文件中调用  示例  
 *  import ｛gedata｝  from '@/api/index'
 *                                       解构赋值
 * let saveData= getData(params).then( ({ data })=>{   }    )
 */

//获取GetWordAppContent所有课程
export function getWordAppContent(adviser_id, app_content_name, pageIndex, pageSize) {
    return new Promise((resolve, reject) => {
        let url = `${services}/GetWordAppContent?adviser_id=${adviser_id}&app_content_name=${app_content_name}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
        axios.get(url)
            .then(response => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
    })
}