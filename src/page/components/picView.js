import React, { Component } from 'react';
import banBack from '../../utils/banBack';
import {selFunc} from '../../utils/func';
import {selImg} from '../../utils/config';


class PicView extends Component{
  handleClose = () => {
	const {onClose} = this.props;
	onClose();
  }
  render(){
	const {options} = this.props;
  	return (
	  <div className='picView' style={{height:window.innerHeight,width:window.innerWidth}} onClick={this.handleClose}>
		<img src={options.imgUrl} alt='1' onError={selFunc.handleImageErrored.bind(this,selImg.imgLoadError)}/>
	  </div>
	);
  }
}
PicView = banBack(PicView);

export default PicView;
