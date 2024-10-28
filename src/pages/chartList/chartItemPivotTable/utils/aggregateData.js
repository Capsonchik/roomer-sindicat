// utils/aggregateData.js
export const aggregateData = (data, rowKey, subRowKey, colKey, subColKey, aggregator) => {
  const result = {};
  let min = Infinity;
  let max = -Infinity;

  data.forEach((item) => {
    const row = item[rowKey];
    const subRow = item[subRowKey];
    const col = item[colKey];
    const subCol = item[subColKey];
    const value = item[aggregator];

    if (!result[row]) result[row] = {};
    if (!result[row][subRow]) result[row][subRow] = {};
    if (!result[row][subRow][col]) result[row][subRow][col] = {};

    result[row][subRow][col][subCol] = value;

    // Находим min и max значения
    if (value < min) min = value;
    if (value > max) max = value;
  });

  return { result, min, max };
};
