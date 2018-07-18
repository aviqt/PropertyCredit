import React, { Component } from 'react';
import { 
	SearchBar
 } from 'antd-mobile';
import { Link } from 'react-router-dom';
import TopNavBar from './components/topNavBar';
import Footer from './components/footer';
import ListView from './components/listView';


const nowTimeStamp = Date.now();


const projectList = [
	{type:'通知公告',creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{type:'装修备案',creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{type:'通知公告',creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{type:'政策法规',creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{type:'通知公告',creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{type:'最新消息',creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{type:'法律案例',creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{type:'通知公告',creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
];
const tabList = [
	{value:'通知公告',title:'通知公告'},
	{value:'最新消息',title:'最新消息'},
	{value:'政策法规',title:'政策法规'},
	{value:'法律案例',title:'法律案例'},
	{value:'装修备案',title:'装修备案'},
];

class NoticeIndustryList extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  keyWords:'',
	  noticeType:'通知公告',
	  projectList:projectList,
	}
  }
  componentDidMount() {
	
  }
  setNoticeType = (value) =>{
    this.setState({
  	  noticeType:value,
    })
  }
  formatDate(timeStamp,str){
	let date = new Date(timeStamp);
	return [
	  date.getFullYear(),
	  date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth(),
	  date.getDate() > 9 ? date.getDate() :'0' + date.getDate()
	].join(str);
  }
  renderHeightlightKeyWords(text,keyWords){
	return keyWords === '' ? text : text.split(keyWords).map((item,index) => {
	  return index === 0 ? item : <font key={'HeightlightKeyWords' + index}><font style={{color:'red'}}>{keyWords}</font>{item}</font>;
    })
  }
  render() {
    const {keyWords,noticeType} = this.state;
    return (
	  <div>
		<TopNavBar title='行业通知' showLC/>
		<div className='mainBox'>
		  <div className='tabMenu'>
		    {tabList.map(item =>
			  <div key={item.value} onClick = {this.setNoticeType.bind(this,item.value)}  style={{width:'20%'}}>
			    <span className={item.value === noticeType?'tabActive':''} style={{padding:'5px 0'}}>
				  {item.title}
				</span>
			  </div>
			)}
		  </div>
		  <SearchBar
			placeholder = '通知标题'
			value={keyWords}
			onChange={keyWords => {this.setState({keyWords})}}
		  />
		  <ListView
		    style = {{top:100}}
		    className = 'listBox' 
		    data = {this.state.projectList.filter(item => item.type === noticeType && item.title.indexOf(keyWords) >= 0 )}
		    row ={(item,index) => 
		  	  <Link to={'/notice/detail/'+index} key={'item'+index}>
		  	    <div className='item'>
		  	  	  <strong>{this.renderHeightlightKeyWords(item.title,keyWords)}</strong>
		  	  	  <span>{this.formatDate(item.date,'-')}</span>
		  	  	  <span style={{textAlign:'right'}}>{item.creator}</span>
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




export default NoticeIndustryList;
