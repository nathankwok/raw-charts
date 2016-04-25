(function(){

    // Data in line.csv

	// The Model
	var model = raw.model();

	// X axis dimension
	// Adding a title to be displayed in the UI
 	// and limiting the type of data to Numbers only
	var x = model.dimension() 
		.title('X Axis')
		.types(Number);

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
				x : d.age ,
				y : +(d.population)
			}
		});
	});

	// The Chart
	var chart = raw.chart()
		.title("Pie Chart")
		.description("A simple pie chart")
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

	var radius = Math.min(width(), height()) / 2;

	var color = d3.scale.ordinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);



	// Drawing function
	// selection represents the d3 selection (svg)
	// data is not the original set of records
	// but the result of the model map function
	chart.draw(function (selection, data){
		// SVG size
		var svg = selection
            .attr("width", +width() )
            .attr("height", +height() )
            .append("g")
			.attr("transform", "translate(" + width() / 2 + "," + height() / 2 + ")")
            ;

		var arc = d3.svg.arc()
			.outerRadius(radius - 10)
			.innerRadius(0);

		var labelArc = d3.svg.arc()
			.outerRadius(radius - 40)
			.innerRadius(radius - 40);

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { return d.y; });

		// Draw the data onto SVG
		var g = svg.selectAll(".arc")
			.data(pie(data))
			.enter().append("g")
			.attr("class", "arc");

        // Draw the Axes onto SVG
        g.append("path")
			.attr("d", arc)
			.style("fill", function(d) { return color(d.data.x); });

        // Label data
        g.append("text")
			.attr("transform", function(d) {
				return "translate(" + labelArc.centroid(d) + ")"; })
			.attr("dy", ".35em")
			.text(function(d) { return d.data.x; });

	})
})();