// Чистая функция для скачивания презентации
import PptxGenJS from "pptxgenjs";

import {addBarChartSlide} from "./addBarChartSlide";

export const downloadPpt = (charts, activeGroup) => {
  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();
  let yOffsetDefault = 1

  let chartWidth = 3; // Ширина графика
  let chartHeight = 3; // Высота графика
  const padding = 0.2; // Отступ между графиками
  let xOffset = 0.2; // Начальная позиция по горизонтали
  let yOffset = yOffsetDefault; // Начальная позиция по вертикали

  if (charts.length === 2) {
    chartWidth = 4.6
    chartHeight = 3.8
    yOffset = 0.2
    yOffsetDefault = 1
  }
  if (charts.length === 4) {
    chartWidth = 4.6
    chartHeight = 2.4
    yOffset = 0.2
    yOffsetDefault = 0.2
  }

  slide.addText(activeGroup.group_name, {
    x: xOffset,
    y: yOffset,
    align: 'center',
    fontSize: 14,
    h: 0.2,
    w: 9.2
  });

  yOffset += 0.3; // Увеличиваем отступ для описания
  slide.addText(activeGroup.description, {
    x: xOffset,
    y: yOffset,
    align: 'center',
    fontSize: 12,
    h: activeGroup.description.length > 100 ? 0.4 : 0.2,
    w: 9.2
  });
  if (charts.length === 4) {
    yOffset += activeGroup.description.length > 100 ? 0.4 : 0.3;
  } else {
    yOffset += 0.5;

  }

  charts.forEach((chart, index) => {

    const {dataForBarChart, optionsForBar} = addBarChartSlide({chart, xOffset, yOffset, chartWidth, chartHeight})
    if (chart.formatting.type_chart === 'bar') {
      slide.addChart('bar', dataForBarChart, optionsForBar)
    }


    if (index === 1 && charts.length === 4) {
      yOffsetDefault = 3
    }
    // yOffset = yOffsetDefault; // Увеличиваем отступ после графика
    xOffset += chartWidth + padding; // Переход к следующей колонке

    if (index === 1 && charts.length === 4) {
      xOffset = 0.2
      yOffset += 2.4
    }
  });

  // Сохранение презентации
  pptx.writeFile({fileName: 'ChartPresentation.pptx'});
};