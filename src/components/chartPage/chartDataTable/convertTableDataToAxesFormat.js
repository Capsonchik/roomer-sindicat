
export const convertTableDataToAxesFormat = (tableData) => {
  // Проверяем, что tableData содержит хотя бы один элемент
  if (tableData.length === 0) return { xAxisData: [], seriesData: {} };

  // Извлекаем метки оси X из первого элемента данных
  const xAxisData = tableData.map(row => row.xAxisLabel);

  // Извлекаем все уникальные названия серий
  const seriesNames = Object.keys(tableData[0]).filter(key => key !== 'xAxisLabel');

  // Создаем объект для хранения данных серии
  const seriesData = {};

  // Инициализируем каждую серию пустым массивом
  seriesNames.forEach(seriesName => {
    seriesData[seriesName] = [];
  });

  // Заполняем данные для каждой серии
  tableData.forEach(row => {
    seriesNames.forEach(seriesName => {
      seriesData[seriesName].push(row[seriesName]);
    });
  });

  // Возвращаем результат в требуемом формате
  return {
    xAxisData,
    seriesData
  };
};