import styles from './chartTable.module.scss'
import {Button, Heading, Input, Toggle} from "rsuite";
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
import {
  fetchAllChartsByGroupId,
  fetchAllChartsFormatByGroupId,
  patchChartFormatting
} from "../../../../store/chartSlice/chart.actions";
import {selectActiveGroupId, selectGroupsReports} from "../../../../store/chartSlice/chart.selectors";
import {selectActiveFilters} from "../../../../store/chartSlice/filter.slice";
import {setOpenDrawer} from "../../../../store/chartSlice/chart.slice";

export const ChartTableEditor = ({chart}) => {
  const dispatch = useDispatch();

  const [tableNameInput, setTableNameInput] = useState(chart.title)

  const sittings = useSelector(selectTableSittings);
  const activeGroupId = useSelector(selectActiveGroupId)
  const groupsReports = useSelector(selectGroupsReports)
  const activeFilters = useSelector(selectActiveFilters)

  const [columnKeys, setColumnKeys] = useState(DEFAULT_COLUMNS.map(column => column.key));
  const columns = DEFAULT_COLUMNS.filter(column => columnKeys.some(key => key === column.key));

  const handleSave = () => {
    const {seriesData, xAxisData, ...rest} = chart

    dispatch(patchChartFormatting({
      ...rest,
      title: tableNameInput,
      formatting: sittings
    })).then(() => {
      const id = activeGroupId || groupsReports[0].group_id
      const activeFiltersRequest = activeFilters[activeGroupId]
      const request = activeFiltersRequest
        ? activeFiltersRequest.map(filter => {
          return {
            filter_id: filter.filter_id,
            filter_values: filter.value,
            isactive: filter.isactive,
          }
        })
          .filter(filter => filter.isactive && Array.isArray(filter.filter_values) && filter.filter_values.length > 0)
        : []
      dispatch(fetchAllChartsByGroupId({groupId: id, filter_data: {filter_data: request}})).then(() => {
        dispatch(fetchAllChartsFormatByGroupId(id))
      })
    })

    dispatch(setOpenDrawer(false))
  }

  return (
    <div className={styles.wrapper}>
      <Heading level={6}>Название таблицы</Heading>

      <Input
        placeholder={tableNameInput}
        onChange={(value) => setTableNameInput(value)}
      />

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

      <ChartTable table_data={chart[0].table_data} format={chart.formatting} sittings={sittings}/>

      <div className={styles.buttons}>
        <Button className={styles.delete_btn}>Удалить</Button>
        <Button className={styles.save_btn} onClick={handleSave}>Сохранить</Button>
      </div>
    </div>
  )
}