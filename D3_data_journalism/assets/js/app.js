datapath = "assets/data/data.csv"

//define chart area
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter").append("svg")
    .attr("height",svgHeight)
    .attr("width",svgWidth)
    .classed("chart", true);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    

//import data from csv    
d3.csv(datapath).then(function(params){
    console.log(params);
    var poverty=[];
    var obesity=[];
    var abbreviation=[];

    //push data into arrays and convert to numbers
    params.forEach(function(data){
        poverty.push(+data.poverty);
        obesity.push(+data.obesity);
        abbreviation.push(data.abbr);
    });

    //scale axes and create
    
    var xExtent = d3.extent(poverty),
    xRange = xExtent[1] - xExtent[0];
    var yExtent = d3.extent(obesity),
    yRange = yExtent[1] - yExtent[0];
  
    var xDomain = ([xExtent[0] - (xRange * .10), xExtent[1] + (xRange * .10)]);
    var yDomain = ([yExtent[0] - (yRange * .10), yExtent[1] + (yRange * .10)]);

    var xLinearScale = d3.scaleLinear()
        .domain(xDomain)
        .range([0,width]);
    var yLinearScale = d3.scaleLinear()
        .domain(yDomain)
        .range([height,0])

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //create circles for each data point    
    var circlesGroup = chartGroup.selectAll("circle")
        .data(params)
        .enter();

    var radius = 10
    circlesGroup
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "10")
        .attr("text",d=>d.abbr);

    circlesGroup    
        .append("text")
        .text(d => d.abbr)
        .attr("dx", d => xLinearScale(d.poverty))
        .attr("dy", d => yLinearScale(d.obesity)+radius/3)
        .attr("font-size",radius)
        .attr("class","stateText")
        ;

    
    // axes titles
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obesity %");
  
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty %");




});