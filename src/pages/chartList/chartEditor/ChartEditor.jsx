import {Chart} from "../chart/Chart";
import React from "react";
import styles from './chartEditor.module.scss'
import {ChartTableEditor} from "./chartTable/ChartTableEditor";
import {ChartPie} from "./chartPie/ChartPie";
import {ChartPivot} from "./chartPivot/ChartPivot";

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
      returnType = <ChartPivot chart={chart}/>
      break
  }
  return (
    <div className={styles.wrapper}>
      {returnType}
    </div>
  )
}