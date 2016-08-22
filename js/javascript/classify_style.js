// JavaScript Document

var oJson = {
	bookNight:false,
	fontSize: "18px",
	pageShow: true,
	defaultSwitch: false,
	bookBg:{
		selectVal:2,
		aAookBg:['book_bg_1','book_bg_2','book_bg_3','book_bg_4']
	}
};

var sChannelCodeColorDo=$.cookie('channel_code_color');


if(!sChannelCodeColorDo||sChannelCodeColorDo==''||sChannelCodeColorDo==null||sChannelCodeColorDo=='null'||sChannelCodeColorDo==undefined){
	setTimeout(function(){
		$.get('/asg/portal/h5/recommended/get.do?channelCode='+sChannelCode,function(data){
			setTimeout(fStyleClassify,100);
		});
		//var sChannelCode=getWinUrl('channelCode');
//		var sCookieCode=$.cookie('channelCode');
//		if(sChannelCode){
//			sChannelCode=$.cookie('channelCode');
//			$.get('/asg/portal/h5/recommended/get.do?channelCode='+sChannelCode,function(data){
//				setTimeout(fStyleClassify,100);
//			});
//		}else{
//			if(sCookieCode!=sChannelCode){
//				$.get('/asg/portal/h5/recommended/get.do?channelCode='+sChannelCode,function(data){
//					setTimeout(fStyleClassify,100);
//				});
//			}
//		}
	},100);
}



fStyleClassify();
function fStyleClassify(){

	var nUserColor=$.cookie('user_color');
	var nChannelCodeColor=$.cookie('channel_code_color');
	var sStyleUrl='';
	
	if(nUserColor=='1'){
		sStyleUrl='/css/classify_style/classify_style_1.css?v20160731';
		bookBgColor(3);
	}else if(nUserColor=='2'){
		bookBgColor(2);
		return false;
	}else if(nUserColor=='3'||nUserColor==''||nUserColor==undefined||nUserColor==null||nUserColor=='null'){
		if(nChannelCodeColor=='1'){
			sStyleUrl='/css/classify_style/classify_style_1.css?v20160731';
			bookBgColor(3);
		}else if(nChannelCodeColor=='2'||nChannelCodeColor==''||nChannelCodeColor==undefined||nChannelCodeColor==null||nChannelCodeColor=='null'){
			bookBgColor(2);		
			return false;	
		}else if(nChannelCodeColor=='3'){
			sStyleUrl='/css/classify_style/classify_style_all.css';
			bookBgColor(1);
		}
		
	}
	

	var oDoc=document;
	var oLink=oDoc.createElement("link");
	oLink.setAttribute("rel", "stylesheet");
	oLink.setAttribute("type", "text/css");
	oLink.setAttribute("href", sStyleUrl);
	
	var oHeads = oDoc.getElementsByTagName("head");
	if(oHeads.length) oHeads[0].appendChild(oLink);
	else oDoc.documentElement.appendChild(oLink);
	
}


function bookBgColor(num){
	
	if(!$.cookie('contentJson')){
		oJson=JSON.stringify(oJson);
		$.cookie("contentJson",oJson,{ expires: 30 , path: '/' });
	}else if($.cookie('contentJson')){
		var oCookiJson=$.cookie('contentJson');
		oCookiJson=JSON.parse(oCookiJson);
		if(!oCookiJson.defaultSwitch){
			oCookiJson.bookBg.selectVal = num;
			oCookiJson=JSON.stringify(oCookiJson);
			$.cookie('contentJson',oCookiJson,{ expires: 30 , path: '/' });
		}
	}
	
}

