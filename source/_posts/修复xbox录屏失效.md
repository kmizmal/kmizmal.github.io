---
title: 修复xbox录屏失效
date: 2025-04-11 21:08:02
tags:
  - 知识
---
`win r`输入
```
regedit
```
导航到
```
计算机\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\GameDVR
```
将`AppCaptureEnabled`改为1
![image](https://img.zmal.top/20250411/image.70aiupf3bi.jpg)
若无`AppCaptureEnabled`请右键单击该空间并选择New > DROWD (32-bit) Value。将其命名为`AppCaptureEnabled`

>参考链接
https://zhuanlan.zhihu.com/p/689643604
https://ksh7.com/posts/windows-xbox-game-bar/index.html#%E4%BF%AE%E6%94%B9%E6%B3%A8%E5%86%8C%E8%A1%A8%E4%BF%AE%E5%A4%8D-xbox-game-bar
https://www.minitool.com/news/windows-11-xbox-game-bar-not-working.html
>