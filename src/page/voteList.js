import React, { Component } from 'react';
import { 
	SearchBar
 } from 'antd-mobile';
import { Link } from 'react-router-dom';
import TopNavBar from './components/topNavBar';
import Footer from './components/footer';
import ListView from './components/listView';

import {Button} from 'antd';

class VoteList extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  keyWords:'',
	  rows:10,
	  showVoted:1,
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
  render() {
    const {keyWords,rows,showVoted} = this.state;
	let url = '/api/Vote/ParticipationVoteProjectList?isvoted=' + showVoted + '&keyword=' + keyWords + '&pagination.rows=' + rows +'&pagination.page=pageIndex&pagination.sidx=CREATOR_TIME&pagination.sord=DESC';
	const tabList = [
	  {value:1,title:'待投表决'},
	  {value:2,title:'已投表决'},
	];
    return (
	  <div>
		<TopNavBar title='投票表决' showRC/>
		<div className='mainBox'>
		  <div className='tabMenu'>
		    {tabList.map(item =>
			  <div key={item.value} onClick = {this.setShowVoted.bind(this,item.value)}>
			    <span className={item.value === this.state.showVoted?'tabActive':''}>
				  {item.title}
				</span>
			  </div>
			)}
		  </div>
		  <SearchBar
			placeholder='投票标题、发起人'
			onSubmit={keyWords => {this.setState({keyWords})}}
			onClear={keyWords => {this.setState({keyWords})}}
		  />
		  <ListView
		    style = {{top:100}}
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
		<Footer pageIndex={2}/>
      </div>
    );
  }
}




export default VoteList;
