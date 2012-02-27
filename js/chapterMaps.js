var mapCities = function(paper) {
	var cities = [];

	for (index in chapter_list) {
		var xpos = chapter_list[index]["xLoc"];
		var ypos = chapter_list[index]["yLoc"];

		if (xpos != 0 || ypos !=0) {
			cities[index] = mapPaper.circle(xpos, ypos, 5);
			cities[index].attr({ fill: "black", stroke: "none", title: chapter_list[index]["name"] });
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

	addTooltips();
}