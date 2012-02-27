// the master switch that controls everything!
var displayData = function(chapterName) {
	// look up ID by name
	var chapterID;
	for (i=0;i<chapter_list.length;i++) {
		if (chapter_list[i]["name"] === chapterName) {
			chapterID = i;
		}
	}

	// get rid of anything that was there before
	graphPaper.clear();
	namePaper.clear();

	// add our title
	addTitling(namePaper, chapterID);

	// generate graphs
	// params: paper, xpos, ypos, chapterID
	graphGender(graphPaper, 0, 0, chapterID);
	graphGrants(graphPaper, 0, 200, chapterID);
	graphOccupations(graphPaper, 250, 0, chapterID);
}

var addTitling = function(paper, chapterID) {
	var mainTitle = paper.text(0, 25, "North America");
	mainTitle.attr({ "font-size": 24, "text-anchor": "start" });

	var localTitle = paper.text(500, 25, "Awesome " + chapter_list[chapterID]["name"]);
	localTitle.attr({ "font-size": 24, "text-anchor": "start" });
}

// graph the men and women of each chapter, compared to the global average
var graphGender = function(paper, xpos, ypos, chapterID) {
	// parameter definitions
	var box;
	var newx = xpos;
	var newy = ypos + 35;
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
	// graph men in this chapter
	box = paper.rect(newx, newy, Math.round(width * men/largestChapter), boxHeight);
	box.attr({ fill: mediumColor, stroke: "none", title: men + " men" });
	newx += Math.round(width * men/largestChapter);
	// label the men
	var manLabel = paper.text(newx - 5, newy + 35, "m");
	manLabel.attr({ "font-size": 16, "text-anchor": "end", fill: "white" });
	// graph the women
	box = paper.rect(newx, newy, Math.round(width * women/largestChapter), boxHeight);
	box.attr({ fill: darkColor, stroke: "none", title: women + " women" });
	// label the women
	if (women > 1) {
		var womanLabel = paper.text(newx + Math.round(width * women/largestChapter) - 5, newy + 35, "w");
		womanLabel.attr({ "font-size": 16, "text-anchor": "end", fill: "white" });
	} else {
		var womanLabel = paper.text(newx + 10, newy + 35, "w");
		womanLabel.attr({ "font-size": 16, "text-anchor": "start" });
	}
	
	// graph our global average
	// reset x position!
	newx = xpos;
	newy += boxHeight + 15;
	box = paper.rect(newx, newy, Math.round(width * menGlobal/largestChapter), boxHeight);
	box.attr({ fill: mediumColor, stroke: "none", title: menGlobal + " men"});
	newx += Math.round(width * menGlobal/largestChapter);
	box = paper.rect(newx, newy, Math.round(width * womenGlobal/largestChapter), boxHeight);
	box.attr({ fill: darkColor, stroke: "none", title: womenGlobal + " women" });
	// if you like it put a label on it
	var avgLabel = paper.text(xpos + 5, newy+35, "global avg.");
	avgLabel.attr({ "font-size": 16, "text-anchor": "start", fill: "white" });
	var avgDesc = paper.text(width - 10, newy+35, "= " + (womenGlobal+menGlobal) + " trustees");
	avgDesc.attr({ "font-size": 16, "text-anchor": "end" });

	// add graph label and tooltips
	// params: x, y, text (use \n for line breaks)
	var title = paper.text(xpos, ypos+12, "Men & Women");
	title.attr({ "font-size": 24, "text-anchor": "start" });
	addTooltips();
}

// graph the number of grants funded by a chapter
var graphGrants = function(paper, xpos, ypos, chapterID) {
	var cityName = chapter_list[chapterID]["name"];
	var totalGrants = grant_list.length;

	// position and size of markers
	var box;
	var newx;
	var newy = ypos + 20;
	var side = 15;
	var spacer = 5;
	var rowLength = 10; // number of rectangles per row
	var title;

	for (i=0;i<totalGrants;i++) {
		newx = xpos + (i%rowLength)*(side + spacer);
		newy = ypos + Math.floor(i/rowLength)*(side + spacer);

		box = paper.circle(newx + side/2, newy, side/2);

		if (grant_list[i]["name"].length === 0) {
			title = "(untitled)";
		} else {
			title = grant_list[i]["name"];
		}

		if (grant_list[i]["chapter"] === cityName) {
			box.attr({ fill: darkColor, stroke: "none", title: title });
		} else {
			title += (", " + grant_list[i]["chapter"]);
			box.attr({ fill: lightColor, stroke: "none", title: title });
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
			box.attr({ fill: lightColor, stroke: "none", title: "0%" })
			
			label = paper.text(xpos + 50, newy + 2, labelText);
			label.attr({ "font-size": 16, "text-anchor": "start" });

			// increment y position
			newy = newy + spacer + 10;
		} else {
			box = paper.rect(xpos, newy, width, occupations[i]);
			box.attr({ fill: darkColor, stroke: "none", title: percent[i] + "%" });
			
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