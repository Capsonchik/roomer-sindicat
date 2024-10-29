import React, { useState, useMemo, useEffect, useRef } from 'react';
import styles from './customPivot.module.scss';
import { Button } from 'rsuite';
import { setActiveChart, setOpenDrawer } from '../../../store/chartSlice/chart.slice';
import EditIcon from '@rsuite/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { aggregateData } from './utils/aggregateData';
import { getCellStyle } from './utils/colorUtils';
import { formatValue } from './utils/formatUtils';
import * as XLSX from 'xlsx'; // Импортируем SheetJS
import { selectActiveClient, selectCharts, selectClients } from '../../../store/chartSlice/chart.selectors';
import { colors as colorsConsts } from '../chart/config';

export const CustomPivot = ({ chart, rowData, isDrawer = false, rowColData }) => {
  const clients = useSelector(selectClients);
  const activeClient = useSelector(selectActiveClient);
  const charts = useSelector(selectCharts);
  const [colors, setColors] = useState(colorsConsts);

  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const client = clients.find(clnt => clnt.client_id === activeClient);
    if (client?.chart_colors && client?.chart_colors?.colors) {
      setColors(client?.chart_colors?.colors);
    }
  }, [charts]);

  const { rowKey, subRowKey, colKey, subColKey, aggregator, format = 'm', digitsAfterDot } = rowColData;
  const dispatch = useDispatch();

  const { result: aggregatedData, min, max } = useMemo(
    () => aggregateData(rowData, rowKey, subRowKey, colKey, subColKey, aggregator),
    [rowData, rowKey, subRowKey, colKey, subColKey, aggregator, format]
  );

  const rowLabels = useMemo(() => [...new Set(rowData.map((item) => item[rowKey]))], [rowData, rowKey]);
  const subRowLabels = useMemo(
    () => rowLabels.reduce((acc, row) => {
      acc[row] = [...new Set(rowData.filter((item) => item[rowKey] === row).map((item) => item[subRowKey]))];
      return acc;
    }, {}),
    [rowData, rowKey, subRowKey]
  );

  const colLabels = useMemo(() => [...new Set(rowData.map((item) => item[colKey]))], [rowData, colKey]);
  const subColLabels = useMemo(
    () => colLabels.reduce((acc, col) => {
      acc[col] = [...new Set(rowData.filter((item) => item[colKey] === col).map((item) => item[subColKey]))];
      return acc;
    }, {}),
    [rowData, colKey, subColKey]
  );
  //
  // useEffect(() => {
  //   // Синхронизация ширины ячеек `thead` и `tbody`
  //   if (headerRef.current && bodyRef.current) {
  //     const headerCells = headerRef.current.querySelectorAll('th');
  //     const bodyCells = bodyRef.current.querySelectorAll('td');
  //     headerCells.forEach((headerCell, index) => {
  //       const bodyCell = bodyCells[index];
  //       if (bodyCell) {
  //         const width = bodyCell.offsetWidth;
  //         headerCell.style.width = `${width}px`;
  //       }
  //     });
  //   }
  // }, [rowData]);

  // Функция для экспорта данных в Excel
  const exportToExcel = () => {
    const exportData = []; // Массив для хранения данных таблицы

    // Добавляем заголовок в форматированном виде
    exportData.push([
      rowKey,
      subRowKey,
      ...colLabels.flatMap(col => subColLabels[col].map(subCol => `${col} - ${subCol}`))
    ]);

    // Добавляем строки данных
    rowLabels.forEach(row => {
      const subRows = subRowLabels[row] || [];
      subRows.forEach(subRow => {
        const rowData = [
          row,
          subRow,
          ...colLabels.flatMap(col =>
            subColLabels[col].map(subCol =>
              formatValue(aggregatedData[row]?.[subRow]?.[col]?.[subCol], format, digitsAfterDot) || '-'
            )
          )
        ];
        exportData.push(rowData);
      });
    });

    // Создаем новый рабочий лист и книгу Excel
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pivot Table');

    // Генерируем и загружаем файл Excel
    XLSX.writeFile(wb, `${chart.title || 'pivot_table'}.xlsx`);
  };

  if (!rowData.length) {
    return null;
  }

  return (
    <div className={`${styles.wrapper} ${isDrawer ? styles.isDrawer : ''}`}>
      <div className={styles.wrapper_scroll}>
        <div className={styles.title_wrapper}>
          <h5 className={styles.title}>{chart.title}</h5>
          {!isDrawer && (
            <>
              <Button
                onClick={() => {
                  dispatch(setActiveChart(chart));
                  dispatch(setOpenDrawer(true));
                }}
              >
                <EditIcon />
              </Button>
              <Button onClick={exportToExcel}>
                Excel
              </Button>
            </>

          )}
        </div>
        {/* Отдельная таблица для заголовков */}
        <div className={styles.table_scroll}>
          <table border="1" className={styles.table} ref={headerRef}>
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
          </table>
          {/* Основная таблица для данных */}
          <div className={styles.table_body_wrapper}>
            <table border="1" className={`${styles.table} ${styles.table_body}`} ref={bodyRef}>
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
                          min,
                          max,
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
    </div>
  );
};
