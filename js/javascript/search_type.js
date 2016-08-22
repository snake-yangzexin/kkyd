// JavaScript Document
var nTotalNum=10;
var sType=decodeURIComponent(getWinUrl('type'));
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
			titleName:'',
			
			
			hotData:[],
			loadingShow:false,
			loadingHtml:'<div class="loading_zhuan"><span>玩命加载中....</span></div>'
			
			
		}
	});


searchContent();


$(window).scroll(function(){	
	var nScrollTop=$(window).scrollTop();
	var nWinH=$(window).height();
	var nBodyH=$('body').height()-20;
	if(appVue.scrollPage&&nScrollTop>nBodyH-nWinH){
		appVue.pageIndex++;
		searchContent();
	}
});



function searchContent(){
	appVue.loadingShow=true;
	appVue.loadingHtml='<div class="loading_zhuan"><span>玩命加载中....</span></div>';
	if(appVue.searchList){
		appVue.searchList=false;
		appVue.scrollPage=false;
		$.ajax({
			url:'/asg/portal/h5/searchStatus.html?totalNum='+nTotalNum+'&type='+sType+'&index='+appVue.pageIndex,
			type:'get',
			//dataType:"json",
			success: function(data){
				appVue.loadingShow=false;
				appVue.show=true;
				//fPushState('search_type.html?totalNum='+nTotalNum+'&index='+appVue.pageIndex+'&type='+decodeURI(sType));
				//console.log(data)
				data=jsonStr(data);
				appVue.searchIndex=data.index;
				appVue.titleName=data.keyword;
				if(data['searchList'].length<=0 && data.index==1){
					//第一页就没有数据
					appVue.searchList=false;
					appVue.scrollPage=false;
					appVue.searchMain=[];
					appVue.searchNullTxt=sTxt;
				}else if(data['searchList'].length>0){
					appVue.searchList=true;
					appVue.scrollPage=true;
					appVue.searchNullTxt='';
					if(data.index==1){
						//第一页加载数据
						appVue.searchMain=data['searchList'];
					}else{
						//push之后的数据
						for(var i=0; i<data['searchList'].length; i++){
							appVue.searchMain.push(data['searchList'][i]);
						}
					}
				}
				//搜索不到东西了
				if(data['searchList'].length<nTotalNum && data.index>=1){
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
