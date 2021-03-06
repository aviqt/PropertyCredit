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
import {del,get} from '../utils/request';
import { Modal } from 'antd';
const confirm = Modal.confirm;






class BindAreaInfo extends Component { 
 constructor(props) {  
    super(props);  
    this.state = { 
	  id:props.match.params.id,
	  Residence:[],
	  UnitNo:'',
	  BuildingNo:'',
	}
  }
  
  componentDidMount(){
	this.getAreaInfo();
  }
  getAreaInfo = () => {
	//console.log(communityCode[0]);
	get(sessionStorage.apiUrl + '/api/Residence/UserResidenceInfo?Id=' + this.state.id,this)
    .then(res => {
	  console.log(res.Data)
	  this.setState({
		Residence:res.Data
	  });

	})
  }


  render() {
	const {Residence} = this.state;
    return (
	  <div>
		<TopNavBar title='小区信息'/>
		<div className='formBox peronalInfoForm' >
		  <List>

			<InputItem
			  disabled
		      value={Residence.ResidenceName}
		    >小区名称</InputItem>
			<InputItem
			  disabled
		      value={Residence.ResidenceName}
		    >身份</InputItem>
		   
			
			<div style={{overflow:'hidden'}} className='unitRoomNum'>
			  <div style={{width:'65%',float:'left'}}>
			    <InputItem
			      disabled
			      extra='单元 -'
		  	      placeholder = ''
				  type='number'
				  maxLength='4'
		          value={Residence.BuildingNo}
		        >单元户号</InputItem>
			  </div>
			  <div style={{width:'35%',float:'left'}}>
			    <InputItem
			      disabled
				  className='roomNum'
			      extra='户号'
		  	      placeholder = ''
				  type='number'
				  maxLength='4'
		          value={Residence.FamilyNo}
		        />
			  </div>
			</div>
		  </List>
	      <div className='operationBtns'>
		     <WingBlank>
		       <WhiteSpace size='md' />
		       <Link to='/personalInfo' className='am-button'><span>返回</span></Link>
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
export default BindAreaInfo;
