#  config-cli
    通用框架配置文档
## Build Setup

``` bash
# 安装依赖项
npm install

# 新建文件   可以一次生成包含 视图文件、路由文件(需要后期调整)、接口文件（里面有示例代码）
npm  run new fileName[文件名字]  或者  npm run new dirName/fileName[文件夹名字/文件名字]

# 服务开启  默认 开启 服务 为 IP:8080
npm run dev

#  沿用 官方打包要求  同时在这个命令后新添加 把生产环境的 配置文件替换为  开发环境的配置文件
npm run build

#  打包 并且 查看 包占用分析报告
npm run build --report

# 上传打包文件 到服务器指定目录
npm  run local2serve

```



##  项目目录结构

    
     特别值得注意的是 src中的静态文件是参与打包的
     与 src同级的static文件 打包中会原封不动挪到dist中的合并的static中
     -build
     -config
     -src
        -assets
            -imgs
        -common
            -components
            -config
                +inner_config.js    //内置配置共享数据 不可轻易配置  与外置/static/config.js 联动
            -utils
        -api
            +fetch.js
            +urls.js
            +get.js
            +post.js
            -api
                -modules1
                    +*.js
                    +*.js
                 -modules2
                    +*.js
                    +*.js
        -iframe  // 可能在arcgis中有用 
            -modules1
                *.vue
             -modules2
                *.vue
        -mixins  // 混合器目录
            *.js

        -views
            -moudles1
                +*.vue
                +*.vue
             -moudles2
                +*.vue
                +*.vue
             -moudles3
                +*.vue
                +*.vue
             +menu.vue
             +404.vue
             +502.vue
        -store
            +index.js
            -modules
                +*.js
            -modules
                +*.js
            +root.js
        -router
            index.js
     -static
        -imgs
            *.jpg
        +config.js  //外置配置全局变量
   

##   项目运行 需要 loader 及 配置

   
        一、配置  sass
            需要 loader   node-sass   sass-loader
            配置  build/webpack.base.conf.js

            
            modules:{
                rules：[
                    {
                        test: /\.scss$/,
                        loaders: ["style", "css", "sass"]
                    }
                ]
            }
            
            
        二、 配置 store 增加 命名空间  使用子模块可根模块共存
            解决多人 编辑状态字段
        
        三、解决 IE下对ES6 编译成ES5的 兼容  babel-polyfill
            配置  build/webpack.base.conf.js 添加

            
                require(""babel-polyfill")
                module.exports = {
                    entry: {
                        app: ["babel-polyfill", "./src/main.js"]
                    }
                }
            
        四、项目启动，打开浏览器
            配置： config/index.js 
            
            dev:{
            autoOpenBrowser: true, 
            }
   
        
        


## 打包前需要新增 生产环境的 配置文件编写

   
        现有 配置文件  仅限于   index.html  和 static 下的 config.js

        需要在项目 static 文件夹下 新建  temp_config.js  和  temp_index.html   ****(这两个文件 必须填写完整，不过后期也可以完善！)
   


## 插件

     

        1.  打包压缩  *.gz
            限制版本号要求: "compression-webpack-plugin": "^1.1.12",
            修改webpack：config/index.js  把  productionGzip 改为 true
        2. 打包清除所有的 控制台信息  console.log()或者  func(){console.log()}
            无版本号限制：
            修改 build目录下的 webpack.prod.conf.js 中plugins中的
            
                new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                    warnings: false,
                    drop_console: true,//console
                    drop_debuger:true
                    pure_funcs: ['console.log']//移除console
                    }
                },
                sourceMap: config.build.productionSourceMap,
                parallel: true
                }),
            
        3. 运行期 开启 IP 连接
            无版本要求：
            修改 build/webpack.dev.conf.js 
            在文件 开头 加入
            
            function getIPAdress() {
                    var interfaces = require('os').networkInterfaces();
                    for (var devName in interfaces) {
                        var iface = interfaces[devName];
                        for (var i = 0; i < iface.length; i++) {
                            var alias = iface[i];
                            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                                return alias.address;
                            }
                        }
                    }
                }
            
            然后 把  const HOST = getIPAdress();

        4.  打包静态资挂载源路径
            修改  config/index.js  添加如下
                
                let temp_json = require("../package.json");
                let temp_staticPath_build = temp_json.buildStaticPath
            
            修改 build 对象下的   
            
                build:{
                    assetsPublicPath:""+temp_staticPath_build
                }
            
            package.json 中  配置静态文件路径  buildStaticPath = "pipe/pc/"
        
        
        
 ## 引用的 包
 
      1、 lodash   工具库   已注册全局  使用 方式 this.funTool.unil(XXX)
      2、 vee-valitor 表单校验 已注册全局  关注官方教程
      3、 vue-echarts-v3 前端 图表类
      
            


 




    
