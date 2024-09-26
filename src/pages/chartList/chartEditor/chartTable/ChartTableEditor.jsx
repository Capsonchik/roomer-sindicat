import styles from './chartTable.module.scss'
import {Button, Heading, Toggle} from "rsuite";
import {ChartTable} from "../../chartItemTable/chartTable/ChartTable";
import {useDispatch, useSelector} from "react-redux";
import {selectTableSittings} from "../../../../store/tableSlice/table.selectors";
import {
  setSittingsAutoHeight,
  setSittingsBordered,
  setSittingsCompact,
  setSittingsDraggable,
  setSittingsHover,
  setSittingsResize,
  setSittingsShowHeader,
  setSittingsSort
} from "../../../../store/tableSlice/table.slice";
import {DEFAULT_COLUMNS} from "../../../../consts/tableMocks";
import {useState} from "react";
import {ColumnPicker} from "../../chartItemTable/columnPicker/ColumnPicker";

export const ChartTableEditor = ({chart}) => {
  const dispatch = useDispatch();
  
  const sittings = useSelector(selectTableSittings);

  const [columnKeys, setColumnKeys] = useState(DEFAULT_COLUMNS.map(column => column.key));
  const columns = DEFAULT_COLUMNS.filter(column => columnKeys.some(key => key === column.key));

  return (
    <div className={styles.wrapper}>
      <Heading level={6}>Базовые настройки таблицы</Heading>

      <div className={styles.toggles}>
        <Toggle checked={sittings.compact} onChange={() => dispatch(setSittingsCompact(!sittings.compact))}>
          Компактный размер
        </Toggle>

        <Toggle checked={sittings.bordered} onChange={() => dispatch(setSittingsBordered(!sittings.bordered))}>
          Обводка таблицы
        </Toggle>

        <Toggle checked={sittings.showHeader} onChange={() => dispatch(setSittingsShowHeader(!sittings.showHeader))}>
          Отображение заголовков столбцов
        </Toggle>

        <Toggle checked={sittings.hover} onChange={() => dispatch(setSittingsHover(!sittings.hover))}>
          Эффект при наведении
        </Toggle>

        <Toggle checked={sittings.autoHeight} onChange={() => dispatch(setSittingsAutoHeight(!sittings.autoHeight))}>
          Автоматическая высота таблицы
        </Toggle>
      </div>

      <Heading level={6}>Настройки столбцов</Heading>

      <div className={styles.toggles}>

        <Toggle checked={sittings.resize} onChange={() => dispatch(setSittingsResize(!sittings.resize))}>
          Возможность менять размер
        </Toggle>

        <Toggle checked={sittings.sort} onChange={() => dispatch(setSittingsSort(!sittings.sort))}>
          Вкл/выкл сортировку
        </Toggle>

        <Toggle checked={sittings.draggable} onChange={() => dispatch(setSittingsDraggable(!sittings.draggable))}>
          Вкл/выкл возможность перетаскивания столбцов
        </Toggle>

      </div>

      <Heading level={6}>Отображение столбцов таблицы</Heading>

      <ColumnPicker/>

      <Heading level={6}>Визуализация измененной таблицы</Heading>

      <ChartTable format={chart.formatting} sittings={sittings}/>

      <div className={styles.buttons}>
        <Button className={styles.delete_btn}>Удалить</Button>
        <Button className={styles.save_btn}>Сохранить</Button>
      </div>
    </div>
  )
}