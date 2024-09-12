import styles from "./filterDrawer.module.scss";
import {Button} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import React, {useState} from "react";
import MinusIcon from "@rsuite/icons/Minus";


export const EditFilterForm = ({filter}) => {
  const [isEditFilter, setIsEditFilter] = useState(false)

  if (isEditFilter) {
    return (
      <div style={{marginTop: 40}}>
        <div className={styles.open_db_inputs} onClick={() => {
          setIsEditFilter(false)
        }}>
          <MinusIcon style={{fontSize: 20}}/>
          <p>Скрыть</p>
        </div>
        <div>Редактирование</div>
      </div>

    )
  }

  return (
    <div key={filter.filter_name} className={styles.filter_wrapper}>
      <p>{filter.filter_name}</p>
      <div className={styles.line}></div>
      <Button onClick={() => {
        setIsEditFilter(true)
        // dispatch(setActiveChart(chart))
        // dispatch(setOpenDrawer(true))
      }}>
        <EditIcon/>
      </Button>
    </div>
  )
}