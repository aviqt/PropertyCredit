import React, { Component } from 'react';
import { 
	List,
	Button,
	InputItem,
	WingBlank,
	ImagePicker,
	Picker,
	WhiteSpace
 } from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom'




const userTypes = [
	{value:'业主',label:'业主',children:[]},
	{value:'租客',label:'租客',children:[]},
  ];
const areas = [
	{value:'浙江省',label:'浙江省',children:[
	  {value:'宁波市',label:'宁波市',children:[
	  	{value:'海曙区',label:'海曙区',children:[]},
	  	{value:'江北区',label:'江北区',children:[]},
	  ]},
	  {value:'杭州市',label:'杭州市',children:[
	  	{value:'上城区',label:'上城区',children:[]},
	  ]},
	]},
	{value:'安徽省',label:'安徽省',children:[]},
  ];


class BindArea extends Component { 
 constructor(props) {  
    super(props);  
    this.state = { 
	  name:'',
	  unitNumber:'',
	  roomNumber:'',
	  userType:['业主'],
	  areaValue:['浙江省','宁波市','海曙区'],
	  address:'',
	  certificateNumber:'',
	  certificatePhotos:[],
	}
  }
  
  componentDidMount(){
    
  }
  

  onSubmit = () =>{
	console.log(this.state.areaValue.join(','));
  }
  imagePickerChange = (files,type,index) =>{
	  //console.log(files);
	  this.setState({
		  certificatePhotos:files
	  })
  }
  render() {
    return (
	  <div>
		<TopNavBar showLC title='绑定小区'/>
		<div className='formBox peronalInfoForm' >
		  <List>
		    <InputItem
		  	  placeholder = '请输入'
		      value={this.state.name}
		      onChange={name => this.setState({ name })}
		    >小区名称</InputItem>
			<div style={{overflow:'hidden'}} className='unitRoomNum'>
			  <div style={{width:'65%',float:'left'}}>
			    <InputItem
			      extra='单元 -'
		  	      placeholder = ''
				  maxLength='4'
		          value={this.state.unitNumber}
		          onChange={unitNumber => this.setState({ unitNumber })}
		        >单元户号</InputItem>
			  </div>
			  <div style={{width:'35%',float:'left'}}>
			    <InputItem
				  className='roomNum'
			      extra='户号'
		  	      placeholder = ''
				  maxLength='4'
		          value={this.state.roomNumber}
		          onChange={roomNumber => this.setState({ roomNumber })}
		        />
			  </div>
			</div>
		    <Picker 
			  data={userTypes} 
			  cols={1} 
			  value={this.state.userType}
			  onOk={userType => this.setState({ userType })}
			>
			  <List.Item  arrow='horizontal'>身份类型</List.Item>
			</Picker>
		    <Picker 
			  data={areas} 
			  cols={3} 
			  value={this.state.areaValue}
			  onOk={areaValue => this.setState({ areaValue })}
			>
			  <List.Item  arrow='horizontal'>位置信息</List.Item>
			</Picker>
		    <InputItem
		  	  placeholder = '请输入(非必填)'
		      value={this.state.certificateNumber}
		      onChange={certificateNumber => this.setState({ certificateNumber })}
		    >产权证号</InputItem>
		    <List>
			  <List.Item >产权证书</List.Item>
		      <ImagePicker 
		        files={this.state.certificatePhotos}
		        onChange={this.imagePickerChange}
		        multiple={true}
			    style={{paddingBottom:5}}
		      />
		    </List>
		  </List>
		</div>
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
