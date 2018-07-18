import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import Index from './page/index';
import Login from './page/login';
import Register from './page/register';
import BindArea from './page/bindArea';
import BindAreaInfo from './page/bindAreaInfo';
import Notice from './page/notice';
import NoticeCommunityList from './page/noticeCommunityList';
import NoticeIndustryList from './page/noticeIndustryList';
import NoticeAdd from './page/noticeAdd';
import NoticeDetail from './page/noticeDetail';
import VoteList from './page/voteList';
import VoteListAll from './page/voteListAll';
import VoteAdd from './page/voteAdd';
import VoteAddSuccess from './page/voteAddSuccess';
import VotePage from './page/votePage';
import CreditList from './page/creditList';
import CreditDetail from './page/creditDetail';
import ProjectList from './page/projectList';
import ProjectDetail from './page/projectDetail';
import PublicityList from './page/publicityList';
import PublicityDetail from './page/publicityDetail';
import PersonalCenter from './page/personalCenter';


import Complaint from './page/complaint';
import ComplaintAdd from './page/complaintAdd';
import ComplaintList from './page/complaintList';
import ComplaintDetail from './page/complaintDetail';


import SaveSuccess from './page/saveSuccess';
import VoteSquare from './page/voteSquare';
import AffirmSuccess from './page/affirmSuccess';
import PersonalInfo from './page/personalInfo';


import {loginToSetToken} from './utils/func';
import {get} from './utils/request';

class App extends Component {  
  constructor(props) {  
    super(props);  
    this.state = { 
	  hasToken:!(!sessionStorage.Authorization || sessionStorage.Authorization === 'null' ),
	}
  }
  autoLogin(){
	const hasToken = !(!sessionStorage.Authorization || sessionStorage.Authorization === 'null' );
	if(hasToken || this.isNoLoginPage()) return;
	const weChatCode = sessionStorage.weChatCode;
	if(weChatCode && weChatCode !== 'null'){
      get(sessionStorage.apiUrl + '/UserByWeChatCode?code=' + weChatCode)
      .then(res => {
		//console.log(res);
		if(res.Data === null){
		  //let url = window.location.origin + window.location.pathname + '#/login';
		  //alert(url);
		  //get(sessionStorage.apiUrl + '/CodeUrl?redirect_uri=' + url)
		  //.then(res => {
		  //  alert(res.Data);
		  //  window.location.href = res.Data;
		  //})
		  window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxff2456f987559043&redirect_uri=http%3a%2f%2fxueyu365.tunnel.qydev.com%2fWeChatVote%2f%23%2flogin&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
		}else{
		  //console.log(res.Data);
		  loginToSetToken(res.Data.Id,res.Data.Password,this);
		}
      })
	} else{
	  window.location.href = '#/login';
	}
  }
  isNoLoginPage(){
    let noLoginPage = [
      'register',
  	  'login'
    ];
    for(var i = 0 ;i < noLoginPage.length ; i++){
      if(window.location.href.indexOf(noLoginPage[i]) !== -1) return true;
    }
    return false
  }

  render() {
	const hasToken = !(!sessionStorage.Authorization || sessionStorage.Authorization === 'null' );
	if(hasToken || this.isNoLoginPage()){
		
	}else{
	  this.autoLogin();
	  return <div>loading...</div>;
	}
    return (
		<Switch>
		  <Route path='/index' component={Index}/>
		  <Route path='/login' component={Login}/>
		  <Route path='/register' component={Register}/>
		  <Route path='/bindArea' component={BindArea}/>
		  <Route path='/bindAreaInfo/:id' component={BindAreaInfo}/>
		  
		  <Route path='/notice/menu' component={Notice}/>
		  <Route path='/notice/list1' component={NoticeIndustryList}/>
		  <Route path='/notice/list2' component={NoticeCommunityList}/>
		  <Route path='/notice/add' component={NoticeAdd}/>
		  <Route path='/notice/detail/:noticeId' component={NoticeDetail}/>
		  
		  
		  <Route path='/complaint/detail/:id' component={ComplaintDetail}/>
		  <Route path='/complaint/add' component={ComplaintAdd}/>
		  <Route path='/complaint/list' component={ComplaintList}/>
		  <Route path='/complaint' component={Complaint}/>
		  
		  <Route path='/vote/list/all' component={VoteListAll}/>
		  <Route path='/vote/list' component={VoteList}/>
		  <Route path='/vote/add' component={VoteAdd}/>
		  <Route path='/vote/addSuccess' component={VoteAddSuccess}/>
		  <Route path='/vote/page/:voteId' component={VotePage}/>
		  
		  <Route path='/credit/list' component={CreditList}/> 
		  <Route path='/credit/detail/:creditId' component={CreditDetail}/> 
		  
		  <Route path='/project/list' component={ProjectList}/>
		  <Route path='/project/detail/:projectId' component={ProjectDetail}/>
		  
		  <Route path='/publicity/list' component={PublicityList}/>
		  <Route path='/publicity/detail/:publicityId' component={PublicityDetail}/>
		  
		  <Route path='/personal/center' component={PersonalCenter}/>
		  
		  
		  <Route path='/saveSuccess/:voteId' component={SaveSuccess}/>
		  <Route path='/voteSquare' component={VoteSquare}/>
		  <Route path='/affirmSuccess' component={AffirmSuccess}/>
		  <Route path='/personalInfo' component={PersonalInfo}/>
		  
		  <Route exact path='/' component={VoteList}/>
		  <Route exact path='/' component={Index}/>
		</Switch>
    );
  }
}

export default App;
