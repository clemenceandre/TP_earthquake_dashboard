async function fetchData() {
    // write async code to get the data from the API

    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    const response = await fetch(url);
    const data = await response.json();
    return data;

    }   

function processData(geoData){
    //map list[A] => list[B]
    return geoData.features.map(feature => {
        return {
        coordinates: feature.geometry.coordinates,
        magnitude: feature.properties.mag,
        time: feature.properties.time
        }
    })
}

//QUESTION 1

function plotMap(earthquakeData){
    const trace1 = {
        type: 'scattergeo',
        locationmode: 'world',
        lon: earthquakeData.map(d => d.coordinates[0]),
        lat: earthquakeData.map(d => d.coordinates[1]),
        text: earthquakeData.map(d => `Magnitude:${d.magnitude} Time : ${new Date(d.time * 1000)}`),
        marker:{
            size: earthquakeData.map(d => d.magnitude * 4),
            color: earthquakeData.map(d => d.magnitude),
            cmin: 0,
            cmax:8,
            colorscale: 'Viridis',
            colorbar:{
                title: 'Magnitude'
            }

        }
    };

    const layout1 = {
        title: 'Emplacements des séismes dans le monde cette semaine',
        geo: {
            scope: 'world',
            projection: {
                type: 'natural earth'
            },
            showland: true,
            landcolor: 'rgb(243, 243, 243)',
            countrycolor: 'rgb(204, 204, 204)'
        }
    };

    Plotly.newPlot('earthquakePlot', [trace1], layout1);
}

//QUESTION 2

function plotHistogram(earthquakeData) {
    const magnitudes = earthquakeData.map(d => d.magnitude);
    
    const trace2 = {
        x: magnitudes,
        type: 'histogram',
        marker: {
            color: 'rgba(100, 250, 100, 0.7)',
            line: {
                color: 'rgba(200, 200, 200, 1)',
                width: 1
            }
        }
    };

    const layout2 = {
        title: 'Distribution des magnitudes des séismes',
        xaxis: { title: 'Magnitude' },
        yaxis: { title: 'Count' },
        bargap: 0.05
    };

    Plotly.newPlot('magnitudeHistogram', [trace2], layout2);
}

//QUESTION 3

function plotTimeSeries(earthquakeData) {
    const dateCounts = earthquakeData.reduce((counts, d) => {
        const date = new Date(d.time).toISOString().split('T')[0]; // Get the date part only
        counts[date] = (counts[date] || 0) + 1;
        return counts;
    }, {});

    const dates = Object.keys(dateCounts).sort();
    const counts = dates.map(date => dateCounts[date]);

    const trace3 = {
        x: dates,
        y: counts,
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
            color: 'rgba(50, 100, 200, 0.7)',
            line: {
                color: 'rgba(50, 100, 200, 1)',
                width: 1
            }
        }
    };

    const layout3 = {
        title: 'Nombre de séismes par jour (dernière semaine)',
        xaxis: { title: 'Date' },
        yaxis: { title: 'Nombre de séismes' }
    };

    Plotly.newPlot('timeSeriesPlot', [trace3], layout3);
}

//QUESTION 4 

function plotMagnitudeDepth(earthquakeData) {
    const magnitudes = earthquakeData.map(d => d.magnitude);
    const depths = earthquakeData.map(d => d.coordinates[2]);

    const trace4 = {
        x: magnitudes,
        y: depths,
        mode: 'markers',
        marker: {
            size: magnitudes.map(mag => mag * 2),
            color: magnitudes,
            colorscale: 'Viridis',
            colorbar: {
                title: 'Magnitude'
            }
        }
    };

    const layout4 = {
        title: 'Relation entre la magnitude et la profondeur des séismes',
        xaxis: { title: 'Magnitude' },
        yaxis: { title: 'Profondeur (km)' }
    };

    Plotly.newPlot('magnitudeDepthPlot', [trace4], layout4);
}

//POUR AFFICHER TOUT CE QUON VIENT DE FAIRE 

fetchData()
    .then(rawData => processData(rawData))
    .then(cleanData => {
        plotMap(cleanData);
        plotHistogram(cleanData);
        plotTimeSeries(cleanData);
        plotMagnitudeDepth(cleanData);
    })