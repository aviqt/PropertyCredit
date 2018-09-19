import React, { Component } from 'react';
import { 
	List,
	Button,
	InputItem,
	Picker,
	WingBlank,
	Accordion,
	Modal,
	WhiteSpace
 } from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom'
import {get,put,post} from '../utils/request';
import {loginToSetToken} from '../utils/func';
import ImgChange from './components/imgChange';
import { message} from 'antd';

const headImg = require('../images/headImg.png');
const myVoteIcon1 = require('../images/myVoteIcon1.png');


class PersonalInfo extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  user:[],
	  residenceList:[],
	}
  }
  componentDidMount(){
    this.getUserInfo();
    //this.getResidenceList();
  }
  getUserInfo(){
	const {user} = this.state;
	get(sessionStorage.apiUrl + '/api/Account/UserInfo')
	.then(res => {
	  //console.log(res);
	  user.FRealName = res.Data.FRealName;
	  user.FNickName = res.Data.FNickName;
	  user.FHeadIcon = res.Data.FHeadIcon ? sessionStorage.fileUrl + '/File/DownloadFile?iszip=false&fileids=' + res.Data.FHeadIcon : headImg;
	  user.FMobilePhone = res.Data.FMobilePhone;
	  this.setState({user});
	})
  }
  getResidenceList(){
	get(sessionStorage.apiUrl + '/api/Residence/UserResidenceList',this)
	.then(res => {
	  if(!res.Data)return false;
	  let residenceList = [];
	  //console.log(res);
	  res.Data.map(item => {
		let residenceOption = [];
		residenceOption.Id = item.Id;
		residenceOption.ResidenceId = item.ResidenceId;
		residenceOption.Name = item.ResidenceName;
		residenceOption.ApplyStatusStr = item.ApplyStatusStr === '已申报' ? '认证中' : '已认证';
		residenceList.push(residenceOption);
		return false;
	  })
	  this.setState({residenceList:residenceList});
	})
  }
  weChatLogout = () => {
	let url = sessionStorage.apiUrl + '/api/Account/WeChatLogout';
	let text = '是否确认要登出？';
	Modal.alert('登出后将解除绑定微信',text,[
	  {text:'否'},
	  {text:'是',onPress: () => {
		post(url).then(res => {
		  sessionStorage.setItem('Authorization','');
		  const weChatCode = sessionStorage.weChatCode;
		  if(weChatCode && weChatCode !== 'null'){
			window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxff2456f987559043&redirect_uri=http%3a%2f%2f' + sessionStorage.redirectUrl + '%2fWeChatVote%2f%23%2flogin&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
		  } else{
			window.location.href = '#/login';
		  }
		})
	  }},
	])
  }
  getImgId(id){
	const {user} = this.state;
	put(sessionStorage.apiUrl + '/api/Account/Icon?icon=' + id,'',this)
	.then(res =>{
	  console.log(res);
	  if(res.Data === 'OK'){
	    user.FHeadIcon = sessionStorage.fileUrl + '/File/DownloadFile?iszip=false&fileids=' + id;
	    this.setState({user});
		message.success('头像上传成功.');
	  }
	})
	console.log(id)
  }
  render() {
	const {residenceList,user} = this.state;
    return (
	  <div>
		<TopNavBar title='小区管理'/>
		<div className='peronalInfoForm' style={{bottom:0}}>
		  <List style={{border:"none"}}>
		    <div style={style.headImgBox}>
			  头像
			  <div style={style.headImg}>
		  	    <ImgChange 
			      toParent={this.getImgId.bind(this)} 
			      imgUrl={user.FHeadIcon}
				  className='headImg'
			    />
			  </div>
		    </div>
		    <List>
		      <InputItem
			    disabled
		        value={user.FRealName}
		      >姓名</InputItem>
		      <InputItem
			    disabled
		        value={user.FNickName}
		      >昵称</InputItem>
		      <InputItem
			    disabled
		        value={user.FMobilePhone}
		      >手机号码</InputItem>
			  <Link to='/residence/list'>
			    <List.Item arrow="horizontal" className='linkListItem'>
			  	  我的小区
			    </List.Item>
			  </Link>
		    </List>
		  </List>
	      <div className='operationBtns' style={{borderTop:"15px solid #e4e4e4"}}>
		    <WingBlank>
		      <WhiteSpace size="md" />
		      <Button type='warning' onClick={this.weChatLogout}>登出</Button>
		      <WhiteSpace size="md" />
		    </WingBlank>
	      </div>
		</div>
      </div>
    );
  }
}
const style = {
  headImgBox:{
    lineHeight:"130px",
    fontSize:17,
    position:'relative',
    paddingLeft:15
  },
  headImg:{
    position:'absolute',
	top:10,
	right:5,
  },
  btnLogout:{
    background:'#aa0000',
    color:'white',
  },

}; 
export default PersonalInfo;
