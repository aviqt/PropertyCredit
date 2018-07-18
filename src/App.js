import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import Index from './page/index';
import Login from './page/login';
import Register from './page/register';
import BindArea from './page/bindArea';
import Notice from './page/notice';
import NoticeCommunityList from './page/noticeCommunityList';
import NoticeIndustryList from './page/noticeIndustryList';
import NoticeAdd from './page/noticeAdd';
import NoticeDetail from './page/noticeDetail';
import VoteList from './page/voteList';
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


import SaveSuccess from './page/saveSuccess';
import VoteSquare from './page/voteSquare';
import AffirmSuccess from './page/affirmSuccess';
import PersonalInfo from './page/personalInfo';



class App extends Component {  

  render() {
    return (
		<Switch>
		  <Route exact path='/' component={Index}/>
		  <Route path='/login' component={Login}/>
		  <Route path='/register' component={Register}/>
		  <Route path='/bindArea' component={BindArea}/>
		  
		  <Route path='/notice/menu' component={Notice}/>
		  <Route path='/notice/list1' component={NoticeIndustryList}/>
		  <Route path='/notice/list2' component={NoticeCommunityList}/>
		  <Route path='/notice/add' component={NoticeAdd}/>
		  <Route path='/notice/detail/:noticeId' component={NoticeDetail}/>
		  
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
		</Switch>
    );
  }
}

export default App;
