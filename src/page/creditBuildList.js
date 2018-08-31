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


class CreditBuildList extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  keyWords:'',
	  rows:10,
	  showType:1,
	  hasToken:!(!sessionStorage.Authorization || sessionStorage.Authorization === 'null' )
	}
  }
  setShowType = (value) =>{
    this.setState({
  	  showType:value,
    })
  }
  back(){
	window.postMessage('back');
  }
  handleImageErrored = (defaultImg,e)=>{
	e.target.src = defaultImg;
  }
 
  render() {
	  
    const {keyWords,rows,showType} = this.state;
	let imgSrcPreUrl = sessionStorage.fileUrl + '/File/DownloadFile?iszip=false&fileids=';
	let url = sessionStorage.apiUrl + '/api/Credit/' + (showType === 1?'GoodFaithList':'GetBreakFaithList') + '?pagination.rows=' + rows +'&pagination.page=pageIndex&pagination.sidx=CREATOR_TIME&pagination.sord=DESC';
	const tabList = [
	  {value:1,title:'诚信榜'},
	  {value:2,title:'失信榜'},
	];
	
	
    return (
	  <div>
	    <TopNavBar showLC back='0' title='诚信建设' addPage={`/creditBuild/add/${showType}`} />
		<div className='mainBox' style={{bottom:0}}>
		  <div className='tabMenu'>
		    {tabList.map(item =>
			  <div key={item.value} onClick={this.setShowType.bind(this,item.value)}>
			    <span className={item.value === showType?'tabActive':''}>
				  {item.title}
				</span>
			  </div>
			)}
		  </div>
		  <SearchBar
		    style = {{display:'none'}}
		    clear={false}
			placeholder='请输入标题'
			onSubmit={keyWords => {this.setState({keyWords})}}
			onClear={keyWords => {this.setState({keyWords})}}
		  />
		  <ListView
		    style = {{top:50}}
		    className = 'listBox' 
			page = {this}
			url={url}
		    row ={(item,index) => 
		  	  <Link to={`/creditBuild/detail/${item.Id}`} key={index}>
		  	    <div className='imageContentItem'>
		  	  	  <div className='image'>
					<img 
					  src={ 
					    item.FileIds && eval(item.FileIds).length !== 0 
					    ?(imgSrcPreUrl + eval(item.FileIds)[0].fileid)  
						:require('../images/ic-default.png')
					  }
					  alt={index}
					  onError={selFunc.handleImageErrored.bind(this,require('../images/ic-default.png'))}
					/>
				  </div>
		  	  	  <div className={'content creditBuild '+(showType == 1?'credibility':'discredit')}>
					<strong>{selFunc.renderHeightlightKeyWords(item.Title,keyWords)}</strong>
					<span style={{height:40,overflow:'hidden'}}>{item.Description}</span>
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




export default CreditBuildList;
