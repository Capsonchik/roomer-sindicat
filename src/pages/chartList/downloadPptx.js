// Чистая функция для скачивания презентации
import PptxGenJS from "pptxgenjs";
import {prepareDataForPptx} from "./prepareDataForPptx";
import {colors} from "./chart/config";
import {getSumValues} from "./getSumValues";

export const downloadPpt = (charts) => {
  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();
  const yOffsetDefault = 2

  const chartWidth = 3; // Ширина графика
  const chartHeight = 2; // Высота графика
  const padding = 0.2; // Отступ между графиками
  let xOffset = 0.2; // Начальная позиция по горизонтали
  let yOffset = yOffsetDefault; // Начальная позиция по вертикали

  charts.forEach((chart, index) => {
    console.log(chart)
    const {title, description, xAxisData, seriesData, formatting} = chart;
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

    console.log(chart)
    // филььруем видимые колонки
    // const filteredSeriesData = Object.fromEntries(
    //   Object.entries(seriesData).filter(([name,data] )=> {
    //   return formatting.visible.includes(name)
    // })
    // )

    const filteredSeriesData = Object.fromEntries(Object.entries(seriesData).filter(([name, data]) => {
      return formatting.visible.includes(name)
    }))

    // console.log(filteredSeriesData)
    // Подготовка данных для графика
    const dataForChart = prepareDataForPptx({
      xAxisData,
      seriesData: !!formatting.visible.length ? filteredSeriesData : seriesData
    });

    // Определяем направление баров в зависимости от isXAxis
    const barDirection = formatting.isXAxis ? undefined : 'bar';

    // фильтруем цвета
    const filteredColors = formatting.colors
      ? formatting.colors.filter(([color, bool]) => bool).map(([color, bool]) => color)
      : colors.slice(0, dataForChart.length)

    //определяем максимальное значение
    const maxValue = getSumValues({stack:formatting.stack,seriesData:filteredSeriesData,seriesIndex: index})

    // Увеличиваем отступ для графика
    // yOffset += 0.5; // Увеличиваем отступ перед графиком
    slide.addChart('bar', dataForChart, {
      chartColors: filteredColors,
      x: xOffset,
      y: yOffset,
      w: chartWidth,
      h: chartHeight,

      showValue: true,
      valAxisMaxVal: Math.ceil(maxValue * 1.1) ,
      valAxisMinVal: 0,

      // Используем условное значение для направления баров
      barDir: barDirection,
      barGrouping: formatting.stack ? 'stacked' : 'standard',
    });

    yOffset = yOffsetDefault; // Увеличиваем отступ после графика
    xOffset += chartWidth + padding; // Переход к следующей колонке
  });

  // Сохранение презентации
  pptx.writeFile({fileName: 'ChartPresentation.pptx'});
};