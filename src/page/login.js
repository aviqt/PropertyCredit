import React, { Component } from 'react';
import { 
	List,
	Button,
	InputItem,
	WingBlank,
	Toast,
	WhiteSpace
 } from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom';



const iconUser = require('../icon/user.svg');

class Login extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  userName:'',
	  passWord:'',
	  checkForm:{
		userNameError:false,
		passWordError:false,
	  }
	}
  }
  onSubmit = () => {
	console.log(!this.checkForm());
	if(!this.checkForm()){
	  this.props.toParent();
	}
  }
  checkForm(){
	let {checkForm,userName,passWord} = this.state;
	checkForm.userNameError = userName === '';
	checkForm.passWordError = passWord === '';
	this.setState({checkForm});
	return checkForm.userNameError || checkForm.passWordError;
  }
  render() {
	let {checkForm} = this.state;
	  
    return (
	  <div>
		<TopNavBar back='0' showLC title='用户登录'/>
		<div className='formBox' >
		  <div className='loginHeadImg'>
		    <img src={iconUser} alt={iconUser}/>
		  </div>
		  <List>
		    <InputItem
		  	  placeholder = '请输入用户名'
			  clear
			  error={checkForm.userNameError}
			  onErrorClick={() => {Toast.info('Please enter userName!');}}
		      value={this.state.userName}
		      onChange={userName => this.setState({ userName })}
		    ></InputItem>
		    <InputItem
		  	  placeholder = '请输入密码'
			  clear
			  error={checkForm.passWordError}
			  onErrorClick={() => {Toast.info('Please enter passWord!');}}
			  type='password'
		      value={this.state.passWord}
		      onChange={passWord => this.setState({ passWord })}
		    ></InputItem>
		  </List>
		  <WingBlank className='loginOther'>
			<Link to='/login'>忘记密码？</Link>
		  </WingBlank>
		</div>
	    <div className='operationBtns'>
		  <WingBlank>
		    <WhiteSpace size='md' />
		    <Button 
			  style={style.btn} 
			  activeStyle={style.btnActive}
			  onClick={this.onSubmit}
			>登录</Button>
		    <WhiteSpace size='md' />
		    <Button href='/register'>还没有账号？立即注册</Button>
		    <WhiteSpace size='md' />
		  </WingBlank>
	    </div>
      </div>
    );
  }
}
const style = {
	btn:{
	  backgroundColor:'#18a3fe',
	  color:'#fff',
	},
	btnActive:{
	  backgroundColor:'gray'
	},
}; 
export default Login;
