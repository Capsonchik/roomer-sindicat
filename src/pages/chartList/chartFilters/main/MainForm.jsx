import {CustomCheckPicker} from "../../../../components/rhfInputs/checkPicker/CheckPicker";
import styles from './mainForm.module.scss'
import {useEffect, useState} from "react";
import {chartData} from "../../../editorChart/stackBarMock";
import {useFormContext} from "react-hook-form";

export const MainForm = ({chart}) => {
  const [series, setSeries] = useState([])
  const {trigger,formState,handleSubmit} = useFormContext()
  const [visibleSeries, setVisibleSeries] = useState(Object.keys(chart.seriesData).map(item => {
    return {value: item, label: item};
  })); // Изначально все серии видимы

  useEffect(() => {
    setVisibleSeries(Object.fromEntries(Object.keys(chart.seriesData).map((name) => [name, true])))
  }, []);

  useEffect(() => {
    setSeries(chart.seriesData)
  }, [chart]);

  // const visibleSeries = Object.keys(chart.axes.seriesData).map(item => {
  //   return {value: item, label: item};
  // })
  const test = (data) => {
    console.log(data)
  }
  console.log(formState)
  return (
    <div className={styles.wrapper}>
      <CustomCheckPicker
        name={'series'}
        data={Object.keys(series).map(item => {
          return {value: item, label: item};
        })}
        onChangeOutside={(value) => {
          // console.log(Object.keys(series.seriesData))
          const newVisibleSeries = Object.fromEntries(
            Object.keys(series).map((name) => [name, value.includes(name)])
          );
          setVisibleSeries(newVisibleSeries);
          // handleSubmit(test())
        }}
        value={Object.keys(visibleSeries).filter((name) => visibleSeries[name])}
      />
    </div>
  )
}