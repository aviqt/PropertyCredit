import React, { Component } from 'react';
import { Link } from 'react-router-dom'





class VoteImgList extends Component {
  constructor(props){
    super(props)
    this.state = {
		votes:this.props.votes?this.props.votes:[],
		width:this.props.votes.length*200
	}
  }
  render() {
    return (
	  <div className='vote-img-list'>
		<div className='vote-img-list-inner' style={{width:this.state.width}}>
			{this.state.votes.map((vote,index) => 
				<div className='vote-img' key={'vote-img-item'+index}>
					<span>{vote.title}</span>
					<div><Link to={{pathname:"/add",state:{ voteId: vote.id,title:vote.title }}}><img alt={vote.title} src={vote.img}  /></Link></div>
				</div>
			)}
		</div>
	  </div>
    );
  }
}

export default VoteImgList;
