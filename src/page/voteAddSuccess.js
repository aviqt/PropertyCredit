import React, { Component } from 'react';
import {
	Icon,
	Result
} from 'antd-mobile';
import TopNavBar from './components/topNavBar';




class VoteAddSuccess extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  voteId:props.match.params.voteId
	}
  }

  render() {
    return (
	  <div>
		<TopNavBar title={'提交成功'} showLC/>
		<Result
		  img={<Icon type='check-circle' style={style.iconStyle} />}
		  message={<div style={style.messageStyle}>
			恭喜您已成功创建投票活动。<br /><br />
			社区（街道）相关的工作人员会在10个工作日内，对您提交的投票信息进行审核！<br /><br />
			特别提醒：请保持电话畅通，工作人员会打电话核实信息。<br /><br />

		  </div>}
		  title={<div style={style.titleStyle}>提交成功</div>}
		  style={{paddingTop:80}}
		  className='resultBox'
	    />
      </div>
    );
  }
}
const style ={
	iconStyle:{
	  fill: '#09bb07',
	  width:60,
	  height:60,
	  lineHeight:80
	},
	titleStyle:{
	  color:'#09bb07',
	  fontWeight:'bold',
	  fontSize:16
	},
	messageStyle:{
	  textAlign:'center',
	  color:'#333',
	  fontSize:14,
	  maxWidth:320,
	  margin:'0 auto'
	  
	},
}
export default VoteAddSuccess;
