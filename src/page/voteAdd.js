import React, { Component } from 'react';
import { 
	DatePicker,
	List,
	Button,
	TextareaItem,
	InputItem,
	ImagePicker,
	Picker,
	Switch,
	WingBlank,
	Checkbox,
	Toast,
	WhiteSpace
 } from 'antd-mobile';
import InputOptionList from './components/inputOptionList';
import TopNavBar from './components/topNavBar';
import { Link,Redirect  } from 'react-router-dom';
import {get,post} from '../utils/request';
import ImgUpload from './components/imgUpload';

const CheckboxItem = Checkbox.CheckboxItem;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
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
	  title:'',
	  describe:'',
	  eventPhotos:eventPhotos,
	  startDate:now,
	  endDate:now ,
	  isMulti:false,
	  isOrot:true,
	  maximum:[2],
	  isAnonymous:false,
	  electoralRule:['不限'],
	  shortListStr:',,',
	  saveLoading:false,
	  addLoading:false,
	  param:props.location.state?props.location.state:[],
	  clicked:'none',
	  submitSuccess:false,
	  residenceList:[],
	  FileIds:'',
	}
  }
  componentDidMount(){
	this.getResidenceList();
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
  setVoteRange(index,e){
	let {residenceList}  = this.state;
	residenceList[index].checked = e.target.checked;
	this.setState({residenceList:residenceList})
  }
  getResidenceList(){
	get('/api/Vote/ResidenceList')
	.then(res => {
	  let residenceList = [];
	  res.Data.map(item => {
		let residenceOption = [];
		residenceOption.id = item.Id;
		residenceOption.Name = item.Name;
		residenceOption.checked = false;
		residenceList.push(residenceOption);
		return false
	  })
	  this.setState({residenceList:residenceList});
	})
  }
  getShortListStr = (shortListStr) => {
	this.setState({shortListStr:shortListStr})
　}
  imagePickerChange = (files,type,index) =>{
	console.log(files[0]);
	this.setState({
	  eventPhotos:files
	})
	if(files.length === 0)return false;

  }

  addVoteBtnClick = () => {
	if(this.state.addLoading) return false;
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
	//console.log(VoteOptions);
	let voteRangeDto = '{"ResidenceRange":"';
	this.state.residenceList.filter(item => item.checked).map((item,index) => {
	  if(index !== 0) voteRangeDto += ',';
	  voteRangeDto += item.id;
	  return false;
	});
	voteRangeDto += '"}';
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
	  voteRangeDto:voteRangeDto,
	  Status:1,
	};
	//console.log(data);
	//console.log(JSON.stringify(data));
	let url ='/api/Vote/AddVoteProject';
	post(url,data)
	.then(res => {
	  console.log(res.Data);
	  if(res.Data === 'OK'){
	  	setTimeout(()=>{
	      this.setState({
	    	submitSuccess:true,
	      })
	    },500);
		Toast.info('添加成功');
	  }else{
		this.setState({
		  addLoading:false,
		})
		Toast.info('添加失败');
	  }
	  
	})
	
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
	if(this.state.submitSuccess){
	  return (<Redirect to='/vote/addSuccess' />);
	}
	  
    return (
	  <div>
		<TopNavBar title='添加投票' showLC/>
		<List className='addVoteForm'>
		
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
		  <List.Item  arrow='horizontal'>活动图片</List.Item>

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
		  <List.Item
		    extra={<Switch 
			  checked={this.state.isAnonymous}
			  onClick={(isAnonymous) => this.setState({ isAnonymous })}
			/>}
		  >是否匿名</List.Item>
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
		  <List.Item style={{borderTop:'10px solid #ddd'}}  arrow='horizontal'>投票范围</List.Item>
		  {this.state.residenceList.map((item,index) => 
		    <CheckboxItem 
				key = {'residenceItem'+index}
				checked={item.checked} 
				onChange={this.setVoteRange.bind(this,index)}
			  >
				{item.Name}
			  </CheckboxItem>
		  )}
          
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
		    <Link to='/vote/list' className='am-button'><span>取消</span></Link>
		    <WhiteSpace size='md' />
		  </WingBlank>
	    </div>
      </div>
    );
  }
}

const style ={
  loadingBtn:{
  	backgroundColor:'#a17e7e',
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
