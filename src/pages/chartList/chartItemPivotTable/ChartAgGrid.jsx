import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import React, { useCallback, useMemo, useState } from 'react';
import { localeText } from "./agGridLocale";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";
import { agGridData } from "./agGridData";

// Регистрация модулей
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MenuModule,
  RowGroupingModule,
  FiltersToolPanelModule,
]);

// Функция для динамической генерации columnDefs
const generateColumnDefs = (rowData) => {
  const columns = [];

  if (rowData.length === 0) return columns; // Если данные пустые, возвращаем пустой массив

  const allKeys = Array.from(new Set(rowData.flatMap(Object.keys)));

  const group1 = [];
  const group2 = [];

  allKeys.forEach(key => {
    const column = {
      field: key,
      headerName: key,
      enableRowGroup: true, // Включаем возможность группировки
      filter: true, // Фильтрация
      resizable: true, // Изменение размера
      sortable: true, // Сортировка
      enableValue: true, // Включаем возможность использовать поле как value
      aggFunc: 'sum', // Пример агрегации
      valueGetter: (params) => params.data?.[key], // Получаем значение
    };

    // Разделяем колонки на две группы для примера
    if (key.startsWith('category')) {
      group1.push(column);
    } else {
      group2.push(column);
    }
  });

  // Создаем два уровня заголовков
  columns.push({
    headerName: 'Category Group',
    children: group1, // Первый подуровень заголовка
  });

  columns.push({
    headerName: 'Other Group',
    children: group2, // Второй подуровень заголовка
  });

  return columns;
};

// Компонент для создания таблицы с многоуровневыми заголовками
export const ChartAgGridWithoutPivot = () => {
  const [rowData, setRowData] = useState(agGridData);

  // Автоматическое подгонка размеров колонок
  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  // Настройки по умолчанию для колонок
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    enableRowGroup: true, // Включаем возможность группировки колонок
  }), []);

  // Настройки для авто-группировки колонок
  const autoGroupColumnDef = useMemo(() => ({
    minWidth: 200,
    pinned: "left",
  }), []);

  // Динамическая генерация columnDefs
  const columnDefs = useMemo(() => generateColumnDefs(rowData), [rowData]);

  return (
    <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        sideBar={{
          toolPanels: ['columns'],
          defaultToolPanel: 'columns', // По умолчанию показывать панель с колонками
        }} // Панель с колонками для перемещения
        onGridReady={onGridReady}
        localeText={localeText}
      />
    </div>
  );
};
