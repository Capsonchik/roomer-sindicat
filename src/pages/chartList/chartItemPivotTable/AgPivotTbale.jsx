import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { localeText } from "./agGridLocale";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";
import { agGridData } from "./agGridData";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MenuModule,
  RowGroupingModule,
  FiltersToolPanelModule,
]);
const generateColumnDefs = (rowData) => {
  const columns = [];

  if (rowData.length === 0) return columns; // Если данные пустые, возвращаем пустой массив

  const allKeys = Array.from(new Set(rowData.flatMap(Object.keys)));
  console.log(allKeys)
  allKeys.forEach(key => {
    if (key === 'value') {
      columns.push({
        field: key,
        headerName: key,
        enableValue: true,
        aggFunc: (params) => {
          console.log(params)
          return params.values.length > 1 ? null : params.values[0];
        }, // Отключаем агрегацию для колонки "value"

      });
    } else {
      columns.push({
        field: key,
        headerName: key,
        enableRowGroup: true, // Включаем группировку
        enablePivot: true,    // Включаем возможность использования в сводной таблице
        enableValue: false,   // Отключаем использование для агрегации

      });
    }
  });

  return columns;
};




export const ChartAgGridPivot = () => {
  const [rowData, setRowData] = useState(agGridData);

  useEffect(() => {
    console.log(autoGroupColumnDef)
  }, [rowData]);

  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    enableValue: false,
    enableRowGroup: true,
    enablePivot: false, // Отключаем агрегацию по умолчанию
    aggFunc: null,


  }), []);

  const autoGroupColumnDef = useMemo(() => ({
    headerName: "Группы",
    minWidth: 200,
    cellRenderer: 'agGroupCellRenderer',
    pinned: "left",
  }), []);

  const columnDefs = useMemo(() => generateColumnDefs(rowData), [rowData]);

  return (
    <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        rowGroupPanelShow={"always"} // Всегда показывать панель группировки
        pivotMode={false} // Отключаем режим сводной таблицы
        sideBar={"columns"}
        onGridReady={onGridReady}
        localeText={localeText}
      />
    </div>
  );
};
