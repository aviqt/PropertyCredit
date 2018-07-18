import React, { Component } from 'react';
import { 
	List,
	InputItem
 } from 'antd-mobile';
import TopNavBar from './components/topNavBar';




class PublicityDetail extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  publicityId:props.match.params.publicityId,
	  data:[],
	}
  }componentDidMount(){
    this.getVoteData()
  }
  
  getVoteData(){
	let data = {
	  cause:'评价事由',
	  projectName:'东晟府物业服务项目',
	  company:'浙江申跃信息科技有限公司',
	  projectManager:'李求仙',
	  basis:'记分依据',
	  
	  companyScore:'+2',
	  projectManagerScore:'+2',
	  startDate:'2017年01月01日',
	  endDate:'2018年01月01日',
	  
	  
	  evaluateUnit:'宁波住建委',
	  evaluateDate:'2017年08月01日',
	  
	};
	this.setState({
	  data:data
	})
  }
  render() {
	const {data} = this.state
	  
    return (
	  <div>
		<TopNavBar title='业绩信息' showLC/>
		<List className='formBox disabledInputDetail' style={{bottom:0}}>
		  <InputItem disabled value={data.cause}>评价事由：</InputItem>
		  <InputItem disabled value={data.projectName}>项目名称：</InputItem>
		  <InputItem disabled value={data.company}>企业名称：</InputItem>
		  <InputItem disabled value={data.projectManager}>项目经理：</InputItem>
		  <InputItem disabled value={data.basis}>记分依据：</InputItem>
		  <div style={{backgroundColor:'#f2f2f2',height:5}}></div>
		  
		  <InputItem disabled value={data.companyScore}  >企业分数：</InputItem>
		  <InputItem disabled value={data.projectManagerScore} labelNumber = {7}>项目经理分数：</InputItem>
		  <InputItem disabled value={data.startDate} labelNumber = {7}>业绩产生时间：</InputItem>
		  <InputItem disabled value={data.endDate}>有效期至：</InputItem>
		  <div style={{backgroundColor:'#f2f2f2',height:5}}></div>
		  
		  <InputItem disabled value={data.evaluateUnit}>评价单位：</InputItem>
		  <InputItem disabled value={data.evaluateDate}>评价时间：</InputItem>

		</List>
		

      </div>
    );
  }
}

export default PublicityDetail;
