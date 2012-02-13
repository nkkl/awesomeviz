// js source code for Awesome Foundation information visualization project
// http://www.awesomefoundation.org
// http://github.com/nkkl/awesomeviz

$(document).ready(function() {

	// global variable for our data, because Tom said it was ok
	chapter_list = [];
	accentColor = "#FF3D8B";
	darkColor = "black";

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

		// generate graphs
		// params: paper, xpos, ypos, chapterID
		graphGender(paper, 80, 50, 0);
		graphGrants(paper, 80, 200, 0);
	}

	// graph the men and women of each chapter, compared to the global average
	var graphGender = function(paper, xpos, ypos, chapterID) {
		var numChapters = chapter_list.length;
		
		// create a stacked bar chart of our data
		// params: paper, x, y, width, height, [ [values1], [values2] ], opts
		chart = paper.hbarchart(xpos,ypos,200,100, [
					[chapter_list[chapterID]["men"], chapter_list[numChapters-1]["men"]],
					[chapter_list[chapterID]["women"], chapter_list[numChapters-1]["women"]]
					], {
					stacked: true,
					colors: [darkColor, accentColor]
				});
		
		// add text labels
		// params: x, y, text (use \n for line breaks)
		var title = paper.text(xpos+50, ypos - 15, "Men vs. Women");
		var label1 = paper.text(xpos-40, ypos+25, chapter_list[chapterID]["name"]);
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

	// graph the number of grants funded by a chapter
	var graphGrants = function(paper, xpos, ypos, chapterID) {
		// get the total number of grants awarded
		var numChapters = chapter_list.length;
		var localGrants = chapter_list[chapterID]["grants"];
		var totalGrants = chapter_list[numChapters-1]["grants"];

		// position and size of rectangles
		var box;
		var newx;
		var newy;
		var side = 10;
		var spacer = 5;
		var rowLength = 20; // number of rectangles per row

		for (i=0;i<totalGrants;i++) {
			newx = xpos + (i%rowLength)*(side + spacer);
			newy = ypos + Math.floor(i/rowLength)*(side + spacer);

			box = paper.rect(newx, newy, side, side);
			if (i<localGrants) {
				box.attr({ fill: accentColor, stroke: "none", title: "grant" });
			} else {
				box.attr({ fill: darkColor, stroke: "none"});
			}
		}

		// add text labels and tooltips
		// params: x, y, text (use \n for line breaks)
		var title = paper.text(xpos+50, ypos - 20, "Grants Awarded");
		title.attr({ "font-size": 24 });
		addTooltips();
	}

	var addTooltips = function() {
		// add tooltips
		$("#canvas a").qtip({
			style: {
				tip: true,
				classes: 'ui-tooltip-tipsy ui-tooltip-shadow'
			}
		});
	}
});