import React, { Component } from 'react';
import { 
	List,
	InputItem,
	Picker,
 } from 'antd-mobile';
 import $ from 'jquery';

let optionList = [];

class InputOptionList extends Component {
  constructor(props) {  
    super(props);  
    this.state = {  
	  id:this.props.id,
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
	  //this.setState({optionList:optionListStr.split(',')})
	  this.props.toParent(optionListStr);
  } 
  optionItemChangeP = (index ,value) => {
	  //index: -1 add, -2 delete
	  if(value[0]){
		optionList[index] = value[0];
	  }else{
		  if(index===-1){
			optionList.push('');
		  }else{
			optionList.splice(index,1);  
		  }
	  }
	  this.props.toParent(optionList.join(','));
  } 


  render() {
	const {optionListStr,isPicker,userList} = this.props; 
	optionList = optionListStr.split(',');
	
    return (
	  <List id={this.state.id}>
		{!isPicker && optionList.map((name,index) => 
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
		{isPicker && optionList.map((name,index) => 
			<div className='optionItemInput' key={index}> 
			  <Picker 
				data={userList} 
				cols={1} 
				value={[name]}
				onChange={(value)=>{this.optionItemChangeP(index,value)}}
			  >
				<List.Item arrow='horizontal'>候选人</List.Item>
			  </Picker>
			  <div className='iconDelete' onClick={this.optionItemChangeP.bind(this,index)}></div>
			</div>
		)}
		
		<div className='optionItemAddButton' style={{display:!isPicker?'none':''}}>
		  <span onClick={this.optionItemChangeP.bind(this,-1)}>添加选项</span>
		  <div className='iconAdd' onClick={this.optionItemChangeP.bind(this,-1)}></div>
		</div>
		<div className='optionItemAddButton' style={{display:isPicker?'none':''}}>
		  <span onClick={this.optionItemChange.bind(this,-1)}>添加选项</span>
		  <div className='iconAdd' onClick={this.optionItemChange.bind(this,-1)}></div>
		</div>
	  </List>
    );
  }
}

export default InputOptionList;
