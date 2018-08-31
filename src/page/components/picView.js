import React, { Component } from 'react';






class PicView extends Component{
  handleClose = () => {
	const {onClose} = this.props;
	onClose();
  }
  banBack = (e)=>{
	if (e.state && e.state.target === 'MeanSure') {
	  this.handleClose();
	  window.history.go(-1);
	} 
  }
  componentDidMount(){
	if (!(window.history.state && window.history.state.target == 'Final')) {
	  window.history.pushState({target: 'MeanSure', random: Math.random()}, '', '');
	  window.history.pushState({target: 'Final', random: Math.random()}, '', '');
	}
	window.addEventListener('popstate', this.banBack, false);
  }
  componentWillUnmount(){
	window.removeEventListener('popstate', this.banBack, false);
	if(window.history.state.target === 'Final'){
	  window.history.go(-2);
	}
  }
  render(){
	const {options} = this.props;
  	return (
	  <div className='picView' style={{height:window.innerHeight,width:window.innerWidth}} onClick={this.handleClose}>
		<img src={options.imgUrl} alt='1' />
	  </div>
	);
  }
}
export default PicView;
