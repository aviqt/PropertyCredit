import React, { Component } from 'react';
import { 
	SearchBar
 } from 'antd-mobile';
import { Link } from 'react-router-dom';
import TopNavBar from './components/topNavBar';
import Footer from './components/footer';
import ListView from './components/listView';


const nowTimeStamp = Date.now();


const companyList = [
	{year:2017,unit:'宁波住建委',date:nowTimeStamp,score:90,isCompany:true,title:'腾讯科技（北京）有限公司'},
	{year:2017,unit:'宁波住建委',date:nowTimeStamp,score:90,isCompany:true,title:'浙江申跃信息科技有限公司'},
	{year:2017,unit:'宁波住建委',date:nowTimeStamp,score:90,isCompany:true,title:'腾讯科技（北京）有限公司'},
	{year:2017,unit:'宁波住建委',date:nowTimeStamp,score:90,isCompany:true,title:'腾讯科技（北京）有限公司'},
];
const pmList = [
	{year:2017,unit:'宁波住建委',date:nowTimeStamp,score:90,isCompany:false,title:'马化腾'},
];

const tabList = [
	{value:true,title:'搜索企业'},
	{value:false,title:'搜索项目经理'},
];



class CreditList extends Component {
  constructor(props) {  
    super(props);  
    this.state = { 
	  keyWords:'',
	  showCompany:true,
	  creditList:companyList.concat(pmList),
	}
  }
  componentDidMount() {
	
  }

  setShowCompany = (value) =>{
    this.setState({
  	  showCompany:value,
    })
  }
  formatDate(timeStamp,str){
	let date = new Date(timeStamp);
	return (
	  date.getFullYear() + '年' + 
	  (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '月' + 
	  (date.getDate() > 9 ? date.getDate() :'0' + date.getDate()) + '日' 
	);
  }
  renderHeightlightKeyWords(text,keyWords){
	return keyWords === '' ? text : text.split(keyWords).map((item,index) => {
	  return index === 0 ? item : <font key={'HeightlightKeyWords' + index}><font style={{color:'red'}}>{keyWords}</font>{item}</font>;
    })
  }
  render() {
    const {keyWords,showCompany} = this.state;
    return (
	  <div>
		<TopNavBar title='信用查询' />
		<div className='mainBox'>
		  <div className='tabMenu'>
		    {tabList.map(item =>
			  <div key={item.value} onClick = {this.setShowCompany.bind(this,item.value)}>
			    <span className={item.value === showCompany?'tabActive':''}>
				  {item.title}
				</span>
			  </div>
			)}
		  </div>
		  <SearchBar
			placeholder = {showCompany?'企业名称':'项目经理姓名'}
			value={keyWords}
			onChange={keyWords => {this.setState({keyWords})}}
		  />
		  <ListView
		    style = {{top:100}}
		    className = 'listBox' 
		    data = {this.state.creditList.filter(item => item.isCompany === showCompany && (item.title.indexOf(keyWords) >= 0 ))}
		    row ={(item,index) => 
		  	  <Link to={'/credit/detail/'+index} key={'item'+index}>
		  	    <div className='item'>
		  	  	  <strong>{this.renderHeightlightKeyWords(item.title,keyWords)}<span>{item.year}年</span></strong>
		  	  	  <span style={{width:'70%'}}>信用分数：{item.score}分</span>
		  	  	  <span style={{width:'70%'}}>评价单位：{item.unit}</span>
		  	  	  <span style={{width:'70%'}}>评价日期：{this.formatDate(item.date)}</span>
		  	  	  <div className='circleText'>AAA</div>
		  	    </div>
		  	  </Link>
			}
		  />
		</div>

		
		<Footer pageIndex={1}/>
      </div>
    );
  }
}




export default CreditList;
