import {dataLabelPosMap} from "../label.config";
import {getSumValues} from "../getSumValues";
import {calculateMaxValue} from "../calculateMaxValue";
import {calculateStepSize} from "../calculateStepSize";


export const convertDataCharts = ({charts, activeGroup}) => {
  // const convertedCharts = []
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
  const title = {
    text: activeGroup.group_name,
    x: xOffset,
    y: yOffset,
    fontSize: 14,
    h: 0.2,
    w: 9.2
  }
  yOffset += 0.4;
  const description = {
    text: activeGroup.group_name,
    x: xOffset,
    y: yOffset,
    fontSize: 12,
    h: activeGroup.description.length > 100 ? 0.4 : 0.2,
    w: 9.2
  }

  if (charts.length === 4) {
    yOffset += activeGroup.description.length > 100 ? 0.4 : 0.3;
  } else {
    yOffset += 0.5;

  }

  const convertedCharts = charts.reduce((acc, chart, index) => {

    const maxValue = getSumValues({
      stack: chart.formatting.stack,
      seriesData: chart.seriesData,
      // seriesIndex: 0,
      ispercent: chart.ispercent
    })

    const calculatedMaxValue = calculateMaxValue(0, maxValue ,6)
    const step = calculateStepSize(0,calculatedMaxValue, 6)

    // Определяем направление баров в зависимости от isXAxis
    const barDirection = chart.formatting.isXAxis ? undefined : 'bar';
    acc.push({
      seriesData: chart.seriesData,
      xAxisData: chart.xAxisData,
      title: chart.title,
      formatting: {
        x: xOffset,
        y: yOffset,
        w: chartWidth,
        h: chartHeight,
        dataLabelFormatCode: chart.formatting.format_value || 1,
        dataLabelPosition: dataLabelPosMap[chart.formatting.label_position] || 'bestFit',
        barDir: barDirection,
        barGrouping: chart.formatting.stack ? 'stacked' : 'standard',
        step,
        maxValue:calculatedMaxValue
        // valAxisMaxVal
      }
    })

    if (index === 1 && charts.length === 4) {
      yOffsetDefault = 3
    }
    // yOffset = yOffsetDefault; // Увеличиваем отступ после графика
    xOffset += chartWidth + padding; // Переход к следующей колонке

    if (index === 1 && charts.length === 4) {
      xOffset = 0.2
      yOffset += 2.4
    }


    return acc
  }, [])

  return {
    title: JSON.stringify(title),
    description: JSON.stringify(description),
    charts: JSON.stringify(convertedCharts),
  }
}