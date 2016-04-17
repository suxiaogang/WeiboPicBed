/*
用于实现通用的在网站编辑器中粘贴markdown图片的功能
 */
var ImagePaster = function () {
	var me = this;
	//用于判断图片地址是否处于未粘贴状态
	me.ImgUrlBuffer = null;

	//用于将多行文本保存到变量里
	var reg = /\/\*([\s\S]+?)\*\//;
	function heredoc(fn) {
		return fn.toString().match(reg)[1];
	}

	//上传图片过程中的提示框，使用bootstrap样式
	me.WarningBoxTpl = heredoc(function () {
			/*
			<div class="alert alert-warning alert-dismissible fade in my-alert-box" role="alert" style="">
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
			</button>
			<span>
			正在上传图片......
			</span>
			</div>
			 */
		});

	//图片上传成功的提示框
	me.SuccessBoxTpl = heredoc(function () {
			/*
			<div class="alert alert-success alert-dismissible fade in my-alert-box" role="alert" style="">
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
			</button>
			<span>
			上传成功，图片地址已复制到剪切板，再次按Ctrl+V完成图片粘贴。
			</span>
			</div>
			 */
		});

	//弹出图片正在上传的提示
	me.ShowUploading = function () {
		//关闭其他提示窗口
		$('.my-alert-box').alert('close');
		$('body').prepend(me.WarningBoxTpl);
	}

	//弹出图片上传成功的提示
	me.ShowUploaded = function () {
		//关闭其他提示窗口
		$('.my-alert-box').alert('close');
		$('body').prepend(me.SuccessBoxTpl);
	}

	//当设置完系统剪切板的值后触发
	//target是在设置剪切板内容前，光标所在元素
	me.onEndSetClipboard = function (target) {
		/*主要进行光标位置移动的输出，因为向系统剪切板赋值时会改变光标focus的元素*/
	}

	//初始化，进行事件绑定
	me.Init = function (element) {
		if (element == undefined || element == null || element.length == 0)
			element = 'body';
		$(element).bind("paste", pasteEventFunc);
		$(element).bind("keydown", keydownEventFunc);
		//处理background发来的事件，目前只包括图片上传完成事件
		chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
			switch (request.message) {
			case 'ImgUploadedEvent':
				onImgUploadedEvent(request);
				break;
			}
		});
		console.log('inited');
	}

	function pasteEventFunc(event) {
		var items = (event.clipboardData || event.originalEvent.clipboardData).items;
		if (items.length > 0 && items[0].kind == 'file') {
			var file = items[0].getAsFile();
			me.ShowUploading(); //弹出正在上传提示
			uploadImg(file);
		}
	}

	//将剪切板中的图片转成base64并向background发送上传请求
	function uploadImg(file) {
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = function (e) {
			imgFile = e.target;
			var base64 = imgFile.result.split(',')[1];
			chrome.extension.sendMessage({
				message : 'ImgUploadingEvent',
				data : base64,
				href : location.href
			}, function (response) {
				console.log(response);
			});
		}
	}

	//图片上传完毕事件
	function onImgUploadedEvent(request) {
		if (request.data != null) {
			me.ImgUrlBuffer = request.data;
			setPasteContent('![](' + request.data + ')');
			//$('textarea.ace_text-input').val('  ![](' + request.data + ')');
			me.ShowUploaded();
		} else {

			$('.my-alert-box').alert('close'); //关闭其他提示窗口
			swal({
				title : '图片上传失败，请先登录微博',
				text : '请不要屏蔽弹出窗口',
				type : 'info'
			}, function () {
				window.open('http://weibo.com/?topnav=1&mod=logo');
			});
		}
	}

	//绑定键盘事件，如果图片地址已经粘贴，则关闭提示窗口
	function keydownEventFunc(event) {

		if (me.ImgUrlBuffer != null) {
			me.ImgUrlBuffer = null;
			$('.my-alert-box').alert('close'); //关闭其他提示窗口
		}
	}

	//设置系统剪切板内容
	function setPasteContent(content) {
		console.log(content);
		var target = $(document.activeElement);
		$('body').append('<textarea id="tmpPasteText2016" style="height:0;width:0;border:0;"></textarea>');
		var tmp = $('#tmpPasteText2016');
		tmp.focus();
		tmp.text(content);
		tmp.select();
		var res = document.execCommand('copy');
		console.log(res);
		tmp.remove();

		me.onEndSetClipboard(target);
		//target.focus();
	}
}

$(function () {
	var paster = new ImagePaster();
	//针对不同网站进行不同的初始化
	switch (true) {
	case location.href.startsWith('https://www.zybuluo.com'):
		paster.Init('#editor-column');
		paster.onEndSetClipboard = function (target) {
			target.focus(); //在作业部落网站上可以恢复光标原位置，因为它是一个textarea
		};
		break;
	case location.href.startsWith('http://write.blog.csdn.net'):
		paster.Init('.editor-content'); //在csdn上无法恢复光标原位置，因为它是一个div
		break;
	case location.href.startsWith('http://github.com'):
		paster.Init('.commit-create'); //
		break;
	default:
		paster.Init();
		break;
	}
});
