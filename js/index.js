















var dataset = []; // = [ 25, 7, 5, 26, 11 ];
for (var i=0; i<25; i++){
    dataset.push(Math.random()*30);
}

d3.select("body").selectAll("div")
    .data(dataset)
    .enter()
    .append("div")
    .attr("class", "bar1")
    .style("height", function(d){
        var barHeight = d*5;
        return barHeight + "px";
    })
    .style("margin-right", "2px");

var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

var w = 500;
var h = 100;
var barPadding = 1;
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", function(d){
        return h - d*4;
    })
    .attr("width", w/dataset.length - barPadding)
    .attr("x", function(d, i) {
        return i * (w/dataset.length);
    })
    .attr("height", function(d) {
        return d*4;
    })
    .attr("fill", function(d){
        return "rgb(0, 0, " + (d*10) + ")";
    });

svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function (d){ return d; })
   .attr("text-anchor", "middle")
   .attr("x", function(d, i){
        return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
   })
   .attr("y", function(d){
        return h - (d*4) + 14;
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "white");


var dataset = [
                [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
                [410, 12], [475, 44], [25, 67], [85, 21], [220, 88], [600, 150]
              ];
h=300;
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var padding = 20;      

var xScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) { return d[0]; })])
                     .range([padding, w - padding*2]);
                     
var yScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                     .range([h - padding, padding]);

var rScale = d3.scale.linear()
                     .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                     .range([2, 5]);

svg.selectAll("circle")
   .data(dataset)
   .enter()
   .append("circle")
    .attr("cx", function(d) {
        return xScale(d[0]);
   })
   .attr("cy", function(d) {
        return yScale(d[1]);
   })
   .attr("r", function(d) {
    return rScale(d[1]);
    });

svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text") 
   .text(function(d) {
        return d[0] + "," + d[1];
   })
   .attr("x", function(d) {
        return xScale(d[0]);
   })
   .attr("y", function(d) {
        return yScale(d[1]);
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "red");







var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "%");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "translate(-" + (margin.left + 5) + "," + height/2 + ") rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      // .attr("transform", "translate(" + -15 + ",0")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); });

});

function type(d) {
  d.frequency = +d.frequency;
  return d;
}