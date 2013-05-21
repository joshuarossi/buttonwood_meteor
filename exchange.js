Bids = new Meteor.Collection("bids");
Asks = new Meteor.Collection("asks");

function click_input_add(kind) {
  var user = Meteor.user();
  if (user == null) {
    alert('login to put your order on the book');
    return;
  }
  var email = user.emails[0].address;
  var price = document.getElementById(kind + '_price').value;
  var size = document.getElementById(kind + '_size').value;
  //console.log("user.id is " + user._id);
  if (kind == 'ask') {
    Asks.insert({user_id: user._id, name: email, price: price, size: size});
  } else {
    Bids.insert({user_id: user._id, name: email, price: price, size: size});
  }
  document.getElementById(kind + '_price').value = '';
  document.getElementById(kind + '_size').value = '';
}

if (Meteor.isClient) {
  Template.bid_list.bids = function() {
    return Bids.find({}, {sort: {price: -1}});
  };
  Template.ask_info.is_mine = function() {
    return (this.user_id === Meteor.userId());
  };
  Template.ask_list.asks = function() {
    return Asks.find({}, {sort: {price: 1}});
  };
  Template.user_email = function() {
    return Meteor.user().emails[0].address;
  };
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
      Bids.remove(this._id)
    }
  });
}


