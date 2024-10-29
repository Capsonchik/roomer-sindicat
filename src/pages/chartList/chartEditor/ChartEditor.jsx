import {Chart} from "../chart/Chart";
import React from "react";
import styles from './chartEditor.module.scss'
import {ChartTableEditor} from "./chartTable/ChartTableEditor";
import {ChartPie} from "./chartPie/ChartPie";
import {AgGridDataWrapper} from "./chartPivot/AgGridDataWrapper";
import {CustomPivot} from "../chartItemPivotTable/CustomPivot";
import {CustomPivotWrapper} from "./chartPivot/CustomPivotWrapper";

export const ChartEditor = ({chart}) => {
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
      returnType = <AgGridDataWrapper chart={chart}/>
      break
  }
  return (
    <div className={styles.wrapper}>
      {returnType}
    </div>
  )
}