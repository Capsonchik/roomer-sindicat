import {Chart} from "../chart/Chart";
import React from "react";
import styles from './chartEditor.module.scss'
import {ChartListItem} from "../chartListItem/ChartListItem";
import {ChartItemTable} from "../chartItemTable/ChartItemTable";
import {ChartItemPie} from "../chartItemPie/ChartItemPie";
import {ChartTable} from "./chartTable/ChartTable";
import {ChartPie} from "./chartPie/ChartPie";

export const ChartEditor = ({chart}) => {
  let returnType = 'неизвестный тип графика'
  switch (chart.formatting.type_chart) {
    case 'bar':
      returnType =  <Chart  chart={chart} editBtn={false}/>
      break
    case 'table':
      returnType = <ChartTable chart={chart}/>
      break
    case 'pie':
      returnType = <ChartPie chart={chart} />
      break
  }
  return (
    <div className={styles.wrapper}>
      {returnType}
    </div>
  )
}