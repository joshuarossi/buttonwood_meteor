console.log("loading exchange");

Bids = new Meteor.Collection("bids");
Asks = new Meteor.Collection("asks");

function noLocation() {
  alert("Could not find location");
}

function distance(pos1, pos2) {
  var lat1 = pos1.coords.latitude;
  var lat2 = pos2.coords.latitude;
  var lon1 = pos1.coords.longitude;
  var lon2 = pos2.coords.longitude;
  var p1 = new LatLon(Geo.parseDMS(lat1), Geo.parseDMS(lon1));
  var p2 = new LatLon(Geo.parseDMS(lat2), Geo.parseDMS(lon2));
  var d = p1.distanceTo(p2);
  return d;
}

function click_input_add(kind) {
  var user = Meteor.user();
  if (user === null) {
    alert('login to put your order on the book');
    return;
  }
  var email = user.emails[0].address;
  var price = document.getElementById(kind + '_price').value;
  var size = document.getElementById(kind + '_size').value;
  if (price === '' || size === '') {
    alert('must have valid price and size');
  }
  else {
    if (kind == 'ask') {
      Asks.insert({user_id: user._id, name: email, price: price, size: size});
    }
    if (kind == 'bid') {
      Bids.insert({user_id: user._id, name: email, price: price, size: size});
    }
  }
  document.getElementById(kind + '_price').value = '';
  document.getElementById(kind + '_size').value = '';
}

if (Meteor.isClient) {

  function getUserEmail() {
    var user = Meteor.user();
    if (user === null || typeof user === 'undefined') { return ""; }
    var e = user.emails;
    if (e === null || typeof e === 'undefined') { return ""; }
    return e[0].address;
  }

  function updatePosition(position) {
    var user = Meteor.user();
    if (user === null) {
      return;
    }
    Meteor.users.update({_id: user._id}, {$set: {"profile.position": position}});
  }

  function getNearbyOrders(collection) {
    var position = null;
    try {
      var user = Meteor.user();
      position = user.profile.position;
    } catch (err) {
      alert("login and update your position to see bids/asks near you");
      return new Array();
    }
    // this is not gonna scale..
    var allbids = collection.find({}, {sort: {price: -1}});
    return allbids.map(function (bid) {
      buser = Meteor.users.findOne({_id: bid.user_id});
      if (buser === null) { return false; }
      var bpos = buser.profile.position;
      if (bpos === null) { return false; }
      var d = distance(bpos, position);
      bid.distance = d;
      return bid;
    }).filter(function (bid) {
      //return bid.distance <= 0.1;
      return true;
    })
  }

  Template.bid_list.bids = function() { return getNearbyOrders(Bids); };
  Template.ask_info.is_mine = function() {
    return (this.user_id === Meteor.userId());
  };
  Template.ask_list.asks = function() { return getNearbyOrders(Asks); };
  Template.bid_list.user_email = function() { return getUserEmail(); };
  Template.ask_list.user_email = function() { return getUserEmail(); };
  Template.ask_list.events({
    'click input.add': function() { click_input_add("ask"); }
  });
  Template.bid_list.events({
    'click input.add': function() { click_input_add("bid"); }
  });
  Template.ask_list.events({
    'click input.remove': function(){ Asks.remove(this._id); }
  });
  Template.bid_list.events({
    'click input.remove': function(){
      Bids.remove(this._id);
    }
  });
  Template.location.events({
    'click input.location': function(){
      navigator.geolocation.getCurrentPosition(updatePosition, noLocation);
    }
  });
  Template.location.logged_in = function() {
    return (Meteor.user() != null);
  };
  Template.location.position = function() {
    var pos = null;
    try {
      var user = Meteor.user();
      pos = user.profile.position;
    } catch (err) {
      return false;
    }
    return "lat " + pos.coords.latitude + "lon " + pos.coords.longitude;
  };
}


