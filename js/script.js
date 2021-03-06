// js source code for Awesome Foundation information visualization project
// http://www.awesomefoundation.org
// http://github.com/nkkl/awesomeviz

$(document).ready(function() {

	// global variables for our data, because Tom said it was ok
	chapter_list = []; // all the chapters
	grant_list = []; // all the grants
	activeCity = "Boston"; // focus starts on Boston, because it was first
	darkColor = "rgb(50,50,50)";
	mediumColor = "rgb(100,100,100)";
	lightColor = "rgb(200,200,200)";
	pinkColor = "rgb(252,63,117)"; // the "official" AF pink

	$.getJSON("https://spreadsheets.google.com/feeds/list/0ArWU2T0HEMrldE14dWs3WGh4Mng2b3JBdVNPaHZzdFE/od6/public/values?alt=json-in-script&callback=?",
		function(data) {
			// parse JSON and push data into the list of grants
			for (i=0;i<data.feed.entry.length;i++) {
				var entry = data.feed.entry[i];
				var grant = {
					// pull out grant info
					chapter: entry["gsx$chapter"].$t,
					name: entry["gsx$name"].$t,
					description: entry["gsx$description"].$t
				};

				grant_list.push(grant);
			}

			loadChapters();
	});

	var loadChapters = function() {
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
				      jobTitles: entry["gsx$jobtitles"].$t.split(','),
				      jobNums: entry["gsx$jobnumbers"].$t.split(',')
  				    };

  				    for (j=0;j<chapter.jobNums.length;j++) {
						chapter.jobNums[j] = parseInt(chapter.jobNums[j]);
					}

				    chapter_list.push(chapter);
				}

				// create our canvas
				// params: x, y, width, height
				graphPaper = new Raphael(document.getElementById("canvas"), $("#canvas").width(), $("#canvas").height());
				mapPaper = new Raphael(document.getElementById("map"), $("#map").width(), $("#map").height());
				namePaper = new Raphael(document.getElementById("titling"), $("#titling").width(), $("#titling").height());
				
				// start at the beginning
				displayMaps(200909);
				displayData(activeCity);
		});
	}

	$("wrapper").click(function() {
		// currently, do nothing
	});

});