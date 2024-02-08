
// API endpoint frrom DataSF gov website 
const apiUrl = 'https://data.sfgov.org/resource/6r5h-j298.json?$query=SELECT%20%60address%60%0AWHERE%20%60enddate%60%20%3E%20%222024-02-01T12%3A56%3A54%22%20%3A%3A%20floating_timestamp%0AORDER%20BY%20%60datetimeentered%60%20ASC%20NULL%20LAST';
var adrs;
var geocoder;
var map;

// fetching addresses from sf gov
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Error fetching data.');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    adrs = data.map(function(data) {
        return data['address'].concat(", SAN FRANCISCO, CA, USA");
      });
      console.log(adrs);
  })
  .catch(error => {
    console.error('Error:', error);
  });


// initialize map to show San Francisco 
function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(37.758879,-122.446399);
    var mapOptions = {
      zoom: 12,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var input = document.getElementById('location');
    new google.maps.places.Autocomplete(input);
}
google.maps.event.addDomListener(window, 'load', initialize);

function codeAddress() {
    // check if address entered is in the string array
    var address = document.getElementById("location").value;
    console.log(address); 
    var match = (adrs.indexOf(address.toUpperCase()) > -1);
    if (match){
        document.getElementById('result').innerHTML = "&#10060; Tow away zone &#10060;";
    } else {
        document.getElementById('result').innerHTML = "&#9989; You're in the clear! &#9989;";
    }

    // creating and adding image based on result 
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
          map.setCenter(results[0].geometry.location);
          console.log(results[0].geometry.location);
          console.log(results[0].geometry.location);
          var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
          });
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
}

