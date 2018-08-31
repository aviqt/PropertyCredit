import React, { Component } from 'react';
import { 
	SearchBar
 } from 'antd-mobile';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import TopNavBar from './components/topNavBar';
import Footer from './components/footer';
import ListView from './components/listView';
import {selFunc} from '../utils/func';


class QualityEvaluationList extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  keyWords:'',
	  rows:10,
	  showType:1,
	  hasToken:!(!sessionStorage.Authorization || sessionStorage.Authorization === 'null' )
	}
  }
  back(){
	window.postMessage('back');
  }
  renderStatus(status){
	switch (status){
	  case 0:
	    return (
		  <div className='tag_1 tag'>
			<span>去评价</span>
		  </div>);
	  case 1:
	    return (
		  <div className='tag_2 tag'>
			<span>已评价</span>
		  </div>);
	  case 2:
	    return (
		  <div className='tag_3 tag'>
			<span>已结束</span>
		  </div>);
	  default:
		return '';
	}
  }
  render() {
    const {keyWords,rows,showType} = this.state;
	let url = sessionStorage.apiUrl + '/api/Evaluation/EvaluationList?isvoted&keyword=' + keyWords + '&pagination.rows=' + rows +'&pagination.page=pageIndex&pagination.sidx=CREATOR_TIME&pagination.sord=DESC';
    return (
	  <div>
		<TopNavBar showLC back='0' title='质量评价' addPage1='/qualityEvaluation/add' />
		<div className='mainBox' style={{bottom:0}}>

		  <ListView
		    className = 'listBox' 
			page = {this}
			url={url}
		    row ={(item,index) => 
		  	  <Link to={`/qualityEvaluation/detail/${item.ProjectId}`} key={index}>
		  	    <div key={index} className='imageContentItem' style={{borderBottom:'12px solid #efefef'}}>
		  	  	  <div className='content'>
					<strong>{selFunc.renderHeightlightKeyWords(item.Title,keyWords)}</strong>
					<span>{item.Content}</span>
					<div className='line'></div>
					<span>{selFunc.formatDate(item.CreatorTime,'-')}</span>
					{this.renderStatus(item.Status)}
				  </div>
		  	    </div>
		  	  </Link>
			}
		  />
		</div>
      </div>
    );
  }
}




export default QualityEvaluationList;
