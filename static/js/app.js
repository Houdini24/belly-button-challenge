//get the endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Function to create the bar chart and update it based on the selected sample
function createBarChart(IDs) {
    d3.json(url).then((data) => {
      let samples = data.samples;
      let value = samples.filter((result) => result.id == IDs);
      let data = value[0];
  
      let otu_ids = data.otu_ids;
      let otu_labels = data.otu_labels;
      let sample_values = data.sample_values;
  
      let yValue = otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse();
      let xValue = sample_values.slice(0, 10).reverse();
      let labels = otu_labels.slice(0, 10).reverse();
  
      let trace = {
        x: xValue,
        y: yValue,
        text: labels,
        type: "bar",
        orientation: "h",
      };
  
      let layout = {
        title: "Top 10 OTUs",
      };
  
      Plotly.newPlot("bar", [trace], layout);
    });
  }
  
  // Function to create the bubble chart and update it based on the selected sample
  function createBubbleChart(IDs) {
    d3.json(url).then((data) => {
      let samples = data.samples;
      let value = samples.filter((result) => result.id == IDs);
      let data = value[0];
      let otu_ids = data.otu_ids;
  
      let otu_labels = data.otu_labels;
      let sample_values = data.sample_values;
  
      let trace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Viridis",
        },
      };
  
      let layout = {
        title: "Bubble Chart",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" },
      };
  
      Plotly.newPlot("bubble", [trace], layout);
    });
  }
  
  // Function to display sample metadata based on the selected ID
  function displayMetadata(IDs) {
    d3.json(url).then(function (data) {
      metadata = data.metadata;
      let box = d3.select("#sample-metadata");
  
      let resultArray = metadata.filter((sampleObj) => sampleObj.id == IDs);
      let result = resultArray[0];
  
      box.html("");
  
      Object.keys(result).forEach((key) => {
        box.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
      });
    });
  }
  
  // Function to update the dashboard when a new test subject ID is selected
  function optionChanged(IDs) {
    // Call the functions to update the charts and metadata for the selected test subject ID
    createBarChart(IDs);
    createBubbleChart(IDs);
    displayMetadata(IDs);
  }
  
  // Get the select dropdown element
  const selectDropdown = d3.select("#selDataset");
  
  // Use D3 to fetch data from the provided URL
  d3.json(url).then(function (samples_values) {
    // Extract the list of sample IDs from the data
    const sampleIDs = samples_values.names;
  
    // Populate the dropdown with the sample IDs
    sampleIDs.forEach((id) => {
      selectDropdown.append("option").text(id).property("value", id);
    });
  
    // Call the optionChanged function with the default selected test subject ID
    const defaultSelectedID = sampleIDs[0];
    optionChanged(defaultSelectedID);
  });
  
  // Event listener for the dropdown to call optionChanged when a new option is selected
  selectDropdown.on("change", function () {
    const IDs = this.value;
    optionChanged(IDs);
  });
  
  init();