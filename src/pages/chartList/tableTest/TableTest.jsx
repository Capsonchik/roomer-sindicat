import React, { useState, useEffect, useRef } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import { aggregators } from 'react-pivottable/Utilities';
import './styles.scss';
import {Button} from "rsuite"; // Подключаем стили для скрытия элементов

export const PivotTableComponent = () => {
  const salesData = [
    { region: 'North', product: 'Laptop', sales: 1500, quantity: 5, date: '2024-01-10' },
    { region: 'North', product: 'Phone', sales: 800, quantity: 2, date: '2024-01-15' },
    { region: 'South', product: 'Laptop', sales: 2000, quantity: 6, date: '2024-02-10' },
    { region: 'South', product: 'Phone', sales: 1000, quantity: 3, date: '2024-02-12' },
    { region: 'East', product: 'Laptop', sales: 1800, quantity: 4, date: '2024-03-05' },
    { region: 'East', product: 'Phone', sales: 950, quantity: 2, date: '2024-03-07' },
  ];

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
      <Button onClick={() => setIsEditable(!isEditable)}>Жмякни</Button>
      <h3>Сводная таблица продаж</h3>
      <div className={`${isEditable ? 'editable' : ''} customTable`}>
        <PivotTableUI
          onChange={s => handleStateChange(s)}
          {...state}
        />
      </div>
    </div>
  );
};
