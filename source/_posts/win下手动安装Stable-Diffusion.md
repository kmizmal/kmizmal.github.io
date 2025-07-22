---
title: win下手动安装Stable Diffusion
date: 2025-07-20 20:57:05
tags:
  - 笔记
  - GitHub
---

刚开始是在装stability-ai/stablediffusion的，最后发现没有webui又换AUTOMATIC1111/stable-diffusion-webui了，所以文档写的有点乱喵

## 安装 conda

在[这里](https://docs.conda.io/en/latest/)下载`Miniforge`版安装  
我的安装路径是`X:\Soft\conda`,需要将`X:\Soft\conda\Scripts`添加到系统`PATH`变量

```
conda --version
```

如果有版本号输出就说明安装完成了

推荐再顺手改一下常用配置

```
# 换源
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch
conda config --set show_channel_urls yes

#显示每个包对应的下载渠道（channel URL）
conda config --set show_channel_urls yes
#取消自动激活虚拟环境
conda config --set auto_activate_base false

#最大重试次数为 3 次
conda config --set remote_max_retries 3
# 建立连接的超时时间为 10 秒
conda config --set remote_connect_timeout_secs 10
# 设置读取数据时的超时时间为 30 秒
conda config --set remote_read_timeout_secs 30
# 设置“退避因子”为2
conda config --set remote_backoff_factor 2

```

## 克隆仓库

~~安装[git](https://git-scm.com/downloads)不教~~

```
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
cd stable-diffusion-webui
```

## 配置虚拟环境

### 创建虚拟环境

```
conda create -n sd-env python=3.10
```

显示

>

    ```
    done
    #
    # To activate this environment, use
    #
    #     $ conda activate sd-env
    #
    # To deactivate an active environment, use
    #
    #     $ conda deactivate
    ```

> 就成功了，~~失败就多试几遍~~

### 激活虚拟环境

之后运行

```
conda activate sd-env
```

命令行开头出现`(sd-env)`说明成功  
如果失败请尝试

```
conda init powershell
```

之后重试
#### 退出虚拟环境
```
conda deactivate
```
## 安装依赖

~~最痛苦的一集啊啊啊~~
下面的命令都应该在`(sd-env)`开头的虚拟环境中执行

### 基础依赖

```
conda install pytorch==1.12.1 torchvision==0.13.1 -c pytorch
```

如果你也是 4060 或者以上的显卡也可以加装一个`CUDA`,虽然能带来性能提升，但也要准备遇到更多问题的准备

```
conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia
```

慢慢下呗，失败了就重新执行。尤其是`pytorch`，1.19 GB 太难为我了。
实测会通过`conda.anaconda.org`下载这个，还是走的 cf 的线路，支棱不起来啊

> 如果你也破防了可以先安装启用多线程下载 mamba

```
conda install mamba
```

然后使用

```
mamba install pytorch==1.12.1 torchvision==0.13.1 -c pytorch
```

或者作死的

```
mamba install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia
```

### pip 依赖

```
pip install transformers==4.19.2 diffusers invisible-watermark
pip install -e .    #得在项目路径执行
```

但是我还想装`xformers`，~~要在依赖冲突的路上越走越远了~~

```
pip install torch==2.2.0+cu121 torchvision==0.17.0+cu121 torchaudio==2.2.0+cu121 --index-url https://download.pytorch.org/whl/cu121      #不降级就等着依赖冲突吧

pip install xformers==0.0.24
```
## 启动！
```
python launch.py
```
