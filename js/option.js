
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
                    .replace(/{{imgsrc}}/g, src);
    }
    $('.box').html('<h5>上传历史</h5>' + html);
	if(optionData[0] != undefined && optionData[0].darkIcon){
		$('input:checkbox[id="dark"]').prop("checked", true);
	}
}

$(document).ready(function(){

	$('.close').on('click', function () {
		event.preventDefault();
		window.close();
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

	$("input.imgsrc").hover(
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

});