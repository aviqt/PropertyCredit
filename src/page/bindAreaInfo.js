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
		UnitNo:res.Data.UnitNo,
		BuildingNo:res.Data.BuildingNo
	  });
	  let url = 'http://saturn.51vip.biz:81/data-system/api/bigScreen/house/getBasicHouseInfo?id=' + res.Data.ResidenceId;
	  fetch(url,{method:'GET'})
	  .then(res => res.json())
	  .then(res => {
	    //console.log(res.data.pageData[0]);
	    this.setState({Residence:res.data.pageData[0]});
	  })
	})
  }
  onDelete = () => {
	const that = this;
	confirm({
      title: '确定要解除和该小区的绑定么?',
      content: '此操作不可逆！',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        console.log('OK');
		del(sessionStorage.apiUrl + '/api/Residence/' + that.state.id,'',that)
		.then(res => {
		  console.log(res);
          Toast.info('成功解除绑定');
		  that.props.history.push('/personalInfo');
		})
      },
      onCancel() {
        console.log('Cancel');
      },
    });  
	return;
	
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
		      value={Residence.DISTRICT}
		    >区县</InputItem>
			<InputItem
			  disabled
		      value={Residence.STREET}
		    >街道</InputItem>
			<InputItem
			  disabled
		      value={Residence.COMMUNITY}
		    >社区</InputItem>
			<InputItem
			  disabled
		      value={Residence.NAMES}
		    >小区</InputItem>
		   
			
			<div style={{overflow:'hidden'}} className='unitRoomNum'>
			  <div style={{width:'65%',float:'left'}}>
			    <InputItem
			      disabled
			      extra='单元 -'
		  	      placeholder = ''
				  type='number'
				  maxLength='4'
		          value={this.state.UnitNo}
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
		          value={this.state.BuildingNo}
		        />
			  </div>
			</div>
		  </List>
	      <div className='operationBtns'>
		     <WingBlank>
		       <WhiteSpace size='md' />
		       <Button 
		   	    style={style.btn} 
		   	    activeStyle={style.btnActive}
		   	    onClick={this.onDelete}
		   	  >解除绑定</Button>
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
