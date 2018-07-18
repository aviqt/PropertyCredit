import React, { Component } from 'react';
import { 
	List,
	Button,
	InputItem,
	Picker,
	WingBlank,
	Accordion,
	WhiteSpace
 } from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom'


const headImg = require('../images/headImg.png');
const myVoteIcon1 = require('../images/myVoteIcon1.png');
const sexList = [
	{value:'男',label:'男'},
	{value:'女',label:'女'},
]

class PersonalInfo extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  name:'张郁楠',
	  idCard:'21072419900706121X',
	  sex:['男'],
	  address:'宁波市',
	}
  }
  savePersonalInfo = () => {
	  console.log(this.state.sex[0])
  }
  render() {
    return (
	  <div>
		<TopNavBar title='个人信息' showLC/>
		<div className='peronalInfoForm' >
		  <List style={{border:"none"}}>
		    <div style={style.headImgBox}>
		  	头像
		  	<img src={headImg} alt="headImg" style={style.headImg} />
		    </div>
		    <List>
		      <InputItem
		    	placeholder = '请输入'
		        value={this.state.name}
		        onChange={name => this.setState({ name })}
		      >姓名</InputItem>
		      <InputItem
		  	    maxLength = '18'
		    	placeholder = '请输入'
		        value={this.state.idCard}
		        onChange={idCard => this.setState({ idCard })}
		      >身份证号码</InputItem>
		      <Picker 
				data={sexList} 
				cols={1} 
				value={this.state.sex}
				onChange={sex => this.setState({ sex })}
				onOk={sex => this.setState({ sex })}
			  >
				<List.Item>性别</List.Item>
			  </Picker>
		      <InputItem
		    	placeholder = '请输入'
		        value={this.state.address}
		        onChange={address => this.setState({ address })}
		      >所在地</InputItem>
		    </List>
		  </List>
		  <div style={{borderTop:"15px solid #e4e4e4"}}>
		    <Accordion className="my-accordion" accordion >
              <Accordion.Panel header={<div >小区管理 <img src={myVoteIcon1} alt='myVoteIcon1' /></div>} >
                <List >
                  <List.Item arrow="horizontal">东晟府(已认证)</List.Item>
                  <List.Item arrow="horizontal">公园里(认证中)</List.Item>
                  <Link to='/bindArea'><List.Item arrow="horizontal">添加新的小区</List.Item></Link>
                </List>
              </Accordion.Panel>
            </Accordion>
		  </div>
		</div>
	    <div className='operationBtns'>
		  <WingBlank>
		    <WhiteSpace size="md" />
		    <Button style={style.btn} activeStyle={{backgroundColor:"gray"}}>实名认证</Button>
		    <WhiteSpace size="md" />
		    <Button onClick={this.savePersonalInfo}>保存</Button>
		    <WhiteSpace size="md" />
		  </WingBlank>
	    </div>
      </div>
    );
  }
}
const style = {
  headImgBox:{
    lineHeight:"80px",
    fontSize:17,
    position:'relative',
    paddingLeft:15
  },
  headImg:{
    position:'absolute',
    display:'block',
    top:10,
    right:10
  },
  btn:{
    backgroundColor:'#18a3fe',
    color:'#fff',
  },
  btnActive:{
    backgroundColor:'gray'
  },
}; 
export default PersonalInfo;
