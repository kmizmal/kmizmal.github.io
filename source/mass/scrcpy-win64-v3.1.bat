@echo off
chcp 65001

setlocal enabledelayedexpansion
set ipAddress=

:: 获取第 24 行 IP 地址
for /f "skip=23 tokens=*" %%A in ('ipconfig') do (
    set ipAddress=%%A
    goto :found
)

:: 替换为你实际打开的端口
echo 第 24 行：!ipAddress!
adb connect !ipAddress!:6666
:: 自行替换scrcpy
"E:\study\bash\adb\scrcpy-win64-v3.1\scrcpy.exe" --pause-on-exit=if-error --audio-source=playback --audio-dup --keyboard=uhid

pause
