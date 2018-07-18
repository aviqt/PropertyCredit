import React, { Component } from 'react';
import { Link } from 'react-router-dom'




const footerBtns = [
  {
  	title:'首页',
	url:'/',
  	icon:require('../../icon/home_gray.svg'),
  	iconActive:require('../../icon/home_blue.svg')
  },
  {
  	title:'信用查询',
	url:'/credit/list',
  	icon:require('../../icon/search.svg'),
  	iconActive:require('../../icon/search_blue.svg')
  },
  {
  	title:'投票表决',
	url:'/vote/list',
  	icon:require('../../icon/vote.svg'),
  	iconActive:require('../../icon/vote_blue.svg')
  },
  {
  	title:'个人中心',
	url:'/personal/center',
  	icon:require('../../icon/people.svg'),
  	iconActive:require('../../icon/people_blue.svg')
  },
];


class Footer extends Component {
  constructor(props){
    super(props)
    this.state = {
		pageIndex:this.props.pageIndex?this.props.pageIndex:0,
	}
  }

  render() {
    return (
	  <div className='footer'>
		{footerBtns.map((item,index) => {
		  if(this.state.pageIndex !== index){
		    return (
		  	  <Link to={item.url} key={'footerBtn' + index}>
		  		<div className='footerButton'>
		  		  <img alt={item.icon} src={item.icon} /><br />
		  		  {item.title}
		  		</div>
		  	  </Link>
		  	);
		  }else{
		    return (
		  	  <div className='footerButton footerButton_active' key={'footerBtn' + index}>
		  	    <img alt={item.iconActive} src={item.iconActive} /><br />
		  	    {item.title}
		  	  </div>
		  	);
		  }
  		})}
	  </div>
    );
  }
}

export default Footer;
