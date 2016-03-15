Posts = new Mongo.Collection("posts");
Settings = new Mongo.Collection("settings");

// var settingCount = Settings.find({name: 'postApproval'}, {fields: {state: 1}}).count();
// console.log(settingCount);
// if(!(settingCount > 0)) {
//   Meteor.call("addSetting", "postApproval", true);
// }

if(Meteor.isServer) {
  Roles.addUsersToRoles("QDmj8TYMDhw9Ej5rc", 'super-admin');
}

if (Meteor.isClient) {
  Alerts = new Mongo.Collection(null);
  var alerts = [
    {
      alertId: "posted",
      alertType: "success",
      location: "bottom",
      dismissable: true,
      disabled: true,
      text: "Successfully posted!"
    },
    {
      alertId: "admin",
      alertType: "info",
      location: "top",
      dismissable: false,
      disabled: true,
      text: "You are an admin!"
    },
    {
      alertId: "version",
      alertType: "info",
      location: "top",
      dismissable: true,
      disabled: true,
      text:
      `
        v0.1.0: First release
        <br>
        v0.1.1: Fixed points calculations, mobile view
        <br>
        v0.1.2: Fixed top menu bar, changed vote colors, easter egg 1
        <br>
        v0.1.3: Fixed menu alert spacing, character limit, removing posts, easter egg 2
        <br>
        v0.1.4: Restructured alert code, added 24h filter, added post approval
        <br>
        v0.1.5: Restructured admin system, added pinned posts, secured collections
        <br>
        v0.1.6: Admin hotfix
        <br>
        v0.1.7: Added toggle for post approval, added settings, fixed double post IDs, added admin security, new admin system
      `
    },
    {
      alertId: "stats",
      alertType: "info",
      location: "top",
      dismissable: true,
      disabled: true,
      text: ""
    },
    {
      alertId: "charWarning",
      alertType: "danger",
      location: "bottom",
      dismissable: true,
      disabled: true,
      text: "Your post must be between 10 and 200 characters."
    },
    {
      alertId: "shitWarning",
      alertType: "danger",
      location: "bottom",
      dismissable: true,
      disabled: true,
      text: "Talk shit, get hit boi."
    },
    {
      alertId: "postWarning",
      alertType: "warning",
      location: "bottom",
      dismissable: true,
      disabled: true,
      text: "DON'T BE A DICK! kthx."
    }
  ];

  for(var i = 0; i < alerts.length; i++) {
    Alerts.insert(alerts[i]);
  }

  Template.body.helpers({
    posts: function() {
      var dayAgo = new Date();
      Session.setDefault("sort", "hot");
      dayAgo.setDate(dayAgo.getDate() - 1);
      if(Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin'])) {
        if (Session.get("sort") == "new") {
          return Posts.find({date: {$gt: dayAgo}, status: "approved"}, {sort: {pinned: -1, date: -1}});
        } else if(Session.get("sort") == "status") {
          return Posts.find({date: {$gt: dayAgo}, status: "pending"}, {sort: {status: -1}});
        } else if(Session.get("sort") == "all"){
          return Posts.find({}, {sort: {points: -1}});
        } else {
          return Posts.find({date: {$gt: dayAgo}, status: "approved"}, {sort: {pinned: -1, points: -1}});
        }
      } else {
        if (Session.get("sort") == "new") {
          return Posts.find({date: {$gt: dayAgo}, status: "approved"}, {sort: {pinned: -1, date: -1}});
        } else {
          return Posts.find({date: {$gt: dayAgo}, status: "approved"}, {sort: {pinned: -1, points: -1}});
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

  Template.customAlert.events({
    "click .close-custom-alert": function(event, template) {
      Alerts.update(this._id, {$set: {disabled: true}});
    }
  });

  Template.post.onCreated(function(){
    var template = this;
    template.userVote = new ReactiveVar(null);
    template.autorun(function() {
      var id = Template.currentData()._id;
      var userVote = null;
      if(typeof(Storage) !== "undefined") {
        userVote = localStorage.getItem("userVote-" + id);
      }
      template.userVote.set(userVote);
    });
  });

  Template.post.events({
    "click #upvote": function(event, template) {
      if (template.userVote.get() === "down") {
        Meteor.call("updatePoints", this._id, this.points + 2);
      } else {
        Meteor.call("updatePoints", this._id, this.points + 1);
      }
      localStorage.setItem("userVote-" + this._id, "up");
      template.userVote.set("up");
      return;
    },
    "click #downvote": function(event, template) {
      var tempPoints;
      if (template.userVote.get() === "up") {
        tempPoints = this.points - 2;
        Meteor.call("updatePoints", this._id, this.points - 2);
      } else {
        tempPoints = this.points - 1;
        Meteor.call("updatePoints", this._id, this.points - 1);
      }
      console.log(this.points);
      if(tempPoints <= -5) {
        Meteor.call("updateStatus", this._id, "removed");
      }

      localStorage.setItem("userVote-" + this._id, "down");
      template.userVote.set("down");
      return;
    },
    "click .post-approve": function(event, template) {
      Meteor.call("updateStatus", this._id, "approved");
    },
    "click .post-pend": function(event, template) {
      Meteor.call("updateStatus", this._id, "pending");
    },
    "click .post-remove": function(event, template) {
      Meteor.call("updateStatus", this._id, "removed");
    },
    "click .post-toggle-pin": function(event, template) {
      Meteor.call("updatePinned", this._id, !this.pinned);
    }
  });

  Template.post.helpers({
    isUpButtonDisabled: function(event, template) {
      var template = Template.instance();
      var userVote = template.userVote.get();
      return userVote === "up";
    },
    isDownButtonDisabled: function(event, template) {
      var template = Template.instance();
      var userVote = template.userVote.get();
      return userVote === "down";
    },
    isAdmin: function() {
      return Roles.userIsInRole(Meteor.userId(), ['super-admin', 'admin']);
    },
    isPinned: function(event, template) {
      return this.pinned;
    },
    isApproved: function() {
      return this.status == "approved";
    },
    isPending: function() {
      return this.status == "pending";
    },
    isRemoved: function() {
      return this.status == "removed";
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

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
  },
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
