Bids = new Meteor.Collection("bids");
Asks = new Meteor.Collection("asks");

function foundLocation(position)
{
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  alert('Found location: ' + lat + ', ' + long);
}

function noLocation()
{
  alert('Could not find location');
}

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
      if (ask_size>0 && ask_price>0){
  		Asks.insert({name: name, price: price, size: size});
      }
      else {
        window.alert("Must have Size and Price");
      }
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
      if (bid_size>0 && bid_price>0){
  		Bids.insert({name: name, price: price, size: size});
      }
      else {
        window.alert("Must have Size and Price");
      }
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
  Template.footer.events({
    'click input.location': function(){
      navigator.geolocation.getCurrentPosition(foundLocation, noLocation);
    }
  });
}