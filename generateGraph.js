const process = require('process');

const drawSymbol = (abscissa, ordinate, symbol) => {
  process.stdout.cursorTo(abscissa, ordinate);
  process.stdout.write(symbol);
};

const calculateOrdinate = (prevTemperatureDiff, temperatureDiff, ordinate) => {
  if (prevTemperatureDiff > 0 && temperatureDiff === 0) {
    ordinate--;
    return ordinate;
  }

  if (prevTemperatureDiff > 0 && temperatureDiff < 0) {
    ordinate--;
    return ordinate;
  }

  if (prevTemperatureDiff < 0 && temperatureDiff > 0) {
    ordinate++;
    return ordinate;
  }

  if (prevTemperatureDiff === 0 && temperatureDiff > 0) {
    ordinate++;
    return ordinate;
  }

  return ordinate;
};

const generateGraphData =
  (temperatures, { abscissa, ordinate }, prevTemperatureDiff = 0) => {

    return temperatures.map(([firstTemp, secondTemp]) => {
      let symbol = '_';
      const temperatureDiff = secondTemp - firstTemp;

      if (temperatureDiff > 0) {
        symbol = '/';
        ordinate--;

      } else if (temperatureDiff < 0) {
        symbol = '\\';
        ordinate++;
      }

      ordinate = calculateOrdinate(
        prevTemperatureDiff, temperatureDiff, ordinate);

      abscissa++;
      prevTemperatureDiff = temperatureDiff;
      return { abscissa, ordinate, symbol };
    });
  };

const drawGraph = (graphData, totalTemperatures) => {
  let index = 0;
  const intervalId = setInterval(() => {

    const { abscissa, ordinate, symbol } = graphData[index];
    drawSymbol(abscissa, ordinate, symbol);
    index++;

    const [maxX] = process.stdout.getWindowSize();
    if (index >= totalTemperatures || abscissa >= maxX) {
      clearInterval(intervalId);
    }
  }, 100);
};

const generateGraph = (temperatures) => {
  process.stdout.cursorTo(0, 0);
  process.stdout.clearScreenDown();

  const startingPosition = { abscissa: 0, ordinate: 10 };
  const graphData = generateGraphData(temperatures, startingPosition);

  drawGraph(graphData, temperatures.length);
  process.stdout.cursorTo(110, 110);
};

module.exports = { generateGraph };
