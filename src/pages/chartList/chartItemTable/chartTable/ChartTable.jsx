import {data} from "../../../../consts/tableData";
import {Table} from "rsuite";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  selectTableAutoHeight,
  selectTableBordered,
  selectTableColumnKeys,
  selectTableCompact,
  selectTableDraggable,
  selectTableHover,
  selectTableLoading,
  selectTableResize,
  selectTableShowHeader,
  selectTableSort,
  selectTableSortColumn,
  selectTableSortType
} from "../../../../store/tableSlice/table.selectors";
import {DEFAULT_COLUMNS} from "../../../../consts/tableMocks";
import {setTableLoading, setTableSortColumn} from "../../../../store/tableSlice/table.slice";

const {Column, HeaderCell, Cell} = Table;
const CompactCell = props => <Cell {...props} style={{padding: 4}}/>;
const CompactHeaderCell = props => <HeaderCell {...props} style={{padding: 4}}/>;

export const ChartTable = () => {

  const dispatch = useDispatch();

  const sortColumn = useSelector(selectTableSortColumn);
  const sortType = useSelector(selectTableSortType);
  const loading = useSelector(selectTableLoading);
  const compact = useSelector(selectTableCompact);
  const hover = useSelector(selectTableHover);
  const showHeader = useSelector(selectTableShowHeader);
  const autoHeight = useSelector(selectTableAutoHeight);
  const bordered = useSelector(selectTableBordered);
  const columnKey = useSelector(selectTableColumnKeys);
  const resize = useSelector(selectTableResize);
  const sort = useSelector(selectTableSort);
  const draggble = useSelector(selectTableDraggable);

  // Начальное состояние для столбцов
  const [columns, setColumns] = useState(
    DEFAULT_COLUMNS.filter((column) => columnKey.some((key) => key === column.key))
  );

  const CustomCell = compact ? CompactCell : Cell;
  const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;

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
      hover={hover}
      showHeader={showHeader}
      autoHeight={autoHeight}
      data={getData()}
      sortColumn={sortColumn}
      sortType={sortType}
      onSortColumn={handleSortColumn}
      loading={loading}
      bordered={bordered}
      cellBordered={bordered}
      headerHeight={compact ? 30 : 40}
      rowHeight={compact ? 30 : 46}
    >
      {columns.map((column, index) => {
        const {key, label, ...rest} = column;
        return (
          <Column
            {...rest}
            key={key}
            resizable={resize}
            sortable={sort}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
          >
            <HeaderCell
              draggable={draggble}
              onDragStart={() => handleDragStart(index)}
            >
              {label}
            </HeaderCell>
            <CustomCell dataKey={key}/>
          </Column>
        );
      })}
    </Table>
  );
};