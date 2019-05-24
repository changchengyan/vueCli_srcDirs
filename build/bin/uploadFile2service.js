const FS = require('fs')
const PATH = require("path")
const { exec } = require('child_process');

const root_path = PATH.join(__dirname,"../../")
//本地 生产环境的文件夹
const product_rootDir = root_path+"dist"
// 目标文件夹
const target_dir  = "D:\\logs"
const copyFolder_path = root_path+"\\build\\bin\\deepCopy.bat"

// 上传文件到服务器命令 bat路径

const up2serve_path = root_path+"\\build\\bin\\up2serve.bat"

let CMD_data = `
    @echo off
    echo "使用bat脚本来复制文件夹和文件"
    echo.
    xcopy ${product_rootDir}\\*.*  ${target_dir} /s /e /c /y /h /r
    :pause
`
FS.writeFile(copyFolder_path, CMD_data, (err) => {
    if (err) {
        console.log("【写入复制命令失败！】")
        process.exit(1)
    }else{
        console.log("【成功写入bat脚本~~~~^_^】")
        setTimeout(()=>{
            exec(copyFolder_path, (error, stdout, stderr) => {
                if (error) {
                  console.error(`exec error: ${error}`);
                  return;
                }
                let flag = stderr.indexOf("ho")>-1
                if(flag){

                    console.log("【文件迁移到目标文件夹 成功~~~~^_^】")
                    // exec(up2serve_path, (error, stdout, stderr) => {
                    //     if (error) {
                    //       console.error(`exec error: ${error}`);
                    //       return;
                    //     }
                    //     let flag = stderr.indexOf("ho")>-1
                    //     if(flag){
                            // console.log("【成功上传到服务器并完成了服务器的命令重启】， 大家休息一下吧~~~^_^")
                    //     }
                    // })
                }
            });
        },2000)
        
    }
     
  });


