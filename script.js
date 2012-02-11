// js source code for Awesome Foundation information visualization project
// http://www.awesomefoundation.org
// http://github.com/nkkl/awesomeviz

$(document).ready(function() {
	// create our canvas
	// params: x, y, width, height
	var paper = new Raphael(document.getElementById("canvas"), $("#canvas").width(), $("#canvas").height());

	startDraw(paper, 20, 20);

	// add tooltips
	$("#canvas a").qtip({
		style: {
			tip: true,
			classes: 'ui-tooltip-tipsy ui-tooltip-shadow'
		}
	});
});

var startDraw = function(paper, x, y) {	
	// draw two rectangles
	//  params: x, y, width, height, (radius=0)
	var r1 = paper.rect(x, y, 80, 40);
	r1.attr({fill: 'black', stroke: 'none', title: '80'})

	var r2 = paper.rect(x + 83, y, 40, 40);
	r2.attr({fill: 'black', stroke: 'none', title: '40'});
};