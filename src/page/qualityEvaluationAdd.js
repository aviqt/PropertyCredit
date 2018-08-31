import React, { Component } from 'react';
import { 
	DatePicker,
	List,
	Button,
	TextareaItem,
	InputItem,
	Picker,
	Switch,
	WingBlank,
	Checkbox,
	Toast,
	WhiteSpace
 } from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import { Link,Redirect  } from 'react-router-dom';
import {get,post} from '../utils/request';
import ImgUpload from './components/imgUpload';

const CheckboxItem = Checkbox.CheckboxItem;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const nowPlus = new Date(nowTimeStamp + (24*3600*1000));


class QualityEvaluationAdd extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  addLoading:false,
	  clicked:'none',
	  submitSuccess:false,
	  residenceList:[],
	  
	  selectedRes:[],
	  
	  evaluationList:[],
	  content:'',
	  title:'',
	  startDate:now,
	  endDate:nowPlus,
	}
  }
  componentDidMount(){
	this.getResidenceList();
	this.getEvaluationList();
  }
  setEvaluationList(index,e){
	let {evaluationList}  = this.state;
	evaluationList[index].checked = e.target.checked;
	this.setState({evaluationList})
  }
  getEvaluationList(){
	let evaluationList = [
	  {id:'aa',Name:'综合服务',checked:false},
	  {id:'aa',Name:'秩序管理',checked:false},
	  {id:'aa',Name:'卫生保洁',checked:false},
	  {id:'aa',Name:'绿化养护',checked:false},
	  {id:'aa',Name:'物业维护',checked:false},
	];
	this.setState({evaluationList}); 
  }
  
  
  getResidenceList(){
	get(sessionStorage.apiUrl + '/api/Residence/UserResidenceList',this)
	.then(res => {
	  if(!res.Data)return false;
	  let residenceList = [];
	  console.log(res);
	  res.Data.map(item => {
		let residenceOption = [];
		residenceOption.value = item.ResidenceId;
		residenceOption.label = item.ResidenceName;
		residenceList.push(residenceOption);
		return false;
	  })
	  //console.log(residenceList);
	  this.setState({residenceList});
	})
  }

  checkForm(){
	const {
	  
	} = this.state;

	return true;
  }
  addBtnClick = () => {
	if(this.state.addLoading) return false;
	if(!this.checkForm())return false;
	this.setState({
	  addLoading:true,
	})
	const {content,selectedRes,FileIds} = this.state;
	let data = {
	  content:content,
	  selectedRes:selectedRes[0],
	  FileIds:FileIds,
	};
	console.log(data);
	
	return false;
	let url = sessionStorage.apiUrl + '/api/Vote/AddVoteProject';
	post(url,data,this)
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
  render() {
	if(this.state.submitSuccess){
	  return (<Redirect to='/vote/addSuccess' />);
	}
	  
    return (
	  <div>
		<TopNavBar title='质量评价' showLC/>
		<div className='formBox' style={{backgroundColor:'#efefef'}}>
		  <List>
		    <Picker 
		      data={this.state.residenceList} 
		  	  cols={1} 
		  	  value={this.state.selectedRes}
		      onChange={selectedRes => this.setState({ selectedRes })}
		      onOk={selectedRes => this.setState({ selectedRes })}
		    >
              <List.Item style={{display:'none'}} arrow='horizontal'>小区名称</List.Item>
            </Picker>
			<InputItem 
			  placeholder = '评价标题'
			  style={{fontSize:20}}
		      clear
		      value={this.state.title}
		      onChange={title => this.setState({ title })}
			/>
			
		    <TextareaItem
		  	  placeholder = '补充描述（选填）'
		  	  rows='2'
		  	  autoHeight
		      value={this.state.content}
		      onChange={content => this.setState({ content })}
		    />
			{this.state.evaluationList.map((item,index) => 
		      <CheckboxItem 
		  		key = {index}
		  		checked={item.checked} 
		  		onChange={this.setEvaluationList.bind(this,index)}
		  	  >
		  		{item.Name}
		  	  </CheckboxItem>
		    )}
			
			<div style={{height:30,backgroundColor:'#efefef'}}></div>
			<DatePicker
			  mode='date'
		      value={this.state.startDate}
		      onChange={startDate => this.setState({ startDate })}
		    >
		      <List.Item arrow='horizontal'>开始日期</List.Item>
		    </DatePicker>
		    <DatePicker
			  mode='date'
		      value={this.state.endDate}
		      onChange={endDate => this.setState({ endDate })}
		    >
		      <List.Item arrow='horizontal'>截止日期</List.Item>
		    </DatePicker>
		  </List>
	      <div className='operationBtns'>
		    <WingBlank>
		      <WhiteSpace size='md' />
		      <Button 
		  	    loading={this.state.addLoading} 
		  	    style={this.state.addLoading?style.loadingBtn:style.btn} 
		  	    onClick={this.addBtnClick}
		  	  >
		  	    {this.state.addLoading?'提交中 Loading':'提交'}
		  	  </Button>
		    </WingBlank>
	      </div>
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
export default QualityEvaluationAdd;
