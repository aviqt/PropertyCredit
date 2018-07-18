import React, { Component } from 'react';
import {
	Icon,
	Result
} from 'antd-mobile';
import TopNavBar from './components/topNavBar';




class AffirmSuccess extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	}
  }

  render() {
    return (
	  <div>
		<TopNavBar title={'认证成功'} back={-2}/>
		<Result
		  img={<Icon type="check-circle" style={style.iconStyle} />}
		  message={<div style={style.messageStyle}>
			恭喜您已成功实名制认证。<br />
			您警告投票的资格认证，投票的方式，有几率获得昂特币。<br /><br />
			特别提醒：系统基于区块链技术，用户通过实名认证即可进行投票<br /><br /><br />
			<span style={{color:"#aaa"}}>点击右上角菜单分享给好友</span>
		  </div>}
		  title={<div style={style.titleStyle}>识别成功</div>}
		  style={{paddingTop:100,backgroundColor:"#f8f8f8"}}
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
	  color:"#09bb07",
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
export default AffirmSuccess;
