// JavaScript Document
var nTotalNum=10;
var cTime=null;
var sBookId=decodeURIComponent(getWinUrl('keyword'));
var sIndexUrl='/asg/portal/h5/search.html';
var appVue=new Vue({
		el:'#search_list_vue',
		data:{
			forJson:[],
			searchList:true,
			pageIndex:1,
			searchIndex:0,
			searchMain:[],
			show:false,
			searchNullTxt:'',
			scrollPage:true,
			keyVal:sBookId,
			
			hotData:[],
			loadingShow:false,
			loadingHtml:'<div class="loading_zhuan"><span>玩命加载中....</span></div>'
			
			
		}
	});


$.ajax({
	url:sIndexUrl,
	type:'get',
	async:false,
	success: function(data){
		//console.log(data);
		data=jsonStr(data);
		appVue.searchIndex==0;
		appVue.hotData=data['searchList']['searchHotList'];
	}
});

if(sBookId){
	appVue.show=true;
	appVue.keyVal=sBookId;
	searchContent();
}else{
	appVue.show=true;
}


$(window).scroll(function(){
	var nScrollTop=$(window).scrollTop();
	var nWinH=$(window).height();
	var nBodyH=$('body').height()-20;
	if(appVue.scrollPage&&sBookId&&nScrollTop>nBodyH-nWinH){
		appVue.pageIndex++;
		searchContent();
	}
});




$(document).on('keyup','.search_input input',function(e){
	var e=e||window.event;
	if(e.keyCode==13){
		$('.search_input input').attr('placeholder');
		searchContent();
	}
})



$(document).on('click','.search_list_but',function(){
	$('.search_input input').attr('placeholder');
	searchContent();
});


function searchContent(){
	var sInput=$.trim($('.search_input input').val());
	var sTxt=appVue.keyVal;
	if(sInput){
		sTxt=sInput;
	}
	appVue.loadingShow=true;
	appVue.loadingHtml='<div class="loading_zhuan"><span>玩命加载中....</span></div>';
	clearTimeout(cTime);
	cTime=setTimeout(function(){
		appVue.searchList=true;
	},1000);
	if(appVue.searchList){
		appVue.searchList=false;
		appVue.scrollPage=false;
		$.ajax({
			url:'/asg/portal/h5/searchResult.html?totalNum='+nTotalNum+'&keyword='+sTxt+'&index='+appVue.pageIndex,
			type:'get',
			//dataType:"json",
			success: function(data){
				appVue.loadingShow=false;
				//fPushState('search_list.html?totalNum='+nTotalNum+'&index='+appVue.pageIndex+'&keyword='+decodeURI(sTxt));
				//console.log(data)
				data=jsonStr(data);
				appVue.searchIndex=data.index;
				if(data['priMap']['searchList'].length<=0 && data.index==1){
					//第一页就没有数据
					appVue.searchList=false;
					appVue.scrollPage=false;
					appVue.searchMain=[];
					appVue.searchNullTxt=sTxt;
				}else if(data['priMap']['searchList'].length>0){
					appVue.searchList=true;
					appVue.scrollPage=true;
					appVue.searchNullTxt='';
					if(data.index==1){
						//第一页加载数据
						appVue.searchMain=data['priMap']['searchList'];
					}else{
						//push之后的数据
						for(var i=0; i<data['priMap']['searchList'].length; i++){
							appVue.searchMain.push(data['priMap']['searchList'][i]);
						}
					}
				}
				//搜索不到东西了
				if(data['priMap']['searchList'].length<nTotalNum && data.index>=1){
					appVue.scrollPage=false;
					appVue.loadingShow=true;
					appVue.loadingHtml='<div class="loading_over"><strong>已经是全部了！</strong></div>';
				}
				imgLoad();
			},
			error:function(err){
				////console.log(JSON.stringify(err))
				appVue.searchList=true;
			}
		});
	}
}






























