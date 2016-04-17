
var reg = /\/\*([\s\S]+?)\*\//;
var ImgUrlBuffer = null;
//用于将多行注释保存到变量里
function heredoc(fn) {
	return fn.toString().match(reg)[1];
}

var warningBoxTpl = heredoc(function () {
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
var successBoxTpl = heredoc(function () {
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

function showDoing() {
	$('.my-alert-box').alert('close'); //关闭其他提示窗口
	$('body').prepend(warningBoxTpl);
}

function showSuccess() {
	$('.my-alert-box').alert('close'); //关闭其他提示窗口
	$('body').prepend(successBoxTpl);
}

$('#editor-column')[0].onpaste = function (event) {
	var items = (event.clipboardData || event.originalEvent.clipboardData).items;
	if (items.length > 0 && items[0].kind == 'file') {
		var file = items[0].getAsFile();
		showDoing();
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
		ImgUrlBuffer = request.data;
		$('textarea.ace_text-input').val('  ![](' + request.data + ')');
		showSuccess();
	} else {

		$('.my-alert-box').alert('close'); //关闭其他提示窗口
		swal({
			title : '图片上传失败，请先登录微博',
			text:'请不要屏蔽弹出窗口',
			type:'info'
		}, function () {
			window.open('http://weibo.com/?topnav=1&mod=logo');
		});
	}
}

//绑定键盘事件，如果图片地址已经粘贴，则关闭提示窗口
$('#editor-column').keydown(function (event) {
	if (ImgUrlBuffer != null) {
		ImgUrlBuffer = null;
		$('.my-alert-box').alert('close'); //关闭其他提示窗口
	}
});

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	switch (request.message) {
	case 'ImgUploadedEvent':
		onImgUploadedEvent(request);
		break;
	}
});
