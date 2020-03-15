function buildMetadata(sample) {

  //builds sample data on side.

  var metadataURL = `/metadata/${sample}`;

  d3.json(metadataURL).then(function(sample) {

      let sampleData = d3.select(`#sample-metadata`);

      // Use `.html("") to clear any existing metadata

      sampleData.html("");

      // Use `Object.entries` to add each key and value pair to the panel

      // Hint: Inside the loop, you will need to use d3 to append new

      // tags for each key-value in the metadata.

      Object.entries(sample).forEach(([key, value]) => {

          let row = sampleData.append("p");

          row.text(`${key}:${value}`)

      })

  });

  // buildGauge(data.WFREQ);

}




function buildCharts(sample) {

  //////@TODO: Use `d3.json` to fetch the sample data for the plots

  var plotData = `/samples/${sample}`;

  d3.json(plotData).then(data => {

      let xAxis = data.otu_ids;

      let yAxis = data.sample_values;

      let size = data.sample_values;

      let color = data.otu_ids;

      let texts = data.otu_labels;



      //////@TODO: Build a Bubble Chart using the sample data

      let bubble = {

          x: xAxis,

          y: yAxis,

          text: texts,

          mode: `markers`,

          marker: {

              size: size,

              color: color

          }

      };

      var data = [bubble];

      let layout = {

          title: "Belly Button Bacteria",

          xaxis: {
              title: "OTU ID"
          }

      };

      Plotly.newPlot("bubble", data, layout);



      ////// @TODO: Build a Pie Chart

      d3.json(plotData).then(data => {

          let values = data.sample_values.slice(0, 10);

          let labels = data.otu_ids.slice(0, 10);

          let display = data.otu_labels.slice(0, 10);

          var pie_chart = [{

              values: values,

              lables: labels,

              hovertext: display,

              type: "pie"

          }];



          Plotly.newPlot('pie', pie_chart);

      });

  });

};



function init() {

  // Grab a reference to the dropdown select element

  var selector = d3.select("#selDataset");



  // Use the list of sample names to populate the select options

  d3.json("/names").then((sampleNames) => {

      sampleNames.forEach((sample) => {

          selector

              .append("option")

              .text(sample)

              .property("value", sample);

      });



      // Use the first sample from the list to build the initial plots

      const firstSample = sampleNames[0];

      buildCharts(firstSample);

      buildMetadata(firstSample);

  });

}



function optionChanged(newSample) {

  // Fetch new data each time a new sample is selected

  buildCharts(newSample);

  buildMetadata(newSample);

}



// Initialize the dashboard

init();