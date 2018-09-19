import React, { Component } from 'react';
import { Icon,Toast } from 'antd-mobile';


class CheckList extends Component{
  constructor(props) {  
    super(props);  
    this.state = { 
	}
  }
  itemClick = (index) => {
	let {checkList,maximum,selectable} = this.props;
	if(!selectable) return false;
	if(maximum <= 1){
	  checkList.map((item) => {
	  	item.selected = false;
	  	return false;
	  })
	  checkList[index].selected = true;
	}else{
	  checkList[index].selected = !checkList[index].selected;
	  if(checkList.filter(item => item.selected === true).length > maximum){
	    Toast.info('本题最多可以选择'+maximum+'项');
	    checkList[index].selected = !checkList[index].selected;
	  }
	}
	this.props.toParent(checkList);
	return false;
  }
  render(){
    const {checkList} = this.props;
    return (
  	  <div >
        {checkList.map((item,index) => 
          <div key={'item'+index} style={style.item} onClick={this.itemClick.bind(this,index)}>
  	      {item.Content}
  		  <span style={item.selected?style.spanActive:style.span}>
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
	lineHeight:"30px",
	position:'relative'
  },
  span:{
  	position:"absolute",
	left:10,
	top:15,
	height:20,
	width:20,
	display:'block',
	borderRadius:'50%',
	border:'1px solid #ddd'
  },
  spanActive:{
  	position:"absolute",
	left:10,
	top:16,
	height:20,
	width:20,
	display:'block',
	borderRadius:'50%',
  },
}
export default CheckList;
