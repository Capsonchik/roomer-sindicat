import {CustomCheckPicker} from "../../../../components/rhfInputs/checkPicker/CheckPicker";
import styles from './mainForm.module.scss';
import React, {useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {selectOriginalColors} from "../../../../store/chartSlice/chart.selectors";
import {setOriginalColors} from "../../../../store/chartSlice/chart.slice";
import CustomToggle from "../../../../components/rhfInputs/customToggle/CustomToggle";

export const MainForm = ({chart}) => {
  const [series, setSeries] = useState([]);
  const dispatch = useDispatch();
  const originalColors = useSelector(selectOriginalColors)
  const {setValue, watch} = useFormContext();
  const [visibleSeries, setVisibleSeries] = useState([])
   // Изначально все серии видимы
  // console.log(originalColors)
  useEffect(() => {
    if(!chart.formatting.visible.length) {
      setVisibleSeries(
        Object.fromEntries(
          Object.keys(chart.seriesData).map((name) => [name, true])
        )
      );
    }
    else {
      setVisibleSeries(
        Object.fromEntries(
          Object.keys(chart.seriesData).map((name) => [name, chart.formatting.visible.includes(name)])
        )
      );
    }
  }, []);

  useEffect(() => {
    setSeries(chart.seriesData);
  }, [chart]);

  const handleSeriesChange = (value) => {
    const newVisibleSeries = Object.fromEntries(
      Object.keys(series).map((name) => [name, value.includes(name)])
    );

    // console.log(newVisibleSeries)
    const temp = originalColors.slice()
    Object.values(newVisibleSeries).forEach((bool, index) => {
      // console.log([temp[index][0],value.includes(name)])
      temp[index] = [temp[index][0],bool]
    })
    dispatch(setOriginalColors(temp))
    // console.log(temp)

    setVisibleSeries(newVisibleSeries);
  };

  const handleColorChange = (index, newColor) => {
    const temp = [
      ...originalColors.slice(0, index),
      [newColor, originalColors?.[index]?.[1]],
      ...originalColors.slice(index + 1)
    ]
    dispatch(setOriginalColors(temp))

  };

  console.log(originalColors)
  return (
    <div className={styles.wrapper}>
      <CustomCheckPicker
        className={styles.visible}
        name={"seriesData"}
        data={Object.keys(series).map((item, index) => {
          return {value: item, label: item, index}; // Передаем индекс в объекте
        })}
        onChangeOutside={handleSeriesChange}
        value={Object.keys(visibleSeries).filter((name) => visibleSeries[name])}
        renderMenuItem={(label, item) => (
          <div style={{display: "flex", alignItems: "center"}}>
            <input
              type="color"
              value={originalColors?.[item.index]?.[0] || 'green'} // Используем индекс для выбора цвета
              style={{marginRight: 8}}
              onChange={(e) => handleColorChange(item.index, e.target.value)}
            />
            {label}
          </div>
        )}
      />
      <CustomToggle name={'isXAxis'}/>

    </div>
  );
};