---
title: Linux 下常用的解压命令
date: 2025-04-05 22:16:01
tags:
  - 笔记
  - Linux
  - 知识
---

`p7zip-full`、`unzip` 和 `tar` 是 Linux 下常用的压缩与解压工具，以下是它们的常见用法整理。

## 🔧 安装命令

```bash
apt install -y p7zip-full unzip tar
```
<!-- more -->
---

## 📦 1. `7z`（来自 `p7zip-full`）

### ✅ 解压 `.7z` 文件

```bash
7z x file.7z
```

### 📁 压缩文件/文件夹为 `.7z`

```bash
7z a archive.7z file_or_folder
```

### 🔍 查看压缩包内容

```bash
7z l archive.7z
```

### 📂 解压到指定目录

```bash
7z x file.7z -o/path/to/dir
```

> ⚠ 注意：`-o` 后面不能有空格！

---

## 🗂️ 2. `unzip`（解压 `.zip` 文件）

### ✅ 解压 zip 文件

```bash
unzip file.zip
```

### 📂 解压到指定目录

```bash
unzip file.zip -d /path/to/destination
```

### 📝 解压时覆盖已有文件

```bash
unzip -o file.zip
```

### 🔍 仅列出文件内容（不解压）

```bash
unzip -l file.zip
```

---

## 📁 3. `tar`（解压 `.tar` 系列文件）

### ✅ 解压 `.tar`

```bash
tar -xvf file.tar
```

### ✅ 解压 `.tar.gz` / `.tgz`

```bash
tar -xzvf file.tar.gz
```

### ✅ 解压 `.tar.bz2`

```bash
tar -xjvf file.tar.bz2
```

### ✅ 解压 `.tar.xz`

```bash
tar -xJvf file.tar.xz
```

### 📂 指定解压目录

```bash
tar -xzvf file.tar.gz -C /path/to/destination
```

### 🔍 查看压缩包内容

```bash
tar -tvf file.tar.gz
```

---

## 📝 附录：常用参数速查

| 参数 | 含义              |
|------|-------------------|
| `x`  | 解包（extract）   |
| `v`  | 显示详细过程      |
| `f`  | 指定文件名        |
| `z`  | 支持 gzip 解压    |
| `j`  | 支持 bzip2 解压   |
| `J`  | 支持 xz 解压      |
| `-C` | 指定解压目录      |
