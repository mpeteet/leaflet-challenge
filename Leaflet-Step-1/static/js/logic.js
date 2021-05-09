// create the base map
var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 5
  });

// add the light layer tile 
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
maxZoom: 18,
id: "mapbox/light-v10",
accessToken: API_KEY
}).addTo(myMap);


// Setup the variable to identify the GeoJSON
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// The function to change the marker size depending on the magnitude of the earthquake
function markerSize(mag){
    return mag * 5
}

// This function assigns colors to the circle markers
function setColors(d) {
  if (d < 1){
    return "#fde725"
  }
  else if ( d < 2){
    return "#b5de2b"
  }
  else if (d < 3){
    return "#35b779"
  }
  else if (d < 4){
    return "#26828e"
  }
  else if (d < 5 ){
    return "#3e4989"
  }
  else {
    return "#440154"
  }
};

// This function creates the markers and modify the markers apperance
function createMarkers(feature, latlng ){

  var setMarkers = {
    radius: markerSize(feature.properties.mag),
    fillColor: setColors(feature.properties.mag),
    color: "black",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
  return L.circleMarker( latlng, setMarkers );
};
  
// Perform a get request to the query URL. 
d3.json(queryUrl, function(data) {

  console.log(data)

  var earthquakes = data.features

  console.log(earthquakes)
  
  // Loop through each feature in the array and give each feature a popup describing the place and time of the earthquake
  earthquakes.forEach(function(result){
    //console.log(result.properties)
    L.geoJSON(result,{
      pointToLayer: createMarkers
      }).bindPopup("Date: " + new Date(result.properties.time) + "<br>Place: " + result.properties.place + "<br>Magnitude: " + result.properties.mag).addTo(myMap)
  });

  // Create the map legend
  var legend = L.control({position: "bottomright" });
  legend.onAdd = function(){
    // create div for the legend
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5]
        labels = [];

    // Loop through the density intervals and generate a label with a colored square for each one
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + setColors(grades[i]) + '"></i> ' +
            grades[i] + (grades[i +1 ] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
    console.log(legend)
  legend.addTo(myMap);
});

