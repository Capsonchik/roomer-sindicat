import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';
import {ModuleRegistry} from '@ag-grid-community/core';
import {AgGridReact} from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {localeText} from "./agGridLocale";
import {ColumnsToolPanelModule} from "@ag-grid-enterprise/column-tool-panel";
import {MenuModule} from "@ag-grid-enterprise/menu";
import {RowGroupingModule} from "@ag-grid-enterprise/row-grouping";
import {FiltersToolPanelModule} from "@ag-grid-enterprise/filter-tool-panel";
import {agGridData} from "./agGridData";
import styles from './agGrid.module.scss'
import {Button} from "rsuite";
import {ExelIcon} from "../chartItemTable/icons/ExelIcon";
import {setActiveChart, setOpenDrawer} from "../../../store/chartSlice/chart.slice";
import EditIcon from "@rsuite/icons/Edit";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../../../store/main.selectors";
import {selectCurrentUser} from "../../../store/userSlice/user.selectors";

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

export const ChartAgGridPivot = ({chart}) => {
  const pivotData = chart?.['0']?.table_data ?? []
  console.log(pivotData)
  const user = useSelector(selectCurrentUser)
  const gridRef = useRef(null);
  const dispatch = useDispatch()
  const [rowData, setRowData] = useState(pivotData);
  const [minMax, setMinMax] = useState({minValue: 0, maxValue: 0});

  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
    // console.log(params)
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


    if (chart.formatting.rowGroups) {
      gridRef.current.api.setRowGroupColumns(chart.formatting.rowGroups);
    }
    if (chart.formatting.colGroups) {
      gridRef.current.api.setPivotColumns(chart.formatting.colGroups);
    }

    setTimeout(() => {
      if (chart.formatting.values) {
        gridRef.current.api.setValueColumns(chart.formatting.values);
      }

    },50)

    params.api.expandAll(); // Раскрываем все группы
  }, [rowData]);


  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true, // Отключаем агрегацию по умолчанию
    aggFunc: null,
  }), []);

  const autoGroupColumnDef = useMemo(() => ({
    headerName: "Группы",
    minWidth: 200,
    cellRenderer: 'agGroupCellRenderer',
    pinned: "left",
  }), []);

  const columnDefs = useMemo(() => generateColumnDefs(rowData, minMax.minValue, minMax.maxValue), [rowData, minMax]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title_wrapper}>
        <h5 className={styles.title}>{chart.title}</h5>
        <Button onClick={() => {
          dispatch(setActiveChart(chart))
          dispatch(setOpenDrawer(true))
        }}>
          <EditIcon/>
        </Button>

      </div>
      <div className="ag-theme-alpine" style={{height: '100%', width: '100%'}}>

        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          rowGroupPanelShow={"never"} // Всегда показывать панель группировки
          pivotMode={true} // Отключаем режим сводной таблицы
          sideBar={"none"}
          onGridReady={onGridReady}
          localeText={localeText}
          // suppressMovableColumns={true}    // Отключаем возможность перемещения колонок
          suppressDragLeaveHidesColumns={true} // Отключаем скрытие колонок при перетаскивании
          suppressAggFuncInHeader={true}   // Скрываем функцию агрегации в заголовках
          animateRows={true}               // Включаем анимацию строк
          pivotDefaultExpanded={1}
          suppressContextMenu={user.role === 'viewer'}
        />
      </div>
    </div>
  );
};
