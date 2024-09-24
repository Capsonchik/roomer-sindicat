import {data} from "../../../../consts/tableData";
import {Table} from "rsuite";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {
  selectTableAutoHeight,
  selectTableBordered,
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

  const [columnKeys, setColumnKeys] = useState(DEFAULT_COLUMNS.map(column => column.key));
  const columns = DEFAULT_COLUMNS.filter(column => columnKeys.some(key => key === column.key));
  const CustomCell = compact ? CompactCell : Cell;
  const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;

  return (
    <div>
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
        {columns.map(column => {
          const {key, label, ...rest} = column;
          return (
            <Column {...rest} key={key} resizable>
              <CustomHeaderCell>{label}</CustomHeaderCell>
              <CustomCell dataKey={key}/>
            </Column>
          );
        })}
      </Table>
    </div>
  );
};