import React, { Component } from 'react';
import { 
	SearchBar
 } from 'antd-mobile';
import { Link,Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import TopNavBar from './components/topNavBar';
import Footer from './components/footer';
import ListView from './components/listView';
import {selFunc} from '../utils/func';

import {getQueryString,loginToSetToken} from '../utils/func';

class VoteList extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  keyWords:'',
	  rows:10,
	  showVoted:1,
	  hasToken:!(!sessionStorage.Authorization || sessionStorage.Authorization === 'null' )
	}
  }
  setShowVoted = (value) =>{
    this.setState({
  	  showVoted:value,
    })
  }
  back(){
	window.postMessage('back');
  }
  
  modal(Component){
	let body = document.body;
	let showDom = document.createElement("div");
	// 设置基本属性
	showDom.style.position = 'absolute';
	showDom.style.top = '0px';
	showDom.style.left = '0px';
	showDom.style.width = '100%';
	showDom.style.height = '100%';
	showDom.style.backgroundColor = 'rgba(0,0,0,.5)';
	showDom.style.zIndex = 10;
        // 自我删除的方法
	let close = () => {
		ReactDOM.unmountComponentAtNode(showDom);
		body.removeChild(showDom);
	}
	
	showDom.addEventListener("click",close,false); 
	body.appendChild(showDom);
	ReactDOM.render(
		<div className='modal'>aslkdjsaldj</div>,
		showDom
	);
  }
  render() {
    if(getQueryString('router')){
	  return (<Redirect to={getQueryString('router')} />);
    }
    const {keyWords,rows,showVoted} = this.state;
	let url = sessionStorage.apiUrl + '/api/Vote/ParticipationVoteProjectList?isvoted=' + showVoted + '&keyword=' + keyWords + '&pagination.rows=' + rows +'&pagination.page=pageIndex&pagination.sidx=CREATOR_TIME&pagination.sord=DESC';
	const tabList = [
	  {value:1,title:'待投表决'},
	  {value:2,title:'已投表决'},
	];
	
    return (
	  <div>
		<TopNavBar title='投票表决' addPage='/vote/add' />
		<div className='mainBox' style={{bottom:0}}>
		  <div className='tabMenu'>
		    {tabList.map(item =>
			  <div key={item.value} onClick={this.setShowVoted.bind(this,item.value)}>
			    <span className={item.value === this.state.showVoted?'tabActive':''}>
				  {item.title}
				</span>
			  </div>
			)}
		  </div>
		  <SearchBar
		    clear={false}
			placeholder='投票标题'
			onSubmit={keyWords => {this.setState({keyWords})}}
			onClear={keyWords => {this.setState({keyWords})}}
		  />
		  <div className='listBox' style = {{top:100,display:'none'}}>
			<div className='item' onClick={this.modal}>123</div>
		  </div>
		  <ListView
		    style = {{top:100}}
		    className = 'listBox' 
			page = {this}
			url={url}
		    row ={(item,index) => 
		  	  <Link to={{pathname:'/vote/page/' + item.Id ,query:{voted:showVoted === 1}}} key={'vote-item'+index}>
		  	    <div className='item'>
		  	  	  <strong>{selFunc.renderHeightlightKeyWords(item.Title,keyWords)}</strong>
		  	  	  <span>发起人：{item.CreatorName}</span>
		  	  	  <span>&nbsp;</span>
		  	  	  <span>开始日期：{selFunc.formatDate(item.StartTime,'-')}</span>
		  	  	  <span>截止日期：{selFunc.formatDate(item.EndTime,'-')}</span>
		  	    </div>
		  	  </Link>
			}
		  />
		</div>
      </div>
    );
  }
}




export default VoteList;
