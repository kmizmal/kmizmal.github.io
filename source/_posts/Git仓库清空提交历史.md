---
title: Git仓库清空提交历史
Translate_title: Git-Repository-Empty-Submission-History
comments: true
tags:
  - 知识
  - 笔记
  - GitHub
published: true
layout: post
date: 2025-03-19 18:48:25
updated: 2025-03-20 17:45:17
---

~~绝对不是因为我的仓库提交历史太乱~~

# 1. 创建一个新的孤立分支

```bash
git checkout --orphan new_branch
```

# 2. 添加所有文件

```bash
git add .
```

# 3. 提交新的初始提交

```bash
git commit -m "初始化"
```

# 4. 删除旧的 main（或 master）分支

```bash
git branch -D main  # 如果原分支是 master，就改成 master
```

# 5. 将新分支改名为 main（或 master）

```bash
git branch -m main
```

# 6. 强制推送新历史（覆盖旧历史）

```bash
git push -f origin main
```
