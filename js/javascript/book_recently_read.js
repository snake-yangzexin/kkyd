// JavaScript Document
var sIndexUrl='/asg/portal/h5/bookShelf/list.do';
var sRecentlyUrl='/asg/portal/h5/bookShelf/recentlyRead.do';
var sRecommende='/asg/portal/h5/recommended.do';
readSynchronous();


var appVue=new Vue({
		el:'#book_shelf_vue',
		data:{
			infoId:$.cookie('KKYD_INFO'),
			bookShelft:[],//书架list
			bookShelftSize:0,
			recentlyShelft:getLocalRecentlyRead()['content'],//最近阅读
			recentlyShelftSize:0,
			recentlySwitch:true,
			recommended:'',
			show:false
		},
		methods:{
			//删除最近阅读
			removeRecentlyRead:function(removeRecentlyReadId,nIndex){
				var sUid=$.cookie('uid');
				if(sUid && sUid!='null'){				
					$.get('/asg/portal/h5/bookShelf/recentlyRead/delete.do?bookids='+removeRecentlyReadId,function(data){
						//console.log(jsonStr(data));
						if(data==1){
							appVue.recentlyShelft.$remove(appVue.recentlyShelft[nIndex]);
							removeLocalRecentlyReadId(removeRecentlyReadId);
							imgLoad();
						}
					})
				}else{
					removeLocalRecentlyRead(nIndex);
					appVue.recentlyShelft.$remove(appVue.recentlyShelft[nIndex]);
				}
			},
			//删除书架
			removeShelft:function(removeShelftId,nIndex){
				$.get('/asg/portal/h5/bookShelf/delete.do?bookids='+removeShelftId,function(data){
					//console.log(jsonStr(data));
					if(data==1){
						appVue.bookShelft.$remove(appVue.bookShelft[nIndex]);
					}
				})
			}
		}
	});
var keyVal=$.cookie('KKYD_INFO');
//if(keyVal){
//m.kkyd.cn/asg/portal/h5/bookShelf/uploadRecentlyRead.do?json=	
	
	
	$.get(sRecentlyUrl,function(data){
		//console.log(jsonStr(data));
		if(data==0){
			appVue.bookShelftSize=0;
			appVue.show=true;
			return false;
		}
		//alert(data['content'].length+'最近阅读');
		if(data['content'].length<=0){
			appVue.recentlyShelft=getLocalRecentlyRead()['content'];
		}else{
			appVue.recentlyShelft=data['content'];
			appVue.recentlyShelftSize=data['size'];
		}
		appVue.show=true;
		imgLoad();
	});
//}else{
//	appVue.bookShelft=[];
//	appVue.recentlyShelft=[];
//	appVue.recentlySwitch=false;
//	appVue.show=true;
//}







$.get(sRecommende,function(data){
	if(data['status']==1){
		appVue.recommended=data['blockResources'];
		imgLoad();
	}
	
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
		
		
		
	//管理书架
	}).on('click','.book_shelft_edit_box a',function(){
		var oThis=$(this);
		oThis.parents('.ranking_classify_list').toggleClass('ranking_classify_list_edit');
		
		
	}).on('click','.conter_ul .conter_li_img_text',function(){
		var oThis=$(this);
		var sParentEdit=oThis.parents('.ranking_classify_list_edit');
		if(sParentEdit.length>0){
			return false;
		}
		
		
		
	//最近阅读	
	}).on('click','#recently_but',function(){
		if(appVue.recentlySwitch){
			appVue.recentlySwitch=false;
					
			$.get(sIndexUrl,function(data){
				console.log(jsonStr(data));
				if(data==0){
					appVue.bookShelftSize=0;
					appVue.show=true;
					return false;
				}
				appVue.bookShelft=data['content'];
				appVue.bookShelftSize=data['size'];
				imgLoad();
			});
		}
	});
	
	
	
	
});