export const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666',"#d89429","#beb29e","#beb29f","#bcb29f",'#38ed60','#24ced9']

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