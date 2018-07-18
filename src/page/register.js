import React, { Component } from 'react';
import { 
	List,
	Button,
	InputItem,
	WingBlank,
	WhiteSpace
 } from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom'




class Register extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  userName:'',
	  IDCardNum:'',
	  mobileNum:'',
	  vCode:'',
	  passWord:'',
	  checkInput:{
		userNameError:false,
		IDCardNumError:false,
		mobileNumError:false,
		vCodeError:false,
		passWordError:false,
	  }
	}
  }
  toNext = () =>{
	this.checkForm();
	window.location.href = '/bindArea';
  }
  checkForm(){
	return true;
  }
  render() {
    return (
	  <div>
		<TopNavBar showLC title='用户注册'/>
		<div className='formBox' >
		  <List>
		    <InputItem
		  	  placeholder = '请输入用户名'
			  clear
			  ref='userName'
		      value={this.state.userName}
		      onChange={userName => this.setState({ userName })}
		    ></InputItem>
		    <InputItem
		  	  placeholder = '请输入身份证号码'
			  clear
			  maxLength='18'
		      value={this.state.IDCardNum}
		      onChange={IDCardNum => this.setState({ IDCardNum })}
		    ></InputItem>
		    <InputItem
		  	  placeholder = '请输入手机号码'
			  type='phone'
			  clear
		      value={this.state.mobileNum}
		      onChange={mobileNum => this.setState({ mobileNum })}
		    ></InputItem>
			<div style={{position:'relative'}}>
			  <div style={{paddingRight:100}}>
		        <InputItem
		  	      placeholder = '请输入验证码'
			      clear
		          value={this.state.vCode}
		          onChange={vCode => this.setState({ vCode })}
		        />
			  </div>
			  <div style={style.getVCodeBtn}>获取验证码</div>
			</div>
		    <InputItem
		  	  placeholder = '请输入密码'
			  clear
			  type='password'
		      value={this.state.passWord}
		      onChange={passWord => this.setState({ passWord })}
		    ></InputItem>
		  </List>
		</div>
	    <div className='operationBtns'>
		  <WingBlank>
		    <WhiteSpace size='md' />
		    <Button 
			  style={style.btn} 
			  activeStyle={style.btnActive}
			  onClick={this.toNext}
			>下一步</Button>
		    <WhiteSpace size='md' />
		    <Link to='/login'><Button>取消</Button></Link>
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
	getVCodeBtn:{
	  position:'absolute',
	  lineHeight:'35px',
	  backgroundColor:'#18a3fe',
	  color:'#ffffff',
	  padding:'0 15px',
	  zIndex:3,
	  top:5,
	  right:5
	},
}; 
export default Register;
