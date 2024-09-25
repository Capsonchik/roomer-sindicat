import styles from './chartTable.module.scss'
import {Heading, Toggle} from "rsuite";
import {ChartTable} from "../../chartItemTable/chartTable/ChartTable";
import {useDispatch, useSelector} from "react-redux";
import {
  selectTableAutoHeight,
  selectTableBordered,
  selectTableCompact,
  selectTableHover,
  selectTableResize,
  selectTableShowHeader,
  selectTableSort
} from "../../../../store/tableSlice/table.selectors";
import {
  setTableAutoHeight,
  setTableBordered,
  setTableCompact,
  setTableHover,
  setTableResize,
  setTableShowHeader,
  setTableSort
} from "../../../../store/tableSlice/table.slice";
import {DEFAULT_COLUMNS} from "../../../../consts/tableMocks";
import {useState} from "react";
import {ColumnPicker} from "../../chartItemTable/columnPicker/ColumnPicker";

export const ChartTableEditor = ({chart}) => {
  const dispatch = useDispatch();

  const compact = useSelector(selectTableCompact);
  const hover = useSelector(selectTableHover);
  const showHeader = useSelector(selectTableShowHeader);
  const autoHeight = useSelector(selectTableAutoHeight);
  const bordered = useSelector(selectTableBordered);
  const resize = useSelector(selectTableResize);
  const sort = useSelector(selectTableSort);

  const [columnKeys, setColumnKeys] = useState(DEFAULT_COLUMNS.map(column => column.key));
  const columns = DEFAULT_COLUMNS.filter(column => columnKeys.some(key => key === column.key));

  console.log('KK', columnKeys)
  console.log('K', columns)

  return (
    <div className={styles.wrapper}>
      <Heading level={6}>Базовые настройки таблицы</Heading>

      <div className={styles.toggles}>
        <Toggle checked={compact} onChange={() => dispatch(setTableCompact(!compact))}>
          Компактный размер
        </Toggle>

        <Toggle checked={bordered} onChange={() => dispatch(setTableBordered(!bordered))}>
          Обводка таблицы
        </Toggle>

        <Toggle checked={showHeader} onChange={() => dispatch(setTableShowHeader(!showHeader))}>
          Отображение заголовков столбцов
        </Toggle>

        <Toggle checked={hover} onChange={() => dispatch(setTableHover(!hover))}>
          Эффект при наведении
        </Toggle>

        <Toggle checked={autoHeight} onChange={() => dispatch(setTableAutoHeight(!autoHeight))}>
          Автоматическая высота таблицы
        </Toggle>
      </div>

      <Heading level={6}>Настройки столбцов</Heading>

      <div className={styles.toggles}>

        <Toggle checked={resize} onChange={() => dispatch(setTableResize(!resize))}>
          Возможность менять размер
        </Toggle>

        <Toggle checked={sort} onChange={() => dispatch(setTableSort(!sort))}>
          Вкл/выкл сортировку
        </Toggle>

      </div>

      <Heading level={6}>Отображение столбцов таблицы</Heading>

      <ColumnPicker/>

      <Heading level={6}>Визуализация измененной таблицы</Heading>

      <ChartTable/>
    </div>
  )
}