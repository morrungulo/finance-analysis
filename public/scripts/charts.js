const allCharts = {};

const percentageCharts = document.querySelectorAll('[data-chart-percentage-bar]');
percentageCharts.forEach(element=> {
    const rawdata = element.getAttribute('data-chart-percentage-bar');
    const options = {
        series: [{
            data: [rawdata]
        }],
        chart: {
            type: 'bar',
            width: 120,
            height: 30,
            sparkline: {
                enabled: true
            }
        },
        colors: ['rgba(54, 162, 235, 0.7)'],
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '25%',
            },
        },
        labels: [0],
        yaxis: {
            min: 0,
            max: 100,
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: false,
        }
    };
    const chart = new ApexCharts(element, options);
    chart.render();
});

const sparklineCharts = document.querySelectorAll('[data-chart-line-single]');
sparklineCharts.forEach(element => {
    const rawdata = JSON.parse(element.getAttribute('data-chart-line-single'));
    const options = {
        series: [{
            data: rawdata.reverse(),
        }],
        chart: {
            type: 'line',
            width: 120,
            height: 30,
            sparkline: {
                enabled: true,
            },
        },
        colors: ['rgba(54, 162, 235, 0.7)'],
        stroke: {
            width: 2,
        },
        tooltip: {
            enabled: false,
        }
    };
    const chart = new ApexCharts(element, options);
    chart.render();
});

function changeButton(buttonElement) {
    if (buttonElement) {
        const parentElement = buttonElement.parentElement;
        Array.from(parentElement.children).forEach(button => {
            button.classList.remove('active');
        });
        buttonElement.classList.add('active');
    }
}

function applyDecimationAlgorithm(chartId, timeSpan) {
    const element = document.getElementById(chartId);
    const rawdata = JSON.parse(element.getAttribute('data-chart-line-2'));
    const dataLength = {
        '1W': 5,
        '2W': 10,
        '1M': 21,   //30*5/7,
        '3M': 64,   //90*5/7,
        '6M': 128,  //180*5/7,
        '1Y': 260,  //365*5/7,
        '2Y': 521,  //365*2*5/7,
        '5Y': 1303, //365*5*5/7,
        '10Y': 2607,    //365*10*5/7
        'All': 9999999, // very large number
    };
    let result = [];
    const max = 160;
    const atMost = dataLength[timeSpan];
    if (atMost > max) {
        const range = Math.min(atMost, rawdata.length);
        const interval = Math.ceil(range/max);
        for (let i = 0; i < range; i += interval) {
            result.push(rawdata[i]);
        }
    }
    else {
        result = rawdata.slice(0, atMost);
    }
    return result;
}

function changeChartData(buttonElement, chartId, timeSpan) {
    changeButton(buttonElement);
    const data = applyDecimationAlgorithm(chartId, timeSpan);
    var chart = allCharts[chartId];
    chart.updateSeries([{data}]);
}

const lineCharts = document.querySelectorAll('[data-chart-line-2]');
lineCharts.forEach(element => {
    const options = {
        noData: {
            text: 'Loading...'
        },
        series: [],
        chart: {
            type: 'line',
            id: element.id,
            height: 500,
            toolbar: {
                show: false
            },
            zoom: {
                autoScaleYaxis: true
            },
            animations: {
                enabled: false,
            },
        },
        colors: ['rgba(54, 162, 235, 0.7)'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 2,
            curve: 'smooth',
        },
        markers: {
            size: 0,
        },
        xaxis: {
            type: 'datetime',
        },
        // yaxis: {

        // },
    };
    const chart = new ApexCharts(element, options);
    chart.render();

    // save the chart
    allCharts[element.id] = chart;

    // set chart data to 1M
    changeChartData(null, element.id, '1M');
});

// get indices of reverse sort, based on https://stackoverflow.com/questions/46622486/what-is-the-javascript-equivalent-of-numpy-argsort
const reverseSortKeysAndValues = (keys, values) => {
    const argrsort = a=>a.map(d).sort((a,b)=>b[0]-a[0]).map(u);d=(v,i)=>[v,i];u=i=>i[1];
    const rsindices = argrsort(values);
    const skeys = rsindices.map(i=>keys[i]);
    const svalues = rsindices.map(i=>values[i]);
    return [skeys, svalues];
};

const doughnutCharts = document.querySelectorAll('[data-chart-doughnut-2]');
doughnutCharts.forEach(element => {
    const [title, value] = JSON.parse(element.getAttribute('data-chart-doughnut-2'));
    const data = JSON.parse(element.getAttribute('data-chart-doughnut-data'));
    const labels = JSON.parse(element.getAttribute('data-chart-doughnut-labels'));
    const [sortedLabels, sortedData] = reverseSortKeysAndValues(labels, data);
    const options = {
        series: sortedData,
        labels: sortedLabels,
        chart: {
            type: 'donut',
            width: 280,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '90%',
                    labels: {
                        show: true,
                        value: {
                            fontSize: '1em',
                            fontFamily: 'Manrope, sans-serif',
                            fontWeight: 700,
                            color: 'black',
                            offsetY: 0,
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: title,
                            fontSize: '1em',
                            fontFamily: 'Manrope, sans-serif',
                            fontWeight: 700,
                            color: 'black',
                            formatter: function(w) {
                                return value;
                            }
                        }
                    }
                }
            }
        },
        colors: ['rgba(54, 162, 235, 0.5)'],
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
    };
    const chart = new ApexCharts(element, options);
    chart.render();

    // save the chart
    allCharts[element.id] = chart;
});