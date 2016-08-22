// JavaScript Document

var sIndexUrl='/asg/portal/h5/rank.html';
var appVue=new Vue({
	el:'#ranking_vue',
	data:{
		forJson:[],
		show:false,
		navWidth:0
	}
});


$.get(sIndexUrl,function(data){
	
	var data=jsonStr(data);
	//console.log(data);
	appVue.forJson=data['rankTypes'];
	appVue.show=true;
	appVue.navWidth="width:"+(100/data['rankTypes']['rankList'].length)+'%';
	
});








































$(function(){
	
	//男生 女生
	$(document).on('click','.ranking_head_tab_but', function(){
		var oThis=$(this);
		var nIndex=oThis.index();
		var oList=oThis.parents('.ranking_head_tab_box').siblings('.ranking_classify_box').find('.ranking_classify_list');
		oThis.addClass('hover').siblings('a').removeClass('hover');
		oList.eq(nIndex).fadeIn().siblings('.ranking_classify_list').hide();
		$('.ranking_classify_list').removeClass('ranking_classify_list_edit');
		
		
		
	//搜索榜 畅销榜 新书榜 人气榜
	}).on('click','.ranking_classify_list_tab_box a',function(){
		var oThis=$(this);
		var nIndex=oThis.index();
		var oList=oThis.parents('.ranking_classify_list_tab_box').siblings('.ranking_classify_list_tab_main').find('.ranking_classify_list_tab_ul');
		oThis.addClass('hover').siblings('a').removeClass('hover');
		oList.eq(nIndex).fadeIn().siblings('.ranking_classify_list_tab_ul').hide();
	});
	
	
	
	
	
	
});