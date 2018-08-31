
import {getQueryString,loginToSetToken} from './utils/func';
import {get} from './utils/request';


//sessionStorage.setItem('apiUrl','http://saturn.51vip.biz:7015/sydp.api.pci');
sessionStorage.setItem('apiUrl','http://192.168.0.203/sydp.api.pci');
//sessionStorage.setItem('apiUrl','http://xueyu365.tunnel.qydev.com');

sessionStorage.setItem('fileUrl','http://saturn.51vip.biz:8848');


sessionStorage.setItem('redirectUrl','xueyu365.ngrok.xiaomiqiu.cn');

//sessionStorage.setItem('weChatCode','011M2dta1mBKFQ1RFgta12x6ta1M2dt7');

if(!sessionStorage.Authorization || getQueryString('token') !== null ){
  sessionStorage.setItem('Authorization',getQueryString('token'));
}
if(!sessionStorage.weChatCode || getQueryString('code') !== null ){
  sessionStorage.setItem('weChatCode',getQueryString('code'));
}





