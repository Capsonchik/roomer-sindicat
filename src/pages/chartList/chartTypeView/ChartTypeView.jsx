import {ChartListItem} from "../chartListItem/ChartListItem";
import {ChartItemTable} from "../chartItemTable/ChartItemTable";
import {ChartItemPie} from "../chartItemPie/ChartItemPie";
import '../chartItemPivotTable/styles.css'

import {AgGridDataWrapper} from "../chartItemPivotTable/AgGridDataWrapper";
import {CustomPivot} from "../chartItemPivotTable/CustomPivot";

export const ChartTypeView = ({chart}) => {


  let returnType = 'неизвестный тип графика'
  switch (chart.formatting.type_chart) {
    case 'bar':
      returnType = <ChartListItem chart={chart}/>
      break
    case 'table':
      returnType = <ChartItemTable chart={chart}/>
      break
    case 'pie':
      returnType = <ChartItemPie chart={chart}/>
      break
    case 'pivot':
      returnType = <CustomPivot rowData={chart['0'].table_data}/>
      // returnType = <AgGridDataWrapper chart={chart}/>

      break
  }

  return returnType
}