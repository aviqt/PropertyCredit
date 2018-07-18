import React, { Component } from 'react';
import { 
	List,
	Button,
	TextareaItem,
	InputItem,
	ImagePicker,
	WingBlank,
	WhiteSpace
 } from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import { Link,Redirect  } from 'react-router-dom';



let eventPhotos = [{
  url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
  id: '2121',
}, {
  url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
  id: '2122',
}];


class NoticeAdd extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  areaName:'',
	  title:'',
	  describe:'',
	  eventPhotos:eventPhotos,
	}
  }


  imagePickerChange = (files,type,index) =>{
	  //console.log(files);
	  this.setState({
		  eventPhotos:files
	  })
  }
  addNoticeBtnClick = () => {
	this.setState({
		addLoading:true,
	})
	
  }

  render() {
	if(this.state.submitSuccess){
	  return (<Redirect to='/vote/addSuccess' />);
	}
	  
    return (
	  <div>
		<TopNavBar title='添加通知' showLC/>
		<List className='formBox'>
		  <InputItem
		    clear
			placeholder = '请输入'
		    value={this.state.areaName}
		    onChange={areaName => this.setState({ areaName })}
		  >小区名称</InputItem>
		  <InputItem
		    clear
			placeholder = '请输入'
		    value={this.state.title}
		    onChange={title => this.setState({ title })}
		  >通知标题</InputItem>
		  <TextareaItem
		    title='通知内容'
			placeholder = '请输入'
			rows='8'
			autoHeight
		    value={this.state.describe}
		    onChange={describe => this.setState({ describe })}
		  />
		  <List.Item>照片列表</List.Item>
		  <ImagePicker 
			files={this.state.eventPhotos}
			onChange={this.imagePickerChange}
			multiple={true}
		  />
		  <WhiteSpace size='md' />
		</List>
		
	    <div className='operationBtns'>
		  <WingBlank>
		    <WhiteSpace size='md' />
		    <Button 
			  loading={this.state.addLoading} 
			  style={this.state.addLoading?style.loadingBtn:style.btn} 
			  onClick={this.addNoticeBtnClick}
			>
			  {this.state.addLoading?'提交中 Loading':'提交'}
			</Button>
		    <WhiteSpace size='md' />
		    <Link to='/notice/menu' className='am-button'><span>取消</span></Link>
		    <WhiteSpace size='md' />
		  </WingBlank>
	    </div>
      </div>
    );
  }
}

const style ={
  loadingBtn:{
  	backgroundColor:'#a17e7e',
  	color:'white'
  },
  btn:{
    backgroundColor:'#18a3fe',
    color:'#fff',
  },
  btnActive:{
    backgroundColor:'gray'
  },
}
export default NoticeAdd;
