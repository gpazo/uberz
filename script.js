$(window).load(function() {
    // Construct the catalog query string
    url = 'http://data.sfgov.org/resource/rqzj-sfat.json';

    // Intialize our map
    var mapOptions = {
      zoom: 8
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Retrieve our data and plot it
$.getJSON(url, function(data, textstatus) {
  //iterate through the list
    $.each(data, function(i, entry) {
        //if it has a location and it is approved, plot it
        if(entry.location !== undefined && entry.status== "APPROVED"){
              //remove : from data, replace with more legible commas
              var parseMenu = entry.fooditems.split(':').join(',');
              //populate the infoWindow with something useful: foodtruck name, menu, and schedule
              var contentString = '<div id="content">'+
                                  '<div id="siteNotice">'+
                                  '</div>'+
                                  '<h1 id="firstHeading" class="firstHeading">'+entry.applicant+'</h1>'+
                                  '<div id="bodyContent">'+
                                  '<p>'+ parseMenu +'</p>'+
                                  '<p>Schedule: <a href="'+ entry.schedule +'">'+
                                  ''+entry.schedule+'</a> '+
                                  '</div>'+
                                  '</div>';
              var infowindow = new google.maps.InfoWindow({
              content: contentString
              });
              //create a map marker for each food truck location
              var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(entry.location.latitude,
                                                   entry.location.longitude),
                  map: map,
                  title: entry.applicant
              });
              //on-click open the infoWindow object for each map marker
          google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
          });
        }
    });
});
      // begin geolocate code
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      //infoWindow shows you where you are on the map
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'You are here.'
      });
      //center the map on the user's location
      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
  //TODO: Add more error checking or a call to another service if HTML5 geolocation is not supported
    function handleNoGeolocation(errorFlag) {
      if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
      } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
      }

    }
    //end geolocate code
  });

