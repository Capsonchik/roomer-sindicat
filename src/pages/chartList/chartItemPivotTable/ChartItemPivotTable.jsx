import React, { useState, useEffect, useRef } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import { aggregators } from 'react-pivottable/Utilities';
import './pivotTable.scss';
import {Button} from "rsuite";
import {salesData} from "./pivot.mocks";
import cl from "classnames";
import styles from "../chartItemPie/chartItemPie.module.scss";
import {pieMocks} from "../chartEditor/chartPie/pie-mocks";
import {setActiveChart, setOpenDrawer} from "../../../store/chartSlice/chart.slice";
import EditIcon from "@rsuite/icons/Edit";
import {useDispatch} from "react-redux"; // Подключаем стили для скрытия элементов


export const ChartItemPivotTable = ({chart}) => {
  const dispatch = useDispatch();
  const russianAggregators = {
    "Сумма": aggregators["Sum"],
    "Максимум": aggregators["Maximum"],
    "Минимум": aggregators["Minimum"],
    "Количество": aggregators["Count"],
    "Среднее": aggregators["Average"],
    "Медиана": aggregators["Median"],
    "Количество уникальных": aggregators["Count Unique Values"],
    "Первое значение": aggregators["First"],
    "Последнее значение": aggregators["Last"],
  };

  const [state, setState] = useState({
    data: salesData,
    rows: ['region','product'],
    cols: ['sales','quantity','date'],
    aggregatorName: 'Сумма',
    vals: ['sales'],
    aggregators: russianAggregators,
  });

  const [isEditable, setIsEditable] = useState(true)
  const handleStateChange = (newState) => {
    setState(prev => {
      console.log('prev',prev)
      console.log('new',newState)
      return newState
    }); // Обновляем состояние при изменении
  };

  return (
    <div>
      <div className={'wrapper editable'}>
        {/*<div className={`${isEditable ? 'editable' : ''} customTable`}>*/}

        <div className={'title_wrapper'}>
          <h5>{chart.title}</h5>
          <Button className={'btn'} onClick={() => {
            dispatch(setActiveChart(chart))
            dispatch(setOpenDrawer(true))
          }}>
            <EditIcon/>
          </Button>
        </div>
        <PivotTableUI
          onChange={s => handleStateChange(s)}
          {...state}
        />
      </div>
    </div>
  );
}