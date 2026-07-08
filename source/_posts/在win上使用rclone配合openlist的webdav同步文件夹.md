---
title: 在 Win 上使用 rclone 配合 OpenList WebDAV 同步文件夹
date: 2026-07-07 22:24:27
tags:
  - rclone
  - OpenList
  - WebDAV
  - Windows
  - 笔记
---

## 前言

这几天折腾了一下我的openlist，想了想总不能一直吃灰吧。突然想起来win的截图之前一直都是放养状态，找了一些文档实现了win截图 -> openlist的自动化

~~顺便水一篇 blog~~

对比了一些能找到方案，最后选择了：

> Windows → rclone → OpenList WebDAV → 后端存储
<!-- more -->
相比直接使用网盘客户端，这种方案具有以下优点：

- 支持任意 WebDAV 后端
- 占用资源低
- 配置简单
- 可脚本化
- 可以配合 Windows 任务计划程序实现自动同步

---

## 安装 rclone

下载：

<https://rclone.org/downloads/>

Windows 解压即可使用，也可以加入 PATH。

查看版本：

```pwsh
rclone version
```

---

## 配置 OpenList WebDAV

进入配置：

```pwsh
rclone config
```

新建一个 Remote：

```text
n) New remote
```

例如命名：

```text
webdav_scPhoto
```

Storage 类型选择：

```text
webdav
```

填写：

```text
URL:
https://你的域名/dav/

Vendor:
Other

User:
用户名

Pass:
密码
```

完成后测试：

```pwsh
rclone lsd webdav_scPhoto:
```

如果能够列出目录，说明配置成功。

---

## 同步命令

例如同步 Windows 截图目录：

```pwsh
rclone sync ^
"C:\Users\用户名\Pictures\Screenshots" ^
webdav_scPhoto:Screenshots ^
-P
```

参数说明：

|参数|说明|
|----|----|
|-P|显示进度|
|sync|目标与源保持一致（会删除多余文件）|
|copy|仅复制新增或修改文件，不删除目标文件|
|--transfers|同时上传数量|
|--checkers|检查线程数量|

推荐日常使用：

```pwsh
rclone copy
```

如果希望两边保持完全一致：

```pwsh
rclone sync
```

---

## 推荐参数

如果图片较多，可以加入：

```pwsh
--checkers 8
--transfers 4
```

如果你在 /path/to/src 目录下有很多文件，但每天只有少数文件发生变化，你可以使用以下命令高效地复制最近更改的所有文件

```pwsh
rclone copy --max-age 24h --no-traverse /path/to/src remote:
```

综合使用（~~我用着的~~：

```pwsh
rclone copy "C:\Users\zmal\Pictures" webdav_scPhoto: --transfers 16 --checkers 32 --size-only --exclude desktop.ini --exclude Thumbs.db --log-file X:\Soft\PATH\rclone-v1.74.3-windows-amd64\rclone-photo.log --log-level INFO  --no-traverse --max-age 24h --config "X:\Soft\PATH\rclone-v1.74.3-windows-amd64\rclone.conf"
```

---

## Windows 自动同步

打开：

`任务计划程序`

> win+r 输入`taskschd.msc`

新建任务：

### 常规

`名称`随便写  

安全选项里面点`更改用户或组`,填写

```text
SYSTEM
```

这一步是为了让计划执行时不会出现命令行

`配置`我选的是`Windows 10`其他的没测不知道干嘛的

![Image_2026-07-08_21-48-01_pbi0mtef](https://img.zmal.top/20260708/Image_2026-07-08_21-48-01_pbi0mtef.czo.54yg1eup99.webp)

### 触发器

根据你的情况自己配置

![Image_2026-07-08_21-48-34_mee3qhkt](https://img.zmal.top/20260708/Image_2026-07-08_21-48-34_mee3qhkt.jfe.86uc2mwrb4.webp)

### 操作

新建一个然后

#### 启动程序

（填写你实际存放rclone的位置，添加了PATH的话也可以直接用 rclone.exe

```text
X:\Soft\PATH\rclone-v1.74.3-windows-amd64\rclone.exe
```

#### 添加参数

```text
copy "C:\Users\zmal\Pictures" webdav_scPhoto: --transfers 16 --checkers 32 --size-only --exclude desktop.ini --exclude Thumbs.db --log-file X:\Soft\PATH\rclone-v1.74.3-windows-amd64\rclone-photo.log --log-level INFO  --no-traverse --max-age 24h --config "X:\Soft\PATH\rclone-v1.74.3-windows-amd64\rclone.conf"
```

`起始与`可以填存放rclone的文件夹 （留空大概也不会有问题

### 条件

推荐勾选`只有在以下网络连接可用时才启动`,下面不清楚的话选`任何连接`就行

### 设置

如果不清楚是什么就保持默认即可

![Image_2026-07-08_21-49-23_taps33lj](https://img.zmal.top/20260708/Image_2026-07-08_21-49-23_taps33lj.dws.73umrr2486.webp)

---

## sync 与 copy 的区别

### copy

```text
本地新增
↓

上传

↓

远程保留所有文件
```

不会删除远程文件。

适合作为：

- 备份
- 上传

---

### sync

```text
本地
↓

完全同步

↓

远程
```

远程多出来的文件会被删除。

适合作为：

- 镜像同步
- 保持一致

---

## 常见问题

### 第一次同步很慢

正常现象。

rclone 首次需要：

- 遍历本地文件
- 获取远程文件列表
- 比较时间和大小

之后增量同步会快很多。

---

## 我的使用场景

目前主要同步：`Screenshots/`
Windows 每隔 一个小时 自动同步到：

```text
OpenList
    └── WebDAV
          └── Screenshots
```

整个流程：

```text
Windows
      │
      ▼
rclone
      │
      ▼
OpenList WebDAV
      │
      ▼
实际存储（不告诉你）
```

基本无需人工干预，实现截图自动备份。

---

## 总结

rclone 配合 OpenList WebDAV 是一个非常轻量、稳定且通用的文件同步方案。

优点：

- 配置简单
- 支持增量同步
- 支持定时任务
- 支持几乎所有主流存储
- 不依赖官方客户端
- 易于脚本化

需要注意的是，目前 OpenList 的 WebDAV 在覆盖已有文件时可能会遇到 `409 Conflict` 等兼容性问题，建议优先采用新增文件的同步方式，并关注 OpenList 后续版本的修复情况。
