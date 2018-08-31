import React, { Component } from 'react';
import { 
	SearchBar
 } from 'antd-mobile';
import { Link } from 'react-router-dom';
import TopNavBar from './components/topNavBar';
import Footer from './components/footer';
import ListView from './components/listView';
import {get} from '../utils/request';
import {loginToSetToken} from '../utils/func';


class VoteListAll extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  keyWords:'',
	  rows:10,
	}
  }
  setShowVoted = (value) =>{
    this.setState({
  	  showVoted:value,
    })
  }
  formatDate(timeStamp,str){
	timeStamp = timeStamp === null?Date.now():timeStamp;
	let date = new Date(timeStamp);
	return [
	  date.getFullYear(),
	  (date.getMonth() + 1) > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1),
	  date.getDate() > 9 ? date.getDate() :'0' + date.getDate()
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
	  
    const {keyWords,rows,showVoted} = this.state;
	let url = sessionStorage.apiUrl + '/api/Vote/VoteProjectAllList?keyword=' + keyWords + '&pagination.rows=' + rows +'&pagination.page=pageIndex&pagination.sidx=CREATOR_TIME&pagination.sord=DESC';

    return (
	  <div>
		<TopNavBar showLC back='0' title='投票广场' />
		<div className='mainBox' style={{bottom:0}}>
		  <SearchBar
		    clear={false}
			placeholder='投票标题'
			onSubmit={keyWords => {this.setState({keyWords})}}
			onClear={keyWords => {this.setState({keyWords})}}
		  />
		  <ListView
		    style = {{top:50}}
		    className = 'listBox' 
			page = {this}
			url={url}
		    row ={(item,index) => 
		  	  <Link to={{pathname:'/vote/page/' + item.Id ,query:{voted:showVoted === 1}}} key={'vote-item'+index}>
		  	    <div className='item'>
		  	  	  <strong>{this.renderHeightlightKeyWords(item.Title,keyWords)}</strong>
		  	  	  <span>发起人：{item.CreatorName}</span>
		  	  	  <span>&nbsp;</span>
		  	  	  <span>开始日期：{this.formatDate(item.StartTime,'-')}</span>
		  	  	  <span>截止日期：{this.formatDate(item.EndTime,'-')}</span>
		  	    </div>
		  	  </Link>
			}
		  />
		</div>
      </div>
    );
  }
}




export default VoteListAll;
