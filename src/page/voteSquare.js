import React, { Component } from 'react';
import { 
	SearchBar,
	WingBlank
 } from 'antd-mobile';
import { Link } from 'react-router-dom'
import TopNavBar from './components/topNavBar';
import Footer from './components/footer';


const nowTimeStamp = Date.now();
const sortTypeList = [
	{id:0,type:'title',name:'综合'},
	{id:1,type:'hits',name:'热度'},
	{id:2,type:'endDate',name:'时间'},
	{id:3,type:'title',name:'距离'},
	{id:4,type:'title',name:'关注度'},
];
const voteList = [
	{hits:465456,endDate:nowTimeStamp + Math.floor(Math.random(10)*24*3600*1000),title:'电影排行榜'},
	{hits:4505,endDate:nowTimeStamp + Math.floor(Math.random(10)*24*3600*1000),title:'旅游景点排行榜'},
	{hits:785,endDate:nowTimeStamp + Math.floor(Math.random(10)*24*3600*1000),title:'手表排行榜'},
	{hits:15405,endDate:nowTimeStamp + Math.floor(Math.random(10)*24*3600*1000),title:'最有诗意的天气'},
	{hits:79321,endDate:nowTimeStamp + Math.floor(Math.random(10)*24*3600*1000),title:'最普及的手机机型'},
];
const icon = require("../icon/eye.svg");



class VoteSquare extends Component {
  constructor(props) {  
    super(props);  
	

    this.state = { 
		keyWords:'',
		sort:{id:0,type:'title'},
		voteList:voteList,
	}
  }
  componentDidMount() {

  }
  
  setSortType = (id,value) => {
	  this.setState({
		 sort:{id:id,type:value},
	  })
  }
  render() {
    const {sort,keyWords} = this.state;
    return (
	  <div>
		<TopNavBar title='投票广场'/>
		<div style={{paddingTop:50}}>
		  <WingBlank>
		    <SearchBar
		  	  placeholder='搜索投票活动'
		  	  value={keyWords}
		  	  onChange={keyWords => {this.setState({keyWords})}}
		    />
		  </WingBlank>
		</div>
		<div className='sortTypeList'>
		  {sortTypeList.map((sortType,index) => 
		    <span 
		  	  className={index===sort.id?'spanActive':''} 
		  	  onClick={this.setSortType.bind(this,sortType.id,sortType.type)}
		  	  key={'sortType-item'+index}
		    >
		  	  {sortType.name}
		    </span>
		  )}
		</div>
		<div className='voteList'>
		  {this.state.voteList
		    .filter((vote) => vote.title.indexOf(keyWords) >= 0)
		    .sort((a,b)=>b[sort.type].localeCompare?b[sort.type].localeCompare(a[sort.type]):b[sort.type]-a[sort.type])
		    .map((vote,index) => 
			  <Link to={'/votePage/'+index} key={'vote-item'+index}><div style={{color:"#333"}}>
		  	    <img alt={icon} src={icon} />
		  	    {vote.title}
		      </div></Link>
		    )
		  }
		</div>

		
		<Footer pageIndex={1}/>
      </div>
    );
  }
}

export default VoteSquare;
