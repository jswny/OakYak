import React, { Component, PropTypes } from 'react';

export default class Post extends Component {
	render() {
		return (
			<li>{this.props.post.text}</li>
		);
	}
}

Post.PropTypes = {
	post: PropTypes.object.isRequired
};