import React, { Component } from 'react';
import {
	Carousel,
	Icon,
	NavBar
} from 'antd-mobile';
import TopNavBar from './components/topNavBar';
import { Link } from 'react-router-dom';
import {get} from '../utils/request';
import {selFunc} from '../utils/func';
import ImgList from './components/imgList';


class CreditBuildDetail extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  id:props.match.params.id,
	  data:[],
	  loading:true,
	  imgHeight:1
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
	  title:'东晟府小区',
	  residence:'东晟府小区',
	  content:'这份特殊的汉堡和薯条是亚历山大在2012年6月7日购买的，一直存放在他的货架上，因听说快餐汉堡从不腐烂，便将这份汉堡保存做个测试，并在5年前将一份自制汉堡放在旁边作对比。结果表明，这些说法是正确的。',
	  imgSrcList:[
	    {src:'http://imgs.aixifan.com/o_1cbrsvae053bo0r11arplk15ia1k.jpg',name:'111'},
	    {src:'http://imgs.aixifan.com/o_1cdi1tr211j2312t13r91d41m6e1m.jpg',name:'222'},
	  ],
	  time:'2018-06-01 08:25:00',
	  status:2,
	};
	
	let url = sessionStorage.apiUrl + '/api/Credit/' + this.state.id;
	let imgSrcPreUrl = sessionStorage.fileUrl + '/File/DownloadFile?iszip=false&fileids=';
	get(url).then(res => {
	  var newData = res.Data;
	  console.log(newData);
	  data.title = newData.Title;
	  data.content = newData.Description;
	  data.time = newData.CreatorTime;
	  if(newData.FileIds && eval(newData.FileIds).length !== 0){
		let imgSrcList = [];
	    eval(newData.FileIds).map(item => {
	  	  let imgSrcItem = [];
	  	  imgSrcItem.src = imgSrcPreUrl + item.fileid;
	  	  imgSrcItem.name = item.name;
	  	  imgSrcList.push(imgSrcItem);
		  return false;
	    });
	    data.imgSrcList = imgSrcList;
	  }
	  this.setState({
	    loading:false,
	    data
	  })
	})
  }
  render() {
	const {data} = this.state;
	if(this.state.loading){
  	  return (
  	  	<div>loading</div>
  	  )
    }
    return (
	  <div>
	    <TopNavBar showLC back='0' title='诚信建设' />
		<div className='formBox' style={{background:'#eeeeee'}}>
		  <div className='complaintDetail'>
	        <div className='residence'>{data.title}</div>
	        <div className='time'>
			  {selFunc.formatDate(data.time,'-')}
	        </div>
	        <div className='content'> 
	          {data.content}
	        </div>
			<ImgList imgList={data.imgSrcList} />
		  </div>
		</div>
      </div>
    );
  }
}

export default CreditBuildDetail;
