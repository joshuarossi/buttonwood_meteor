Bids = new Meteor.Collection("bids");
Asks = new Meteor.Collection("asks");



function displayPosition(position) {
    alert("Latitude: " + Position.coords.latitude + ", Longitude: " + Position.coords.longitude);
}

setPosition = function (position) {
    Session.set("location", {"latitude": Position.coords.latitude, "longitude": Position.coords.longitude});
};
displayError = function () {
    var errors = {
        1: 'Permission denied',
        2: 'Position unavailable',
        3: 'Request timeout'
    };
    alert("Error: " + errors[error.code]);
};

get_location = function () {
    if (navigator.geolocation) {
        var timeoutVal = 10 * 1000 * 1000;
        navigator.geolocation.watchPosition(
            displayPosition(Position),
            displayError(),
            { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
        );
    }
    else {
        alert("Geolocation is not supported by this browser");
    }
};

function click_input_add(kind) {
  var user = Meteor.user();
  if (user === null) {
    alert('login to put your order on the book');
    return;
  }
  var email = user.emails[0].address;
  var price = document.getElementById(kind + '_price').value;
  var size = document.getElementById(kind + '_size').value;
  //console.log("user.id is " + user._id);
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
  get_location();

  Template.bid_list.bids = function() {
    return Bids.find({}, {sort: {price: -1}});
  };
  Template.ask_info.is_mine = function() {
    return (this.user_id === Meteor.userId());
  };
  Template.ask_list.asks = function() {
    return Asks.find({}, {sort: {price: 1}});
  };
 Template.ask_list.events({
    'click input.add': function() { click_input_add("ask");}
  });
  Template.bid_list.events({
    'click input.add': function() { click_input_add("bid");}
  });
  Template.ask_list.events({
    'click input.remove': function(){
        Asks.remove(this._id);
    }
  });
  Template.bid_list.events({
    'click input.remove': function(){
        Bids.remove(this._id);
    }
  });
}



