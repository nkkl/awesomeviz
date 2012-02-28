var displayMaps = function(year) {
	mapPaper.clear();
	
	mapCities(year, "Boston");
	mapTimeline(year);
}

var mapCities = function(year, city) {
	
	var cities = [];

	for (index in chapter_list) {
		var xpos = chapter_list[index]["xLoc"];
		var ypos = chapter_list[index]["yLoc"];

		if (xpos != 0 || ypos !=0) {
			if (chapter_list[index]["founding"] <= year) {
				cities[index] = mapPaper.circle(xpos, ypos, 5);
				cities[index].attr({ stroke: "none", title: chapter_list[index]["name"] });
				if (chapter_list[index]["name"] === city) {
					cities[index].attr({ fill: pinkColor });
				} else {
					cities[index].attr({ fill: "black" });
				}

				cities[index].cityName = chapter_list[index]["name"];

				// on click, plot data for that city
				cities[index].click(function() {
					// set every city back to black
					for (i=0;i<cities.length;i++) {
						if (typeof cities[i] != "undefined") {
							cities[i].attr({ fill: "black" });
						}
					}

					// then make the selected city pink
					this.toFront();
					this.attr({ fill: pinkColor });
					displayData(this.cityName);
				});
			}
		}
	}

	addTooltips();
}

var mapTimeline = function(year) {
	var ypos = 500;
	var width = 450;
	var buffer = 2;
	var boxWidth = Math.round((width - (buffer * 12))/11);
	var newx = 0 + buffer;
	var boxes = [];

	var dates = [200909, 200912, 201003, 201006, 201009, 201012, 201103, 201106, 201109, 201112, 201203];

	// do things
	for (i=0;i<11;i++) {
		boxes[i] = mapPaper.rect(newx,ypos-20,boxWidth,20);
		boxes[i].year = dates[i];
		// var title;

		// switch(dates[i].toString().substring(4,6)) {
		// 	case "03":
		// 		title = "Jan - Mar";
		// 		break;
		// 	case "06":
		// 		title = "Apr - Jun";
		// 		break;
		// 	case "09":
		// 		title = "Jul - Sep";
		// 		break;
		// 	case "12":
		// 		title = "Oct - Dec";
		// 		break;
		// }

		// title += ", " + dates[i].toString().substring(0,4);
		// boxes[i].attr({ title: title });
		
		if (boxes[i].year === year) {
			boxes[i].attr({ stroke: "none", fill: darkColor });
		} else if (boxes[i].year < year) {
			boxes[i].attr({ stroke: "none", fill: mediumColor });
		} else {
			boxes[i].attr({ stroke: "none", fill: lightColor });
		}

		boxes[i].click(function() {
			displayMaps(this.year);
		});

		newx += boxWidth + buffer;
	}
}