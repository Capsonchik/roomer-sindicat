import styles from './chartListItem.module.scss';
import React, {useEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import {chartOption} from "../../editorChart/chartConfig";
// import {colors, legendConfig, tooltipConfig} from "./config";
import EditIcon from "@rsuite/icons/Edit";
import {Button} from "rsuite";
import {ChartDrawer} from "../chartDrawer/ChartDrawer";
import {FormProvider, useForm} from "react-hook-form";
import {ChartFilters} from "../chartFilters/ChartFIlters";
import {setActiveChart, setOpenDrawer, setOriginalColors} from "../../../store/chartSlice/chart.slice";
import {useDispatch, useSelector} from "react-redux";
import {selectIsOpenDrawer, selectOriginalColors} from "../../../store/chartSlice/chart.selectors";
import {patchChartFormatting} from "../../../store/chartSlice/chart.actions";
import {colors, legendConfig, tooltipConfig} from "../chart/config";


export const ChartListItem = ({chart}) => {
  const dispatch = useDispatch();
  const methods = useForm()
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [chartState, setChartState] = useState(chart)
  // const originalColors = useSelector(selectOriginalColors)
  // console.log(chart)
  const inputs = methods.watch()


  useEffect(() => {
    const myChart = echarts.init(chartRef.current);
    setChartInstance(myChart);


    // const colorsTest = chart?.formatting?.colors || colors
    // const colorEntrieis = colorsTest.map(color => [color, true])
    // dispatch(setOriginalColors(colorEntrieis))

    return () => {
      myChart.dispose();
    };
  }, []);
  // useEffect(() => {
  //   // if(!chart) return
  //   const colorsTest = chart?.formatting?.colors || colors.map(color => [color, true])
  //
  //   // console.log(colorEntrieis)
  //   if(!editor) return
  //   dispatch(setOriginalColors(colorsTest))
  // }, []);

  useEffect(() => {
    const filteredSeries = !!chart.formatting.visible.length
      ? Object.fromEntries(Object.entries(chart.seriesData).filter(([series, value]) => {
        return chart.formatting.visible.includes(series);
      }))
      : chart.seriesData

    const filteredColors = !!chart.formatting.colors
      ? chart.formatting.colors.filter(([series, value]) => value).map(([series, value]) => series)
      : colors

    setChartState(prev => {
      return {
        ...prev,
        seriesData: filteredSeries,
        formatting: {
          ...prev.formatting,
          colors: filteredColors
        }

      }
    })
  }, []);

  // console.log(chart)


  useEffect(() => {
    // console.log(chartState.formatting.colors)
    // dispatch(setActiveChart(chartState))
    if (!chartInstance) return;

    // const colors = !!chartState.formatting.visible.length
    // ?

    const seriesOptions = Object.keys(chartState.seriesData).map((seriesName) => ({
      name: seriesName,
      type: chartState.formatting.type_chart,
      data: chartState.seriesData[seriesName],
      stack: chartState.formatting.stack ? 'total' : null
    }));

    const option = {
      ...tooltipConfig,
      ...legendConfig,
      color: chartState.formatting.colors,
      series: seriesOptions,
      xAxis: chartState.formatting.isXAxis
        ? {type: 'category', data: chartState.xAxisData}
        : {type: 'value', max: chartState.ispercent ? 100 : null}, // Toggle axis
      yAxis: chartState.formatting.isXAxis
        ? {type: 'value', data: chartState.xAxisData, max: chartState.ispercent ? 100 : null}
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


  return (
    <div className={styles.wrapper}>
      <div className={styles.title_wrapper}>
        <h6>{chart.title}</h6>
        <Button onClick={() => {
          dispatch(setActiveChart(chart))
          dispatch(setOpenDrawer(true))
        }}>
          <EditIcon/>
        </Button>
      </div>
      <p>{chart.description}</p>
      <div ref={chartRef} style={{width: '100%', height: '400px'}}></div>


    </div>
  );
};