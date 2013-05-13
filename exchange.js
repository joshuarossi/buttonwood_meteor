Bids = new Meteor.Collection("bids");
Asks = new Meteor.Collection("asks");

if (Meteor.isClient) {
  Template.bid_list.bids = function() {
  	return Bids.find({}, {sort: {price: -1}});
  };
  Template.ask_list.asks = function() {
  	return Asks.find({}, {sort: {price: 1}});
  };
  Template.ask_list.events({
  	'click input.add': function(){
  		var name = document.getElementById('ask_name').value;
  		var price = document.getElementById('ask_price').value;
  		var size = document.getElementById('ask_size').value;
  		Asks.insert({name: name, price: price, size: size});
  		document.getElementById('ask_name').value = '';
  		document.getElementById('ask_price').value = '';
  		document.getElementById('ask_size').value = '';
  	}
  });
  Template.bid_list.events({
  	'click input.add': function(){
  		var name = document.getElementById('bid_name').value;
  		var price = document.getElementById('bid_price').value;
  		var size = document.getElementById('bid_size').value;
  		Bids.insert({name: name, price: price, size: size});
  		document.getElementById('bid_name').value = '';
  		document.getElementById('bid_price').value = '';
  		document.getElementById('bid_size').value = '';
  	}
  });
  Template.ask_list.events({
  	'click input.remove': function(){
  		Asks.remove(this._id);
  	}
  });
  Template.bid_list.events({
  	'click input.remove': function(){
  		Bids.remove(this._id)
  	}
  });
}