import styles from './styles.module.scss';
import {data} from "../../../../consts/tableData";
import {Table} from "rsuite";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  selectTableColumnKeys,
  selectTableLoading,
  selectTableSortColumn,
  selectTableSortType
} from "../../../../store/tableSlice/table.selectors";
import {DEFAULT_COLUMNS} from "../../../../consts/tableMocks";
import {setTableLoading, setTableSortColumn} from "../../../../store/tableSlice/table.slice";

const {Column, HeaderCell, Cell} = Table;
const CompactCell = props => <Cell {...props} style={{padding: 4}}/>;
const CompactHeaderCell = props => <HeaderCell {...props} style={{padding: 4}}/>;

export const ChartTable = ({sittings}) => {

  const dispatch = useDispatch();

  // Получаем сортировку и столбцы из Redux
  const sortColumn = useSelector(selectTableSortColumn);
  const sortType = useSelector(selectTableSortType);
  const loading = useSelector(selectTableLoading);
  const columnKeys = useSelector(selectTableColumnKeys);

  // Локальное состояние для управления порядком колонок
  const [columns, setColumns] = useState([]);

  // Инициализация колонок на основе Redux
  useEffect(() => {
    const visibleColumns = DEFAULT_COLUMNS.filter((column) => columnKeys.includes(column.key));
    setColumns(visibleColumns);
  }, [columnKeys]);

  const CustomCell = sittings?.compact ? CompactCell : Cell;
  const CustomHeaderCell = sittings?.compact ? CompactHeaderCell : HeaderCell;

  // Хранит индекс перетаскиваемого столбца
  const [draggingColumn, setDraggingColumn] = useState(null);

  // Обработка начала перетаскивания
  const handleDragStart = (index) => {
    setDraggingColumn(index);
  };

  // Обработка перетаскивания над другим столбцом
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggingColumn !== null && draggingColumn !== index) {
      const newColumns = [...columns];
      const draggedColumn = newColumns[draggingColumn];
      newColumns.splice(draggingColumn, 1); // Удаляем перетаскиваемый столбец
      newColumns.splice(index, 0, draggedColumn); // Вставляем его на новое место
      setColumns(newColumns);
      setDraggingColumn(index); // Обновляем индекс
    }
  };

  // Обработка завершения перетаскивания
  const handleDrop = () => {
    setDraggingColumn(null);
  };

  const getData = () => {
    if (sortColumn && sortType) {
      return data.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === 'string') {
          x = x.charCodeAt();
        }
        if (typeof y === 'string') {
          y = y.charCodeAt();
        }
        return sortType === 'asc' ? x - y : y - x;
      });
    }
    return data;
  };

  const handleSortColumn = (sortColumn, sortType) => {
    dispatch(setTableLoading(true));
    setTimeout(() => {
      dispatch(setTableLoading(false));
      dispatch(setTableSortColumn({column: sortColumn, type: sortType}));
    }, 500);
  };

  return (
    <Table
      height={300}
      hover={sittings?.hover}
      showHeader={sittings?.showHeader}
      autoHeight={sittings?.autoHeight}
      data={getData()}
      sortColumn={sortColumn}
      sortType={sortType}
      onSortColumn={handleSortColumn}
      loading={loading}
      bordered={sittings?.bordered}
      cellBordered={sittings?.bordered}
      headerHeight={sittings?.compact ? 30 : 40}
      rowHeight={sittings?.compact ? 30 : 46}
      onRowClick={(rowData) => console.log(rowData)}
    >
      {columns.map((column, index) => {
        const {key, label, ...rest} = column;
        return (
          <Column
            {...rest}
            key={key}
            resizable={sittings?.resize}
            sortable={sittings?.sort}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            flexGrow={1}
          >
            <CustomHeaderCell
              draggable={sittings?.draggable}
              onDragStart={() => handleDragStart(index)}
            >
              {label}
            </CustomHeaderCell>
            <CustomCell dataKey={key}>
              {(rowData) => <span
                className={`${column.customColor && rowData[key] % 2 !== 0 ? styles.positiveColor : ''}`}>{rowData[key]}</span>}
            </CustomCell>
          </Column>
        );
      })}
    </Table>
  );
};