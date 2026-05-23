---
title: puppeteer Chromium 启动失败
Translate_title: puppeter-Chromium-start-failed
comments: true
tags: 知识
published: true
layout: post
date: 2025-03-26 19:22:39
updated: 2025-03-26 19:30:24
---
可以解决
![image](https://img.zmal.top/old/image.icaefg9f5.jpg)

## YUM（CentOS/RHEL）命令
```
yum install -y \
    pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 \
    libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 \
    libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 \
    atk.x86_64 gtk3.x86_64 \
    ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi \
    xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 \
    xorg-x11-fonts-misc
```
## APT（Debian/Ubuntu）命令
```
apt-get update && apt-get install -y --no-install-recommends \
    google-chrome-stable tzdata redis-server \
    ttf-wqy-zenhei ttf-wqy-microhei fonts-arphic-ukai fonts-arphic-uming \
    p7zip-full ffmpeg libavcodec-extra libopencore-amrnb-dev \
    libopencore-amrwb-dev libvo-amrwbenc-dev libx264-dev \
    libx265-dev libvpx-dev libmp3lame-dev libopus-dev
```

夹带了一点私货懒得删了