
import {getQueryString,loginToSetToken} from './utils/func';
import {get} from './utils/request';


sessionStorage.setItem('apiUrl','http://saturn.51vip.biz:7015/sydp.api.pci');
//sessionStorage.setItem('apiUrl','http://xueyu365.tunnel.qydev.com');

sessionStorage.setItem('fileUrl','http://saturn.51vip.biz:8848');

//sessionStorage.setItem('weChatCode','011M2dta1mBKFQ1RFgta12x6ta1M2dt7');

if(!sessionStorage.Authorization || getQueryString('token') !== null ){
  sessionStorage.setItem('Authorization',getQueryString('token'));
}
if(!sessionStorage.weChatCode || getQueryString('code') !== null ){
  sessionStorage.setItem('weChatCode',getQueryString('code'));
}


/*
function isNoLoginPage(page){
  let noLoginPage = [
    'register',
	'login'
  ];
  for(var i = 0 ;i < noLoginPage.length ; i++){
    if(page.indexOf(noLoginPage[i]) !== -1) return true;
  }
  return false
}
if(isNoLoginPage(window.location.href) || !(!sessionStorage.Authorization || sessionStorage.Authorization === 'null' )){
  //alert('welcome');
  sessionStorage.setItem('isNoLoginPage','1');
}else{
  //alert('please login');
  sessionStorage.setItem('isNoLoginPage','0');
  const weChatCode = sessionStorage.weChatCode;
  if(weChatCode && weChatCode !== 'null'){
    get(sessionStorage.apiUrl + '/UserByWeChatCode?code=' + weChatCode)
    .then(res => {
  	  if(res.Data === null){
  	    //let url = window.location.origin + window.location.pathname + '#/login';
  	    //alert(url);
  	    //get(sessionStorage.apiUrl + '/CodeUrl?redirect_uri=' + url)
  	    //.then(res => {
  	    //  alert(res.Data);
  	    //  window.location.href = res.Data;
  	    //})
  	    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxff2456f987559043&redirect_uri=http%3a%2f%2fxueyu365.tunnel.qydev.com%2fWeChatVote%2f%23%2flogin&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
  	  }else{
  	    loginToSetToken(res.Data.Id,res.Data.Password);
  	  }
    })
  } else{
    sessionStorage.setItem('isNoLoginPage','1');
    window.location.href = window.location.origin + window.location.pathname + '#/login';
  }
}

*/



