import React, { Component } from 'react';
import {
	WingBlank,
	Button,
	Carousel,
	NavBar,
	Icon,
	ActivityIndicator,
	WhiteSpace,
	Toast
} from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom';
import {get} from '../utils/request';


class ComplaintDetail extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  complaintId:props.match.params.id,
	  complaint:[],
	  loading:true,
	  imgHeight:1
	}
  }
  componentDidMount(){
    this.getComplaint()
  }

  getComplaint(){
	this.setState({
	  loading:true
	})
	let complaint ={
	  residence:'东晟府小区',
	  content:'这份特殊的汉堡和薯条是亚历山大在2012年6月7日购买的，一直存放在他的货架上，因听说快餐汉堡从不腐烂，便将这份汉堡保存做个测试，并在5年前将一份自制汉堡放在旁边作对比。结果表明，这些说法是正确的。',
	  imgSrcList:[
	    {src:'http://imgs.aixifan.com/o_1cbrsvae053bo0r11arplk15ia1k.jpg',name:'111'},
	    {src:'http://imgs.aixifan.com/o_1cdi1tr211j2312t13r91d41m6e1m.jpg',name:'222'},
	  ],
	  time:'2018-06-01 08:25:00',
	  status:2,
	};
	this.setState({
	  loading:false,
	  complaint
	})
  }

  formatDate(timeStamp,str){
	let date = new Date(timeStamp);
	return [
	  date.getFullYear(),
	  (date.getMonth()+1) > 9 ? (date.getMonth()+1) : '0' + (date.getMonth()+1),
	  (date.getDate() > 9 ? date.getDate() :'0' + date.getDate()) + ' ' + (date.getHours()>9?date.getHours():('0' + date.getHours())) + ':' + (date.getMinutes()>9?date.getMinutes():('0' + date.getMinutes()))
	].join(str);
  }
  renderStatus = status => {
	switch(status){
	  case 1:
	    return( 
		  <div className='processResult'>
			<div className='result'>
			  <img src={require('../icon/good.png')} />
			  已解决
			</div>
			<span>{this.state.complaint.time}</span><br />
			<strong>东晟府小区业委会</strong>确认此投诉已解决
		  </div>
		);
	  case 2:
	    return ( 
		  <div className='processReply'>
			<div style={{color:'#1890ff'}}>
			  <img src={require('../icon/good.png')} />
			  已解决
			</div>
			<div style={{border:'none'}}>
			  <img src={require('../icon/bad.png')} />
			  未解决
			</div>
		  </div>
		);
	  default:
	    return;
	}
  }
  render() {
	const {complaint} = this.state;
	if(this.state.loading){
  	  return (
  	  	<div>loading</div>
  	  )
    }
    return (
	  <div>
		<TopNavBar title='物业投诉' showLC/>
		<div className='formBox' style={{background:'#eeeeee'}}>
		  <div className='complaintDetail'>
	        <div className='residence'>{complaint.residence}</div>
	        <div className='content'> 
	          {complaint.content}
	        </div>
		    <Carousel autoplay={false} infinite>
		      {complaint.imgSrcList && complaint.imgSrcList.map(val =>
		  	  <img 
		  	    key={val.src}
		  	    src={val.src} 
		  	    alt={complaint.imgSrc} 
		  	    style={{height:this.state.imgHeight,width:'100%'}}
		  		onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'));
                    this.setState({ imgHeight: 'auto' });
                  }}
		  	  />
		      )}
		    </Carousel>
	        <div className='time'>
	          {this.formatDate(complaint.time,'-')}
	        </div>
		  </div>
		  {this.renderStatus(complaint.status)}
		</div>
      </div>
    );
  }
}

export default ComplaintDetail;
