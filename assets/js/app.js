// Data
var dataArray = [];
var dataCategories = [];

// svg container
var svgHeight = 400;
var svgWidth = 1000;

// margins
var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

// Chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// Create svg container
var svg = d3.select("#scatter").append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read data from CSV
d3.csv("../../assets/data/data.csv").then(function(demoData) {

  console.log(demoData);

  // Cast values in demoData as a number using the unary + operator
  demoData.forEach(function(data) {
  data.state = data.state;
  data.healthcare = +data.healthcare;
  data.poverty = +data.poverty;
  data.smokes = +data.smokes;
  data.age = +data.age;

  dataArray.push(data.healthcare);
  dataCategories.push(data.poverty);

});

console.log(dataArray);
console.log(dataCategories);

// Scale x to chart width
var xScale = d3.scaleLinear()
  .domain([0, d3.max(dataCategories)])
  .range([0, chartWidth]);

// Scale y to chart height
var yScale = d3.scaleLinear()
  .domain([0, d3.max(dataArray)])
  .range([chartHeight, 0]);

var bottomAxis = d3.axisBottom(xScale);
var leftAxis = d3.axisLeft(yScale);

//Set x to the bottom of the chart
chartGroup.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + chartHeight + ")")
  .call(bottomAxis);

// Set y to the y axis
chartGroup.append("g")
  .attr("class", "y axis")
  .call(leftAxis);

// Append data to chartGroup, include transitions and tooltip text for each circle
var circlesGroup = chartGroup.selectAll("circle")
  .data(demoData)
  .enter()
  .append("circle")
  .attr("cx", function (d, i) {return xScale(demoData[i].poverty)})
  .attr("cy", function (d, i) {return yScale(demoData[i].healthcare)})
  .attr("r", "10")
  .attr("fill", "red")
  .attr("opacity", "0.5")
  .on("mouseover", function() {
    d3.select(this)
              .transition()
              .duration(500)
              .attr("r", "20")
              .attr("fill", "green");
      })
      .on("mouseout", function() {
        d3.select(this)
              .transition()
              .duration(500)
              .attr("r", "10")
              .attr("fill", "red");
      })
  .append("svg:title")
   .text(function(d, i) { return demoData[i].abbr + ": " + demoData[i].healthcare + ", " + demoData[i].poverty; });

  //Add labels to circles
    // chartGroup.selectAll("circle")
    // .data(demoData)
    // .enter()
    // .append("text")
    // .attr("dx", function(d){return -20})
    // .text(function (d, i) {return d[i].abbr});

  // Create group for 2 x-axis labels
   chartGroup.append("text")
   .attr("transform", "translate(" + (svgWidth / 2) + "," + (svgHeight*0.85) + ")")
   .style("text-anchor", "middle")
   .text("In Poverty (%)");

   chartGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left)
   .attr("x",0 - (svgHeight / 3))
   .attr("dy", "1em")
   .style("text-anchor", "middle")
   .text("Lacks Healthcare (%)");

});
