---
title: 在Linux系统上安装使用mihomo
comments: true
tags:
  - 日记
  - 笔记
  - 教程
published: true
layout: post
date: 2025-03-27 16:04:12
updated: 2025-03-27 16:04:12
---

1. 创建文件目录

```
mkdir -p mihomo
cd mihomo
```

2. 下载可执行文件
   检查系统架构

```
uname -m
```
<!-- more -->
如果是 x86_64（AMD64/Intel 64）架构（大多数 PC/服务器）：
下载 x86_64.rpm（AMD64 适用于 Intel 和 AMD）。

如果是 ARM64（AArch64）架构（树莓派、某些服务器、手机）：
下载 arm64.rpm（或 aarch64.rpm）。

```
wget -O mihomo.gz https://github.com/MetaCubeX/mihomo/releases/latest/download/mihomo-linux-amd64-compatible-go123-v1.19.3.gz
gzip -d mihomo.gz
```

3. 给予执行权限

```
sudo chmod +x mihomo
```

4. 填写配置文件
5. 启动

```
sudo ./mihomo -d ./
```

## 配置 tun（可选

填写 mihomo 配置文件

```
tun:
  enable: true              # 启用 TUN 模式
  stack: system             # Linux 推荐使用 system
  dns-hijack:
    - "any:53"              # 劫持所有 53 端口的 DNS 请求
  auto-route: true          # 自动设置路由
  auto-detect-interface: true  # 自动检测出口网络接口
  mtu: 9000                 # 适当调整 MTU，避免部分网站加载问题
```

在 Linux 下，TUN 设备需要手动启用，执行以下命令：

```
sudo modprobe tun
```

编辑/etc/sysctl.conf 文件

```
nano /etc/sysctl.conf
```

~~我就是不会 vim~~

将以下代码取消注释,如果没有就在末尾加上

```
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
```

加载内核参数

```
sysctl -p
```

参考资料

> - https://12520.net/archives/debian-mihomo-clash.mate-webui
> - https://wiki.metacubex.one/
> - https://zfxt.top/posts/70b7a805/
