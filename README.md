# vue-arcgis

> vue 技术栈配合 gis 及其周边组合

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


### 根据最新的esri-loader  做了针对 gis的实现 做了初步的整合，这个版本的gis  与 3.X版本 存在较大的  API 兼容性问题 ，4.X 版本 针对ES6 做了大量的优化  
### 本框架 根据市面上已知或者经验  总结的 项目目录结构  适合大中小型项目的需要；
## 框架  基本涵盖  包如下：
```

    vue-echarts-v3   依赖 echarts   使用说明见官方文档  文档在  npm   所在包的页面内寻找

    esri-loader    最新版  当前是 支持4.X 版本  如果启用，必须修改 包中的 请求路径地址 ，修改如下：
        + node_modules
            + esri-loader
                + dist
                    +esm
                        - esri-loader.js   需要修改里面的   -->  var DEFAULT_URL = 'https://js.arcgis.com/4.7/';  为公司指定的源
                    +umd
                        - esri-loader.js   需要修改里面的   -->  var DEFAULT_URL = 'https://js.arcgis.com/4.7/';  为公司指定的源
    vuex 状态管理   

    axios  http 请求

    element-ui  UI组件库

    vue-router  路由

    normalize.css  初始化页面的所有元素

    scss-loader  使用 scss 构建 css 的框架

    vue-jstree  树形结构

    vue-echarts-v3  图表

    babel-polyfill  解决在 IE下vuex  不能兼容的问题

    vue-quill-editor vue下轻量级的富文本编辑器

    qs  主要解决 post为application/x-www-form-urlencoded 的问题  文档参见 [!]https://blog.csdn.net/qq_30632003/article/details/79469990

                            
```


#  本项目 适用在  多入口路由中  


#目录结构
```

+ src
    + api   ---->  与pags 的目录结构和文件名一致，有利于维护  
        + pipeNet_msg
            + XXX       
                - yyy.js   ----->   调用函数名字,必须要同 接口最后一个关键字同名 ,且要按照驼峰命名法  goodMorningHelloWorld
            - zzz.js.
        + statistics
    + assets   静态资源存放目录
        + images
            + pipeNet_msg
            + statistics
        + resetCSS
            - resetApp.scss
            - XXX.scss
    + common
        + components
            + poupe  模态框组件
                -Poupe.vue
            + config  
                - pathConfig.js  路径配置
    + pages  业务类的所有页面 
        + pipeNet_msg
            - main-route.vue   分路由的入口
            + XXX
                -YYY.vue  二级菜单页面
            - zzz.vue 一级菜单 页面
        + statistics
        + test 测试页面
            + containers 右侧主界面
                - Gis.vue
                - Home.vue
    + router
        - index.js
    + store 
        + pipe  模块
            - index.js
            - action.js
            - getters.js
            - action-type.js
            - mutations.js
            - state.js
        + msg 模块
        - index.js   所有模块暴露的出口
    + utils  工具方法和工具类 写在这里
        - commonUtil.js
        - dateUtil.js
        - localStorage.js
    - App.vue
    - main.js                                                                                                   |  -->  需要在 index.html 引入static文件夹下的  配置文件
                                                                                                                | 
+ static   编译完 原样输出  适合 实施人员  临时修改 资源链接和  其他url 等                                           |
  - config.js  配置全局的域名，或者基础URL，方便 部署   包装成对象的方式 也就是键值对的方式供vue引用  <<<<-------------|
    配置文件 像这样 dse={}  dse.xxx='YYY'  dse.ccc=function(){}                                                  | -->  另外需要在main.js  中  把配置文件的 对象的 名称 包装在vue的原型中，例如 Vue.prototype.DSE = dse ; 
                                                                                                                |       在 接口中引入就直接引，例如：const service = dse.baseurl  ;
                                                                                                                |       在组件中 各个vue钩子函数或者相关函数方法中  使用  this.DSE.XXXX  来调用相关的配置文件的资源

```                                                                                                       

#开启 路由 使用   localhost:8080/pipe 和    localhost:8080/statistics  启动路由切换   新加的子路由页面 同理

## 项目配置 代理

```

+ /
    + config
        - index.js   修改 proxyTable ,可以添加不同域的域名,同时可以简化域名名字  引用接口  只需要  这样  url = '/api/XXX' ==>  解析为 'http://www.baidu.com/XXXX'

```

##  前端合成PDF    把数据 放在session中   导出就是 test.pdf

     使用 iframe  src='that.downloadSrc = '../../../static/makepdf/index.html?name=test';     页面接收 （路径自己调）

## 前端 导出excel  把数据放在 session中    导出就是 test.xls
     
     数据格式  ---->   [
                        ["学号", "姓名", "年龄"],   // excel  的 列标题
                        ["001", "张学友", "40"],   // 每一列下的数据
                        ["002", "张信哲", "38"],
                        ["003", "林志炫", "41"],
                        ["004", "刘亦菲", "24"],
                        ["005", "贾玲", "30"],
                        ["006", "陈一发", "23"]
                      ]
     使用 iframe  src='that.downloadSrc = "../../static/exportExcel/index.html?name=test";    页面接收 （路径自己调）

##  前端 在线预览PDF  流的实现   注意 url的 传参  

使用  iframe  src="/static/pdfjs/web/viewer.html?file=https://cdn.mozilla.net/pdfjs/tracemonkey.pdf"  页面接收(路径自己调)

##  项目打包注意事项

```
                                |——
    + pipe   "/"                |
        + config                |
            - index.js     <----|  build:{
                                |        assetsPublicPath: '/pipe/',   <---------   必须 提前指定需要打包指定的目录  比如把编译完的文件放在www下的pipe文件夹下  
                                |        }  
                                |
                                |——


```



