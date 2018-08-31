import React, { Component } from 'react';
import {
	Carousel,
	Modal,
	Toast
} from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import SubmitSuccess from './components/submitSuccess';
import { Link,Redirect } from 'react-router-dom';
import {get,post} from '../utils/request';
import {selFunc} from '../utils/func';

const topbg = require('../images/evaluation/topbg.png');

const bad = require('../images/evaluation/bad.png');
const good = require('../images/evaluation/good.png');
const normal = require('../images/evaluation/normal.png');
const badActive = require('../images/evaluation/bad-active.png');
const goodActive = require('../images/evaluation/good-active.png');
const normalActive = require('../images/evaluation/normal-active.png');

const evalustionOptions = [
  {text:'满意',icon:good,iconActive:goodActive,value:1},
  {text:'基本满意',icon:normal,iconActive:normalActive,value:2},
  {text:'不满意',icon:bad,iconActive:badActive,value:0},
]
const scorePercent = [0,100,60];



class QualityEvaluationDetail extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  id:props.match.params.id,
	  data:[],
	  loading:true,
	  addLoading:false,
	  submitSuccess:false,
	  imgHeight:1,
	}
  }
  componentDidMount(){
    this.getData()
  }

  getData(){
	this.setState({
	  loading:true
	})
	let data ={
	  title:'', 			// 项目名
	  CreatorTime:'',  		// 创建日期
	  Score:0,  			// 当前分
	  SumScore:0, 			// 总分
	  evalustionList:[],	// 评价内容列表
	  IsAbstention:0, 		// 1表示已弃权
	  Status:0 				// 0表示未评价
	};
	let url = sessionStorage.apiUrl + '/api/Evaluation/EvaluateContent?projectId=' + this.state.id;
	get(url).then((res) => {
	  //console.log(res.Data);
	  data.title = res.Data[0].ProjectName;
	  data.CreatorTime = res.Data[0].CreatorTime;
	  data.Status = res.Data[0].Status;
	  data.IsAbstention = res.Data[0].IsAbstention;
	  
	  //data.IsAbstention = 1;  
	  //data.Status = 0;  
	  res.Data.map((item,index)=>{
	    let evalustionItem = [];
	    evalustionItem.Content = item.Content;
	    evalustionItem.value = item.Score === 100 ? 1 : item.Score === 60 ? 2 : 0;
	    evalustionItem.Percent = item.Percent;
	    evalustionItem.Score = item.Score === null ? 0 : item.Score;
	    evalustionItem.Id = item.Id;
		if(data.Status === 0 || data.IsAbstention === 1){  // 未评价或者已弃权时，全都显示未选择
		  evalustionItem.value = 3;
		  evalustionItem.Score = 0;
		}
		
	    data.evalustionList.push(evalustionItem);
		data.Score +=  evalustionItem.Score  * item.Percent / 100;
		data.SumScore += item.Percent;
		return false;
	  })
	  //console.log(data);
	  this.setState({
	    loading:false,
	    data
	  })
	  return false;
	})
	
	
  }
  setEvalustionList = (index,value) => {
	const {data} = this.state;
	
	
	
	
	if(data.IsAbstention === 1) {
	  Modal.alert('提示','您已经弃权了！',[
	    {text:'是',onPress: () => {
	  	  console.log('');
	    }},
	  ])
	  return;
	};
	if(data.Status === 1) {
	  Modal.alert('提示','您已经提交过评价了！',[
	    {text:'是',onPress: () => {
	  	  console.log('');
	    }},
	  ])
	  return;
	};
	
	let {evalustionList} = data;
	evalustionList[index].value = value;
	evalustionList[index].Score = scorePercent[value] ;
	let Score = 0;
	evalustionList.map((item)=>{
	  Score += item.Score * (item.Percent / 100);
	})
	Score = Score.toFixed(0);
	data.Score = Score;
	data.evalustionList = evalustionList;
	this.setState({
	  data
	})
  }
  
  submitData = (bl) => {
	const {data} = this.state;
	const {evalustionList} = data;
	let str = '[';
    evalustionList.map((item,index) => {
  	  if(index !== 0) str += ',';
  	  str += '{"Id":"' + item.Id + '","Score":"' + item.Score + '"}';  
  	  return false;
    });
    str += ']';
	var param = {
	  scorejson:str
	};
	//console.log(param);
	let url = sessionStorage.apiUrl + '/api/Evaluation/' + (bl ? 'Submit' : 'Abstention');
	let text = bl ? '您确认提交评价吗？' : '您确定要放弃本次评价吗？';
	
	
	
	Modal.alert('提示',text,[
	  {text:'否'},
	  {text:'是',onPress: () => {
		post(url).then(res => {
		  //console.log(res);
		  if(res.State === '操作成功'){
			selFunc.modal(SubmitSuccess);
		  }else{
			Toast.fail('提交失败!');
		  }
		})
	  }},
	])
  }
  renderEvalustionOptions = () => {
	const {evalustionList} = this.state.data;
	return (
	  evalustionList.map((item,index) => (
	    <div className='item' key={index}>
	  	  <span>{item.Content}</span>
	  	  <ul>
		    {evalustionOptions.map((itemI,indexI) => (
			  <li 
			    className={item.value==itemI.value?'active':''} 
				key={indexI}
				onClick={this.setEvalustionList.bind(this,index,itemI.value)}
			  >
			    <img src={item.value==itemI.value?itemI.iconActive:itemI.icon} alt={itemI.value}/>{itemI.text}
			  </li>
			))}
	  	  </ul>
	    </div>
	  ))
	);
  }
  render() {
	const {data} = this.state;
	if(this.state.loading){
  	  return (
  	  	<div>loading</div>
  	  )
    }
	if(this.state.submitSuccess){
	  return (<Redirect to='/vote/addSuccess' />);
	}
	
	let scorePercentR = data.Score * 250 / data.SumScore - 125;
    return (
	  <div>
		<TopNavBar title='质量评价' showLC/>
		<div className='formBox' style={{backgroundColor:'#f0f4ff'}}>
		  <div className='qualityEvalustionDetail'>
			<div className='baseInfo'>
			  <img className='bg' src={topbg} alt='1'/>
			  <div className='title'>
				<span>{data.title}</span>
			  </div>
			  <div className='evalustion-score'>
				<div className='evalustion-inner'>
				  <span>综合评价</span>
				  <div className='score' style={{display:data.IsAbstention === 1?'none':''}}><span>{data.Score}</span>/{data.SumScore}</div>
				  <div className='score' style={{display:data.IsAbstention === 1?'':'none'}}><span>已弃权</span></div>
				  创建日期：{selFunc.formatDate(data.CreatorTime,'-')}
				</div>
				<div className='pointer' style={{transform:'rotate(' + scorePercentR + 'deg)'}}></div>
			  </div>
			</div>
			<div className='evalustion-options' style={{marginBottom:data.Status==1?0:''}}>
			  {this.renderEvalustionOptions()}
			</div>
		  </div>
		</div>
		<div className='fixedMenu' style={{display:data.Status==1?'none':''}}>
		  <div 
		    className='cancelBtn' 
			onClick={this.submitData.bind(this,false)}
		  >弃权</div>
		  <div 
		    className='submitBtn' 
			onClick={this.submitData.bind(this,true)}
		  >提交</div>
		</div>
      </div>
    );
  }
}

export default QualityEvaluationDetail;
