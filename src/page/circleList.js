import React, { Component } from 'react';
import { 
	SearchBar
 } from 'antd-mobile';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import TopNavBar from './components/topNavBar';
import Footer from './components/footer';
import ListView from './components/listView';
import ImgList from './components/imgList';
import {selFunc} from '../utils/func';
import {selImg} from '../utils/config';


class CircleList extends Component {
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
  handleImageErrored = (defaultImg,e)=>{
	e.target.src = defaultImg;
  }
 renderImgList = (FileIds) =>  {
	let imgSrcPreUrl = sessionStorage.fileUrl + '/File/DownloadFile?iszip=false&fileids=';
	let imgSrcList = [];
	if(FileIds && eval(FileIds).length !== 0){
	  eval(FileIds).map(item => {
	    let imgSrcItem = [];
	    imgSrcItem.src = imgSrcPreUrl + item.fileid;
	    imgSrcItem.name = item.name;
	    imgSrcList.push(imgSrcItem);
	    return false;
	  });
	}
	return <ImgList imgList={imgSrcList} shieldClick={true}/>;
 }
  render() {
	  
    const {keyWords,rows,showType} = this.state;
	let imgSrcPreUrl = sessionStorage.fileUrl + '/File/DownloadFile?iszip=false&fileids=';
	let url = sessionStorage.apiUrl + '/api/Credit/GoodFaithList?pagination.rows=' + rows +'&pagination.page=pageIndex&pagination.sidx=CREATOR_TIME&pagination.sord=DESC';

	
	
    return (
	  <div>
	    <TopNavBar showLC back='0' title='圈子' addPage={`/creditBuild/add/${showType}`} />
		<div className='mainBox' style={{bottom:0}}>

		  <ListView
		    style = {{top:0}}
		    className = 'circleList' 
			page = {this}
			url={url}
		    row ={(item,index) => 
		  	  <Link to={`/creditBuild/detail/${item.Id}`} key={index}>
		  	    <div className='circleItem'>
				  <div>{selFunc.formatDate(item.CreatorTime,'-')}</div>
				  <div>{item.Description}</div>
				  {this.renderImgList(item.FileIds)}
		  	    </div>
		  	  </Link>
			}
		  />
		</div>
      </div>
    );
  }
}




export default CircleList;
