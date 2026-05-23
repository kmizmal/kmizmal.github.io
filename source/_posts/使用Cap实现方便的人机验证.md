---
title: 使用Cap实现方便的人机验证
date: 2025-10-19 17:53:00
tags: 笔记
---

[Cap](https://capjs.js.org/) 是一种现代、轻量级、开源的验证码替代方案，使用 SHA-256 工作量证明。

![image](https://github.com/kmizmal/picx-images-hosting/raw/master/image.1sffsfs4x2.webp)
![image](https://github.com/kmizmal/picx-images-hosting/raw/master/image.szcf9p6ow.webp)

<!-- more -->

## 客户端

### 首先添加从 CDN 导入 Cap 小部件库：

```html
<script src="https://cdn.jsdelivr.net/npm/@cap.js/widget@0.1.28"></script>
```

or

```html
<script src="https://unpkg.com/@cap.js/widget@0.1.28"></script>
```

在某些场景也可以使用`pnpm add "@cap.js/widget"`,cdn 不是必须的

### 接下来，将 <cap-widget> 组件添加到 HTML 中。

```html
<cap-widget id="cap" data-cap-api-endpoint="<your cap endpoint>"></cap-widget>
```

然后，在 JavaScript 中，监听 solve 事件以在生成时捕获令牌：

```js
const widget = document.querySelector("#cap");

widget.addEventListener("solve", function (e) {
  const token = e.detail.token;

  // Handle the token as needed
});
```

如果使用`vue`可以这样用

```js
<cap-widget
  id="cap"
  :data-cap-api-endpoint="capApiEndpoint"
  @solve="handleSolve"
></cap-widget>
```

```js
const capApiEndpoint = import.meta.env.VITE_SERVER + "/cap/";
const capToken = ref(null);
const handleSolve = (event) => {
  capToken.value = event?.detail?.token ?? event?.token ?? null;
};
```

环境变量`VITE_SERVER`对应`<your cap endpoint>`之后服务端会提及

## 服务端

官方推荐使用[`Standalone server`](https://capjs.js.org/guide/standalone/)，但是这需要 docker 我觉得太麻烦了，这里基于`@cap.js/server`自主实现服务端

### `@cap.js/server` 是 Cap 的服务器端库，用于创建和验证挑战。使用您喜欢的包管理器安装它：

```bash
pnpm i "@cap.js/server"
```

### 开始

使用 Cap 的最佳方式是使用连接到数据库的存储挂钩  
官方用的`SQlite`我还是不喜欢,这里用`Redis`实现

```js
import Cap from "@cap.js/server";
import Redis from "ioredis";

const redis = new Redis({
  host: redisHost,
  port: redisPort,
  db: redisDb,
  // password: "your_password", // no password for now
  lazyConnect: true,
});

const cap = new Cap({
  storage: {
    challenges: {
      // 保存挑战信息
      store: async (token, challengeData) => {
        const key = `cap:challenge:${token}`;
        const ttlSeconds = Math.floor(
          (challengeData.expires - Date.now()) / 1000
        );

        if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
          await redis.del(key);
          return;
        }

        await redis.set(key, JSON.stringify(challengeData), "EX", ttlSeconds);
      },

      // 读取挑战信息
      read: async (token) => {
        const key = `cap:challenge:${token}`;
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
      },

      // 删除挑战
      delete: async (token) => {
        await redis.del(`cap:challenge:${token}`);
      },

      // 删除过期挑战（Redis 会自动清理）
      deleteExpired: async () => {},
    },

    tokens: {
      store: async (key, expires) => {
        const ttlSeconds = Math.floor((expires - Date.now()) / 1000);
        const redisKey = `cap:token:${key}`;

        if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
          await redis.del(redisKey);
          return;
        }

        await redis.set(redisKey, String(expires), "EX", ttlSeconds);
      },

      get: async (key) => {
        const data = await redis.get(`cap:token:${key}`);
        if (!data) return null;

        const expires = Number(data);
        return Number.isFinite(expires) ? expires : null;
      },

      delete: async (key) => {
        await redis.del(`cap:token:${key}`);
      },

      deleteExpired: async () => {},
    },
  },
});

export default cap;
```

如果你的`Redis`也加入了环境变量并且懒得自己启动可以参考下面这个版本

```js
import Cap from "@cap.js/server";
import Redis from "ioredis";
import { spawn } from "child_process";
import { createConnection } from "net";

const redisHost = process.env.REDIS_HOST ?? "127.0.0.1";
const redisPort = toNumber(process.env.REDIS_PORT, 6379);
const redisDb = toNumber(process.env.REDIS_DB, 0);
const redisServerCommand = process.env.REDIS_SERVER_PATH ?? "redis-server";
const redisBootTimeoutMs = toNumber(process.env.REDIS_BOOT_TIMEOUT_MS, 5000);
const redisBootPollIntervalMs = Math.max(
  toNumber(process.env.REDIS_BOOT_POLL_INTERVAL_MS, 200),
  50
);
const redisStartArgs = process.env.REDIS_SERVER_ARGS
  ? process.env.REDIS_SERVER_ARGS.split(" ").filter(Boolean)
  : [];

let managedRedisProcess = null;
let ensureRedisPromise = null;
let terminationHookRegistered = false;

function toNumber(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRedisReady(host, port) {
  return new Promise((resolve) => {
    const socket = createConnection({ host, port });

    const finalize = (result) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(result);
    };

    socket.once("connect", () => finalize(true));
    socket.once("error", () => finalize(false));
    socket.setTimeout(1000, () => finalize(false));
  });
}

function registerTerminationHook() {
  if (terminationHookRegistered) {
    return;
  }

  terminationHookRegistered = true;

  process.on("exit", () => {
    if (managedRedisProcess && !managedRedisProcess.killed) {
      managedRedisProcess.kill();
    }
  });
}

function startRedisProcess() {
  return new Promise((resolve, reject) => {
    try {
      const child = spawn(redisServerCommand, redisStartArgs, {
        stdio: "ignore",
        windowsHide: true,
      });

      managedRedisProcess = child;
      registerTerminationHook();

      const cleanup = () => {
        child.removeListener("error", handleError);
        child.removeListener("spawn", handleSpawn);
      };

      const handleError = (error) => {
        cleanup();
        managedRedisProcess = null;
        reject(
          new Error(
            `Failed to start redis-server: ${error?.message ?? String(error)}`
          )
        );
      };

      const handleSpawn = () => {
        cleanup();
        child.on("exit", (code, signal) => {
          managedRedisProcess = null;
          if (code !== 0) {
            console.warn(
              `[cap] redis-server exited unexpectedly (code: ${code}${
                signal ? `, signal: ${signal}` : ""
              })`
            );
          }
        });
        resolve();
      };

      child.once("error", handleError);
      child.once("spawn", handleSpawn);
      child.unref();
    } catch (error) {
      reject(
        new Error(
          `Unexpected error while starting redis-server: ${
            error?.message ?? String(error)
          }`
        )
      );
    }
  });
}

async function ensureRedisRunning() {
  if (ensureRedisPromise) {
    return ensureRedisPromise;
  }

  ensureRedisPromise = (async () => {
    if (await isRedisReady(redisHost, redisPort)) {
      return;
    }

    await startRedisProcess();

    const deadline = Date.now() + redisBootTimeoutMs;
    while (Date.now() < deadline) {
      if (await isRedisReady(redisHost, redisPort)) {
        return;
      }
      await delay(redisBootPollIntervalMs);
    }

    throw new Error(
      `Redis did not become ready within ${redisBootTimeoutMs}ms`
    );
  })();

  try {
    await ensureRedisPromise;
  } finally {
    ensureRedisPromise = null;
  }
}

const redis = new Redis({
  host: redisHost,
  port: redisPort,
  db: redisDb,
  // password: "your_password", // no password for now
  lazyConnect: true,
});

(async () => {
  try {
    await ensureRedisRunning();
  } catch (error) {
    // Log failure but let ioredis continue retrying
    console.error("[cap] Redis auto-start failed:", error);
  } finally {
    try {
      if (redis.status === "wait" || redis.status === "end") {
        await redis.connect();
      }
    } catch (connectError) {
      console.error("[cap] Redis connection failed:", connectError);
    }
  }
})();

const cap = new Cap({
  storage: {
    challenges: {
      // 保存挑战信息
      store: async (token, challengeData) => {
        const key = `cap:challenge:${token}`;
        const ttlSeconds = Math.floor(
          (challengeData.expires - Date.now()) / 1000
        );

        if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
          await redis.del(key);
          return;
        }

        await redis.set(key, JSON.stringify(challengeData), "EX", ttlSeconds);
      },

      // 读取挑战信息
      read: async (token) => {
        const key = `cap:challenge:${token}`;
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
      },

      // 删除挑战
      delete: async (token) => {
        await redis.del(`cap:challenge:${token}`);
      },

      // 删除过期挑战（Redis 会自动清理）
      deleteExpired: async () => {},
    },

    tokens: {
      store: async (key, expires) => {
        const ttlSeconds = Math.floor((expires - Date.now()) / 1000);
        const redisKey = `cap:token:${key}`;

        if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
          await redis.del(redisKey);
          return;
        }

        await redis.set(redisKey, String(expires), "EX", ttlSeconds);
      },

      get: async (key) => {
        const data = await redis.get(`cap:token:${key}`);
        if (!data) return null;

        const expires = Number(data);
        return Number.isFinite(expires) ? expires : null;
      },

      delete: async (key) => {
        await redis.del(`cap:token:${key}`);
      },

      deleteExpired: async () => {},
    },
  },
});

export default cap;
```

~~Codex 上大分~~

实际上只需要能完成`Cap`需要的[方法](https://capjs.js.org/guide/server.html#methods-and-arguments)用什么方法都可以，甚至你可以直接使用内存中的变量  
`new Cap({ ... })`

```json
{
  // used for json keyval storage. storage hooks are recommended instead
  "tokens_store_path": ".data/tokensList.json",

  // disables all filesystem operations, usually used along editing the state. storage hooks are recommended instead
  "noFSState": false,

  "disableAutoCleanup": false,

  "storage": {
    "challenges": {
      "store": "async (token, challengeData) => {}",
      "read": "async (token) => {}",
      "delete": "async (token) => {}",
      "deleteExpired": "async () => {}"
    },
    "tokens": {
      "store": "async (tokenKey, expires) => {}",
      "get": "async (tokenKey) => {}",
      "delete": "async (tokenKey) => {}",
      "deleteExpired": "async () => {}"
    }
  },

  "state": {
    "challengesList": {},
    "tokensList": {}
  }
}
```

### 之后，需要创建一个前端访问的路由，也就是`<your cap endpoint>`的部分

这里放我的`express`示例，[官方文档](https://capjs.js.org/guide/server.html)还提供了`Elysia`,`Fastify`的示例可以参考喵

```js
import express from "express";
import cap from "../services/capServer.js";

const router = express.Router();
router.use(express.json());

// 提供验证码图片接口
router.post("/challenge", async (req, res) => {
  res.json(await cap.createChallenge());
});

// 验证接口
router.post("/redeem", async (req, res) => {
  const { token, solutions } = req.body;
  if (!token || !solutions) {
    return res.status(400).json({ success: false });
  }
  res.json(await cap.redeemChallenge({ token, solutions }));
});

export default router;
```

`import cap from "../services/capServer.js";`
需要替换为之前实现`cap`的具体文件

我在`app.js`使用

```js
app.use("/cap", cap);
```

将它挂载到了`/cap`路由，所以我的`<your cap endpoint>`为`import.meta.env.VITE_SERVER + "/cap/"`,你需要根据实际情况更改喵

### 验证

到这里已经前端已经可以获取并实现人机验证了，但仍然需要在服务端校验 captoken 的有效性
比如在恰当的地方

```js
if (!capToken) {
  return res.status(400).json({ error: "未完成人机验证" });
} else {
  // 验证 capToken
  const { success } = await cap.validateToken(capToken);
  // console.log(`captoken==>${capToken}, validate result=>${success}`);
  if (!success) return res.status(400).json({ error: "未完成人机验证" });
}
```

`capToken`需要前端在处理你的请求时再发送回后端

> 只有完成`cap.validateToken(capToken)`返回`true`才算真正完成人机验证！
