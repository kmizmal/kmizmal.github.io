---
title: finallssh离线激活
date: 2025-05-11 11:04:55
tags: 
  - 知识
  - 转载
---
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>FinalShell 离线激活码生成 </title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
  <style>
    body {font-family: sans-serif; padding: 2rem; background: #f5f5f5;}
    .box {background: white; padding: 2rem; border-radius: 8px; max-width: 500px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    input, button {padding: 0.5rem; width: 100%; margin-top: 1rem;}
    .result {margin-top: 1.5rem; white-space: pre-wrap;}
  </style>
</head>
<body>
  <div class="box">
    <h2 id='pk-menu-3'> 离线激活码生成器 </h2>
    <input id="machineCode" type="text" placeholder=" 请输入机器码..." />
    <button onclick="generate()"> 生成授权码 </button>
    <div class="result" id="output"></div>
  </div>
 
  <script>
    function md5(str) {return CryptoJS.MD5(str).toString();}
 
    function keccak384(str) {return CryptoJS.SHA3(str, { outputLength: 384}).toString();}
 
    function generate() {const code = document.getElementById('machineCode').value.trim();
      const out = document.getElementById('output');
      let res = '';
 
      res += 'FinalShell < 3.9.6\n';
      res += '高级版:' + md5('61305' + code + '8552').slice(8, 24) + '\n';
      res += '专业版:' + md5('2356' + code + '13593').slice(8, 24) + '\n\n';
 
      res += 'FinalShell ≥ 3.9.6\n';
      res += '高级版:' + keccak384(code + 'hSf(78cvVlS5E').slice(12, 28) + '\n';
      res += '专业版:' + keccak384(code + 'FF3Go(*Xvbb5s2').slice(12, 28) + '\n\n';
 
      res += 'FinalShell 4.5\n';
      res += '高级版:' + keccak384(code + 'wcegS3gzA$').slice(12, 28) + '\n';
      res += '专业版:' + keccak384(code + 'b(xxkHn%z);x').slice(12, 28) + '\n';
 
      out.textContent = res;
    }
  </script>
</body>
</html>
 ```
 #FinalShell
127.0.0.1 www.youtusoft.com
127.0.0.1 youtusoft.com
127.0.0.1 hostbuf.com
127.0.0.1 www.hostbuf.com
127.0.0.1 dkys.org
127.0.0.1 tcpspeed.com
127.0.0.1 www.wn1998.com
127.0.0.1 wn1998.com
127.0.0.1 pwlt.wn1998.com
127.0.0.1 backup.www.hostbuf.com
```
