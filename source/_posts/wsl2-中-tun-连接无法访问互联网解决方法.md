---
title: wsl2 中 tun 连接无法访问互联网解决方法
date: 2026-05-27 17:05:07
tags: 笔记
---
首先 `win + r` 输入`%userprofile%`创建`.wslconfig`文件

写入
```toml
[wsl2]
networkingMode=mirrored
```
<!-- more -->
再执行
```powershell
wsl --shutdown   
```
重启wsl

在wsl中执行 
```bash
ip a
```
找到win tun对应的网卡

一般长这样
```bash
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9000 qdisc mq state UP group default qlen 1000
    link/ether 00:15:5d:a7:11:9c brd ff:ff:ff:ff:ff:ff
    altname enx00155da7119c
    inet 198.18.0.1/30 brd 198.18.0.3 scope global noprefixroute eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::99f9:8a3b:164e:8c59/64 scope link nodad noprefixroute
       valid_lft forever preferred_lft forever
```
一般找 `inet 198.18.0.1` 对应的网卡，这里是`eth0`

可以发现mtu被默认设置成了`9000`(因为代理软件的MTU通常设置就是9000（CPU性能较好）),但是wsl2的是`1500`  
而当 Windows 宿主机上的虚拟/物理网卡处于 9000 MTU 巨型帧时，镜像网络组件在向 Linux 侧转发 TCP 握手包时会出现静默丢包。将其降回 1500

所以需要把 tun 的mtc手动设置成1500
```bash
sudo ip link set eth0 mtu 1500
```
其中`eth0`替换成实际看见的网卡

但是这仍然治标不治本，不过根据[虚空终端](https://wiki.metacubex.one/config/inbound/tun/#mtu)上的记录，我们确实可以直接在tun这里把mtu指定成`1500`问题解决


> 参考资料
> https://github.com/microsoft/WSL/issues/11686
> https://github.com/ninehills/blog/issues/93
> https://www.v2ex.com/t/1000081