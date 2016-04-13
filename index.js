$(document).ready(function() {
    $.when(getBacterias()).done(function(bacterias) {
        plotGroupedBarChart(bacterias);
        plotHeatmap(bacterias);
        plotDotChart(bacterias);
    });
});

function getBacterias() {
    var endpoint = "bacterias.json";

    return $.ajax({
        url: endpoint,
        method: "GET"
    });
}

function plotDotChart(bacterias) {
    var layout = {
        xaxis: {
            title: 'MIC',
            type: 'log',
            autorange: true
        },
        margin: {
            l: 200
        }
    };

    Plotly.newPlot('dotChart', formatDotChart(bacterias), layout, {staticPlot: true});
}

function formatDotChart(bacterias) {
    var antibiotics = ["penicillin", "streptomycin", "neomycin"];
    var markers = ["circle", "square", "circle-open"];
    var data = [];
    var x = [];
    var y = [];

    for(var a in antibiotics) {
        var antibiotic = antibiotics[a];
        var trace = {};
        trace.marker = {};
        trace.marker.symbol = markers[a];
        trace.marker.size = 7;
        trace.name = antibiotic;

        for (var b in bacterias) {
            var bacteria = bacterias[b];

            if(y.length < bacterias.length) y.push(bacteria.bacteria);
            x.push(bacteria[antibiotic]);
        }

        trace.x = x;
        trace.y = y;
        trace.mode = "markers";

        data.push(trace);

        x = [];
    }

    return data;
}

function plotHeatmap(bacterias) {
    var data = formatHeatmap(bacterias);

    var layout = {
        title: "Antibiotics MIC vs Bacterias",
        xaxis: {
            title: "bacterias",
            showticklabels: true,
            tickangle: 25,
            tickfont: {
                family: 'Old Standard TT, serif',
                size: 10,
                color: 'black'
            }
        },
        margin: {
            l: 100
        },
        annotations: []
    };

    for ( var i = 0; i < data[0].y.length; i++ ) {
        for ( var j = 0; j < data[0].x.length; j++ ) {
            var currentValue = data[0].z[i][j];

            var textColor = (currentValue != 0.0) ? "white": "black";

            var result = {
                x: data[0].x[j],
                y: data[0].y[i],
                text: data[0].z[i][j],
                font: {
                    color: textColor
                },
                showarrow: false
            };

            layout.annotations.push(result);
        }
    }

    Plotly.newPlot("heatmap", data, layout, {staticPlot: true});
}

function formatHeatmap(bacterias) {
    var data = [];
    var map = {};
    var x = [];
    var y = ['penicillin', 'streptomycin', 'neomycin'];
    var z = [];

    z[0] = [];
    z[1] = [];
    z[2] = [];

    for(var b in bacterias) {
        var bacteria = bacterias[b];

        z[0][b] = Math.log(bacteria.penicillin).toFixed(4);
        z[1][b] = Math.log(bacteria.streptomycin).toFixed(4);
        z[2][b] = Math.log(bacteria.neomycin).toFixed(4);

        x.push(bacteria.bacteria);
    }

    data.push(map);
    map.x = x;
    map.y = y;
    map.z = z;
    map.type = "heatmap";
    map.colorscale = [[0, '#001f3f'], [1, '#3D9970']];

    return data;
}

function plotGroupedBarChart(bacterias) {
    var layout = {
        title: "Antibiotics MIC vs Bacterias",
        xaxis: {
            title: "bacterias",
            showticklabels: true,
            tickangle: 25,
            tickfont: {
                family: 'Old Standard TT, serif',
                size: 10,
                color: 'black'
            }
        },
        yaxis: {
            title: 'MIC',
            type: 'log',
            autorange: true
        }
    };

    Plotly.newPlot("groupedBarChart", formatGroupedBarChart(bacterias), layout, {staticPlot: true});
}

function formatGroupedBarChart(bacterias) {
    var antibiotics = ["penicillin", "streptomycin", "neomycin"];
    var data = [];
    var x = [];
    var y = [];

    for(var a in antibiotics) {
        var antibiotic = antibiotics[a];
        var trace = {};

        for(var b in bacterias) {
            var bacteria = bacterias[b];

            if(x.length < bacterias.length) x.push(bacteria.bacteria);
            y.push(bacteria[antibiotic]);
        }

        trace.x = x;
        trace.y = y;
        trace.name = antibiotic;
        trace.type = "bar";

        data.push(trace);

        y = [];
    }

    return data;
}