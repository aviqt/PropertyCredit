import React, { Component } from 'react';



function banBack(Comp){
  	class NewComponent extends Component{
	  banBack = (e) => {
		const {onClose} = this.props;
		if (e.state && e.state.target === 'MeanSure') {
		  onClose();
		  window.history.go(-1);
		} 
	  }
	  componentDidMount(){
		if (!(window.history.state && window.history.state.target === 'Final')) {
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
		return (
		  <Comp 
		    {...this.props} 
		  />
		);
	  }
	}
	return NewComponent;
}
export default banBack;
