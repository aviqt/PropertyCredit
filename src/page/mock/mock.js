import Mock from 'mockjs';

const nowTimeStamp = Date.now();
export default Mock.mock('/api/vote',{
  'title'			: '@cword(7,10)',  
  'describe'		: '@cparagraph()', 
  'voted'			: false, 
  'endDate'			: nowTimeStamp + Math.floor(Math.random(10)*24*3600*1000), 
  'maximum|1-4'		: 2, 
  'userList'		: ['','','','','','','','','','','','','','','','','','',], 
  'imgSrcList|4'	: [
						{
						  'src|+1': [
							'http://imgs.aixifan.com/o_1cbrsvae053bo0r11arplk15ia1k.jpg',
							'http://imgs.aixifan.com/o_1cdi1tr211j2312t13r91d41m6e1m.jpg',
							'http://imgs.aixifan.com/o_1cdi1tr211f24qamnmjte919ah1f.jpg',
							'http://imgs.aixifan.com/o_1cdi1tr22184dao61jb61f1p15du25.jpg'
						  ],
						  'name|+1': [
							'图片1',
							'图片2',
							'图片3',
							'图片4',
						  ],
						}
					  ],
					  
  'shortList'		: [
						{id:0,name:'广州',votes:345,selected:false},
						{id:1,name:'深圳',votes:787,selected:false},
						{id:2,name:'汕头',votes:466,selected:false},
						{id:3,name:'韶关',votes:453,selected:false}
					],
});