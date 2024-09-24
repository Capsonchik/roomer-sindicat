import styles from './chartItemTable.module.scss'
import {useDispatch} from "react-redux";
import {Button, Table} from 'rsuite';
import {setActiveChart, setOpenDrawer} from "../../../store/chartSlice/chart.slice";
import React, {useState} from "react";
import {data} from "../../../consts/tableData";
import EditIcon from "@rsuite/icons/Edit";
import {ExelIcon} from "./icons/ExelIcon";
import * as XLSX from 'xlsx';
import {ChartTable} from "./chartTable/ChartTable";


const {Column, HeaderCell, Cell} = Table;
const CompactCell = props => <Cell {...props} style={{padding: 4}}/>;
const CompactHeaderCell = props => <HeaderCell {...props} style={{padding: 4}}/>;


export const ChartItemTable = ({chart}) => {
  const dispatch = useDispatch();

  const [compact, setCompact] = useState(true);
  const [bordered, setBordered] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [hover, setHover] = useState(true);
  const [autoHeight, setAutoHeight] = useState(true)
  // const [columnKeys, setColumnKeys] = useState(DEFAULT_COLUMNS.map(column => column.key));

  // const columns = DEFAULT_COLUMNS.filter(column => columnKeys.some(key => key === column.key));
  // const CustomCell = compact ? CompactCell : Cell;
  // const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;

  const exportToExel = () => {
    const ws = XLSX.utils.json_to_sheet(data); // Преобразуем данные в лист Excel
    const wb = XLSX.utils.book_new(); // Создаем новую книгу
    XLSX.utils.book_append_sheet(wb, ws, "Data"); // Добавляем лист в книгу
    XLSX.writeFile(wb, "data.xlsx"); // Сохраняем книгу как файл
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title_wrapper}>
        <h5>{chart.title}</h5>
        <Button onClick={() => {
          dispatch(setActiveChart(chart))
          dispatch(setOpenDrawer(true))
        }}>
          <EditIcon/>
        </Button>
        <div
          className={styles.exelIcon}
          onClick={exportToExel}
        >
          <ExelIcon/>
        </div>
      </div>

      {/*<div>*/}
      {/*  <TagPicker*/}
      {/*    data={DEFAULT_COLUMNS}*/}
      {/*    labelKey="label"*/}
      {/*    valueKey="key"*/}
      {/*    value={columnKeys}*/}
      {/*    onChange={setColumnKeys}*/}
      {/*    cleanable={false}*/}
      {/*  />*/}
      {/*</div>*/}
      <hr/>

      {/*<Table*/}
      {/*  height={300}*/}
      {/*  hover={hover}*/}
      {/*  showHeader={showHeader}*/}
      {/*  autoHeight={autoHeight}*/}
      {/*  data={data}*/}
      {/*  bordered={bordered}*/}
      {/*  cellBordered={bordered}*/}
      {/*  headerHeight={compact ? 30 : 40}*/}
      {/*  rowHeight={compact ? 30 : 46}*/}
      {/*>*/}
      {/*  {columns.map(column => {*/}
      {/*    const {key, label, ...rest} = column;*/}
      {/*    return (*/}
      {/*      <Column {...rest} key={key} resizable>*/}
      {/*        <CustomHeaderCell>{label}</CustomHeaderCell>*/}
      {/*        <CustomCell dataKey={key}/>*/}
      {/*      </Column>*/}
      {/*    );*/}
      {/*  })}*/}
      {/*</Table>*/}

      <ChartTable/>

    </div>
  )
}