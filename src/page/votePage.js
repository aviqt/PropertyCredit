import React, { Component } from 'react';
import {
	WingBlank,
	Button,
	Carousel,
	NavBar,
	Icon,
	WhiteSpace,
	Toast
} from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import CheckList from './components/checkList';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import {get,post} from '../utils/request';


class VotePage extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  voteId:props.match.params.voteId,
	  vote:[],
	  loading:true,
	  imgHeight:1
	}
  }
  componentDidMount(){
    this.getVoteData()
  }

  getVoteData(){
	let vote ={
	  title:'广东最美城市评选活动',
	  describe:'广东省”最美城市“评选，快来为你的城市加油！',
	  imgSrcList:[
	    {src:'http://imgs.aixifan.com/o_1cbrsvae053bo0r11arplk15ia1k.jpg',name:'111'},
	    {src:'http://imgs.aixifan.com/o_1cdi1tr211j2312t13r91d41m6e1m.jpg',name:'222'},
	  ],
	  endDate:'2018-06-01T00:00:00',
	  voted:false,
	  maximum:2,
	  shortList:[
	  	{id:0,name:'广州',votes:345,selected:false},
	  	{id:1,name:'深圳',votes:787,selected:false},
	  	{id:2,name:'汕头',votes:466,selected:false},
	  	{id:3,name:'韶关',votes:453,selected:false}
	  ],
	  userList:[]
	};

	let imgSrcPreUrl = 'http://saturn.51vip.biz:8848/File/DownloadFile?iszip=false&fileids=';
	let VoteProjectInfoUrl = '/api/Vote/VoteProjectInfo?keyValue=' + this.state.voteId;
	let VoteOptionsListUrl = '/api/Vote/VoteRecordOptionsCountList?keyValue=' + this.state.voteId;
	let RecordUserListUrl = '/api/Vote/RecordUserList?keyValue=' + this.state.voteId;
	let voteData = [];
	let shortListData = [];
	//获取已投票项目信息
	get(VoteProjectInfoUrl)
	.then((res) => {
	  if(res.Data){
		voteData = res.Data;
	  }
	  //console.log(voteData);
	  vote.title = voteData.Title;
	  vote.describe = voteData.Content;
	  vote.endDate = voteData.EndTime;
	  vote.maximum = voteData.VoteCount;
	  vote.voted = voteData.Isvoted === '已投票'?true:false;
	  vote.AttentionDegree = voteData.AttentionDegree;
	  if(voteData.FileIds){
		let imgSrcList = [];
	    eval(voteData.FileIds).map(item => {
	  	  let imgSrcItem = [];
	  	  imgSrcItem.src = imgSrcPreUrl + item.fileid;
	  	  imgSrcItem.name = item.name;
	  	  imgSrcList.push(imgSrcItem);
		  return false;
	    });
	    vote.imgSrcList = imgSrcList;
	  }
	  //获取已投票用户信息
	  get(RecordUserListUrl)
	  .then(res => {
	    //console.log(res.Data);
		let userList = [];
	    res.Data.map(item => {
	  	  let userItem = [];
		  userItem.name = item.FRealName;
		  userItem.iconSrc = item.FHeadIcon?'http://saturn.51vip.biz:8848/File/DownloadFile?iszip=false&fileids=' + item.FHeadIcon:'http://imgs.aixifan.com/o_1cdi1tr211j2312t13r91d41m6e1m.jpg';
		  userList.push(userItem);
		  return false;
	    })
		vote.userList = userList;
	  })
	  //获取投票选项
	  get(VoteOptionsListUrl)
      .then((res) => {
	    if(res.Data){
	  	  shortListData = res.Data;
	    }
		console.log(res.Data);
		let shortList = [];
		//console.log(shortListData);
		for(let i = 0; i < shortListData.length;i++){
		  let shortItem = [];
		  shortItem.id = res.Data[i].Id;
		  shortItem.name = res.Data[i].Content;
		  shortItem.votes = res.Data[i].OptionVote;
		  shortItem.selected = false;
		  shortList.push(shortItem);
		}
		//console.log(shortList);
		vote.shortList = shortList;
		//console.log(vote);
	    this.setState({
	  	  loading:false,
	  	  vote
	    })
      })
      .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
	
  }
  getShortList = (shortList) => {
	let {vote} = this.state;
	vote.shortList = shortList;
	//console.log(shortList);
	this.setState({
      vote:vote
    })
　}
  formatDate(timeStamp,str){
	let date = new Date(timeStamp);
	return [
	  date.getFullYear(),
	  (date.getMonth()+1) > 9 ? (date.getMonth()+1) : '0' + (date.getMonth()+1),
	  date.getDate() > 9 ? date.getDate() :'0' + date.getDate()
	].join(str);
  }
  submitBtnClick = () => {
	const {voteId,vote} = this.state;
	let AddVoteRecordUrl = '/api/Vote/AddVoteRecord?keyValue=' + voteId;
	  
	let count = vote.shortList.filter((item) => item.selected).length;
	if(count > vote.maximum){
	  Toast.info('最多只能选' + vote.maximum + '项');
	}else if(count === 0){
	  Toast.info('请至少选择一项。');
	}else{
		
	  let optionsList = [];
	  vote.shortList.filter(item => item.selected).map(item => {
		let options = {
		  OptionsId:item.id,
		  VoterId:'9f2ec079-7d0f-4fe2-90ab-8b09a8302aba',
		  ProjectId:voteId
		};
		optionsList.push(options);
		return false;
	  })

	  post(AddVoteRecordUrl,optionsList)
      .then((res) => {
		//console.log(res);
        if (res) {
		  let result = '你把票投给了 ';
		  vote.shortList.map((item) => {
			if(item.selected)result += item.name + '，';
			return false;
		  })
		  Toast.info(result.substring(0,result.length - 1) + ' 。');
		  this.getVoteData()
        } else {
          Toast.info('投票失败');
        }
      })
      .catch((err) => console.error(err));
	}
  }
  
  renderShortList = (vote) => {
	if(vote.voted){
	  return <div style={style.shortList}>
	  	{vote.shortList.sort((a,b) => b.votes-a.votes).map((item,index) => 
	  	<div key={'shortItem'+index} style={style.shortItem}>
	  	  {index+1}、{item.name}
	  	  <div style={style.shortItemVotesBox}>票数：<span style={style.shortItemVotes}>{item.votes}</span></div>
	  	</div>
	  	)}
	  </div>
	}else{
	  return <div>
	    <CheckList shortList={vote.shortList} maximum={vote.maximum} toParent={this.getShortList.bind(this)} />
	  </div>;
	}
  }
  render() {

	if(this.state.loading){
  	  return (
  	  	<div>loading</div>
  	  )
    }
	const {vote} = this.state;
	let votesSum = 0;
	vote.shortList.forEach((item,index) => {
		votesSum += item.votes;
	})
	
    return (
	  <div>
		<div style={{height:45}}>
	      <NavBar
	        mode='light'
	        leftContent = {<Link to='/vote/list'><Icon key='navbar_l' type='left' color='white'/></Link>}
	        style={{backgroundColor:'#18a3fe',height:45,position:'fixed',top:0,left:0,right:0,zIndex:10}}
	      >
	  	  <span style={{color:'white',fontSize:20}}>投票页面</span>
	      </NavBar>
	    </div>
		<div className='formBox' style={{backgroundColor:'#f8f8f8',bottom:vote.voted?0:' '}}>
		  <WingBlank>
	        <div style={style.title}>{vote.title}</div>
	        <div style={style.titleUnderLine}></div>
		    <Carousel autoplay={false} infinite>
		      {vote.imgSrcList.map(val =>
		  	  <img 
		  	    key={val.src}
		  	    src={val.src} 
		  	    alt={vote.imgSrc} 
		  	    style={{height:this.state.imgHeight,width:'100%'}}
		  		onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'));
                    this.setState({ imgHeight: 'auto' });
                  }}
		  	  />
		      )}
		    </Carousel>
	        <div style={style.describe}>
	          {vote.describe} <br />
	          （说明：点击选项进行投票，结果于投票后可见）
	        </div>
	        <div style={style.info}>
	          <div style={style.infoItem}>候选数量<br />{vote.shortList.length}</div>
	          <div style={style.infoItem}>累计投票<br />{votesSum}</div>
	          <div style={style.infoItem}>关注度<br />{vote.AttentionDegree}</div>
	        </div>
	        {this.renderShortList(vote)}
	        <div style={style.endDate}>投票截止日期：{this.formatDate(vote.endDate,'-')}</div>
	        <div>
	          <div style={{lineHeight:'30px'}}>已有{vote.userList.length}人参与投票</div>
		  	<div style={style.userList}>
		  	  {vote.userList.map((item,index) =>
		  		<img key={item.name + ' ' + index} style={style.userItemImg} src={item.iconSrc} alt={item.name} />
		  	  )}
		  	</div>
	        </div>
		  </WingBlank>
		</div>
	    <div className='operationBtns' style={{display:vote.voted?'none':''}}>
		  <WingBlank>
		    <WhiteSpace size='md' />
		    <Button 
			  style={style.btn} 
			  activeStyle={style.btnActive}
			  onClick={this.submitBtnClick}
			>投票</Button>
		    <WhiteSpace size='md' />
		    <Link to='/vote/list' className='am-button'><span>取消</span></Link>
		    <WhiteSpace size='md' />
		  </WingBlank>
	    </div>
      </div>
    );
  }
}
const style ={
  title:{
  	textAlign:'center',
	lineHeight:'28px',
  	fontSize:16,
  	marginTop:16,
  },
  titleUnderLine:{
  	borderTop:'1px solid #aaa',
  	width:80,
  	margin:'5px auto',
  	height:5
  },
  img:{
  	width:'100%',
  },
  describe:{
  	color:'#999',
  	fontSize:16,
  	textIndent:'2em',
  	lineHeight:'25px',
  	marginTop:10
  },
  info:{
  	backgroundColor:'white',
	padding:'12px 0',
	margin:'10px 0',
	overflow:'hidden'
  },
  infoItem:{
  	width:'33%',
  	fontSize:16,
	textAlign:'center',
	'float':'left',
	lineHeight:'30px'
  },	
  shortItem:{
  	backgroundColor:'white',
  	fontSize:18,
	padding:10,
	margin:'10px 0 0 0',
	lineHeight:'30px',
	position:'relative'
  },
  shortItemVotesBox:{
  	color:'#a17e7e',
  	position:'absolute',
	right:10,
  	fontSize:14,
	'top':10,
  },
  shortItemVotes:{
  	backgroundColor:'#a17e7e',
  	color:'#fff',
	textAlign:'center',
  	minWidth:60,
  	fontSize:12,
	display:'inline-block'
  },
  submitBtn:{
  	backgroundColor:'#0cbc0a',
	color:'white',
	marginTop:10,
  },
  endDate:{
	textAlign:'right',
	color:'#999',
	lineHeight:'40px',
  },
  userList:{
	backgroundColor:'white',
	marginBottom:15,
	overflow:'hidden'
  },
  userItemImg:{
	height:30,
	width:30,
	borderRadius:'50%',
	'float':'left',
	margin:'5px'
  },
  btn:{
    backgroundColor:'#18a3fe',
    color:'#fff',
  },
  btnActive:{
    backgroundColor:'gray'
  },
}
export default VotePage;
