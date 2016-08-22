// JavaScript Document http://101.200.193.169:3080/asg/portal/h5/index.do?type=index&pline=14&clPayAbility=3
var sIndexUrl='/asg/portal/h5/index.do?type=index';
var aNavIndex=0;
var oTopup={
	"ftlname": "topUpSql.ftl",
	"oTopupImg":"/images/img/banner_kkj_640.gif"
}
var sNowChannelCode=$.cookie('channelCode');
if(sNowChannelCode=='K900001'){
	oTopup["oTopupImg"]='/images/img/kkj/K900001.gif';
}else if(sNowChannelCode=='K900002'){
	oTopup["oTopupImg"]='/images/img/K900002.gif';
}else{
	oTopup["oTopupImg"]='/images/img/kkj/banner_kkj_640.gif';
}

indexJson();


var appVue=new Vue({
	el:'#appVue',
	data:{
		iosShow : true,
		fixedDown:true,
		userImg:false,
		forJson:[],
		show:false
	},
	methods:{
		fixedDownRemove:function(){
			$.cookie('fixed_down',true,{ expires: 1 , path: '/'});
			appVue.fixedDown=false;
		},
		fixediOSRemove:function(){
			$.cookie('fixed_iOS',true,{ expires: 0.5, path: '/'});
			appVue.iosShow=false;
		},
		firstCharge:function(){
			var sDeviceId=$.cookie('KKYD_INFO');
			if(sNowChannelCode!='K900001'&&sNowChannelCode!='K900002'){
				winLocalHref('/first_charge.html?123');
			}else{
				$.cookie("firstCharge", 'top_up', { expires: 999999 , path: '/'});
				if(sDeviceId && sDeviceId.indexOf('yk_')<0 && sDeviceId!='null'){
					winLocalHref('/top_up.html');
				}else{
					winLocalHref('/login/login.html');
				}
			}
		}
	}
	
});

var sUuserA=window.navigator.userAgent.toLowerCase();
var sAppName=window.navigator.appName;

if($.cookie('fixed_down')||sUuserA.indexOf('android')==-1){
	appVue.fixedDown=false;
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

	


$.get(sIndexUrl,function(data){
	//console.log(data);
	data=jsonStr(data);
	
	//添加渠道二维码广告

	for(var upI=0; upI<data.blockInfoList.length; upI++){
		if(data.blockInfoList[upI]['ftlname']=='live.ftl'||data.blockInfoList[upI]['ftlname']=='provider.ftl'||data.blockInfoList[upI]['ftlname']=='book.ftl'){
			data.blockInfoList.splice(upI+1,0,oTopup);
			break;
		}
	}
	
	
	var oGetLocalShelf=getLocalRecentlyRead();
	
	if(aNavIndex>0){
		for(var navI=0; navI<data.blockInfoList.length; navI++){
			if(data.blockInfoList[navI]['ftlname']=='nav.ftl'){
				var aNav=data.blockInfoList[navI]['expandMap']['first'];
				var oNav=data.blockInfoList[navI]['expandMap']['first'][aNavIndex];
				aNav.splice(aNavIndex,1);
				aNav.unshift(oNav);
				data.blockInfoList[navI]['expandMap']['first']=aNav;
			}
		}
	}
	if(oGetLocalShelf && oGetLocalShelf['content'].length>0){
		var oAddI=3;
		var oAddObj={
			"ftlname": "recentlyRead",
			"content":oGetLocalShelf['content']
		};
		for(var dI=0; dI<data.blockInfoList.length; dI++){
			if(data.blockInfoList[dI]['ftlname']=='search.ftl'){
				oAddI=dI;
				break;
			}
		}
		data.blockInfoList.splice(oAddI,0,oAddObj);
	}
	
	
	appVue.forJson=data.blockInfoList;
	//alert($.cookie('KKYD_INFO'));
	appVue.show=true;
	imgLoad();
	if($.cookie('KKYD_INFO')&&$.cookie('KKYD_INFO')!='null'){
		/*登录成功回调*/
		var sLoginUserKye='/asg/portal/h5/login/get.do';
		//console.log(sLoginUserKye);
		$.get(sLoginUserKye,function(data){
			
			//alert(data.user.uid);
			if(data.status!=1){
				//winLocalHref("/login/login.html");
				return false;
			}
			if($.trim(data.user.uid)=='暂无'){
				appVue.userImg=false;
				return false;
			}
			appVue.userImg=true;	
		})
	}else{
		appVue.userImg=false;
	}
	
});



$(function(){
	
	$(document).on('click','.head_tab_but_box a',function(){
		var oThis=$(this);
		var nIndex=oThis.index();
		var sTxt=$.trim(oThis.text());
		if(nIndex<3&&appVue.pageName!=sTxt){
			var sHref=oThis.attr('sHref');
			$.get(sHref,function(data){
				//console.log(data);
				var data=jsonStr(data);
				
				//添加渠道二维码广告
			
				for(var upI=0; upI<data.blockInfoList.length; upI++){
					if(data.blockInfoList[upI]['ftlname']=='live.ftl'||data.blockInfoList[upI]['ftlname']=='provider.ftl'||data.blockInfoList[upI]['ftlname']=='book.ftl'){
						data.blockInfoList.splice(upI+1,0,oTopup);
						break;
					}
				}
	
				
				var oGetLocalShelf=getLocalRecentlyRead();
				if(aNavIndex>0){
					for(var navI=0; navI<data.blockInfoList.length; navI++){
						if(data.blockInfoList[navI]['ftlname']=='nav.ftl'){
							var aNav=data.blockInfoList[navI]['expandMap']['first'];
							var oNav=data.blockInfoList[navI]['expandMap']['first'][aNavIndex];
							aNav.splice(aNavIndex,1);
							aNav.unshift(oNav);
							data.blockInfoList[navI]['expandMap']['first']=aNav;
						}
					}
				}
				if(oGetLocalShelf && oGetLocalShelf['content'].length>0){
					var oAddI=3;
					var oAddObj={
						"ftlname": "recentlyRead",
						"content":oGetLocalShelf['content']
					};
					for(var dI=0; dI<data.blockInfoList.length; dI++){
						if(data.blockInfoList[dI]['ftlname']=='search.ftl'){
							oAddI=dI;
							break;
						}
					}
					data.blockInfoList.splice(oAddI,0,oAddObj);
				}
				appVue.forJson=data.blockInfoList;
				appVue.pageid=data.pgid;
				appVue.pageName=data.page;
				imgLoad();
			});
		}
	});
})


function indexJson(){
	
	var nUserColor=$.cookie('user_color');
	var nChannelCodeColor=$.cookie('channel_code_color');
	var nCt=getWinUrl('ct');
	var sStyleUrl='';
	var aIndexUrl=[
		['/asg/portal/h5/index.do?type=index',0],
		['/asg/portal/h5/index.html?type=girl',2],
		['/asg/portal/h5/index.html?type=boy',1]
	];
	if(!nChannelCodeColor){
		nChannelCodeColor=nCt;
	}
	
	if(nUserColor=='1'){
		sIndexUrl=aIndexUrl[2][0];
		aNavIndex=aIndexUrl[2][1];
	}else if(nUserColor=='2'){
		sIndexUrl=aIndexUrl[1][0];
		aNavIndex=aIndexUrl[1][1];
	}else if(nUserColor=='3'||nUserColor==''||nUserColor==undefined||nUserColor==null||nUserColor=='null'){
		if(nChannelCodeColor=='1'){
			sIndexUrl=aIndexUrl[2][0];
			aNavIndex=aIndexUrl[2][1];
		}else if(nChannelCodeColor=='2'){
			sIndexUrl=aIndexUrl[1][0];
			aNavIndex=aIndexUrl[1][1];
		}
		
	}


	
}








/*

*/






