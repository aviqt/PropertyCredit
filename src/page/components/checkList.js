import React, { Component } from 'react';
import { Icon } from 'antd-mobile';


class CheckList extends Component{
  constructor(props) {  
    super(props);  
    this.state = { 
	  checkList:this.props.shortList,
	  maximum:this.props.maximum,
	}
  }

  itemClick = (index) => {
	const {checkList,maximum} = this.state;
	if(maximum <= 1){
	  checkList.map((item) => {
	  	item.selected =false;
	  	return false;
	  })
	  checkList[index].selected = true;
	}else{
	  checkList[index].selected = !checkList[index].selected;
	}
	this.props.toParent(checkList);
	return false;
  }
  render(){
    const {checkList} = this.state;
    return (
  	  <div >
        {checkList.map((item,index) => 
          <div key={'item'+index} style={item.selected?style.itemActive:style.item} onClick={this.itemClick.bind(this,index)}>
  	      {item.name}
  		  <span style={style.span}>
  			{item.selected?<Icon type='check-circle' color="#0cbc0a" />:''}
  		  </span>
          </div>
        )}
      </div>
    );
  }
}

const style ={
  item:{
  	backgroundColor:"white",
  	fontSize:18,
	padding:10,
	paddingLeft:40,
	margin:"10px 0 0 0",
	lineHeight:"30px",
	position:'relative'
  },
  itemActive:{
  	backgroundColor:"white",
  	border:"1px solid #0cbc0a",
  	fontSize:18,
	padding:10,
	paddingLeft:40,
	margin:"10px 0 0 0",
	lineHeight:"28px",
	position:'relative'
  },
  span:{
  	position:"absolute",
	left:10,
	top:14,
	height:20,
	width:20,
	display:'block',
	borderRadius:'50%',
	border:'1px solid #ddd'
  },
}
export default CheckList;
