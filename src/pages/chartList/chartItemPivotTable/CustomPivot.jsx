  import React, { useState, useMemo, useEffect } from 'react';
  import styles from './customPivot.module.scss';
  import { Button } from 'rsuite';
  import { setActiveChart, setOpenDrawer } from '../../../store/chartSlice/chart.slice';
  import EditIcon from '@rsuite/icons/Edit';
  import { useDispatch, useSelector } from 'react-redux';
  import { hexToHSL } from "../../../lib/hexToHSL";
  import { hslToHex } from "../../../lib/HSLToHex";
  import { generateColors } from "../../../lib/generateColors";
  import { selectActiveClient, selectCharts, selectClients } from "../../../store/chartSlice/chart.selectors";
  import { colors as colorsConsts } from "../chart/config";
  import { DndProvider, useDrag, useDrop } from "react-dnd";
  import { HTML5Backend } from "react-dnd-html5-backend";

  // Aggregation function for data
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

      if (value < min) min = value;
      if (value > max) max = value;
    });

    return { result, min, max };
  };

  // Function to create shades from a hex color
  const getShadesFromHex = (hex, lightnessFactor = 0.9, darknessFactor = 0.6) => {
    const [h, s, l] = hexToHSL(hex);
    const lightShade = hslToHex(h, s, l + (100 - l) * lightnessFactor);
    const darkShade = hslToHex(h, s, l * darknessFactor);
    return { lightShade, darkShade };
  };

  // Cell styling based on value and color gradient
  const getCellStyle = (value, min, max, baseColorHex) => {
    if (value == null) return {};

    const ratio = (value - min) / (max - min);
    const { lightShade, darkShade } = getShadesFromHex(baseColorHex);

    const hexToRGB = (hex) => hex.match(/\w\w/g).map(x => parseInt(x, 16));
    const darkColor = hexToRGB(darkShade);
    const lightColor = hexToRGB(lightShade);
    const interpolatedColor = lightColor.map((c, i) => Math.round(c + (darkColor[i] - c) * ratio));

    return {
      fontSize: 16,
      backgroundColor: `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`,
      color: ratio < 0.5 ? 'black' : 'white',
    };
  };

  // Function to format values
  const formatValue = (value, formatType, digitsAfterDot = null) => {
    const numericValue = Number(value);
    if (typeof value !== 'number' || isNaN(numericValue)) return null;

    if (formatType === 'k') {
      return numericValue >= 1000
        ? `${(numericValue / 1000).toFixed(digitsAfterDot ?? 0)}k`
        : numericValue;
    } else if (formatType === 'm') {
      return numericValue >= 1_000_000
        ? `${(numericValue / 1_000_000).toFixed(digitsAfterDot ?? 0)}m`
        : numericValue >= 1000
          ? `${(numericValue / 1000).toFixed(digitsAfterDot ?? 0)}k`
          : numericValue;
    }

    return digitsAfterDot !== null ? numericValue.toFixed(digitsAfterDot) : numericValue;
  };

  const COLUMN_TYPE = 'column';

  // Custom hook for draggable column headers
  const DraggableColumnHeader = ({ col, index, moveColumn, setIsDragging }) => {
    const [, ref] = useDrag({
      type: COLUMN_TYPE,
      item: { index },
      collect: (monitor) => {
        setIsDragging(monitor.isDragging());
      },
    });

    const THRESHOLD = 10; // Пороговое значение в пикселях

    const [, drop] = useDrop({
      accept: COLUMN_TYPE,
      hover: (draggedItem, monitor) => {
        const difference = monitor.getDifferenceFromInitialOffset();
        const distanceX = Math.abs(difference.x);

        if (distanceX > THRESHOLD && draggedItem.index !== index) {
          moveColumn(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });

    return (
      <th style={{cursor:'grab'}} ref={(node) => ref(drop(node))} colSpan={1} className={styles.columnHeader}>
        {col}
      </th>
    );
  };

  export const CustomPivot = ({ chart, rowData, isDrawer = false, rowColData }) => {
    const clients = useSelector(selectClients);
    const activeClient = useSelector(selectActiveClient);
    const charts = useSelector(selectCharts);
    const [columnOrder, setColumnOrder] = useState([]);
    const [colors, setColors] = useState(colorsConsts);
    const [isDragging, setIsDragging] = useState(false);
    const { rowKey, subRowKey, colKey, subColKey, aggregator, format = 'm', digitsAfterDot } = rowColData;

    useEffect(() => {
      if (!isDragging) {
        // После завершения перетаскивания вызовите агрегацию

        console.log(11111)
        aggregateData(rowData, rowKey, subRowKey, colKey, subColKey, aggregator);
      }
    }, [columnOrder, isDragging, rowData, rowKey, subRowKey, colKey, subColKey, aggregator]);

    useEffect(() => {
      const client = clients.find(clnt => clnt.client_id === activeClient);
      if (client?.chart_colors?.colors) setColors(client.chart_colors.colors);
    }, [charts]);

    const dispatch = useDispatch();

    const { result: aggregatedData, min, max } = useMemo(
      () => {
        if (!isDragging) {
          return aggregateData(rowData, rowKey, subRowKey, colKey, subColKey, aggregator);
        }
        return { result: {}, min: 0, max: 0 };
      },
      [rowData, rowKey, subRowKey, colKey, subColKey, aggregator, isDragging]
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

    useEffect(() => setColumnOrder(colLabels), [colLabels]);


    const moveColumn = (fromIndex, toIndex) => {
      setColumnOrder((prevOrder) => {
        const newOrder = [...prevOrder];
        const [movedItem] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedItem);
        return newOrder;
      });
      setIsDragging(false);
    };

    if (!rowData.length) return null;

    return (
      <DndProvider backend={HTML5Backend}>
        <div className={`${styles.wrapper} ${isDrawer ? styles.isDrawer : ''}`}>
          <div className={styles.wrapper_scroll}>
            <div className={styles.title_wrapper}>
              <h5 className={styles.title}>{chart.title}</h5>
              {!isDrawer && (
                <Button onClick={() => { dispatch(setActiveChart(chart)); dispatch(setOpenDrawer(true)); }}>
                  <EditIcon />
                </Button>
              )}
            </div>
            <div className={styles.table_scroll}>
              <table border="1" className={styles.table}>
                <thead>
                <tr>
                  <th className={styles.row} rowSpan="2">{rowKey}</th>
                  <th className={styles.row} rowSpan="2">{subRowKey}</th>
                  {columnOrder.map((col, index) => (
                    <DraggableColumnHeader
                      key={col}
                      col={col}
                      index={index}
                      moveColumn={moveColumn}
                      setIsDragging={setIsDragging}
                    />
                  ))}
                </tr>
                <tr>
                  {columnOrder.map((col) =>
                    subColLabels[col].map((subCol) => (
                      <th key={subCol} className={styles.columnHeader}>
                        {subCol}
                      </th>
                    ))
                  )}
                </tr>
                </thead>
                <tbody>
                {rowLabels.map((rowLabel) =>
                  subRowLabels[rowLabel].map((subRowLabel, subRowIndex) => (
                    <tr key={`${rowLabel}-${subRowLabel}`}>
                      {subRowIndex === 0 && (
                        <td className={styles.row} rowSpan={subRowLabels[rowLabel].length}>
                          {rowLabel}
                        </td>
                      )}
                      <td className={styles.row}>{subRowLabel}</td>
                      {columnOrder.map((col) =>
                        subColLabels[col].map((subCol) => (
                          <td
                            key={`${col}-${subCol}`}
                            style={getCellStyle(aggregatedData[rowLabel]?.[subRowLabel]?.[col]?.[subCol], min, max, colors[0])}
                          >
                            {formatValue(aggregatedData[rowLabel]?.[subRowLabel]?.[col]?.[subCol], format, digitsAfterDot)}
                          </td>
                        ))
                      )}
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DndProvider>
    );
  };
