---
title: 批量移除steam免费喜加一游戏
date: 2025-06-24 21:53:04
tags:
  - Steam
  - 笔记
---

之前年轻不懂事，在挂卡 ASF 的都很好顺手开了自动入库免费游戏，刚开始看着我仓库里越来越多的游戏还挺开心的。直到后面找不到我想玩的游戏才发现不对劲。 大量免费游戏占据了我的库![image](https://img.zmal.top/20250727/image.83acejyb99.jpg)

<!-- more -->

受 https://blog.csdn.net/qq_43479164/article/details/121252752 的启发再拿 ds 和 gpt 优化了一点点写出了下面这个 js 脚本

```js
(async () => {
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const REMOVE_DELAY = 3000; // 请求间隔时间
  let removedCount = 0; // 成功移除计数器

  // 获取所有免费游戏元素
  const items = document.getElementsByClassName("free_license_remove_link");

  for (let item of items) {
    try {
      const anchor = item.querySelector("a");
      if (!anchor) continue; // 跳过无效项

      const packageID = anchor.href.match(/\d+/)?.[0];
      if (!packageID) continue;

      // 延迟防止请求过快
      await delay(REMOVE_DELAY * removedCount);

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
              removedCount++;
              console.log(
                `✅ 成功移除 packageID: ${packageID}，累计 ${removedCount} 个`
              );
              resolve();
            } else {
              console.warn(`⚠️ 返回值不为1，移除失败 packageID: ${packageID}`);
              // 失败时增加延迟
              setTimeout(() => resolve(), REMOVE_DELAY * removedCount * 2);
            }
          },
          error: (xhr, status, error) => {
            console.error(`❌ 请求失败 packageID: ${packageID}`, error);
            // 错误时增加延迟
            setTimeout(() => resolve(), REMOVE_DELAY);
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

# 食用方法

打开 [steam 的许可证页面](https://store.steampowered.com/account/licenses/)正常登录之后打开控制台粘贴 js 执行即可
![image](https://img.zmal.top/20250727/image.icfacs09y.jpg)
如果你和我一样加载不出来也是正常~~自作自受~~的，直接开控制台执行就行，不过因为太多了需要过一会手动刷新页面才能继续

**_加一一时爽，删库火葬场啊。_**
