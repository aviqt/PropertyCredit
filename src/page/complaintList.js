import React, { Component } from 'react';
import { 
	SearchBar,
 } from 'antd-mobile';
import { Link } from 'react-router-dom';
import TopNavBar from './components/topNavBar';
import Footer from './components/footer';
import ListView from './components/listView';
import {selFunc} from '../utils/func';


class ComplaintList extends Component {
  constructor(props) {  
    super(props);  
	let isManage = props.match.params.isManage === '1' ? true : false;
    this.state = { 
	  keyWords:'',
  	  listType:isManage?'ToTransferList':'List',
	  rows:5,
	}
  }
  setListType = (value) =>{
    this.setState({
  	  listType:value,
    })
  }

  back(){
	window.postMessage('back');
  }
  render() {
    const {keyWords,rows} = this.state;
    let {listType} = this.state;
	let isManage = this.props.match.params.isManage === '1' ? true : false;
	let url = sessionStorage.apiUrl + '/api/Complaint/' + listType +'?keyword=' + keyWords + '&pagination.rows=' + rows +'&pagination.page=pageIndex&pagination.sidx=CREATOR_TIME&pagination.sord=DESC';
	//alert(listType)
	const tabList = [
	  {value:'ToTransferList',title:'待转发'},
	  {value:'ToConfirmList',title:'待确认'},
	];
	
	const complaintTypeList = ['','投诉','建议','报修',];
	
    return (
	  <div>
		<TopNavBar showLC back='0' title={isManage?'待办投诉':'我的投诉'}  addPage='/complaint/add'/>
		<div className='mainBox' style={{bottom:0}}>
		  <div className='tabMenu' style = {{display:isManage?'':'none'}}>
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
			style = {{display:'none'}}
			onSubmit={keyWords => {this.setState({keyWords})}}
			onClear={keyWords => {this.setState({keyWords})}}
		  />
		  <ListView
		    style = {{top:isManage?50:0}}
		    className = 'listBox' 
			page = {this}
			url={url}
		    row ={(item,index) => 
		  	  <Link to={{pathname:`/complaint/detail/${item.Id}/${isManage?item.AuditId:0}`}} key={index}>
		  	    <div className='item'>
		  	  	  <strong>{selFunc.renderHeightlightKeyWords(item.Title,keyWords)}</strong>
				  <div className={`status status_${item.ApplyStatus}`}>{item.ApplyStatusStr}</div>
				  <div className='content'>{item.Content}</div>
				  <div className='tags'>
					<span>{item.ResidenceName}</span>
					<span>{complaintTypeList[item.ComplaintType]}</span>
					<span>{selFunc.formatDate(item.CreatorTime,'-')}</span>
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




export default ComplaintList;
