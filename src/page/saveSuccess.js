import React, { Component } from 'react';
import {
	Icon,
	Result
} from 'antd-mobile';
import TopNavBar from './components/topNavBar';




class SaveSuccess extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  voteId:props.match.params.voteId
	}
  }

  render() {
    return (
	  <div>
		<TopNavBar title={'投票分享'} showRC={true} back={-2}/>
		<Result
		  img={<Icon type="check-circle" style={style.iconStyle} />}
		  message={<div style={style.messageStyle}>
			恭喜您已成功保存投票活动。<br />
			可以进入我的投票，编辑并创建投票活动。<br /><br />
			特别提醒：系统基于区块链技术，用户通过实名认证即可进行投票<br /><br /><br />
			<span style={{color:"#aaa"}}>点击右上角菜单分享给好友</span>
		  </div>}
		  title={<div style={style.titleStyle}>保存成功</div>}
		  style={{paddingTop:100,backgroundColor:"#f8f8f8"}}
		  className='resultBox'
	    />
      </div>
    );
  }
}
const style ={
	iconStyle:{
	  fill: '#10aeef',
	  width:60,
	  height:60,
	  lineHeight:80
	},
	titleStyle:{
	  color:"#10aeef",
	  fontWeight:"bold",
	  fontSize:16
	},
	messageStyle:{
	  textAlign:"center",
	  color:"#333",
	  fontSize:14,
	  maxWidth:320,
	  margin:"0 auto"
	  
	},
}
export default SaveSuccess;
