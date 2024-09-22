import styles from './chartItemTable.module.scss'
import {useDispatch} from "react-redux";
import {Button} from "rsuite";
import {setActiveChart, setOpenDrawer} from "../../../store/chartSlice/chart.slice";
import EditIcon from "@rsuite/icons/Edit";
import React from "react";

export const ChartItemTable = ({chart}) => {
  const dispatch = useDispatch();
  return (
    <div className={styles.wrapper}>
      <div className={styles.title_wrapper}>
        <h5>{chart.title}</h5>
        <Button onClick={() => {

          dispatch(setActiveChart(chart))
          dispatch(setOpenDrawer(true))
        }}>
          <EditIcon/>
        </Button>
      </div>
      ChartItemTable
      {/*<p>{chart.description}</p>*/}
      {/*<div ref={chartRef} style={{width: '100%', minHeight: '400px'}}></div>*/}

    </div>
  )
}