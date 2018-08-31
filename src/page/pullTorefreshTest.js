import React, { Component } from 'react';
import { PullToRefresh, Button } from 'antd-mobile';
import ReactDOM from 'react-dom';

function genData() {
  const dataArr = [];
  for (let i = 0; i < 20; i++) {
    dataArr.push(Math.random()*10);
  }
  return dataArr;
}

class PullTorefreshTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      down: true,
      height: document.documentElement.clientHeight,
      data: [],
    };
  }

  componentDidMount() {
    this.getData();
  }
  getData = ()=>{
	setTimeout(() => this.setState({
      data: genData(),
	  refreshing: false
    }), 0);
  }
  
  
  pullToRefresh = ()=> {
	this.setState({ refreshing: true });
	setTimeout(() => {
	  this.getData();
	}, 1000); 
  }
  render() {
    return (<div>
      <PullToRefresh
        damping={60}
        direction='down'
        refreshing={this.state.refreshing}
        onRefresh={this.pullToRefresh}
      >
        {this.state.data.map(i => (
          <div key={i} style={{ textAlign: 'center', padding: 20 }}>
            {this.state.down ? 'pull down' : 'pull up'} {i}
          </div>
        ))}
      </PullToRefresh>
    </div>);
  }
}
export default PullTorefreshTest;
