import React, { Component } from 'react';
import {
	WingBlank,
	Button,
	Carousel,
	NavBar,
	Icon,
	Modal,
	ActivityIndicator,
	WhiteSpace,
	Toast
} from 'antd-mobile';
import CheckList from './components/checkList';
import VoteOptionResult from './components/voteOptionResult';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom';
import {get,post} from '../utils/request';
import {selFunc} from '../utils/func';
import {selImg} from '../utils/config';
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
	let vote = {
	  imgSrcList:[
	  //  {src:'http://imgs.aixifan.com/o_1cbrsvae053bo0r11arplk15ia1k.jpg',name:'111'},
	  //  {src:'http://imgs.aixifan.com/o_1cdi1tr211j2312t13r91d41m6e1m.jpg',name:'222'},
	  ],
	};

	let imgSrcPreUrl = sessionStorage.fileUrl + '/File/DownloadFile?iszip=false&fileids=';
	let VoteProjectInfoUrl = sessionStorage.apiUrl + '/api/Vote/ParticipationVoteProjectInfo?keyValue=' + this.state.voteId;
	let VoteOptionsListUrl = sessionStorage.apiUrl + '/api/Vote/VoteRecordOptionsCountList?keyValue=' + this.state.voteId;
	let voteData = [];
	//获取投票项目信息
	const hasToken = !(!sessionStorage.Authorization || sessionStorage.Authorization === 'null' );
	if(!hasToken){
	  VoteProjectInfoUrl = sessionStorage.apiUrl + '/api/Vote/VoteProjectInfo?keyValue=' + this.state.voteId;
	}
	
	get(VoteProjectInfoUrl).then((res) => {
	  if(res.Data){
		voteData = res.Data;
	  }
	  //console.log(res.Data);
	  vote = Object.assign(vote,res.Data)
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
		//console.log(res.Data)
		let subproject = [];
		res.Data && res.Data.map((item,index) => {
		  let VoteOptions = [];
		  JSON.parse(item.VoteOptions).map((itemX,indexX) => {
			VoteOptions.push({
			  Id:itemX.Id,
			  Content:itemX.ContentName?itemX.ContentName:itemX.Content,
			  OptionVoteCount:itemX.OptionVote,
			  selected:itemX.Isvoted === '已投票'
			});
		  })
		  subproject.push({
			Id:item.Id,
			Title:item.Title,
			IsValid:item.IsValid === 1,
			VoteCount:item.VoteCount,
			selectable:!(vote.Isvoted === '已投票' || vote.Isgiveup === '已弃票'),
			VoteOptions
		  });
		})
		vote.subproject = subproject;
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
  getVoteOptions = (index,VoteOptions) => {
	let {vote} = this.state;
	if(vote.Isvoted === '已投票') return false;
	vote.subproject[index].VoteOptions = VoteOptions;
	//console.log(VoteOptions,index);
	this.setState({
      vote:vote
    })
　}

  submitBtnClick = () => {
	if(this.state.submitLoading) return false;
	this.setState({
	  submitLoading:true,
	})
	const {vote,voteId} = this.state;
	let url = sessionStorage.apiUrl + '/api/Vote/AddVoteRecord?keyValue=' + voteId;
    let data = [];
	vote.subproject.map(item => {
	  let VoteRecords = [];
	  item.VoteOptions.filter(i => i.selected).map(itemX => {
		VoteRecords.push({
		  OptionsId:itemX.Id,
		  ProjectId:item.Id,
		}); 
	  })
	  data.push({
		Id:item.Id,
		VoteRecords:JSON.stringify(VoteRecords),
	  });
	});
    //console.log(data);
	//console.log(JSON.stringify(data));
	//return false;
	let text = '您确定要投票吗？';
	Modal.alert('提示',text,[
	  {text:'否',onPress: () => {
		this.setState({
		  submitLoading:false,
		})
	  }},
	  {text:'是',onPress: () => {
		post(url,data).then((res) => {
			//console.log(res);
		  if (res.Data === 'OK') {
			Toast.info('投票成功');
			this.getVoteData()
		  } else {
			Toast.info('投票失败');
		  }
		  this.setState({
		    submitLoading:false,
		  });
		})
	  }},
	])
  }
  
  voteGiveup = () => {
	const {voteId} = this.state;
	let url = sessionStorage.apiUrl + '/api/Vote/Giveup?keyValue=' + voteId;
	let text = '您确定要放弃投票吗？';
	Modal.alert('提示',text,[
	  {text:'否',onPress: () => {}},
	  {text:'是',onPress: () => {
		post(url).then((res) => {
		  if (res.Data === 'OK') {
			Toast.info('放权投票成功');
			this.getVoteData()
		  } else {}
		})
	  }},
	])
	  
  }
  renderSubproject = () => {
	const {vote} = this.state;
	if(false || Date.parse(vote.EndTime) <= Date.now()){
	  return (
		  <div>
		   {vote.subproject.map((item,index) => 
			  <div key={index} className='voteCBox'>
				<div className='title'>{(index + 1 )+'、'+item.Title}</div>
				<VoteOptionResult 
				  VoteOptions={item.VoteOptions}
				  VoterCount={vote.VoterCount}
				/>
				<div className='isValid'>
				  <img src={item.IsValid?selImg.statusValid:selImg.statusInvalid} />
				</div>
			  </div>
			)}
		  </div>
		);
	}
	return (
	  <div>
	   {vote.subproject.map((item,index) => 
	  	  <div key={index} className='voteCBox'>
	  	    <div className='title'>{(index + 1 )+'、'+item.Title}</div>
	  	    <CheckList 
	  	  	  checkList={item.VoteOptions}
	  	  	  maximum={item.VoteCount}
	  	  	  toParent={this.getVoteOptions.bind(this,index)}
	  	  	  selectable={item.selectable}
	  	    />
	  	  </div>
	    )}
	  </div>
	);
  }
  render() {
	if(this.state.loading){
  	  return (
  	  	<div>loading</div>
  	  )
    }
	const {vote,submitLoading} = this.state;
    return (
	  <div>
		<TopNavBar title='投票页面' showLC/>
		<div className='formBox' style={{padding:'10px 20px',backgroundColor:'#fafafa'}}>
	      <div style={{fontSize:20,marginBottom:3}}>{vote.Title}</div>
	      <div style={{marginBottom:8}}>
		    <span style={{color:'#1a8ffe',marginRight:10}}>{vote.CreatorName}</span>
			<span style={{color:'#008000',marginRight:10}}>{vote.StatusStr}</span>
			<span style={{display:'none'}}>{selFunc.formatDate(vote.EndTime,'-')}</span>
		  </div>
	      <div style={{textIndent:'2em',marginBottom:10}}>{vote.Content} </div>
		  <ImgList imgList={vote.imgSrcList} />
		  {this.renderSubproject()}
	      <div className='operationBtns' style={{display:(vote.Isgiveup === '已弃票' || vote.Isvoted === '已投票' || Date.parse(vote.EndTime) <= Date.now())?'none':''}}>
		    <WhiteSpace size='md' />
		    <Button 
		  	  loading={this.state.submitLoading} 
			  type="primary"
		  	  onClick={this.submitBtnClick}
		  	>投票</Button>
		    <WhiteSpace size='md' />
		    <Button
		  	  onClick={this.voteGiveup}
			>弃权</Button>
		    <WhiteSpace size='md' />
	      </div>
	      <div className='operationBtns' style={{display:(vote.Isgiveup === '已弃票'?'':'none')}}>
		    <WhiteSpace size='md' />
		    <Button type="primary" disabled>已弃权</Button>
		    <WhiteSpace size='md' />
	      </div>
		</div>
      </div>
    );
  }
}

export default VotePage;
