import React, { Component } from 'react';
import $ from 'jquery';
import {get} from '../../utils/request';

let interval;
class ListView extends Component{
  constructor(props) {  
    super(props);  
    this.state = { 
	  showCount:this.props.url?10000:0,
	  bottomText:'Loading...',
	  pageIndex:1,
	  isEnd:false,
	  loading:false,
	  list:this.props.data?this.props.data:[]
	}
  }
  componentDidMount() {
	this.initState();
	interval = setInterval(() => {
	  if($(this.node).height() + $(this.node).scrollTop() >= $(this.node)[0].scrollHeight - 10 && !this.state.isEnd && !this.state.loading){
		if(this.props.url){
		  this.getListByPageIndex()
		}else{
		  this.setState({
	  	    showCount:this.state.showCount + ( this.props.pageSize ? this.props.pageSize : 5 ) ,
		    bottomText:this.state.showCount < this.props.data.length ? 'Loading...' : '没有更多数据'
	      });
		}
	  }
	},100)
  }
  getListByPageIndex(){
	const {pageIndex,list} = this.state;
	let newList = [];
	let url = this.props.url.replace('pageIndex',pageIndex);
	//console.log(url);
	this.setState({
	  loading:true,
	});
	
	get(url).then((res) => {
	  if(res.Data){
		newList = res.Data.rows;
	  }
	  this.setState({
	    loading:false,
	  });
	  //console.log(newList);
	  if(newList.length === 0){
		this.setState({
		  bottomText:list.length === 0?'没有相关数据':'没有更多数据',
		  isEnd:true
	    });
	  }else{
		this.setState({
		  list:list.concat(newList),
		  pageIndex:pageIndex+1
	    });
	  }
    })
    .catch((err) => console.error(err));
  }
  componentWillReceiveProps() {
    this.node.scrollTo(0,0);
	this.initState();
  }
  initState(){
	this.setState({
	  showCount:this.props.url?10000:0,
	  bottomText:'Loading...',
	  isEnd:false,
	  pageIndex:1,
	  list:this.props.data?this.props.data:[]
	});
  }
  componentWillUnmount(){
	clearInterval(interval);
  }
  render(){
	return (
	  <div 
	    ref={node => this.node = node} 
		className={this.props.className}
		style={this.props.style}
	  >
		{this.state.list.slice(0,this.state.showCount).map(this.props.row)}
		<div className='listLoading'>{this.state.bottomText}</div>
	  </div>
	);
  }
}


export default ListView;
