import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, GridReadyEvent, ModuleRegistry } from '@ag-grid-community/core';
import { AgGridReact, CustomCellRendererProps } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import React, { useCallback, useMemo, useState } from 'react';
import { localeText } from "./agGridLocale";
import { agGridData } from "./agGridData";

ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);

// Функция для динамической генерации колонок продуктов
const generateProductColumns = (products) => {
  return Object.keys(products).map(productKey => ({
    headerName: `Продукт ${productKey}`,
    children: Object.keys(products[productKey]).map(quarter => ({
      headerName: quarter.toUpperCase(),
      field: `products.${productKey}.${quarter}`, // доступ к значениям через вложенные поля
    })),
  }));
};

// Генерация колонок
const columnDefs = [
  { field: "category", rowGroup: true, hide: true }, // поле для группировки (скрытое)
  { field: "subcategory" ,headerName:'Категории'}, // отображаем поле подкатегории
  ...generateProductColumns(agGridData[0].products), // Динамически создаем колонки для продуктов
];

export const ChartAgGrid = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={agGridData} // Данные для строк
        columnDefs={columnDefs} // Определение колонок
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true, // Возможность изменять размер столбцов
        }}
        autoGroupColumnDef={{
          headerName: "Категория", // Название группирующего столбца
          field: "subcategory",    // Поле для подкатегории
        }}
        groupDisplayType="groupRows" // Включаем группировку по строкам
        localeText={localeText}      // Устанавливаем русскую локализацию
        onGridReady={onGridReady}    // Коллбек при готовности сетки
      />
    </div>
  );
};
