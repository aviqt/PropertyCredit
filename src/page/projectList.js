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
	{area:'镇海区',date:nowTimeStamp,state:'管理中',title:'东晟府物业服务项目'},
	{area:'镇海区',date:nowTimeStamp,state:'管理中',title:'东晟府物业服务项目'},
	{area:'镇海区',date:nowTimeStamp,state:'管理中',title:'东晟府物业服务项目'},
	{area:'镇海区',date:nowTimeStamp,state:'管理中',title:'东晟府物业服务项目'},
	{area:'镇海区',date:nowTimeStamp,state:'管理中',title:'东晟府物业服务项目'},
	{area:'镇海区',date:nowTimeStamp,state:'管理中',title:'东晟府物业服务项目'},
	{area:'镇海区',date:nowTimeStamp,state:'管理中',title:'东晟府物业服务项目'},
	{area:'镇海区',date:nowTimeStamp,state:'管理中',title:'东晟府物业服务项目'},
];





class ProjectList extends Component {
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
    const {keyWords} = this.state;
    return (
	  <div>
		<TopNavBar title='项目信息' showLC/>
		<div className='mainBox'>
		  <SearchBar
			placeholder = '项目名称'
			value={keyWords}
			onChange={keyWords => {this.setState({keyWords})}}
		  />
		  <ListView
		    style = {{top:50}}
		    className = 'listBox' 
		    data = {this.state.projectList.filter(item => item.title.indexOf(keyWords) >= 0 )}
		    row ={(item,index) => 
		  	  <Link to={'/project/detail/'+index} key={'item'+index}>
		  	    <div className='item'>
		  	  	  <strong>{this.renderHeightlightKeyWords(item.title,keyWords)}</strong>
		  	  	  <span style={{width:'70%'}}>县市（区）：{item.area}</span>
		  	  	  <span style={{width:'70%'}}>建造年份：{this.formatDate(item.date)}</span>
		  	  	  <div className='circleText'>{item.state}</div>
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




export default ProjectList;
