---
title: 利用Google Mail为域名邮箱提供发件能力
date: 2025-09-25 18:28:22
tags: 
  - 知识
  - 笔记
---
首先需要`登录 Google 账户 → 安全设置`开启[2fa](https://www.microsoft.com/zh-cn/security/business/security-101/what-is-two-factor-authentication-2fa)
<!-- more -->
![image](https://img.zmal.top/20250925/image.26lul1n4ut.jpg)  
之后在下面创建一个`应用专用密码`（名称无所谓，成功会有一个弹窗给出一串分4段的密码，复制保留好，一定不要泄漏！![image](https://img.zmal.top/20250925/image.86u0pryggg.webp)

打开[帐号和导入](https://mail.google.com/mail/u/0/#settings/accounts)页面，点击`用这个地址发送邮件`-`添加其他电子邮件地址`  
会弹出一个新窗口，名称随便填，邮箱填你要发件的地址![image](https://img.zmal.top/20250925/image.96a42y6bjt.webp) 
> 如果无事发生请检查有没有给`mail.google.com` `弹出窗口`的权限喵

下一步`SMTP服务器`填`smtp.google.com`,`用户名`填你Google的用户名,`密码`是刚才创建的`应用专用密码`（要删掉中间的空格喵~）
![image](https://img.zmal.top/20250925/image.41yfdoauxs.webp)

然后Google会往你的邮箱发一封邮件验证这个邮箱的使用权，点击邮件内地址确认喵

现在[返回](https://mail.google.com/mail/u/0/#settings/accounts)就能看见![image](https://img.zmal.top/20250925/image.4ubavf0bk5.webp)这个新的发件地址被成功添加了喵~

正常情况下这里就可以使用Google Mail进行发信了，但是现在`SPF`& `DMARC`是有一点问题的，保险起见可以再去域名服务商添加两个`TXT`记录
- 类型：TXT
名称：@
TTL：自动
内容：
```
"v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all"
```
- 类型：TXT
名称：_dmarc
TTL：自动
内容：
```
"v=DMARC1; p=none; aspf=s; rua=mailto:<your-email-address>"
```
记得替换`<your-email-address>`喵

https://www.mail-tester.com/ 提供免费的邮件安全分数评估服务，我们先向它给我们的地址发一份邮件，之后它会给我们评分喵

![image](https://img.zmal.top/20250925/image.9gwxw4kc20.webp)呜被扣了两分喵，不过我们用免费的服务有这个分数其实也够了喵

> 感谢
- https://blog.hentioe.dev/posts/send-emails-via-gmail-for-cloudflare-domain.html
- https://blog.fishze.com/archives/287