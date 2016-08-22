<?php
header("Access-Control-Allow-Origin: *");

$appid = 'wx741d9bf7ee50f7e4';
$url='location:https://open.weixin.qq.com/connect/oauth2/authorize?appid='.$appid.'&redirect_uri=http://m.kkyd.cn/t/h5_images.php&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
header($url);
//https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx741d9bf7ee50f7e4&redirect_uri=http://m.kkyd.cn/t/access_token.php&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
?>

















