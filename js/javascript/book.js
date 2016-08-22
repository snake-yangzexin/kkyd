// JavaScript Document
/*/本地数据库全局变量
var db;
var dbName='conPageTable6';
var dbVersion='1.0';
var dbDisplayName='职位描述';
var dbMaxSize='20000000000';
var oClearTime=null;
var sContent='';
*/

var ua = navigator.userAgent.toLowerCase();
//cookieJson

//报错弹出框时间清除
var oErrorClear=null;



//手机屏幕旋转定位滚动条
var oWinResizeTime=null;


$(function(){
	
	$('.font_puls,.font_subtract').click(function(){
		
		clearTimeout(oWinResizeTime);
		var nScrollTop=$(window).scrollTop();
		var nTextH=$('.text_content_box').height();		
		var nEditFont,nFontSize=$('.text_content_box').attr('class');
		//alert(nFontSize)
		if(nFontSize.indexOf('count_font_')==-1){
			nFontSize=14;
		}else{
			nFontSize=nFontSize.split('_');
			nFontSize=parseInt(nFontSize[nFontSize.length-1]);
		}
		if($(this).hasClass('font_puls')){
			if((nFontSize+2)>30){
				popError('已经是最大了哦...');
				return false;
			}
			nEditFont=nFontSize+2;
			/*$('.text_content_box').css('font-size',nFontSize+2+'px');*/
			$('.text_content_box').attr('class','text_content_box count_font_'+nEditFont);
		}else{
			if((nFontSize-2)<12){
				popError('已经是最小了哦...');
				return false;
			}
			nEditFont=nFontSize-2;
			/*$('.text_content_box').css('font-size',nFontSize-2+'px');*/
			
			$('.text_content_box').attr('class','text_content_box count_font_'+nEditFont);
		}
		//setTimeout(function(){
			nTextH=$('.text_content_box').height()/nTextH;
			$(window).scrollTop(nTextH*nScrollTop);
			//$('html,body').animate({'scrollTop': nTextH*nScrollTop },100);
		//},100);
		oWinResizeTime=setTimeout(function(){
        	$('.page_but_box').show();
		},100);
		
		if(fGetCookie('contentJson')){
			var oCookiJson=fGetCookie('contentJson');
			oCookiJson.fontSize = nEditFont+'px';
			fSetCookie('contentJson',oCookiJson);
		}
		
	});
	
	
	
	/*
	$('.page_bu_top,.page_bu_bottom').click(function(){
		var oThis=$(this);
		var nScrollSpeed=200;
		var nPageH=$('.page_but_box').height();
		var nScrollTop=$(window).scrollTop();
		if(oThis.parents('.page_but_box').hasClass('page_but_show')){
			$('.page_but_box').removeClass('page_but_show');
			$('.page_but_box div').html('');
			return false;
		}
		if(oThis.hasClass('page_bu_top')){
			//$('html,body').animate({'scrollTop': nScrollTop-nPageH+100},nScrollSpeed);
			$('html,body').scrollTop(nScrollTop-nPageH+100);
		}else if(oThis.hasClass('page_bu_bottom')){
			//$('html,body').animate({'scrollTop': nScrollTop+nPageH-100},nScrollSpeed);
			$('html,body').scrollTop(nScrollTop+nPageH-100);
		}
		$('.text_con_footer,.book_header_tit').hide();
	});
	
	*/
	
	
	$('.page_bu_conter').click(function(){
		var oThis=$(this);
		if(oThis.parents('.page_but_box').hasClass('page_but_show')){
			$('.page_but_box').removeClass('page_but_show');
			return false;
		}
		$('.text_con_footer,.header_tit,.book_header_tit').toggle();
	});
	
	
	
	/*
	$('.page_but_box').click(function(event){
		var event=event||window.event;
		var oThis=$(this);
		var nPageH=oThis.height();
		var nPageW=oThis.width();
		var nScrollTop=$(window).scrollTop();
		var _clickX = event.clientX;
		var _clickY = event.clientY;
		if(oThis.find('div').length>0){
			oThis.html('');
			return false;
		}
		alert(_clickY+'=========='+nPageH)
		if(_clickY>nPageH*0.70){
			$('html,body').animate({'scrollTop': nScrollTop+nPageH-100},100);
		}else if(_clickY<nPageH*0.30){
			$('html,body').animate({'scrollTop': nScrollTop-nPageH+100},100);
		}else{
			$('.text_con_footer').toggle();
		}
		
	});
	*/
	
	
	//本地数据库
	
	/*
	if(window.openDatabase){
		//建库
		db = openDatabase(dbName,dbVersion,dbDisplayName,dbMaxSize);
		
		//建表
		db.transaction(function(tx){
			var sCreateTableSql='CREATE TABLE contentPage (id text,contents text, fontsize text)';
			tx.executeSql(sCreateTableSql);
		});

		//查
		db.transaction(function(tx){
			var sSelectSql='SELECT * FROM contentPage',sId='pageId',sContent='page',sFontsize='12px', oForover=true;
			tx.executeSql(sSelectSql,[],function(tx,result){
				
				for(var i=0; i<result.rows.length; i++){
					//alert(result.rows.item(i).id);
					if(result.rows.item(i).id == sId && result.rows.item(i).contents == sContent){
						oForover=false;
						return false;
					}
				}
		
				//增
				if(oForover){
					var sInsetSql='insert into contentPage (id, contents) values(?,?)';
					tx.executeSql(sInsetSql,[sId,sContent]);
					$('.page_but_box').addClass('page_but_show');
				}
			});
		});



	}
	
	*/
	
	
	$(window).resize(function() {
		clearTimeout(oWinResizeTime);
        $('.page_but_box').hide();
		oWinResizeTime=setTimeout(function(){
        	$('.page_but_box').show();
		},100);
    });
	
	
	
	
	
	
	
	//换皮肤
	$('.bg_color_box a').click(function(){
		var oThis=$(this);
		var sThisAtt=oThis.attr('bg_color');
		var nIndex=oThis.index();
		oThis.addClass('select_bg').siblings('a').removeClass('select_bg');
		$('body').attr('class',oJson.bookBg.aAookBg[nIndex]);
		
		if(fGetCookie('contentJson')){
			var oCookiJson=fGetCookie('contentJson');
			oCookiJson.defaultSwitch=true;
			oCookiJson.bookBg.selectVal = nIndex;
			fSetCookie('contentJson',oCookiJson);
		}
	});
	
	
	
	
	
	
	//夜间
	$('.book_night,.tian_se').click(function(){
		$('body').toggleClass('book_bg_night');
		var oCookieJson=fGetCookie('contentJson');
		if(oCookieJson){
			if($('body').hasClass('book_bg_night')){
				oCookieJson.bookNight = true;
			}else{
				oCookieJson.bookNight = false;
			}
		}
		fSetCookie('contentJson',oCookieJson);
	});
	//.book_setting
	$('.book_setting').click(function(){
		$('.text_con_font_edit').toggleClass('book_setting_show');
	});
	
	
	
	
	
	
		
		
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
	
	
	

});




function fGetCookie(cookieName){
	var sJson=$.cookie(cookieName);
	return JSON.parse(sJson);
}



function fSetCookie(cookieName,oJson){
	sJson=JSON.stringify(oJson);
	$.cookie(cookieName, sJson, { expires: 30 });
}








function popError(str){
	$('.text_but_error').html('<span>'+str+'</span>').fadeIn();
	clearTimeout(oErrorClear);
	oErrorClear=setTimeout(function(){
		$('.text_but_error').fadeOut();
	},2000);
}


function fCollectionDisplay(){
	
	if (/micromessenger/.test(ua)){
	}else{
		//iOS 
		if (/iphone|ipad|ipod/.test(ua)){
			if(/ucbrowser/.test(ua)){
				//alert('ios  UC 添加到书签');
				//otherRequst('ext:add_favorite');
				iosUc();
				//$('#collection_display').show();
			}else if(/qqbrowser/.test(ua)){
				
			}else if(/opios/.test(ua)){
				//otherRequst('ext:add_favorite');
				//$('#collection_display').show();
			}else{
				//otherRequst('ext:add_favorite');
				//iosUc();
			}
			
		//if(/android/.test(ua))	
		}else{
			//android
			if (/ucbrowser/.test(ua)){
				//alert('android  UC 添加到桌面快捷方式');
				fAndroid();
				//$('#collection_display').show();
			}else if(/qqbrowser/.test(ua)){
				//alert('android  qq 添加到书签');
			}else{
			  //fAndroid();
				  //alert(0)
			}
		}
	}
}



window.prtl={
	type:'https:'==window.location.protocol?'https':'http',
	prefix:'https:'==window.location.protocol?'https://':'http://'
};
var imgUrl='/images/icons/114_114.png';
function otherRequst(url) {
	var div = document.createElement('div');
	div.style.display= 'none';
	document.body.appendChild(div);
	div.innerHTML = '<iframe src="'+url+'" style="" />';
}

function iosUc(){
	window.location.href="ext:add_favorite";
}

function qbmiqbma(){
	otherRequst(''+window.prtl.prefix+'m.kkyd.cn');
}

function fAndroid(){
	otherRequst('ext:appshortcut:'+''+window.prtl.prefix+'m.kkyd.cn'+'|'+imgUrl+'|'+'快看阅读'+'|');
}



