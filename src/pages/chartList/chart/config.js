export const colors = ['#FF8200', '#5f719f', '#8A95A5', '#613F75',"#D6CE93","#689689","#2176AE","#6C464E",'#716A5C','#5B7B7A']

export const tooltipConfig = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    // className: 'chart_tooltip'
    confine:true
  },
}
export const legendConfig = {
  legend: {
    show: true,
    bottom: 0,
    selectedMode: false,
    type: 'scroll',
    width: '90%',  // Ограничиваем ширину легенды
    orient: 'horizontal',  // Горизонтальная ориентация
    align: 'left',  // Легенда выравнивается по левому краю
    itemGap: 10,  // Расстояние между элементами
    lineHeight: 20,  // Высота строки
  },
}