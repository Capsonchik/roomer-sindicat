import { data } from "./newData.js";

let count = 0;
let isInitial = true;
let currentYearFlag = false;
// Get the current date
const currentDate = new Date();
// Get the current year
const currentYear = currentDate.getFullYear();
// Get the current month (0-indexed, so January is 0 and December is 11)
const currentMonth = currentDate.getMonth();
// Calculate the current quarter
const currentQuarter = Math.floor(currentMonth / 3) + 1;

let pivotObj;
function headerCellInfo(args) {
  // Get the current Year and Quarter column count here.
  let currentYearWithQuarter = `Q${currentQuarter}-FY ${currentYear}`;
  if (pivotObj && !currentYearFlag && args.node.innerText !== "") {
    count++;
    if (args.node.innerText == currentYearWithQuarter) {
      currentYearFlag = true;
    }
  }
}

// Set the scrollLeft to the Piovt table at initial rendering.
function dataBound() {
  if (
    pivotObj &&
    pivotObj.element.querySelector(".e-content") &&
    isInitial &&
    pivotObj.element.offsetHeight > 200
  ) {
    isInitial = false;
    var scrollBar = pivotObj.element.querySelector(".e-content");
    // Get the width of the table where the current year with quarter column header is rendered by multiplying the column width with the current date column header position.
    // "count" mentions the current year with quarter column header position and subtract the row header column(1) then multiply with the number of values bind in the pivot table.
    var width =
      pivotObj.gridSettings.columnWidth *
      ((count - 1) * pivotObj.dataSourceSettings.values.length);
    scrollBar.scrollLeft = width;
  }
}

// Преобразуем процентные данные в числа (например, 23% -> 0.23)
const modifiedpivotData = data.map((item) => {
  return {
    ...item,
    q1: parseFloat(item.q1) / 100,
    q2: parseFloat(item.q2) / 100,
    q3: parseFloat(item.q3) / 100,
    QuarterYearColumn: `${item.product}`,
  };
});

// Обновляем настройки источника данных
const dataSourceSettings = {
  columns: [{ name: "QuarterYearColumn" }],
  values: [
    { name: "q1", caption: "2023", cssClass: "custom-header-style" },
    { name: "q2", caption: "2024" },
    { name: "q3", caption: "2025" },
  ],
  dataSource: modifiedpivotData,
  rows: [{ name: "category" }, { name: "subcategory" }],
  enableSorting: true,
  sortSettings: [{ name: "QuarterYearColumn", order: "ascending" }],
  formatSettings: [
    { name: "q1", format: "P2" },  // Процентный формат для q1
    { name: "q2", format: "P2" },  // Процентный формат для q2
    { name: "q3", format: "P2" },  // Процентный формат для q3
  ],
  filters: [],
  expandAll: true,
  showGrandTotals: false,
  showRowSubTotals: false,
  emptyCellsTextContent: "N/A",
};

export const pivotTableParams = {
  ref: (scope) => {
    pivotObj = scope;
  },
  width: "100%",
  height: "290",
  dataBound: dataBound,
  dataSourceSettings: dataSourceSettings,
  gridSettings: {
    columnWidth: 140,
    allowReordering: true,
    headerCellInfo: headerCellInfo,
  },
};
