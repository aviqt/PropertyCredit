import React, { Component } from 'react';
import { Upload, message, Button, Icon } from 'antd';

const props = {
  name: 'file',
  action: 'http://saturn.51vip.biz:8848/File/UploadSimpleFile',
  headers: {
    authorization: 'authorization-text',
  },
  listType:'picture-card',
  accept:'image/jpg,image/jpeg,image/png'
};
const imgSrcPre = 'http://saturn.51vip.biz:8848/File/DownLoadFile?iszip=false&fileids=';

class ImgUpload extends Component {
  constructor(props){
  	super(props);
  }
  uploadOnChange = (info) => {
	if (info.file.status !== 'uploading') {
      //console.log(info.file, info.fileList);
	  if(this.props.toParent){
        this.props.toParent(info);
      } 
    }
    if (info.file.status === 'done') {
      message.success(info.file.name + ' file uploaded successfully');
    } else if (info.file.status === 'error') {
      message.error(info.file.name + ' file upload failed.');
    } 
	
  }
  render() {
    return (
      <Upload {...props} onChange = {this.uploadOnChange}>
        <Button>
          <Icon type="upload" /> Add
        </Button>
      </Upload>
    );
  }
}

export default ImgUpload;
