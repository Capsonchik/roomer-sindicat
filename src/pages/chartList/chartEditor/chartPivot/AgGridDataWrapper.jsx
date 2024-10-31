import {useEffect, useRef, useState} from "react";
import {ChartPivot} from "./ChartPivot";


export const AgGridDataWrapper = ({chart,colors}) => {
  const [columnsDef, setColumnsDef] = useState([])
  const [availableColumns, setAvailableColumns] = useState({
    availableValues: [],
    availableColumnsXY: []
  })

  const generateColumnDefs = (rowData, min, max) => {

    const columnDefs = [];
    const allKeys = Array.from(new Set(rowData.flatMap(Object.keys)));

    allKeys.forEach(key => {
      let maxGroupingLevel = 0;
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
          if (params.rowNode.level === params.api.getState()?.rowGroup?.groupColIds?.length - 1) {
            const filteredValues = params.values.filter(Boolean);
            const firstValue = filteredValues[0];

            // Проверяем, является ли первое значение числом
            if (typeof firstValue === 'number') {
              return filteredValues.length > 1
                ? `~${chart?.ispercent ? `${(firstValue * 100)?.toFixed(1)}%` : firstValue.toFixed(1)}`
                : `${chart.ispercent ? `${(firstValue * 100)?.toFixed(1)}%` : firstValue.toFixed(3)}`;
            } else {
              console.warn('Первое значение не является числом:', firstValue);
              return null; // Или другое значение по умолчанию
            }
          }
          return null;
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
          const logValue = Math.log(params.value.toString().replace('~', '').replace('%', '') > 0 ? params.value.toString().replace('~', '').replace('%', "") : 1e-10); // Логарифм от значения
          const logMin = Math.log(minValue);
          const logMax = Math.log(maxValue);
          const value = (logValue - logMin) / (logMax - logMin); // Нормализация в диапазон [0, 1]


          function lightenColor(rgb, percent) {
            return rgb.map((channel) => {
              const value = Math.min(255, Math.round(channel + (255 - channel) * (percent / 100)));
              return value;
            });
          }

// Определяем цвета (в формате RGB)
          const darkColor = colors.darkShade; // #f7635c
          const lightColor = colors.lightShade; // #fff2f2

// Сильно осветляем цвета
          const lightenedDarkColor = lightenColor(darkColor, 40); // на 40%
          const lightenedLightColor = lightenColor(lightColor, 99); // на 98%

// Интерполируем между светлым и темным цветом
          const interpolatedColor = lightenedLightColor.map((c, i) =>
            Math.round(c + (lightenedDarkColor[i] - c) * value)
          );

          return {
            fontSize: 14,
            backgroundColor: `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`, // от темного к светлому
            color: value < 0.5 ? 'black' : 'white', // Контраст текста
          };

        }

      });

    });

    // setVisibleValues(visibleValues)
    return {columnDefs};
  };

  // const [test, setTest] = useState([])

  useEffect(() => {
    if (chart.formatting.type_chart !== 'pivot') return
    const test = []
    if (chart?.['0']?.table_data.length > 0) {
      chart?.['0']?.table_data.forEach(item => {


        chart.formatting?.values?.forEach((value) => {
          test.push(item[value])
        })
      })
    }
    // console.log(test)
    // Установка значений min и max в зависимости от наличия элементов в test
    const min = test.length > 0 ? Math.min(...test) : null;
    const max = test.length > 0 ? Math.max(...test) : null;
    console.log('minmax',min,max,test)

    const availableValues = []
    const availableColumnsXY = []
    for (const  [key,value] of Object.entries(chart?.['0']?.table_data[0])) {
      if(typeof value !== 'string' && !chart?.formatting?.values?.includes(key)) {
        availableValues.push(key)
      }
      if(typeof value === 'string' && !chart?.formatting?.rowGroups?.includes(key) && !chart?.formatting?.colGroups?.includes(key)) {
        availableColumnsXY.push(key)
      }
      // console.log(key,value)
    }
    setAvailableColumns({
      availableValues,
      availableColumnsXY
    })



    const {columnDefs} = generateColumnDefs(chart?.['0']?.table_data ?? [], min, max);
    // console.log(columnDefs)
    // console.log(2222222222)
    setColumnsDef(columnDefs)
  }, [chart])

  return  !!columnsDef.length ? <ChartPivot colors={colors}  chart={chart} columnsDef={columnsDef} availableColumns={availableColumns}/> : null

}