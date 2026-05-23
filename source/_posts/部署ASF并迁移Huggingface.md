---
title: 部署ASF并迁移Huggingface
Translate_title: Deployment-of-ASF-and-relocation-of-Huggingface
comments: true
tags:
  - 迁移
  - 教程
  - Huggingface
published: true
layout: post
date: 2024-10-25 08:23:12
updated: 2025-01-03 15:45:12
---

# 介绍

~~[ASF](https://github.com/JustArchiNET/ArchiSteamFarm) is a C# application with primary purpose of farming Steam cards from multiple accounts simultaneously. Unlike Idle Master which works only for one account at given time, while requiring Steam client running in the background and launching additional processes imitating "game playing" status, ASF doesn't require any Steam client running in the background, doesn't launch any additional processes and is made to handle unlimited Steam accounts at once. In addition to that, it's meant to be run on servers or other desktop-less machines, and features full cross-OS support, which makes it possible to launch on any operating system with .NET Core runtime, such as Windows, Linux and macOS. ASF is possible thanks to gigantic amount of work done in marvelous SteamKit2 library.~~

[ASF](https://github.com/JustArchiNET/ArchiSteamFarm) 是一款 C# 应用程序，其主要目的是同时从多个帐户中获取 Steam 卡。与 Idle Master 不同，Idle Master 每次只能为一个帐户工作，同时需要 Steam 客户端在后台运行并启动模拟“玩游戏”状态的其他进程，而 ASF 不需要任何 Steam 客户端在后台运行，不启动任何其他进程，并且可以同时处理无限数量的 Steam 帐户。除此之外，它还可以在服务器或其他无桌面机器上运行，并具有完整的跨操作系统支持，这使得它可以在任何具有 .NET Core 运行时的操作系统上启动，例如 Windows、Linux 和 macOS。ASF 之所以能够实现，要归功于在出色的 SteamKit2 库中所做的大量工作。

<!-- more -->

# 开始

[官方文档](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Setting-up-zh-CN)

## 安装.NET 依赖

[Windows：](https://learn.microsoft.com/zh-cn/dotnet/core/install/windows)

[Microsoft Visual C++ Redistributable Update](https://learn.microsoft.com/zh-cn/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2015-2017-2019-and-2022)（64 位为 x64，32 位为 x86，64 位 ARM 为 arm64）
强烈建议您确保已安装所有 Windows 更新。 如果您未启用自动更新，则至少需要安装 KB2533623 和 KB2999226，但有可能还需要更多。 如果您的 Windows 已更新到最新，则无需专门安装。

[Linux：](https://learn.microsoft.com/zh-cn/dotnet/core/install/linux)

```bash
apt-get update&& apt-get upgrade -y&& apt-get install -y ca-certificates libc6 libgcc-s1 libicu70 libgssapi-krb5-2 libssl3 libstdc++6 zlib1g
```

## 下载可执行文件

[https://github.com/JustArchiNET/ArchiSteamFarm/releases/latest](https://github.com/JustArchiNET/ArchiSteamFarm/releases/latest)

~~解压不教~~

这是一个文件夹结构的示例：

> D:\ASF (放置您自己与 ASF 相关的东西)
> ├── ASF shortcut.lnk (可选)
> ├── Config shortcut.lnk (可选)
> ├── Commands.txt (可选)
> ├── MyExtraScript.bat (可选)
> ├── (...) (任何您选择放在这里的其他文件，可选)
> └── Core (ASF 自身专用文件夹，也就是您解压压缩包的地方)
> ├── ArchiSteamFarm(.exe)
> ├── config
> │ ├── yourbotname.json # 配置好的 json 放这个位置
> ├── logs
> ├── plugins
> └── (...)

![1](https://img.zmal.top/old/1.3uuzeq4cw1.jpg)

## 配置

推荐使用官方[在线配置文件生成器](https://justarchinet.github.io/ASF-WebConfigGenerator/#/bot)

你要是想自己手搓[详细文档](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Configuration-zh-CN)在这里

![2](https://img.zmal.top/old/2.9dd3uvckzm.jpg)

下载之后扔到 config 文件夹

## 启动

```bash
./ArchiSteamFarm
```

第一次推荐控制台启动，方便看日志，后期 windows 可以用文件夹里的.exe 启动，Linux 可以用文件夹里的.sh 启动
![3](https://img.zmal.top/old/3.4ub2rw741d.jpg)![4](https://img.zmal.top/old/4.1sf6qo5ruc.jpg)

## 后期修改配置文件

使用 [ASF-ui](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/IPC-zh-CN#asf-ui)
当你看到控制台这些日志输出的时候，说明 ASF-ui 已被正确启动~~\*别管我改端口号，默认就是**1242\***~~
![5](https://img.zmal.top/old/5.5tr6529v79.jpg)
访问[http://localhost:1242](http://localhost:1242)
你会看到这样的面板
![6](https://img.zmal.top/old/6.8dx0hp9tti.jpg)
![7](https://img.zmal.top/old/7.51eanbt9h3.jpg)
默认开始挂卡
我们~~只需要~~在 GamesPlayedWhileIdle 添加游戏的 id 就可以开始刷指定游戏的时长
其他的里面解释的很详细，自己看着改

## 进一步配置

**_同时挂多个帐户_**
ASF 支持同时挂多个帐户，这也是它的主要功能之一。 您可以通过生成更多机器人配置文件来向 ASF 添加更多帐户，其方法与您之前生成第一个机器人配置完全相同。 您只需要确保两件事：

- 机器人的名称是唯一的，如果您将第一个机器人命名为“MainAccount”，其他的机器人就不能再叫这个名字。
- 登录信息正确，包括 SteamLogin、 SteamPassword 和 SteamParentalCode（如果您启用了 Steam 家庭监护）。

**懒得写了**，进一步配置自己看[文档](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Setting-up-zh-CN#%E8%BF%9B%E4%B8%80%E6%AD%A5%E9%85%8D%E7%BD%AE)去

# 下面开始将迁移到 huggingface 的步骤

如果你不知道什么是[huggingface](https://huggingface.co/)，~~那我也懒得解释，~~你只需要知道它是和 cf 差不多的赛博大善人就行

注册，登录，**~~不教~~**
![8](https://img.zmal.top/old/8.9gwpsl5np5.jpg)
前面随便填，这里选 docker

`public`公开方便后期保活，`private`涉密安全

![9](https://img.zmal.top/old/9.esnmmuptn.jpg)
点这里创建 Dockerfile![10](https://img.zmal.top/old/10.6ikfp2xe7w.jpg)

```dockerfile
FROM ubuntu:22.04
EXPOSE 1242

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y tzdata ca-certificates libc6 libgcc-s1 libicu70 libgssapi-krb5-2 libssl3 libstdc++6 zlib1g \
    && apt-get install -y git wget zip

ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /zmal
RUN wget https://github.com/JustArchiNET/ArchiSteamFarm/releases/download/6.0.7.5/ASF-linux-x64.zip
RUN unzip ASF-linux-x64.zip

COPY . .

#你要是想裸奔zip不设密码下面这个RUN就不用抄
RUN --mount=type=secret,id=zzz,mode=0444,required=true \
  unzip -P $(cat /run/secrets/zzz) config.zip -d /zmal/config/

#裸奔的吧这行取消注释RUN unzip config.zip -d /zmal/config/
RUN chmod -R 777 /zmal
CMD bash ArchiSteamFarm-Service.sh
```

直接照抄

然后再`Files`选项卡找到 README.md
在末尾加上`app_port: 6221`

停止你刚才在本地能正常跑的 asf，把 config 里面的文件打包成 config.zip,推荐带上解压密码

![11](https://img.zmal.top/old/11.3yelcfxflp.jpg)上传之后到`setting`选项卡设置`Secrets`
![12](https://img.zmal.top/old/12.7i0j2905dq.jpg)
理论上来说过一会你就能在`app`选项卡进入[ASF-ui](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/IPC-zh-CN#asf-ui)了，后期临时改配置都可以在里面操作

但[huggingface](https://huggingface.co/)的 docker 里面数据不能持久化，要想稳只能先暂停 bot，然后在本地改好重复上面的步骤覆盖上传 config.zip

[huggingface](https://huggingface.co/)的 space~~好像~~三天无访问就会自动休眠，我这里采用[uptimerobot](https://uptimerobot.com/)探针报活，能用，但不好用，如果你知道其他更好的方法欢迎告诉我
