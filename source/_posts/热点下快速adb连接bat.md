---
title: 热点下快速adb连接bat
Translate_title: rapid-adb-connection-at-hotspot
comments: true
tags:
  - 日记
  - 笔记
published: true
layout: post
date: 2025-01-08 17:53:45
updated: 2025-01-08 18:07:57
---

我觉得[scrcpy](https://github.com/Genymobile/scrcpy)挺好用的，但是我刷了[box4](https://github.com/Genymobile/scrcpy)走系统级代理导致 usb 网络共享总是出现奇奇怪怪的 bug

~~但是不知道为什么一加开热点每次网关 ip 都会变，~~(刷[SoftApHelPer](https://github.com/XhyEax/SoftApHelper)解决了)

索性在 gpt 的帮助下写了这个脚本，~~开始是想用`find`匹配的，但是我处理不好 ipv6 那个地址处理捣乱，，所以脚本里面是硬编码了网关那一行~~  
用了几天好像没什么问题就发出来当备份了

`scrcpy`后面带的参数是为了处理键盘输入和音频传递

```dos
@echo off
chcp 65001
setlocal enabledelayedexpansion

:: 获取默认网关 IP（通常是热点设备的 IP）
for /f "tokens=3" %%a in ('route print ^| findstr "0.0.0.0"') do (
    set gatewayIP=%%a
    goto connect
)

:connect
echo 尝试连接设备：!gatewayIP!:6666 ...
adb connect !gatewayIP!:6666 >nul 2>&1

:: 检查是否连接成功
for /f %%a in ('adb devices') do (
    echo %%a | find "!gatewayIP!:6666" >nul && goto launch
)

echo 连接失败，请确认设备已开启 6666 端口并已授权 ADB 连接。
pause
exit /b

:launch
echo 连接成功，正在启动 scrcpy...
"E:\study\bash\adb\scrcpy-win64-v3.1\scrcpy.exe" --pause-on-exit=if-error --audio-source=playback --audio-dup --keyboard=uhid
pause

```
