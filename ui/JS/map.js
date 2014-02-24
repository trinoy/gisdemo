var map = L.map('map', {
	zoomControl : true
}).setView([ 22.527636, 78.832675 ], 4);

var statesData = [];
var Poli_Icon;
var markers = [];
var markers_new = [];
var marker;

querystates(statesData);


var cloudmade = L
.tileLayer(
		'http://{s}.tile.cloudmade.com/77b3738c9c724dd88e52815e3a5317da/122598/256/{z}/{x}/{y}.png',
		{
			maxZoom : 12,
			key : '77b3738c9c724dd88e52815e3a5317da',
			//styleId : 120982
			styleId: 122598
		}).addTo(map);

// control that shows state info on hover

var info = L.control();
var geojson;

info.onAdd = function(map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function(props) {
	this._div.innerHTML = '<div id="flag1_div"><img id="flag1" src="  images/india.gif " /></div><span><h3>CONSTITUENCIES DETAIL </h3></span>'
		+ (props ? '<table ><tr><th>State Name</th><td> '
				+ props.ST_NAME
				+ '</td></tr><tr><th> Constituency Name </th><td> '
				+ props.PC_NAME
				+ '</td></tr> <tr><th>Constituency Type</th><td>'
				+ props.PC_TYPE
				+ '</td></tr> <tr><th>No of Seats</th><td> ' + props.PC_NO
				+ '</td></tr> <tr><th>Current-Party</th><td>'
				+ props.PARTY + '</td></tr></table>'
				: 'Hover over a state');
};

info.addTo(map);


var info1 = L.control();
info1.onAdd = function(map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info1.update = function(props1) {

	if (props1 === undefined) {
		this._div.innerHTML = '<div><span><h3>PARTY PERFORMANCE</h3></span><span><h5>Please Draw a polygon/rectangle on the<br> MAP to see results</h5></span></div>';

	}
	
	else if(props1 === 'clear')
	{
	
		this._div.innerHTML = '<div><span><h3>PARTY PERFORMANCE</h3></span><span><h5>Please Draw a polygon/rectangle on the<br> MAP to see results</h5></span></div>';

		
	}
		

	else if (props1 != undefined ) {
		var string_div = '';
		string_div += '<div id="flag1_div"><img id="flag1" src="  images/india.gif " /></div><span><h3>PARTY PERFORMANCE</h3></span>'
				+ '<table ><tr><th>PARTY</th><th>NO OF SEATS</th></tr>';
		for ( var j in props1.items)

		{

			string_div += '<tr><td>' + props1.items[j].PARTY + '</td><td> '
					+ props1.items[j].PC_COUNT + '</td></tr>';

		}
		string_div += '</table>';
		this._div.innerHTML = string_div;
	}
};

info1.addTo(map);



var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Set the title to show on the polygon button
L.drawLocal.draw.toolbar.buttons.polygon = 'Draw a polygon around the constituency you want to analyze';

var drawControl = new L.Control.Draw({
	position: 'topleft',
	draw: {

		polyline: false,
		polygon: {
			allowIntersection: false,
			showArea: true,
			drawError: {
				color: '#fff',
				timeout: 1000
			},
			shapeOptions: {
				color: '#fff'
			}
		},
		circle: false,
	
		marker: false
	},
	edit: {
		featureGroup: drawnItems
	}
});
map.addControl(drawControl);

var array = {};

map.on('draw:created', function (e) {
	var type = e.layerType,
		layer = e.layer;
	

	if (type === 'polygon' || type === 'rectangle' ) {
		//layer.bindPopup('A popup!');

		//array = ;
		//var params =  { "polydim" : "hello" };
		//params = JSON.stringify(params);
	    // var params = JSON.stringify(array);
	     //var params =  { "polydim" : array};
      // array = layer._latlngs;
    
		//var string = JSON.parse(params);	
	
	  // JSON.stringify({ polygon_dim: array });
	  
	     var string1 = '';
	     var count = 1;
	     var lat_lng_first = '';

	     for (var i in  layer._latlngs)
	         {
	     	  if( count === 1)
	     		  {
	     		   lat_lng_first =  layer._latlngs[i].lng + ' ' +  layer._latlngs[i].lat;
	     		   count = count + 1;
	     		  }
	     	  
	     	  string1 = string1 +  layer._latlngs[i].lng + ' ' +  layer._latlngs[i].lat + ',';
	     	}

	      string1 = string1 + lat_lng_first;
	     // string1 = string1.substring(0, string1.length - 1);
	     
	      var params =  { "polydim" : string1};
	     
	     
	     
	   queryclipbypolygon(params);
		
		
	}

	drawnItems.addLayer(layer);
});

/*map.on('draw:edited', function (e) {
	var layers = e.layers;
	var countOfEditedLayers = 0;
	layers.eachLayer(function(layer) {
		countOfEditedLayers++;
	});
	console.log("Edited " + countOfEditedLayers + " layers");
});*/

map.on('draw:deleted', function (e) {
	//var layers = e.layers;

	info1.update('clear');
	
});



function style(feature) {
	return {
		weight : 1,
		opacity : 0.5,
		color : 'white',
		dashArray : '2',
		fillOpacity : 0.8,
		fillColor : feature.color
	};
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight : 5,
		color : '#ccc',
		dashArray : '',
		fillOpacity : 0.1
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}

	info.update(layer.feature);
}

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover : highlightFeature,
		mouseout : resetHighlight,
		click : zoomToFeature
	});
}


function querystates(statesData){
	$.ajax({
		url: '../model/geodata.xsjs',
		data: statesData,
		success: function (statesData) {
			//alert('data recieved');
			$('#wrapper').hide();
			geojson = L.geoJson(statesData, {
				style : style,
				onEachFeature : onEachFeature
			}).addTo(map);
		}
	});
}
	
	function queryclipbypolygon(params){
		$.ajax({
			url: '../model/querybypolygon.xsjs',
			data: params,
			success: function (clipdata) {
				info1.update(clipdata);
			}
		});	
	}


