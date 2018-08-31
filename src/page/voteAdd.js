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
	Checkbox,
	Toast,
	WhiteSpace
 } from 'antd-mobile';
import InputOptionList from './components/inputOptionList';
import TopNavBar from './components/topNavBar';
import SubmitSuccess from './components/submitSuccess';
import { Link,Redirect  } from 'react-router-dom';
import {get,post} from '../utils/request';
import ImgUpload from './components/imgUpload';
import {selFunc} from '../utils/func';

const CheckboxItem = Checkbox.CheckboxItem;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const nowPlus = new Date(nowTimeStamp + (24*3600*1000));
const electoralRules = [
	{value:'不限',label:'不限',children:[]},
	{value:'规则一',label:'规则一',children:[]},
	{value:'规则二',label:'规则二',children:[]},
]
let eventPhotos = [{
  url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
  id: '2121',
}, {
  url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
  id: '2122',
}];


class VoteAdd extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  clicked:'none',
	  residenceList:[],
	  addLoading:false,
	
	  type:[1],
	  title:'',
	  describe:'',
	  startDate:now,
	  endDate:nowPlus,
	  isMulti:false,
	  maximum:[2],
	  isAnonymous:false,
	  electoralRule:['不限'],
	  shortListStr:',,',
	  FileIds:'',
	  selectedRes:[],
	}
  }
  componentDidMount(){
	this.getResidenceList();
  }
  getFileIds(info){
	//console.log(info);
	let str = selFunc.getFileIdsStr(info);
	this.setState({
	  FileIds:str
	})
  }
  setVoteRange(index,e){
	let {residenceList}  = this.state;
	residenceList[index].checked = e.target.checked;
	this.setState({residenceList:residenceList})
  }
 
  getResidenceList(){
	get(sessionStorage.apiUrl + '/api/Residence/UserResidenceList',this)
	.then(res => {
	  if(!res.Data)return false;
	  let residenceList = [];
	  //console.log(res);
	  res.Data.map(item => {
		let residenceOption = [];
		residenceOption.value = item.ResidenceId;
		residenceOption.label = item.ResidenceName;
		residenceList.push(residenceOption);
		return false;
	  })
	  //console.log(residenceList);
	  this.setState({
		residenceList:residenceList,
		selectedRes:[residenceList[0].value]
	  });
	})
  }
  getShortListStr = (shortListStr) => {
	this.setState({shortListStr:shortListStr})
　}
  checkForm(){
	const {
	  title,
	  shortListStr,
	  startDate,
	  endDate,
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
	if(shortListStr.split(',').filter(item => item.replace(/\s+/g,'')).length <= 1){
	  Toast.fail("至少需要添加两个投票选项.");
	  return false;
	}
	return true;
  }
  addVoteBtnClick = () => {
	if(this.state.addLoading) return false;
	if(!this.checkForm())return false;
	this.setState({
	  addLoading:true,
	})
	let VoteOptions = '[';
	this.state.shortListStr.split(',').filter(item => item.replace(/\s+/g,'')).map((item,index) => {
	  if(index !== 0) VoteOptions += ',';
	  VoteOptions += '{"Content":"' + item + '","Sort":"' + (index+1) + '"}';
	  return false;
	});
	VoteOptions += ']';
	let voteRangeDto = '{"ResidenceRange":"' + this.state.selectedRes[0] + '"}';
	let data = {
	  Title:this.state.title,
	  Content:this.state.describe,
	  FileIds:this.state.FileIds,
	  IsAnonymous:this.state.isAnonymous?1:0,
	  VoteCount:this.state.isMulti?this.state.maximum[0]:1,
	  IsMultipleVote:this.state.isMulti?1:0,
	  IsDelete:0,
	  StartTime:this.state.startDate.toJSON(),
	  EndTime:this.state.endDate.toJSON(),
	  AttentionDegree:0,
	  VoteOptions:VoteOptions,
	  VoteRangeDto:voteRangeDto,
	  Status:1,
	  VoteType: this.state.type[0],
	};
	console.log(data);
	//console.log(JSON.stringify(data));
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
		  console.log(res);
		  if(res.Data === 'OK'){
			selFunc.modal(SubmitSuccess);
		  }else{
			Toast.fail('提交失败!');
		  }
		})
	  }},
	])
	
  }
  renderMaximumPicker = () => {
	let data = [{value:2,label:2}];
	let count = this.state.shortListStr.split(',').length;
	let countT = this.state.shortListStr.split(',').filter((item) => item.replace(/\s+/g,'')).length;
	let disabled = false;
	if(countT < 3) disabled = true;
	if(this.state.isMulti && count > 2){
	  for(let i = 3;i <= countT;i++){
	  	data.push({value:i,label:i})
	  }
	  return <Picker 
		  disabled={disabled}
	  	  data={data} 
	  	  cols={1} 
	  	  value={this.state.maximum}
	  	  onChange={maximum => this.setState({ maximum })}
	  	  onOk={maximum => this.setState({ maximum })}
	    >
	  	  <List.Item arrow='horizontal'>最多可选</List.Item>
	    </Picker>;
	}
  }
  render() {

  
	const voteTypeList = [
	  {value:1,label:'制定和修改业主大会议事规则'},
	  {value:2,label:'制定和修改建筑物及其附属设施的管理规约'},
	  {value:3,label:'选举业主委员会或者更换业主委员会成员'},
	  {value:4,label:'选聘和解聘物业服务企业或者其他管理人'},
	  {value:5,label:'筹集和使用建筑物及其附属设施的维修资金'},
	  {value:6,label:'改建、重建建筑物及其附属设施'},
	  {value:7,label:'有关共有和共同管理权利的其他重大事项'},
	];
  
  
    return (
	  <div>
		<TopNavBar title='添加投票' showLC/>
		<div className='formBox' >
		  <List>
		    <Picker 
		      data={voteTypeList} 
		  	  cols={1} 
		  	  value={this.state.type}
		      onChange={type => this.setState({ type })}
		      onOk={type => this.setState({ type })}
		    >
              <List.Item arrow='horizontal'>投票类型</List.Item>
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
		      <ImgUpload toParent={this.getFileIds.bind(this)}/>
		    </WingBlank>
		    <InputOptionList 
		      id='shortList_test' 
		  	  optionListStr={this.state.shortListStr} 
		  	  toParent={this.getShortListStr.bind(this)} 
		    />
		    
		    <List.Item
		      extra={<Switch 
		  	  checked={this.state.isMulti}
		  	  onClick={(isMulti) => this.setState({ isMulti })}
		  	/>}
		    >是否多选</List.Item>
		    {this.renderMaximumPicker()}
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
		      data={electoralRules} 
		  	  cols={1} 
		  	  value={this.state.electoralRule}
		      onChange={electoralRule => this.setState({ electoralRule })}
		      onOk={electoralRule => this.setState({ electoralRule })}
		    >
              <List.Item style={{display:'none'}} arrow='horizontal'>选举规则</List.Item>
            </Picker>
		    <List.Item
		      style={{display:'none'}}
		      extra={<Switch 
		  	  checked={this.state.isOrot}
		  	  onClick={(isOrot) => this.setState({ isOrot })}
		  	/>}
		    >一房一票</List.Item>
		    <Picker 
		      data={this.state.residenceList} 
		  	  cols={1} 
		  	  value={this.state.selectedRes}
		      onChange={selectedRes => this.setState({ selectedRes })}
		      onOk={selectedRes => this.setState({ selectedRes })}
			  
		    >
              <List.Item arrow='horizontal'>选择小区</List.Item>
            </Picker>
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
