  import React, {useState, useMemo, useEffect} from 'react';
  import styles from './customPivot.module.scss';
  import {Button} from 'rsuite';
  import {setActiveChart, setOpenDrawer} from '../../../store/chartSlice/chart.slice';
  import EditIcon from '@rsuite/icons/Edit';
  import {useDispatch, useSelector} from 'react-redux';
  import {hexToHSL} from "../../../lib/hexToHSL";
  import {hslToHex} from "../../../lib/HSLToHex";
  import {generateColors} from "../../../lib/generateColors";
  import {selectActiveClient, selectCharts, selectClients} from "../../../store/chartSlice/chart.selectors";
  import {colors as colorsConsts} from "../chart/config";

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

    return {result, min, max};
  };

  // Функция для создания темного и светлого оттенка на основе одного цвета
  const getShadesFromHex = (hex, lightnessFactor = 0.9, darknessFactor = 0.6) => {
    // Преобразуем HEX в HSL
    const [h, s, l] = hexToHSL(hex);

    // Создаем светлый и темный оттенки
    const lightShade = hslToHex(h, s, l + (100 - l) * lightnessFactor);
    const darkShade = hslToHex(h, s, l * darknessFactor);

    return { lightShade, darkShade };
  };

  const getCellStyle = (value, min, max, baseColorHex) => {
    if (value == null) return {}; // Если значение отсутствует, не применяем стиль

    const ratio = (value - min) / (max - min); // Простая нормализация

    // Генерация темного и светлого оттенков из базового цвета
    const { lightShade, darkShade } = getShadesFromHex(baseColorHex);

    // Преобразуем HEX цвета в RGB для дальнейшего интерполирования
    const hexToRGB = (hex) => hex.match(/\w\w/g).map(x => parseInt(x, 16));

    const darkColor = hexToRGB(darkShade);
    const lightColor = hexToRGB(lightShade);

    // Интерполируем цвет в зависимости от значения
    const interpolatedColor = lightColor.map((c, i) => Math.round(c + (darkColor[i] - c) * ratio));

    return {
      fontSize: 16,
      backgroundColor: `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`,
      color: ratio < 0.5 ? 'black' : 'white', // Черный текст на светлом фоне, белый на темном
    };
  };

  // Функция для форматирования значений
  const formatValue = (value, formatType, digitsAfterDot = null) => {
    // Приводим value к числу, если это не число или undefined
    const numericValue = Number(value);
    // console.log(value)
    if (typeof value !== 'number') {
      return null
    }
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



  export const CustomPivot = ({chart, rowData, isDrawer = false, rowColData}) => {
    const clients = useSelector(selectClients)
    const activeClient = useSelector(selectActiveClient)
    const charts = useSelector(selectCharts)
    const [colors, setColors] = useState(colorsConsts)
    useEffect(() => {
      const client = clients.find(clnt => clnt.client_id === activeClient)
      if (client?.chart_colors && client?.chart_colors?.colors) {
        // const test = ['#1675e0', '#fa8900']
        // const gradientColors = generateColors(client?.chart_colors?.colors, Object.keys(chart.seriesData).length)
        // console.log(chart.seriesData)
        setColors(client?.chart_colors?.colors)
      }
    },[charts])
    const {rowKey, subRowKey, colKey, subColKey, aggregator, format = 'm', digitsAfterDot} = rowColData;
    const dispatch = useDispatch();
    // Агрегированные данные и min/max значения
    const {result: aggregatedData, min, max} = useMemo(
      () => aggregateData(rowData, rowKey, subRowKey, colKey, subColKey, aggregator),
      [rowData, rowKey, subRowKey, colKey, subColKey, aggregator, format]
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
                <EditIcon/>
              </Button>
            )}
          </div>
          <div className={styles.table_scroll}>
            <table border="1" className={styles.table}>
              <thead>
              <tr>
                <th className={styles.row} rowSpan="2">{rowKey}</th>
                <th className={styles.row} rowSpan="2">{subRowKey}</th>
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
                          max,  // Используем max из useMemo
                          colors[0]
                        )}>
                          {formatValue(aggregatedData[row]?.[subRow]?.[col]?.[subCol], format, digitsAfterDot) ||
                            <span className={styles.empty}>-</span>}
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
