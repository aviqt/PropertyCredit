import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {selFunc} from '../../utils/func';
import PicView from './picView';





class ImgList extends Component {
  constructor(props){
    super(props)
    this.state = {
	}
  }
  render() {
	const {imgList} = this.props;
    let cols = imgList.length >= 3 ? 3 : imgList.length; 
    let imgSizeWidth = (window.innerWidth - 40 - ((cols - 1) * 5) ) / cols ;
    let imgSizeHeight = imgList.length !== 1 ? imgSizeWidth:'auto' ;
    if(cols !== 1)imgSizeWidth = (( 100/cols - (cols-1)/cols ) + '%'); 
    //console.log(imgList);
	if(imgList.length===0) return false;
    return (
  	  <div className='imgList'>
  	    {imgList.map((item,index) => 
  	  	  <div 
  	  	    className='item' 
  	  	    key={index} 
  	  	    onClick={()=>{if(PicView)selFunc.modal(PicView,{imgUrl:item.src})}} 
  	  	    style={{width:imgSizeWidth,height:imgSizeHeight}}
  	  	  >
  	  	  <div style={{width:imgSizeWidth,height:imgSizeHeight}}>
  	  	    <img src={item.src} alt={item.name} />
  	  	  </div>
  	  	  </div>
  	    )}
  	  </div>
    );
  }
}

export default ImgList;
