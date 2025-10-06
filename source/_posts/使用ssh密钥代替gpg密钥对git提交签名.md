---
title: 使用ssh密钥代替gpg密钥对git提交签名
date: 2025-09-28 21:42:19
tags:
  - github
  - 笔记
---

如果本地没有 ssh 密钥

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
<!-- more -->

转到`仪表盘`-`settings`-`SSH and GPG keys`-`New SSH key`
`Key type`选`Signing Key`粘贴刚才生成之后输出的.pub 公钥中的内容

配置 Git 使用 SSH 对提交和标记签名  
将 /PATH/TO/.SSH/KEY.PUB 替换为要使用的公钥路径

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/KEY.PUB
```

> [!TIP]
> 若要将 Git 客户端配置为默认对本地存储库的提交进行签名，请在 Git 版本 2.0.0 及更高版本中，运行 `git config commit.gpgsign true`。 要在计算机上的任何本地存储库中默认对所有提交进行签名，请运行`git config --global commit.gpgsign true`。
