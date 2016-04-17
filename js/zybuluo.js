/*
用于实现作业部落网站中粘贴图片的功能
 */
var ImagePaster = function () {
	var me=this;
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
			图片上传成功，按回车键自动粘贴图片地址。
			</span>
			</div>
			 */
		});
	
	//弹出图片正在上传的提示
	me.ShowUploading=function(){
		//关闭其他提示窗口
		$('.my-alert-box').alert('close'); 
		$('body').prepend(me.WarningBoxTpl);
	}
	
	//弹出图片上传成功的提示
	me.ShowUploaded=function() {
		//关闭其他提示窗口
		$('.my-alert-box').alert('close'); 
		$('body').prepend(me.SuccessBoxTpl);
	}

	//初始化，进行事件绑定
	me.Init=function(){
		$('#editor-column')[0].onpaste = pasteEventFunc;
		$('#editor-column')[0].onkeydown=keydownEventFunc;
		//处理background发来的事件，目前只包括图片上传完成事件
		chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
			switch (request.message) {
			case 'ImgUploadedEvent':
				onImgUploadedEvent(request);
				break;
			}
		});
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
			$('textarea.ace_text-input').val('  ![](' + request.data + ')');
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
}

var paster=new ImagePaster();
paster.Init();
