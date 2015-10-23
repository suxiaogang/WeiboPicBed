
var storageData = localStorage.weiboData ? JSON.parse(localStorage.weiboData) : [];
var optionData = localStorage.weiboOptionData ? JSON.parse(localStorage.weiboOptionData) : [];

function buildHtml() {
    var html = '';
	var imageitemtemplate = $('#image-item-template').html();
    for (var i = 0; i < storageData.length; i++) {
        var item = storageData[i];
		var timestamp = item.date;
		var src = item.imgsrc;
		var thumb = src.replace("large/", "bmiddle/");
		var d = new Date(timestamp);
        html += imageitemtemplate
					.replace(/{{imgsrcthumb}}/g, thumb)
                    .replace(/{{date}}/g, d.toLocaleString())
                    .replace(/{{d}}/g, timestamp)
                    .replace(/{{imgsrc}}/g, src);
    }
    $('.box').html('<h5>上传历史</h5>' + html);
	if(optionData[0] != undefined && optionData[0].darkIcon){
		$('input:checkbox[id="dark"]').prop("checked", true);
	}
}

function removeImgItem(d) {
	for (var i = 0; i < storageData.length; i++) {
        var item = storageData[i];
		var timestamp = item.date;
		if(timestamp == d) {
			storageData.splice(i, 1);
			localStorage.weiboData = JSON.stringify(storageData);
			return;
		}
    }
}

$(document).ready(function(){

	$('.close').on('click', function () {
		event.preventDefault();
		window.close();
	});

	$('.donate').on('click', function () {
		swal({   title: "",   text: "微信扫码捐助",
			imageUrl: "http://ww2.sinaimg.cn/large/5fd37818jw1ex6kba7xq2j20ba0b6q4e.jpg",
			imageSize: '200x200'});
	});
	$(".donate").hover(
		function(){
			$(this).addClass('blinking');
		},
		function(){
			$(this).removeClass('blinking');
	});


	// Build HTML on load
	buildHtml();

	$(".fancybox").fancybox({
		maxWidth	:  1000,
    	openEffect	: 'fade',
    	closeEffect	: 'elastic',
    	helpers : {
    		title : {
    			type : 'inside'
    		}
    	}
    });

	$(".imgsrc").hover(
	  function () {
		$(this).select();
	  },
	  function () {
		$(this).blur();
	  }
	);

	$('#dark').click(function(){
		var storageData = [];
		var flag = $('input:checkbox[id="dark"]').is(':checked');
		storageData.push({
			darkIcon: flag
		});
		localStorage.weiboOptionData = JSON.stringify(storageData);
	});

	$('.page-content').bind('contextmenu', function(e) {
		e.preventDefault();
		console.log(JSON.stringify(storageData));
		var d = $(this).attr("d");
		var div = $(this).parent();
		swal({title: "确定要删除吗?",
			text: "",
			type: "error",
			showCancelButton: true,
			cancelButtonText: "取消",
			confirmButtonColor: "#D9534F",
			confirmButtonText: "删除"
		}, function(){
			div.fadeOut("fast");
			removeImgItem(d);
		});
	});

});
