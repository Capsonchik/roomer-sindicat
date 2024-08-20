import {Chart} from "../chart/Chart";
import React from "react";
import styles from './chartEditor.module.scss'

export const ChartEditor = ({chart}) => {
  return (
    <div className={styles.wrapper}>
      <Chart  chart={chart} editBtn={false}/>
    </div>
  )
}