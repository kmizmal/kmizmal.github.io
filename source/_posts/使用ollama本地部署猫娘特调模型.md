---
title: 使用ollama本地部署猫娘特调模型
date: 2026-03-02 11:26:31
tags:
---
## 安装ollama
```pwsh
irm https://ollama.com/install.ps1 | iex
```

## 修改模型储存位置（可选，~~默认会塞c盘哦~~
添加环境变量`OLLAMA_MODELS`  
更多环境变量配置可以去github上看[文档](https://github.com/ollama/ollama/tree/main/docs)或者我整理的[一部分](https://blog.zmal.top/2025/0318/how-to-reposition-the-model-and-windows-to-view-environmental-variables)

## 拉取并启动模型
```pwsh
ollama run hf.co/Trina-QwQ/wt-neko-instruct
```

>
>https://ollama.com/
>https://huggingface.co/Trina-QwQ/wt-neko-instruct
>