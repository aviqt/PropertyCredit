import React, { Component } from 'react';
import { 
	SearchBar
 } from 'antd-mobile';
import { Link } from 'react-router-dom';
import TopNavBar from './components/topNavBar';
import Footer from './components/footer';
import ListView from './components/listView';
import {get} from '../utils/request';


class ComplaintList extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  keyWords:'',
  	  listType:'List',
	  rows:10,
	}
  }
  setListType = (value) =>{
    this.setState({
  	  listType:value,
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
  renderHeightlightKeyWords(text,keyWords){
	if(!text) return <font>&nbsp;</font>;
	return keyWords === '' ? text : text.split(keyWords).map((item,index) => {
	  return index === 0 ? item : <font key={'HeightlightKeyWords' + index}><font style={{color:'red'}}>{keyWords}</font>{item}</font>;
    })
  }
  back(){
	window.postMessage('back');
  }
  render() {
    const {keyWords,rows,listType} = this.state;
	let url = sessionStorage.apiUrl + '/api/Complaint/' + listType +'?keyword=' + keyWords + '&pagination.rows=' + rows +'&pagination.page=pageIndex&pagination.sidx=CREATOR_TIME&pagination.sord=DESC';

	const tabList = [
	  {value:'List',title:'我的投诉'},
	  {value:'TodoList',title:'投诉确认'},
	];
    return (
	  <div>
		<TopNavBar title='投诉列表'  addPage='/complaint/add'/>
		<div className='mainBox' style={{bottom:0}}>
		  <div className='tabMenu'>
		    {tabList.map(item =>
			  <div key={item.value} onClick={this.setListType.bind(this,item.value)}>
			    <span className={item.value === listType?'tabActive':''}>
				  {item.title}
				</span>
			  </div>
			)}
		  </div>
		  <SearchBar
		    clear={false}
			placeholder='搜索'
			onSubmit={keyWords => {this.setState({keyWords})}}
			onClear={keyWords => {this.setState({keyWords})}}
		  />
		  <ListView
		    style = {{top:100}}
		    className = 'listBox' 
			page = {this}
			url={url}
		    row ={(item,index) => 
		  	  <Link to={{pathname:`/complaint/detail/${item.Id}`}} key={index}>
		  	    <div className='item'>
		  	  	  <strong>{this.renderHeightlightKeyWords(item.ResidenceName,keyWords)}</strong>
				  <div className={`status status_${item.ApplyStatus}`}>{item.ApplyStatusStr}</div>
				  <div className='content'>{item.Content}强制使用 action 来描述所有变化带来的好处是可以清晰地知道应用中到底发生了什么。 </div>
		  	  	  <span>{this.formatDate(item.CreatorTime,'-')}</span>
		  	    </div>
		  	  </Link>
			}
		  />
		</div>
      </div>
    );
  }
}




export default ComplaintList;
