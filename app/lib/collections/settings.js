Settings = new Mongo.Collection("settings");

Meteor.methods({
  addSetting(name, state) {
    if(Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'])) {
      Settings.insert({
        name: name,
        state: state
      });
    } else {
      throw new Error('Permission denied!');
    }
  }
});