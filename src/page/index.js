import React, { Component } from 'react';
import {
	Carousel,
} from 'antd-mobile';
import Footer from './components/footer';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom';


			  
const slideImgList = [
			{src: "http://imgs.aixifan.com/o_1cbrsvae053bo0r11arplk15ia1k.jpg", name: "图片1"},
			{src: "http://imgs.aixifan.com/o_1cdi1tr211j2312t13r91d41m6e1m.jpg", name: "图片2"},
			{src: "http://imgs.aixifan.com/o_1cdi1tr211f24qamnmjte919ah1f.jpg", name: "图片3"},
			{src: "http://imgs.aixifan.com/o_1cdi1tr22184dao61jb61f1p15du25.jpg", name: "图片4"}
		];
const menuList = [
			{url:'/notice/menu',name:'通知公告',icon:require('../icon/horn.svg')},
			{url:'/publicity/list',name:'公示信息',icon:require('../icon/info.svg')},
			{url:'/credit/list',name:'信用查询',icon:require('../icon/search2.svg')},
			{url:'/vote/list',name:'投票表决',icon:require('../icon/vote2.svg')},
			{url:'/project/list',name:'项目信息',icon:require('../icon/list.svg')},
		];
		
		
class Index extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  slideImgHeight:1
	}
  }
  componentWillMount(){
    if (false) {
      this.props.history.push('/login', null);
    }
  }
  render() {
    return (
	  <div >
		<TopNavBar title='阳光 · 物业'/>
		<div className='mainBox'>
		  <Carousel autoplay={false} infinite>
		    {slideImgList.map(val =>
			  <img 
			    key={val.src}
			    src={val.src} 
			    alt={val.name} 
			    style={{height:this.state.slideImgHeight}}
				onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ slideImgHeight: 'auto' });
                }}
			  />
		    )}
		  </Carousel>
		  <div className='indexNotice'>
			<span>小区通知</span>
			<a>玫瑰园小区3月8日14：00至19：00全小区进行管道检查，请广大业主提前做好准备工作。</a>
		  </div>
		  <div className='indexMenu'>
		  {menuList.map(item => 
		    <Link to={item.url} key={item.icon+item.url}>
			  <div>
			    <img src={item.icon} alt={item.icon} /><br />
			    {item.name}
			  </div>
			</Link>
		  )}
			
		  </div>
		</div>
		<Footer />
	  </div>
    );
  }
}

export default Index;
