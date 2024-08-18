// Чистая функция для скачивания презентации
import PptxGenJS from "pptxgenjs";
import {dataLabelPosMap} from "./stackBarMock";

export const downloadPpt = (
  {
    series,
    visibleSeries,
    isStacked,
    chartType,
    lineColors,
    barCategoryGap,
    barGap,
    prepareDataForPptx,
    getSumValues,
    currentChart,
    isXAxis,
    labelPosition,
    rotate
  }
) => {
  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();



  const filteredColors = Object.fromEntries(Object.entries(lineColors).filter(([colorName, color]) => {
    return visibleSeries[colorName]
  }))

  console.log(filteredColors)

  // Подготовка данных для графика
  const dataForChart = prepareDataForPptx(series, visibleSeries);
  const sumValues = getSumValues(series, visibleSeries, isStacked);
  const valAxisMaxVal = Math.ceil(sumValues * 1.1); // Увеличиваем максимальное значение на 10%

  slide.addText(currentChart.title, {
    x:1,
    y:0.5,
    align:'center'
  })

  slide.addText(currentChart.description, {
    x:0.5,
    y:1,
    align:'left'
  })


  // Определяем направление баров в зависимости от isXAxis
  const barDirection = isXAxis ? undefined : 'bar';

  const pptxLabelPosition = dataLabelPosMap[labelPosition] || 'bestFit'; // Используем 'ctr' по умолчанию
  console.log(rotate)

  // Добавляем график
  slide.addChart(chartType, dataForChart, {
    x: 3,
    y: 1,
    w: 7,
    h: 4,
    // chartColors: ['#ccc118', '#ffc122', '#122fff', '#122fff'], // Используем цвета для каждой серии
    chartColors: Object.values(filteredColors), /// Используем цвета для каждой серии
    title: "График",
    showLegend: true,
    legendPos: 'r',
    // catAxisOrientation: catAxisOrientation,
    // valAxisOrientation: valAxisOrientation,
    showValue: true,
    // dataLabelColor: '#FFFFFF',
    valAxisMinVal: 0,
    valAxisMaxVal, // Используем вычисленное максимальное значение
    dataLabelPosition: pptxLabelPosition, // Используем позицию меток
    valAxisTitleRotate: rotate, // Угол поворота меток
    // catAxisLabelRotate: rotate, // Угол поворота меток
    lineSize: 2,
    barGrouping: isStacked ? 'stacked' : 'standard',
    barGapWidthPct: Math.min(500, Math.max(0, parseFloat(barCategoryGap) * 5)),  // Преобразование значения barCategoryGap в barGapWidthPct
    barOverlapPct: -parseFloat(barGap) ,// Преобразование значения barGap в barOverlapPct

    // Используем условное значение для направления баров
    barDir: barDirection,
    // valueBarColors: true, // Включаем группировку цветов для групп
    dataLabelColor: 'ffffff'
  });

  // Сохранение презентации
  pptx.writeFile({fileName: 'ChartPresentation.pptx'});
};