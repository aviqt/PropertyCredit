import React, { Component } from 'react';
import Footer from './components/footer';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom';



const menuList = [
		{url:'/complaint/list',name:'物业投诉',icon:require('../icon/complaint.png')},
		{url:'/notice/list2',name:'个人建议',icon:require('../icon/proposal.png')},
		{url:'/notice/add',name:'公共报修',icon:require('../icon/repair.png')},
	];
		
		
		
class Complaint extends Component {
  render() {
    return (
	  <div >
		<TopNavBar title='投诉建议'/>
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

export default Complaint;
