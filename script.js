// js source code for Awesome Foundation information visualization project
// http://www.awesomefoundation.org
// http://github.com/nkkl/awesomeviz

// global variable for our data, because Tom said it was ok
var data = [];

$(document).ready(function() {
	// load our data from a google spreadsheet
	var spreadsheet_id = "0ArWU2T0HEMrldGxLeHVFYmM2VVhvMktFRVJwVGtVOHc";
	var worksheet_id = "od6";

	getJSON(spreadsheet_id, worksheet_id);
});

var main = function() {
	// create our canvas
	// params: x, y, width, height
	var paper = new Raphael(document.getElementById("canvas"), $("#canvas").width(), $("#canvas").height());

	console.log(data[0]["women"]);
	console.log(data[2]["women"]);
	console.log(data[0]["men"]);
	console.log(data[2]["men"]);

	// create a stacked bar chart of our data
	// params: x, y, width, height, [ [values1], [values2] ]
	chart = paper.hbarchart(100,100,200,100,[ [data[0]["women"], data[2]["women"]], [data[0]["men"], data[2]["men"]] ], {stacked: true});


	// create a hover function
	chart.hover(
		function() {
			console.log(this);
			// create a popup element on top of the bar
	        this.flag = paper.popup(this.bar.x, this.bar.y-10, (this.bar.value || "0") + " people").insertBefore(this);
		    },
		function() {
		    // hide the popup element with an animation and remove the popup element at the end
		    this.flag.animate({opacity: 0}, 300, function () {this.remove();});
		}
	);

	// add tooltips
	$("#canvas a").qtip({
		style: {
			tip: true,
			classes: 'ui-tooltip-tipsy ui-tooltip-shadow'
		}
	});
}

// creates a script tag in the page that loads in the JSON feed for the specified spreadsheet
// once loaded, it calls loadGraphJSON
var getJSON = function(spreadsheet_id, worksheet_id) {
	var script = document.createElement("script");

	script.setAttribute('src', 'http://spreadsheets.google.com/feeds/list/' + spreadsheet_id + '/' + worksheet_id + '/public/values' + '?alt=json-in-script&callback=loadGraphJSON');

	document.documentElement.firstChild.appendChild(script);
};

// extract the information we need
var loadGraphJSON = function(json) {
	for (i=0;i<json.feed.entry.length;i++) {
		var entry = json.feed.entry[i];
		var chapter = {
			name: entry["gsx$name"].$t,
			country: entry["gsx$country"].$t,
			founding: parseInt(entry["gsx$founding"].$t),
			women: parseInt(entry["gsx$women"].$t),
			men: parseInt(entry["gsx$men"].$t),
			grants: parseInt(entry["gsx$grants"].$t),
			dollars: parseInt(entry["gsx$dollars"].$t)
		};

		data.push(chapter);
	}

	// once our data is loaded, actually do stuff!
	main();
};