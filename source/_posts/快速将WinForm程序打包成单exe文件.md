---
title: 快速将WinForm程序打包成单exe文件
date: 2025-06-11 20:52:42
tags:
  - 笔记
---
## ~~省流：[Costura.Fody](https://github.com/Fody/Costura)~~
<!-- more -->
正常情况下winform编译出来的结果附带dll，如果缺失这些依赖就无法正常运行，着使的我们如果想分享自己编写的winform程序比较麻烦    
[Costura.Fody](https://github.com/Fody/Costura)可以非常简单的帮助我们构建一个绿色版的exe可执行文件

## 正式开始

1. 在顶部导航栏找到 `项目`-`管理 NuGet 程序包(N)..`
![image](https://img.zmal.top/20250611/image.67xps4e9ut.jpg)
2. 切换到`浏览`卡，在输入框输入`Costura.Fody`（若无搜索结果请检查右上角程序包源）选择第一个之后点击右侧的`安装`  
![image](https://img.zmal.top/20250611/image.8vn62h9g7q.jpg)
3. 之后在项目构建时`Costura.Fody`就会自动将dll打包进exe文件啦

推荐使用`Windows 窗体应用（.NET Framework）`,不带`（.NET Framework）`的版本`Costura.Fody`貌似无法正常工作