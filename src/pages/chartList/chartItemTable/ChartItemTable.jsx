import styles from './chartItemTable.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {Button} from 'rsuite';
import {setActiveChart, setOpenDrawer} from "../../../store/chartSlice/chart.slice";
import React, {useEffect} from "react";
import {data} from "../../../consts/tableData";
import EditIcon from "@rsuite/icons/Edit";
import {ExelIcon} from "./icons/ExelIcon";
import * as XLSX from 'xlsx';
import {ChartTable} from "./chartTable/ChartTable";
import {setTableSittings} from "../../../store/tableSlice/table.slice";
import {selectTableSittings} from "../../../store/tableSlice/table.selectors";

export const ChartItemTable = ({chart}) => {
  const dispatch = useDispatch();

  const sittings = useSelector(selectTableSittings);

  const exportToExel = () => {
    const ws = XLSX.utils.json_to_sheet(data); // Преобразуем данные в лист Excel
    const wb = XLSX.utils.book_new(); // Создаем новую книгу
    XLSX.utils.book_append_sheet(wb, ws, "Data"); // Добавляем лист в книгу
    XLSX.writeFile(wb, "data.xlsx"); // Сохраняем книгу как файл
  }

  useEffect(() => {
    dispatch(setTableSittings(chart.formatting))
  }, [chart, dispatch]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title_wrapper}>
        <h5 className={styles.title}>{chart.title}</h5>
        <Button
          className={styles.exelIcon}
          onClick={exportToExel}
        >
          <ExelIcon/>
        </Button>
        <Button onClick={() => {
          dispatch(setActiveChart(chart))
          dispatch(setOpenDrawer(true))
        }}>
          <EditIcon/>
        </Button>

      </div>

      <ChartTable format={chart.formatting} sittings={sittings}/>

    </div>
  )
}