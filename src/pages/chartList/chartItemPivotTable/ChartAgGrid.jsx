import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { localeText } from "./agGridLocale";
import {agGridData} from "./agGridData";

const generateProductColumns = (products) => {
  return Object.keys(products).map(productKey => ({
    headerName: `Продукт ${productKey}`,
    children: Object.keys(products[productKey]).map(quarter => ({
      headerName: quarter.toUpperCase(),
      field: `products.${productKey}.${quarter}`, // доступ к значениям через вложенные поля
    })),
  }));
};

// Пример для одного набора данных
const columnDefs = [
  { headerName: "Категория", field: "category" },
  { headerName: "Подкатегория", field: "subcategory" },
  ...generateProductColumns(agGridData[0].products), // создаем динамически для всех продуктов
];

// Пример данных
export const ChartAgGrid = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={agGridData} // Данные для строк
        columnDefs={columnDefs} // Определение столбцов
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true, // Возможность изменять размер столбцов
        }}
        autoGroupColumnDef={{
          headerName: "Категория", // Название столбца для группировки
          field: "subcategory", // Поле для отображения подкатегории
        }}
        groupDisplayType="groupRows" // Включаем группировку по строкам
        localeText={localeText} // Устанавливаем русскую локализацию
        onGridReady={onGridReady} // Коллбек при готовности сетки
      />
    </div>
  );
};

