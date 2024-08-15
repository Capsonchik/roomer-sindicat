export const posList = [
  'left',
  'right',
  'top',
  'bottom',
  'inside',
  'insideTop',
  'insideLeft',
  'insideRight',
  'insideBottom',
  'insideTopLeft',
  'insideTopRight',
  'insideBottomLeft',
  'insideBottomRight'
];

export const defaultConfig = {
  rotate: 90,
  align: 'left',
  verticalAlign: 'middle',
  position: 'insideBottom',
  distance: 15
};

export const labelOption = {
  show: true,
  position: defaultConfig.position,
  distance: defaultConfig.distance,
  align: defaultConfig.align,
  verticalAlign: defaultConfig.verticalAlign,
  rotate: defaultConfig.rotate,
  formatter: '{c}  {name|{a}}',
  fontSize: 16,
  rich: {
    name: {}
  }
};

export const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666']

export const chartOption = (data) => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },

  // legend: {
  //   show:true,
  //   data: ['Forest', 'Steppe', 'Desert', 'Wetland']
  // },

  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: data.xAxisData
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: Object.keys(data.seriesData).map((key, index) => ({
    name: key,
    type: 'bar',
    label: labelOption,
    emphasis: {
      focus: 'series'
    },
    data: data.seriesData[key],
    // itemStyle: {
    //   color: colors[index] // Цвет для каждой серии
    // },
    barCategoryGap: '30%', // Задает промежуток между столбцами
    barGap: '0%' // Задает промежуток между группами столбцов
  }))
});