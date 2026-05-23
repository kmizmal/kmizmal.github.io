---
title: Steam个人资料美化
Translate_title: Steam's-personal-data-beautification
comments: true
tags:
  - Steam
  - 知识
  - 美化
published: true
layout: post
date: 2025-03-21 07:19:51
updated: 2025-03-26 20:59:22
---

[创意工坊链接](https://steamcommunity.com/workshop/edititem/570/11)
[上传艺术作品](https://steamcommunity.com/sharedfiles/edititem/767/3/)
[切图web](https://steam.design/)
>
If you are using the normal artwork showcase (1 middle and 1 side); for middle artwork, width should be 506 pixels wide and any height. Then side artwork should be 100 pixels and with the same height as the middle if you want it to align.
如果您使用的是普通的图稿展示柜（1 个中间和 1 个侧面）;对于中间图稿，宽度应为 506 像素宽且高度为任意。然后，侧面图稿应为 100 像素，并且与中间图稿的高度相同（如果您希望它对齐）。

If you are using the featured artwork showcase which is only one big middle artwork, then it needs to be 630 pixels wide and any height.
如果您使用的是特色图稿展示，它只有一个大的中间图稿，那么它需要有 630 像素宽和任何高度。
>
艺术作品
js改图
```
$J('#image_width').val(1000).attr('id',''),$J('#image_height').val(1).attr('id','');
```
隐藏作品名称
```
v_trim=_=>{return _},$J('#title').val(' \n'+Array.from(Array(126),_=>'\t').join(''));
```
移除勋章
```
var access_token = $J("[data-loyaltystore]").data("loyaltystore").webapi_token;

var badgeid = 0;

SetFavoriteFeaturedBadge(access_token, badgeid);

function SetFavoriteFeaturedBadge(access_token, badgeid) {

$J.post( 'https://api.steampowered.com/IPlayerService/SetFavoriteBadge/v1?', {

access_token: access_token,

badgeid: badgeid

});

}
```

[我的个人资料](https://steamcommunity.com/id/kmizmal/)

> 参考资料
>- https://blog.yuki.sh/posts/daf9288c81ba/
>- https://bili33.top/posts/Steam-Artwork/
>- https://nanodaovo.github.io/2024/03/19/steam_background_beautify/
>- https://steamcommunity.com/sharedfiles/filedetails/?id=3410802985