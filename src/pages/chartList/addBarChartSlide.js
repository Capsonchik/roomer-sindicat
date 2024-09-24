import {prepareDataForPptx} from "./prepareDataForPptx";
import {getSumValues} from "./getSumValues";
import {calculateMaxValue} from "./calculateMaxValue";
import {calculateStepSize} from "./calculateStepSize";
import {dataLabelPosMap} from "./label.config";
import {colors} from "./chart/config";


export const addBarChartSlide = ({chart,xOffset,yOffset,chartWidth,chartHeight}) => {
  const {title, description, xAxisData, seriesData, formatting, ispercent} = chart;

  let format_value = formatting.format_value ?? 1
  let filteredSeries = seriesData

  filteredSeries = Object.fromEntries(Object.entries(chart.seriesData).map(([key, value]) => {
    console.log(value,format_value)
    return [key, value.map(item => (+item).toFixed(format_value))];
  }))

  const dataForBarChart = prepareDataForPptx({
    xAxisData,
    seriesData: filteredSeries
  });

  // Определяем направление баров в зависимости от isXAxis
  const barDirection = formatting.isXAxis ? undefined : 'bar';

  const filteredColors = formatting.colors
    ? formatting.colors.filter(([color, bool]) => bool).map(([color, bool]) => color).slice(0, dataForBarChart.length)
    : colors.slice(0, dataForBarChart.length)


  //определяем максимальное значение
  const maxValue = getSumValues({
    stack: formatting.stack,
    seriesData: filteredSeries,
    // seriesIndex: index,
    ispercent
  })

  const valAxisMaxVal = calculateMaxValue(0,maxValue,6)
  const step = calculateStepSize(0,valAxisMaxVal, 6)
  const valAxisLabelFormatCode = chart.ispercent || +maxValue > 10 ? '#,##0' : `#,##0.${'0'.repeat(chart.formatting.format_value - 1 ?? 1)}`


  const optionsForBar = {
    chartColors: filteredColors,
    title: chart.title,
    showTitle: true,
    titlePos: {
      y: 0
    },
    titleFontSize: 10,
    titleColor: '646262',
    showLegend: true,
    legendColor: '646262',
    legendPos: 'b',
    x: xOffset,
    y: yOffset,
    w: chartWidth,
    h: chartHeight,
    valAxisMaxVal,
    valAxisLabelFormatCode,
    valAxisMajorUnit: step,

    valAxisMinVal: 0,


    showValue: true,
    dataLabelFontSize: 8,
    dataLabelFormatCode: `#,##0.${'0'.repeat(chart.formatting.format_value || 1)}`,
    dataLabelPosition: dataLabelPosMap[chart.formatting.label_position] || 'bestFit',


    valAxisLineShow: false,
    valGridLine: {
      size: 0.5,
      color: 'dfdada'
    },

    catAxisLineSize: 1,
    catAxisLineColor: 'b5b1b1',
    catAxisLabelFontSize: 8,
    catAxisLabelFontFace: 'Arial',
    catAxisLabelColor: '9d9898',

    valAxisLabelFontSize: 8,
    valAxisLabelColor: '9d9898',


    // Используем условное значение для направления баров
    barDir: barDirection,
    barGrouping: formatting.stack ? 'stacked' : 'standard',
    barGapWidthPct: Math.min(100, Math.max(0, parseFloat(chart.formatting.column_width) * 1)),
    barOverlapPct: -parseFloat(chart.formatting.column_gap)// Преобразование значения barCategoryGap в barGapWidthPct
  }

  return {
    dataForBarChart,optionsForBar
  }
}