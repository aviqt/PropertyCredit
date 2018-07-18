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



class ComplaintAdd extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  content:'',
	  selectedRes:[],
	  FileIds:'',
	  addLoading:false,
	  clicked:'none',
	  submitSuccess:false,
	  residenceList:[],
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
	  this.setState({residenceList:residenceList});
	})
  }

  checkForm(){
	const {
	  
	} = this.state;

	return true;
  }
  addVoteBtnClick = () => {
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
			
		    <TextareaItem
		  	  placeholder = '请输入您的投诉内容'
		  	  rows='8'
		  	  autoHeight
		      value={this.state.content}
		      onChange={content => this.setState({ content })}
		    />
		    <List.Item  arrow='horizontal'>添加图片</List.Item>
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
		  	  onClick={this.addVoteBtnClick}
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
export default ComplaintAdd;
