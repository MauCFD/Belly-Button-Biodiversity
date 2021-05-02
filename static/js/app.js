let id = "";
let dataset;

function run() {
  d3.json("samples.json").then(function(data){
    dataset = data;

    console.log(dataset);

    metaData(940,dataset);
    barChart(940,dataset);
    bubbleChart(940,dataset);

    let optionList = d3.select("#selDataset");

    data.names.forEach(function(name){
      optionList.append("option").text(name);
    });
 })
}

function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  }

function optionChanged(value) {
    id = value;
    
    metaData(id,dataset);
    barChart(id,dataset);
    bubbleChart(id,dataset);
}

function metaData(id,dataset) {
    let mData = dataset.metadata.filter(row => row.id == id);
    d3.select("#sample-metadata").html(displayObject(mData[0]));
}

function displayObject(obj) {
    let strg = "";
    Object.entries(obj).forEach(([key,value]) => {
        strg += `<br>${key} - ${value}</br>`;
        if(key=="wfreq"){
            buildGauge(value);
            console.log("gauge value is:" +value);
        }        
    });
    return strg;
}

function barChart(id,dataset) {    
    let barChartData = dataset.samples.filter(sample => sample.id == id);
    console.log(barChartData);
    
    let y = barChartData.map(row =>row.otu_ids);  
    let y1 =[];
   
    for(i = 0; i < y[0].length; i++){
        y1.push(`OTU ${y[0][i]}`);
    }

    let x = barChartData.map(row =>(row.sample_values));
    let text = barChartData.map(row =>row.otu_labels);
    
    let trace = {
        x:x[0].slice(0,10),
        y:y1.slice(0,10),
        text:text[0].slice(0,10),
        type:"bar",
        orientation:"h",        
    };

    let data = [trace];

    let layout = {
        yaxis: {
            autorange: "reversed" 
        }
    }
    
    Plotly.newPlot("bar",data,layout);
}

function bubbleChart(id,dataset) {
    let barChartData = dataset.samples.filter(sample => sample.id == id);
    console.log(barChartData); 

    let x = barChartData.map(row =>row.otu_ids); 
    let y = barChartData.map(row =>row.sample_values); 
    let text = barChartData.map(row =>row.otu_labels);
    let marker_size = barChartData.map(row =>row.sample_values);
    let marker_color = barChartData.map(row =>row.otu_ids);
    
    console.log(x[0]);
    console.log(y[0]);
    console.log(text);
    
    let trace1 = {
        x:x[0],
        y:y[0],
        text: text[0],
        mode:"markers",
        marker: {
            color: marker_color[0],
            size: marker_size[0]
        }
        
    };

    let data = [trace1];

    let layout = {
        xaxis:{
            title: "OTU ID"
        }
    };

    Plotly.newPlot("bubble",data,layout);
}

run();