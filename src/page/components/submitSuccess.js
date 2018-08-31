import React, { Component } from 'react';




const submitSuccess = require('../../images/evaluation/submit-success.png');
class SubmitSuccess extends Component{
  componentDidMount(){
    setTimeout(() => {
	  this.handleClose();
	},700)
  }
  handleClose = () => {
	const {onClose} = this.props;
	onClose();
	window.history.go(-1);
  }
  render(){
  	return (
	  <div className='submitSuccess' onClick={this.handleClose}>
		<img src={submitSuccess} alt='1'/>
	  </div>
	);
  }
}

export default SubmitSuccess;
