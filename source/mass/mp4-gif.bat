@echo off
setlocal enabledelayedexpansion

REM 设置帧率
set FPS=20

REM 遍历当前目录下所有 .mp4 文件
for %%f in (*.mp4) do (
    REM 获取不带扩展名的文件名
    set "filename=%%~nf"
    echo 正在转换：%%f -> !filename!.gif

    REM 使用 ffmpeg 进行转换
    ffmpeg -i "%%f" -vf "fps=%FPS%,scale=iw:ih:flags=lanczos" "!filename!.gif"
    
    REM 检查是否转换成功
    if !errorlevel! equ 0 (
        echo 转换成功：!filename!.gif
    ) else (
        echo 转换失败：%%f
    )
    echo.
)

echo 全部转换完成。
pause
