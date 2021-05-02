// Setup the variable to identify the GeoJSON
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a get request to the query URL. Once a response is received, send the data.features object to the createFeatures function
d3.json(queryUrl, function(data) {
    createFeatures(data.features);
    console.log(data.features);
});

// The function to run for each features array and give each feature a popup describing the place and time of the earthquake
function createFeatures(earthquakeData) {
    
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<h4>Magnitude: " + feature.properties.mag +"</h4>");
    }

    // A GeoJSON layer is created that contains the features array on the earthquakeData object.  The onEachFeature function is ran once for data item in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // Send the earthquake layers to the createMap function
    createMap(earthquakes);

// The function to change the marker size depending on the magnitude of the earthquake
function markerSize(mag){
    return mag * 5
}

// This function assigns colors to the circle markers
function setColors(d){
    if (d < 1){
        return "#fde725"
    }
    else if (d < 2){
        return "#b5de2b"
    }
    else if (d < 3){
        return "#35b779"
    }
    else if (d < 4){
        return "#26828e"
    }
    else if (d < 5){
        return "#3e4989"
    }
    else {
        return "#440154"
    }
};

// This function creates the markers and modify the markers apperance
function createMarkers(feature, latlng){

    var setMarkers = {
        radius: markerSize(feature.properties.mag),
        fillColor: setColors(feature.properties.mag),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }
    return L.createMarkers(latlng, setMarkers)
}

}

function createMap(earthquakes) {

    // Definte the lightmap layer
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });
    
    // Define a basemaps obeject that will hold the base layers
    var baseMaps = {
        // "Street Map":streetmap,
        "Light Map": lightmap,
        // "Satelitte Map": satellite
    };

    // Create the overlay obeject that will hold the overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create the map! Give it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });

    //  Create a legend to display map information
    var info = L.control({
        position: "bottomright"
    });
    // Add the legend to the map
    info.addTo(myMap);

    // Create a layer control and pass in the baseMaps and OverlayMaps, then add the control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}