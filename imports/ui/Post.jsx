import React, { Component, PropTypes } from 'react';

import { Posts } from '../api/posts.js';

export default class Post extends Component {

	handleClick() {
		Posts.update(this.props.post._id, {
			$set: { points: this.props.post.points++ }
		});
	}

	render() {
		return (
			<li><i className="fa fa-chevron-circle-up" onClick={this.handleClick.bind(this)}> {this.props.post.points} </i> {this.props.post.text}</li>
		);
	}
}

Post.PropTypes = {
	post: PropTypes.object.isRequired
};