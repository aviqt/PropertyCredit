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
import {get,put} from '../utils/request';
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
    this.getResidenceList();
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
  savePersonalInfo = () => {
	console.log(this.state.sex[0])
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
		    </List>
		  </List>
		  <div style={{borderTop:"15px solid #e4e4e4"}}>
		    <Accordion className="my-accordion" accordion >
              <Accordion.Panel header={<div >我的小区 <img src={myVoteIcon1} alt='myVoteIcon1' /></div>} >
                <List >
				  {residenceList.map((item,index) => 
				    <List.Item key={index} arrow="horizontal">
					  <Link to={'/bindAreaInfo/' + item.Id} style={{color:'#333',display:'block'}}>
					    {item.Name + '(' + item.ApplyStatusStr + ')'}
					  </Link>
					</List.Item>
				  )}
                  <List.Item arrow="horizontal">
				    <Link to='/bindArea' style={{display:'block'}}>
				      添加新的小区
				    </Link>
				  </List.Item>
                </List>
              </Accordion.Panel>
            </Accordion>
		  </div>
		</div>
	    <div className='operationBtns' style={{display:'none'}}>
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
  btn:{
    backgroundColor:'#18a3fe',
    color:'#fff',
  },
  btnActive:{
    backgroundColor:'gray'
  },
}; 
export default PersonalInfo;
