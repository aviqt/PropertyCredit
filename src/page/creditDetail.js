import React, { Component } from 'react';
import { 
	List,
	InputItem,
	WingBlank,
 } from 'antd-mobile';
import TopNavBar from './components/topNavBar';




class CreditDetail extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  creditId:props.match.params.creditId,
	  data:[],
	}
  }componentDidMount(){
    this.getVoteData()
  }
  
  getVoteData(){
	let data = {
	  evaluateYear:'2017年',
	  creditLv:'AAA',
	  title:'浙江申跃信息科技有限公司',
	  baseScore:60,
	  creditScoreG:40,
	  creditScoreB:-10,
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
		<TopNavBar title='信用信息' showLC/>
		<List className='formBox disabledInputDetail' style={{bottom:0}}>
		
		  <WingBlank style={{fontSize:22,lineHeight:1.4,padding:'10px 0'}}>
		    {data.title}
		  </WingBlank>
		  <WingBlank style={{fontSize:16,lineHeight:2}}>
			评价年份：{data.evaluateYear}
			<span style={{float:'right'}}>信用等级：{data.creditLv}</span>
		  </WingBlank>
		  
		  <div style={{backgroundColor:'#f2f2f2',height:5}}></div>
		  <InputItem disabled value={data.baseScore}>基础信息：</InputItem>
		  <InputItem disabled value={data.creditScoreG}>业绩信息：</InputItem>
		  <InputItem disabled value={data.creditScoreB}>不良信息：</InputItem>
		  
		  <div style={{backgroundColor:'#f2f2f2',height:5}}></div>
		  <InputItem disabled value={data.baseScore + data.creditScoreG + data.creditScoreB}>信用总分：</InputItem>
		  <InputItem disabled value={data.evaluateUnit}>评价单位：</InputItem>
		  <InputItem disabled value={data.evaluateDate}>评价日期：</InputItem>


		</List>
		

      </div>
    );
  }
}

export default CreditDetail;
