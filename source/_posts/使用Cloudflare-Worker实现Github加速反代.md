---
title: 使用Cloudflare Workers实现Github加速反代
date: 2025-06-12 13:03:32
tags:
  - 笔记
  - 服务
---
虽然cf在国内也会收到gfw的影响，但相对来说比GitHub好好多，故在赛博大善人的workers服务上部署了一个反代服务，主要是给朋友们用及特殊情况应急
<!-- more -->
为避免滥用反代脚本屏蔽了部分敏感路径

```
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

// 配置常量
const BLOCKED_PATHS = [
  '/login', '/signup', '/session', '/settings',
  '/oauth', '/auth', '/account', '/user', '/new',
  '/marketplace', '/notifications'
]
const BLOCKED_COOKIES = ['user_session', '_gh_sess', 'logged_in']
const CACHE_WHITELIST = ['image', 'font', 'script', 'stylesheet']
const GIT_PROTOCOL_PATHS = ['/info/refs', '/git-upload-pack', '/git-receive-pack']

async function handleRequest(event) {
  const request = event.request
  const url = new URL(request.url)

  // --- 安全拦截阶段 ---
  if (isBlockedRequest(url)) {
    return createBlockedResponse()
  }

  // --- 请求改写阶段 ---
  const upstreamUrl = buildGitHubUrl(url)
  const newRequest = rewriteRequest(request, upstreamUrl)

  // --- 代理请求阶段 ---
  let response = await fetch(newRequest)

  // --- 响应处理阶段 ---
  return processResponse(response, url.hostname)
}

// 安全检测函数
function isBlockedRequest(url) {
  const path = url.pathname.toLowerCase()
  
  // 拦截登录相关路径
  if (BLOCKED_PATHS.some(p => path.startsWith(p))) {
    return true
  }

  // 拦截敏感文件请求
  if (path.includes('/.env') || path.endsWith('.php')) {
    return true
  }

  return false
}

// 构建 GitHub 目标 URL
function buildGitHubUrl(originalUrl) {
  const url = new URL(originalUrl)
  url.hostname = 'github.com'
  
  // Git 协议特殊处理
  if (GIT_PROTOCOL_PATHS.some(p => url.pathname.includes(p))) {
    url.pathname = url.pathname.replace(/\.git(\/|$)/, '$1')
  }
  
  return url
}

// 请求头改写
function rewriteRequest(originalRequest, upstreamUrl) {
  const headers = new Headers(originalRequest.headers)
  
  // 移除敏感 Cookie
  BLOCKED_COOKIES.forEach(c => headers.delete(c))
  
  // 修正协议头
  headers.set('Host', 'github.com')
  headers.set('X-Forwarded-Proto', 'https')
  
  // 构建新请求
  return new Request(upstreamUrl, {
    method: originalRequest.method,
    headers: headers,
    body: originalRequest.body,
    redirect: 'manual'
  })
}

// 响应处理
async function processResponse(response, customHost) {
  const contentType = response.headers.get('content-type') || ''
  const isCacheable = CACHE_WHITELIST.some(t => contentType.includes(t))
  
  // 创建可修改的响应副本
  const newResponse = new Response(response.body, response)

  // 内容重写（仅处理文本内容）
  if (contentType.includes('text') || contentType.includes('json')) {
    const text = await response.text()
    const replaced = text.replaceAll('github.com', customHost)
                         .replaceAll('www.github.com', customHost)
    newResponse.headers.set('content-length', replaced.length)
    return new Response(replaced, newResponse)
  }

  // 缓存控制
  if (isCacheable && response.status === 200) {
    newResponse.headers.set('Cache-Control', 'public, max-age=3600')
  } else {
    newResponse.headers.set('Cache-Control', 'no-store')
  }

  // 处理重定向
  if ([301, 302, 303, 307, 308].includes(response.status)) {
    const location = newResponse.headers.get('location')
    if (location && location.includes('github.com')) {
      newResponse.headers.set('location', location.replace('github.com', customHost))
    }
  }

  // 移除敏感头
  newResponse.headers.delete('set-cookie')
  newResponse.headers.delete('x-github-request-id')

  return newResponse
}

// 拦截响应生成
function createBlockedResponse() {
  return new Response('Access Denied', {
    status: 403,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store'
    }
  })
}
```

当然你也可以使用我部署好的现成的服务，但是不保证可用，本人不因此反代服务承担任何责任，仅供学习交流使用，严禁滥用！

使用方法，将任意位置的`github.com`修改为`git.zmal.top`(敏感位置不提供反代服务)  

示例
> 
原：`https://github.com/kmizmal`  
使用反代： `https://git.zmal.top/kmizmal`

原： `https://github.com/kmizmal/Sleepy-Android/releases/latest`  
使用反代：`https://git.zmal.top/kmizmal/Sleepy-Android/releases/latest`
>
***注意*** 


该反代脚本会将页面中绝大部分`github.com`->`git.zmal.top`
如果将来我的反代服务`git.zmal.top`停止维护请自行替换