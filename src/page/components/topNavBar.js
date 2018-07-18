import React, { Component } from 'react';
import { 
	NavBar,
	Icon
 } from 'antd-mobile';
import { Link } from 'react-router-dom';


const logoImg = require('../../images/antb.png');
const iconHome = require('../../icon/home.svg');
const iconPlus = require('../../icon/plus.svg');
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
  render() {
	const weChatCode = sessionStorage.weChatCode;
    return (
	  <div style={{height:45}}>
	    <NavBar
	      mode='light'
	      leftContent = {this.state.showLC?[
	  	    this.state.back==='0'?<Icon style={{display:(weChatCode && weChatCode !== 'null')?'none':''}} key='navbar_l' type='left' color='white' onClick={()=>{console.log('12');window.postMessage('back','*');}}/>
			:<Icon key='navbar_l' type='left' color='white' onClick={()=>{window.history.go(this.state.back)}}/>
	      ]:[]}
	      rightContent = {this.state.addPage?[
	  	    <Link to={this.state.addPage}  key='navbar_r_addBtn'><img src={iconPlus} alt={iconPlus} style={{height:30}}/></Link>
	      ]:[]}
	      style={{backgroundColor:'#1a8ffe',height:45,position:'fixed',top:0,left:0,right:0,zIndex:10}}
	    >
	  	<span style={{color:'white',fontSize:20}}>{this.state.title}</span>
	    </NavBar>
	  </div>
    );
  }
}

export default TopNavBar;
