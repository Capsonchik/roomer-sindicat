import React, {useState, useMemo} from 'react';
import styles from './customPivot.module.scss'

// Функция для агрегации данных
const aggregateData = (data, rowKey, subRowKey, colKey, subColKey, aggregator) => {
  const result = {};

  data.forEach((item) => {
    const row = item[rowKey];
    const subRow = item[subRowKey];
    const col = item[colKey];
    const subCol = item[subColKey];

    if (!result[row]) {
      result[row] = {};
    }

    if (!result[row][subRow]) {
      result[row][subRow] = {};
    }

    if (!result[row][subRow][col]) {
      result[row][subRow][col] = {};
    }

    result[row][subRow][col][subCol] = item[aggregator];
  });

  return result;
};

export const CustomPivot = ({rowData}) => {
  const [rowKey, setRowKey] = useState('Region');
  const [subRowKey, setSubRowKey] = useState('Segment2'); // Вторая группа строк
  const [colKey, setColKey] = useState('Segment1');
  const [subColKey, setSubColKey] = useState('Product'); // Вторая группа колонок
  const [aggregator, setAggregator] = useState('Total_value');

  // Агрегированные данные
  const aggregatedData = useMemo(() => aggregateData(rowData, rowKey, subRowKey, colKey, subColKey, aggregator), [rowData, rowKey, subRowKey, colKey, subColKey, aggregator]);

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

  if(!rowData.length) {
    return null;
  }

  return (
    <div>
      <h2 className={styles.title}>Custom Pivot Table</h2>

      {/* Выпадающие списки для выбора ключей строк, подстрок, колонок и агрегатора */}
      <div className={styles.selects}>
        <div>
          <h6>Строки</h6>
          <div>
            <div>
              <p>row</p>
              <label>

                <select value={rowKey} onChange={(e) => setRowKey(e.target.value)}>
                  {Object.keys(rowData[0]).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <p>subRow</p>
              <label>
                <select value={subRowKey} onChange={(e) => setSubRowKey(e.target.value)}>
                  {Object.keys(rowData[0]).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </label>
            </div>

          </div>
        </div>

        <div>
          <h6>Колонки</h6>
          <div>
            <div>
              <p>col</p>
              <label>
                <select value={colKey} onChange={(e) => setColKey(e.target.value)}>
                  {Object.keys(rowData[0]).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <p>subCol</p>
              <label>
                <select value={subColKey} onChange={(e) => setSubColKey(e.target.value)}>
                  {Object.keys(rowData[0]).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </label>
            </div>


          </div>
        </div>

        <div>
          <h6>Значения</h6>
          <div>
            <p>aggregator</p>
            <label>
              <select value={aggregator} onChange={(e) => setAggregator(e.target.value)}>
                {['Total_value', 'Total_volume', 'Traffic'].map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
          </div>

        </div>


      </div>

      {/* Отображение сводной таблицы */}
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
                  <td key={subCol}>
                    {aggregatedData[row] && aggregatedData[row][subRow] && aggregatedData[row][subRow][col] && aggregatedData[row][subRow][col][subCol]
                      ? aggregatedData[row][subRow][col][subCol]
                      : '—'}
                  </td>
                ))
              )}
            </tr>
          ));
        })}
        </tbody>
      </table>
    </div>
  );
};
