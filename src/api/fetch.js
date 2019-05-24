import axios from 'axios';

export default function fetch(options,context){
    return new Promise((resolve,reject)=>{
        const  INSTACE = axios.create({
            headers:{
                'Content-type':'application/json',
            },
            timeout:30*1000,
            withCredentials: true
        });
        let promise=null;
        let method = options.method.toLowerCase();

        if( method==='get'){
            promise = INSTACE.get(options.url,{ params : options.params });
        }else if(method==='post'){
            promise = INSTACE.post(options.url,options.params);
        }

        promise.then(res=>{

            if (res.data.msg == '操作失败') {
                context.$message.error('服务错误!');
                return;
            }
            if (res.data.msg == 'no user') {
                window.location.href = `${window.DSE.base_api_url}/jump.jsp?jumpUrl=${window.DSE.baseURL}?id=${window.id}`;
                return;
            }
            if(res.status===200){
                resolve(res.data);
            }
        }).catch(error=>{

            if(context){
                context.$message.error('业务逻辑错误！');
            }
            console.log(error);
        });
    });
}