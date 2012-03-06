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
	graphGender(graphPaper, 200+100, 0+25, chapterID);
	graphGrants(graphPaper, 0, 225+50, chapterID);
	graphOccupations(graphPaper, 0, 0+25, chapterID);
}

var addTitling = function(paper, chapterID) {
	var mainTitle = paper.text(0, 25, "Global Awesome » North America »");
	mainTitle.attr({ "font-size": "30px", "text-anchor": "start" });

	var localTitle = paper.text(mainTitle.getBBox().width + 10, 25, chapter_list[chapterID]["name"])
	localTitle.attr({ "font-size": "30px", "text-anchor": "start", fill: pinkColor });
}

// graph the men and women of each chapter, compared to the global average
var graphGender = function(paper, xpos, ypos, chapterID) {
	// parameter definitions
	var box;
	var newx = xpos;
	var newy = ypos + 40;
	var width = 200;
	var boxHeight = 50;
	var globalSize = 0;

	// get the number of men and women in this chapter
	var women = chapter_list[chapterID]["women"];
	var men = chapter_list[chapterID]["men"];
	
	// find the size of the largest chapter for use as a scale factor
	var largestChapter = 0;

	for (index in chapter_list) {
		var size = chapter_list[index]["women"] + chapter_list[index]["men"];
		globalSize += size;

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
	manLabel.attr({ "font-size": "16px", "text-anchor": "end", fill: "white" });
	// graph the women
	box = paper.rect(newx, newy, Math.round(width * women/largestChapter), boxHeight);
	box.attr({ fill: darkColor, stroke: "none", title: women + " women" });
	// label the women
	// handle too few women elegantly
	if (women > 1) {
		var womanLabel = paper.text(newx + Math.round(width * women/largestChapter) - 5, newy + 35, "w");
		womanLabel.attr({ "font-size": "16px", "text-anchor": "end", fill: "white" });
	} else {
		var womanLabel = paper.text(newx + 10, newy + 35, "w");
		womanLabel.attr({ "font-size": "16px", "text-anchor": "start" });
	}
	
	// write in descriptive text for chapter size and global average
	newy += boxHeight + 15;

	// if you like it put a label on it
	var chapterDesc = paper.text(xpos, newy+15, "There are " + (women + men) + " trustees\nin " + chapter_list[chapterID]["name"] + ".");
	chapterDesc.attr({ "font-size": "16px", "text-anchor": "start" });

	var globalDesc = paper.text(xpos, newy+15 + 50, "The global average is\n" + Math.round(globalSize/chapter_list.length) + " trustees per chapter.");
	globalDesc.attr({ "font-size": "16px", "text-anchor": "start" });

	// add graph label and tooltips
	var title = paper.text(xpos, ypos+12, "Men & Women");
	title.attr({ "font-size": "24px", "text-anchor": "start" });
	addTooltips();
}

// graph the number of grants funded by a chapter
var graphGrants = function(paper, xpos, ypos, chapterID) {
	var cityName = chapter_list[chapterID]["name"];
	var totalGrants = grant_list.length;

	// position and size of markers
	var  marker;
	var newx;
	var newy;
	var side = 15;
	var spacer = 5;
	var rowLength = 25; // number of markers per row
	var title;

	var localGrants = [];

	// plot grants
	for (i=0;i<totalGrants;i++) {
		// figure out if we need to change rows or not
		newx = xpos + (i%rowLength)*(side + spacer);
		newy = ypos + 30 + 5 + Math.floor(i/rowLength)*(side + spacer);

		marker = paper.circle(newx + side/2, newy + side/2, side/2);

		// populate grant titles and descriptions, handle blank/missing entries
		if (grant_list[i]["name"].length === 0) {
			title = "(untitled)";
		} else {
			title = grant_list[i]["name"];
		}

		// give grants for our selected chapter a different color
		if (grant_list[i]["chapter"] === cityName) {
			marker.attr({ fill: darkColor, stroke: "none", title: title });

			// push grants into a masterlist of local grants
			// record their index in the global grant list, so we can look them up later
			var index = localGrants.length;
			localGrants.push(marker);
			localGrants[index].grantIndex = i;
		} else {
			title += (", " + grant_list[i]["chapter"]);
			marker.attr({ fill: lightColor, stroke: "none", title: title });
		}
	}

	// clear the description text
	$("div#grantDesc").text("");

	// make sure we actually have grants for this chapter!
	if (localGrants.length >= 1) {
		// automatically color the first grant pink
		localGrants[0].attr({ fill: pinkColor });

		// plot the title of our first grant
		if (grant_list[localGrants[0].grantIndex]["name"] === "") {
			var grantTitle = paper.text(xpos, newy + 40, "Untitled");
		} else {
			var grantTitle = paper.text(xpos, newy + 40, grant_list[localGrants[0].grantIndex]["name"]);	
		}
		grantTitle.attr({ "font-size": "16px", "text-anchor": "start", "font-weight": "bold" });

		// then plot the description
		if (grant_list[localGrants[0].grantIndex]["description"] === "") {
			var grantDesc = "Unfortunately, we don't have more information about this grant.";
		} else {
			var grantDesc = grant_list[localGrants[0].grantIndex]["description"];
		}

		$("div#grantDesc").text(grantDesc);

		// attach a click handler to each local grant
		for (i=0;i<localGrants.length;i++) {
			localGrants[i].click(function() {
				for (i=0;i<localGrants.length;i++) {
					localGrants[i].attr({ fill: darkColor });
				}

				// make the selected grant pink
				this.attr({ fill: pinkColor });

				// update the title and description
				var newTitle = grant_list[this.grantIndex]["name"];
				var newDesc = grant_list[this.grantIndex]["description"];
				if (newTitle === "") {
					newTitle += "Untitled";
				}
				if (newDesc === "") {
					newDesc += "Unfortunately, we don't have more information about this grant.";
				}

				grantTitle.attr({ text: newTitle });
				$("div#grantDesc").text(newDesc);
			});
		}
	}

	// add text labels and tooltips
	// params: x, y, text (use \n for line breaks)
	var title = paper.text(xpos, ypos - 12, "All Grants Awarded");
	title.attr({ "font-size": "24px", "text-anchor": "start" });
	var totalDollars = paper.text(xpos, ypos + 20, "AF " + cityName + " has given away a total of $" + chapter_list[chapterID]["dollars"] + "!");
	totalDollars.attr({ "font-size": "16px", "text-anchor": "start" });
	addTooltips();
}

// graph the occupations of each chapter
var graphOccupations = function(paper, xpos, ypos, chapterID) {
	// pull everything into variables to make life easier
	var occupations = chapter_list[chapterID]["jobTitles"];
	var quantities = [];

	// copy the list over, or the pie chart function will modify the original!
	// (what the heck, gRaphael)
	for (i=0;i<chapter_list[chapterID]["jobNums"].length;i++) {
		quantities[i] = chapter_list[chapterID]["jobNums"][i];
	}

	// pie chart parameters
	var rad = 70;
	var newx = xpos + rad;
	var newy = ypos + rad + 24 + 15;
	var label;
	var labelText;
	var colorArray = ["rgb(0,0,0)", "rgb(50,50,50)", "rgb(100,100,100)", "rgb(150,150,150)", "rgb(200,200,200)"];

	var pie = paper.piechart(newx, newy, rad, quantities, { legend: occupations, legendpos: "east", colors: colorArray });

	// add text labels and tooltips
	// params: x, y, text (use \n for line breaks)
	var title = paper.text(xpos, ypos + 12, "Trustee Occupations");
	title.attr({ "font-size": "24px", "text-anchor": "start" });
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