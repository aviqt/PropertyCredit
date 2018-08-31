import React, { Component } from 'react';
import { Upload, message, Button, Icon } from 'antd';

const props = {
  name: 'file',
  multiple:true,
  action: sessionStorage.fileUrl + '/File/UploadSimpleFile',
  headers: {
    authorization: 'authorization-text',
  },
  listType:'picture-card',
  accept:'image/jpg,image/jpeg,image/png'
};
class ImgUpload extends Component {
  uploadOnChange = (info) => {
	if (info.file.status !== 'uploading') {
      //console.log(info.file, info.fileList);
	  if(this.props.toParent){
        this.props.toParent(info);
      } 
    }
    if (info.file.status === 'done') {
      message.success(info.file.name + ' 上传成功.');
    } else if (info.file.status === 'error') {
      message.error(info.file.name + ' 上传失败.');
    } 
	
  }
  render() {
	 
    return (
      <Upload {...props} onChange = {this.uploadOnChange}>
        <img src={require('../../images/addBig.png')} alt='1' style={{width:86}} />
      </Upload>
    );
  }
}

export default ImgUpload;
