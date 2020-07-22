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
      v0.1.0: First release.
      <br>
      v0.1.1: Fixed points calculations, mobile view.
      <br>
      v0.1.2: Fixed top menu bar, changed vote colors, easter egg 1.
      <br>
      v0.1.3: Fixed menu alert spacing, character limit, removing posts, easter egg 2.
      <br>
      v0.1.4: Restructured alert code, added 24h filter, added post approval.
      <br>
      v0.1.5: Restructured admin system, added pinned posts, secured collections.
      <br>
      v0.1.6: Admin hotfix.
      <br>
      v0.1.7: Added toggle for post approval, added settings, fixed double post IDs, added admin security, new admin system.
      <br>
      v0.1.8: Fixed settings collection, fixed pinned posts dissapearing.
      <br>
      v0.1.9: Added post dates, restructured code, further secured collections with subscriptions.
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