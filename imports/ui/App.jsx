import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Posts } from '../api/posts.js';

import Post from './Post.jsx';

class App extends Component {

	handleSubmit(event) {
		event.preventDefault();

		const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

		Posts.insert({
			text,
			points: 0,
			createdAt: new Date()
		});

		ReactDOM.findDOMNode(this.refs.textInput).value = '';
	}

	renderPosts() {
		return this.props.posts.map((post) => (
			<Post key={post._id} post={post} />
		));
	}

	render() {
		return (
			<div className="container">
				<header>
					<h1>Yaq</h1>

					<form className="new-post" onSubmit={this.handleSubmit.bind(this)} >
						<input
							type="text"
							ref="textInput"
							placeholder="Type to add a new post"
						/>
					</form>
				</header>

				<ul>
					{this.renderPosts()}
				</ul>
			</div>
		);
	}
}

App.PropTypes = {
	posts: PropTypes.array.isRequired
};

export default createContainer(() => {
	return {
		posts: Posts.find({}, { sort: { createdAt: -1} }).fetch()
	};
}, App);