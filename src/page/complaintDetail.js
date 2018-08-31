import React, { Component } from 'react';
import {
	Carousel,
	Modal,
	List,
	TextareaItem,
	WingBlank,
	Toast,
} from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import SubmitSuccess from './components/submitSuccess';
import ImgUpload from './components/imgUpload';
import PicView from './components/picView';
import ImgList from './components/imgList';
import { Link } from 'react-router-dom';
import {get,post} from '../utils/request';
import {selFunc} from '../utils/func';




class ComplaintDetail extends Component {
  constructor(props) {  
    super(props);  
	let isManage = props.match.params.AuditId !== '0' ? true : false;
    this.state = { 
	  id:props.match.params.id,
	  AuditId:props.match.params.AuditId,
	  complaint:[],
	  loading:true,
	  isManage:isManage,
	  imgHeight:1,
	  tabValue:1,
	  
	  AuditComment:'',
	  FileIds:'',
	}
  }
  setTabValue = (value) =>{
    this.setState({
  	  tabValue:value
    })
  }
  getFileIds(info){
	//console.log(info);
	let str = selFunc.getFileIdsStr(info);
	this.setState({
	  FileIds:str
	})
  }
  componentDidMount(){
    this.getComplaint()
  }

  getComplaint(){
	this.setState({
	  loading:true
	})
	let complaint = [];
	let url = sessionStorage.apiUrl + '/api/Complaint/' + this.state.id;
	let imgSrcPreUrl = sessionStorage.fileUrl + '/File/DownloadFile?iszip=false&fileids=';
	get(url).then(res => {
	  let newData = res.Data;
	  complaint = newData;
	  
	  let imgSrcList = [];
	  if(newData.FileIds && eval(newData.FileIds).length !== 0){
	    eval(newData.FileIds).map(item => {
	  	  let imgSrcItem = [];
	  	  imgSrcItem.src = imgSrcPreUrl + item.fileid;
	  	  imgSrcItem.name = item.name;
	  	  imgSrcList.push(imgSrcItem);
		  return false;
	    });
	  }
	  complaint.imgSrcList = imgSrcList;
	  //console.log(complaint);
	  this.setState({
	    loading:false,
	    complaint
	  })
	})
  }
  complaintConfirm = (isSolved) => {
	const {complaint,isManage} = this.state;
	let url = sessionStorage.apiUrl + '/api/Complaint/Confirm/' + this.state.id + '?isSolved=' + isSolved + '&confirmComment=' + this.state.AuditComment + '&confirmFileIds=' + JSON.stringify(this.state.FileIds);
	let text = isSolved?'您确认此投诉已成功解决吗？':'您确认此投诉并未成功解决吗？';
	if(isManage) {
	  url = sessionStorage.apiUrl + '/api/Complaint/Audit?auditId=' + this.state.AuditId + '&auditStatus=' + ( isSolved ? 1 : 2) + '&auditComment=' + this.state.AuditComment + '&fileIds=' + this.state.FileIds;
	  if(complaint.ApplyStatus === 1){
		text = isSolved?'您确认要将此投诉转发给物业吗？':'您确认要驳回此投诉吗？';
	  }
	};
	console.log(url);
	Modal.alert('提示',text,[
	  {text:'否'},
	  {text:'是',onPress: () => {
		post(url).then(res => {
		  if(res.State === 'Success'){
			selFunc.modal(SubmitSuccess);
		  }else{
			Toast.info('提交失败');
		  }
		})
	  }},
	])
	//console.log(url);
  }

  
  renderStatusForm = ApplyStatus => {
	const {complaint,isManage} = this.state;
	switch(ApplyStatus){
	  case 1:
	    if(!isManage)return;
	  case 0:
	    return ( 
		  <List className='imgContentForm' style={{width:'100%',borderTop:'12px solid #eee'}}>
		    <TextareaItem 
		      placeholder = '处理意见（选填）'
		      rows='3'
		      autoHeight
		  	  value={this.state.AuditComment}
		      onChange={AuditComment => this.setState({ AuditComment })}
		    />
		    <WingBlank style={{paddingTop:8,paddingBottom:8}}>
		      <ImgUpload toParent={this.getFileIds.bind(this)}/>
		    </WingBlank>
		  </List>
		);
	  default:
	    return;
	}
	  
  }
  renderStatus = ApplyStatus => {
	const {complaint,isManage} = this.state;
	switch(ApplyStatus){
	  case 2:
	    return( 
		  <div className='processResult'>
			<div className='result'>
			  <img src={require('../icon/good.png')} alt='img' />
			  已解决
			</div>
			<span>{selFunc.formatDatePlus(complaint.ComplaintConfirmTime,'-')}</span><br />
			<strong>{complaint.ComplaintConfirmName}</strong>确认此投诉已解决
		  </div>
		);
	  case 11:
	  case -1:
	    return( 
		  <div className='processResult'>
			<div className='result result_b'>
			  <img src={require('../icon/bad.png')} alt='img' />
			  {complaint.ApplyStatusStr}
			</div>
		  </div>
		);
	  case 0:
	    return ( 
		  <div className='processReply'>
			<div 
			  onClick={this.complaintConfirm.bind(this,true)}
			>
			  <img src={require('../icon/good-gray.png')}  alt='img' />
			  已解决
			</div>
			<div 
			  style={{border:'none'}}
			  onClick={this.complaintConfirm.bind(this,false)}
			>
			  <img src={require('../icon/bad.png')} alt='img'  />
			  未解决
			</div>
		  </div>
		);
	  case 1:
		if(!isManage)return;
	    return ( 
		  <div className='processReply'>
			<div 
			  onClick={this.complaintConfirm.bind(this,true)}
			>
			  <img src={require('../icon/good-gray.png')}  alt='img' />
			  转发给物业
			</div>
			<div 
			  style={{border:'none'}}
			  onClick={this.complaintConfirm.bind(this,false)}
			>
			  <img src={require('../icon/bad.png')} alt='img'  />
			  驳回
			</div>
		  </div>
		);
	  default:
	    return;
	}
  }
  
  fileItemClick = (item) => {
	let imgSrcPreUrl = sessionStorage.fileUrl + '/File/DownloadFile?iszip=false&fileids=';
	let options = {
	  imgUrl:imgSrcPreUrl+item.fileid
	};
	let imgExtList = 'png,jpg,gif,jpeg';
	if(imgExtList.indexOf(item.ext.toLowerCase()) !== -1){
	  selFunc.modal(PicView,options);
	}
  }
  render() {
	const {complaint,workflowList,tabValue} = this.state;
	
	if(this.state.loading){
  	  return (
  	  	<div>loading</div>
  	  )
    }
	
	let tabList = [
	  {value:1,Title:'基本信息'},
	  {value:2,Title:'流程信息'},
	];
    return (
	  <div>
		<TopNavBar title={complaint.ResidenceName} showLC/>
		<div className='formBox' style={{background:'#fff'}}>
		  <div className='tabMenu' style={{background:'#fff',display:'none'}}>
		    {tabList.map(item =>
			  <div key={item.value} onClick={this.setTabValue.bind(this,item.value)}>
			    <span className={item.value === tabValue?'tabActive':''}>
				  {item.Title}
				</span>
			  </div>
			)}
		  </div>
		  {tabValue === 1 && (()=> (
			<div className='complaintDetail'  >
	          <div className='residence'>{complaint.Title}</div>
	          <div className='time'>
	            {selFunc.formatDate(complaint.CreatorTime,'-')}
	          </div>
	          <div className='content'> 
	            {complaint.Content}
	          </div>
			  <ImgList imgList={complaint.imgSrcList} />
		    </div>
		  ))()}
		  <div style={{height:12,backgroundColor:'#eee'}}></div>
		  {tabValue === 1 && (()=> (
		    <div className='workflowList'>
		     {complaint.ComplaintWfList.map((item,index) => (
		    	<div className='workflowItem' key={index}>
		    	  <div className='stepNumber'>{index + 1}</div>
		    	  <span className='userName'>{item.AuditUserName}</span>
		    	  <span className='stepText'>{item.AuditStep}</span>
		    	  <span className='time' style={{display:item.AuditTime?'':'none'}}>时间：{item.AuditTime && item.AuditTime.replace('T',' ')}</span>
		    	  <span className={'status' + item.AuditStatus} style={{display:index===0?'none':''}}>处理状态：{item.AuditStatusStr}</span>
		    	  <span className='content'style={{display:(index===0 || !item.AuditComment)?'none':''}}>
				    处理意见：{item.AuditComment}
				  </span>
				  {item.FileIds && item.FileIds.indexOf('[') !== -1 && item.FileIds !== '[]' && (()=> (
				    <span className='files' style={{display:index===0?'none':''}}>
					  <div>附件：</div>
				       {eval(item.FileIds).map((i,index) => (
				         <div 
					      key={index} 
					  	  className='fileItem'
					  	  onClick={this.fileItemClick.bind(this,i)}
					    >{i.name}.{i.ext}</div>
				       ))}
				    </span>
				  ))()}
					
		    	</div>
		     ))}
		    </div>
		  ))()}
		  
		  {tabValue === 1 && this.renderStatusForm(complaint.ApplyStatus)}
		  {tabValue === 1 && this.renderStatus(complaint.ApplyStatus)}
		</div>
      </div>
    );
  }
}

export default ComplaintDetail;
