// Чистая функция для скачивания презентации
import PptxGenJS from "pptxgenjs";

export const downloadPpt = (
  {
    chartData,
    visibleSeries,
    isStacked,
    chartType,
    lineColors,
    barCategoryGap,
    barGap,
    prepareDataForPptx,
    getSumValues
  }
) => {
  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();

  const filteredColors = Object.fromEntries(Object.entries(lineColors).filter(([colorName, color]) => {
    return visibleSeries[colorName]
  }))



  // Подготовка данных для графика
  const dataForChart = prepareDataForPptx(chartData, visibleSeries);
  const sumValues = getSumValues(chartData, visibleSeries, isStacked);
  const valAxisMaxVal = Math.ceil(sumValues * 1.1); // Увеличиваем максимальное значение на 10%

  // Добавляем график
  slide.addChart(chartType, dataForChart, {
    x: 1,
    y: 1,
    w: 8,
    h: 4,
    chartColors: Object.values(filteredColors), // Используем цвета для каждой серии
    title: "График",
    showLegend: true,
    legendPos: 'r',
    catAxisTitle: "Месяцы",
    valAxisTitle: "Значения",
    showValue: true,
    dataLabelColor: 'FFFFFF',
    valAxisMinVal: 0,
    valAxisMaxVal, // Используем вычисленное максимальное значение
    dataLabelPos: 'ctr',
    lineSize: 2,
    barGrouping: isStacked ? 'stacked' : 'standard',
    barGapWidthPct: Math.min(500, Math.max(0, parseFloat(barCategoryGap) * 5)),  // Преобразование значения barCategoryGap в barGapWidthPct
    barOverlapPct: -parseFloat(barGap) // Преобразование значения barGap в barOverlapPct
  });

  // Сохранение презентации
  pptx.writeFile({fileName: 'ChartPresentation.pptx'});
};