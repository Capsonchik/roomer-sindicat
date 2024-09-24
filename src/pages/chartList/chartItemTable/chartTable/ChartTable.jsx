import {data} from "../../../../consts/tableData";
import {Table} from "rsuite";
import React from "react";
import {useSelector} from "react-redux";
import {
  selectTableAutoHeight,
  selectTableBordered,
  selectTableColumnKeys,
  selectTableCompact,
  selectTableHover,
  selectTableShowHeader
} from "../../../../store/tableSlice/table.selectors";
import {DEFAULT_COLUMNS} from "../../../../consts/tableMocks";

const {Column, HeaderCell, Cell} = Table;
const CompactCell = props => <Cell {...props} style={{padding: 4}}/>;
const CompactHeaderCell = props => <HeaderCell {...props} style={{padding: 4}}/>;

export const ChartTable = () => {

  const compact = useSelector(selectTableCompact);
  const hover = useSelector(selectTableHover);
  const showHeader = useSelector(selectTableShowHeader);
  const autoHeight = useSelector(selectTableAutoHeight);
  const bordered = useSelector(selectTableBordered);
  const columnKey = useSelector(selectTableColumnKeys);


  const column = DEFAULT_COLUMNS.filter(column => columnKey.some(key => key === column.key));
  const CustomCell = compact ? CompactCell : Cell;
  const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;

  return (
    <Table
      height={300}
      hover={hover}
      showHeader={showHeader}
      autoHeight={autoHeight}
      data={data}
      bordered={bordered}
      cellBordered={bordered}
      headerHeight={compact ? 30 : 40}
      rowHeight={compact ? 30 : 46}
    >
      {column.map(column => {
        const {key, label, ...rest} = column;
        return (
          <Column {...rest} key={key} resizable>
            <CustomHeaderCell>{label}</CustomHeaderCell>
            <CustomCell dataKey={key}/>
          </Column>
        );
      })}
    </Table>
  );
};