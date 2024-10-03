import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export const PivotTableAgGrid = () => {
  // Исходные данные
  const rowData = [
    { region: 'North', product: 'Laptop', sales: 1500, quantity: 5, date: '2024-01-10' },
    { region: 'North', product: 'Phone', sales: 800, quantity: 2, date: '2024-01-15' },
    { region: 'South', product: 'Laptop', sales: 2000, quantity: 6, date: '2024-02-10' },
    { region: 'South', product: 'Phone', sales: 1000, quantity: 3, date: '2024-02-12' },
    { region: 'East', product: 'Laptop', sales: 1800, quantity: 4, date: '2024-03-05' },
    { region: 'East', product: 'Phone', sales: 950, quantity: 2, date: '2024-03-07' },
  ];

  // Настройки колонок
  const [columnDefs] = useState([
    { field: 'region', headerName: 'Region', rowGroup: true }, // Показываем регион
    { field: 'product', headerName: 'Product', rowGroup: true }, // Показываем продукт
    { field: 'date', headerName: 'Date' },
    { field: 'sales', headerName: 'Sales', aggFunc: 'sum' },
    { field: 'quantity', headerName: 'Quantity', aggFunc: 'sum' }
  ]);

  // Опции таблицы
  const gridOptions = {
    pivotMode: false, // Выключаем режим сводной таблицы, если не нужен
    groupDefaultExpanded: -1, // Разворачиваем все группы по умолчанию
    animateRows: true,
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        groupDisplayType="groupRows" // Указываем способ отображения групп
        defaultColDef={{ sortable: true, filter: true }}
        autoGroupColumnDef={{
          headerName: 'Group',
          field: 'product',
          cellRendererParams: { suppressCount: true }, // Отключаем подсчет строк
        }}
        gridOptions={gridOptions}
      />
    </div>
  );
};
