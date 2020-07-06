function map_sel(mapType) {
  var map = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      noWrap: true,
      bounds: [
        [-90, -180],
        [90, 180],
      ],
      id: `mapbox/${mapType}`,
      accessToken: API_KEY,
    }
  );
  return map;
}

function mag(magnitud) {
  var circleStyle = {
    color: colorCircle(magnitud),
    radius: magnitud + 5,
  };
  return circleStyle;
}

function colorCircle(data) {
  if (data <= 1) {
    return colors[0];
  } else if (data > 1 && data <= 2) {
    return colors[1];
  } else if (data > 2 && data <= 3) {
    return colors[2];
  } else if (data > 3 && data <= 4) {
    return colors[3];
  } else if (data > 4 && data < 5) {
    return colors[4];
  } else if (data >= 5) {
    return colors[5];
  }
}

var url =
  "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-05-01&endtime=2020-05-15&minmagnitude=1";

var tectonic_url =
  "https://enr1que319-earthquakes.herokuapp.com/api/v1/tectonic_plates";

var colors = ["#00ff00", "#32cd32", "#ffd700", "#ffa500", "#d2691e", "#dc143c"];

var lab = ["O-1", "1-2", "2-3", "3-4", "4-5", "+5"];

var cityMarkers = [];

var stateMarkers = [];

var mapStyle = {
  color: "DarkCyan",
  weight: 1,
};

var baseMaps = {
  "Light Map": map_sel("light-v10"),
  "Dark Map": map_sel("dark-v10"),
};

d3.json(tectonic_url, (data) => {
  d3.json(url, (earthGJSON) => {
    var platGJSON = data[0];

    var plates = [L.geoJson(platGJSON, { style: mapStyle })];

    var layPlates = L.layerGroup(plates);

    var earthquakes = [
      L.geoJson(earthGJSON, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, mag(feature.properties.mag));
        },
        onEachFeature: function (feature, layer) {
          layer.on({
            click: function (event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.9,
              });
            },
          });
          layer.bindPopup(
            "<h3>Location</h3>" +
              "<p>" +
              feature.properties.place +
              "</p> <hr> <p> Magnitud: " +
              feature.properties.mag +
              "</p>"
          );
        },
      }),
    ];

    var layEarth = L.layerGroup(earthquakes);

    var overlayMaps = {
      "Fault Lines": layPlates,
      " Earthquakes": layEarth,
    };

    var myMap = L.map("map", {
      center: [15.5994, -28.6731],
      zoom: 3,
      layers: [map_sel("dark-v10"), layPlates, layEarth],
    });

    L.control
      .layers(baseMaps, overlayMaps, {
        collapsed: true,
      })
      .addTo(myMap);

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      var div = L.DomUtil.create("div", "info legend");
      var labels = [];

      colors.forEach(function (item) {
        labels.push('<li style="background-color: ' + item + '"></li>');
      });

      lab.forEach(function (item) {
        labels.push(`<li style="margin-top:1.16px">${item}</li>`);
      });

      div.innerHTML = "<ul>" + labels.join("") + "</ul>";
      return div;
    };

    legend.addTo(myMap);
  });
});
