// JavaScript Document
$(function(){
	
	$('.user_esc_but').click(function(){
		var sVal=$.trim($('.pow_input input').val());
		if(sVal){
			$.get('/asg/portal/h5/login/editShowName.do?deviceId='+$.cookie('KKYD_INFO')+'&showName='+sVal,function(data){
				if(data){
					winLocalHref('/user_center.html');
				}
			});
		}
	});
	
});













































