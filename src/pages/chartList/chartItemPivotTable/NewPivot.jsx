import React, { useState, useMemo, useEffect } from 'react';
import styles from './customPivot.module.scss';
import { Button } from 'rsuite';
import { setActiveChart, setOpenDrawer } from '../../../store/chartSlice/chart.slice';
import EditIcon from '@rsuite/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { aggregateData } from './utils/aggregateData';
import { getCellStyle } from './utils/colorUtils';
import { formatValue } from './utils/formatUtils';
import { selectActiveClient, selectCharts, selectClients } from '../../../store/chartSlice/chart.selectors';
import { colors as colorsConsts } from '../chart/config';

export const CustomPivot = ({ chart, rowData, isDrawer = false, rowFields, colFields, aggregator, format = 'm', digitsAfterDot = 1 }) => {
  const clients = useSelector(selectClients);
  const activeClient = useSelector(selectActiveClient);
  const charts = useSelector(selectCharts);
  const [colors, setColors] = useState(colorsConsts);
  const dispatch = useDispatch();

  useEffect(() => {
    const client = clients.find(clnt => clnt.client_id === activeClient);
    if (client?.chart_colors && client?.chart_colors?.colors) {
      setColors(client.chart_colors.colors);
    }
  }, [charts]);

  const { result: aggregatedData, min, max } = useMemo(
    () => aggregateData(rowData, rowFields, colFields, aggregator),
    [rowData, rowFields, colFields, aggregator, format]
  );

  const rowLabels = useMemo(() => getNestedLabels(rowData, rowFields), [rowData, rowFields]);
  const colLabels = useMemo(() => getNestedLabels(rowData, colFields), [rowData, colFields]);

  if (!rowData.length) {
    return null;
  }

  // Helper function to get nested labels for rows and columns
  const getNestedLabels = (data, fields) => {
    if (fields.length === 0) return [];
    return fields.reduce((acc, field, depth) => {
      acc[field] = [...new Set(data.map(item => item[field] || 'Total'))];
      return acc;
    }, {});
  };

  // Recursive rendering for row headers based on rowFields
  const renderRowHeaders = (labels, depth = 0) => {
    if (depth >= rowFields.length) return null;
    const currentField = rowFields[depth];

    return labels[currentField].map((label, index) => (
      <React.Fragment key={`${currentField}-${index}`}>
        <tr>
          <td rowSpan={labels[currentField].length || 1} style={{ paddingLeft: depth * 15 }}>
            {label}
          </td>
          {depth + 1 < rowFields.length ? renderRowHeaders(labels, depth + 1) : null}
        </tr>
      </React.Fragment>
    ));
  };

  // Recursive rendering for column headers based on colFields
  const renderColHeaders = (labels, depth = 0) => {
    if (depth >= colFields.length) return null;
    const currentField = colFields[depth];

    return (
      <tr>
        {labels[currentField].map((label, index) => (
          <th colSpan={depth < colFields.length - 1 ? labels[currentField].length : 1} key={`${currentField}-${index}`}>
            {label}
          </th>
        ))}
        {depth + 1 < colFields.length && renderColHeaders(labels, depth + 1)}
      </tr>
    );
  };

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
            {renderColHeaders(colLabels)}
            </thead>
            <tbody>
            {renderRowHeaders(rowLabels)}
            {rowLabels[rowFields[0]].map((row, rowIndex) => (
              <tr key={rowIndex}>
                {colLabels[colFields[0]].map((col, colIndex) => (
                  <td key={colIndex} style={getCellStyle(
                    aggregatedData[row]?.[col],
                    min,
                    max,
                    colors[0]
                  )}>
                    {formatValue(aggregatedData[row]?.[col], format, digitsAfterDot) ||
                      <span className={styles.empty}>-</span>}
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
