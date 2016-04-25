(function(){

    // Data in line.csv

	// The Model
	var model = raw.model();

	// X axis dimension
	// Adding a title to be displayed in the UI
 	// and limiting the type of data to Numbers only
	var x = model.dimension() 
		.title('X Axis')
		.types(Date);

	// Y axis dimension
	// Same as X
	var y = model.dimension() 
		.title('Y Axis')
		.types(Number);

	// Mapping function
	// For each record in the data returns the values
	// for the X and Y dimensions and casts them as numbers
	model.map(function (data){
		// console.log(data);
		return data.map(function (d){
			// console.log( parseDate(d.date) );
			return {
				x : parseDate( d.date) ,
				y : +(d.close)
			}
		});
	});

	var parseDate = d3.time.format("%d-%b-%y").parse;
    //var parseDate = d3.time.format("%d-%b").parse;


    // The Chart
	var chart = raw.chart()
		.title("Line Chart")
		.description("A simple line chart")
		.model(model);

	// Some options we want to expose to the users
	// For each of them a GUI component will be created
	// Options can be use within the Draw function
	// by simply calling them (i.e. witdh())
	// the current value of the options will be returned

	// Width
	var width = chart.number()
		.title('Width')
		.defaultValue(900);

	// Height
	var height = chart.number()
		.title('Height')
		.defaultValue(600);

	// A simple margin
	var margin = chart.number()
		.title('margin')
		.defaultValue(10);

	


	// Drawing function
	// selection represents the d3 selection (svg)
	// data is not the original set of records
	// but the result of the model map function
	chart.draw(function (selection, data){


		// Sort by date
		data.sort(function(a,b){
		  return -(new Date(b.x) - new Date(a.x));
		});

		// svg size
		var g = selection
            .attr("width", +width() )
            .attr("height", +height() )
            //.append("svg")
            ;

         // x and y scale
        var yScale = d3.scale.linear().domain([0, d3.max(data, function (d){ return d.y; })]).range([height()-margin()-4, margin()]);

        var xScale = d3.time.scale().domain([data[0].x, data[data.length-1].x]).range([margin() + 20, width()-margin()+20]);

        // Create Axes
        var xAxis = d3.svg.axis().scale(xScale)
            .orient("bottom")
            .ticks(5)
            ;

        var yAxis = d3.svg.axis().scale(yScale)
            .orient("left").ticks(5);

        // Draw the data onto SVG
        g.append("svg")
            .selectAll("chart")
            .data([data])
            .enter()
            .append("path")
            .attr("class", "line")
            .attr( "d", interpolateLinear( data) )
            .attr("stroke", "black")
            .attr("fill", "none")
            ;


        // Draw the Axes onto SVG
		g.append("g")
            .attr("class", "x axis")
            .call(xAxis)
            .style("stroke-width", "1px")
            .style("font-size","10px")
            .style("font-family","Arial, Helvetica")
            .attr("transform", "translate(" + 0 + "," + (height()-20) + ")")
            ;

        g.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .style("stroke-width", "1px")
            .style("font-size","10px")
            .style("font-family","Arial, Helvetica")
            .attr("transform", "translate(" + (margin() + 20) + "," + 0 + ")")
        ;




        // Interpolate
		// var line = d3.svg.line()
  //           .interpolate(curves[curve()])
  //           .x(function(d) { return x(d.x); })
  //           .y(function(d) { 
  //               var y0 = y(d.y0), y1 = y(d.y0 + d.y);
  //               return y0 + (y1 - y0) * 0.5;
  //           });



		// function interpolateLinear ( points ) {
		// 	console.log(points);
		// 			console.log(" ");

		// 	return points.join("L");
		// }

		function interpolateLinear(points) {
			var path = "";
			for (var i = 0; i < points.length; i++) {
				if (i) { 
					path += "L";
				} else {
					path += "M";
				}
				// console.log( points[i].x );
				// console.log(xScale( points[i].x ));
				if (! points[i].x) {
					points[i].x = 0;
				}
				path += xScale( points[i].x ) + "," + yScale( points[i].y );
			}
			return path;
		}

	})
})();