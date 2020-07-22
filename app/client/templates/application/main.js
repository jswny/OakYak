Template.body.helpers({
  posts: function() {
    Session.setDefault("sort", "hot");
    var dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    if(Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'])) {
      if (Session.get("sort") == "new") {
        return Posts.find({$or: [{pinned: true}, {date: {$gt: dayAgo}}], status: "approved"}, {sort: {pinned: -1, date: -1}});
      } else if(Session.get("sort") == "status") {
        return Posts.find({$or: [{pinned: true}, {date: {$gt: dayAgo}}], status: "pending"}, {sort: {status: -1}});
      } else if(Session.get("sort") == "all"){
        return Posts.find({}, {sort: {points: -1}});
      } else {
        return Posts.find({$or: [{pinned: true}, {date: {$gt: dayAgo}}], status: "approved"}, {sort: {pinned: -1, points: -1}});
      }
    } else {
      if (Session.get("sort") == "new") {
        return Posts.find({}, {sort: {pinned: -1, date: -1}});
      } else {
        return Posts.find({}, {sort: {pinned: -1, points: -1}});
      }
    }
  },
  customAlertsTop: function() {
    return Alerts.find({location: "top", disabled: false});
  },
  customAlertsBottom: function() {
    return Alerts.find({location: "bottom", disabled: false});
  },
  sort: function() {
    return Session.get("sort");
  },
  isAdmin: function() {
    return Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin']);
  },
  login: function() {
    Session.setDefault("login", false);
    return Session.get("login");
  },
  postApproval: function() {
    var val = Settings.findOne({name: 'postApproval'}, {fields: {state: 1} });
    return val.state;
  }
});

Template.body.events({
  "click #new-post": function(event, template) {
    var text = template.find("#post-input").value;

    Alerts.update({alertType: "danger", alertType: "warning"}, {$set: {disabled: true}}, {multi: true});

    if(text == "enable-login") {
      Session.set("login", true);
      template.find("#post-input").value = "";
    } else {
      if((text.length < 10 || text.length > 200) && !Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'])) {
        Alerts.update({alertId: "charWarning"}, {$set: {disabled: false}});
      } else {
        if(text.toLowerCase().indexOf("joe") > -1 && !Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'])) {
          Alerts.update({alertId: "shitWarning"}, {$set: {disabled: false}});
        } else {
          var status;
          if(Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin']) || !Settings.findOne({name: 'postApproval'}, {fields: {state: 1} }).state) {
            status = "approved";
          } else {
            status = "pending";
          }
          Meteor.call("addPost", {
            status: status,
            pinnned: false,
            text: text,
            date: new Date(),
            points: 0
          });

          template.find("#post-input").value = "";

          Alerts.update({alertId: "posted"}, {$set: {disabled: false}});
        }
      }
    }
  },
  "click #post-input": function() {
    // Alerts.update({alertId: "postWarning"}, {$set: {disabled: false}});
  },
  "click #sort-new": function() {
    Session.set("sort", "new");
  },
  "click #sort-hot": function() {
    Session.set("sort", "hot");
  },
  "click #sort-status": function() {
    Session.set("sort", "status");
  },
  "click #sort-all": function() {
    Session.set("sort", "all");
  },
  "click #version": function() {
    Alerts.update({alertId: "version"}, {$set: {disabled: false}});
  },
  "click #oak-tree": function() {
    var enabled;
    if(Settings.findOne({name: 'postApproval'}, {fields: {state: 1} }).state) {
      enabled = "<strong>enabled<strong>.";
    } else {
      enabled = "<strong>disabled<strong>.";
    }
    Alerts.update(
      {alertId: "stats"},
      {$set: {disabled: false, text: "Total posts: " + Posts.find().count() + '<br> Post approval is ' + enabled}}
    );
  },
  "click #toggle-approval": function() {
    Meteor.call("togglePostApproval", !Settings.findOne({name: 'postApproval'}, {fields: {state: 1} }).state);
  }
});