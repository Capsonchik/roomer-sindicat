
// Функция для получения суммы значений по каждой категории
export const getSumValues = (data, visibleSeries, isStacked) => {
  if (isStacked) {
    // Если график стэковый, вычисляем сумму значений для каждой категории
    const sums = data.xAxisData.map((_, index) => {
      return Object.keys(data.seriesData)
        .filter(name => visibleSeries[name]) // Учитываем только видимые серии
        .reduce((sum, series) => sum + data.seriesData[series][index], 0);
    });
    console.log(Math.max(...sums))
    return Math.max(...sums);
  } else {
    // Если график обычный, находим максимальное значение среди всех видимых данных
    return Math.max(
      ...Object.keys(data.seriesData)
        .filter(name => visibleSeries[name]) // Учитываем только видимые серии
        .map(name => Math.max(...data.seriesData[name]))
    );
  }
};