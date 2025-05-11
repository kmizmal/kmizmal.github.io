---
title: Git仓库操作
date: 2025-04-03 21:30:34
tags:
  - 笔记
  - 知识
---
以下是 Git 常用仓库操作命令及示例文档：

---

### **1. 初始化仓库**
```bash
git init
```
- **说明**：将当前目录初始化为 Git 仓库。
- **示例**：
  ```bash
  mkdir my-project && cd my-project
  git init
  ```

---
<!-- more -->
### **2. 克隆远程仓库**
```bash
git clone <远程仓库地址>
```
- **说明**：克隆远程仓库到本地。
- **示例**：
  ```bash
  git clone https://github.com/user/repo.git
  git clone git@github.com:user/repo.git  # SSH 方式
  ```

---

### **3. 关联远程仓库**
```bash
git remote add <远程仓库别名> <远程仓库地址>
```
- **说明**：将本地仓库与远程仓库关联。
- **示例**：
  ```bash
  git remote add origin https://github.com/user/repo.git
  ```

---

### **4. 查看远程仓库信息**
```bash
git remote -v                   # 查看所有远程仓库地址
git remote show <远程仓库别名>  # 查看某个远程仓库详细信息
```
- **示例**：
  ```bash
  git remote -v
  git remote show origin
  ```

---

### **5. 拉取远程仓库更新**
```bash
git pull <远程仓库别名> <分支名>  # 拉取并合并代码
git fetch <远程仓库别名>         # 仅获取更新不合并
```
- **示例**：
  ```bash
  git pull origin main       # 拉取并合并 origin/main 分支
  git fetch origin           # 获取 origin 仓库的所有更新
  ```

---

### **6. 推送本地代码到远程**
```bash
git push <远程仓库别名> <本地分支名>:<远程分支名>
```
- **示例**：
  ```bash
  git push origin main              # 推送本地 main 分支到 origin/main
  git push origin feature:dev       # 推送本地 feature 分支到远程 dev 分支
  git push -u origin main           # 首次推送并关联上游分支（后续可直接 `git push`）
  ```

---

### **7. 删除远程分支**
```bash
git push <远程仓库别名> --delete <远程分支名>
```
- **示例**：
  ```bash
  git push origin --delete old-branch
  ```

---

### **8. 添加多个远程仓库**
```bash
git remote add <新别名> <新仓库地址>
```
- **示例**（同时关联 GitHub 和 Gitee）：
  ```bash
  git remote add github https://github.com/user/repo.git
  git remote add gitee https://gitee.com/user/repo.git
  ```

---

### **9. 重命名远程仓库别名**
```bash
git remote rename <旧别名> <新别名>
```
- **示例**：
  ```bash
  git remote rename origin upstream
  ```

---

### **10. 删除远程仓库关联**
```bash
git remote remove <远程仓库别名>
```
- **示例**：
  ```bash
  git remote remove origin
  ```

---

### **11. 清理无效远程分支引用**
```bash
git remote prune <远程仓库别名>
```
- **说明**：删除本地已失效的远程分支引用。
- **示例**：
  ```bash
  git remote prune origin
  ```

---

### **12. 推送所有标签到远程**
```bash
git push <远程仓库别名> --tags
```
- **示例**：
  ```bash
  git push origin --tags
  ```

---

### **常用场景示例**

#### **场景 1：克隆仓库并推送修改**
```bash
git clone https://github.com/user/repo.git
cd repo
# 修改代码后提交
git add .
git commit -m "Update code"
git push origin main
```

#### **场景 2：关联已有本地仓库到远程**
```bash
cd existing-project
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/user/repo.git
git push -u origin main
```

#### **场景 3：同步多个远程仓库**
```bash
# 同时推送到 GitHub 和 Gitee
git push github main
git push gitee main
```

---

通过以上命令，你可以完成 Git 仓库的日常操作。如需更高级功能（如子模块、Hook 等），可参考 Git 官方文档。