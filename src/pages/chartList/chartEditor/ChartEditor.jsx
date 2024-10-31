import {Chart} from "../chart/Chart";
import React from "react";
import styles from './chartEditor.module.scss'
import {ChartTableEditor} from "./chartTable/ChartTableEditor";
import {ChartPie} from "./chartPie/ChartPie";
import {AgGridDataWrapper} from "./chartPivot/AgGridDataWrapper";
import {CustomPivot} from "../chartItemPivotTable/CustomPivot";
import {CustomPivotWrapper} from "./chartPivot/CustomPivotWrapper";
import {useSelector} from "react-redux";
import {selectActiveClient, selectClients} from "../../../store/chartSlice/chart.selectors";
import {generateShades} from "../chartItemPivotTable/utils/generateShades";

export const ChartEditor = ({chart}) => {
  const activeClient = useSelector(selectActiveClient)
  const clients = useSelector(selectClients)


  const client = clients.find(clnt => clnt.client_id === activeClient)

  const {lightShade, darkShade} = generateShades(client?.chart_colors?.colors?.[0] || '#f7635c')
  const colors = {lightShade, darkShade}
  let returnType = 'неизвестный тип графика'
  switch (chart.formatting.type_chart) {
    case 'bar':
      returnType = <Chart chart={chart} editBtn={false}/>
      break
    case 'table':
      returnType = <ChartTableEditor chart={chart}/>
      break
    case 'pie':
      returnType = <ChartPie chart={chart}/>
      break
    case 'pivot':
      // returnType = <CustomPivotWrapper chart={chart}/>
      returnType = <AgGridDataWrapper chart={chart} colors={colors}/>
      break
  }
  return (
    <div className={styles.wrapper}>
      {returnType}
    </div>
  )
}