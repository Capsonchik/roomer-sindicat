import {ChartListItem} from "../chartListItem/ChartListItem";
import {ChartItemTable} from "../chartItemTable/ChartItemTable";
import {ChartItemPie} from "../chartItemPie/ChartItemPie";
import {ChartItemPivotTable} from "../chartItemPivotTable/ChartItemPivotTable";
import {ChartPivotRsuiteTable} from "../chartItemPivotTable/ChartPivotRsuiteTable";
import {ChartAgGrid} from "../chartItemPivotTable/ChartAgGrid";

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
    case 'pivot':
      returnType = <div>
        {/*<ChartPivotRsuiteTable chart={chart}/>*/}
        <ChartAgGrid/>
      </div>
      break
  }
  return returnType
}