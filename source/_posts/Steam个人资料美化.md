---
title: Steam个人资料美化
Translate_title: Steam's-personal-data-beautification
comments: true
tags:
  - steam
published: true
layout: post
date: 2025-03-21 07:19:51
updated: 2025-03-26 20:59:22
---

[创意工坊链接](https://steamcommunity.com/workshop/edititem/570/11)
[上传艺术作品](https://steamcommunity.com/sharedfiles/edititem/767/3/)

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


> 参考资料
>- https://blog.yuki.sh/posts/daf9288c81ba/
>- https://bili33.top/posts/Steam-Artwork/
>- https://nanodaovo.github.io/2024/03/19/steam_background_beautify/
>- https://steamcommunity.com/sharedfiles/filedetails/?id=3410802985