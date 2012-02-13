// js source code for Awesome Foundation information visualization project
// http://www.awesomefoundation.org
// http://github.com/nkkl/awesomeviz

$(document).ready(function() {

	// global variable for our data, because Tom said it was ok
	chapter_list = [];

	$.getJSON("http://spreadsheets.google.com/feeds/list/0ArWU2T0HEMrldGxLeHVFYmM2VVhvMktFRVJwVGtVOHc/od6/public/values?alt=json-in-script&callback=?",
		function(data) {
			for (i=0;i<data.feed.entry.length;i++) {
			    var entry = data.feed.entry[i];
			    var chapter = {
			      name: entry["gsx$name"].$t,
			      country: entry["gsx$country"].$t,
			      founding: parseInt(entry["gsx$founding"].$t),
			      women: parseInt(entry["gsx$women"].$t),
			      men: parseInt(entry["gsx$men"].$t),
			      grants: parseInt(entry["gsx$grants"].$t),
			      dollars: parseInt(entry["gsx$dollars"].$t)
			    };

			    chapter_list.push(chapter);
			}

			displayData();
	});

	var displayData = function() {
		// create our canvas
		// params: x, y, width, height
		var paper = new Raphael(document.getElementById("canvas"), $("#canvas").width(), $("#canvas").height());

		console.log(chapter_list[0]["women"]);
		console.log(chapter_list[2]["women"]);
		console.log(chapter_list[0]["men"]);
		console.log(chapter_list[2]["men"]);

		// create a stacked bar chart of our data
		// params: x, y, width, height, [ [values1], [values2] ]
		chart = paper.hbarchart(100,100,200,100,[ [chapter_list[0]["women"], chapter_list[2]["women"]], [chapter_list[0]["men"], chapter_list[2]["men"]] ], {stacked: true});

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
});