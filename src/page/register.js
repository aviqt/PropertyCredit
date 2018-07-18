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
	width:100,
	textAlign:'center'
  },
  getVCodeBtnGray:{
    position:'absolute',
    lineHeight:'35px',
    backgroundColor:'gray',
    color:'#ffffff',
    zIndex:3,
    top:5,
    right:5,
	width:100,
	textAlign:'center'
  },
}; 

let interval;
class Register extends Component {
  constructor(props){
	super(props);
	this.state = {
	  getCodeCD:0,
	  getCodeLoading:false
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
	this.addAcount();
  }
  addAcount = () => {
	const {form} = this.props;
	const url = sessionStorage.apiUrl + '/AddAccount?code=' + sessionStorage.weChatCode;
	
	let data = {
	  RealName: form.RealName.value,
	  NickName: form.NickName.value,
	  PhoneNumber: form.PhoneNumber.value.replace(/\s+/g,""),
	  Password: form.Password.value,
	  VerifyCode: form.VerifyCode.value,
	  IdCode: form.IdCode.value
	}
	//console.log(data);
	post(url,data)
	.then(res => {
	  console.log(res);
	  if(res.Data === 'OK'){
		Toast.info('注册成功');
		window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxff2456f987559043&redirect_uri=http%3a%2f%2fxueyu365.tunnel.qydev.com%2fWeChatVote%2f%23%2fbindArea&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
		//this.props.history.push('/bindArea');
		//window.location.origin+'/#/vote/list'
	  }else{
		Toast.info('注册失败');
	  }
	})
	
  }
  getAddAccountCode = () => {
	const {getCodeCD,getCodeLoading} = this.state;
	console.log(getCodeCD + '' + getCodeLoading);
	if(getCodeCD > 0 || getCodeLoading) return;
	this.setState({getCodeLoading:true});
	console.log(getCodeCD + '' + getCodeLoading);
	const {form} = this.props;
	if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(form.PhoneNumber.value.replace(/\s+/g,""))){
	  Toast.info('请输入正确的手机号码');
	  this.setState({
		getCodeLoading:false
	  });
	  return false;
	}
	post(sessionStorage.apiUrl + '/api/Account/AddAccountCode?phoneNumber=' + form.PhoneNumber.value.replace(/\s+/g,""))
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
	const {getCodeCD} = this.state;
    return (
	  <div>
		<TopNavBar showLC title='用户注册'/>
		<div className='formBox' >
		  <List>
		    <InputItem
		  	  placeholder = '请输入姓名'
			  ref='RealName'
			  error={!form.RealName.valid && form.RealName.error}
			  onErrorClick={() => {Toast.info(form.RealName.error);}}
			  value = {form.RealName.value}
			  onChange={value => onFormChange('RealName', value)}
		    ></InputItem>
		    <InputItem
		  	  placeholder = '请输入昵称'
			  ref='NickName'
			  error={!form.NickName.valid && form.NickName.error}
			  onErrorClick={() => {Toast.info(form.NickName.error);}}
			  value = {form.NickName.value}
			  onChange={value => onFormChange('NickName', value)}
		    ></InputItem>
		    <InputItem
		  	  placeholder = '请输入身份证号码'
			  maxLength='18'
			  ref='IdCode'
			  error={!form.IdCode.valid && form.IdCode.error}
			  onErrorClick={() => {Toast.info(form.IdCode.error);}}
			  value = {form.IdCode.value}
			  onChange={value => onFormChange('IdCode', value)}
		    ></InputItem>
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
				onClick={this.getAddAccountCode}
			  >{getCodeCD === 0 ? '获取验证码' : getCodeCD + '后重新获取'}</div>
			</div>
		    <InputItem
		  	  placeholder = '请输入密码'
			  type='password'
			  ref='Password'
			  error={!form.Password.valid && form.Password.error}
			  onErrorClick={() => {Toast.info(form.Password.error);}}
			  value = {form.Password.value}
			  onChange={value => onFormChange('Password', value)}
		    ></InputItem>
		  </List>
	      <div className='operationBtns'>
		    <WingBlank>
		      <WhiteSpace size='md' />
		      <Button 
		  	    style={style.btn} 
		  	    activeStyle={style.btnActive}
		  	    onClick={this.toNext}
		  	  >下一步</Button>
		      <WhiteSpace size='md' />
		      <Link to='/login' className='am-button'><span>取消</span></Link>
		      <WhiteSpace size='md' />
		    </WingBlank>
	      </div>
		</div>
      </div>
    );
  }
}
Register = formProvider({
  RealName: {
    defaultValue: '',
    rules: [
      {
        pattern: function (value) {
          return value.length > 0;
        },
        error: '请输入姓名'
      },
      {
        pattern: /^.{1,4}$/,
        error: '姓名最多4个字符'
      }
    ]
  },
  NickName: {
    defaultValue: '',
    rules: [
      {
        pattern: function (value) {
          return value.length > 0;
        },
        error: '请输入昵称'
      },
      {
        pattern: /^.{1,8}$/,
        error: '昵称最多8个字符'
      }
    ]
  },
  IdCode: {
    defaultValue: '',
    rules: [
      {
        pattern: function (value) {
          return value.length > 0;
        },
        error: '请输入身份证号码'
      }
    ]
  },
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
  Password: {
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
})(Register);
export default Register;
