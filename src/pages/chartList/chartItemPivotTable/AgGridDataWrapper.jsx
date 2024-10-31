import {useEffect, useState} from "react";
import {ChartAgGridPivot} from "./AgPivotTbale";
import {generateColors} from "../../../lib/generateColors";
import {colors as colorsConsts} from "../chart/config";
import {useSelector} from "react-redux";
import {selectActiveClient, selectClients} from "../../../store/chartSlice/chart.selectors";


export const AgGridDataWrapper = ({chart, colors}) => {
  const [columnsDef, setColumnsDef] = useState([])
  // const [colors, setColors] = useState(colorsConsts)
  const activeClient = useSelector(selectActiveClient)
  const clients = useSelector(selectClients)

  // useEffect(() => {
  //   const client = clients.find(clnt => clnt.client_id === activeClient)
  //   if (client?.chart_colors && client?.chart_colors?.colors) {
  //     // const test = ['#1675e0', '#fa8900']
  //     // const gradientColors = generateColors(client?.chart_colors?.colors, Object.keys(chart.seriesData).length)
  //     // // console.log(chart.seriesData)
  //     setColors(client?.chart_colors?.colors?.[0])
  //   }
  // },[])

  const generateColumnDefs = (rowData, min, max, selectedRows) => {

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
        enablePivot: false, // Отключаем возможность использования в сводной таблице для productName и period
        // valueFormatter: (p) => {
        //   console.log(p)
        //   return p.value;
        // },
        // aggFunc: null,
        // Логика для получения точного значения на последнем уровне группировки
        aggFunc: (params) => {
          if (params.rowNode.level === params.api.getState()?.rowGroup?.groupColIds?.length - 1) {
            const filteredValues = params.values.filter(Boolean);
            const firstValue = filteredValues[0];

            // Проверяем, является ли первое значение числом
            if (typeof firstValue === 'number') {
              return filteredValues.length > 1
                ? `~${chart?.ispercent ? (firstValue * 100)?.toFixed(1) : firstValue.toFixed(1)}%`
                : `${chart.ispercent ? (firstValue * 100)?.toFixed(1) : firstValue.toFixed(1)}%`;
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
          const lightenedLightColor = lightenColor(lightColor, 98); // на 98%

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
    // console.log(chart.formatting.values)
    const min = Math.min(...test)
    const max = Math.max(...test)
    const selectedRows = chart.formatting.rows

    const {columnDefs} = generateColumnDefs(chart?.['0']?.table_data ?? [], min, max, selectedRows);
    // console.log(columnDefs)
    setColumnsDef(columnDefs)
  }, [chart])

  return !!columnsDef.length ? <ChartAgGridPivot chart={chart} columnsDef={columnsDef}/> : null

}