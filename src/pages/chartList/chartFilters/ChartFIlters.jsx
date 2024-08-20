import {CustomCheckPicker} from "../../../components/rhfInputs/checkPicker/CheckPicker";
import styles from './chartFilters.module.scss'
import {MainForm} from "./main/MainForm";
import {useFormContext} from "react-hook-form";

export const ChartFilters = ({chart,test}) => {
  const {trigger,formState,handleSubmit} = useFormContext()
  // console.log(chart)
  console.log(formState)

  return (
    <div className={styles.wrapper}>
      <MainForm chart={chart} />
    </div>
  )
}