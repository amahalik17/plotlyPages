// Create a function to plot all charts and plots
function plotData(id) {

    // Read in the data(samples.json)
    d3.json('Data/samples.json').then((data) => {
        console.log(data);

        var wfreq = data.metadata.map(details => details.wfreq);
        console.log(wfreq);

        // filter samples by id, and convert to string
        var samples = data.samples.filter(details => details.id.toString() === id)[0];
        console.log(samples);

        // Get the top 10 OTUs
        var sampleValues = samples.sample_values.slice(0, 10).reverse();
        var topTenOTU = (samples.otu_ids.slice(0, 10)).reverse();

        var OTU_ids = topTenOTU.map(details => "OTU" + details);

        var labels = samples.otu_labels.slice(0, 10);

        console.log(`OTU Ids: ${OTU_ids}`);
        console.log(`Sample Values: ${sampleValues}`);
        console.log(`Top ten OTU IDs: ${topTenOTU}`);

        // Create traces for bar plot
        var trace1 = {
            x: sampleValues,
            y: OTU_ids,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Create data variable for plot
        var data = [trace1];

        // Create layout variable for plot
        var layout = {
            title: "Top Ten OTUs",
            yaxis: {
                tickmode: "linear"
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Initiate the horizontal bar plot
        Plotly.newPlot("bar", data, layout);

        // Create traces for bubble plot
        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };

        // Create the layout variable
        var layout2 = {
            xaxis: {title: "OTU ID"},
            height: 750,
            width: 1250
        };

        var data2 = [trace2];

        Plotly.newPlot("bubble", data2, layout2);

        // Create guage plot
        var guageData = [
            {
                domain: {x: [0, 1], y: [0, 1] },
                value: parseFloat(wfreq),
                title: {text: 'Weekly Washing Frequency'},
                type: 'indicator',
                mode: 'guage+number',
                guage: {axis: {range: [null, 9] },
                    steps: [
                    { range: [0, 2], color: "yellow" },
                    { range: [2, 4], color: "cyan" },
                    { range: [4, 6], color: "teal" },
                    { range: [6, 8], color: "lime" },
                    { range: [8, 9], color: "green" },
                    ]}
            }];
        
        var layout3 = {
            width: 750,
            height: 600,
            margin: {t: 20, b: 20, l: 40, r: 40}
        };

        Plotly.newPlot("guage", guageData, layout3);

    });

};

// Create a function to grab the data
function getData(id) {
    d3.json('Data/samples.json').then((data) => {

        var metadata = data.metadate;
        console.log(metadata);

        var results = metadata.filter(meta => meta.id.toString() === id)[0];

        var demoData = d3.select("#sample-metadata");
        // clear the panel each time
        demoData.html("");

        Object.entries(results).forEach((key) => {
            demoData.append("h5").text(key[0].toUpperCase() + ": " + key[1]);  
        });
    });
};

// Create a function that uses the last two function for changed ids
function idChanged(id) {
    plotData(id);
    getData(id);
};

function init() {
    var dropDownMenu = d3.select("#selDataset");

    // Read in the data
    d3.json("Data/samples.json").then((data) => {
        console.log(data);

        data.names.forEach(function(name) {
            dropDownMenu.append("option").text(name).property("value");
        });
        // Call functions to display data amd plots
        plotData(data.names[0]);
        getData(data.names[0]);
    });
};

init();

