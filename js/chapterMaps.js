var mapCities = function(paper) {
	var cities = [];

	for (index in chapter_list) {
		var xpos = chapter_list[index]["xLoc"];
		var ypos = chapter_list[index]["yLoc"];

		if (xpos != 0 || ypos !=0) {
			cities[index] = mapPaper.circle(xpos, ypos, 4);
			cities[index].attr({ fill: "black", stroke: "none", title: chapter_list[index]["name"] });

			cities[index].click(function() {
				console.log(cities[index].attr("title"));
			});
		}
	}

	addTooltips();
}