import styles from './chartListItem.module.scss';
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import {chartOption} from "../../editorChart/chartConfig";
// import {colors, legendConfig, tooltipConfig} from "./config";
import EditIcon from "@rsuite/icons/Edit";
import {Button, Divider} from "rsuite";
import {ChartDrawer} from "../chartDrawer/ChartDrawer";
import {FormProvider, useForm} from "react-hook-form";
import {ChartFilters} from "../chartFilters/ChartFIlters";
import {
  setActiveChart,
  setOpenDrawer,
  setOriginalColors,
  setTypeGroupDrawer
} from "../../../store/chartSlice/chart.slice";
import {useDispatch, useSelector} from "react-redux";
import {selectIsOpenDrawer, selectOriginalColors} from "../../../store/chartSlice/chart.selectors";
import {patchChartFormatting} from "../../../store/chartSlice/chart.actions";
import {colors, legendConfig, tooltipConfig} from "../chart/config";
import {convertValuesByPercent} from "../chart/convertValuesByPercent";
import {getSumValues} from "../getSumValues";
import {calculateMaxValue} from "../calculateMaxValue";
import {calculateStepSize} from "../calculateStepSize";


export const ChartListItem = ({chart}) => {
  const dispatch = useDispatch();
  const methods = useForm()
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [chartState, setChartState] = useState(chart)


  useEffect(() => {
    if (!chartRef.current) return; // Проверка на существование DOM-элемента

    const myChart = echarts.init(chartRef.current);
    setChartInstance(myChart);

    return () => {
      if (myChart) {
        myChart.dispose(); // Очищаем график при размонтировании
      }
    };
  }, []);

  useEffect(() => {
    if (!chartInstance || !chartRef.current) return; // Проверка на существование экземпляра графика и DOM-элемента

    const handleResize = () => {
      if (chartInstance) {
        chartInstance.resize(); // Изменение размеров графика при изменении размеров окна
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect(); // Отключаем наблюдателя при размонтировании
    };
  }, [chartInstance]);


  useLayoutEffect(() => {
    let format_value = chartState?.formatting?.format_value ?? 1
    let filteredSeries = chartState.seriesData
    // for (const formatValueElement of filteredSeries) {
    //   console.log(formatValueElement)
    // }
    filteredSeries = Object.fromEntries(Object.entries(chart.seriesData).map(([key, value]) => {
      // console.log(value,format_value)
      return [key, value.map(item => (+item).toFixed(format_value))];
    }))
    // console.log()

    const filteredColors = !!chart?.formatting?.colors
      ? chart.formatting.colors.filter(([series, value]) => value).map(([series, value]) => series)
      : colors

    setChartState(prev => {
      return {
        ...prev,
        seriesData: filteredSeries,
        formatting: {
          ...prev.formatting,
          colors: colors,
          // stepValue: step,
          // maxValue: maxValue,
          // format_value,
        }

      }
    })
  }, []);

  // console.log(chart)


  useEffect(() => {
    if (!chartInstance) return;

    const seriesOptions = Object.keys(chartState.seriesData).map((seriesName, index) => {


      return {
        name: seriesName,
        type: chartState.formatting.type_chart,
        data: chartState.seriesData[seriesName],
        stack: chartState.formatting.stack ? 'total' : null
      }
    });

    const maxValue = getSumValues({
      stack: chartState.formatting.stack,
      seriesData: chartState.seriesData,
      // seriesIndex: 0,
      ispercent: chartState.ispercent
    })
    // console.log(maxValue)

    const calculatedMaxValue = calculateMaxValue(0, maxValue, 6)
    const step = calculateStepSize(0, calculatedMaxValue, 6)


    const option = {
      ...tooltipConfig,
      ...legendConfig,
      color: chartState.formatting.colors,
      label: {
        show: true,
        position: chartState.formatting.label_position,
        verticalAlign: 'middle',
        fontSize: chartState.formatting.label_size
      },


      series: seriesOptions,
      barCategoryGap: `${50 - chartState.formatting.column_width} %`,
      barGap: `${chartState.formatting.column_gap} %`,
      xAxis: chartState.formatting.isXAxis
        ? {type: 'category', data: chartState.xAxisData,}
        : {
          type: 'value',
          max: chartState.ispercent ? 100 : calculatedMaxValue,
          interval: step
        }, // Toggle axis
      yAxis: chartState.formatting.isXAxis
        ? {
          type: 'value',
          data: chartState.xAxisData,
          max: chartState.ispercent ? 100 : calculatedMaxValue,
          interval: step
        }
        : {
          type: 'category',
          data: chartState.xAxisData
        },
    };

    chartInstance.setOption(option, {
      notMerge: true,
      lazyUpdate: false,
    });
  }, [chartInstance, chartState]);

  // console.log(Object.entries(chart.seriesData)[0][1].length)
  if (chart.xAxisData.length !== Object.entries(chart.seriesData)[0][1].length) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.title_wrapper}>
          <h5>{chart.title}</h5>

        </div>
        <div className={styles.empty_chart}>
          <Divider>По данным фильтрам нет данных</Divider>
        </div>
      </div>
    )
  }


  return (
    <div className={styles.wrapper}>
      <div className={styles.title_wrapper}>
        <h5>{chart.title}</h5>
        <Button
          className={styles.btn}
          onClick={() => {

            dispatch(setActiveChart(chart))
            dispatch(setOpenDrawer(true))
          }}>
          <EditIcon/>
        </Button>
      </div>
      {/*<p>{chart.description}</p>*/}
      <div className={styles.chart} ref={chartRef} style={{width: '100%', minHeight: '100px', paddingBottom: 30}}></div>

    </div>
  );
};