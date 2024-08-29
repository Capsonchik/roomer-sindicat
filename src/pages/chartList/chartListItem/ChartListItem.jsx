import styles from './chartListItem.module.scss';
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
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
import {convertValuesByPercent} from "../chart/convertValuesByPercent";


export const ChartListItem = ({chart}) => {
  const dispatch = useDispatch();
  const methods = useForm()
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [chartState, setChartState] = useState(chart)



  useEffect(() => {
    const myChart = echarts.init(chartRef.current);
    setChartInstance(myChart);


    return () => {
      myChart.dispose();
    };
  }, []);


  useLayoutEffect(() => {
    let format_value = chart.formatting.format_value || 1
    const filteredSeries = !!chart.formatting?.visible?.length
      ? Object.fromEntries(Object.entries(chart.seriesData).filter(([series, value]) => {
        return chart.formatting.visible.includes(series);
      }))
      : chart.seriesData

    // console.log(chart)


    const convertedSeriesData = convertValuesByPercent({
      visibleListString: Object.keys(filteredSeries),
      chart,
      filteredSeriesData: filteredSeries,
      format_value
    })


    const filteredColors = !!chart?.formatting?.colors
      ? chart.formatting.colors.filter(([series, value]) => value).map(([series, value]) => series)
      : colors

    // console.log(format_value)
    setChartState(prev => {
      return {
        ...prev,
        seriesData: convertedSeriesData,
        formatting: {
          ...prev.formatting,
          colors: filteredColors,
          // format_value,
        }

      }
    })
  }, []);

  // console.log(chart)


  useEffect(() => {
    if (!chartInstance) return;

    const seriesOptions = Object.keys(chartState.seriesData).map((seriesName) => ({
      name: seriesName,
      type: chartState.formatting.type_chart,
      data: chartState.seriesData[seriesName],
      stack: chartState.formatting.stack ? 'total' : null
    }));
    // console.log(seriesOptions)


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
      // series: {
      //   type: "bar",
      //   radius: '50%',
      //   data: seriesOptions,
      //   // emphasis: {
      //   //   itemStyle: {
      //   //     shadowBlur: 10,
      //   //     shadowOffsetX: 0,
      //   //     shadowColor: 'rgba(0, 0, 0, 0.5)'
      //   //   }
      //   // }
      // },
      // column_width: chartState.formatting.column_width,
      // column_gap: chartState.formatting.column_gap,
      series: seriesOptions,
      barCategoryGap: `${50 - chartState.formatting.column_width} %`,
      barGap: `${chartState.formatting.column_gap} %`,
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
        <h5>{chart.title}</h5>
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