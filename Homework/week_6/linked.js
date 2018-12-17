d3.select("body")
.append("p").text("Student Name: Max Baneke")
.append("p").text("Student Number: 10797564")
.append("p").text("This map provides information on the Gross Domestic Product (GDP) of all countries in the world. Click on a country to see the GDP of the past 50 years.")
.append("p").text("Source: The World Bank")

window.onload = function() {

    var data = "world_countries.json"
    var GDP = "GDPcountries.json"
    var requests = [d3.json(data), d3.json(GDP)];
  
    Promise.all(requests).then(function(response) {
        main(response);
    }).catch(function(e){
    throw(e);   
    });
}
    function main (response){
        var data = response[0];
        var GDP = response[1];

        // var format = d3.format(",");

        // get gdp data and put in list
        Country_GDP = []
        Country = [];
        GDP_2017 = [];
        historicGDP = [];
        var i;
        var j;
        
        for (i = 0; i < 263; i++) {
            country = []
            historicGDP.push(country)
            for (j = 0; j < 1; j++){ 
                country.push((GDP[i]["1967"])/1000000000)
                country.push((GDP[i]["1977"])/1000000000)
                country.push((GDP[i]["1987"])/1000000000)
                country.push((GDP[i]["1997"])/1000000000)
                country.push((GDP[i]["2007"])/1000000000)
                country.push((GDP[i]["2017"])/1000000000)
                }
            Country.push(GDP[i]["Country Name"])
            GDP_2017.push(((GDP[i]["2017"])/1000000000).toFixed(2));
        }
        
        // Set tooltips and put gdp data in map
        var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                        if(Country.includes(d.properties.name)){
                            var location = Country.indexOf(d.properties.name)
                            var NewGDP2017 = GDP_2017[location];
                        }
                    return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>GDP(billions): </strong><span class='details'>" + NewGDP2017 +"<br></span>";
                    })

    var margin = {top: -50, right: 50, bottom: 50, left: 50}
    , width = window.innerWidth - margin.left - margin.right 
    , height = window.innerHeight - margin.top - margin.bottom; 

        var color = d3.scaleThreshold()
        .domain([50,100,500,1000,5000,10000,15000,"No value"])
        .range(["rgb(255,255,178)", "rgb(254,217,118)", "rgb(254,178,76)", "rgb(253,141,60)","rgb(252,78,42)","rgb(227,26,28)","rgb(177,0,38)","rgb(37,37,37)"]);
        
        var path = d3.geoPath();

        var svg = d3.select("#map")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append('g')
                    .attr('class', 'map');
        
        var projection = d3.geoMercator()
                        .scale(130)
                        .translate( [width / 2, height / 1.5]);

        var path = d3.geoPath().projection(projection);

        svg.call(tip);
        ready(data, GDP);
        function ready(data, GDP) {

        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "25px") 
            .text("GDP per Country");
            
        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function(d) {
                if(Country.includes(d.properties.name)){
                    var location = Country.indexOf(d.properties.name)
                    var NewGDP2017 = GDP_2017[location]
                    return color(NewGDP2017); 
                }
            })
            .style('stroke-width', 1.5)
            .style("opacity",0.8)
            
            // tooltips
            .style('stroke-width', 0.3)
            .on('mouseover',function(d){
                tip.show(d);

                d3.select(this)
                .style("opacity", 1)
                .style("stroke","white")
                .style("stroke-width",3);
            })
            .on('mouseout', function(d){
                tip.hide(d);

                d3.select(this)
                .style("opacity", 0.8)
                .style("stroke","white")
                .style("stroke-width",0.3);
            })
            // load line chart of country when clicked on
            .on('click', function(d){
                d3.select("#chart > *").remove()
                var data = [];
                if(Country.includes(d.properties.name)){
                    var location = Country.indexOf(d.properties.name)
                    HistoricGDP = historicGDP[location]
                    data.push({name: d.properties.name, value: HistoricGDP})
                    createLinechart(data)
                    return(data)
                }
                
            });
        
        svg.append("path")
            .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
            .attr("class", "names")
            .attr("d", path);

        // create legend
        legend = svg.selectAll("#map")
                    .data([50,100,500,1000,5000,10000,15000,"No value"])
                    .enter()
                    .append("g")
                    .attr("class", ".legend")
                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // create boxes
        legend.append("rect")
            .attr("x", width - 35)
            .attr("y", 0)
            .attr("width", 32)
            .attr("height", 20)
            .style("fill", color);

        // add text to legend
        legend.append("text")
                .attr("x", width - 100)
                .attr("y", 20)
                .text(function(d){
                return d;
                })
        }
    }

function createLinechart(data) {
    
    // use standard margins
    var margin = {top: 50, right: 50, bottom: 50, left: 50}
    , width = window.innerWidth - margin.left - margin.right 
    , height = window.innerHeight - margin.top - margin.bottom; 
    
    // number of datapoints
    var n = 6;

    // add SVG 
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X scale
    var xScale = d3.scaleLinear()
        .domain([1967, 2017]) // input
        .range([0, width]); // output
   
    // Y scale 
    var yScale = d3.scaleLinear()
        .domain([0, 20000]) // input 
        .range([height, 0]); // output 

    // X axis
    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(xScale));
    
    // Y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale));
    
        
    // select data from dictonary
        // testdata = []
        // for (i = 2000; i < 2017; i++) {
        
        // lifeAndTime = Object.values(life[country])[i - 2000];
        // var obj = {};
        // obj['year'] = i;
        // obj['lifeexp'] = lifeAndTime;
        // testdata.push(obj)
        
        // }
        
        // var dataset = testdata    

    console.log(data)

    // create line
    var line = d3.line()
        .x(function(d) { return xScale(d.year); })
        .y(function(d) { return yScale(d.GDP); })
        .curve(d3.curveMonotoneX);
   
    // append path
    svg.append("path")
        .datum(data)
        .attr("class", "line") 
        .attr("d", line); 
    
    // add a circle for each datapoint 
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) { return xScale(d.year) })
        .attr("cy", function(d) { return yScale(d.GDP) })
        .attr("r", 5)
        .on("mouseover", function(a, b, c) { 
                console.log(a) 
            this.attr('class', 'focus')
            })
        .on("mouseout", function() {  })
    }