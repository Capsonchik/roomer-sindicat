import {CustomCheckPicker} from "../../../../components/rhfInputs/checkPicker/CheckPicker";
import styles from './mainForm.module.scss';
import React, {useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {selectOriginalColors} from "../../../../store/chartSlice/chart.selectors";
import {setOriginalColors} from "../../../../store/chartSlice/chart.slice";
import CustomToggle from "../../../../components/rhfInputs/customToggle/CustomToggle";
import {CustomInput} from "../../../../components/rhfInputs/customInput/CustomInput";
import cl from 'classnames'
import {CustomSelectPicker} from "../../../../components/rhfInputs/selectPicker/SelectPicker";
import {labelArray} from "../../label.config";


export function PreventOverflowContainer({children, height = 500,marginHeight = 34}) {
  const container = React.useRef();
  const content = React.useRef();

  const containerStyle = {
    // overflow: 'auto',
    position: 'relative',
    // right: 0,
    // left: 0,
    width: '100%',
    height: 34,
    marginBottom: -(height - marginHeight),
    // minHeight:34
    // top:50
  };

  const contentStyle = {
    // height: '300px',
    // width: '230%',
    // top: 50,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    // height:34
  };

  React.useEffect(() => {
    container.current.scrollTop = content.current.clientHeight / 2 - 60;
    container.current.scrollLeft =
      content.current.clientWidth / 2 - container.current.clientWidth / 2;
  }, [container, content]);

  return (

    <div style={{...containerStyle, height}} ref={container}>
      <div style={contentStyle} ref={content}>
        {children(() => container.current)}
      </div>
    </div>
  );
}

export const MainForm = ({chart}) => {
  const [series, setSeries] = useState([]);
  const dispatch = useDispatch();
  const originalColors = useSelector(selectOriginalColors)
  const {setValue, watch} = useFormContext();
  const [visibleSeries, setVisibleSeries] = useState([])
  // Изначально все серии видимы
  // console.log(originalColors)
  useEffect(() => {
    if (!chart.formatting.visible.length) {
      setVisibleSeries(
        Object.fromEntries(
          Object.keys(chart.seriesData).map((name) => [name, true])
        )
      );
    } else {
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
      temp[index] = [temp[index][0], bool]
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

  // console.log(originalColors)
  return (
    <div className={styles.wrapper}>
      <h6 className={styles.title}>Основное</h6>
      <div className={styles.row}>
        <div className={styles.input_wrapper}>
          <label className={styles.label_input}>Название</label>
          <CustomInput name={'title'} className={styles.title_input}/>
        </div>
      </div>
      <div className={styles.row}>
        <div className={cl(styles.input_wrapper, {}, [styles.data_wrapper])}>
          <label className={styles.label_input}>Данные</label>
          <PreventOverflowContainer>
            {getContainer => (
              <CustomCheckPicker
                className={styles.visible}
                // placement={'bottomStart'}
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
                style={{width: 224}}
                container={getContainer}
                preventOverflow
              />
            )}

          </PreventOverflowContainer>

        </div>
        <div className={cl(styles.input_wrapper, {}, [styles.data_wrapper])}>
          <label className={styles.label_input}>Ориентация</label>
          <CustomToggle name={'isXAxis'}/>
        </div>
        {/*<div className={cl(styles.input_wrapper, {}, [styles.data_wrapper])}>*/}
        {/*  <label className={styles.label_input}>Тип графика</label>*/}
        {/*  <CustomSelectPicker*/}
        {/*    name={'type_chart'}*/}
        {/*    data={['bar', 'pie'].map((item) => ({label: item, value: item}))}*/}
        {/*    searchable={false}*/}
        {/*    placeholder="Тип графика"*/}
        {/*    className={styles.type_chart}*/}
        {/*  />*/}
        {/*</div>*/}
      </div>


    </div>
  );
};