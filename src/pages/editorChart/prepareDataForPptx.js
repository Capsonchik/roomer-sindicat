// Функция для преобразования данных в формат PptxGenJS
export const prepareDataForPptx = (data, visibleSeries) => {

  return Object.keys(data.seriesData)
    .filter(name => visibleSeries[name]) // Учитываем только видимые серии
    .map(name => ({
      name,
      labels: data.xAxisData,
      values: data.seriesData[name]
    }));
};