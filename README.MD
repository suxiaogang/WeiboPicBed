<a href="https://chrome.google.com/webstore/detail/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%9B%BE%E5%BA%8A/fdfdnfpdplfbbnemmmoklbfjbhecpnhf/reviews" target="_blank">
	<img width="300px" src="http://ww3.sinaimg.cn/large/5fd37818jw1eq7bx4bc4ej20c0038mx9.jpg">
</a>

<img width="650px" src="http://ww1.sinaimg.cn/large/5fd37818ly1fdy2kft6qyj20w609yjt5.jpg">

## 💰捐助
<img width="150px" src="http://ww2.sinaimg.cn/large/5fd37818gw1f46gp47ynsj20dw0dwq4i.jpg"><img width="150px" src="http://ww3.sinaimg.cn/large/5fd37818gw1f46gph7932j20dw0dwmz6.jpg">

## 🚀 features
- 支持点选/拖拽/本地粘贴3种方式上传图片至新浪微博图床
- 支持批量上传
- 可选择返回的图片尺寸
- 可生成图片链接,HTML,UBB和Markdown四种格式
- 上传历史浏览和删除.
- 支持在常用在线markdown编辑器中使用ctrl+v粘贴图片，图片自动上传到微博图床。(目前已支持github，csdn及zybuluo的markdown在线编辑器)
- 支持返回https安全协议的图片地址
- 支持自定义Chrome菜单栏图标

## 🖼 screenshots
![](http://ww3.sinaimg.cn/large/5fd37818jw1ew172qsxbog20lz0c2qcn.gif)

![](http://ww1.sinaimg.cn/large/5fd37818gw1eqps6zuxslj20xc0p0q9q.jpg)

![](http://ww2.sinaimg.cn/large/5fd37818gw1eqhxjffq1tj20zk0m8wj6.jpg)

## ✍️ 常用在线markdown编辑器中使用ctrl+v粘贴图片
[在github中的使用效果](http://ww3.sinaimg.cn/large/99b8535cjw1f306jse5g7j215n0jj444.jpg)

[在csdn中的使用效果](http://ww2.sinaimg.cn/large/99b8535cjw1f306jftd8vj21gj0l646l.jpg)

[在作业部落中的使用效果](http://ww4.sinaimg.cn/large/99b8535cjw1f306kv4yljj21gu0oz7cl.jpg)


## 👬 contributors
[@liyumeng](https://github.com/liyumeng)

[@Jackroyal](https://github.com/Jackroyal)

[Aqours](https://github.com/Aqours)

## ❓ 最常被问到的问题
> Q:我上传的图片去哪了?
>
> A:图片上传调用了新浪微博这个接口 http://picupload.service.weibo.com/interface (该地址不一定可以直接访问), 然而上传的图片并不会保存到任何一个你的微博相册里(即使你已经登陆了微博),在插件的设置页面,你可以看到本机上传的图片历史记录(目前还不支持多设备同步)

## 🔗 参考
[Drag and drop](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_and_drop)

[DataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer)

[FileReader](https://developer.mozilla.org/en/docs/Web/API/FileReader)

[localStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage)

## 📑 更新日志
```
2017-03-16 v2.5
支持大图和原图上传,修复上传图片url中图片后缀丢失的问题

2017-02-03 v2.3
修复上传图片错误的问题

2016-07-07 v2.1
支持批量上传 (代码由@Jackroyal贡献)

2016-06-28 v2.0
支持自定义Chrome菜单栏图标 (建议使用尺寸接近或者等于38*38的正方形png图片文件)
支持返回https安全协议的图片地址

2016-04-18 v1.9
支持在常用Markdown在线编辑器中，使用Ctrl+V进行图片粘贴，目前已支持github, csdn及作业部落的在线markdown编辑器
其中csdn的markdown在线编辑器需要使用两次ctrl+v完成粘贴 (代码由@liyumeng贡献)

2015-09-13 v1.8
支持生成UBB格式的图片外链

2015-09-06 v1.7
增加了复制按钮，其他一些细微调整

2015-08-18 v1.6
设置里面,在图片上点击右键可以删除该条历史记录

2015-04-01 v1.5
增加一个上传时的Loading效果(针对网络延迟和大文件上传)
增加按下"Esc"键后关闭窗口

2015-03-23 v1.4
状态栏图标可以在选项里设置为灰色了

2015-03-22 v1.3
可以保存上传历史了

2015-02-16 v1.2
由browser action修改为popup

2015-02-15 v1.0
第一个版本发布

```

## 💎 Licence

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](http://creativecommons.org/licenses/by/4.0/)
