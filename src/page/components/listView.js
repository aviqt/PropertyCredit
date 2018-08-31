import React, { Component } from 'react';
import $ from 'jquery';
import {get} from '../../utils/request';
import { PullToRefresh } from 'antd-mobile';


//let interval;
class ListView extends Component{
  constructor(props) {  
    super(props);  
    this.state = { 
	  showCount:this.props.url?10000:0,
	  bottomText:'Loading...',
	  pageIndex:1,
	  isEnd:false,
	  loading:false,
	  list:this.props.data?this.props.data:[],
      refreshing: false,
	  nodeScrollTop:0
	}
  }
  componentDidMount() {
    $(this.node).scrollTop(0);
	this.initState();
	this.interval = setInterval(() => {
	  this.setState({
		nodeScrollTop:$(this.node).scrollTop()
	  });
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
	const {page} = this.props;
	let newList = [];
	let url = this.props.url.replace('pageIndex',pageIndex);
	//console.log(url);
	this.setState({
	  loading:true,
	});
	//console.log(url);
	get(url).then((res) => {
	  //console.log(res);
	  if(res.Data.rows){
		newList = res.Data.rows;
	  }else{
		this.setState({
		  bottomText:list.length === 0?'没有相关数据':'没有更多数据',
		  isEnd:true
	    });
		return false;
	  }
	  this.setState({
	    loading:false,
	  });
	  //console.log(newList);
	  if(newList.length === 0){
		this.setState({
		  bottomText:list.length === 0?'没有相关数据':'没有更多数据',
		  isEnd:true,
		  refreshing: false,
	    });
	  }else{
		this.setState({
		  list:list.concat(newList),
		  pageIndex:pageIndex+1,
		  refreshing: false,
	    });
	  }
    })
    .catch((err) => console.error(err));
  }
  componentWillReceiveProps() {
	this.initState();
  }
  initState(){
	this.setState({
	  showCount:this.props.url?10000:0,
	  bottomText:'Loading...',
	  isEnd:false,
	  loading:false,
	  pageIndex:1,
	  list:this.props.data?this.props.data:[]
	});
  }
  pullToRefresh = ()=> {
	this.setState({ refreshing: true });
	setTimeout(() => {
	  this.initState();
	  this.getListByPageIndex();
	}, 500); 
  }
  componentWillUnmount(){
	clearInterval(this.interval);
  }
  renderRows = () => { 
	const {list,bottomText,showCount,nodeScrollTop} = this.state;
	const {row} = this.props;
	switch(nodeScrollTop){
	  case 0:
	    return (
		  <PullToRefresh
            damping={60}
            direction='down'
            refreshing={this.state.refreshing}
            onRefresh={this.pullToRefresh}
          >
		    {list.slice(0,showCount).map(row)}
		    <div className='listLoading'>{bottomText}</div>
          </PullToRefresh>
		);
	  default:
	    return (
		  <div>
		    {list.slice(0,showCount).map(row)}
		    <div className='listLoading'>{bottomText}</div>
		  </div>
		);
	}
  }
  
  
  render(){
	const {className,style} = this.props;
	return (
	  <div 
	    ref={node => this.node = node} 
		className={className}
		style={style}
	  >
	    {this.renderRows()}
	  </div>
	);
  }
}


export default ListView;
