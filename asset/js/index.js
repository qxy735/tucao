$(function(){
	$.ajax({
	    url : '/load',
	    data:{},
	    type : 'post',
	    dataType:'json',
	    cache : false,
	    success : function (result){
	        if(result){
	        	var  faces = [
	        		'<img src="image/phiz/zhuakuang.gif" alt="抓狂" />',
	        		'<img src="image/phiz/baobao.gif" alt="抱抱" />',
	        		'<img src="image/phiz/haixiu.gif" alt="害羞" />',
	        		'<img src="image/phiz/ku.gif" alt="酷" />',
	        		'<img src="image/phiz/taikaixin.gif" alt="太开心" />',
	        		'<img src="image/phiz/touxiao.gif" alt="偷笑" />',
	        		'<img src="image/phiz/qian.gif" alt="钱" />',
	        		'<img src="image/phiz/huaxin.gif" alt="花心" />',
	        		'<img src="image/phiz/jiyan.gif" alt="挤眼" />'
	        	];

	        	var face_indexs = [
	        		'抓狂',
	        		'抱抱',
	        		'害羞',
	        		'酷',
	        		'太开心',
	        		'偷笑',
	        		'钱',
	        		'花心',
	        		'挤眼'
	        	];

	        	var str = "";

	        	var num = 1;

	        	for(var index in result){
	        		var content_data = result[index].content.replace(/\[(.*)\]/g, function(item, tmp_index){
				    	for (var i in face_indexs) {
				    		if(face_indexs[i] == tmp_index){
				    			return faces[i];
				    		}
				    	}
					});

	        		var rand = Math.floor(Math.random()*5+1);

			        str += "<dl class='paper a"+rand+"'><dt><span class='username'>"+ result[index].username +"</span><span class='num'>No."+num+"</span></dt>";
			        str += "<dd class='content'>"+content_data+"</dd>";
			        str += "<dd class='bottom'><span class='time'>&copy禹译吐槽墙，版权所有</span></a></dd></dl>";

			        num++;
			    }

			    $('#main').html(str);

			    init();
	        }
	    },
	    error : function (XMLHttpRequest, textStatus){
	    }
	});
});

function check_form_data(){
	var user_name = $('#username').val();
	var content = $('#content').val();

	if(!user_name){
		$('#user_name_error').text('昵称不能为空');

		return false;
	}

	if(!content){
		$('#content_error').text('吐槽内容不能为空');

		return false;
	}

	return true;
}

$('#send-btn').bind('click', function(){
	$('#publish_form').submit();
});

function init() {
	$( '#main' ).height( $( window ).height() - $( '#top' ).height() - 45);

	var paper = $( '.paper' );
	var FW = $( window ).width();
	var FH = $( '#main' ).height();
	for (var i = 0; i < paper.length; i++) {
		var obj = paper.eq(i);
		obj.css( {
			left : parseInt(Math.random() * (FW - obj.width())) + 'px',
			top : parseInt(Math.random() * (FH - obj.height())) + 'px'
		} );
		drag(obj, $( 'dt', obj ));
	}

	paper.click( function () {
		$( this ).css( 'z-index', 1 ).siblings().css( 'z-index', 0 );
	} );

	$( '.close' ).click( function () {
		$( this ).parents( 'dl' ).fadeOut('slow');
		return false;
	} );

	$( '#send' ).click( function () {
		$( '<div id="windowBG"></div>' ).css( {
			width : $(document).width(),
 			height : $(document).height(),
 			position : 'absolute',
 			top : 0,
 			left : 0,
 			zIndex : 998,
 			opacity : 0.3,
 			filter : 'Alpha(Opacity = 30)',
 			backgroundColor : '#000000'
		} ).appendTo( 'body' );

		var obj = $( '#send-form' );
		obj.css( {
			left : ( $( window ).width() - obj.width() ) / 2,
			top : $( document ).scrollTop() + ( $( window ).height() - obj.height() ) / 2
		} ).fadeIn();
	} );

	$( '#close' ).click( function () {
		$( '#send-form' ).fadeOut( 'slow', function () {
			$( '#windowBG' ).remove();
		} );
		return false;
	} );
	

	$( 'textarea[name=content]' ).keyup( function () {
		var content = $(this).val();
		var lengths = check(content);  //调用check函数取得当前字数

		//最大允许输入50个字
		if (lengths[0] >= 50) {
			$(this).val(content.substring(0, Math.ceil(lengths[1])));
		}

		var num = 50 - Math.ceil(lengths[0]);
		var msg = num < 0 ? 0 : num;
		//当前字数同步到显示提示
		$( '#font-num' ).html( msg );
	} );

	$( '#phiz img' ).click( function () {
		var phiz = '[' + $( this ).attr('alt') + ']';
		var obj = $( 'textarea[name=content]' );
		obj.val(obj.val() + phiz);
	} );

}

/**
* 元素拖拽
* @param  obj		拖拽的对象
* @param  element 	触发拖拽的对象
*/
function drag (obj, element) {
	var DX, DY, moving;

	element.mousedown(function (event) {
		obj.css( {
			zIndex : 1,
			opacity : 0.5,
 			filter : 'Alpha(Opacity = 50)'
		} );

		DX = event.pageX - parseInt(obj.css('left'));	//鼠标距离事件源宽度
		DY = event.pageY - parseInt(obj.css('top'));	//鼠标距离事件源高度

		moving = true;	//记录拖拽状态
	});

	$(document).mousemove(function (event) {
		if (!moving) return;

		var OX = event.pageX, OY = event.pageY;	//移动时鼠标当前 X、Y 位置
		var	OW = obj.outerWidth(), OH = obj.outerHeight();	//拖拽对象宽、高
		var DW = $(window).width(), DH = $(window).height();  //页面宽、高

		var left, top;	//计算定位宽、高

		left = OX - DX < 0 ? 0 : OX - DX > DW - OW ? DW - OW : OX - DX;
		top = OY - DY < 0 ? 0 : OY - DY > DH - OH ? DH - OH : OY - DY;

		obj.css({
			'left' : left + 'px',
			'top' : top + 'px'
		});

	}).mouseup(function () {
		moving = false;	//鼠标抬起消取拖拽状态

		obj.css( {
			opacity : 1,
 			filter : 'Alpha(Opacity = 100)'
		} );

	});
}

/**
 * 统计字数
 * @param  字符串
 * @return 数组[当前字数, 最大字数]
 */
function check (str) {
	var num = [0, 50];
	for (var i=0; i<str.length; i++) {
		//字符串不是中文时
		if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 255){
			num[0] = num[0] + 0.5;//当前字数增加0.5个
			num[1] = num[1] + 0.5;//最大输入字数增加0.5个
		} else {//字符串是中文时
			num[0]++;//当前字数增加1个
		}
	}
	return num;
}