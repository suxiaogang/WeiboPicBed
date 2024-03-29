var storageData = localStorage.weiboData ? JSON.parse(localStorage.weiboData) : [];
var storageSort = localStorage.sort ? localStorage.sort : 'AESC';
var customIconPreview = $('#custom-icon-preview');
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

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
            .replace(/{{date}}/g, d.format('yyyy-MM-dd h:m'))
            .replace(/{{d}}/g, timestamp)
            .replace(/{{imgsrc}}/g, src);
    }
    $('.box').html('<h5>上传历史 <span style="color:#aaa">点击右键删除(仅本地)</span></h5>' + html);
    if (localStorage.customIcon == undefined) {
        $('input:checkbox[id="defaultIcon"]').prop("checked", true);
        customIconPreview.attr('src', 'icon_38.png');
    } else {
        $('input:checkbox[id="customIcon"]').prop("checked", true);
        customIconPreview.attr('src', localStorage.customIconBase64);
    }
    if (localStorage.sort == null) {
        localStorage.sort = storageSort;
    }
    $("#sort").text(localStorage.sort == 'AESC' ? '升序排列' : '降序排列');
}

function removeImgItem(d) {
    for (var i = 0; i < storageData.length; i++) {
        var item = storageData[i];
        var timestamp = item.date;
        if (timestamp == d) {
            storageData.splice(i, 1);
            localStorage.weiboData = JSON.stringify(storageData);
            return;
        }
    }
}

$(document).ready(function() {

    // Build HTML on load
    buildHtml();

    var elements = $('.modal-overlay, .modal');
	$('#beta').click(function(){
		elements.addClass('active');
	});
	$('.close-modal').click(function(){
		elements.removeClass('active');
	});

    $('#sort-reverse').click(function(){
        storageData = storageData.reverse();
        localStorage.weiboData = JSON.stringify(storageData);
        localStorage.sort = (localStorage.sort == 'AESC' ? 'DESC' : 'AESC');
        buildHtml();
	});

    $('#chrome-sync').click(function(){
        // TODO: Chrome sync V3
	});

    var version = chrome.runtime.getManifest().version;
    $(".current_version").text(version);

    $(document).on('click','input[type=text]',function(){ this.select(); });

    $('.close').on('click', function() {
        event.preventDefault();
        window.close();
    });
    $('#domain-prefix').on('change', function() {
        var index = $(this)[0].selectedIndex;
	    var selectOption = $(this)[0].options[index];
        localStorage.domain = selectOption.value;
    });

    $('.donate').on('click', function() {
        swal({
            title: "扫码捐助",
            text: '<img width="300" height="300" src="img/wechat.png">' +
                '<span style="margin:20px;font-weight:bold;">或</span>' +
                '<img width="300" height="300" src="img/alipay.jpg">',
            customClass: 'swal-wide',
            confirmButtonText: '关闭',
            html: true
        });
    });

    $(".donate").hover(
        function() {
            $(this).addClass('blinking');
        },
        function() {
            $(this).removeClass('blinking');
        }
    );

    $(".fancybox").fancybox({
        maxWidth: 1000,
        openEffect: 'fade',
        closeEffect: 'elastic',
        helpers: {
            title: {
                type: 'inside'
            }
        }
    });

    $('#defaultIcon').click(function() {
        $('input:checkbox[id="customIcon"]').prop("checked", false);
        $('input:checkbox[id="defaultIcon"]').prop("checked", true);
        customIconPreview.attr('src', 'icon_38.png');
        localStorage.removeItem('customIcon');
        localStorage.removeItem('customIconBase64');
    });
    $('#customIcon').click(function() {
        $('#custom-icon-file').trigger('click');
        $('input:checkbox[id="customIcon"]').prop("checked", false);
    });

    // canvas.width = canvas.height = 38;
    // var dontLoad = true;
    // customIconPreview.on('load', function() {
    //     if (dontLoad) {
    //         dontLoad = false;
    //         return;
    //     }
    //     if (customIconPreview.attr('src') == 'icon_38.png') {
    //         return;
    //     }
    //     ctx.clearRect(0, 0, 38, 38);
    //     ctx.drawImage(document.getElementById("custom-icon-preview"), 0, 0, 38, 38);
    //     var imageData = ctx.getImageData(0, 0, 38, 38);
    //     chrome.browserAction.setIcon({ imageData: imageData });
    //     localStorage.customIcon = JSON.stringify(imageData.data);
    // });

    var customIconFile = document.getElementById('custom-icon-file');
    customIconFile.addEventListener('change', function() {
        var files = this.files;
        if (files && files.length) {
            var file = files[0];
            if (/image\/[a-z]+/i.test(file.type)) {
                reader = new FileReader();
                reader.onload = function(e) {
                    var result = e.target.result;
                    customIconPreview.attr('src', result);
                    swal({ title: "Woo~!", text: "图标更换成功.", timer: 2000, showConfirmButton: false });
                    localStorage.customIconBase64 = result;
                    $('input:checkbox[id="customIcon"]').prop("checked", true);
                    $('input:checkbox[id="defaultIcon"]').prop("checked", false);
                };
                reader.readAsDataURL(files[0]);
            } else {
                alert('Not an image. Try another one.');
                $('input:checkbox[id="customIcon"]').prop("checked", true);
                $('input:checkbox[id="defaultIcon"]').prop("checked", false);
            }
        }
    });

    $('.page-content').bind('contextmenu', function(e) {
        e.preventDefault();
        var d = $(this).attr("d");
        var div = $(this).parent().parent();
        console.log(div);
        swal({
            title: "确定要删除吗?",
            text: "",
            type: "error",
            showCancelButton: true,
            cancelButtonText: "取消",
            confirmButtonColor: "#D9534F",
            confirmButtonText: "删除"
        }, function() {
            div.fadeOut("fast");
            removeImgItem(d);
        });
    });

});
