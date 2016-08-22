// JavaScript Document

$(function(){	
	
	
	
	$(document).on('click','.conter_list_tab_box a',function(){
		var oThis=$(this);
		var nIndex=oThis.index();
		var oUl=oThis.parents('.conter_list_tab_box').siblings('.conter_list_tab_main').find('ul');
		oThis.addClass('hover').siblings('a').removeClass('hover');
		oUl.eq(nIndex).fadeIn().siblings('.conter_list_tab_ul').hide();
		
		
	//搜索
	}).on('click','#search_form_but',function(){
		var sVal=$.trim($('.search_input input').val());
		if(sVal){
			winLocalHref('/search_list.html?keyword='+sVal);
		}else{
			sVal=$.trim($('.search_input input').attr('placeholder'));
			winLocalHref('/search_list.html?keyword='+sVal);
		}
	}).on('keyup','.search_input input',function(e){
		var e=e||window.event;
		if(e.keyCode==13){
			var sVal=$.trim($('.search_input input').val());
			if(sVal){
				winLocalHref('/search_list.html?keyword='+sVal);
			}else{
				sVal=$.trim($('.search_input input').attr('placeholder'));
				winLocalHref('/search_list.html?keyword='+sVal);
			}
		}
	});
	
	
});




