// js source code for Awesome Foundation information visualization project
// http://www.awesomefoundation.org
// http://github.com/nkkl/awesomeviz

$(document).ready(function() {

	// global variable for our data, because Tom said it was ok
	chapter_list = [];
	accentColor = "rgb(50,50,50)";
	baseColor = "rgb(200,200,200)";

	$.getJSON("http://spreadsheets.google.com/feeds/list/0ArWU2T0HEMrldGxLeHVFYmM2VVhvMktFRVJwVGtVOHc/od6/public/values?alt=json-in-script&callback=?",
		function(data) {
			// parse JSON and push data into the list of chapters
			for (i=0;i<data.feed.entry.length;i++) {
			    var entry = data.feed.entry[i];
			    var chapter = {
			      // chapter basics
			      name: entry["gsx$name"].$t,
			      country: entry["gsx$country"].$t,
			      founding: parseInt(entry["gsx$founding"].$t),
			      xLoc: parseInt(entry["gsx$xpos"].$t),
			      yLoc: parseInt(entry["gsx$ypos"].$t),
			      // trustee demographics
			      women: parseInt(entry["gsx$women"].$t),
			      men: parseInt(entry["gsx$men"].$t),
			      // funding history
			      grants: parseInt(entry["gsx$grants"].$t),
			      dollars: parseInt(entry["gsx$dollars"].$t),
			      // trustee occupations
			      ebang: parseInt(entry["gsx$ebang"].$t),
			      tech: parseInt(entry["gsx$tech"].$t),
			      education: parseInt(entry["gsx$education"].$t),
			      philanthropy: parseInt(entry["gsx$philanthropy"].$t),
			      other: parseInt(entry["gsx$other"].$t)
			    };

			    chapter_list.push(chapter);
			}

			// create our canvas
			// params: x, y, width, height
			graphPaper = new Raphael(document.getElementById("canvas"), $("#canvas").width(), $("#canvas").height());
			mapPaper = new Raphael(document.getElementById("map"), $("#map").width(), $("#map").height());
			
			mapCities();
			displayData(1);
	});

	$("wrapper").click(function() {
		// currently, do nothing
	});

});