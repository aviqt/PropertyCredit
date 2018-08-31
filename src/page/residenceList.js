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
import {get} from '../utils/request';
import {selIcon} from '../utils/config';



class ResidenceList extends Component { 
 constructor(props) {  
    super(props);  
    this.state = { 
	  ResidenceList:[],
	}
  }
  
  componentDidMount(){
	this.getAreaList();
  }
  getAreaList = () => {
	//console.log(communityCode[0]);
	let url = sessionStorage.apiUrl + '/api/Residence/UserResidenceList';
	get(url)
    .then(res => {
	  console.log(res.Data)
	  this.setState({
		ResidenceList:res.Data
	  });

	})
  }


  render() {
	const {ResidenceList} = this.state;
    return (
	  <div>
		<TopNavBar showLC title='小区列表'/>
		<div className='formBox'  style={{backgroundColor:'#efefef'}}>
		  <div className='cardList'>
		    {ResidenceList.map((item,index) =>(
		  	  <div className='item' key={index}>
			    <div className='img'>
				  <img src={selIcon.residence} alt='1'/>
				</div>
			    <div className='content'>
		  	      <strong>{item.ResidenceName}</strong>
		  	      <div> 
				    <img src={selIcon.user} alt='1'/>
					{item.RoleName}
				  </div>
		  	      <div>
				    <img src={selIcon.build} alt='1'/>
				    {item.BuildingNo}单元{item.FamilyNo}号
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
