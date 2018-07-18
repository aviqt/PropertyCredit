import React, { Component } from 'react';
import { 
	List
 } from 'antd-mobile';
import Footer from './components/footer';
import { Link } from 'react-router-dom';
import TopNavBar from './components/topNavBar';


const headImg = require('../images/headImg.png');
const affirm_f = require('../images/affirm_f.png');
const affirm_t = require('../images/affirm_t.png');

//const myVoteIcon1 = require('../images/myVoteIcon1.png');
//const myVoteIcon2 = require('../images/myVoteIcon2.png');
const myVoteIcon3 = require('../icon/myVoteIcon3.svg');
const myVoteIcon4 = require('../icon/myVoteIcon4.svg');
//const myVoteIcon5 = require('../icon/myVoteIcon5.svg');


class PersonalCenter extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
		isAffirm:false,
	}
  }
  componentDidMount() {

  }
  
  render() {
    return (
	  <div>
	    <TopNavBar back='0' showLC title='个人中心'/>
	    <div className='mainBox'>
		  <div className='headImgBox'>
		    <Link to='/personalInfo'>
		      <img src={headImg} alt='headImg' className='headImg'/>
		    </Link>
		    <img 
		  	  alt='affirm' 
		  	  className='affirm'  
		      src={this.state.isAffirm?affirm_t:affirm_f} 
		  	  onClick={() =>{this.setState({isAffirm:!this.state.isAffirm})}}
		    />
		  </div>
		  <List >
			<Link to='/personalInfo'>
			  <List.Item arrow="horizontal">
			    <img src={myVoteIcon4} alt='myVoteIcon1' /> 个人资料
			  </List.Item>
			</Link>
			<div style={{backgroundColor:'#f2f2f2',height:1}}></div>
			<List.Item arrow="horizontal"><img src={myVoteIcon3} alt='myVoteIcon1' /> 与我相关</List.Item>
		  </List>

        </div>
		<Footer pageIndex={3}/>
      </div>
    );
  }
}

export default PersonalCenter;
