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
  },
  formattedDate: function() {
    return timeSince(this.date);
  }
});