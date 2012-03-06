var displayMaps = function(year, city) {
	mapPaper.clear();
	
	city = mapCities(year, city);
	mapTimeline(year);
}

var mapCities = function(year) {
	
	var cities = [];
	var cityRad = 5;

	// plot every city from our list of chapters
	for (index=0;index<chapter_list.length;index++) {
		// grab our coordinates
		var xpos = chapter_list[index]["xLoc"];
		var ypos = chapter_list[index]["yLoc"];

		if (xpos != 0 || ypos !=0) {
			// only plot cities that had chapters at this time
			if (chapter_list[index]["founding"] <= year) {
				cities[index] = mapPaper.circle(xpos, ypos, cityRad);
				cities[index].attr({ stroke: "none", title: chapter_list[index]["name"] });
				
				// color our active city pink, otherwise make it black
				if (chapter_list[index]["name"] === activeCity) {
					cities[index].attr({ fill: pinkColor });
				} else {
					cities[index].attr({ fill: "black" });
				}
				// attach the name to the object (Raphaeljs objects have no "name" attribute)
				cities[index].cityName = chapter_list[index]["name"];

				// on click, plot data for that city
				cities[index].click(function() {
					// set every city back to black
					for (i=0;i<cities.length;i++) {
						if (typeof cities[i] != "undefined") {
							cities[i].attr({ fill: "black" });
						}
					}

					// then push the selected city forward and make it pink
					this.toFront();
					this.attr({ fill: pinkColor });
					// graph its data, too!
					displayData(this.cityName);
					activeCity = this.cityName;
				});
			}
		}
	}

	addTooltips();
}

var mapTimeline = function(year) {
	var ypos = 525;
	var width = 450;
	var buffer = 2;
	var boxWidth = Math.round((width - (buffer * 12))/11); // hacky math to make the boxes the right width
	var newx = 0 + buffer;
	var boxes = [];
	var title;

	// every year since the AF's inception, divided into quarters
	var dates = [200909, 200912, 201003, 201006, 201009, 201012, 201103, 201106, 201109, 201112, 201203];

	// iterate through each epoch, plot and scale boxes
	for (i=0;i<11;i++) {
		var height = 0;
		
		// increase height for every chapter founded by the current epoch
		for (j=0;j<chapter_list.length;j++) {
			if (chapter_list[j]["founding"] <= dates[i]) {
				height += 5;
			}
		}

		// actually plot the box
		boxes[i] = mapPaper.rect(newx,ypos-height+12,boxWidth,height);
		boxes[i].year = dates[i];

		// color the present black, the past dark grey, and the future light grey
		if (boxes[i].year === year) {
			boxes[i].attr({ stroke: "none", fill: "black" });
		} else if (boxes[i].year < year) {
			boxes[i].attr({ stroke: "none", fill: mediumColor });
		} else {
			boxes[i].attr({ stroke: "none", fill: lightColor });
		}

		// change epoch on hover (not click), to be less annoying
		boxes[i].hover(function() {
			displayMaps(this.year);
		});

		// increment x-position for next box
		newx += boxWidth + buffer;
	}
	
	// build our title, in the form "<quarter>, <year>"
	switch(year.toString().substring(4,6)) {
		case "03":
			title = "January - March";
			break;
		case "06":
			title = "April - June";
			break;
		case "09":
			title = "July - September";
			break;
		case "12":
			title = "October - December";
			break;
	}

	title += ", " + year.toString().substring(0,4);

	var titleText = mapPaper.text(450, ypos+25, title);
	titleText.attr({ "font-size": "16px", "text-anchor": "end" });
}