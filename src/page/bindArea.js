import React, { Component } from 'react';
import { 
	List,
	Button,
	InputItem,
	WingBlank,
	ImagePicker,
	Picker,
	Toast,
	WhiteSpace
 } from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom';
import {post,get} from '../utils/request';
import ImgUpload from './components/imgUpload';
import {loginToSetToken} from '../utils/func';







class BindArea extends Component { 
 constructor(props) {  
    super(props);  
    this.state = { 
	  UnitNo:'',
	  BuildingNo:'',
	  
	  districtInfo:[],
	  districtInfoList:[],
	  streetInfo:[],
	  streetInfoList:[],
	  communityInfo:[],
	  communityInfoList:[],
	  residenceInfo:[],
	  residenceInfoList:[],
	  
	  
	  FileIds:'',
	  hasToken:!(!sessionStorage.Authorization || sessionStorage.Authorization === 'null' ),
	  
	  submitLoading:false
	  
	}
  }
  componentDidMount(){
	this.getAreaInfo('districtInfoList','');
  }
  getAreaInfo = (fieldName,areaId) => {
	//console.log(this.state.districtInfo.length);
	let url = sessionStorage.apiUrl + '/api/AreaInfo/List?areaId=' + areaId;
	switch(fieldName){
	  case 'streetInfoList':
	    this.setState({streetInfo:[]});
	  case 'communityInfoList':
	    this.setState({communityInfo:[]});
	    this.setState({residenceInfo:[]});
	}
	get(url,this)
	.then(res => {
	  let areaInfoList = [];
	  res.Data.map(item => {
		areaInfoList.push({value:item.F_ID,label:item.F_FULL_NAME,children:[]});
	  });
	  this.setState({[fieldName]:areaInfoList});
	})
  }
  
  getResidenceInfo = (communityCode) =>{
	//console.log(communityCode[0]);
	let url = 'http://saturn.51vip.biz:81/data-system/api/bigScreen/house/getBasicHouseInfo?community_code=' + communityCode + '&pageNo=1&pageSize=999';
	fetch(url,{method:'GET'})
	.then(res => res.json())
	.then(res => {
	  let areaInfoList = [];
	  res.data.pageData.map(item => {
		areaInfoList.push({value:item.ID + ',' + item.NAMES,label:item.NAMES,children:[]});
	  });
	  this.setState({residenceInfoList:areaInfoList});
	})
  }

  onSubmit = () => {
	if(this.state.submitLoading) return false;
	this.setState({
	  submitLoading:true,
	})
	//console.log(this.state.residenceInfo[0].split(',')[0]);
	if(this.state.residenceInfo.length === 0){
	  Toast.info('请选择小区！');
	  return false;
	}
	const url = sessionStorage.apiUrl + '/api/Residence/AddUserResidence';
	let data = {
	  ResidenceName: this.state.residenceInfo[0].split(',')[1],
	  ResidenceId: this.state.residenceInfo[0].split(',')[0],
	  BuildingNo: this.state.BuildingNo,
	  UnitNo: this.state.UnitNo,
	};
	console.log(data);
	post(url,data,this)
	.then(res => {
	  console.log(res);
	  if(res.Data === 'OK'){
		Toast.info('提交成功');
		this.props.history.push('/vote/list');
	  }else{
		Toast.info('提交失败');
		this.setState({
		  submitLoading:false,
		})
	  }
	  
	})
  }

  getFileIds(info){
	//console.log(info);
	if(info.file.status === 'done' || info.file.status === 'removed'){
	  let str = '[';
      info.fileList.map((i,index) => {
  	    if(index !== 0) str += ',';
  	    str += '{"fileid":"' + i.response.fileid + '","name":"' + i.response.fileinfo.name + '","ext":"' + i.response.fileinfo.ext + '","size":"' + i.response.fileinfo.size + '"}';  
  	    return false;
      });
      str += ']';
	  //console.log(str);
      this.setState({
	    FileIds:str
	  });
	};
  }
  render() {
    return (
	  <div>
		<TopNavBar title='绑定小区'/>
		<div className='formBox peronalInfoForm' >
		  <List>
		    <Picker 
			  data={this.state.districtInfoList} 
			  cols={1} 
			  value={this.state.districtInfo}
			  onOk={districtInfo => {this.setState({ districtInfo });this.getAreaInfo('streetInfoList',districtInfo)}}
			>
			  <List.Item  arrow='horizontal'>区县</List.Item>
			</Picker>
		    <Picker 
			  data={this.state.streetInfoList} 
			  cols={1} 
			  disabled={this.state.districtInfo.length === 0}
			  value={this.state.streetInfo}
			  onOk={streetInfo => {this.setState({ streetInfo });this.getAreaInfo('communityInfoList',streetInfo)}}
			>
			  <List.Item  arrow='horizontal'>街道</List.Item>
			</Picker>
		    <Picker 
			  data={this.state.communityInfoList} 
			  cols={1} 
			  disabled={this.state.streetInfo.length === 0}
			  value={this.state.communityInfo}
			  onOk={communityInfo => {this.setState({ communityInfo });this.getResidenceInfo(communityInfo);}}
			>
			  <List.Item  arrow='horizontal'>社区</List.Item>
			</Picker>
		    <Picker 
			  data={this.state.residenceInfoList} 
			  cols={1} 
			  disabled={this.state.communityInfo.length === 0}
			  value={this.state.residenceInfo}
			  onOk={residenceInfo => this.setState({ residenceInfo })}
			>
			  <List.Item  arrow='horizontal'>小区</List.Item>
			</Picker>
			
			<div style={{overflow:'hidden'}} className='unitRoomNum'>
			  <div style={{width:'65%',float:'left'}}>
			    <InputItem
			      extra='单元 -'
		  	      placeholder = ''
				  type='number'
				  maxLength='4'
		          value={this.state.UnitNo}
		          onChange={UnitNo => this.setState({ UnitNo })}
		        >单元户号</InputItem>
			  </div>
			  <div style={{width:'35%',float:'left'}}>
			    <InputItem
				  className='roomNum'
			      extra='户号'
		  	      placeholder = ''
				  type='number'
				  maxLength='4'
		          value={this.state.BuildingNo}
		          onChange={BuildingNo => this.setState({ BuildingNo })}
		        />
			  </div>
			</div>
			<div style={{display:'none'}}>
		      <List.Item >产权证书（可不选）</List.Item>
		      <WingBlank style={{padding:8}}>
		        <ImgUpload toParent={this.getFileIds.bind(this)}/>
		      </WingBlank>
			</div>
		  </List>
	      <div className='operationBtns'>
		    <WingBlank>
		      <WhiteSpace size='md' />
		      <Button 
		  	    style={style.btn} 
		  	    activeStyle={style.btnActive}
		  	    onClick={this.onSubmit}
		  	  >提交认证</Button>
		      <WhiteSpace size='md' />
		      <Link to='/personalInfo' className='am-button'><span>取消</span></Link>
		      <WhiteSpace size='md' />
		    </WingBlank>
	      </div>
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
export default BindArea;
