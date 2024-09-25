import {data} from "../../../../consts/tableData";
import {Table} from "rsuite";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {
  selectTableAutoHeight,
  selectTableBordered,
  selectTableColumnKeys,
  selectTableCompact,
  selectTableHover,
  selectTableResize,
  selectTableShowHeader,
  selectTableSort
} from "../../../../store/tableSlice/table.selectors";
import {DEFAULT_COLUMNS} from "../../../../consts/tableMocks";

const {Column, HeaderCell, Cell} = Table;
const CompactCell = props => <Cell {...props} style={{padding: 4}}/>;
const CompactHeaderCell = props => <HeaderCell {...props} style={{padding: 4}}/>;

export const ChartTable = () => {

  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);

  const compact = useSelector(selectTableCompact);
  const hover = useSelector(selectTableHover);
  const showHeader = useSelector(selectTableShowHeader);
  const autoHeight = useSelector(selectTableAutoHeight);
  const bordered = useSelector(selectTableBordered);
  const columnKey = useSelector(selectTableColumnKeys);
  const resize = useSelector(selectTableResize);
  const sort = useSelector(selectTableSort);


  const column = DEFAULT_COLUMNS.filter(column => columnKey.some(key => key === column.key));
  const CustomCell = compact ? CompactCell : Cell;
  const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;

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
        if (sortType === 'asc') {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return data;
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  return (
    <Table
      height={300}
      hover={hover}
      showHeader={showHeader}
      autoHeight={autoHeight}
      // data={data}
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
      {column.map(column => {
        const {key, label, ...rest} = column;
        return (
          <Column {...rest} key={key} resizable={resize} sortable={sort}>
            <CustomHeaderCell>{label}</CustomHeaderCell>
            <CustomCell dataKey={key}/>
          </Column>
        );
      })}
    </Table>
  );
};