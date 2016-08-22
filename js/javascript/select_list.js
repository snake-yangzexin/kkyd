// JavaScript Document

$(function(){
	
	$(window).scroll(function(){
		var nWinH=$(window).height();
		var nScorllTop=$(window).scrollTop();
		var nCountH=$('.index_conter').height()-100;
		var nOffsetST=nScorllTop+nWinH;
		var sHtml='';
		if(nOffsetST>nCountH&&$('.conter_ul li').length<100){
			$('.loading_box').html('<div class="loading_zhuan"><span>玩命加载中....</span></div>');
			for(var i=0; i<10; i++){
				sHtml+='<li>\
                	<a href="book_content.html" class="conter_li_img_text">\
                    	<div class="conter_li_img"><img src="images/book_img/1.jpg" /></div>\
                        <div class="conter_li_text">\
                        	<h3 class="conter_li_text_h3"><!--<strong>[都市]</strong>--> 盗墓笔记<span class="hot_icon_1"></span></h3>\
                            <div class="conter_li_tag_box">\
                            	<i>都市</i>\
                                <em>连载中</em>\
                                <i>吃软饭</i>\
                            </div>\
                            <p class="conter_li_text_p">当站在世界顶点回首过往时，陈浩不禁有些感慨...</p>\
                            <div class="conter_li_other">\
                            	<span>15238人在追</span>\
                                <strong>南派三叔</strong>\
                            </div>\
                        </div>\
                    </a>\
                </li>';
			}
			$('#conter_ul_content').append($(sHtml));
			$(sHtml).find('img').lazyload({effect : "fadeIn"});
		}else if(!($('.conter_ul li').length<100)){
			$('.loading_box').html('<div class="loading_over"><strong>已经是全部了！</strong></div>');
		}
		
		
		
		
		if(nScorllTop>nWinH){
			$('.return_top_but').addClass('return_top_but_position');
		}else{
			$('.return_top_but').removeClass('return_top_but_position');
		}
	});
	
	
	
	$('img').lazyload({
		threshold : 200,
		effect : "fadeIn"
	});
	
	
	
	
	$('.search_select_but_main a').click(function(){
		$(this).addClass('hover').siblings('a').removeClass('hover');
	});
	
});































