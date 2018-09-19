import React, { Component } from 'react';
import { 
	DatePicker,
	List,
	Button,
	TextareaItem,
	InputItem,
	Picker,
	Modal,
	Switch,
	WingBlank,
	Toast,
	WhiteSpace
 } from 'antd-mobile';
import VoteSubproject from './components/voteSubproject';
import VoteSubprojectEdit from './components/voteSubprojectEdit';
import TopNavBar from './components/topNavBar';
import SubmitSuccess from './components/submitSuccess';
import { Link  } from 'react-router-dom';
import {get,post} from '../utils/request';
import ImgUpload from './components/imgUpload';
import {selFunc} from '../utils/func';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const nowPlus = new Date(nowTimeStamp + (24*3600*1000));




class VoteAdd extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  clicked:'none',
	  residenceList:[],
	  houseList:[],
	  unitList:[],
	  voteTypeList:[],
	  userList:[],
	  addLoading:false,
	  subprojectEditIndex:-1,
	  fileList:[],
	
	  type:[1],
	  legalBasis:[1],
	  title:'',
	  describe:'',
	  startDate:now,
	  endDate:nowPlus,
	  isMulti:false,
	  maximum:[2],
	  isAnonymous:false,
	  isPublicity:true,
	  electoralRule:['不限'],
	  shortListStr:'同意,不同意',
	  subproject:[],
	  FileIds:'',
	  selectedRes:[],
	  selectedHouse:[],
	  selectedUnit:[],
	}
  }
  componentDidMount(){
	this.getResidenceList();
	this.getVoteTypeList();
	this.initSubproject();
  }
  //图片文件字符串
  getFileIds(info){
	let str = selFunc.getFileIdsStr(info);
	this.setState({
	  FileIds:str,
	  fileList:info.fileList
	})
  }
  //投票子项
  initSubproject(){
	let subproject = [];
	for(let i = 0;i<1;i++){
	  subproject.push({
	    title:'题目',
	    count:1,
	    optionStr:'同意,不同意'
	  });
	}
	this.setState({
	  subproject,
	});
  }
  //投票子项
  setSubproject = (subproject,index) =>{
	this.setState({
	  subproject,
	  subprojectEditIndex:index || index === 0 ? index : -1,
	});
  }
  
  //投票类型
  getVoteTypeList= ()=> {
	let url = sessionStorage.apiUrl + '/api/ItemData/List?enCode=VoteBusiness';
	let voteTypeList = [];
	get(url).then(res => {
	  res.Data && res.Data.map(item => {
	    let typeOption = [];
	    typeOption.value = item.code;
	    typeOption.label = item.text;
	    voteTypeList.push(typeOption);
	    return false;
	  })
	  this.setState({
		voteTypeList,
	    type:[voteTypeList[0].value],
	  })
	})
  }
  
  
  //获取小区列表
  getResidenceList(){
	get(sessionStorage.apiUrl + '/api/Residence/UserResidenceList')
	.then(res => {
	  if(!res.Data)return false;
	  let residenceList = [];
	  //console.log(res);
	  res.Data.filter(item => item.RoleName === '业委会成员').map(item => {
		let residenceOption = [];
		residenceOption.value = item.ResidenceId;
		residenceOption.label = item.ResidenceName;
		residenceList.push(residenceOption);
		return false;
	  })
	  residenceList = selFunc.delArrayRepeat(residenceList,'value');
	  this.setState({
		residenceList:residenceList,
		selectedRes:[residenceList[0].value]
	  });
	  this.getHouseByResidenceId([residenceList[0].value]);
	  
	})
  }
  //投票选项
  getShortListStr = (shortListStr) => {
	this.setState({shortListStr:shortListStr})
　}

  //提交验证
  checkForm(){
	const {
	  title,
	  shortListStr,
	  startDate,
	  endDate,
	  subproject,
	} = this.state;
	//console.log(startDate >= endDate)
	if(startDate >= endDate){
	  Toast.fail("设置的投票日期不合法.");
	  return false;
	}
	if(title.replace(/\s+/g,'').length <= 0){
	  Toast.fail("请输入标题.");
	  return false;
	}
	if(subproject.length < 1){
	  Toast.fail("至少需要添加一个投票项目.");
	  return false;
	}
	return true;
  }
  
  //提交表单
  addVoteBtnClick = () => {
	if(this.state.addLoading) return false;
	if(!this.checkForm())return false;
	this.setState({
	  addLoading:true,
	})
	
	
	const {subproject} = this.state;
	
	
	//let VoteOptions = '[';
	//this.state.shortListStr.split(',').filter(item => item.replace(/\s+/g,'')).map((item,index) => {
	//  if(index !== 0) VoteOptions += ',';
	//  VoteOptions += '{"Content":"' + item + '","Sort":"' + (index+1) + '"}';
	//  return false;
	//});
	//VoteOptions += ']';
	
	
	//let VoteProjectExtend = '[';
	//subproject.map((item,index) => {
	//  if(index !== 0) VoteProjectExtend += ',';
	//  VoteProjectExtend += '{"Title":"' + item.title + '","VoteCount":"' + item.count + '","VoteOptions":"[';
	//  item.optionStr.split(',').filter(itemX => itemX.replace(/\s+/g,'')).map((itemX,indexX) => {
	//    if(indexX !== 0) VoteProjectExtend += ',';
	//    VoteProjectExtend += '{"Content":"' + itemX + '","Sort":"' + (indexX+1) + '"}';
	//    return false;
	//  });
	//  VoteProjectExtend += ']"}';
	//  return false;
	//})
	//VoteProjectExtend += ']';
	let VoteProjectExtend = [];
	subproject.map((item,index) => {
	  let VoteOptions = '['
	  item.optionStr.split(',').filter(itemX => itemX.replace(/\s+/g,'')).map((itemX,indexX) => {
	    if(indexX !== 0) VoteOptions += ',';
	    VoteOptions += '{"Content":"' + itemX + '","Sort":"' + (indexX+1) + '"}';
	    return false;
	  });
	  VoteOptions += ']';
	  
	  let optionItem = {
	    Title:item.title,
	    VoteCount:item.count,
	    VoteOptions:VoteOptions,
	  };
	  
	  VoteProjectExtend.push(optionItem);
	  return false;
	})
	let voteRangeDto = '{"ResidenceRange":"' + this.state.selectedRes[0] + '"}';
	let data = {
	  Title:this.state.title,
	  Content:this.state.describe,
	  FileIds:this.state.FileIds,
	  //toJSON输出国际标准时间（ISO）,减少了8个小时,这里给加了8个小时
	  StartTime:(new Date(this.state.startDate.getTime() + 3600 * 8 * 1000)).toJSON(),
	  EndTime:(new Date(this.state.endDate.getTime() + 3600 * 8 * 1000)).toJSON(),
	  IsPublicity:this.state.isPublicity?1:0,
	  VoteType: this.state.legalBasis[0],
	  VoteBusiness: this.state.type[0],
	  RangeBuildingNo: this.state.selectedHouse[0],
	  RangeUnitNo: this.state.selectedUnit[0],
	  
	  VoteProjectExtend:VoteProjectExtend,
	  VoteRangeDto:voteRangeDto,
	  Status:1,
	  
	  //VoteOptions:VoteOptions,
	  //AttentionDegree:0,
	  //VoteCount:this.state.isMulti?this.state.maximum[0]:1,
	  //IsMultipleVote:this.state.isMulti?1:0,
	  
	};
	//console.log(data);
	//console.log(JSON.stringify(data));
	//return false;
	let url = sessionStorage.apiUrl + '/api/Vote/AddVoteProject';
	let text = '您确认要添加投票吗？';
	Modal.alert('提示',text,[
	  {text:'否',onPress: () => {
		this.setState({
		  addLoading:false,
		})
	  }},
	  {text:'是',onPress: () => {
		post(url,data).then(res => {
		  //console.log(res);
		  if(res.Data === 'OK'){
			selFunc.modal(SubmitSuccess);
		  }else{
			Toast.fail('提交失败!');
		  }
		})
	  }},
	])
	
  }

  //改变模板
  changeType = (type) => {
	let shortListStr = ',,';
	let subproject = [{title:'',count:1,optionStr:',,'}];
	switch(type[0]){
	  case '6':
	  case '99':
	  	shortListStr = '同意,不同意';
		subproject = [{title:'',count:1,optionStr:'同意,不同意'}];
	  	break;
	  case '3':
	    break;
	  default:
	}
	this.setState({
	  type,
	  subproject,
	  shortListStr
	});
  }
  //根据小区ID获取楼栋和用户列表
  getHouseByResidenceId = (selectedRes) => {
	let url = sessionStorage.apiUrl + '/api/Residence/HouseByResidenceId?residenceId=' + selectedRes[0];
	let urlVotersByResidenceId = sessionStorage.apiUrl + '/api/Vote/VotersByResidenceId?keyValue=' + selectedRes[0];
	
	
	get(urlVotersByResidenceId).then(res => {
	  let userList = [];
	  res.Data.map(item => {
		let userOption = [];
		userOption.value = item.UserId;
		userOption.label = item.UserName;
		userList.push(userOption);
		return false;
	  })
	  userList = selFunc.delArrayRepeat(userList,'value');
	  this.setState({
		userList
	  })
	})
	
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
		selectedHouse:[houseList[0].value]
	  });
	  this.getUnitByHouseId([houseList[0].value]);
	})
  }
  //获取单元
  getUnitByHouseId = (selectedHouse)=>{
	let url = sessionStorage.apiUrl + '/api/Residence/UnitByHouseId?houseId=' + selectedHouse[0];
	get(url).then(res => {
	  if(!res.Data)return false;
	  let unitList = [];
	  res.Data.map(item => {
		let unitOption = [];
		unitOption.value = item.id;
		unitOption.label = item.name;
		unitList.push(unitOption);
		return false;
	  })
	  //console.log(residenceList);
	  this.setState({
		unitList,
		selectedUnit:[unitList[0].value]
	  });
	})
  }
  //渲染楼栋和单元选择框
  renderSelectHouseUnit = ()=> {
	if(this.state.type[0] !== '99') return false;
	return (
	  <div>
	    <Picker 
	      data={this.state.houseList} 
	      cols={1} 
	      value={this.state.selectedHouse}
	      onOk={selectedHouse => {this.setState({ selectedHouse });this.getUnitByHouseId(selectedHouse)}}
	    >
	      <List.Item arrow='horizontal' >选择楼栋</List.Item>
	    </Picker>
	    <Picker 
	      data={this.state.unitList} 
	      cols={1} 
	      value={this.state.selectedUnit}
	      onOk={selectedUnit => {this.setState({ selectedUnit });}}
	    >
	      <List.Item arrow='horizontal'>选择单元</List.Item>
	    </Picker>
	  </div>
	)
  }
  
  
  render() {
	const {voteTypeList,userList} = this.state;
  
	const legalBasisList = [
	  {value:1,label:'制定和修改业主大会议事规则'},
	  {value:2,label:'制定和修改建筑物及其附属设施的管理规约'},
	  {value:3,label:'选举业主委员会或者更换业主委员会成员'},
	  {value:4,label:'选聘和解聘物业服务企业或者其他管理人'},
	  {value:5,label:'筹集和使用建筑物及其附属设施的维修资金'},
	  {value:6,label:'改建、重建建筑物及其附属设施'},
	  {value:7,label:'有关共有和共同管理权利的其他重大事项'},
	];
	
    if(this.state.subprojectEditIndex !== -1){
	  return (
	    <div>
		  <TopNavBar title='编辑投票内容' showLC />
		  <VoteSubprojectEdit
		    toParent={this.setSubproject.bind(this)} 
		    subproject={this.state.subproject}
		    isPicker={this.state.type[0] === '3' }
		    userList={userList}
		    index={this.state.subprojectEditIndex}
		  />
		</div>
	  );
	}
  
    return (
	  <div>
		<TopNavBar title='添加投票' showLC/>
		<div className='formBox' >
		  <List>
		    <Picker 
		      data={voteTypeList} 
		  	  cols={1} 
		  	  value={this.state.type}
		      onChange={(type)=>{this.changeType(type)}}
		    >
              <List.Item arrow='horizontal'>投票类型</List.Item>
            </Picker>
		    <Picker 
		      data={legalBasisList} 
		  	  cols={1} 
		  	  value={this.state.legalBasis}
		      onChange={legalBasis => this.setState({ legalBasis })}
		    >
              <List.Item arrow='horizontal' style={{display:this.state.type[0] !== '0'?'none':''}}>法律依据</List.Item>
            </Picker>
		  
		    <InputItem
		      clear
		  	  placeholder = '请输入'
		      value={this.state.title}
		      onChange={title => this.setState({ title })}
		    >投票标题</InputItem>
		    <TextareaItem
		      title='补充描述'
		  	  placeholder = '请输入'
		  	  rows='8'
		  	  autoHeight
		      value={this.state.describe}
		      onChange={describe => this.setState({ describe })}
		    />
		    <List.Item >活动图片</List.Item>
          
		    <WingBlank style={{paddingTop:8}}>
		      <ImgUpload fileList={this.state.fileList} toParent={this.getFileIds.bind(this)}/>
		    </WingBlank>
		    <VoteSubproject 
		  	  toParent={this.setSubproject.bind(this)} 
			  subproject={this.state.subproject}
			  isPicker={this.state.type[0] === '3' }
			  userList={userList}
			/>
		    <List.Item
		      extra={<Switch 
		  	    checked={this.state.isPublicity}
		  	    onClick={(isPublicity) => this.setState({ isPublicity })}
		  	  />}
		    >是否公示</List.Item>
		    <DatePicker
		      value={this.state.startDate}
		      onChange={startDate => this.setState({ startDate })}
		    >
		      <List.Item arrow='horizontal'>开始日期</List.Item>
		    </DatePicker>
		    <DatePicker
		      value={this.state.endDate}
		      onChange={endDate => this.setState({ endDate })}
		    >
		      <List.Item arrow='horizontal'>结束日期</List.Item>
		    </DatePicker>
		    <Picker 
		      data={this.state.residenceList} 
		  	  cols={1} 
		  	  value={this.state.selectedRes}
			  onOk={selectedRes => {this.setState({ selectedRes });this.getHouseByResidenceId(selectedRes)}}
			  
		    >
              <List.Item arrow='horizontal'>选择小区</List.Item>
            </Picker>
			{this.renderSelectHouseUnit()}
		  </List>
	      <div className='operationBtns'>
		    <WingBlank>
		      <WhiteSpace size='md' />
		      <Button 
		  	    loading={this.state.addLoading} 
		  	    style={this.state.addLoading?style.loadingBtn:style.btn} 
		  	    onClick={this.addVoteBtnClick}
		  	  >
		  	    {this.state.addLoading?'提交中 Loading':'提交'}
		  	  </Button>
		      <WhiteSpace size='md' />
		      <Link to='/vote/list' className='am-button'><span>取 消</span></Link>
		      <WhiteSpace size='md' />
		    </WingBlank>
	      </div>
		</div>
      </div>
    );
  }
}

const style ={
  loadingBtn:{
  	backgroundColor:'#18a3fe',
  	color:'white'
  },
  btn:{
    backgroundColor:'#18a3fe',
    color:'#fff',
  },
  btnActive:{
    backgroundColor:'gray'
  },
}
export default VoteAdd;
