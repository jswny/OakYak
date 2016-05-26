Template.customAlert.events({
"click .close-custom-alert": function(event, template) {
  Alerts.update(this._id, {$set: {disabled: true}});
}
});