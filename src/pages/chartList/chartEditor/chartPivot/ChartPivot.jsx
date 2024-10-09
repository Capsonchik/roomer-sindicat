import {selectActiveGroupId, selectFilters, selectGroupsReports} from "../../../../store/chartSlice/chart.selectors";
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';
import {ModuleRegistry} from '@ag-grid-community/core';
import {AgGridReact} from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {localeText} from "./agGridLocale";
import {ColumnsToolPanelModule} from "@ag-grid-enterprise/column-tool-panel";
import {MenuModule} from "@ag-grid-enterprise/menu";
import {RowGroupingModule} from "@ag-grid-enterprise/row-grouping";
import {FiltersToolPanelModule} from "@ag-grid-enterprise/filter-tool-panel";
import {agGridData} from "./agGridData";
import styles from './agGrid.module.scss'
import {Button} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import {useDispatch, useSelector} from "react-redux";
import {setActiveChart, setOpenDrawer} from "../../../../store/chartSlice/chart.slice";
import {
  fetchAllChartsByGroupId,
  fetchAllChartsFormatByGroupId,
  patchChartFormatting
} from "../../../../store/chartSlice/chart.actions";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MenuModule,
  RowGroupingModule,
  FiltersToolPanelModule,
]);

const generateColumnDefs = (rowData, minValue, maxValue) => {
  const columns = [];

  if (rowData.length === 0) return columns; // Если данные пустые, возвращаем пустой массив

  const allKeys = Array.from(new Set(rowData.flatMap(Object.keys)));

  allKeys.forEach(key => {
    columns.push({
      field: key,
      headerName: key,
      enableValue: true,
      enableRowGroup: true, // Включаем группировку для category и subcategory
      enablePivot: true, // Отключаем возможность использования в сводной таблице для productName и period
      aggFunc: (params) => {
        params.api.expandAll(); // Раскрываем все группы
        return params.values.length > 1 ? null : params.values[0];
      },
      cellStyle: (params) => {
        if (params.value == null) return {}; // если значение отсутствует, не применяем стиль

        const minValue = 0; // Замените на ваше минимальное значение
        const maxValue = 100; // Замените на ваше максимальное значение

        // Нормализуем значение для диапазона [0, 1]
        const value = (params.value - minValue) / (maxValue - minValue);

        // Определяем цвета (в формате RGB)
        const darkColor = [250, 134, 130]; // #f7635c
        const lightColor = [255, 248, 248]; // #fff2f2

        // Интерполируем между светлым и темным цветом
        const interpolatedColor = darkColor.map((c, i) => Math.round(c + (lightColor[i] - c) * value));

        return {
          backgroundColor: `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`, // от темного к светлому
          color: value > 0.5 ? 'black' : 'white', // Контраст текста
        };
      }
    });

  });

  return columns;
};

export const ChartPivot = ({chart}) => {
  const activeGroupId = useSelector(selectActiveGroupId)
  const groupsReports = useSelector(selectGroupsReports)
  const filters = useSelector(selectFilters)
  const pivotData = chart?.['0']?.table_data ?? []
  const gridRef = useRef(null);
  const dispatch = useDispatch()
  const [rowData, setRowData] = useState(pivotData);
  const [minMax, setMinMax] = useState({minValue: 0, maxValue: 0});

  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
    // params.api.expandAll();
    console.log(params)
    // Устанавливаем rowData сразу
    // params.api.setRowData(rowData); // Убедитесь, что rowData уже загружены здесь

    // Вычисляем минимальные и максимальные значения по полю 'value'
    let minValue = Number.POSITIVE_INFINITY;
    let maxValue = Number.NEGATIVE_INFINITY;

    params.api.forEachNodeAfterFilterAndSort((node) => {
      if (node.data && node.data.value != null) {
        minValue = Math.min(minValue, node.data.value);
        maxValue = Math.max(maxValue, node.data.value);
      }
    });

    setMinMax({minValue, maxValue});

    setTimeout(() => {
      if (chart.formatting.values) {
        params.api.setValueColumns(chart.formatting.values);
      }

    },50)
    if (chart.formatting.rowGroups) {
      params.api.setRowGroupColumns(chart.formatting.rowGroups);
    }
    if (chart.formatting.colGroups) {
      params.api.setPivotColumns(chart.formatting.colGroups);
    }

    params.api.expandAll(); // Раскрываем все группы

  }, [rowData]);






  // const defaultColDef = useMemo(() => ({
  //   sortable: true,
  //   filter: true,
  //   resizable: true,
  //   enableValue: false,
  //   enableRowGroup: true,
  //   enablePivot: true, // Отключаем агрегацию по умолчанию
  //   aggFunc: null,
  // }), []);

  const autoGroupColumnDef = useMemo(() => ({
    headerName: "Группы",
    minWidth: 200,
    cellRenderer: 'agGroupCellRenderer',
    pinned: "left",
  }), []);

  console.log(gridRef?.current?.api?.getValueColumns().map(col => col.getColId()))
  const columnDefs = useMemo(() => generateColumnDefs(rowData, minMax.minValue, minMax.maxValue), [rowData, minMax]);

  const handlePatch = () => {
    const rowGroupColumns = gridRef.current.api.getRowGroupColumns().map(col => col.getColId());
    const valueColumns = gridRef.current.api.getValueColumns().map(col => col.getColId());
    const pivotColumns = gridRef.current.api.getPivotColumns().map(col => col.getColId());

    console.log("Row Group Columns:", rowGroupColumns);
    console.log("Value Columns:", valueColumns);
    console.log("Pivot Columns:", pivotColumns);

    const {graph_id, xAxisData, seriesData, ...rest} = chart
    const {isVisibleSeriesChange, ...restFormatting} = rest.formatting
    const request = {
      ...rest, formatting: {
        ...restFormatting,
        rowGroups: rowGroupColumns,
        colGroups: pivotColumns,
        values: valueColumns,
      }
    }
    dispatch(patchChartFormatting(request)).then(() => {
      const id = activeGroupId || groupsReports[0].group_id
      const activeFiltersRequest = filters
      // console.log('activeFilters[activeGroupId]',activeFilters[activeGroupId])
      const request = activeFiltersRequest
        .map(filter => {
          return {
            filter_id: filter.filter_id,
            filter_values: filter.value,
            isactive: filter.isactive,
          }
        })
        .filter(filter => filter.isactive && Array.isArray(filter.filter_values) && filter.filter_values.length > 0)
      dispatch(fetchAllChartsByGroupId({groupId: id, filter_data: {filter_data: request}})).then(() => {
        dispatch(fetchAllChartsFormatByGroupId(id))
      })
      // dispatch(getFilters(activeGroupId)).then(() => {
      //   dispatch(setFilterLoading('none'))
      // })
    })

    dispatch(setOpenDrawer(false))

  }

  // const onFirstDataRendered = useCallback((params) => {
  //   if (gridRef.current.api.getAllColumns().length > 0) {
  //     gridRef.current.api.setValueColumns([]); // Очищаем значения колонок
  //   }
  // }, []);


  return (
    <div className={styles.wrapper}>

      <div className="ag-theme-alpine" style={{height: 500, width: '100%'}}>

        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          // defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          rowGroupPanelShow={"never"} // Всегда показывать панель группировки
          pivotMode={true} // Отключаем режим сводной таблицы
          sideBar={"columns"}
          onGridReady={onGridReady}
          localeText={localeText}

          // onFirstDataRendered={onFirstDataRendered}
          // suppressMovableColumns={true}    // Отключаем возможность перемещения колонок
          // suppressDragLeaveHidesColumns={true} // Отключаем скрытие колонок при перетаскивании
          // suppressAggFuncInHeader={true}   // Скрываем функцию агрегации в заголовках
          animateRows={true}               // Включаем анимацию строк
          pivotDefaultExpanded={1}
          // suppressAggAtRootLevel={true} // Добавляем suppressAggAtRootLevel
        />
      </div>
      <Button onClick={handlePatch} style={{
        marginTop: 550
      }}>Сохранить</Button>
    </div>
  );
};
