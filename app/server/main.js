Roles.addUsersToRoles("MMbr4nDbLgx5DwuMS", 'super-admin');

Meteor.startup(function() {
  var settingCount = Settings.find({name: 'postApproval'}).count();
  if(!(settingCount > 0)) {
    Settings.insert({
      name: "postApproval",
      state: true
    });
  }
});