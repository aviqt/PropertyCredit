import React, { Component } from 'react';
import {
	WingBlank,
	Button,
	Carousel,
	NavBar,
	Icon,
	ActivityIndicator,
	WhiteSpace,
	Toast
} from 'antd-mobile';
import CheckList from './components/checkList';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom';
import {get,post} from '../utils/request';
import {selFunc} from '../utils/func';
import ImgList from './components/imgList';


class VotePage extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  voteId:props.match.params.voteId,
	  vote:[],
	  loading:true,
	  imgHeight:1,
	  submitLoading:false
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
	};

	let imgSrcPreUrl = sessionStorage.fileUrl + '/File/DownloadFile?iszip=false&fileids=';
	let VoteProjectInfoUrl = sessionStorage.apiUrl + '/api/Vote/ParticipationVoteProjectInfo?keyValue=' + this.state.voteId;
	let VoteOptionsListUrl = sessionStorage.apiUrl + '/api/Vote/VoteRecordOptionsCountList?keyValue=' + this.state.voteId;
	let voteData = [];
	let shortListData = [];
	//获取投票项目信息
	const hasToken = !(!sessionStorage.Authorization || sessionStorage.Authorization === 'null' );
	if(!hasToken){
	  VoteProjectInfoUrl = sessionStorage.apiUrl + '/api/Vote/VoteProjectInfo?keyValue=' + this.state.voteId;
	}
	
	get(VoteProjectInfoUrl,this)
	.then((res) => {
	  if(res.Data){
		voteData = res.Data;
	  }
	  console.log(voteData);
	  vote.title = voteData.Title;
	  vote.describe = voteData.Content;
	  vote.endDate = voteData.EndTime;
	  vote.maximum = voteData.VoteCount;
	  vote.voted = voteData.Isvoted === '已投票'?true:false;
	  vote.AttentionDegree = voteData.AttentionDegree;
	  if(voteData.FileIds && eval(voteData.FileIds).length !== 0){
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
	  
	  //获取投票选项
	  get(VoteOptionsListUrl,this)
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
		  shortItem.selected = res.Data[i].Isvoted === '已投票'?true:false;
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
	if(vote.voted) return;
	vote.shortList = shortList;
	//console.log(shortList);
	this.setState({
      vote:vote
    })
　}

  submitBtnClick = () => {
	if(this.state.submitLoading) return false;
	this.setState({
	  submitLoading:true,
	})
	const {voteId,vote} = this.state;
	let AddVoteRecordUrl = sessionStorage.apiUrl + '/api/Vote/AddVoteRecord?keyValue=' + voteId;
	  
	let count = vote.shortList.filter((item) => item.selected).length;
	if(count > vote.maximum){
	  Toast.info('最多只能选' + vote.maximum + '项');
	  this.setState({
	    submitLoading:false,
	  });
	}else if(count === 0){
	  Toast.info('请至少选择一项。');
	  this.setState({
	    submitLoading:false,
	  });
	}else{
	  let optionsList = [];
	  vote.shortList.filter(item => item.selected).map(item => {
		let options = {
		  OptionsId:item.id,
		  VoterId:voteId,
		  ProjectId:voteId
		};
		optionsList.push(options);
		return false;
	  })

	  post(AddVoteRecordUrl,optionsList,this)
      .then((res) => {
		console.log(res);
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
		  this.setState({
		    submitLoading:false,
		  });
        }
      })
      .catch((err) => console.error(err));
	}
  }
  
  renderShortList = (vote) => {
	if(Date.parse(vote.endDate) <= Date.now()){
	  return (
	    <div style={style.shortList}>
	      {vote.shortList.sort((a,b) => b.votes-a.votes).map((item,index) => 
	      <div key={'shortItem'+index} style={style.shortItem}>
	        {index+1}、{item.name}
	        <div style={style.shortItemVotesBox}>票数：<span style={style.shortItemVotes}>{item.votes}</span></div>
	      </div>
	      )}
	    </div>
	  );
	}
	return (
	  <CheckList shortList={vote.shortList} maximum={vote.maximum} toParent={this.getShortList.bind(this)} />
	);
	
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
		<TopNavBar title='投票页面' showLC/>
		<div className='formBox' style={{backgroundColor:'#f8f8f8',bottom:vote.voted?0:' ',padding:'0 20px'}}>
	      <div style={style.title}>{vote.title}</div>
	      <div style={style.titleUnderLine}></div>
	      <div style={style.describe}>
	        {vote.describe} <br />
	        （说明：点击选项进行投票，结果于投票后可见）
	      </div>
		  <ImgList imgList={vote.imgSrcList} />
	      <div style={style.info}>
	        <div style={style.infoItem}>候选数量<br />{vote.shortList.length}</div>
	        <div style={style.infoItem}>累计投票<br />{votesSum}</div>
	        <div style={style.infoItem}>关注度<br />{vote.AttentionDegree}</div>
	      </div>
	      {this.renderShortList(vote)}
	      <div style={style.endDate}>投票截止日期：{selFunc.formatDate(vote.endDate,'-')}</div>
	      <div className='operationBtns' style={{display:(vote.voted || Date.parse(vote.endDate) <= Date.now())?'none':''}}>
		    <WingBlank>
		      <WhiteSpace size='md' />
		      <Button 
		  	    style={style.btn} 
		  	    activeStyle={style.btnActive}
		  	    onClick={this.submitBtnClick}
		  	  >投票</Button>
		      <WhiteSpace size='md' />
		      <Link to='/vote/list' className='am-button'><span>取 消</span></Link>
		      <WhiteSpace size='md' />
		    </WingBlank>
	      </div>
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
	display:'none',
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
