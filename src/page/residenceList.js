import React, { Component } from 'react';
import { 
	ActionSheet,
	Modal,
 } from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom';
import {get,post,del} from '../utils/request';
import {selIcon} from '../utils/config';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}


class ResidenceList extends Component { 
 timeOutEvent = 0;
 constructor(props) {  
    super(props);  
    this.state = { 
	  ResidenceList:[],
	}
  }
  showActionSheet = (item) => {
    const BUTTONS = [ '选择当前小区', '解除绑定', '取消'];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length - 1,
      destructiveButtonIndex: BUTTONS.length - 2,
      maskClosable: true,
      'data-seed': 'logId',
      wrapProps,
    },
    (buttonIndex) => {
	  //console.log(BUTTONS[buttonIndex]);
	  switch (buttonIndex){
		case 0:
		  alert('设为默认');
		  break;
		case 1:
		  alert(1);
		  break;
	  }
    });
	console.log(item);
  }
  componentDidMount(){
	this.getResidenceList();
  }
  componentWillUnmount(){
	ActionSheet.close();
  }
  getResidenceList = () => {
	//console.log(communityCode[0]);
	let url = sessionStorage.apiUrl + '/api/Residence/UserResidenceList';
	get(url)
    .then(res => {
	  this.setState({
		ResidenceList:res.Data
	  });

	})
  }
  //选择当前小区
  setDefaultResidence = (item) =>  {
	if(item.IsDefault === 1 ) return false;
	let url = sessionStorage.apiUrl + '/api/Residence/SetDefaultResidence?id=' + item.Id;
	post(url).then(res => {
	  this.getResidenceList();
	})
  }
  
  delResidence = (item) => {
	this.timeOutEvent = 0; 
	let text = '确认要解除与' + item.ResidenceName + '的绑定吗？';
	let url = sessionStorage.apiUrl + '/api/Residence/' + item.Id;
	//console.log(url);
	Modal.alert('提示',text,[
	  {text:'否'},
	  {text:'是',onPress: () => {
		del(url).then(res => {
		  this.getResidenceList();
		})
	  }},
	])
  }
  
  
  itemTouchStart = (item) =>{
	this.timeOutEvent = setTimeout(this.delResidence.bind(this,item),500);
  }
  itemTouchMove = () =>{
	clearTimeout(this.timeOutEvent);  
	this.timeOutEvent = 0;  
  }
  itemTouchEnd = () =>{
	clearTimeout(this.timeOutEvent);    
  }
  render() {
	const {ResidenceList} = this.state;
    return (
	  <div>
		<TopNavBar showLC title='小区列表' addPage='/bindArea'/>
		<div className='formBox'  style={{backgroundColor:'#efefef'}}>
		  <div className='cardList'>
		    {ResidenceList.map((item,index) =>(
		  	  <div 
			    className='item' key={index}
			    onClick={this.setDefaultResidence.bind(this,item)}
				onTouchStart={this.itemTouchStart.bind(this,item)}
				onTouchMove={this.itemTouchMove}
				onTouchEnd={this.itemTouchEnd}
			  >
			    <div className='img'>
				  <img src={item.IsDefault === 1 ?selIcon.houseBlue:selIcon.houseGray} alt='1'/>
				</div>
				<div className='rightTopTriangle'><img src={item.IsDefault === 1 ?selIcon.rightTopTriangle:''} /></div>
			    <div className='content'>
		  	      <strong>{item.ResidenceName}</strong>
		  	      <div> 
				    <img src={selIcon.user} alt='1'/>
					{item.RoleName !== null?item.RoleName:<span style={{color:'red'}}>未认证</span>}
				  </div>
		  	      <div>
				    <img src={selIcon.build} alt='1'/>
				    {item.BuildingNo}{item.FamilyNo}号
				  </div>
				</div>
		  	  </div>
		    ))}
		  </div>
		</div>
      </div>
    );
  }
}

export default ResidenceList;
