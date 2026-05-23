---
title: Android长按状态栏磁贴启动activity的方法
date: 2025-06-12 12:53:20
tags:
  - 笔记
---
<!-- more -->
首先需要定义这样的一个服务插件磁贴

```xml
 <service
            android:name=".NoteTiles"
            android:exported="true"
            android:icon="@drawable/p3_122017500"
            android:label="通知开关"
            android:permission="android.permission.BIND_QUICK_SETTINGS_TILE">
            <intent-filter>
                <action android:name="android.service.quicksettings.action.QS_TILE" />
            </intent-filter>
        </service>
```

然后在你想要长按打开的 activity 中注册

```xml
<intent-filter>
    <action android:name="android.service.quicksettings.action.QS_TILE_PREFERENCES" />
    <category android:name="android.intent.category.DEFAULT" />
</intent-filter>
```
