// JavaScript Document

var sBookId=winLocalHref().split('?')[1];
var sIndexUrl='/asg/portal/h5/detail.html?'+sBookId;

var appVue=new Vue({
	el:'#book_vue',
	data:{
		sTag:/<[^>]*>/g,
		show:false,
		userBookLen:4,
		isInBookShelf:[],
		forJson:[]
	},
	methods:{
		userAll:function(){
			appVue.userBookLen=appVue.forJson.userBookOther.length;
		}
	}
});



$.ajax({
	url:sIndexUrl,
	type:'get',
	success: function(data){
		//console.log(data);
		var data=jsonStr(data);
		appVue.userBookLen=4;
		appVue.isInBookShelf=data['details']['isInBookShelf'];
		appVue.forJson=data['details'];
		appVue.show=true;
		imgLoad();
	},
	error:function(err){
		//console.log(err)
	}
});













$(function(){
	//换一换
	var nChangeItem=0;
	
	$(document).on('click','.book_abstract_p a',function(){
		var oThis=$(this);
		var oParent=oThis.parent();
		oParent.hide().siblings('.book_abstract_p').fadeIn();
	}).on('click','.book_common_change_but',function(){
		if($('.book_common').length<2){
			return false
		}
		var oThis=$(this);
		var oParent=oThis.parent().siblings('.conter_list_box').find('.book_common');
		if(nChangeItem>=oParent.length-1){
			nChangeItem=0;
		}else{
			nChangeItem++;
		}
		oParent.eq(nChangeItem).fadeIn().siblings('.book_common').hide();
	}).on('click','.add_book_sheft',function(){
		var oThis=$(this);
		var sAddShelf=oThis.attr('addShelf');
		if(!appVue.isInBookShelf){
			$.post(sAddShelf,function(data){
				//console.log(data);
				if(data==1){
					appVue.isInBookShelf=true;
				}else{
					$('#clear_alert_box').show();
					return false;
				}
			});
		}
	}).on('click','.began_read_but',function(){
		var sUrl=$(this).attr('sHref');
		var oBookInfo=$.cookie('book_info');
		if(oBookInfo){
			$.cookie('book_info',null);
		}
		winLocalHref(sUrl);
		
	}).on('click','.newest_chapter_but',function(){
		var sHref=$(this).attr('sHref');
		var sBookid=getWinUrl('bookId',sHref);
		var sChapter=getWinUrl('chapterId',sHref);
		appVue.show=false;
		$.get('/asg/portal/h5/reader.html?reaction=3&bookId='+sBookid+'&chapterId='+sChapter,function(data){
			////console.log(data);
			appVue.show=true;
			data=jsonStr(data);
			//alert(data['status'])
			if(data['status']=='1'){
				var oBookInfo={
					loginUrl:winLocalHref(),
					bookId:sBookid,
					chapterId:sChapter,
					reaction:3
				}
				oBookInfo=jsonStr(oBookInfo);
				$.cookie('book_info',oBookInfo, { expires: nTimeMs });
				if(oChannelCode[sChannelCodeCookie]){
					winLocalHref('/login/login.html');
				}else{
					winLocalHref('/subscribe_chapter.html?bookId='+sBookid+'&reaction='+3+'&chapterId='+sChapter);
				}
			}else if(data['status']=='4'){
				$.cookie('book_info',null);
				winLocalHref(sHref);
			}else if(data['status']=='0'){
				var oBookInfo=$.cookie('book_info');
				if(!oBookInfo||oBookInfo=='null'){
					oBookInfo={
						loginUrl:winLocalHref(),
						bookId:sBookid,
						chapterId:sChapter,
						reaction:3
					}
					oBookInfo=jsonStr(oBookInfo);
				}else{
					oBookInfo=jsonStr(oBookInfo);
					oBookInfo.loginUrl=winLocalHref();
					oBookInfo['chapterId']=appVue.forJson.chapterId;
					oBookInfo=jsonStr(oBookInfo);
				}
				$.cookie('book_info',oBookInfo, { expires: nTimeMs });
				winLocalHref('/subscribe_chapter.html?bookId='+sBookid+'&reaction='+3+'&chapterId='+sChapter);
			}
			
		});
	});
	
	
	
	
	
	$(window).scroll(function(){
		var nWinH=$(window).height();
		if($(window).scrollTop()>nWinH){
			$('.return_top_but').addClass('return_top_but_position');
		}else{
			$('.return_top_but').removeClass('return_top_but_position');
		}
	
	});
	
	
});

