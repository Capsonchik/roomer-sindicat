import {CustomCheckPicker} from "../../../components/rhfInputs/checkPicker/CheckPicker";
import styles from './chartFilters.module.scss'
import {MainForm} from "./main/MainForm";
import {useFormContext} from "react-hook-form";
import {Bar} from "./bar/Bar";

export const ChartFilters = ({chart,test}) => {
  const {watch,trigger,formState,handleSubmit} = useFormContext()
  // console.log(chart)
  // console.log(watch)
  console.log(chart)
  return (
    <div className={styles.wrapper}>
      <MainForm chart={chart} />
      {typeof chart.formatting.stack !== 'undefined' && (
        <Bar/>
      )}
    </div>
  )
}