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

		graphGender(paper, 80, 50, 0);
	}

	// graph the men and women of each chapter, compared to the global average
	var graphGender = function(paper, xpos, ypos, chapterNum) {
		var numChapters = chapter_list.length;
		
		// create a stacked bar chart of our data
		// params: paper, x, y, width, height, [ [values1], [values2] ], opts
		chart = paper.hbarchart(xpos,ypos,200,100, [
					[chapter_list[chapterNum]["men"], chapter_list[numChapters-1]["men"]],
					[chapter_list[chapterNum]["women"], chapter_list[numChapters-1]["women"]]
					], {
					stacked: true,
					colors: ["blue", "#FF3D8B"]
				});
		
		// add text labels
		// params: x, y, text (use \n for line breaks)
		var title = paper.text(xpos+50, ypos - 15, "Men vs. Women");
		var label1 = paper.text(xpos-40, ypos+25, chapter_list[chapterNum]["name"]);
		var label2 = paper.text(xpos-40, ypos+69, "Average");
		title.attr({ "font-size": 24 });
		label1.attr({ "font-size": 16 });
		label2.attr({ "font-size": 16 });

		// create a hover function
		chart.hover(
			function() {
				// create a popup element on top of the bar
		        this.flag = paper.popup(this.bar.x, this.bar.y-10, (this.bar.value || "0") + "").insertBefore(this);
			    },
			function() {
			    // hide the popup element with an animation and remove the popup element at the end
			    this.flag.animate({opacity: 0}, 300, function () {this.remove();});
			}
		);
	}
});