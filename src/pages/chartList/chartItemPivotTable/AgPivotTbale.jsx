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

  // const autoGroupColumnDef = useMemo(() => ({
  //   headerName: "Группы",
  //   minWidth: 200,
  //   cellRenderer: 'agGroupCellRenderer',
  //   pinned: "left",
  //   // cellRendererParams: {
  //   //   innerRenderer: (params) => {
  //   //     if (params.node.allLeafChildren.length > 0) {
  //   //       return  null
  //   //       // У группы есть дети, можно отобразить количество детей или их сумму
  //   //       const totalChildren = params.node.allLeafChildren.length;
  //   //       const aggregatedValue = params.node.allLeafChildren.reduce((sum, child) => sum + (child.data?.[params.colDef.field] || 0), 0);
  //   //       return `${params.value} (Количество детей: ${totalChildren}, Сумма: ${aggregatedValue})`;
  //   //     } else {
  //   //       // У группы нет детей, отображаем стандартное значение
  //   //       return params.value;
  //   //     }
  //   //   }
  //   // }
  // }), []);


  return (
    <div className={styles.wrapper}>
      <div className={styles.title_wrapper}>
        <h5 className={styles.title}>{chart.title}</h5>
        {/*<Button onClick={() => {*/}
        {/*  // console.log(gridRef.current.api);*/}
        {/*  // gridRef.current.api.exportDataAsExcel()*/}
        {/*}}>Экспорт excel</Button>*/}
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
          // autoGroupColumnDef={autoGroupColumnDef}
          rowGroupPanelShow={"never"} // Всегда показывать панель группировки
          pivotMode={true} // Отключаем режим сводной таблицы
          sideBar={'never'}
          groupDisplayType={'multipleColumns'}
          // groupHideOpenParents={true}
          // groupDefaultExpanded={-1} // Expand all row groups by default
          // defaultExcelExportParams={{fileName:'demo_export_not_correct'}}
          onGridReady={onGridReady}
          localeText={localeText}
          suppressMovableColumns={false}    // Отключаем возможность перемещения колонок
          suppressDragLeaveHidesColumns={false} // Отключаем скрытие колонок при перетаскивании
          suppressAggFuncInHeader={true}   // Скрываем функцию агрегации в заголовках
          // animateRows={true}               // Включаем анимацию строк
          pivotDefaultExpanded={1}
          suppressContextMenu={user.role === 'viewer'}
          headerHeight={30}
          rowHeight={20} // Уменьшаем высоту строки до 25px
          tooltipShowDelay={200} // Задержка перед показом тултипа
          tooltipHideDelay={4000} // Время до скрытия тултипа (например, 3 секунды)
          enableBrowserTooltips={false} // Отключаем нативные браузерные тултипы
          tooltipComponentParams={{ textAlign: 'center' }}

        />
      </div>
    </div>
  );
};
