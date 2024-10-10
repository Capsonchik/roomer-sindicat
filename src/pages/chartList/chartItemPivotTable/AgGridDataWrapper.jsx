import {useEffect, useState} from "react";
import {ChartAgGridPivot} from "./AgPivotTbale";


export const AgGridDataWrapper = ({chart}) => {
  const [columnsDef, setColumnsDef] = useState([])
  const generateColumnDefs = (rowData, min, max) => {

    // console.log(min,max)
    const columnDefs = [];

    // console.log(111)
    // if (rowData.length === 0) return columnDefs; // Если данные пустые, возвращаем пустой массив


    const allKeys = Array.from(new Set(rowData.flatMap(Object.keys)));

    // console.log(allKeys)
    allKeys.forEach(key => {
      // params.values.length > 1 ? null : params.values[0]
      columnDefs.push({
        field: key,
        tooltipValueGetter: (params) => params.value ? params.value.toString() : '',
        width: 130, // Фиксированная ширина для каждой колонки
        tooltipField: key, // Указываем поле для тултипа
        headerName: key,
        enableValue: true,
        enableRowGroup: true, // Включаем группировку для category и subcategory
        enablePivot: true, // Отключаем возможность использования в сводной таблице для productName и period
        aggFunc: (params) => {
          // params.api.expandAll(); // Раскрываем все группы
          // console.log(111)
          // params?.values?.[0] &&  !Number.isNaN(+(params?.values?.[0])) && visibleValues.push(params.values[0])
          return params.values.length > 1 ? null : params.values[0];
        },
        cellStyle: (params) => {
          if (params.value == null) return {}; // если значение отсутствует, не применяем стиль

          // Проверяем, что значения min и max корректны
          const minValue = min > 0 ? min : 1e-10; // Используем маленькое положительное значение вместо 0
          const maxValue = max > 0 ? max : 1e-10;

          // Если значения равны (очень редкий случай), просто возвращаем базовый цвет
          if (minValue === maxValue) {
            return {
              backgroundColor: `rgb(255, 248, 248)`, // нейтральный светлый цвет
              color: 'black'
            };
          }

          // Нормализуем значение для диапазона [0, 1] с логарифмом для учета малых значений
          const logValue = Math.log(params.value > 0 ? params.value : 1e-10); // Логарифм от значения
          const logMin = Math.log(minValue);
          const logMax = Math.log(maxValue);
          const value = (logValue - logMin) / (logMax - logMin); // Нормализация в диапазон [0, 1]

          // Определяем цвета (в формате RGB)
          const darkColor = [250, 134, 130]; // #f7635c
          const lightColor = [255, 248, 248]; // #fff2f2

          // Интерполируем между светлым и темным цветом
          const interpolatedColor = lightColor.map((c, i) => Math.round(c + (darkColor[i] - c) * value));

          return {
            fontSize:20,
            backgroundColor: `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`, // от темного к светлому
            color: value < 0.5 ? 'black' : 'white', // Контраст текста
          };
        }

      });

    });

    // setVisibleValues(visibleValues)
    return {columnDefs};
  };

  useEffect(() => {
    if (chart.formatting.type_chart !== 'pivot') return
    const test = []
    if (chart?.['0']?.table_data.length > 0) {
      chart?.['0']?.table_data.forEach(item => {

        chart?.formatting?.values?.forEach((value) => {
          test.push(item[value])
        })
      })
    }
    console.log(test)
    const min = Math.min(...test)
    const max = Math.max(...test)

    const {columnDefs} = generateColumnDefs(chart?.['0']?.table_data ?? [], min, max);
    // console.log(columnDefs)
    setColumnsDef(columnDefs)
  }, [chart])

  return  !!columnsDef.length ? <ChartAgGridPivot chart={chart} columnsDef={columnsDef}/> : null

}