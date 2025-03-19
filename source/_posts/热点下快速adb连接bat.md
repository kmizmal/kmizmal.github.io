---
title: 热点下快速adb连接bat
Translate_title: rapid-adb-connection-at-hotspot
comments: true
tags: []
published: true
layout: post
date: 2025-01-08 17:53:45
updated: 2025-01-08 18:07:57
---

我觉得[scrcpy](https://github.com/Genymobile/scrcpy)挺好用的，但是我刷了[box4](https://github.com/Genymobile/scrcpy)走系统级代理导致usb网络共享总是出现奇奇怪怪的bug

但是不知道为什么一加开热点每次网关ip都会变，

索性在gpt的帮助下写了这个脚本，~~开始是想用`find`匹配的，但是我处理不好ipv6那个地址处理捣乱，，所以脚本里面是硬编码了网关那一行~~            
用了几天好像没什么问题就发出来当备份了

`scrcpy`后面带的参数是为了处理键盘输入和音频传递
```dos
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
:: 自行替换scrcpy路径
"E:\study\bash\adb\scrcpy-win64-v3.1\scrcpy.exe" --pause-on-exit=if-error --audio-source=playback --audio-dup --keyboard=uhid

pause
```