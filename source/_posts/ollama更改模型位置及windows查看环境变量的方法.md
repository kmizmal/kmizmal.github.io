---
title: ollama更改模型位置及windows查看环境变量的方法
Translate_title: how-to-reposition-the-model-and-windows-to-view-environmental-variables
comments: true
tags:
  - 知识
published: true
layout: post
date: 2025-03-18 21:50:25
updated: 2025-03-20 17:45:35
---

## ollama 可能用到的环境变量

更改模型位置==>`OLLAMA_MODELS`

> `E:\study\bash\ollamaModles`

上下文大小==>`OLLAMA_CONTEXT_LENGTH`  
server 地址==>`OLLAMA_HOST`

> `0.0.0.0:11434`

排队请求数量==>`OLLAMA_MAX_QUEUE`  
最大加载模型数==>`OLLAMA_MAX_LOADED_MODELS`~~不会真的有富哥能同时允许多个模型吧~~  
最大并发请求数==>`OLLAMA_NUM_PARALLEL`默认值将根据可用内存自动选择 4 或 1  
Flash Attention==>`OLLAMA_FLASH_ATTENTION` ~~我也不知道干嘛的~~随着上下文大小的增加，它可以显著减少内存使用量

> `1`

设置 K/V 缓存的量化类型==>`OLLAMA_KV_CACHE_TYPE`

> `f16` (默认)/`q8_0` (推荐)/`q4_0`

代理重定向出站端口=>`HTTPS_PROXY`

> `https://my.proxy.example.com`

PowerShell 执行`echo $env:OLLAMA_MODELS`检查

**_环境变量需要重启终端生效_**

## ollama 常用命令

ollama run <模型名>  
运行指定模型并进入交互模式

```
ollama run deepseek-r1:32b
```

列出本地已下载的模型

```
ollama list
```

列出已加载模型

```
ollama ps
```

ollama show <模型名>  
显示模型信息

```
ollama show llama3.2
```

ollama pull <模型名>  
下载模型（不运行）(可用于更新)

```
ollama pull codellama
```

ollama rm <模型名>
删除本地模型

```
ollama rm mistral
```

启动 Ollama 服务（API 模式）

```
ollama serve
```

ollama stop <模型名>
停止当前正在运行的模型

```
ollama stop deepseek-r1:14b
```

## 利用[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)

`cloudflared tunnel --url http://localhost:11434 --http-host-header="localhost:11434"`
