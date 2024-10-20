import React, { useState, useMemo } from 'react';
import styles from './customPivot.module.scss';
import { Button } from 'rsuite';
import { setActiveChart, setOpenDrawer } from '../../../store/chartSlice/chart.slice';
import EditIcon from '@rsuite/icons/Edit';
import { useDispatch } from 'react-redux';

// Функция для агрегации данных
const aggregateData = (data, rowKey, subRowKey, colKey, subColKey, aggregator) => {
  const result = {};
  let min = Infinity;
  let max = -Infinity;

  data.forEach((item) => {
    const row = item[rowKey];
    const subRow = item[subRowKey];
    const col = item[colKey];
    const subCol = item[subColKey];
    const value = item[aggregator];

    if (!result[row]) result[row] = {};
    if (!result[row][subRow]) result[row][subRow] = {};
    if (!result[row][subRow][col]) result[row][subRow][col] = {};

    result[row][subRow][col][subCol] = value;

    // Находим min и max значения
    if (value < min) min = value;
    if (value > max) max = value;
  });

  return { result, min, max };
};

const getCellStyle = (value, min, max) => {
  if (value == null) return {}; // если значение отсутствует, не применяем стиль

  const ratio = (value - min) / (max - min); // Простая нормализация

  // От темного (красного) к светлому (белому) в зависимости от значения
  const darkColor = [250, 134, 130]; // #f7635c
  const lightColor = [255, 248, 248]; // #fff2f2

  const interpolatedColor = lightColor.map((c, i) => Math.round(c + (darkColor[i] - c) * ratio));

  return {
    fontSize: 20,
    backgroundColor: `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`,
    color: ratio < 0.5 ? 'black' : 'white',
  };
};

// Функция для форматирования значений
const formatValue = (value, formatType, digitsAfterDot = null) => {
  // Приводим value к числу, если это не число или undefined
  const numericValue = Number(value);

  // Проверяем, что numericValue является числом
  if (isNaN(numericValue)) {
    return value; // Возвращаем исходное значение, если оно не число
  }

  // Форматирование в зависимости от типа
  if (formatType === 'k') {
    return numericValue >= 1000
      ? `${(numericValue / 1000).toFixed(digitsAfterDot !== null ? digitsAfterDot : 0)}k`
      : numericValue;
  } else if (formatType === 'm') {
    if (numericValue >= 1000000) {
      return `${(numericValue / 1000000).toFixed(digitsAfterDot !== null ? digitsAfterDot : 0)}m`;
    } else if (numericValue >= 1000) {
      return `${(numericValue / 1000).toFixed(digitsAfterDot !== null ? digitsAfterDot : 0)}k`;
    }
  }

  // Возвращаем значение с нужным количеством знаков после запятой, если digitsAfterDot не null
  return digitsAfterDot !== null ? numericValue.toFixed(digitsAfterDot) : numericValue;
};


export const CustomPivot = ({ chart,rowData, isDrawer = false, rowColData }) => {
  const { rowKey, subRowKey, colKey, subColKey, aggregator  ,format = 'm',digitsAfterDot} = rowColData;
  const dispatch = useDispatch();
  // Агрегированные данные и min/max значения
  const { result: aggregatedData, min, max } = useMemo(
    () => aggregateData(rowData, rowKey, subRowKey, colKey, subColKey, aggregator),
    [rowData, rowKey, subRowKey, colKey, subColKey, aggregator,format]
  );

  // Уникальные строки и подстроки
  const rowLabels = useMemo(() => [...new Set(rowData.map((item) => item[rowKey]))], [rowData, rowKey]);
  const subRowLabels = useMemo(
    () =>
      rowLabels.reduce((acc, row) => {
        acc[row] = [...new Set(rowData.filter((item) => item[rowKey] === row).map((item) => item[subRowKey]))];
        return acc;
      }, {}),
    [rowData, rowKey, subRowKey]
  );

  // Уникальные колонки и подколонки
  const colLabels = useMemo(() => [...new Set(rowData.map((item) => item[colKey]))], [rowData, colKey]);
  const subColLabels = useMemo(
    () =>
      colLabels.reduce((acc, col) => {
        acc[col] = [...new Set(rowData.filter((item) => item[colKey] === col).map((item) => item[subColKey]))];
        return acc;
      }, {}),
    [rowData, colKey, subColKey]
  );

  if (!rowData.length) {
    return null;
  }

  return (
    <div className={`${styles.wrapper} ${isDrawer ? styles.isDrawer : ''}`}>
      <div className={styles.wrapper_scroll}>
        <div className={styles.title_wrapper}>
          <h5 className={styles.title}>{chart.title}</h5>
          {!isDrawer && (
            <Button
              onClick={() => {
                dispatch(setActiveChart(chart));
                dispatch(setOpenDrawer(true));
              }}
            >
              <EditIcon />
            </Button>
          )}
        </div>
        <div className={styles.table_scroll}>
          <table border="1" className={styles.table}>
            <thead>
            <tr>
              <th rowSpan="2">{rowKey}</th>
              <th rowSpan="2">{subRowKey}</th>
              {colLabels.map((col) => (
                <th key={col} colSpan={subColLabels[col].length}>
                  {col}
                </th>
              ))}
            </tr>
            <tr>
              {colLabels.map((col) =>
                subColLabels[col].map((subCol) => (
                  <th key={subCol}>{subCol}</th>
                ))
              )}
            </tr>
            </thead>
            <tbody>
            {rowLabels.map((row) => {
              const subRows = subRowLabels[row] || [];
              return subRows.map((subRow, index) => (
                <tr key={subRow}>
                  {index === 0 && (
                    <td rowSpan={subRows.length}>
                      {row}
                    </td>
                  )}
                  <td>{subRow}</td>
                  {colLabels.map((col) =>
                    subColLabels[col].map((subCol) => (
                      <td key={subCol} style={getCellStyle(
                        aggregatedData[row]?.[subRow]?.[col]?.[subCol],
                        min, // Используем min из useMemo
                        max  // Используем max из useMemo
                      )}>
                        {formatValue(aggregatedData[row]?.[subRow]?.[col]?.[subCol], format,digitsAfterDot) || <span className={styles.empty}>-</span>}
                      </td>
                    ))
                  )}
                </tr>
              ));
            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
