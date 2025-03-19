'use strict';

// 如果 hexo 尚未定义，则初始化 hexo 对象
var hexo = hexo || {};
var config = hexo.config; // 获取 Hexo 配置
const front = require('hexo-front-matter'); // 用于解析和生成 Front Matter
const fs = require('hexo-fs'); // 用于文件操作

hexo.extend.filter.register('before_post_render', async function (data) {

    if (data.Translate_title !== undefined) {
        console.log(`\x1b[32m${data.title}\x1b[0m`,"存在翻译标题，少女为你跳过");//如果标题已经翻译过了，就跳过并输出日志
        return data;
    }

    const sanitizedTitle = data.title
        .replace(/[^\w\s\u4e00-\u9fa5]/g, "") // 移除特殊字符
        .replace(/\s+/g, "-");

    //console.log("检测到默认语言为:", config.language);
    const languageCode = config.language.split('-')[0];
    //console.log("转换为通用语言代码", languageCode);
    const translatedTitle = await Translate(sanitizedTitle,languageCode);


    if (translatedTitle != sanitizedTitle) {
        console.log("成功翻译将",sanitizedTitle,"翻译为",translatedTitle);
        data.Translate_title = translatedTitle.replace(/\s+/g, "-");
        await rewrite(data);// 重写文件
    } else {
        console.log(translatedTitle, "标题没有变化，少女陷入沉思");
    }
    return data;

}, 5);
async function rewrite(data) {
    // 清理 Front Matter 数据，只保留需要的字段
    const cleanedData = cleanFrontMatter(data);

    // 构建新的 YAML Front Matter
    const updatedFrontMatter = front.stringify(cleanedData);

    // 确保没有多余的 `---` 分隔符
    const formattedFrontMatter = `---\n${updatedFrontMatter.trim()}`;

    // 拼接完整的文件内容
    const newContent = `${formattedFrontMatter}\n${data.content}`;

    try {
        // 写回 `.md` 文件
        await fs.writeFile(data.full_source, newContent, 'utf8');
        //console.log(`文件成功写入到 ${data.full_source}`);
    } catch (error) {
        console.error("文件写不回去了", error);
    }

    return data;
}

// 翻译函数，调用 LibreTranslate API 进行翻译
const translate_api_url = "https://asfag654-libretranslate.hf.space/translate";
async function Translate(title,source) {

    try {
        console.log("少女正在努力翻译:", title);
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
            console.error("少女为你痛哭，翻译api抽风了", translateData);
            return title;
        }
    } catch (error) {
        console.error("少女为你痛哭，翻译api失效了", error);
        return title;
    }
}

function cleanFrontMatter(data) {
    const cleanedData = {};  // 创建一个新的对象，只保留需要的字段

    // 保留必要的字段
    if (data.title) cleanedData.title = data.title;
    if (data.Translate_title) cleanedData.Translate_title = data.Translate_title;
    if (data.date) cleanedData.date = new Date(data.date);
    if (data.updated) cleanedData.updated = new Date(data.updated);
    if (data.comments !== undefined) cleanedData.comments = data.comments;
    if (data.pinned !== undefined) cleanedData.pinned = data.pinned;
    if (data.tags && Array.isArray(data.tags.data)) {

        cleanedData.tags = data.tags.data.map(tag => tag.name);
        //console.log("标签:", cleanedData.tags);// 提取标签的名称
    }
    if (data.categories && Array.isArray(data.categories.data) && data.categories.data.length > 0) {
        cleanedData.categories = data.categories.data.map(category => category.name);
    }
    if (data.excerpt) cleanedData.excerpt = data.excerpt;
    if (data.disableNunjucks !== undefined) cleanedData.disableNunjucks = data.disableNunjucks;
    if (data.lang) cleanedData.lang = data.lang;
    if (data.published !== undefined) cleanedData.published = data.published;
    if (data.layout) cleanedData.layout = data.layout;

    return cleanedData;  // 返回清理后的数据
}
