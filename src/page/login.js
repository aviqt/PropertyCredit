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
import {hex_md5} from '../utils/md5';
import {appendObjectParams} from '../utils/func';
import {post} from '../utils/request';
import formProvider from '../utils/formProvider';



const iconUser = require('../icon/user.svg');
const style = {
  btn:{
    backgroundColor:'#18a3fe',
    color:'#fff',
  },
  btnLoading:{
    backgroundColor:'#a17e7e',
    color:'#fff',
  },
  btnActive:{
    backgroundColor:'gray'
  },
}; 

class Login extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  submitLoading:false,
	}
  }
  onSubmit = () => {
	if(this.state.submitLoading)return false;
	const {formValid} = this.props;
	if (!formValid) {
      Toast.fail('请输入用户名和密码');
      return;
    }else{
	  this.loginToSetToken();
	}
  }
  bindWeChatCode(){
	const weChatCode = sessionStorage.weChatCode;
	//console.log(weChatCode);
	//console.log(weChatCode && weChatCode !== 'null');
	if(weChatCode && weChatCode !== 'null'){
	  post(sessionStorage.apiUrl + '/BindUser?code=' + sessionStorage.weChatCode)
      .then(res => {
		console.log(res);
		if(res.Data === 'OK'){
		  Toast.success('绑定成功！');
		  this.props.history.push('/vote/list');
		}else{
		  sessionStorage.setItem('Authorization','null');
		  Toast.fail(res.Message);
		}
	  })
	}else{
	  Toast.success('登录成功！');
	  this.props.history.push('/');
	}
  }
  loginToSetToken(){
	const {form,onFormChange} = this.props;
    let body = {
      client_id:form.UserName.value,
      client_secret:hex_md5(form.PassWord.value),
      grant_type:'client_credentials'
    };
	//console.log(appendObjectParams(body));
	this.setState({
	  submitLoading:true
	});
	
    fetch(sessionStorage.apiUrl + '/Token', {
      method:'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body:appendObjectParams(body)
    }).then(res => {
	  if(res.status === 200){
	  	return res.json();
	  }else{
	  	//console.log(res);
	  }
    }).then(res => {
	  if(res){
		console.log(res);
        sessionStorage.setItem('Authorization','Bearer ' + res.access_token);
		this.bindWeChatCode();
	  }else{
		onFormChange('UserName', '');
		onFormChange('PassWord', '');
		Toast.fail('绑定失败，账号或密码错误！');
		this.setState({
		  submitLoading:false
		});
	  }
    })
  }
  render() {
	const {form,onFormChange} = this.props;
	const {submitLoading} = this.state;
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
			  ref='UserName'
			  error={!form.UserName.valid && form.UserName.error}
			  onErrorClick={() => {Toast.info(form.UserName.error);}}
			  value = {form.UserName.value}
			  onChange={value => onFormChange('UserName', value)}
		    ></InputItem>
		    <InputItem
		  	  placeholder = '请输入密码'
			  clear
			  type='password'
			  ref='PassWord'
			  error={!form.PassWord.valid && form.PassWord.error}
			  onErrorClick={() => {Toast.info(form.PassWord.error);}}
			  value = {form.PassWord.value}
			  onChange={value => onFormChange('PassWord', value)}
		    ></InputItem>
		  </List>
		  <WingBlank className='loginOther'>
			<Link to='/login'>忘记密码？</Link>
		  </WingBlank>
	      <div className='operationBtns'>
		    <WingBlank>
		      <WhiteSpace size='md' />
		      <Button 
		  	  style={submitLoading?style.btnLoading:style.btn} 
		  	  activeStyle={style.btnActive}
		  	  onClick={this.onSubmit}
		  	>{submitLoading?'登录中...':'登录'}</Button>
		      <WhiteSpace size='md' />
		      <Link to='/register' className='am-button'><span>还没有账号？立即注册</span></Link>
		      <WhiteSpace size='md' />
		    </WingBlank>
	      </div>
		</div>
      </div>
    );
  }
}


Login = formProvider({
  UserName: {
    defaultValue: '',
    rules: [
      {
        pattern: function (value) {
          return value.length > 0;
        },
        error: '请输入用户名'
      }
	]
  },
  PassWord: {
    defaultValue: '',
    rules: [
      {
        pattern: function (value) {
          return value.length > 0;
        },
        error: '请输入密码'
      }
	]
  },
})(Login);
export default Login;
