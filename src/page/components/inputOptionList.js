import React, { Component } from 'react';
import { 
	List,
	InputItem,
	Picker,
 } from 'antd-mobile';



class InputOptionList extends Component {
  constructor(props) {  
    super(props);  
    this.state = {  
	}
  }
  optionItemChange = (index ,value) => {
    //index: -1 add
	const {optionListStr} = this.props; 
	let optionList = optionListStr.split(',');
    if(value[0] !== undefined){
  	  optionList[index] = value[0];
    }else{
  	  if(index === -1){
  		optionList.push('');
  	  }else{
  		optionList.splice(index,1);  
  	  }
    }
    this.props.toParent(optionList.join(','));
  } 
  render() {
	const {optionListStr,isPicker,userList} = this.props; 
	let optionList = optionListStr.split(',');
	
    return (
	  <div>
		{!isPicker && optionList.map((name,index) => 
			<div className='optionItemInput' key={index}>
			  <InputItem
				placeholder='请输入'
				value={name}
				key={index}
				onChange={(value)=>{this.optionItemChange(index,[value])}}
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
				onChange={(value)=>{this.optionItemChange(index,value)}}
			  >
				<List.Item arrow='horizontal'>候选人</List.Item>
			  </Picker>
			  <div className='iconDelete' onClick={this.optionItemChange.bind(this,index)}></div>
			</div>
		)}
		<div className='optionItemAddButton'>
		  <span onClick={this.optionItemChange.bind(this,-1)}>{isPicker?'+ 添加候选人':'+ 添加选项'}</span>
		</div>
	  </div>
    );
  }
}

export default InputOptionList;
