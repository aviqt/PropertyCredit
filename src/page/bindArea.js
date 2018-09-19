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
	  houseList:[],
	  selectedHouse:[],
	  familyList:[],
	  selectedFamily:[],
	  
	  
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
	//console.log(fieldName.substr(0,fieldName.length-4));
	get(url,this)
	.then(res => {
	  let areaInfoList = [];
	  res.Data.map(item => {
		areaInfoList.push({value:item.F_ID,label:item.F_FULL_NAME,children:[]});
	  });
	  this.setState({
		[fieldName]:areaInfoList,
		//[fieldName.substr(0,fieldName.length-4)]:[areaInfoList[0].value]
	  });
	  //switch(fieldName){
	  //  case 'districtInfoList':
	  //    this.getAreaInfo('streetInfoList',areaInfoList[0].value);
	  //	  break;
	  //  case 'streetInfoList':
	  //    this.getAreaInfo('communityInfoList',areaInfoList[0].value);
	  //	  break;
	  //  case 'communityInfoList':
	  //    this.getResidenceInfo(areaInfoList[0].value);
	  //}
	})
  }
  getResidenceInfo = (communityCode) =>{
	//console.log(communityCode[0]);
	let url = sessionStorage.apiUrl + '/api/Residence/ResidenceByCommunity?community=' + communityCode + '&pageNo=1&pageSize=999';
	get(url).then(res => {
	  let areaInfoList = [];
	  res.Data.map(item => {
		areaInfoList.push({value:item.id,label:item.text,children:[]});
	  });
	  this.setState({
		residenceInfoList:areaInfoList
	  });
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
	let ResidenceName = this.state.residenceInfoList.filter(item => item.value === this.state.residenceInfo[0])[0].label;
	let data = {
	  ResidenceName,
	  ResidenceId: this.state.residenceInfo[0],
	  FamilyId: this.state.selectedFamily[0],
	};
	post(url,data)
	.then(res => {
	  //console.log(res);
	  if(res.Data === 'OK'){
		Toast.info('提交成功');
		this.props.history.go(-1);
	  }else{
		Toast.info('提交失败');
		this.setState({
		  submitLoading:false,
		})
	  }
	})
  }
//根据小区ID获取楼栋和用户列表
  getHouseByResidenceId = (selectedRes) => {
	let url = sessionStorage.apiUrl + '/api/Residence/HouseByResidenceId?residenceId=' + selectedRes[0];
	get(url).then(res => {
	  if(!res.Data)return false;
	  let houseList = [];
	  //console.log(res);
	  res.Data.map(item => {
		let houseOption = [];
		houseOption.value = item.Id;
		houseOption.label = item.Name;
		houseList.push(houseOption);
		return false;
	  })
	  //console.log(residenceList);
	  this.setState({
		houseList,
		selectedHouse:res.Data.length === 0 ? [] :[houseList[0].value]
	  });
	  if(res.Data.length === 0)return false;
	  this.getFamilyByHouseId([houseList[0].value]);
	})
  }
  //获取房号
  getFamilyByHouseId = (selectedHouse) => {
	let url = sessionStorage.apiUrl + '/api/Residence/FamilyByHouseId?houseId=' + selectedHouse[0];
	get(url).then(res => {
	  if(!res.Data)return false;
	  let familyList = [];
	  res.Data.map(item => {
		let familyOption = [];
		familyOption.value = item.Id;
		familyOption.label = item.FamilyNo;
		familyList.push(familyOption);
		return false;
	  })
	  this.setState({
		familyList,
		selectedFamily:res.Data.length === 0 ? [] :[familyList[0].value]
	  });
	})
  }
  
  //渲染楼栋和单元选择框
  renderSelectHouseFamily = ()=> {
	const {
	  residenceInfo,
	} = this.state;
	return (
	  <div>
	    <Picker 
	      data={this.state.houseList} 
	      cols={1} 
	      value={this.state.selectedHouse}
	      onOk={selectedHouse => {this.setState({ selectedHouse });this.getFamilyByHouseId(selectedHouse)}}
	    >
	      <List.Item arrow='horizontal' style={{display:residenceInfo.length === 0?'none':''}}>楼栋</List.Item>
	    </Picker>
	    <Picker 
	      data={this.state.familyList} 
	      cols={1} 
	      value={this.state.selectedFamily}
	      onOk={selectedFamily => {this.setState({ selectedFamily });}}
	    >
	      <List.Item arrow='horizontal'  style={{display:residenceInfo.length === 0?'none':''}}>房号</List.Item>
	    </Picker>
	  </div>
	)
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
	const {
	  districtInfoList,
	  districtInfo,
	  streetInfoList,
	  streetInfo,
	  communityInfoList,
	  communityInfo,
	  residenceInfoList,
	  residenceInfo,
	} = this.state;
	  
	  
	  
    return (
	  <div>
		<TopNavBar showLC title='绑定小区'/>
		<div className='formBox peronalInfoForm' >
		  <List>
		    <Picker 
			  data={districtInfoList} 
			  cols={1} 
			  value={districtInfo}
			  onOk={districtInfo => {this.setState({ districtInfo });this.getAreaInfo('streetInfoList',districtInfo)}}
			>
			  <List.Item  arrow='horizontal'>区县</List.Item>
			</Picker>
		    <Picker 
			  data={streetInfoList} 
			  cols={1} 
			  disabled={districtInfo.length === 0}
			  value={streetInfo}
			  onOk={streetInfo => {this.setState({ streetInfo });this.getAreaInfo('communityInfoList',streetInfo)}}
			>
			  <List.Item  arrow='horizontal' style={{display:districtInfo.length === 0?'none':''}}>街道</List.Item>
			</Picker>
		    <Picker 
			  data={communityInfoList} 
			  cols={1} 
			  disabled={streetInfo.length === 0}
			  value={communityInfo}
			  onOk={communityInfo => {this.setState({ communityInfo });this.getResidenceInfo(communityInfo);}}
			>
			  <List.Item  arrow='horizontal' style={{display:streetInfo.length === 0?'none':''}}>社区</List.Item>
			</Picker>
		    <Picker 
			  data={residenceInfoList} 
			  cols={1} 
			  disabled={communityInfo.length === 0}
			  value={residenceInfo}
			  onOk={residenceInfo => {this.setState({ residenceInfo });this.getHouseByResidenceId(residenceInfo);}}
			>
			  <List.Item  arrow='horizontal' style={{display:communityInfo.length === 0?'none':''}}>小区</List.Item>
			</Picker>
			{this.renderSelectHouseFamily()}
			<div style={{overflow:'hidden',display:'none'}} className='unitRoomNum'>
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
		  	  >提交</Button>
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
