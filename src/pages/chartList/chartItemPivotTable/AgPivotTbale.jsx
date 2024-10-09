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
import {ExelIcon} from "../chartItemTable/icons/ExelIcon";
import {setActiveChart, setOpenDrawer} from "../../../store/chartSlice/chart.slice";
import EditIcon from "@rsuite/icons/Edit";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser} from "../../../store/userSlice/user.selectors";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MenuModule,
  RowGroupingModule,
  FiltersToolPanelModule,
]);


export const ChartAgGridPivot = ({chart,columnsDef}) => {
  const user = useSelector(selectCurrentUser)
  const gridRef = useRef(null);
  const dispatch = useDispatch()
  const [rowData, setRowData] = useState(chart?.['0']?.table_data ?? []);

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();


    if (chart.formatting.rowGroups) {
      gridRef.current.api.setRowGroupColumns(chart.formatting.rowGroups);
    }
    if (chart.formatting.colGroups) {
      gridRef.current.api.setPivotColumns(chart.formatting.colGroups);
    }
    if (chart.formatting.values) {
      gridRef.current.api.setValueColumns(chart.formatting.values);
    }

    setTimeout(() => {

    }, 50)

    params.api.expandAll(); // Раскрываем все группы
  }

  const autoGroupColumnDef = useMemo(() => ({
    headerName: "Группы",
    minWidth: 200,
    cellRenderer: 'agGroupCellRenderer',
    pinned: "left",
  }), []);


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
          columnDefs={columnsDef}
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
          rowHeight={34} // Уменьшаем высоту строки до 25px
          tooltipShowDelay={200} // Задержка перед показом тултипа
          tooltipHideDelay={4000} // Время до скрытия тултипа (например, 3 секунды)
          enableBrowserTooltips={false} // Отключаем нативные браузерные тултипы
          tooltipComponentParams={{ textAlign: 'center' }}

        />
      </div>
    </div>
  );
};
