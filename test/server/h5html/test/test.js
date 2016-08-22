$(function(){
//	var arr=[];
//	var url="/asg/portal/h5/index.html?type=index";
//		$.ajax({
//			   type: "get",
//			   url: url,
//			   dataType : 'json',
//			   success: function(data){
//			        //console.log(data.blockInfoList)
//			        arr=data.blockInfoList;
//				    // 首页 男生  女生  客户端
//				    var part_tabs=arr[2].expandMap.first
//				    //console.log(part_tabs.length);
//				    for(var i=0;i<part_tabs.length;i++){
//				     	var $part_tab_a = $('<a href="###" class="part_tab">'+part_tabs[i].name+"</a>");
//				     	$part_tab_a.appendTo($('.part_tabs'));
//				     	//var $oThis=$(this);
//				     	$part_tab_a.click(function(){
//				     		$(this).addClass('click').siblings().removeClass('click');
//				     	});
//				    }
//			        // 分类  排行  连载  全本 充值
//			        var classify_tabs=arr[2].expandMap.second
//				    //console.log(part_tabs.length);
//				    for(var i=0;i<classify_tabs.length;i++){
//				     	var $classify_tab_a = $('<a href="###" class="classify_tab">'+classify_tabs[i].name+"</a>");
//				     	$classify_tab_a.appendTo($('.classify_tabs'));
//				     	//var $oThis=$(this);
//				     	$classify_tab_a.click(function(){
//				     		$(this).addClass('click').siblings().removeClass('click');
//				     	});
//				    }
//			   }
//		})
		var sIndexUrl='/asg/portal/h5/index.do?type=index';
		var appVue=new Vue({
			el : '#test_vue',
			data :  {
				forJson : []
			}
		})
		$.get(sIndexUrl,function(data){
			
		    var data=JSON.parse(data);
		    console.log(typeof data)
			appVue.forJson=data.blockInfoList;
			//console.log(appVue.forJson)
			
		})
})
