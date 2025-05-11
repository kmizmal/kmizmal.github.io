---
title: hexo标题翻译插件
Translate_title: hexo-heading-translation-plugin
comments: true
tags:
  - 工具
published: true
layout: post
date: 2025-01-04 11:43:58
updated: 2025-01-04 14:44:42
---

使用[libretranslate](https://github.com/LibreTranslate/LibreTranslate)将 Hexo 中的汉字标题转成英文标题，开箱即用，无需手工修改标题内容

### 安装

1. **_命令行安装_**

在 hexo 项目目录执行

```bash
mkdir scripts
curl -O https://github.com/kmizmal/hexo-translate-title/releases/download/release/translate-title.js scripts/
```

2. **_手动安装_**

在[Releases](https://github.com/kmizmal/hexo-translate-title/releases)下载 translate-title.js 之后手动扔到 hexo 项目目录下的 scripts 文件夹 ~~，如果没有就创建一个~~

### 使用

将`_config.yml`中 permalink 后面的`:title`改为`:Translate_title`

#### 配置（可选）

在`translate-title.js`的 52 行`translate_api_url`后填入你自己搭建的[libretranslate](https://github.com/LibreTranslate/LibreTranslate)接口


~~或者提交 issue~~
