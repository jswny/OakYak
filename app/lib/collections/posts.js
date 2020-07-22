Posts = new Mongo.Collection("posts");

Meteor.methods({
  addPost: function(post) {
    Posts.insert(post);
  },
  updatePoints: function(id, points) {
    Posts.update(id, {$set: {points: points}});
  },
  updateStatus(id, status) {
    if(Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'])) {
      Posts.update(id, {$set: {status: status}});
    } else {
      throw new Error('Permission denied!');
    }
  },
  updatePinned(id, pinned) {
    if(Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'])) {
      Posts.update(id, {$set: {pinned: pinned}});
    } else {
      throw new Error('Permission denied!');
    }
  },
  togglePostApproval(toggle) {
    if(Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'])) {
      Settings.update({name: "postApproval"}, {$set: {state: toggle}});
    } else {
      throw new Error('Permission denied!');
    }
  }
});