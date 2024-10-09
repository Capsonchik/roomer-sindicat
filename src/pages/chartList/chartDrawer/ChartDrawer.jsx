import {Button, Drawer, Input} from "rsuite";
import styles from "./chartDrawer.module.scss";
import {useEffect, useState} from "react";
import {ChartEditor} from "../chartEditor/ChartEditor";
import {FormProvider, useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {selectActiveChart} from "../../../store/chartSlice/chart.selectors";
import {patchChartFormatting} from "../../../store/chartSlice/chart.actions";

export const ChartDrawer = ({open, onClose}) => {
  const dispatch = useDispatch();
  const chart = useSelector(selectActiveChart)

  const handleSave = () => {
    const {graph_id, xAxisData, seriesData, ...rest} = chart
    console.log(rest)
    // dispatch(patchChartFormatting(rest))
    // setTitle(inputTitle)
    // setDescription(inputDescription)
    // onClose()
  }
  return (
    <Drawer open={open} onClose={onClose} style={{
      maxWidth: chart.formatting.type_chart === 'pivot' ? 1200 : 700,
      width: '100%'
    }}>
      <Drawer.Body style={{maxHeight: '100% !important'}}>
        <div className={styles.wrapper}>


          <ChartEditor chart={chart} editor={true}/>


          {/*<Button onClick={handleSave}>Сохранить</Button>*/}
        </div>
      </Drawer.Body>
    </Drawer>
  )
}