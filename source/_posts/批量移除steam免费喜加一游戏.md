---
title: 批量移除steam免费喜加一游戏
date: 2025-06-24 21:53:04
tags:
  - Steam
  - 笔记
  - 教程
---

之前年轻不懂事，在挂卡 ASF 的都很好顺手开了自动入库免费游戏，刚开始看着我仓库里越来越多的游戏还挺开心的。直到后面找不到我想玩的游戏才发现不对劲。 大量免费游戏占据了我的库![image](https://img.zmal.top/2025/0727/image.83acejyb99.jpg)

<!-- more -->

受 <https://blog.csdn.net/qq_43479164/article/details/121252752> 的启发再拿 ds 和 gpt 优化了一点点写出了下面这个 js 脚本

```js
(async () => {
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const REMOVE_DELAY = 3000; // 请求间隔时间 3s
  let removedCount = 1; // 成功移除计数器

  // 获取所有免费游戏元素
  const items = document.getElementsByClassName("free_license_remove_link");

  for (let item of items) {
    try {
      const anchor = item.querySelector("a");
      //<a href="javascript:RemoveFreeLicense( 308617, 'TW9uc3RlcxxDbGlxx2VyxxogSWRsXXBIYWxsb3dlZW4gXXXyYXRlZ3k=' );">移除</a>
      if (!anchor) continue; // 跳过无效项

      const packageID = anchor
        .getAttribute("href")
        .match(/RemoveFreeLicense\(\s*(\d+)/i)?.[1];
      if (!packageID) continue;

      // 延迟防止请求过快
      if(removedCount>12&&removedCount%2==0) await delay(REMOVE_DELAY * 20 * 8); //8 min

      // 发送移除请求 - 使用Promise包装AJAX调用
      await new Promise((resolve, reject) => {
        $J.ajax({
          url: "https://store.steampowered.com/account/removelicense",
          type: "POST",
          data: {
            sessionid: window.g_sessionID,
            packageid: packageID,
          },
          success: (response) => {
            if (response.success === 1) {
              console.log(
                `✅ 成功移除 packageID: ${packageID}，累计 ${removedCount++} 个`,
              );
              resolve();
            } else {
              const time = new Date().toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              });
              console.warn(
                `⚠️ 返回值不为1，移除失败 packageID: ${packageID} (${time})`,
              );
              // 失败时增加延迟
              setTimeout(() => resolve(), REMOVE_DELAY * 20 * 18); //18 min
            }
          },
          error: (error) => {
            console.error(`❌ 请求失败 packageID: ${packageID}`, error);
            // 错误时增加延迟
            setTimeout(() => resolve(), REMOVE_DELAY * 20 * 30);
          },
        });
      });
    } catch (e) {
      console.error("❗ 异常，跳过此项：", e);
      await delay(REMOVE_DELAY);
    }
  }

  console.log(`🎉 全部完成！共移除了 ${removedCount} 个免费项目`);
})();


```

油猴

```js
// ==UserScript==
// @name         Steam 免费游戏自动移除
// @namespace    https://store.steampowered.com/
// @version      1.3
// @description  自动移除 Steam 账户中的免费许可证（可刷新后自动执行）
// @author       zmal &Co-Authored-By DeepSeek
// @match        https://store.steampowered.com/account/licenses/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(async () => {
  'use strict';

  // ---------- 配置 ----------
  const REMOVE_DELAY = 3000;      // 基础间隔 3s
  const LONG_REST = REMOVE_DELAY * 20 * 8;   // 长休息（8 min）

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ---------- 从元素中提取 packageID ----------
  function extractPackageID(item) {
    const anchor = item.querySelector('a');
    if (!anchor) return null;
    const href = anchor.getAttribute('href');
    if (!href) return null;
    return href.match(/RemoveFreeLicense\(\s*(\d+)/i)?.[1] ?? null;
  }

  // ---------- 等待页面关键元素出现，并返回 { item, packageID } 列表 ----------
  function waitForItems(timeout = 30000) {
    return new Promise((resolve) => {
      const collect = () => {
        const links = document.getElementsByClassName('free_license_remove_link');
        const result = [];
        for (const item of Array.from(links)) {
          const packageID = extractPackageID(item);
          if (packageID) result.push({ item, packageID });
        }
        return result;
      };

      const initial = collect();
      if (initial.length) return resolve(initial);

      const observer = new MutationObserver(() => {
        const items = collect();
        if (items.length) {
          observer.disconnect();
          resolve(items);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        resolve(collect());
      }, timeout);
    });
  }

  // 刷新前倒计时提示
  async function countdownAndRefresh(seconds) {
    for (let i = seconds; i > 0; i--) {
      console.log(`🔄 ${i} 秒后自动刷新页面...（可在控制台执行 sessionStorage.clear() 停止）`);
      await delay(1000);
    }
    location.reload();
  }

  // ---------- 单次移除请求 ----------
  function removeLicense(packageID) {
    return new Promise((resolve) => {
      window.$J.ajax({
        url: 'https://store.steampowered.com/account/removelicense',
        type: 'POST',
        data: {
          sessionid: window.g_sessionID,
          packageid: packageID,
        },
        success: (response) => resolve(response),
        error: (err) => resolve({ success: 0, _error: err }),
      });
    });
  }

  // ---------- 主流程 ----------
  const items = await waitForItems();
  if (!items.length) {
    console.log('ℹ️ 未找到可移除的 free_license_remove_link，可能已全部移除或页面结构变化');
    return;
  }

  const total = items.length;
  let removedCount = 0;   // 只统计“成功移除”的数量
  let processed = 0;      // 已处理的条目数

  console.log(`🚀 共发现 ${total} 个待处理项`);

  for (const { packageID } of items) {
    processed++;
    try {
      if (removedCount > 12 && removedCount % 2 === 0) await delay(LONG_REST);

      const response = await removeLicense(packageID);

      if (response && response.success === 1) {
        removedCount++;
        console.log(`✅ 成功移除 packageID: ${packageID}，累计 ${removedCount} 个`);
      } else {
        const time = new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        console.warn(`⚠️ 移除失败 packageID: ${packageID} (${time})`, response);
        await delay(REMOVE_DELAY * 20 * 18); // 18 min
        continue;
      }

      // 正常节奏的间隔
      await delay(REMOVE_DELAY);
    } catch (e) {
      console.error(`❗ 异常，跳过 packageID ${packageID}：`, e);
      await delay(REMOVE_DELAY);
    }
  }

  console.log(`🎉 全部完成！成功移除 ${removedCount} 个（共处理 ${processed} 项）`);
  await countdownAndRefresh(REMOVE_DELAY);
})();
```

## 食用方法

打开 [steam 的许可证页面](https://store.steampowered.com/account/licenses/)正常登录之后打开控制台粘贴 js 执行即可
![image](https://img.zmal.top/2025/0727/image.icfacs09y.jpg)
如果你和我一样加载不出来也是正常~~自作自受~~的，直接开控制台执行就行，不过因为太多了需要过一会手动刷新页面才能继续

**_加一一时爽，删库火葬场啊。_**
