Meteor.publish('posts', function() {
  if(Roles.userIsInRole(this.userId, ['super-admin', 'admin'])) {
    return Posts.find();
  } else {
    var dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    return Posts.find({$or: [{pinned: true}, {date: {$gt: dayAgo}}], status: "approved"});
  }
});
Meteor.publish('settings', function() {
  return Settings.find();
});