const FS = require("fs")

const PATH = require("path")

// 项目所在根目录
const rootPath = PATH.join(__dirname, "../../")

// 配置文件所在位置的根目录
const temp_configFile_path = rootPath + "\\static"

// 打包文件的根目录
const product_rootPath = rootPath + "\\dist"
//  打包文件夹静态文件根目录
const product_staticPath = rootPath + "\\dist\\static"
//  打包文件夹下的 配置文件
const product_configFile = rootPath + "\\dist\\static\\config.js"

// 项目 外置静态文件的配置  文件
const temp_product_configFile = temp_configFile_path + "\\temp_config.js"

//入口文件 index.html 的线上配置文件
const product_indexHtml = rootPath + "\\static\\temp_index.html"

FS.exists(product_configFile, function (exists) {
    if (!exists) {
        console.log("【请配置正式环境下的基础配置！】")
        process.exit(1)
    }
})

FS.exists(product_indexHtml, function (exists) {
    if (!exists) {
        console.log("【请配置正式环境下入口文件的配置！】")
        process.exit(1)
    }
})
FS.exists(product_configFile, function (exits) {
    if (!exits) {
        console.log("【打包文件没有该文件！】")
        process.exit(1)
    } else {
        FS.unlink(product_configFile, (err) => {
            if (err) {
                console.log("【旧配置文件】 删除失败!")
            } else {
                FS.copyFile(temp_product_configFile, product_staticPath + '\\config.js', (err) => {
                    if (err) {
                        console.log("【生产环境】配置配置文件替换 失败!  ")
                        process.exit(1)
                    } else {
                        console.log("【生产环境】基础配置文件替换  成功~~~~ ^_^")
                        FS.unlink(product_staticPath + "\\temp_config.js", (err) => {
                            if (err) {
                                console.log("【生产环境】临时配置文件替换 失败!  ")
                                process.exit(1)
                            } else {
                                FS.copyFile(product_indexHtml, product_rootPath + '\\index.html', (err) => {
                                    if (err) {
                                        console.log("【生产环境】入口配置文件替换 失败!  ")
                                        process.exit(1)
                                    } else {
                                        console.log("【生产环境】入口配置文件替换  成功~~~~ ^_^")
                                        FS.unlink(product_staticPath + "\\temp_index.html", (err) => {
                                            if (err) {
                                                console.log("【生产环境】临时配置文件替换 失败!  ")
                                                process.exit(1)
                                            }
                                        })
                                    }
                                });
                            }
                        })

                    }
                });
            }
        });
    }
})

