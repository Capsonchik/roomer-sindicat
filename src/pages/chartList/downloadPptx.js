import PptxGenJS from "pptxgenjs";
import {addBarChartSlide} from "./addBarChartSlide";

export const downloadPpt = (charts, activeGroup, layouts) => {
  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();

  // Добавление названия группы и описания
  let xOffset = 0.2;
  let yOffset = 0.4;
  slide.addText(activeGroup.group_name, {
    x: xOffset,
    y: yOffset,
    align: 'center',
    fontSize: 14,
    h: 0.2,
    w: 9.2
  });

  yOffset += 0.3;
  slide.addText(activeGroup.description, {
    x: xOffset,
    y: yOffset,
    align: 'center',
    fontSize: 12,
    h:  0.2,
    w: 9.2
  });
  yOffset += 0.4;

  // Проход по каждому графику и его размещение
  charts.forEach((chart, index) => {
    const layout = layouts.lg[index]; // Получаем layout для текущего графика
    const chartWidth = layout.w / 1.3; // Переводим ширину в единицы PowerPoint
    const chartHeight = layout.h; // Увеличиваем коэффициент для высоты
    const x = (layout.x / 12) * 10 + 0.2; // Координата x
    const y = layout.y +  yOffset; // Координата y

    const {dataForBarChart, optionsForBar} = addBarChartSlide({
      chart,
      xOffset: x,
      yOffset: y,
      chartWidth,
      chartHeight
    });

    if (chart.formatting.type_chart === 'bar') {
      slide.addChart('bar', dataForBarChart, optionsForBar);
    }
  });

  // Сохранение презентации
  pptx.writeFile({fileName: 'ChartPresentation.pptx'});
};
