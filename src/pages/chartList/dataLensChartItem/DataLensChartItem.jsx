import React from "react";
import {Button} from "rsuite";
import {setActiveChart, setOpenDrawer} from "../../../store/chartSlice/chart.slice";
import EditIcon from "@rsuite/icons/Edit";
import styles from './dataLensChartItem.module.scss'


export const DataLensChartItem = ({dataLensChart}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title_wrapper}>
        <h5>{dataLensChart.title}</h5>
        <Button
          className={styles.btn}
          onClick={() => {

            // dispatch(setActiveChart(chart))
            // dispatch(setOpenDrawer(true))
          }}>
          <EditIcon/>
        </Button>
      </div>
      <div className={styles.iframe_wrapper}>
          <iframe
            id={'graph'}
            className={styles.chart}
            title={dataLensChart.title}
            width="100%"
            height="500"
            frameBorder="0"
            scrolling="no"
            src={dataLensChart.link}
            allowtransparency="true"
            style={{
              background:'#ccc'
            }}

          />
          <div className={styles.layout}></div>
      </div>

    </div>
)
}