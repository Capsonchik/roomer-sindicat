

export const chartData = {
  xAxisData: ['2012', '2013', '2014', '2015', '2016'],
  seriesData: {
    Forest: [320, 332, 301, 334, 390],
    Steppe: [220, 182, 191, 234, 290],
    Desert: [150, 232, 201, 154, 190],
    Wetland: [98, 77, 101, 99, 40]
  }
};

export const labelArray = [
  'insideBottomLeft',
  'insideTopLeft',
  'inside',    // В центре
  'top',       // Сверху

];

// Преобразуем позицию меток в формат, понятный PptxGenJS
export const dataLabelPosMap = {
  insideBottomLeft: 'inBase',         // Внизу
  insideTopLeft: 'inEnd',           // Сверху
  inside: 'ctr',       // В центре
  top: 'outEnd',// Снаружи, у вершины

};