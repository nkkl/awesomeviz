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

			displayData();
	});

	var displayData = function() {
		// create our canvas
		// params: x, y, width, height
		var paper = new Raphael(document.getElementById("canvas"), $("#canvas").width(), $("#canvas").height());

		// generate graphs
		// params: paper, xpos, ypos, chapterID
		graphGender(paper, 80, 50, 1);
		graphGrants(paper, 80, 200, 1);
		graphOccupations(paper, 500, 50, 1);
	}

	// graph the men and women of each chapter, compared to the global average
	var graphGender = function(paper, xpos, ypos, chapterID) {
		// create a stacked bar chart of our data
		// params: paper, x, y, width, height, [ [values1], [values2] ], opts
		chart = paper.hbarchart(xpos,ypos,200,100, [
					[chapter_list[chapterID]["men"], chapter_list[0]["men"]],
					[chapter_list[chapterID]["women"], chapter_list[0]["women"]]
					], {
					stacked: true,
					colors: [baseColor, accentColor]
				});
		
		// add text labels
		// params: x, y, text (use \n for line breaks)
		var title = paper.text(xpos, ypos - 15, "Men vs. Women");
		var label1 = paper.text(xpos-10, ypos+25, chapter_list[chapterID]["name"]);
		var label2 = paper.text(xpos-10, ypos+69, "Average");
		title.attr({ "font-size": 24, "text-anchor": "start" });
		label1.attr({ "font-size": 16, "text-anchor": "end" });
		label2.attr({ "font-size": 16, "text-anchor": "end" });

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

	// graph the occupations of each chapter
	var graphOccupations = function(paper, xpos, ypos, chapterID) {
		// pull everything into variables to make life easier
		var occupations = [];
		occupations[0] = chapter_list[chapterID]["ebang"];
		occupations[1] = chapter_list[chapterID]["tech"];
		occupations[2] = chapter_list[chapterID]["education"];
		occupations[3] = chapter_list[chapterID]["philanthropy"];
		occupations[4] = chapter_list[chapterID]["other"];
		var total = 0;

		for (i=0;i<occupations.length;i++) {
			total += occupations[i];
		}

		// position and size of rectangle
		var box;
		var newy = ypos;
		var width = 40;
		var spacer = 3;
		var label;
		var labelText;

		// normalize values and graph rectangles
		for (i=0;i<occupations.length;i++) {
			occupations[i] = Math.round((occupations[i]/total)*250);
			console.log(occupations[i]);

			box = paper.rect(xpos, newy, width, occupations[i]);
			box.attr({ fill: accentColor, stroke: "none", title: occupations[i]/2.50 + "%" });

			// place label
			switch(i) {
				case 0:
					labelText = "entrepreneurship";
					break;
				case 1:
					labelText = "technology";
					break;
				case 2:
					labelText = "education";
					break;
				case 3:
					labelText = "philanthropy";
					break;
				default:
					labelText = "other";
			}

			label = paper.text(xpos + 50, newy + occupations[i] - 8, labelText);
			label.attr({ "font-size": 16, "text-anchor": "start" });

			// increment y position
			newy = newy + spacer + occupations[i];
		}

		// add text labels and tooltips
		// params: x, y, text (use \n for line breaks)
		var title = paper.text(xpos, ypos - 20, "Trustee Occupations");
		title.attr({ "font-size": 24, "text-anchor": "start" });
		addTooltips();
	}

	// graph the number of grants funded by a chapter
	var graphGrants = function(paper, xpos, ypos, chapterID) {
		// get the total number of grants awarded
		var localGrants = chapter_list[chapterID]["grants"];
		var totalGrants = chapter_list[0]["grants"];

		// position and size of rectangles
		var box;
		var newx;
		var newy;
		var side = 15;
		var spacer = 2;
		var rowLength = 20; // number of rectangles per row

		for (i=0;i<totalGrants;i++) {
			newx = xpos + (i%rowLength)*(side + spacer);
			newy = ypos + Math.floor(i/rowLength)*(side + spacer);

			box = paper.rect(newx, newy, side, side);
			if (i<localGrants) {
				box.attr({ fill: accentColor, stroke: "none", title: "grant" });
			} else {
				box.attr({ fill: baseColor, stroke: "none"});
			}
		}

		// add text labels and tooltips
		// params: x, y, text (use \n for line breaks)
		var title = paper.text(xpos, ypos - 20, "Grants Awarded");
		title.attr({ "font-size": 24, "text-anchor": "start" });
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