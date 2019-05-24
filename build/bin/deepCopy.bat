
    @echo off
    echo "使用bat脚本来复制文件夹和文件"
    echo.
    xcopy E:\test\testconsole\dist\*.*  D:\logs /s /e /c /y /h /r
    :pause
