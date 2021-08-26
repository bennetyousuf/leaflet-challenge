// Create initial map objet
var map = L.map("map", {
  center: [30, -20.13],
  zoom: 2.5,
});

// Add tile layer to the map for background
var graymap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY,
  }
);
graymap.addTo(map);

// Store  API endpoint inside queryUrl
var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl).then(function (data) {
  console.log(data);
  // get color altitude (part of lat and long coordinates, determines in "case" statement) and radius from magnitude
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5,
    };
  }

  // adjust colors for magnitude ranges greater than 0 to 100
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 90:
        return "#ea2c2c";
      case magnitude > 70:
        return "#ea822c";
      case magnitude > 50:
        return "#ee9c00";
      case magnitude > 30:
        return "#eecc00";
      case magnitude > 10:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }
  // if stateent to acount for magnitude zero
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }
  // add GeoJSON data
  L.geoJSON(data, {
    pointToLayer: function (feature, LatLng) {
      return L.circleMarker(LatLng);
    },
    style: styleInfo,

    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: " +
          feature.properties.mag +
          "<br>Depth: " +
          feature.geometry.coordinates[2] +
          "<br>Location: " +
          feature.properties.place
      );
    },
  }).addTo(map);

  
});