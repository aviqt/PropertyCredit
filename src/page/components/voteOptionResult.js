import React, { Component } from 'react';
import { Icon,Toast } from 'antd-mobile';


class VoteOptionResult extends Component{
  constructor(props) {  
    super(props);  
    this.state = { 
	}
  }
  render(){
    const {VoteOptions,VoterCount} = this.props;
    return (
  	  <div >
        {VoteOptions.map((item,index) => 
		  <div className='optionResult' key={index}>
		    <span>{item.Content}</span>
		    <span style={{float:'right'}}>{item.OptionVoteCount}票({(item.OptionVoteCount/VoterCount*100).toFixed(1)}%)</span>
			<div className='progressBar'>
			  <div style={{width:(item.OptionVoteCount/VoterCount*100).toFixed(1)+'%'}}></div>
			</div>
		  </div>
        )}
      </div>
    );
  }
}


export default VoteOptionResult;
