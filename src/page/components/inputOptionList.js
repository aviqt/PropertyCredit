import React, { Component } from 'react';
import { 
	List,
	InputItem,
 } from 'antd-mobile';
 import $ from 'jquery';



class InputOptionList extends Component {
  constructor(props) {  
    super(props);  
    this.state = {  
	  id:this.props.id,
	  optionList:this.props.optionListStr.split(','),
	  texts:'d'
	}
  }

  optionItemChange = (index) => {
	  //index: -1 add, -2 delete
	  let optionListStr = '';
	  $("#" + this.state.id + " .optionItemInput").each(function(){
		  if($(this).index()===index)return;
		  optionListStr += $(this).find('input').val() + ',';
	  });
	  if(index!==-1)optionListStr = optionListStr.substring(0,optionListStr.length-1);
	  this.setState({optionList:optionListStr.split(',')})
	  this.props.toParent(optionListStr);
  } 


  render() {
    return (
	  <List id={this.state.id}>
		{this.state.optionList.map((name,index) => 
			<div className='optionItemInput' key={this.state.id + index}>
			  <InputItem
				placeholder='请输入'
				value={name}
				key={index}
				onChange={this.optionItemChange.bind(this,-2)}
			  >候选选项</InputItem>
			  <div className='iconDelete' onClick={this.optionItemChange.bind(this,index)}></div>
			</div>
		)}
		<div className='optionItemAddButton'>
		  <span onClick={this.optionItemChange.bind(this,-1)}>添加选项</span>
		  <div className='iconAdd' onClick={this.optionItemChange.bind(this,-1)}></div>
		</div>
	  </List>
    );
  }
}

export default InputOptionList;
