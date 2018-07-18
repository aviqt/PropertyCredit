import React, { Component } from 'react';
import { 
	SearchBar
 } from 'antd-mobile';
import { Link } from 'react-router-dom';
import TopNavBar from './components/topNavBar';
import Footer from './components/footer';
import ListView from './components/listView';


const nowTimeStamp = Date.now();


const publicityList = [
	{project:'东晟府物业服务项目',company:'腾讯科技（北京）有限公司',unit:'宁波住建委',date:nowTimeStamp,score:2,isCompany:true,title:'获得区县市物业行政主管部门表彰'},
	{project:'东晟府物业服务项目',company:'腾讯科技（北京）有限公司',unit:'宁波住建委',date:nowTimeStamp,score:-2,isCompany:true,title:'获得区县市物业行政主管部门批评'},
	{project:'东晟府物业服务项目',company:'腾讯科技（北京）有限公司',unit:'宁波住建委',date:nowTimeStamp,score:2,isCompany:true,title:'获得区县市物业行政主管部门表彰'},
	{project:'东晟府物业服务项目',company:'腾讯科技（北京）有限公司',unit:'宁波住建委',date:nowTimeStamp,score:-2,isCompany:true,title:'获得区县市物业行政主管部门批评'},
	{project:'东晟府物业服务项目',company:'腾讯科技（北京）有限公司',unit:'宁波住建委',date:nowTimeStamp,score:2,isCompany:true,title:'获得区县市物业行政主管部门表彰'},
	{project:'东晟府物业服务项目',company:'腾讯科技（北京）有限公司',unit:'宁波住建委',date:nowTimeStamp,score:-2,isCompany:true,title:'获得区县市物业行政主管部门批评'},
	{project:'东晟府物业服务项目',company:'腾讯科技（北京）有限公司',unit:'宁波住建委',date:nowTimeStamp,score:2,isCompany:true,title:'获得区县市物业行政主管部门表彰'},
	{project:'东晟府物业服务项目',company:'腾讯科技（北京）有限公司',unit:'宁波住建委',date:nowTimeStamp,score:-2,isCompany:true,title:'获得区县市物业行政主管部门批评'},
	{project:'东晟府物业服务项目',company:'腾讯科技（北京）有限公司',unit:'宁波住建委',date:nowTimeStamp,score:2,isCompany:true,title:'获得区县市物业行政主管部门表彰'},
	{project:'东晟府物业服务项目',company:'腾讯科技（北京）有限公司',unit:'宁波住建委',date:nowTimeStamp,score:-2,isCompany:true,title:'获得区县市物业行政主管部门批评'},
	{project:'东晟府物业服务项目',company:'腾讯科技（北京）有限公司',unit:'宁波住建委',date:nowTimeStamp,score:2,isCompany:true,title:'获得区县市物业行政主管部门表彰'},
	{project:'东晟府物业服务项目',company:'腾讯科技（北京）有限公司',unit:'宁波住建委',date:nowTimeStamp,score:-2,isCompany:true,title:'获得区县市物业行政主管部门批评'},
];

const tabList = [
	{value:false,title:'业绩信息'},
	{value:true,title:'不良信息'},
];



class PublicityList extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  keyWords:'',
	  isHarmful:false,
	  publicityList:publicityList,
	}
  }
  componentDidMount() {
	
  }

  setisHarmful = (value) =>{
    this.setState({
  	  isHarmful:value,
    })
  }
  formatDate(timeStamp,str){
	let date = new Date(timeStamp);
	return (
	  date.getFullYear() + '年' + 
	  (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '月' + 
	  (date.getDate() > 9 ? date.getDate() :'0' + date.getDate()) + '日' 
	);
  }
  renderHeightlightKeyWords(text,keyWords){
	return keyWords === '' ? text : text.split(keyWords).map((item,index) => {
	  return index === 0 ? item : <font key={'HeightlightKeyWords' + index}><font style={{color:'red'}}>{keyWords}</font>{item}</font>;
    })
  }
  render() {
    const {keyWords,isHarmful} = this.state;
    return (
	  <div>
		<TopNavBar title='公示信息' showLC />
		<div className='mainBox'>
		  <div className='tabMenu'>
		    {tabList.map(item =>
			  <div key={item.value} onClick = {this.setisHarmful.bind(this,item.value)}>
			    <span className={item.value === isHarmful?'tabActive':''}>
				  {item.title}
				</span>
			  </div>
			)}
		  </div>
		  <SearchBar
			placeholder = '标题'
			value={keyWords}
			onChange={keyWords => {this.setState({keyWords})}}
		  />
		  <ListView
		    style = {{top:100}}
		    className = 'listBox' 
		    data = {this.state.publicityList.filter(item => (item.score < 0) === isHarmful && (item.title.indexOf(keyWords) >= 0 ))}
		    row ={(item,index) => 
		  	  <Link to={'/publicity/detail/'+index} key={'item'+index}>
		  	    <div className='item'>
		  	  	  <strong>{this.renderHeightlightKeyWords(item.title,keyWords)}</strong>
		  	  	  <span style={{width:'70%'}}>企业名称：{item.company}</span>
		  	  	  <span style={{width:'70%'}}>项目名称：{item.project}</span>
		  	  	  <span style={{width:'70%'}}>评价单位：{item.unit}</span>
		  	  	  <span style={{width:'70%'}}>评价日期：{this.formatDate(item.date)}</span>
		  	  	  <div className='circleText' style={{bottom:25,fontSize:16}}>{item.score < 0?item.score:'+' + item.score}</div>
		  	    </div>
		  	  </Link>
			}
		  />
		</div>
		<Footer pageIndex={4}/>
      </div>
    );
  }
}




export default PublicityList;
