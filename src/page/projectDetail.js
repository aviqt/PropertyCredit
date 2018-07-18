import React, { Component } from 'react';
import { 
	List,
	InputItem
 } from 'antd-mobile';
import TopNavBar from './components/topNavBar';




class ProjectDetail extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  projectId:props.match.params.projectId,
	  project:[],
	}
  }componentDidMount(){
    this.getVoteData()
  }
  
  getVoteData(){
	let project = {
	  name:'东晟府物业服务项目',
	  areaName:'东晟府',
	  state:'管理中',
	  address:'鄞州区',
	  street:'火星街',
	  community:'月亮小区',
	  yrb:'2001年01月01日',
	  propertyRight:'性质',
	  total:'300',
	  company:'浙江申跃信息科技有限公司',
	  projectManager:'李求仙',
	  phone:'153 6548 1524',
	};
	this.setState({
	  project:project
	})
  }
  render() {
	const {project} = this.state
	  
    return (
	  <div>
		<TopNavBar title='项目信息' showLC/>
		<List className='formBox disabledInputDetail' style={{bottom:0}}>
		  <InputItem disabled value={project.name}>项目名称：</InputItem>
		  <InputItem disabled value={project.state}>项目状态：</InputItem>
		  <div style={{backgroundColor:'#f2f2f2',height:5}}></div>
		  <InputItem disabled value={project.areaName}>小区名称：</InputItem>
		  <InputItem disabled value={project.address}>县市(区)：</InputItem>
		  <InputItem disabled value={project.street}>所辖街道：</InputItem>
		  <InputItem disabled value={project.community}>所辖社区：</InputItem>
		  <div style={{backgroundColor:'#f2f2f2',height:5}}></div>
		  <InputItem disabled value={project.yrb}>建造年份：</InputItem>
		  <InputItem disabled value={project.propertyRight}>产权性质：</InputItem>
		  <InputItem disabled value={project.total}>总户数：</InputItem>
		  <div style={{backgroundColor:'#f2f2f2',height:5}}></div>
		  <InputItem disabled value={project.company}>企业名称：</InputItem>
		  <InputItem disabled value={project.projectManager}>项目经理：</InputItem>
		  <InputItem disabled value={project.phone}>联系方式：</InputItem>

		</List>
		

      </div>
    );
  }
}

export default ProjectDetail;
