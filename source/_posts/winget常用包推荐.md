---
title: winget常用包推荐
Translate_title: winget-common-package-recommendations
date: 2026-10-10 23:04:40
tags:
  - winget
  - Windows
  - 笔记
---
winget 是 Windows 自带的包管理器（Win10 1809+ / Win11），安装、升级、卸载都能一条命令搞定。下面是我自己留的一份清单，按用途分组，仅供参考。

<!-- more -->
## 终端与命令行

### PowerShell 7
系统自带的是 Windows PowerShell 5.1（基于 .NET Framework，已不再增加新功能）；这条装的是跨平台的 PowerShell 7，仍在活跃更新，管道与语法更现代。可执行文件是 `pwsh`，与自带的 `powershell` 共存互不影响。

指定安装 **MSI 版**

```powershell
winget install --id Microsoft.PowerShell --source winget --installer-type wix
```

官网：[microsoft.com/PowerShell](https://microsoft.com/PowerShell)

### Oh My Posh
终端提示符（prompt）主题引擎，支持 pwsh / bash / zsh。能让提示符显示 Git 分支、当前路径、语言版本、上条命令耗时等信息。它只负责显示，不改变 shell 本身的行为，卸载也不会影响终端使用。

```powershell
winget install --id JanDeDobbeleer.OhMyPosh
```

官网：[ohmyposh.dev](https://ohmyposh.dev/)

### GitHub CLI
GitHub 官方命令行工具，命令是 `gh`。在终端里就能开 PR、提 Issue、看 Actions 日志、发 Release，不必来回切浏览器。执行 `gh auth login` 登录后，再跑一次 `gh auth setup-git` 可以把 Git 的凭据一并配好，之后推私有仓库不会再反复弹登录框。

```powershell
winget install --id GitHub.cli
```

官网：[cli.github.com](https://cli.github.com/)

## 运行时与包管理

### Node.js
JavaScript 运行时，装完同时得到 `node` 和 `npm`。前端工具链、各类 CLI 大多依赖它，属于装了不亏的基础件。

```powershell
winget install --id OpenJS.NodeJS
```

官网：[nodejs.org](https://nodejs.org/)

### Bun
把 JavaScript 运行时、打包器、测试运行器、包管理器合到一起的工具，速度是它的主要卖点。`bun install` 明显快于 npm，也能直接 `bun run` 执行脚本和 TypeScript 文件，无需额外配置。

```powershell
winget install --id Oven-sh.Bun
```

官网：[bun.sh](https://bun.sh/)

### uv
用 Rust 写的 Python 包与项目管理器，官方定位是用一个工具替代 pip、pip-tools、pipx、poetry、pyenv、virtualenv、twine 等一整套。装 Python 版本、建虚拟环境、解析并安装依赖都是秒级完成。

```powershell
winget install --id=astral-sh.uv -e
```

官网：[github.com/astral-sh/uv](https://github.com/astral-sh/uv)

### Java 25

```powershell
winget  install --id Oracle.JDK.25
```

## 编辑器与多媒体

### VS Code
微软的免费代码编辑器，扩展生态庞大，配合上面这些运行时几乎能写任何语言。Windows 上还会装好 `code` 命令，可以在终端里直接打开文件或目录。

```powershell
winget install --id Microsoft.VisualStudioCode
```

官网：[code.visualstudio.com](https://code.visualstudio.com/)

### FFmpeg
多媒体处理的万金油：格式转换、裁剪、拼接、压制、抽取音轨/字幕、录制等都靠它。本身是命令行工具，很多图形界面的剪辑/下载软件也依赖它，装了能省掉一大堆“缺少 ffmpeg”的报错。

```powershell
winget install --id Gyan.FFmpeg
```

官网：[ffmpeg.org](https://ffmpeg.org/)

## Windows 实用工具

### Everything
基于 NTFS 索引的文件名搜索工具，输入关键字瞬间出结果，比系统自带搜索快几个数量级。常驻之后，找文件基本可以替代资源管理器的搜索框。

```powershell
winget install --id voidtools.Everything --exact --source winget
```

官网：[voidtools.com](https://www.voidtools.com/zh-cn/)

### ES（Everything CLI）
Everything 的命令行接口（`es.exe`），查询的是同一份索引。除了在终端里找文件，更适合写进脚本做批量处理，比如按扩展名或路径列出文件再交给其它命令，不必先打开图形界面。

```powershell
winget install --id voidtools.Everything.Cli --exact --source winget
```

官网：[github.com/voidtools/es](https://github.com/voidtools/es)

### Inno Setup
把程序打包成带安装向导的 `setup.exe` 的工具，开源、脚本驱动（`.iss`）。下面两条对应**两个不同的主版本，可以同时安装**：`JRSoftware.InnoSetup.7` 是新的主版本，`JRSoftware.InnoSetup` 是上一代主版本（Inno Setup 6）。两者安装脚本语法有差异，老项目的打包脚本通常还在 6 上跑，所以按需安装即可，都装也不冲突。

```powershell
winget install --id JRSoftware.InnoSetup.7 -e -s winget -i
winget install --id JRSoftware.InnoSetup -e -s winget -i
```

官网：[jrsoftware.org](https://jrsoftware.org/isinfo.php)

## 命令中的参数

| 参数                              | 含义                             |
| ------------------------------- | ------------------------------ |
| `-e` / `--exact`                | ID 精确匹配，避免模糊匹配装错包              |
| `-s winget` / `--source winget` | 只在 winget 源中查找，跳过 msstore 等其它源 |
| `-i` / `--interactive`          | 交互式安装，部分安装包需要你手动选择选项           |
| `-h` / `--silent`               | 无提示静默安装（注意这里的 `-h` 不是 help）    |
| `-?` / `--help`                 | 查看该子命令的帮助（短参数是 `-?`）           |


批量或无人值守安装时，加上这两个参数就不用再手动确认协议：

```powershell
winget install --id xxx --accept-package-agreements --accept-source-agreements
```

查看可升级项与一键全部升级：

```powershell
winget upgrade        # 列出可升级的软件
winget upgrade --all  # 全部升级
```