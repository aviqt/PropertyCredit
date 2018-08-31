import React, { Component } from 'react';
import { 
	NavBar,
	Icon
 } from 'antd-mobile';
import { Link } from 'react-router-dom';
import {getQueryString} from '../../utils/func';


const logoImg = require('../../images/antb.png');
const iconHome = require('../../icon/home.svg');
//const iconPlus = require('../../icon/plus.svg');
const iconPlus = require('../../images/add.png');
class TopNavBar extends Component {
  constructor(props){
    super(props)
    this.state = {
	  title:this.props.title,
	  showLC:props.showLC?props.showLC:false,
	  back:props.back?props.back:-1,
	  addPage:props.addPage?props.addPage:false
	}
  }  
  postMessage = (str) =>{
	if (window.originalPostMessage) {
		//window.postMessage(str);
		window.postMessage(str,'*');
	} else {
		//throw Error('postMessage接口还未注入');
	}
  }
  render() {
	const weChatCode = sessionStorage.weChatCode;
	const {title,addPage} = this.props;
	const {back,showLC} = this.state;
	let isIos = getQueryString('platform') === 'ios' ? true : false;
    return (
	  <div style={{height:45}}>
	    <NavBar
	      mode='light'
	      leftContent = {
			showLC?[
			  back==='0'?<Icon key='navbar_l'  style={{display:isIos?'':'none'}} size='lg' type='left' color='white' onClick={()=>{this.postMessage('back');}}/>
			  :<Icon key='navbar_l' type='left' color='white' size='lg' onClick={()=>{window.history.go(back)}}/>
	        ]:[]
		  }
	      rightContent = {addPage?[
	  	    <Link to={addPage}  key='navbar_r_addBtn'><img src={iconPlus} alt={iconPlus} style={{height:20,marginBottom:2,marginRight:5}}/></Link>
	      ]:[]}
	      style={{backgroundColor:'#1a8ffe',height:45,position:'fixed',top:0,left:0,right:0,zIndex:10}}
	    >
	  	<span style={{color:'white',fontSize:18,fontWeight:'bold'}}>{title}</span>
	    </NavBar>
	  </div>
    );
  }
}

export default TopNavBar;
