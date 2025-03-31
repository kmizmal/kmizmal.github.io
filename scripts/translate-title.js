'use strict';

var config = hexo.config; // 获取 Hexo 配置
const fs = require('hexo-fs'); // 用于文件操作
const path = require("path");

const DATA_DIR = path.join(hexo.source_dir, "_data"); // Hexo的source/_data目录
const CACHE_FILE = path.join(DATA_DIR, "translation_cache.json");

function initDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirsSync(DATA_DIR); // 使用 hexo-fs 的递归创建目录
        hexo.log.info(`\x1b[33mฅ(^◕ᴥ◕^)ฅ 成功召唤数据小屋 → \x1b[4m${DATA_DIR}\x1b[0m\x1b[33m 喵！\x1b[0m`);
    }
}
// 读取缓存
function loadCache() {

    if (fs.existsSync(CACHE_FILE)) {
        try {
            initDataDir(); // 确保目录存在
            return JSON.parse(fs.readFileSync(CACHE_FILE, { encoding: 'utf8' }) || '{}');
        } catch (err) {
            hexo.log.error('\x1b[41m(>﹏<) 缓存文件读取出问题了喵 →\x1b[0m', err);
            return {};
        }
    }
    return {};
}
// 写入缓存
function saveCache(cache) {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
        hexo.log.info(`\x1b[32m(^∇^) 缓存保存成功！共存储 ${Object.keys(cache).length} 个翻译记忆啦~`);
    } catch (err) {
        hexo.log.warn('\x1b[43m(,,・﹏・,,) 缓存保存失败，少女紧急修复中 →\x1b[0m', err);
    }
}
// 处理翻译结果并缓存
function handleTranslation(data, sanitizedTitle, translatedTitle) {

    // 如果翻译发生变化，更新缓存
    if (translatedTitle !== sanitizedTitle) {
        hexo.log.success("成功翻译将", sanitizedTitle, "翻译为", translatedTitle);
        data.Translate_title = translatedTitle.replace(/\s+/g, "-");
        cache[sanitizedTitle] = data.Translate_title; // 缓存翻译结果
        saveCache(cache); // 写入文件缓存
    } else {
        hexo.log.info(`\x1b[37m(´•︵•\`) 标题没有变化，\x1b[3m『${sanitizedTitle}』\x1b[0m\x1b[37m 少女托腮发呆中...\x1b[0m`);
    }

    return data;
}

hexo.extend.filter.register('before_post_render', async function (data) {
    let cache = loadCache(); // 读取缓存
    const sanitizedTitle = data.title
        .replace(/[^\w\s\u4e00-\u9fa5]/g, "") // 移除特殊字符
        .replace(/\s+/g, "-");

    //console.log("检测到默认语言为:", config.language);
    const languageCode = config.language.split('-')[0];
    //console.log("转换为通用语言代码", languageCode);

    // 如果缓存已存在该标题，直接返回
    if (cache[sanitizedTitle]) {
        hexo.log.info(`\x1b[36mฅ^•ﻌ•^ฅ 从缓存堆里刨出闪闪发光的 \x1b[1m\x1b[4m📖『${sanitizedTitle}』\x1b[0m\x1b[36m ฅ( ̳• ·̫ • ̳)  \x1b[32m～➡️～  \x1b[35m✨${cache[sanitizedTitle]}✨\x1b[0m\x1b[36m 喵喵妙手get！(≧ω≦)ゞ\x1b[0m`);
        data.Translate_title = cache[sanitizedTitle];
        return data;
    }
    const translatedTitle = await Translate(sanitizedTitle, languageCode);

    return handleTranslation(data, sanitizedTitle, translatedTitle);

}, 5);

// 翻译函数，调用 LibreTranslate API 进行翻译
const translate_api_url = "https://asfag654-libretranslate.hf.space/translate";
async function Translate(title, source) {

    try {
        hexo.log.info(`\x1b[34m(。-ω-)zzz 少女奋笔疾书翻译中：\x1b[3m『${title}』\x1b[0m\x1b[34m ...`);
        const res = await fetch(translate_api_url, {
            method: "POST",
            body: JSON.stringify({
                q: title, // 要翻译的文本
                source: source, // 不检测源语言，默认中文
                target: "en",   // 翻译目标语言为英文
            }),
            headers: { "Content-Type": "application/json" },
        });

        const translateData = await res.json();

        if (translateData?.translatedText) {
            return translateData.translatedText;
        } else {
            hexo.log.error("\x1b[45m(;´༎ຶД༎ຶ`) 少女为你痛哭，翻译API抽风啦！响应数据 →\x1b[0m", translateData);
            return title;
        }
    } catch (error) {
        hexo.log.error("\x1b[45m(つД\`) 翻译API连接失败，少女哭哭... 错误信息 →\x1b[0m", error);
        return title;
    }
}
