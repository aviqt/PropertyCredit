import React, { Component } from 'react';
import ReactDOM from 'react-dom';


/*获取URL参数*/
function getQueryString(name) { 
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
  var index = window.location.href.indexOf('?') !== -1? (window.location.href.indexOf('?')+1):1;
  var r = window.location.href.substr(index).match(reg); 
  if (r !== null) return unescape(r[2]); 
  return null; 
}
//console.log(getQueryString('token'));


function appendObjectParams(params) {
  var keys = Object.keys(params);
  let result = '';
  for (var i = 0; i < keys.length; i++) { 
    var key = keys[i];
	result += key + '=' + params[key];
    if (i !== keys.length - 1) {
      result += '&';
    }
  }
  return result;
}

/*登录*/
function loginToSetToken(account,password,page){
  let body = {
    client_id:account,
    client_secret:password,
    grant_type:'client_credentials'
  };
  console.log(appendObjectParams(body));
  fetch(sessionStorage.apiUrl + '/Token', {
    method:'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body:appendObjectParams(body)
  }).then(res => {
    return res.json();
  }).then(res => {
    sessionStorage.setItem('Authorization','Bearer ' + res.access_token);
	//page.props.history.push(window.location.hash.substring(1));
	
	//window.location.reload()
	page && page.setState({
	  hasToken:!(!sessionStorage.Authorization || sessionStorage.Authorization === 'null' )
	});
  })
}



	





let selFunc = {
	//日期格式化
	formatDate(timeStamp,str) {
	  timeStamp = timeStamp === null?Date.now():timeStamp;
	  let date = new Date(timeStamp);
	  return [
		date.getFullYear(),
		(date.getMonth() + 1) > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1),
		date.getDate() > 9 ? date.getDate() :'0' + date.getDate()
	  ].join(str);
	},
	//日期格式化加了时分
	formatDatePlus(timeStamp,str) {
	  timeStamp = timeStamp === null?Date.now():timeStamp;
	  let date = new Date(timeStamp);
	  return [
		date.getFullYear(),
	    (date.getMonth()+1) > 9 ? (date.getMonth()+1) : '0' + (date.getMonth()+1),
	    (date.getDate() > 9 ? date.getDate() :'0' + date.getDate()) + ' ' + (date.getHours()>9?date.getHours():('0' + date.getHours())) + ':' + (date.getMinutes()>9?date.getMinutes():('0' + date.getMinutes()))
	  ].join(str);
	},
	//关键字高亮
	renderHeightlightKeyWords(text,keyWords){
	  if(!text) return <font>&nbsp;</font>;
	  return keyWords === '' ? text : text.split(keyWords).map((item,index) => {
		return index === 0 ? item : <font key={'HeightlightKeyWords' + index}><font style={{color:'red'}}>{keyWords}</font>{item}</font>;
	  })
	},
	//弹出框
	modal:function(Component,options = {}){
	  let body = document.body;
	  let showDom = document.createElement("div");
	  // 设置基本属性
	  showDom.style.position = 'absolute';
	  showDom.style.top = '0px';
	  showDom.style.left = '0px';
	  showDom.style.width = '100%';
	  showDom.style.height = '100%';
	  showDom.style.overflow = 'hidden';
	  showDom.style.backgroundColor = 'rgba(0,0,0,.5)';
	  showDom.style.zIndex = 10;
	  showDom.setAttribute("id","modalBox");
	  	// 自我删除的方法
	  let close = () => {
	  	ReactDOM.unmountComponentAtNode(showDom);
	  	body.removeChild(showDom);
	  }
	  //showDom.addEventListener("click",close,false); 
	  body.appendChild(showDom);
	  ReactDOM.render(
	  	<Component onClose={close} options={options}/>,
	  	//<div className='modal'>aslkdjsaldj</div>,
	  	showDom
	  );
	},
	//图片列表
	renderImgList:function(imgList,PicView){
      let cols = imgList.length >= 3 ? 3 : imgList.length; 
      let imgSizeWidth = (window.innerWidth - 40 - (cols * 5) ) / cols ;
      let imgSizeHeight = imgList.length !== 1 ? imgSizeWidth:'auto' ;
      imgSizeWidth = (( 100/cols - (cols-1)/cols ) + '%'); 
      
      return (
        <div className='imgList'>
      	  {imgList.map((item,index) => 
      	    <div 
      	  	  className='item' 
      	  	  key={index} 
      	  	  onClick={()=>{if(PicView)this.modal(PicView,{imgUrl:item.src})}} 
      	  	  style={{width:imgSizeWidth,height:imgSizeHeight}}
      	    >
      	  	<div style={{width:imgSizeWidth,height:imgSizeHeight}}>
      	  	  <img src={item.src} alt='1' />
      	  	</div>
      	    </div>
      	  )}
        </div>
      );
    },
	//获取图片字符串
	getFileIdsStr(info){
	  let str = ''
	  if(info.file.status === 'done' || info.file.status === 'removed'){
	    str = '[';
        info.fileList.map((i,index) => {
		  if(!i.response)return false;
  	      if(index !== 0) str += ',';
  	      str += '{"fileid":"' + i.response.fileid + '","name":"' + i.response.fileinfo.name + '","ext":"' + i.response.fileinfo.ext + '","size":"' + i.response.fileinfo.size + '"}';  
  	      return false;
        });
        str += ']';
	    //console.log(str);
	  };
	  return str;
    },
	handleImageErrored(defaultImg,e){
	  e.target.src = defaultImg;
    },
	delArrayRepeat(arr,field){
	  arr = arr.sort((a,b) => b[field].localeCompare(a[field]));
	  let newArr = [arr[0]];
	  arr.map(item => {
	    if(item[field] !== newArr[newArr.length - 1][field]){
	  	  newArr.push(item);
	    }
	  });
	  return newArr;
	}
}

export {
	appendObjectParams,
	getQueryString,
	loginToSetToken,
	selFunc,
};




