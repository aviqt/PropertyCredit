import React, { Component } from 'react';
import { 
	List,
	InputItem,
	Picker,
	Button,
	Switch,
	WingBlank,
	WhiteSpace
 } from 'antd-mobile';
import InputOptionList from './inputOptionList';

 
class VoteSubprojectEdit extends Component {
  constructor(props) {  
    const {subproject,index} = props;
    super(props);  
    this.state = {  
	  item:{...subproject[index]}
	}
  }
  banBack = (e) => {
	if (e.state && e.state.target === 'MeanSure') {
	  window.history.go(-1);
      let {subproject} = this.props;
	  this.props.toParent(subproject);
	} 
  }
  componentDidMount(){
	if (!(window.history.state && window.history.state.target == 'Final')) {
	  window.history.pushState({target: 'MeanSure', random: Math.random()}, '', '');
	  window.history.pushState({target: 'Final', random: Math.random()}, '', '');
	}
	window.addEventListener('popstate', this.banBack, false);
  }
  componentWillUnmount(){
	window.removeEventListener('popstate', this.banBack, false);
	if(window.history.state.target === 'Final'){
	  window.history.go(-2);
	}
  }
  setOptionStr = (optionStr) => {
	let {item} = this.state; 
	item.optionStr = optionStr;
	this.setState({item});
　}
  setTitle = (title) => {
	let {item} = this.state; 
	item.title = title;
	this.setState({item});
	
  }
  setCount = (count) => {
	let {item} = this.state; 
	item.count = count;
	this.setState({item});
  }
  renderMaximumPicker = (item) => {
	let data = [{value:2,label:2}];
	let count = item.optionStr.split(',').length;
	let countT = item.optionStr.split(',').filter((item) => item.replace(/\s+/g,'')).length;
	let disabled = false;
	if(countT < 3) disabled = true;
	if( item.count > 1){
	  for(let i = 3;i <= countT;i++){
	  	data.push({value:i,label:i})
	  }
	  return <Picker 
		  disabled={disabled}
	  	  data={data} 
	  	  cols={1} 
	  	  value={[item.count]}
	  	  onChange={value => {this.setCount(value[0])}}
	    >
	  	  <List.Item arrow='horizontal'>最多可选</List.Item>
	    </Picker>;
	}
  }
  btnClick = () => {
	let {item} = this.state; 
    let {subproject,index} = this.props;
	subproject[index] = item;
	this.props.toParent(subproject);
	  
  }
  render() {
	const {item} = this.state;
	const {subproject,isPicker ,userList} = this.props; 
    return (
	  <div>
	    <List>
		  <div>
	  	    <InputItem 
			  placeholder='请输入题目'
			  value={item.title}
			  onChange={title => {this.setTitle(title)}}
	  	    />
		    <InputOptionList 
		  	  optionListStr={item.optionStr} 
		  	  toParent={this.setOptionStr.bind(this)} 
			  isPicker={isPicker}
			  userList={userList}
		    />
		    <List.Item
		      extra={<Switch 
		  	    checked={item.count !== 1}
		  	    onClick={value => {this.setCount(value ? 2 : 1)}}
		  	  />}
			  style={{display:item.optionStr.split(',').length < 2?'none':''}}
		    >是否多选</List.Item>
			{this.renderMaximumPicker(item)}
		  </div>
	    </List>
		<WhiteSpace size='md' />
		<WingBlank>
		  <Button 
			onClick={this.btnClick}
			type="primary"
		  >确定</Button>
		</WingBlank>
	  </div>
    );
  }
}

export default VoteSubprojectEdit;
