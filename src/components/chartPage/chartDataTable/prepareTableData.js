export const prepareTableData = (data) => {
  const { xAxisData, seriesData } = data;

  // Преобразуем данные в массив объектов для таблицы
  const tableData = xAxisData.map((label, index) => {
    const row = { xAxisLabel: label }; // Основное поле с меткой оси X

    // Добавляем значения для каждой серии
    for (const [seriesName, values] of Object.entries(seriesData)) {
      row[seriesName] = values[index];
    }

    return row;
  });

  return tableData;
};