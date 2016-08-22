// JavaScript Document

//http://101.200.193.169:3080/asg/portal/h5/reader.html?channelCode=K1001004& bookId=2&chapterId=54&userId=5465&reaction=1
var clearTimeStop=null;
var sBookId=getWinUrl('bookId');
var sChapterId=getWinUrl('chapterId');
var sChanneCookie=$.cookie('channelCode');


/*
//根据渠道号 书名  章节判断跳转关注二维码页
if(sBookId == '11000000439' && parseInt(sChapterId) >= 244045 && sChanneCookie=='K900033'
||sBookId == '11000001945' && parseInt(sChapterId) >= 902262 && (sChanneCookie=='K900040'||sChanneCookie=='K900060')
||sBookId == '11000005757' && parseInt(sChapterId) >= 2797114 && (sChanneCookie=='K900044' || sChanneCookie=='K900058'|| sChanneCookie=='K900059')

||sBookId == '11000003440' && parseInt(sChapterId) >= 1732699 && sChanneCookie=='K900053'

||sBookId == '11000001253' && parseInt(sChapterId) >= 392418 && (sChanneCookie=='K900047'||sChanneCookie=='K900048')
||sBookId == '11000007170' && parseInt(sChapterId) >= 3369803 && (sChanneCookie=='K900050'||sChanneCookie=='K900051')

||sBookId == '11000007177' && parseInt(sChapterId) >= 3374192 && (sChanneCookie=='K900054'||sChanneCookie=='K900055')){
	winLocalHref('/add_kkj.html?20160803');
}

*/
//根据渠道号 书名  章节判断跳转关注二维码页
addKkjHtml('/add_kkj.html?20160809',sBookId, sChapterId, sChanneCookie);






var sUuserA=window.navigator.userAgent.toLowerCase();
var sAppName=window.navigator.appName;








var sIndexUrl='/asg/portal/h5/reader.html?';
var oClickSwitch=true;
var appVue=new Vue({
	el:'#book_main_vue',
	data:{
		oQudaohao:qudaohaoHide(),
		iosShow : true,
		forJson:{},
		butShow:false,
		prevChapter:0,
		nextChapter:0,
		pageSwitch:true,
		collectionDisplay:false,
		collectionText:'',
		loadingDiaplay:false,
		show:false
	},
	methods:{
		fixediOSRemove:function(){
			$.cookie('fixed_iOS',true,{ expires:0.5, path: '/'});
			appVue.iosShow=false;
		},
		addShelf:function(sBookIdS){
			$.get('/asg/portal/h5/bookShelf/add.html?bookids='+sBookIdS,function(data){
				//console.log(data);
				if(data==1){
					appVue.forJson.isInBookShelf=true;
				}else{
					$('#clear_alert_box').show();
					return false;
				}
			});
		},
		
		
		
		pageChapter:function(num,str){
			/*
			//if(appVue.forJson.bookId == '11000000439' && parseInt(num) > 244045){
			if(appVue.forJson.bookId == '11000000439' && parseInt(num) >= 244045 && sChanneCookie=='K900033'
			
			||appVue.forJson.bookId == '11000001945' && parseInt(num) >= 902262 && (sChanneCookie=='K900040'||sChanneCookie=='K900060')
			||appVue.forJson.bookId == '11000005757' && parseInt(num) >= 2797114 && (sChanneCookie=='K900044' || sChanneCookie=='K900058'|| sChanneCookie=='K900059')
			
			||appVue.forJson.bookId == '11000003440' && parseInt(num) >= 1732699 && sChanneCookie=='K900053'
			||appVue.forJson.bookId == '11000007177' && parseInt(num) >= 3374192 && (sChanneCookie=='K900054'||sChanneCookie=='K900055')
			
			||appVue.forJson.bookId == '11000001253' && parseInt(num) >= 392418 && (sChanneCookie=='K900047'||sChanneCookie=='K900048')
			||appVue.forJson.bookId == '11000007170' && parseInt(num) >= 3369803 && (sChanneCookie=='K900050'||sChanneCookie=='K900051')){
				fPushState('book.html?bookId='+appVue.forJson.bookId+'&chapterId='+appVue.forJson.chapterId);
				winLocalHref('/add_kkj.html?20160803');
			}
			*/
			
			//根据渠道号 书名  章节判断跳转关注二维码页
			addKkjHtml('/add_kkj.html?20160809',appVue.forJson.bookId, num, sChanneCookie, 'book.html?bookId='+appVue.forJson.bookId+'&chapterId='+appVue.forJson.chapterId);
			
			
			
			
			//alert(str)
			if(!oClickSwitch){
				return false;
			}
			//lockStop();
			if(!$.trim(num)){
				if(!$.trim(appVue.forJson.preChapterId)){
					return popError('已经是第一章了！');
				}else if(!$.trim(appVue.forJson.nextChapterId)){
					return popError('已经是最后一章了！');
				}
			}
			
			
			var oBookInfo={
				loginUrl:winLocalHref(),
				bookId:appVue.forJson.bookId,
				chapterId:num,
				reaction:3
			}
			oBookInfo=jsonStr(oBookInfo);
			$.cookie('book_info',oBookInfo, { expires: nTimeMs });
			$.get(sIndexUrl+'bookId='+appVue.forJson.bookId+'&reaction='+3+'&chapterId='+num,function(data){
				//console.log(data);
				oClickSwitch=true;
				//appVue.loadingDiaplay=true;
				//alert(data)
				data=jsonStr(data);
				if(data['status']=='1'){
					oBookInfo=jsonStr(oBookInfo);
					oBookInfo['chapterId']=num;
					oBookInfo=jsonStr(oBookInfo);
					$.cookie('book_info',oBookInfo, { expires: nTimeMs });
					postTongji('&rukou=ydy&type=wdlerror&chapterId='+num+'&status='+data['status']);
					
					fPushState('book.html?bookId='+appVue.forJson.bookId+'&chapterId='+appVue.forJson.chapterId);
					if(oChannelCode[sChannelCodeCookie]){
						winLocalHref('/login/login.html');
					}else{
						winLocalHref('/subscribe_chapter.html?bookId='+appVue.forJson.bookId+'&reaction='+3+'&chapterId='+num);
					}
				}else if(data['status']=='4'){
					$.cookie("book_info", null);
					appVue.forJson=data;
					$('html,body').scrollTop(50);
					
					
					
					//添加到本地最近阅读
					/*
						appVue.forJson.bookName,  //书名
						appVue.forJson.chapterName
						appVue.forJson.bookId,	//书id
						appVue.forJson.chapterId,	//章节id
						sIntroduction,	//简介
						appVue.forJson.coverWap,	//封面图片
						sAuthor,	//作者
						maxChapter,	//最大章节
						sTime,	//当前时间
						ctime	//当前时间
					*/
					
					setLocalRecentlyRead(appVue.forJson.bookName,appVue.forJson.chapterName,appVue.forJson.bookId,appVue.forJson.chapterId, appVue.forJson.intro,appVue.forJson.coverWap,appVue.forJson.author,appVue.forJson.totalChapters,appVue.forJson.readDate,appVue.forJson.readDate);
					
					
					
					if(appVue.forJson.amount!=null){
						postTongji('&rukou=ydy&type=payOk&chapterId='+num+'&status='+data['status']);
					}
					///book.html?bookId=10013953&chapterId=10013955
					//fPushState('book.html?bookId='+appVue.forJson.bookId+'&chapterId='+num);
				}else if(data['status']=='0'){
					oBookInfo=jsonStr(oBookInfo);
					oBookInfo['chapterId']=num;
					oBookInfo=jsonStr(oBookInfo);
					$.cookie('book_info',oBookInfo, { expires: nTimeMs });
					postTongji('&rukou=ydy&type=yuebuzuError&chapterId='+num+'&status='+data['status']);
					fPushState('book.html?bookId='+appVue.forJson.bookId+'&chapterId='+appVue.forJson.chapterId);
					winLocalHref('/subscribe_chapter.html?bookId='+appVue.forJson.bookId+'&reaction='+3+'&chapterId='+num);
				}
			
			});
		}
	}
});


var sUuserA=window.navigator.userAgent.toLowerCase();
if (/iphone|ipad|ipod/.test(ua)){
	if(/ucbrowser/.test(ua)){
		//alert('ios  UC 添加到书签');
		appVue.collectionDisplay=true;
		appVue.collectionText='添加到浏览器收藏';
	}else if(/qqbrowser/.test(ua)){
		
	}else if(/safari/.test(ua)){
	}
	else{
		//appVue.collectionDisplay=true;
	}
	
	
}else {
	//android
	if (/ucbrowser/.test(ua)){
		//alert('android  UC 添加到桌面快捷方式');
		appVue.collectionDisplay=true;
		appVue.collectionText='发送到手机桌面';
	}else if(/qqbrowser/.test(ua)){
		//alert('android  qq 添加到书签');
	}else{
		//appVue.collectionDisplay=true;
		  //alert(0)
	}

}


if ($.cookie('fixed_iOS')){
	appVue.iosShow=false;
}

if(!(/iphone|ipad|ipod/.test(sUuserA))||!(/.*version\/([\w.]+).*(safari).*/.test(sUuserA))||/mxios|mqqbrowser|crios|firefox|msie|baidu|ucbrowser|opios|sogoumobilebrowser|micromessenger|qq/.test(sUuserA)){
	appVue.iosShow=false;
}

if(appVue.iosShow){
	setTimeout(function(){
		$.cookie('fixed_iOS',true,{ expires:0.5, path: '/'});
		appVue.iosShow=false;
	},10000)
}


if($.cookie("uid")&&$.cookie("KKYD_INFO")&&$.cookie("KKYD_INFO")!='null'&&$.cookie("uid")!='null'){
	appVue.butShow=false;
}else{
	appVue.butShow=true;
}




var sOldCookie=$.cookie('book_info');
var sGetUrl=sIndexUrl+'bookId='+sBookId+'&reaction=3&chapterId='+sChapterId;
/*
if($.cookie('book_info')!=null&&sOldCookie['bookId']==sBookId&&sOldCookie['chapterId']==sChapterId){
	sGetUrl=sIndexUrl+'bookId='+sBookId+'&reaction=3&chapterId='+sChapterId;
}else{
	sGetUrl=sIndexUrl+'bookId='+sOldCookie.bookId+'&reaction=3&chapterId='+sOldCookie.chapterId;
}
*/

if(sOldCookie&&sOldCookie!='null'){
	sOldCookie=jsonStr(sOldCookie);
	var sIfChapterId=getWinUrl('chapterId',sOldCookie['loginUrl']);
	if(sOldCookie['bookId']!=sBookId&&sIfChapterId!=sChapterId){
		sGetUrl=sIndexUrl+'bookId='+sBookId+'&reaction=3&chapterId='+sChapterId;
	}else{
		sGetUrl=sIndexUrl+'bookId='+sOldCookie['bookId']+'&reaction=3&chapterId='+sIfChapterId;
	}
}else{
	sGetUrl=sIndexUrl+'bookId='+sBookId+'&reaction=3&chapterId='+sChapterId;
}












$.get(sGetUrl,function(data){
	/*$.cookie("book_info", null);
	//console.log(data);
	data=jsonStr(data);
	appVue.forJson=data;
	appVue.show=true;*/
	//console.log(data);
	data=jsonStr(data);
	//appVue.loadingDiaplay=true;
	
	if(data['status']=='1'){
		postTongji('&rukou=ydy&type=wdlerror&chapterId='+sChapterId+'&status='+data['status']);
		var oBookInfo={
			loginUrl:winLocalHref(),
			bookId:sBookId,
			chapterId:sChapterId,
			reaction:3
		}
		oBookInfo=jsonStr(oBookInfo);
		$.cookie('book_info',oBookInfo, { expires: nTimeMs });
		if(oChannelCode[sChannelCodeCookie]){
			winLocalHref('/login/login.html');
		}else{
			winLocalHref('/subscribe_chapter.html?bookId='+sBookId+'&reaction='+3+'&chapterId='+sChapterId);
		}
	}else if(data['status']=='4'){
		$(window).scrollTop(0);
		$.cookie("book_info", null);
		appVue.forJson=data;
		appVue.show=true;
		//console.log(appVue.forJson.amount);
		
		
					
		
					
					
		
		//添加到本地最近阅读
		/*
			appVue.forJson.bookName,  //书名
			appVue.forJson.chapterName
			appVue.forJson.bookId,	//书id
			appVue.forJson.chapterId,	//章节id
			sIntroduction,	//简介
			appVue.forJson.coverWap,	//封面图片
			sAuthor,	//作者
			maxChapter,	//最大章节
			sTime,	//当前时间
			ctime	//当前时间
		*/
		
		setLocalRecentlyRead(appVue.forJson.bookName,appVue.forJson.chapterName,appVue.forJson.bookId,appVue.forJson.chapterId, appVue.forJson.intro,appVue.forJson.coverWap,appVue.forJson.author,appVue.forJson.totalChapters,appVue.forJson.readDate,appVue.forJson.readDate);
		
		
					
		
		
		if(appVue.forJson.amount!=null){
			postTongji('&rukou=ydy&type=payOk&chapterId='+sChapterId+'&status='+data['status']);
		}
	}else if(data['status']=='0'){
		console.log(appVue.forJson.amount);
		
		var oBookInfo={
			loginUrl:winLocalHref(),
			bookId:sBookId,
			chapterId:sChapterId,
			reaction:3
		}
		oBookInfo=jsonStr(oBookInfo);
		$.cookie('book_info',oBookInfo, { expires: nTimeMs });
		postTongji('&rukou=ydy&type=yuebuzuError&chapterId='+sChapterId+'&status='+data['status']);
		winLocalHref('/subscribe_chapter.html?bookId='+sBookId+'&reaction='+3+'&chapterId='+sChapterId);
	}
});







function lockStop(){
	oClickSwitch=false;
	appVue.loadingDiaplay=false;
	setTimeout(function(){
		oClickSwitch=true;
		appVue.loadingDiaplay=true;
	},2000);
}





















/*

lenght
key(index)
getItem(key)
setItem(key,value)
removeItem(key)
clear()


var Read = {};
var ty = 0;
var tm = false;
var lh = 0;
var CHAPTER_URL = "";
var CHAPTER_URL2 = "";
var mainMenuStatus = false;
var mainMenuShow = false;
var configshow = false;
var moreOpershow = false;
var defaultFontsize = 18;
var minFontSize = 18;
var maxFontSize = 24;
var footHeight = 0;
var contentRegExp = /(\n[\r|\s|\t|　]*)+/g;
var titleRegExp = /第[0-9|一|二|三|四|五|六|七|八|九|十|百|千]+[章|回|卷|部|节]/;
Read.bid = 0;
Read.cid = 1;
Read.totalChapter = 0;
Read.view = true;
Read.buyInRead = 0;
Read.showNotice = true;
Read.openTrack = false;
Read.scrolly = 0;
Read.prefetchContent = {};
Read.mpMaxSize = 20;
Read.mpBid = "read.mpBid";
Read.mpStartCid = "read.mpStartCid";
Read.mpEndCid = "read.mpEndCid";
Read.mpContent = "read.mpContent";
Read.mpContentTmp = "read.mpContentTmp";
Read.mpTipsShow = false;
Read.isMPing = false;



$(function(){
	//book.html?uid=633946&bid=45687&cid=1369#1200  url地址样子
	var oLocalStorage=window.localStorage;
	var sUrl=winLocalHref(),aUserInfo,nScrollTop=0,getParameter='';
	if(oLocalStorage&&sUrl.indexOf('&')>0){
		sUrl=sUrl.split('?')[1];
		if(sUrl.indexOf('#')>0){
			//get  传参  uid=633946&bid=45687&cid=1369
			getParameter=sUrl.split('#')[0];
			//uid bid cid  数组值
			aUserInfo=getParameter.split('&');
			//1200 上次打开本章的scrolltop值 没有默认0
			nScrollTop=sUrl.split('#')[1];
		}else if(sUrl.indexOf('&')>0){
			//get  传参  uid=633946&bid=45687&cid=1369
			getParameter=sUrl;
			//uid bid cid  数组值
			aUserInfo=sUrl.split('&');
		}
		var uid=aUserInfo[0].split('=')[1];
		var bid=aUserInfo[1].split('=')[1];
		var cid=aUserInfo[2].split('=')[1];
		
		
		$.ajax({
			url:'/new/json/xiaoshuojson.json?'+getParameter,
			type:'GET',
			dataType:"json",
			success: function(data){
				////console.log(data);
				var data=data;
				var sHtml=data.content;
				$('.text_content_box').html(sHtml);
				$('html,body').scrollTop(nScrollTop);
			},
			error:function(data){
				//console.log(data);
			}
		})
		
		
		
		
	}
	
	
	bookScrollTop.nTimeOut=setTimeout(bookScrollTop,5000);
});



function bookScrollTop(){
	clearTimeout(bookScrollTop.nTimeOut)
	window.location.replace("#" + $(window).scrollTop());
	bookScrollTop.nTimeOut=setTimeout(bookScrollTop,5000);
	//console.log(bookScrollTop.nTimeOut);
}






*/












