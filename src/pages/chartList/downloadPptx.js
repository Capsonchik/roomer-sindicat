// Чистая функция для скачивания презентации
import PptxGenJS from "pptxgenjs";
import {prepareDataForPptx} from "./prepareDataForPptx";
import {colors} from "./chart/config";
import {getSumValues} from "./getSumValues";
import {convertValuesByPercent} from "./chart/convertValuesByPercent";

export const downloadPpt = (charts) => {
  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();
  let yOffsetDefault = 1.4

  let chartWidth = 3; // Ширина графика
  let chartHeight = 2; // Высота графика
  const padding = 0.2; // Отступ между графиками
  let xOffset = 0.2; // Начальная позиция по горизонтали
  let yOffset = yOffsetDefault; // Начальная позиция по вертикали

  if(charts.length === 2){
    chartWidth = 4.6
    chartHeight = 2.6
    yOffset = 1
    yOffsetDefault = 1
  }
  if(charts.length === 4){
    chartWidth = 4.6
    chartHeight = 2
    yOffset = 0.2
    yOffsetDefault = 0.2
  }

  charts.forEach((chart, index) => {
    console.log(chart)
    const {title, description, xAxisData, seriesData, formatting,ispercent} = chart;
    // Добавляем заголовок графика
    slide.addText(title, {
      x: xOffset,
      y: yOffset,
      align: 'justify',
      fontSize: 14
    });

    yOffset += 0.3; // Увеличиваем отступ для описания
    slide.addText(description, {
      x: xOffset,
      y: yOffset,
      align: 'justify',
      fontSize: 12
    });
    yOffset += 0.3;


    const filteredSeriesData = !!formatting.visible.length
      ? Object.fromEntries(Object.entries(seriesData).filter(([name, data]) => {
        return formatting.visible.includes(name)
      }))
      : seriesData

    const convertedSeriesData = convertValuesByPercent({
      visibleListString: Object.keys(filteredSeriesData),
      chart,
      filteredSeriesData: filteredSeriesData
    })
    // console.log(filteredSeriesData)
    // Подготовка данных для графика
    const dataForChart = prepareDataForPptx({
      xAxisData,
      seriesData: !!formatting.visible.length ? convertedSeriesData : seriesData
    });

    // Определяем направление баров в зависимости от isXAxis
    const barDirection = formatting.isXAxis ? undefined : 'bar';

    // фильтруем цвета
    const filteredColors = formatting.colors
      ? formatting.colors.filter(([color, bool]) => bool).map(([color, bool]) => color).slice(0, dataForChart.length)
      : colors.slice(0, dataForChart.length)

    // console.log(filteredColors)
    //определяем максимальное значение
    const maxValue = getSumValues({stack: formatting.stack, seriesData: filteredSeriesData, seriesIndex: index,ispercent})
    // console.log(maxValue)

    // Увеличиваем отступ для графика
    // yOffset += 0.5; // Увеличиваем отступ перед графиком
    slide.addChart('bar', dataForChart, {
      chartColors: filteredColors,
      x: xOffset,
      y: yOffset,
      w: chartWidth,
      h: chartHeight,

      // showValue: true,
      valAxisMaxVal: Math.ceil(maxValue * 1.1) ,
      valAxisMinVal: 0,

      // Используем условное значение для направления баров
      barDir: barDirection,
      barGrouping: formatting.stack ? 'stacked' : 'standard',
      barGapWidthPct: Math.min(100, Math.max(0, parseFloat(chart.formatting.column_width) * 1)),  // Преобразование значения barCategoryGap в barGapWidthPct
    });

    if(index === 1 && charts.length === 4) {
      yOffsetDefault = 3
    }
    yOffset = yOffsetDefault; // Увеличиваем отступ после графика
    xOffset += chartWidth + padding; // Переход к следующей колонке

    if(index === 1 && charts.length === 4) {
      xOffset = 0.2
    }
  });

  // Сохранение презентации
  pptx.writeFile({fileName: 'ChartPresentation.pptx'});
};