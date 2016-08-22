// JavaScript Document
var nTotalNum=10;
var sType=decodeURIComponent(getWinUrl('blockId'));
var sTypeName=decodeURIComponent(getWinUrl('name'));
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
			titleName:sTypeName,
			
			
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
			url:'/asg/portal/h5/blockResource.html?totalNum='+nTotalNum+'&blockId='+sType+'&index='+appVue.pageIndex+'&name='+sTypeName,
			type:'get',
			//dataType:"json",
			success: function(data){
				appVue.loadingShow=false;
				appVue.show=true;
				//fPushState('template_list.html?totalNum='+nTotalNum+'&index='+appVue.pageIndex+'&blockId='+decodeURI(sType)+'&name='+decodeURI(sTypeName));
				//console.log(data)
				data=jsonStr(data);
				appVue.searchIndex=data['index'];
				appVue.titleName=sTypeName;
				if(data['resources'].length<=0 && data['index']==1){
					//第一页就没有数据
					appVue.searchList=false;
					appVue.scrollPage=false;
					appVue.searchMain=[];
					appVue.searchNullTxt=sTxt;
				}else if(data['resources'].length>0){
					appVue.searchList=true;
					appVue.scrollPage=true;
					appVue.searchNullTxt='';
					if(data['index']==1){
						//第一页加载数据
						appVue.searchMain=data['resources'];
					}else{
						//push之后的数据
						for(var i=0; i<data['resources'].length; i++){
							appVue.searchMain.push(data['resources'][i]);
						}
					}
				}
				//搜索不到东西了
				if(data['resources'].length<nTotalNum && data['index']>=1){
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
































































