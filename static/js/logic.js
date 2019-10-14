// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


var myMap = L.map("map", {
  center: [40.167, -100.167],
  zoom: 3
});

// Create the tile layer that will be the background of our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

//
d3.json(url, response => {
    var mag_var = response.features;
    //loop through all earthhquakes listed
    for (var i = 0; i < mag_var.length; i++) {
        var magnitude = mag_var[i].properties.mag;
        var title = mag_var[i].properties.title;
        var latitude = mag_var[i].geometry.coordinates[1];
        var longitude = mag_var[i].geometry.coordinates[0];
        //define color categories based on magnitude 
        var color_cat = "green";
        if (magnitude >= 5) {
            color_cat = "red";
        }
        else if (magnitude >= 4) {
            color_cat = "orangered";
        }
        else if (magnitude >=3) {
            color_cat = "orange";
        }
        else if (magnitude >= 2) {
            color_cat = "yellow"
        }
        else if (magnitude >= 1) {
            color_cat = "greenyellow";
        }

        //add circles at  size each earthquake location. size and color indicate magnitude, popup describes quake
        L.circle([latitude, longitude], {
            color: color_cat,
            fillColor: color_cat,
            fillOpacity: 0.75,
            radius: 20000*magnitude
        }).bindPopup(title).addTo(myMap);
    }

function getColor(d) {
    return d > 5 ? 'red' :
           d > 4 ? 'orangered' :
           d > 3 ? 'orange' :
           d > 2 ? 'yellow' :
           d > 1 ? 'greenyellow' :
           'green' ;
}

// Create a legend to display information about our map
var legend = L.control({ position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    mag_cat = [0,1,2,3,4,5];
    console.log(mag_cat);

    // loop through magnitude intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mag_cat.length; i++) {
        div.innerHTML += '<i style = "background:'+ getColor(mag_cat[i] + 1) + '"></i>'+
         mag_cat[i] + (mag_cat[i + 1] ? '&ndash;' + mag_cat[i + 1] + '<br>': '+');
    };
    return div;
};
legend.addTo(myMap);

});

