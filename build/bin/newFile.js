const FS = require('fs');

const PATH = require('path');

if (!process.argv[2]) {
    console.error('【文件名】必填 ');
    process.exit(1);
}
const dir_fileName = (process.argv[2]);
let verify_path = dir_fileName.split('/');
let CREATFILE_PATH = '';

let dirName = '';
let rootPath = PATH.join(__dirname, '../../');

//缓存 路由数据文件 路径
const buffer_path = rootPath + 'build\\bin\\buffer.txt';


// 编辑文件所在目录
let editPath = '';
// 接口 api 的文件位置的根目录
let api_root_path = rootPath + 'src\\api\\interface';
// 接口文件所要进入的目录
let api_creatPath = '';
//接口文件路径
let api_creat_filePath = '';

//路由 文件
let router_path = rootPath + 'src\\router\\index.js';
// 创建路由的 路由 ^——^
let route_path = '';
// 文件的名字
let fileName = '';
//  缓存 命令行数据
let temp_buffer = null;
//读取 缓存 字符串
let temp_buffer_str = '';

let view_data_func = (name) => {
    return `
        <template>
            <div id='${name}'>
                <h1>我是 ${name}组件</h1>
            </div>
        </template>

        <script>
            export default{
                props: ['test'],
            components:{

            },
            data(){
                return {
                  count: 0
                };
            },
            mixins:[],
            methods:{
                test(val){

            }
        },
            filters:{
                test(val){
            return val
        }
    },
            mounted(){

            },
            watch:{
                test: {
                handler(newValue, oldValue){
            console.log(newValue,oldValue)
        },
        immediate:true,
        deep:true
    }
    },
            created(){

            }
            }
    </script>

        <style lang='scss' scoped >

            #${name}{
                width: 100%;
            height:100%;
        }

    </style>
`
}





const api_func = `
/**
 * 
 *   在 项目 页面中引用 并使用
 * 
 *     import {getData}  from  '@/api/about/about'
 * 
 *      getData(params).then(res=>{
 *              
 *      }).catch(error=>{
 * 
 *      })
 * 
 * 
 */
import fetch from '../fetch'

import domainURL from '../urls'

//  获取数据
export function getData(params) {
    return fetch({
        url: domainURL.getData,
        method: 'post',
        params: params
    })
}

`;




//创建 路由表

let route_func = (str) => {
    return `

    /**
     * 
     * 路由列表中  反应  404和502页面的跳转去向
     * 
     */
    import Vue from 'vue'
    import VueRouter from 'vue-router'
    import { PATH } from '@/common/config/pathConfig'
    Vue.use(VueRouter);
    
    const TOKEN = sessionStorage.getItem('koken')
    let routes = [
      {
        path: '/',
        redirect: '/dse/menu'
      },
      {
        path: '/dse/menu',
        name: 'home',
        meta: { allow: true },
        component: () => import('../views/home.vue'),
        children:[
            ${str}
        ]
      },
      {
        path: '/dse/notAllow',
        name: 'notAllow',
        meta: { allow: true },
        component: () => import('../views/502.vue')
      },
      {
        path: '*',
        name: 'noFound',
        meta: { allow: true },
        component: () => import('../views/404.vue')
      }
    ]
    
    
    let router = new VueRouter({
      mode: 'hash',
      base: PATH,
      routes
    })
    
    router.beforeEach((route, redirect, next) => {
        if (TOKEN === '') {
            // 需要修改的地方
            '  window.location.href  =   dse.base_api_url   /jump.jsp?jumpUrl= dse.baseURL '
            return;
        } else {
            if (route.meta.allow) {
                if (route.name) {
                    next()
                } else {
                    next({ path: '/dse/noFound' })
                }
            } else {
                next({ path: '/dse/notAllow' })
            }
    
        }
    });
    export default router;
    `
};



if (verify_path.length == 2) {
    dirName = verify_path[0];
    editPath = rootPath + 'src\\pages\\' + dirName;
    api_creatPath = api_root_path + '\\' + dirName;

    fileName = verify_path[1]
    fileName = fileName.toLowerCase()

    // 找到或者建立 views  页面的 *.vue所在的文件夹  
    try {
        let if_has_dir = FS.statSync(editPath);

    } catch (error) {
        FS.mkdir(editPath, function (err) {
            if (err) {
                console.log('创建文件夹出错！');
            } else {
                console.log(editPath + '  文件夹-创建成功！');

                function find_ifSameName(path) {
                    let files = FS.readdirSync(path);
                    files.forEach((val, index) => {
                        let temp_fileName = val.split('.');
                        if (temp_fileName[0] === fileName) {
                            console.log('【抱歉！当前文件夹下有同名的文件！】');
                            process.exit(1)
                        }
                    });
                }
                find_ifSameName(editPath)

            }
        });
    }



    //  找到或者建立 接口下的 *.js所在的文件夹  
    try {
        let if_has_dir = FS.statSync(api_creatPath);

    } catch (error) {
        FS.mkdir(api_creatPath, function (err) {
            if (err) {
                console.log('创建文件夹出错！');
            } else {
                console.log(editPath + '  文件夹-创建成功！');
            }
        });
    }


    //创建的文件路径
    CREATFILE_PATH = editPath + '\\' + fileName;
    api_creat_filePath = api_creatPath + '\\' + fileName;

    // 添加路由项
    route_path = `{
        path: '/dse/${fileName}',
        name: '${fileName}',
        meta: { allow: true },
        component: () => import('../pages/${dirName}/${fileName}.vue'),
    },`

    temp_buffer = new Buffer(`${route_path}`, 'utf8');
    temp_buffer_str = temp_buffer.toString()

} else {
    editPath = rootPath + 'src\\pages';
    fileName = verify_path[0];
    function find_ifSameName(path) {
        let files = FS.readdirSync(path);
        files.forEach((val, index) => {
            let temp_fileName = val.split('.');
            if (temp_fileName[0] === fileName) {
                console.log('【抱歉！当前文件夹下有同名的文件！】');
                process.exit(1)
            }
        });
    }
    find_ifSameName(editPath);
    CREATFILE_PATH = editPath + '\\' + verify_path[0];

    api_creatPath = api_root_path;
    api_creat_filePath = api_creatPath + '\\' + fileName;

    route_path = `{
        path: '/dse/${fileName}',
        name: '${fileName}',
        meta: { allow: true },
        component: () => import('../pages/${fileName}.vue'),
    },\n`
}

FS.appendFile(buffer_path, route_path, (err) => {
    if (err) {
        console.log('【缓存数据失败！】')
    } else {
        // temp_buffer_str = temp_buffer.toString()
        FS.readFile(buffer_path, 'utf8', (err, data) => {
            if (err) {
                console.log('【缓冲区数据写入失败】')
                process.exit(1)
            } else {

                temp_buffer_str = data;

                let routerTable = route_func(temp_buffer_str);

                let view_page_str = view_data_func(fileName);

                setTimeout(() => {

                    FS.writeFile(`${CREATFILE_PATH}.vue`, view_page_str, { flag: 'w', encoding: 'utf-8', mode: '0666' }, (err) => {
                        if (err) {
                            console.log('【视图 文件创建失败】');
                        } else {
                            console.log('【视图 文件创建成功】');
                        }
                    })

                    FS.writeFile(`${api_creat_filePath}.js`, api_func, { flag: 'w', encoding: 'utf-8', mode: '0666' }, (err) => {
                        if (err) {
                            console.log('【接口 文件创建失败】');
                        } else {
                            console.log('【接口 文件创建成功】');
                        }
                    })

                    FS.writeFile(`${router_path}`, routerTable, { flag: 'w', encoding: 'utf-8', mode: '0666' }, (err) => {
                        if (err) {
                            console.log('【路由 文件创建失败】');
                        } else {
                            console.log('【路由 文件创建成功】');
                        }
                    })
                }, 2000)
            }
        })

    }
});









