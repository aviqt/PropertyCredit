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
import { Link,Redirect  } from 'react-router-dom';
import {get,post} from '../utils/request';
import ImgUpload from './components/imgUpload';
import {selFunc} from '../utils/func';

const CheckboxItem = Checkbox.CheckboxItem;



class CreditBuildAdd extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  addLoading:false,
	  clicked:'none',
	  submitSuccess:false,
	  residenceList:[],
	  type:props.match.params.type,
	  
	  title:'',
	  content:'',
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

  checkForm(){
	const {
	  title,
	  content,
	  selectedRes,
	  FileIds
	} = this.state;
	if(title.replace(/\s+/g,'').length <= 0){
	  Toast.fail("请输入标题.");
	  return false;
	}
	let data = {
	  Title:title,
	  Description:content,
	  ResidenceId:selectedRes[0],
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
	const {type} = this.state;
	//return false;
	let url = sessionStorage.apiUrl + (type === '1'?'/api/Credit/GoodFaith':'/api/Credit/BreakFaith');
	post(url,data)
	.then(res => {
	  console.log(res);
	  if(res.Message === '操作成功'){
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
	const {type} = this.state;
    return (
	  <div>
		<TopNavBar title={type === '1'?'新增诚信信息':'新增失信信息'} showLC/>
		<div className='formBox' >
		  <List>
		    <Picker 
		      data={this.state.residenceList} 
		  	  cols={1} 
		  	  value={this.state.selectedRes}
		      onChange={selectedRes => this.setState({ selectedRes })}
		      onOk={selectedRes => this.setState({ selectedRes })}
			  
		    >
              <List.Item arrow='horizontal'>选择小区</List.Item>
            </Picker>
			<InputItem 
			  placeholder = '标题'
			  style={{fontSize:20}}
		      value={this.state.title}
		      onChange={title => this.setState({ title })}
			/>
		    <TextareaItem
		  	  placeholder = '请输入描述内容'
		  	  rows='8'
		  	  autoHeight
		      value={this.state.content}
		      onChange={content => this.setState({ content })}
		    />
		    <List.Item>添加图片（选填）</List.Item>
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
		      <Link to='/creditBuild/list' className='am-button'><span>取 消</span></Link>
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
export default CreditBuildAdd;
