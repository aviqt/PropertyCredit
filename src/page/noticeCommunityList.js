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
	{creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
	{creator:'社区委员会',date:nowTimeStamp,title:'东晟府物业服务项目'},
];


class NoticeCommunityList extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  keyWords:'',
	  projectList:projectList,
	}
  }
  componentDidMount() {
	
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
    const {keyWords} = this.state;
    return (
	  <div>
		<TopNavBar title='小区通知' showLC/>
		<div className='mainBox'>
		  <SearchBar
			placeholder = '通知标题'
			value={keyWords}
			onChange={keyWords => {this.setState({keyWords})}}
		  />
		  <ListView
		    style = {{top:50}}
		    className = 'listBox' 
		    data = {this.state.projectList.filter(item => item.title.indexOf(keyWords) >= 0 )}
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




export default NoticeCommunityList;
