var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

window.onload = function () {

    // transform files
    var requests = [d3.json(womenInScience), d3.json(consConf)];
    Promise.all(requests).then(function (response) {
        womenInScience = transformResponse(response[0])
        consConf = transformResponse(response[1])

        years_women = []
        datapoint_women = []
        len_womenInScience = 47

        // read first file and fill lists
        var i;
        for (i = 0; i < len_womenInScience; i++) {
            datapoint_women.push(womenInScience[i]["datapoint"])
            years_women.push(womenInScience[i]["time"])
        }
        
        // add None for missing datapoints
        var i;
        var listMissingValues = [10, 12, 14, 15, 17, 29, 30, 31]
        for (i = 0; i < (listMissingValues.length - 1); i++) {
            datapoint_women.splice(listMissingValues[i], 0, "None")
        }

        years_consConf = []
        country = []
        datapoint_consConf = []
        len_consConf = 54

        // add complete datapoints to lists
        var i;
        for (i = 0; i < len_consConf; i++) {
            years_consConf.push(consConf[i]["time"])
            country.push(consConf[i]["Country"])
            datapoint_consConf.push(consConf[i]["datapoint"])
        }
        countryList = ["France", "Germany", "Korea", "Netherlands", "Portugal", "UK"]
        yearList = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015]
        combinedList = []
        k = 0
        for (i = 0; i < countryList.length; i++) {
            for (j = 0; j < yearList.length; j++) {
                if (datapoint_women[k] !== "None") {
                    combinedList.push([datapoint_consConf[k], datapoint_women[k], countryList[i], yearList[j]]);
                }
                k++;
            }
        }

        // information text
        d3.select("body")
            .append("p").text("Student Name: Max Baneke")
            .append("p").text("Student Number: 10797564")
            .append("p").text("This boxplot provides data on the women in science and consumer confidence in different countries")

        // global constants
        var margin = {
            top: 20,
            right: 50,
            bottom: 50,
            left: 100
        };

        // width and height
        var w = 950 - margin.left - margin.right;
        var h = 500 - margin.top - margin.bottom;
        var padding = 2;

        // number of datapoints to create
        var numbDataPoints = 47

        // initialize scale
        var xScale = d3.scaleLinear()
            .domain([d3.min(datapoint_consConf, function (d) {
                return d;
            }), d3.max(datapoint_consConf, function (d) {
                return d;
            })])
            .range([padding, w - padding * 2]);

        var yScale = d3.scaleLinear()
            .domain([d3.min(datapoint_women, function (d) {
                return d;
            }), d3.max(datapoint_women, function (d) {
                return d;
            })])
            .range([h - padding, padding]);

        // initialize values
        var xValue = function (d) {
            return xScale(d[0]);
        }
        var yValue = function (d) {
            return yScale(d[1]);
        }

        // define axis labels
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        // create SVG element
        var svg = d3.select("body")
            .append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var colorValue = function (d) {
            return d.Country;
        }
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        // draw legend
        var legend = svg.selectAll(".legend")
            .data(countryList)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", 100)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", color);

        // draw legend text
        legend.append("text")
            .attr("x", 95)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            })

        // draw dots    
        svg.selectAll("circle")
            .data(combinedList)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return xValue(d);
            })
            .attr("cy", function (d) {
                return yValue(d);
            })
            .attr("r", 5)
            .style("fill", function (d) {
                return color(d[2]);
            });

        // create x axis labels
        svg.append("g")
            //.attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);

        // create y axis labels
        svg.append("g")
            //.attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);

        // create title x axis
        svg.append("text")
            .attr("transform", "translate(" + (w / 2) + " ," + (h + padding + 20) + ")")
            .attr("y", margin.top)
            .style("text-anchor", "middle")
            .text("Consumer confidence");

        // create title y axis 
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (h / 2))
            .attr("dy", "4em")
            .style("text-anchor", "middle")
            .text("Women in Science");

    }).catch(function (error) {
        throw (error);
    });

};

function transformResponse(data) {

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function (serie) {
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function (string) {
        // for each observation and its index
        observation.values.forEach(function (obs, index) {
            let data = dataHere[string].observations[index];
            if (data != undefined) {

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function (s, indexi) {
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
}