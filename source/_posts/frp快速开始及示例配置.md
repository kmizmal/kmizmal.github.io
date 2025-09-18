---
title: frp快速开始及示例配置
date: 2025-09-18 18:00:14
tags: 
  - 知识
  - 笔记
---

[官方文档](https://gofrp.org/zh-cn/docs/overview/)
`frp`分为`frpc`（客户端，需要广播服务的地方）与`frps`（服务端，有公网 ip 的地方）

推荐先安装服务端，下面以`Ubuntu`服务端+`windows`客户端举例
<!-- more -->
## 安装服务端

- 安装`wget`，`7z`,`nano`,`screen` ~~问就是我喜欢，实际上还有非常多的下载方式，解压方式，文本编辑器,会话管理工具~~

```bash
apt update&&apt install wget p7zip-full nano -y
```

- 下载`frp`

```bash
wget https://github.com/fatedier/frp/releases/download/v0.64.0/frp_0.64.0_linux_amd64.tar.gz
```

> 如果你看到这篇文章时已经过去很久了，我推荐你去[发布页](https://github.com/fatedier/frp/releases)寻找最新的版本
> 并且在之后的步骤中~~自适应~~将之后带版本的的地方根据实际情况更改(善用 Tab 键)
> ![image](https://img.zmal.top/20250918/image.7w76mlq0wb.png)

一般都是 amd64 ~~大不了一个一个试~~

- 解压`frp`

```bash
7z x frp_0.64.0_linux_amd64.tar.gz
7z x frp_0.64.0_linux_amd64.tar
rm frp_0.64.0_linux_amd64.tar.gz frp_0.64.0_linux_amd64.tar #删除没用了的压缩包
```

- 编辑配置文件

```bash
cd frp_0.64.0_linux_amd64
nano frps.toml
```

![image](https://img.zmal.top/20250918/image.3gorhcs0e4.jpg)
示例配置

```toml
#客户端连接用的端口
bindPort = 6221
#客户端连接时的鉴权token
auth.token = "Challo~"
```

改好之后 ctrl o 回车保存，ctrl x 退出

- 启动`frps`

```bash
screen -S frp
chmod +x ./frps
./frps -c ./frps.toml
```

看到`frps started successfully`就说明成功了，之后 ctrl a+d 退出这个会话或者直接断开 ssh 都可以~~骗你的，还要打开刚才配置的`bindPort`以及之后想要客户端使用的端口~~  
示例

```bash
sudo ufw allow 6221
```

## 安装客户端

- 下载`frp`
  去[发布页](https://github.com/fatedier/frp/releases)寻找最新的版本~~有浏览器为什么要命令行下载，跟我争那你就是对的~~  
  一般也是下载`amd64`
- 解压`frp
  自适应解压到一个能找到且不会被不小心删掉且尽量不包含中文的目录
- 修改配置文件
  双击目录中的`frpc.toml`(如果提示没有打开方式选择文本编辑器即可)  
  参考配置

```toml
serverAddr = "这里填服务器的ip或者域名"
#服务器保持一致
serverPort = 6221
auth.token = "Challo~"
#启用tls
transport.tls.enable = true
#日志输出到文件
log.to = "frpclog.txt"

#隧道
[[proxies]]
name = "sqlserver"
type = "tcp"
#本地地址，一般不用改
localIP = "127.0.0.1"
#本地服务的端口
localPort = 11433
#映射服务端口
remotePort = 7314
```

关于隧道的更多[参考文档](https://gofrp.org/zh-cn/docs/reference/proxy/)

- 初始化检查
  在地址栏输入`cmd`打开命令行，

```dos
frpc -c ./frpc.toml
```

类似的,见到`login to server success`就是连接成功，~~骗你的，刚才设置了日志输出到文件，所以终端什么都不会有.自行在目录下寻找`frpclog.txt`或者直接把那一行删掉~~

- 无窗口运行（可选
  在目录下创建`start.vbs`,粘贴

```vbs
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "frpc.exe -c frpc.toml", 0, False
```

保存之后双击即可无窗口运行，缺点就是看不到控制台的日志了，所以之前我把日志写到文件了~~直接把那一行删掉的小可爱请自适应，当然日志也不一定有什么用没了就没了也无所谓~~

- 开机自启（可选
  右键刚才创建的`start.vbs`点击`创建快捷方式`
  将这个快捷方式复制到

```
C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup
```

即可
