
import styles from './chartItemPie.module.scss'
import {Button} from "rsuite";
import {setActiveChart, setOpenDrawer} from "../../../store/chartSlice/chart.slice";
import EditIcon from "@rsuite/icons/Edit";
import React from "react";
import {useDispatch} from "react-redux";


export const ChartItemPie = ({chart}) => {
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
      ChartItemPie
      {/*<p>{chart.description}</p>*/}
      {/*<div ref={chartRef} style={{width: '100%', minHeight: '400px'}}></div>*/}

    </div>
  )
}