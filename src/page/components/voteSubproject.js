import React, { Component } from 'react';
import { 
	List,
	InputItem,
	Picker,
	Button,
	Switch,
	WingBlank,
 } from 'antd-mobile';
import InputOptionList from './inputOptionList';
import {selImg} from '../../utils/config';

 
class VoteSubproject extends Component {
  constructor(props) {  
    super(props);  
    this.state = {  
	}
  }
  setOptionStr = (index,optionStr) => {
	let {subproject} = this.props; 
	subproject[index].optionStr = optionStr;
	this.props.toParent(subproject);
　}
  setTitle = (index,title) => {
	let {subproject} = this.props; 
	subproject[index].title = title;
	this.props.toParent(subproject);
  }
  addSubproject = () => {
	let {subproject} = this.props; 
	subproject.push({title:'',count:1,optionStr:','})
	this.props.toParent(subproject,subproject.length - 1);
  }
  delSubproject = (index) => {
	let {subproject} = this.props; 
	subproject.splice(index,1);  
	this.props.toParent(subproject);
  }
  render() {
	const {subproject,isPicker,userList} = this.props; 
    return (
	  <div className='voteSubprojectList'>
	    {subproject.map((item,index) => 
		  <div key={index} className='voteSubproject'>
	  	    <InputItem 
			  placeholder='请输入题目'
			  value={item.title}
			  onChange={title => {this.setTitle(index,title)}}
	  	    ></InputItem>
		    <InputOptionList 
		  	  optionListStr={item.optionStr} 
		  	  toParent={this.setOptionStr.bind(this,index)} 
			  isPicker={isPicker}
			  userList={userList}
		    />
			<div onClick={this.props.toParent.bind(this,subproject,index)} className='editBtn'><img src={selImg.edit} /></div>
			<div onClick={this.delSubproject.bind(this,index)} className='delBtn'><img src={selImg.del} /></div>
		  </div>
	    )}
		<div className='addBtn' onClick={this.addSubproject.bind(this)}>+ 添加新题目</div>
	  </div>
    );
  }
}

export default VoteSubproject;
