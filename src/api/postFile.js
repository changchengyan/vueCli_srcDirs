import axios from 'axios';

/**
 *
 * @param options
 * @param context
 * @returns {Promise<any>}
 *
 *  基于有进度条的上传操作，在需要的页面中 必须 在 data中构造
 *  formData:{
 *      showProgress:false,  //显示进度条的 开关
 *      startValue:0   //进度条的 过程 可根据需求适当修改
 *  }
 *
 *
 */

export default function postFile(options,context){
    return new Promise((resolve,reject)=>{
        const  INSTACE = axios.create({
            headers:{
                'Content-type':'multipart/form-data',
            },
            timeout:30*1000,
            withCredentials: true,
            onUploadProgress(progressEvent){
                if (progressEvent.lengthComputable) {
                    let val = (progressEvent.loaded / progressEvent.total * 100).toFixed(0);
                    context.formData.showProgress = true;
                    context.formData.startValue = parseInt(val);
                }
            }
        });
        let promise=null;
        let method = options.method.toLowerCase();
        if(method==='post'){
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
               context.$.success('上传成功!');
            }
        }).catch(error=>{

            if(context){
                context.$message.error('业务逻辑错误！');
            }
            console.log(error);
        });
    });
}