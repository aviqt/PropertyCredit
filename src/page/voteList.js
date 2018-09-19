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
import {selImg} from '../utils/config';
import {get} from '../utils/request';

import {getQueryString} from '../utils/func';

class VoteList extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  keyWords:'',
	  rows:10,
	  showVoted:1,
	  voteTypeList:[],
	  hasToken:!(!sessionStorage.Authorization || sessionStorage.Authorization === 'null' ),
	  isHA:false
	}
  }
  setShowVoted = (value) =>{
    this.setState({
  	  showVoted:value,
    })
  }
  //投票类型
  getVoteTypeList= ()=> {
	let url = sessionStorage.apiUrl + '/api/ItemData/List?enCode=VoteBusiness';
	let voteTypeList = [];
	get(url).then(res => {
	  res.Data && res.Data.map(item => {
	    let typeOption = [];
	    typeOption.value = item.code;
	    typeOption.label = item.text;
	    voteTypeList.push(typeOption);
	    return false;
	  })
	  this.setState({
		voteTypeList,
	    type:[voteTypeList[0].value],
	  })
	})
  }
  back(){
	window.postMessage('back');
  }
  componentDidMount(){
	this.isHomeownersAssociation();
	this.getVoteTypeList();
  }
  //是否显示添加投票按钮
  isHomeownersAssociation = ()=> {
	let url = sessionStorage.apiUrl + '/api/Residence/UserResidenceList';
	get(url).then(res => {
	  let isHA = true && (res.Data.filter(item => item.RoleName === '业委会成员').length > 0);
	  this.setState({isHA});
	})
  }
  render() {
    if(getQueryString('router')){
	  return (<Redirect to={getQueryString('router')} />);
    }
    const {keyWords,rows,showVoted,isHA,voteTypeList} = this.state;
	let url = sessionStorage.apiUrl + '/api/Vote/ParticipationVoteProjectList?isvoted=' + showVoted + '&keyword=' + keyWords + '&pagination.rows=' + rows +'&pagination.page=pageIndex&pagination.sidx=CREATOR_TIME&pagination.sord=DESC';
	let imgSrcPreUrl = sessionStorage.fileUrl + '/File/DownloadFile?iszip=false&fileids=';
	
	const tabList = [
	  {value:1,title:'未投票'},
	  {value:2,title:'已投票'},
	];
	if(voteTypeList.length <= 0) return false;
	//console.log(voteTypeList.filter(itemX => itemX.value == 3));
    return (
	  <div>
		<TopNavBar title='投票表决' addPage={isHA?'/vote/add':''} />
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
		  <ListView
		    style = {{top:100}}
		    className = 'VoteList' 
			page = {this}
			url={url}
		    row ={(item,index) => 
		  	  <Link to={{pathname:'/vote/page/' + item.Id ,query:{voted:showVoted === 1}}} key={'vote-item'+index}>
		  	    <div className='item'>
		  	  	  <strong>{selFunc.renderHeightlightKeyWords(item.Title,keyWords)}</strong>
				  <div className='img'>
				    <img 
					  src={ 
					    item.FileIds && item.FileIds !== '[]'  
					    ? (imgSrcPreUrl+JSON.parse(item.FileIds)[0].fileid)
						: selImg.defaultImg 
					  } 
					/>
				  </div>
				  <div className='info'>
				    <span style={{color:'#fea723'}}>{item.CreatorName}</span>
		  	  	    <span>开始日期：{selFunc.formatDate(item.StartTime,'-')}</span>
		  	  	    <span>截止日期：{selFunc.formatDate(item.EndTime,'-')}</span>
				  </div>
				  <div 
				    className={'status status_' + (item.StatusStr === '已结束' ?'0':'1')}
					style={{display:showVoted===2?'none':''}}
				  >{item.StatusStr}</div>
				  <div className={'type type_' + item.VoteBusiness}>{voteTypeList.filter(itemX => itemX.value == item.VoteBusiness)[0].label}</div>
				  
		  	  	  <div className='isgiveup' style={{display:item.Isgiveup === '已弃票'?'':'none'}}><img src={selImg.isgiveup} /></div>
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
