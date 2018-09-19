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
import { Link } from 'react-router-dom'
import formProvider from '../utils/formProvider';
import {post} from '../utils/request';
import {selIcon} from '../utils/config';
import {appendObjectParams} from '../utils/func';

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
    zIndex:3,
    top:5,
    right:5,
	textAlign:'center',
	padding:'0 10px'
  },
  getVCodeBtnGray:{
    position:'absolute',
    lineHeight:'35px',
    backgroundColor:'gray',
    color:'#ffffff',
    zIndex:3,
    top:5,
    right:5,
	padding:'0 10px',
	textAlign:'center'
  },
}; 

let interval;
class LoginByMobile extends Component {
  constructor(props){
	super(props);
	this.state = {
	  getCodeCD:0,
	  getCodeLoading:false,
	  submitLoading:false,
	}
  }
  componentDidMount() {
	interval = setInterval(() => {
	  const {getCodeCD} = this.state;
	  this.setState({
		getCodeCD:getCodeCD === 0 ? 0 : getCodeCD - 1
	  });
	},1000)
  }
  componentWillUnmount(){
	clearInterval(interval);
  }
  toNext = () => {
	const {formValid} = this.props;
	if (!formValid) {
      alert('请填写正确的信息后重试');
      return;
    }
	this.loginToSetToken();
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
      client_id:form.PhoneNumber.value.replace(/\s+/g,""),
      client_secret:form.VerifyCode.value,
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
	  }
    }).then(res => {
	  if(res){
		//console.log(res);
        sessionStorage.setItem('Authorization','Bearer ' + res.access_token);
		this.bindWeChatCode();
	  }else{
		Toast.fail('登录失败！');
		this.setState({
		  submitLoading:false
		});
	  }
    })
  }
  getLoginVerifyCode = () => {
	const {getCodeCD,getCodeLoading} = this.state;
	if(getCodeCD > 0 || getCodeLoading) return;
	this.setState({getCodeLoading:true});
	
	
	const {form} = this.props;
	
	if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(form.PhoneNumber.value.replace(/\s+/g,""))){
	  Toast.info('请输入正确的手机号码');
	  this.setState({
		getCodeLoading:false
	  });
	  return false;
	}
	post(sessionStorage.apiUrl + '/api/Account/LoginVerifyCode?phoneNumber=' + form.PhoneNumber.value.replace(/\s+/g,""))
	.then(res => {
	  Toast.info('获取验证码成功.');
	  this.setState({
		getCodeLoading:false,
		getCodeCD:20
	  });
	});
	return false;
  }
  render() {
	const {form,onFormChange} = this.props;
	const {getCodeCD,submitLoading} = this.state;
    return (
	  <div>
		<TopNavBar  title='用手机号登录'/>
		<div className='formBox' >
		  <div className='loginHeadImg'>
		    <img src={selIcon.iconUser} alt='user'/>
		  </div>
		  <List>
		    <InputItem
		  	  placeholder = '请输入手机号码'
			  type='phone'
			  ref='PhoneNumber'
			  error={!form.PhoneNumber.valid && form.PhoneNumber.error}
			  onErrorClick={() => {Toast.info(form.PhoneNumber.error);}}
			  value = {form.PhoneNumber.value}
			  onChange={value => onFormChange('PhoneNumber', value)}
		    ></InputItem>
			<div style={{position:'relative'}}>
			  <div style={{paddingRight:100}}>
		        <InputItem
		  	      placeholder = '请输入验证码'
			      ref='VerifyCode'
			      error={!form.VerifyCode.valid && form.VerifyCode.error}
			      onErrorClick={() => {Toast.info(form.VerifyCode.error);}}
			      value = {form.VerifyCode.value}
			      onChange={value => onFormChange('VerifyCode', value)}
		        />
			  </div>
			  <div 
			    style={getCodeCD === 0 ?style.getVCodeBtn:style.getVCodeBtnGray}
				onClick={this.getLoginVerifyCode}
			  >{getCodeCD === 0 ? '获取验证码' : getCodeCD + '秒后可重新获取'}</div>
			</div>
		  </List>
	      <div className='operationBtns'>
		    <WingBlank>
		      <WhiteSpace size='md' />
		      <Button 
		  	    style={style.btn} 
		  	    activeStyle={style.btnActive}
		  	    onClick={this.toNext}
				loading={submitLoading}
		  	  >{submitLoading?'登录中...':'登录'}</Button>
		      <WhiteSpace size='md' />
		      <Link to='/login' className='am-button'><span>返回</span></Link>
		      <WhiteSpace size='md' />
		    </WingBlank>
	      </div>
		</div>
      </div>
    );
  }
}
LoginByMobile = formProvider({
  PhoneNumber: {
    defaultValue: '',
    rules: [
      {
        pattern: function (value) {
          return /^[1][3,4,5,7,8][0-9]{9}$/.test(value.replace(/\s+/g,""));
        },
        error: '请输入正确手机号码'
      }
    ]
  },
  VerifyCode: {
    defaultValue: '',
    rules: [
      {
        pattern: function (value) {
          return value.length > 0;
        },
        error: '请输入验证码'
      }
    ]
  },
})(LoginByMobile);
export default LoginByMobile;
