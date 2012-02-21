// graph the men and women of each chapter, compared to the global average
var graphGender = function(paper, xpos, ypos, chapterID) {
	// parameter definitions
	var box;
	var newx = xpos;
	var newy = ypos + 25;
	var width = 200;
	var boxHeight = 50;

	// get the number of men and women in this chapter and globally
	var women = chapter_list[chapterID]["women"];
	var men = chapter_list[chapterID]["men"];
	var womenGlobal = chapter_list[0]["women"];
	var menGlobal = chapter_list[0]["men"];
	
	// find the size of the largest chapter for use as a scale factor
	var largestChapter = 0;

	for (index in chapter_list) {
		var size = chapter_list[index]["women"] + chapter_list[index]["men"];

		if (largestChapter < size) {
			largestChapter = chapter_list[index]["women"] + chapter_list[index]["men"];
		}
	}

	// TODO: REFACTOR THIS
	// graph men and women in this chapter
	box = paper.rect(newx, newy, Math.round(width * men/largestChapter), boxHeight);
	box.attr({ fill: baseColor, stroke: "none", title: men + " men" })
	newx += Math.round(width * men/largestChapter);
	box = paper.rect(newx, newy, Math.round(width * women/largestChapter), boxHeight);
	box.attr({ fill: accentColor, stroke: "none", title: women + " women" });
	// add a label
	var label1 = paper.text(xpos+5, newy+25, chapter_list[chapterID]["name"]);
	
	// reset x position!
	newx = xpos;
	newy += boxHeight + 25;
	box = paper.rect(newx, newy, Math.round(width * menGlobal/largestChapter), boxHeight);
	box.attr({ fill: baseColor, stroke: "none", title: men + " men"});
	newx += Math.round(width * menGlobal/largestChapter);
	box = paper.rect(newx, newy, Math.round(width * womenGlobal/largestChapter), boxHeight);
	box.attr({ fill: accentColor, stroke: "none", title: womenGlobal + " women" });
	// add a label
	var label2 = paper.text(xpos+5, newy+25, "Average");

	// add text labels and tooltips
	// params: x, y, text (use \n for line breaks)
	var title = paper.text(xpos, ypos+12, "Men vs. Women");
	title.attr({ "font-size": 24, "text-anchor": "start" });
	label1.attr({ "font-size": 16, "text-anchor": "start", fill: "white" });
	label2.attr({ "font-size": 16, "text-anchor": "start", fill: "white" });
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
	var newy = ypos + 20;
	var side = 15;
	var spacer = 5;
	var rowLength = 10; // number of rectangles per row

	for (i=0;i<totalGrants;i++) {
		newx = xpos + (i%rowLength)*(side + spacer);
		newy = ypos + Math.floor(i/rowLength)*(side + spacer);

		box = paper.circle(newx + side/2, newy, side/2);
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

	var percent = [];

	for (i=0;i<occupations.length;i++) {
		total += occupations[i];
	}

	// position and size of rectangle
	var box;
	var newy = ypos + 25;
	var width = 40;
	var spacer = 3;
	var label;
	var labelText;

	var height = 400;

	// normalize values and graph rectangles
	for (i=0;i<occupations.length;i++) {
		percent[i] = Math.round(occupations[i]/total * 1000)/10;
		occupations[i] = Math.round((occupations[i]/total)*height);

		// choose label
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

		if (occupations[i] === 0) {
			box = paper.rect(xpos, newy, width, 10);
			box.attr({ fill: baseColor, stroke: "none", title: "0%" })
			
			label = paper.text(xpos + 50, newy + 2, labelText);
			label.attr({ "font-size": 16, "text-anchor": "start" });

			// increment y position
			newy = newy + spacer + 10;
		} else {
			box = paper.rect(xpos, newy, width, occupations[i]);
			box.attr({ fill: accentColor, stroke: "none", title: percent[i] + "%" });
			
			label = paper.text(xpos + 50, newy + occupations[i] - 8, labelText);
			label.attr({ "font-size": 16, "text-anchor": "start" });
			
			// increment y position
			newy = newy + spacer + occupations[i];
		}

	}

	// add text labels and tooltips
	// params: x, y, text (use \n for line breaks)
	var title = paper.text(xpos, ypos + 12, "Trustee Occupations");
	title.attr({ "font-size": 24, "text-anchor": "start" });
	addTooltips();
}

var addTooltips = function() {
	// add tooltips
	$("#wrapper a").qtip({
		style: {
			tip: true,
			classes: 'ui-tooltip-tipsy ui-tooltip-shadow'
		}
	});
}