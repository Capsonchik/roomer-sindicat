import {ChartListItem} from "../chartListItem/ChartListItem";
import {ChartItemTable} from "../chartItemTable/ChartItemTable";
import {ChartItemPie} from "../chartItemPie/ChartItemPie";

export const ChartTypeView = ({chart}) => {
  let returnType = 'неизвестный тип графика'
  switch (chart.formatting.type_chart) {
    case 'bar':
      returnType = <ChartListItem chart={chart} />
      break
    case 'table':
      returnType = <ChartItemTable chart={chart} />
      break
    case 'pie':
      returnType = <ChartItemPie chart={chart} />
      break
  }
  return returnType
}