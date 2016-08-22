//stringify 
//weixinJumpUrl('/asg/portal/h5/login/weixinInner.do'); 
var nCityHaide=0;
var nTimeMs=0.1;
var oChannelCode={
	'K900027':true
};


//var sChannelCode='k123456789';
var sChannelCode=getWinUrl('channelCode');
if(sChannelCode!=''){
	var oCookie=sChannelCode;
	$.cookie("channelCode", oCookie, { expires: 999999 , path: '/'});
}


var sChannelCodeCookie=$.cookie('channelCode');
if(sChannelCodeCookie&&sChannelCodeCookie.length>7){
	sChannelCodeCookie=sChannelCodeCookie.substring(0,7);
	$.cookie("channelCode", sChannelCodeCookie, { expires: 999999 , path: '/'});
}
// JavaScript Document
/*
var sChannelCode=winLocalHref();
if(sChannelCode.indexOf('?')>0){
	sChannelCode=sChannelCode.split('?')[1];
	if(sChannelCode.indexOf('&')!=-1){
		var aCode=sChannelCode.split('&');
		for(var cLen=0; cLen<aCode.length; cLen++){
			if(aCode[cLen].indexOf('channelCode=')!=-1){
				sChannelCode=aCode[cLen].split('=');
				oCookie[sChannelCode[0]]=sChannelCode[1];
			}
		}
	}else{
		sChannelCode=sChannelCode.split('=');
		oCookie[sChannelCode[0]]=sChannelCode[1];
	}
	
}*/
/*
oCookie=JSON.stringify(oCookie);
*/











var aColor=['#ff6fa2','#c462e1','#e33663','#fcaa69','#eb687e','#f0c47d','#78af52','#98a726','#eec72c','#092396','#1470b3','#FF5000','red','#ed145b','#129bf0','#f32d2d','#09b396','#4595e6','#fc7e1f','#00abae','#e0af00','#e0af00','#e0af00','#579d9f','#0b7f38','#cc233a','#f57c00','#ff6d00','#e64a19','#ff8f00','#827717','#33691e','#00897b','#009688','#259b24','#0a7e07','#00838f','#84ffff','#0277bd','#546e7a'];
var nColor=3;





$(function(){
	
	
	//alert(returnCitySN.cname)
	var sShouhuCityString=jsonStr(returnCitySN);
	var sSinaCityString=decodeURI(jsonStr(remote_ip_info));
	if(sSinaCityString.indexOf('浙江')>-1){
		var oCityHaide=window.setInterval(function(){
			if($('.city_hide').length>0){
				postTongji('&sinacity='+decodeURI(remote_ip_info.city)+'&shouhuCity='+returnCitySN.cname);
				$('.city_hide').hide();
				clearInterval(oCityHaide);
			}
		},500)
		
	}
	
	
	
	//关闭
	$('.close_btn').click(function(){
		console.log(111)
		var $oThis=$(this);
		$oThis.parent('.ios_destop').css('display','none');
	})
	
	
	//常规统计
	postTongji('&type=normal');
	
	
	$(window).scroll(function(){
		var nWinH=$(window).height();
		if($(window).scrollTop()>200){
			$('.head_search_box').addClass('head_search_box_position');
		}else{
			$('.head_search_box').removeClass('head_search_box_position');
		}
		if($(window).scrollTop()>nWinH){
			$('.return_top_but').addClass('return_top_but_position');
		}else{
			$('.return_top_but').removeClass('return_top_but_position');
		}
	});
	
	
//	$('html,body').addEventListener('touchStart',function(){
//		
//		-webkit-tap-highlight-color:transparent;
//	})
//	
	
		
	if($.cookie('KKYD_INFO')){
		$('body').addClass('footer_other_hide');
	}
	
	
	
	//console.log($.cookie('pline'));
	if(!$.cookie("colorsVal")){
		$.cookie("colorsVal", nColor, { expires: 30, path: '/' });
	}else{
		if(parseInt($.cookie("colorsVal"))>=aColor.length-1){
			nColor=0;
		}else{
			nColor=parseInt($.cookie("colorsVal"))+1;
		}
	}
	/*
	$('.header_tit,.head_tab_but_box').css('background-color',aColor[nColor]);
	$('.conter_list_tab_box a').css('color',aColor[nColor]);
	$('.head_tab_but_box a').css('border-bottom-color',aColor[nColor]);
	$('.conter_list_tab_box,.conter_list_tab_box a').css('border-color',aColor[nColor]);
	$('.conter_list_tab_box a.hover').css('background-color',aColor[nColor]);
	$('.search_input input').val(nColor+'====='+aColor[nColor]);
	$.cookie("colorsVal", nColor, { expires: 30 });
	*/
	//返回
	$(document).on('click','.return_page',function(){
		//var sPrevUrl=document.referrer;
		//if($.cookie('book_info')&&$.cookie('book_info')!='null'){
			$.cookie("book_info", null, { expires: -1, path: '/' });
		//}
		/*if(sPrevUrl.indexOf('m.kkyd.cn')==-1){
			winLocalHref('/');
			return false;
		}*/
		postTongji('&type=return');
		history.go(-1);
		
	//返回顶部
	}).on('click','.return_top_but',function(){
		$('html,body').animate({'scrollTop':0},200);
		
	//阅读指南
	}).on('click','.read_guide_ul li > a',function(){
		var oThis=$(this);
		var oP=oThis.siblings('p');
		oP.toggle(100);
		
	//自动订阅
	}).on('click','.subscribe_edit_box a',function(){
		var oThis=$(this);
		oThis.parents('.read_guide_box').toggleClass('read_guide_subscribe_show');
		
		
	//}).on('click','.subscribe_remove_but',function(){
		//$(this).parent().remove();
	
	
	
	
	
	//pow_eye_but
	}).on('click','.pow_eye_but',function(){
		var oThis=$(this);
		var oInput=oThis.siblings('.pow_eye_input').find('input');
		oThis.toggleClass('hover');
		if(oThis.hasClass('hover')){
			oInput.attr('type','text');
		}else{
			oInput.attr('type','password');
		}
		
	///user_center.html
	}).on('click','.user_img_but',function(){
		$.cookie('book_info',null);
		//winLocalHref('/user_center.html');
		
	//首页下载appremove
	/*}).on('click','.fixed_clear_but',function(){
		$.cookie('fixed_down',true,{ expires: 1 });
		$(this).parents('.fixed_down_box_height').hide();*/
		
	//关闭弹出框
	}).on('click','.alert_tit_clear',function(){
		$('.bind_alert_box').hide();
	});
})
/*

function lazyloadimg(obj){

	$(obj).lazyload();
	
}
*/
//2016 5 23  公用方法


//字符串split取值  str 栗子 sWinUrl='http://m.ishugui.com/t/h5_images.php?code=001VUXdN1DGgd01ehDfN1qLUdN1VUXdm&state=123'
//getWinUrl('code')   →  '001VUXdN1DGgd01ehDfN1qLUdN1VUXdm'
function getWinUrl(str,url){
	var sWinUrl=decodeURI(winLocalHref());
	if(url){
		sWinUrl=decodeURI(url);
	}
	
	if(sWinUrl.indexOf('#')>-1){
		sWinUrl=sWinUrl.split('#')[0];
	}
	
	
	if(sWinUrl.indexOf(str+'=')>0){
		sWinUrl=sWinUrl.split("?")[1];
		if(sWinUrl.indexOf('&')>0){
			sWinUrl=sWinUrl.split('&');
			for(var wI=0;wI<sWinUrl.length; wI++){
				var aWurl=sWinUrl[wI].split('=');
				if(aWurl[0]==str){
					return aWurl[1]
				}
			}
		}else{
			var aWurl=sWinUrl.split('=');
			if(aWurl[0]==str){
				return aWurl[1];
			}
		}
	}else{
		//console.log('没渠道');
		return '';
	}
}


//json 字符串  对象 互转   objstr  必须是对象或者是对象格式的字符串
function jsonStr(objStr){
	if(typeof objStr=='object'){
		return JSON.stringify(objStr);
	}else if(typeof objStr=='string'){
		return JSON.parse(objStr);
	}else{
		//console.log('objStr:"是一个'+typeof objStr+'"类型 既不是对象也不是对象格式的字符串')
		return objStr;
	}
}


//跳转链接  获取连接
function winLocalHref(str){
	if(str){
		window.location.href=str;
	}else{
		return window.location.href;
	}
}

//阻止浏览器的默认行为 
function stopDefault( e ) {
    //阻止默认浏览器动作(W3C) 
    if ( e && e.preventDefault ){
        e.preventDefault();
    //IE中阻止函数器默认动作的方式 
    }else{
        window.event.returnValue = false;
	}
    return false; 
}

//阻止事件冒泡,使成为捕获型事件触发机制
function stopBubble(e) { 
	//如果提供了事件对象，则这是一个非IE浏览器 
	if ( e && e.stopPropagation ){
		//因此它支持W3C的stopPropagation()方法 
		e.stopPropagation(); 
	}else{
		//否则，我们需要使用IE的方式来取消事件冒泡 
		window.event.cancelBubble = true;
	}
}



//html5 pushState 无刷新跳转
function fPushState(url){
	if(url){
		window.history.pushState({},0,'http://'+window.location.host+'/'+url);
	}
}









function bookmark() {
	var title=document.title;
	var url=window.location.href;
	if(document.all) { // ie
		window.external.AddFavorite(url, title);
	}else if(window.sidebar) { // firefox
		window.sidebar.addPanel(title, url, "");
	}else if(window.opera && window.print) { // opera
		var elem = document.createElement('a');
		elem.setAttribute('href',url);
		elem.setAttribute('title',title);
		elem.setAttribute('rel','sidebar');
		elem.click(); // this.title=document.title;
	}else{
		alert("加入收藏失败，请使用Ctrl+D进行添加");
	}
}


function postTongji(sTongji){
	var sPrevUrlReferrer=encodeURI(document.referrer);
	var sKkydInfo='';
	if($.cookie('KKYD_INFO')&&$.cookie('KKYD_INFO').indexOf('_')!=-1){
		sKkydInfo=$.cookie('KKYD_INFO').split('_')[0];
	}
	var sTongChannelCode=$.cookie('channelCode');
	var sUserId=$.cookie('uid');
	var sVisitor=$.cookie('visitor')
	var sUrl=window.location.href.split('.cn')[1];
	$.post('http://123.57.241.207:8009/data.htm?channelCode='+sTongChannelCode+'&kkydinfoid='+sKkydInfo+'&visitor='+sVisitor+'&userid='+sUserId+sTongji+'&sPrevUrlReferrer='+sPrevUrlReferrer+'&url='+sUrl,'',function(data){
	});
}




//离线最近阅读 localstorage
function setLocalRecentlyRead(sBookName,sChapterName,bid,cid,sIntroduction,sImg,sAuthor,maxChapter,sTime,ctime){
	if(window.localStorage){
		var oWinSt=window.localStorage;
		var oGetShelfList=getLocalRecentlyRead();
		var obj;
		if(oGetShelfList && oGetShelfList['content'].length>0){
			obj=oGetShelfList;
		}else{
			obj={
				"content":[
				],
				"synchronous":true,
				"size": 0
			}
		}
		var oContentItme={
			"status": "",
			"introduction": sIntroduction,
			"coverImage": sImg,
			"author": sAuthor,
			"bookName": sBookName,
			"chapterName": sChapterName,
			"bookid": bid,
			"uid": "",
			"chapterid": cid,
			"maxChapter": maxChapter,
			"ctime": ctime,
			"utime": sTime,
			"id": "",
			"type":""
		}
		
		var sLocalRead=$.trim(oWinSt.getItem('recentlyRead'));
		
		if(sLocalRead){
			sLocalRead=jsonStr(sLocalRead);
			obj.content=sLocalRead.content;
		}
	
		for(var i=0; i<obj.content.length; i++){
			if(bid==obj.content[i].bookid){
				obj.content.splice(i,1);
				break;
			}
		}
		
		if(obj.content.length>0){
			obj.content.unshift(oContentItme);
		}else{
			obj.content.push(oContentItme);
		}
		obj.size=obj.content.length;
		obj=jsonStr(obj);
		oWinSt.setItem('recentlyRead',obj);
		
		
	}	
}


function getLocalRecentlyRead(){
	if(window.localStorage){
		var oWinSt=window.localStorage;
		var getRead=$.trim(oWinSt.getItem('recentlyRead'));
		if(getRead){
			getRead=jsonStr(getRead);
			return getRead;
		}else{
			return {"content":[]};
		}
		
	}	
}

function removeLocalRecentlyRead(itme){
	if(window.localStorage){
		var oWinSt=window.localStorage;
		var getRead=$.trim(oWinSt.getItem('recentlyRead'));
		if(getRead){
			getRead=jsonStr(getRead);
			getRead.content.splice(itme,1);
			getRead=jsonStr(getRead);
			oWinSt.setItem('recentlyRead',getRead);
		}
	}	
}


function removeLocalRecentlyReadId(sBookId){
	if(window.localStorage){
		var oWinSt=window.localStorage;
		var getRead=$.trim(oWinSt.getItem('recentlyRead'));
		if(getRead){
			getRead=jsonStr(getRead);
			for(var i=0; i<getRead.content.length; i++){
				if(sBookId==getRead.content[i].bookid){
					getRead.content.splice(i,1);
				}
			}
			getRead=jsonStr(getRead);
			oWinSt.setItem('recentlyRead',getRead);
		}
	}	
}








function readSynchronous(){
	
	var sUserId=$.cookie('uid');
	var sGetLocalRecentlyRead=getLocalRecentlyRead();
	if(sUserId && sUserId!='null' && sGetLocalRecentlyRead['synchronous'] && sGetLocalRecentlyRead['content'].length>0){	
		sGetLocalRecentlyRead['synchronous']=false;
		var oRecentlyList={
			list:[],
			userid:sUserId
		}
		for(var nI=0; nI<sGetLocalRecentlyRead['content'].length; nI++){
			var oSynchronousList={
				"bookid": sGetLocalRecentlyRead['content'][nI]["bookid"],
				"chapterid": sGetLocalRecentlyRead['content'][nI]["chapterid"],
				"utime": sGetLocalRecentlyRead['content'][nI]["utime"]
			}
			oRecentlyList.list.push(oSynchronousList);
		}
		oRecentlyList=jsonStr(oRecentlyList);
		sGetLocalRecentlyRead=jsonStr(sGetLocalRecentlyRead);
		window.localStorage.setItem('recentlyRead',sGetLocalRecentlyRead);
		$.ajax({
			type:'post',
			url:"/asg/portal/h5/bookShelf/uploadRecentlyRead.do",
			async:false,
			data:'json='+oRecentlyList,
			success: function(data){
			}
		});
	}
}







function weixinJumpUrl(sUrl){
	
	var sUage = window.navigator.userAgent.toLowerCase();
	var sUserId=$.cookie('uid');
	
	if(sUage.match(/MicroMessenger/i) == 'micromessenger' && sUserId){		
		winLocalHref(sUrl)
	}
}




function clearBookInfo(sCookieName){
	$.cookie(sCookieName, null, { expires: -1, path: '/' });
}


function referrerUrl(sReferrerUrl,oBoolean){
	var sDomRef=document.referrer;
	if(sDomRef&&sDomRef.indexOf(sReferrerUrl)>-1){
		return oBoolean
	}else{
		return !oBoolean
	}
}




//
var addKkjArr=[
	['11000000439',244045,'K900033'],
		
	['11000008176',3656685,'K900069'],
	['11000008176',3656685,'K900074'],
	['11000008176',3656685,'K900075'],
	['11000008176',3656685,'K900076'],
	['11000008176',3656685,'K900079'],
	['11000008176',3656685,'K900080'],
	['11000008176',3656685,'K900081'],
	['11000008176',3656685,'K900024'],
	['11000008176',3656685,'K900029'],
	['11000008176',3656685,'K900083'],
	['11000008176',3656685,'K900092'],
	['11000008176',3656685,'K900047'],
	['11000008176',3656685,'K900101'],
	['11000008176',3656685,'K900117'],
	['11000008176',3656685,'K900128'],
	['11000008176',3656685,'K900134'],
	['11000008176',3656685,'K900130'],
	['11000008176',3656685,'K900146'],
	['11000008176',3656685,'K900162'],
	['11000008176',3656685,'K900175'],
	['11000008176',3656685,'K900178'],
	['11000008176',3656685,'K900168'],
	['11000008176',3656685,'K900169'],
	['11000008176',3656685,'K900203'],
	['11000008176',3656685,'K900206'],
	['11000008176',3656685,'K900211'],
	['11000008176',3656685,'K900212'],
	['11000008176',3656685,'K900213'],
	['11000008176',3656685,'K900197'],
	['11000008176',3656685,'K900226'],
	['11000008176',3656685,'K900237'],
	['11000008176',3656685,'K900251'],
	['11000008176',3656685,'K900252'],
	
	['11000005768',2802939,'K900102'],
	['11000005768',2802939,'K900122'],
	['11000005768',2802939,'K900263'],
	['11000005768',2802939,'K900264'],
	['11000005768',2802939,'K900265'],
	['11000005768',2802939,'K900266'],
	['11000005768',2802939,'K900267'],
	['11000005768',2802939,'K900312'],
		
	['11000008173',3654993,'K900070'],
	['11000008173',3654993,'K900042'],
	['11000008173',3654993,'K900045'],
	['11000008173',3654993,'K900298'],
	['11000008173',3654993,'K900330'],
	
	['11000003440',1732699,'K900053'],
	['11000003440',1732699,'K900068'],
	
	['11000001945',902262,'K900040'],
	['11000001945',902262,'K900060'],
	
	['11000005757',2797114,'K900058'],
	['11000005757',2797114,'K900059'],
	
	['11000001253',392418,'K900048'],
	['11000001253',392418,'K900118'],
	['11000001253',392418,'K900043'],
	['11000001253',392418,'K900044'],
	['11000001253',392418,'K900133'],
	['11000001253',392418,'K900129'],
	['11000001253',392418,'K900158'],
	['11000001253',392418,'K900152'],
	['11000001253',392418,'K900165'],
	['11000001253',392418,'K900204'],
	['11000001253',392418,'K900205'],
	['11000001253',392418,'K900216'],
	['11000001253',392418,'K900217'],
	['11000001253',392418,'K900327'],
	
	['11000007170',3369803,'K900051'],
	['11000007170',3369803,'K900085'],
	['11000007170',3369803,'K900093'],
	['11000007170',3369803,'K900099'],
	['11000007170',3369803,'K900095'],
	['11000007170',3369803,'K900207'],
	['11000007170',3369803,'K900214'],
	['11000007170',3369803,'K900215'],
	['11000007170',3369803,'K900198'],
	['11000007170',3369803,'K900224'],
	['11000007170',3369803,'K900218'],
	['11000007170',3369803,'K900238'],
	['11000007170',3369803,'K900253'],
	['11000007170',3369803,'K900291'],
	['11000007170',3369803,'K900292'],
	['11000007170',3369803,'K900335'],
	
	['11000005835',2823987,'K900097'],
	['11000005835',2823987,'K900111'],
	['11000005835',2823987,'K900114'],
	['11000005835',2823987,'K900135'],
	['11000005835',2823987,'K900145'],
	['11000005835',2823987,'K900150'],
	['11000005835',2823987,'K900154'],
	['11000005835',2823987,'K900167'],
	['11000005835',2823987,'K900170'],
	['11000005835',2823987,'K900202'],
	['11000005835',2823987,'K900336'],
	
	['11000007186',3380317,'K900062'],
	['11000007186',3380317,'K900063'],
	
	['11000008214',3674269,'K900089'],
	['11000008214',3674269,'K900090'],
	['11000008214',3674269,'K900050'],
	['11000008214',3674269,'K900278'],
	['11000008214',3674269,'K900279'],
	['11000008214',3674269,'K900280'],
	['11000008214',3674269,'K900281'],
	
	['11000007177',3374192,'K900054'],
	['11000007177',3374192,'K900065'],
	['11000007177',3374192,'K900055'],
	
	['11000001251',392153,'K900120'],
	['11000001251',392153,'K900119'],
	['11000001251',392153,'K900106'],
	['11000001251',392153,'K900273'],
	['11000001251',392153,'K900274'],
	['11000001251',392153,'K900275'],
	['11000001251',392153,'K900276'],
	['11000001251',392153,'K900277'],
	
	
	['11000001253',392415,'K900123'],
	
	['11000008176',3656682,'K900124'],
	
	['11000006359',3097084,'K900121'],
	['11000006359',3097084,'K900219'],
	['11000006359',3097084,'K900239'],
	['11000006359',3097084,'K900227'],
	['11000006359',3097084,'K900233'],
	['11000006359',3097084,'K900254'],
	['11000006359',3097084,'K900295'],
	
	['11000008421',3710372,'K900144'],
	['11000008421',3710372,'K900159'],
	['11000008421',3710372,'K900153'],
	['11000008421',3710372,'K900166'],
	['11000008421',3710372,'K900221'],
	
	['11000008409',3701244,'K900163'],
	['11000008409',3701244,'K900173'],
	['11000008409',3701244,'K900180'],
	
	['11000008200',3667676,'K900164'],
	['11000008200',3667676,'K900181'],
	['11000008200',3667676,'K900199'],
	['11000008200',3667676,'K900201'],
	['11000008200',3667676,'K900231'],
	['11000008200',3667676,'K900235'],
	
	['11000008420',3709468,'K900196'],
	['11000008420',3709468,'K900334'],
	
	['11000008431',3717014,'K900220'],
	['11000008431',3717014,'K900240'],
	['11000008431',3717014,'K900228'],
	['11000008431',3717014,'K900230'],
	['11000008431',3717014,'K900236'],
	['11000008431',3717014,'K900250'],
	['11000008431',3717014,'K900255'],
	['11000008431',3717014,'K900261'],
	['11000008431',3717014,'K900171'],
	['11000008431',3717014,'K900328'],
	['11000008431',3717014,'K900329'],
	
	['11000005091',2521923,'K900222'],
	['11000005091',2521923,'K900229'],
	['11000005091',2521923,'K900232'],
	['11000005091',2521923,'K900258'],
	['11000005091',2521923,'K900259'],
	['11000005091',2521923,'K900313'],
	['11000005091',2521923,'K900311'],
	['11000005091',2521923,'K900320'],
	['11000005091',2521923,'K900321'],
	['11000005091',2521923,'K900340'],
	['11000005091',2521923,'K900333'],
	
	['11000008464',3744076,'K900249'],
	
	['11000008437',3720598,'K900241'],
	['11000008437',3720598,'K900245'],
	['11000008437',3720598,'K900257'],
	['11000008437',3720598,'K900260'],
	['11000008437',3720598,'K900314'],
	['11000008437',3720598,'K900315'],
	['11000008437',3720598,'K900306'],
	['11000008437',3720598,'K900307'],
	['11000008437',3720598,'K900308'],
	['11000008437',3720598,'K900310'],
	['11000008437',3720598,'K900318'],
	['11000008437',3720598,'K900319'],
	['11000008437',3720598,'K900210'],
	['11000008437',3720598,'K900337'],
	['11000008437',3720598,'K900339'],
	['11000008437',3720598,'K900331'],
	['11000008437',3720598,'K900332'],
	
	['11000001460',550629,'K900242'],
	['11000001460',550629,'K900246'],
	['11000001460',550629,'K900282'],
	['11000001460',550629,'K900283'],
	['11000001460',550629,'K900284'],
	['11000001460',550629,'K900285'],
	['11000001460',550629,'K900309'],
	['11000001460',550629,'K900322'],
	['11000001460',550629,'K900323'],
	
	['11000000937',323823,'K900243'],
	['11000000937',323823,'K900247'],
	['11000000937',323823,'K900268'],
	['11000000937',323823,'K900269'],
	['11000000937',323823,'K900270'],
	['11000000937',323823,'K900271'],
	['11000000937',323823,'K900272'],
	
	['11000005091',2521921,'K900244'],
	['11000005091',2521921,'K900248'],
	
	['11000007157',3363147,'K900256'],
	
	['11000008402',3695627,'K900262'],
	['11000008402',3695627,'K900304'],
	
	['11000001945',902264,'K900293'],
	['11000001945',902264,'K900294'],
	['11000001945',902264,'K900326'],
	
	['11000003884',1904259,'K900296'],
	['11000003884',1904259,'K900297'],
	
	['11000006359',3097084,'K900105'],
	['11000006359',3097084,'K900324'],
	['11000006359',3097084,'K900325'],
	['11000006359',3097084,'K900113']
	
];

function addKkjHtml(sFormUrl,addBookId, addChapterId, addChannelCode, nowUrl){
	for(var addI=0; addI<addKkjArr.length; addI++){
		if(addBookId==addKkjArr[addI][0] && parseInt(addChapterId)>=addKkjArr[addI][1] && addChannelCode==addKkjArr[addI][2]){
			if(nowUrl){
				fPushState(nowUrl);
			}
			//winLocalHref('/add_kkj.html?123456');
			var sShouhuCityString=jsonStr(returnCitySN);
			var sSinaCityString=decodeURI(jsonStr(remote_ip_info));
			if(sSinaCityString.indexOf('浙江')>-1){
			}else{
				winLocalHref(sFormUrl);
			}
		}
	}
}




//图片预加载
var clearImgTime=null;
function imgLoad(){	
	clearTimeout(clearImgTime);
	clearImgTime=setTimeout(function(){
		$('img').lazyload();
	},100);
}





















