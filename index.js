const http = require('http');

const { generateGraph } = require('./generateGraph.js');

const parseTemperature = ({ hourly }) => {
  const { temperature_2m } = hourly;
  const temperature = [];

  temperature_2m.forEach((temp, index) => {
    temperature.push([temperature_2m[index - 1] || 15, temp]);
  });

  return temperature;
};

const main = (url) => {
  let rawTemperatures = '';

  http.get(url, (response) => {
    response.setEncoding('utf8');
    response.on('data', chunk => rawTemperatures += chunk);

    response.on('end', () => {
      const parsedTemperature = parseTemperature(JSON.parse(rawTemperatures));
      generateGraph(parsedTemperature);
    });

  });
};


const url = 'http://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m';

main(url);
