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
import SubmitSuccess from './components/submitSuccess';
import ImgUpload from './components/imgUpload';
import { Link,Redirect  } from 'react-router-dom';
import {get,post} from '../utils/request';
import {selFunc} from '../utils/func';

const CheckboxItem = Checkbox.CheckboxItem;



class ComplaintAdd extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  addLoading:false,
	  clicked:'none',
	  submitSuccess:false,
	  residenceList:[],
	  
	  title:'',
	  content:'',
	  type:[1],
	  selectedRes:[],
	  FileIds:'',
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
	  console.log(residenceList);
	  this.setState({
		residenceList:residenceList,
		selectedRes:[residenceList[0].value]
	  });
	})
  }

  checkForm(){
	const {
	  title,
	  content,
	  selectedRes,
	  type,
	  FileIds
	} = this.state;
	if(title.replace(/\s+/g,'').length <= 0){
	  Toast.fail("请输入标题.");
	  return false;
	}
	let data = {
	  Title:title,
	  Content:content,
	  ResidenceId:selectedRes[0],
	  ComplaintType:type[0],
	  FileIds:FileIds,
	};
	
	return data;
  }
  addBtnClick = () => {
	if(this.state.addLoading) return false;
	let data = this.checkForm();
	if(!data)return false;
	this.setState({
	  addLoading:true,
	})
	console.log(data);
	//return false;
	let url = sessionStorage.apiUrl + '/api/Complaint/';
	post(url,data)
	.then(res => {
	  console.log(res);
	  if(res.State === 'Success'){
	  	//setTimeout(()=>{
	    //  this.setState({
	    //	submitSuccess:true,
	    //  })
	    //},500);
		//Toast.info('添加成功');
		selFunc.modal(SubmitSuccess);
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
	  
	const complaintTypeList = [
	  {value:1,label:'投诉'},
	  {value:2,label:'建议'},
	  {value:3,label:'报修'},
	];
	  
	  
    return (
	  <div>
		<TopNavBar title='物业投诉' showLC/>
		<div className='formBox' >
		  <List>
		    <Picker 
		      data={this.state.residenceList} 
		  	  cols={1} 
		  	  value={this.state.selectedRes}
		      onChange={selectedRes => this.setState({ selectedRes })}
		      onOk={selectedRes => this.setState({ selectedRes })}
		    >
              <List.Item  arrow='horizontal'>小区名称</List.Item>
            </Picker>
		    <Picker 
		      data={complaintTypeList} 
		  	  cols={1} 
		  	  value={this.state.type}
		      onChange={type => this.setState({ type })}
		      onOk={type => this.setState({ type })}
		    >
              <List.Item  arrow='horizontal'>投诉类型</List.Item>
            </Picker>
			
			
			<InputItem 
			  placeholder = '标题'
			  style={{fontSize:20}}
		      value={this.state.title}
		      onChange={title => this.setState({ title })}
			/>
		    <TextareaItem
		  	  placeholder = '请输入您的投诉内容'
		  	  rows='8'
		  	  autoHeight
		      value={this.state.content}
		      onChange={content => this.setState({ content })}
		    />
		    <List.Item >添加图片</List.Item>
		    <WingBlank style={{paddingTop:8,paddingBottom:8}}>
		      <ImgUpload toParent={this.getFileIds.bind(this)}/>
		    </WingBlank>

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
		      <WhiteSpace size='md' />
		      <Link to='/complaint/list' className='am-button'><span>取 消</span></Link>
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
export default ComplaintAdd;
