import React, { Component } from 'react';
import Footer from './components/footer';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom';



const menuList = [
		{url:'/notice/list1',name:'行业通知',icon:require('../icon/horn.svg')},
		{url:'/notice/list2',name:'小区通知',icon:require('../icon/info.svg')},
		{url:'/notice/add',name:'发布通知',icon:require('../icon/search2.svg')},
	];
		
		
		
class Notice extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  slideImgHeight:1
	}
  }
  render() {
    return (
	  <div >
		<TopNavBar title='通知公告' showLC/>
		<div className='mainBox'>
		  <div className='indexMenu'>
		  {menuList.map(item => 
		    <Link to={item.url} key={item.icon+item.url}>
			  <div>
			    <img src={item.icon} alt={item.icon} /><br />
			    {item.name}
			  </div>
			</Link>
		  )}
		  </div>
		</div>
		<Footer pageIndex={4}/>
	  </div>
    );
  }
}

export default Notice;
