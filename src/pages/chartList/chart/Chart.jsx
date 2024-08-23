import styles from './chart.module.scss';
import React, {useEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import {chartOption} from "../../editorChart/chartConfig";
import {colors, legendConfig, tooltipConfig} from "./config";
import EditIcon from "@rsuite/icons/Edit";
import {Button} from "rsuite";
import {ChartDrawer} from "../chartDrawer/ChartDrawer";
import {FormProvider, useForm} from "react-hook-form";
import {ChartFilters} from "../chartFilters/ChartFIlters";
import {setActiveChart, setOpenDrawer, setOriginalColors} from "../../../store/chartSlice/chart.slice";
import {useDispatch, useSelector} from "react-redux";
import {
  selectActiveGroupId,
  selectGroupsReports,
  selectIsOpenDrawer,
  selectOriginalColors
} from "../../../store/chartSlice/chart.selectors";
import {
  fetchAllChartsByGroupId,
  fetchAllChartsFormatByGroupId,
  patchChartFormatting
} from "../../../store/chartSlice/chart.actions";
import {convertValuesByPercent} from "./convertValuesByPercent";


export const Chart = ({chart}) => {
  const dispatch = useDispatch();
  const methods = useForm()
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [chartState, setChartState] = useState(chart)
  const originalColors = useSelector(selectOriginalColors)
  const activeGroupId = useSelector(selectActiveGroupId)
  const groupsReports = useSelector(selectGroupsReports)
  // console.log(chart)
  const inputs = methods.watch()

  useEffect(() => {
    methods.reset({
      isXAxis: chart.formatting.isXAxis,
      stack: chart.formatting.stack
    })
  }, []);


  useEffect(() => {
    const myChart = echarts.init(chartRef.current);
    setChartInstance(myChart);
    const colorsTest = chart?.formatting?.colors || colors
    // console.log(chart?.formatting?.colors.length,Object.keys(chart.seriesData).length)
    const colorEntrieis = colorsTest.map(color => [color, true])
    dispatch(setOriginalColors(colorEntrieis))

    return () => {
      myChart.dispose();
    };
  }, []);
  useEffect(() => {
    const colorsTest = chart?.formatting?.colors || colors.map(color => [color, true])
    dispatch(setOriginalColors(colorsTest))
  }, []);

  useEffect(() => {
    const filteredSeries = !!chart.formatting.visible.length
      ? Object.fromEntries(Object.entries(chart.seriesData).filter(([series, value]) => {
        return chartState.formatting.visible.includes(series);
      }))
      : chart.seriesData


    const convertedSeriesData = convertValuesByPercent({
      visibleListString:Object.keys(filteredSeries),
      chart,
      filteredSeriesData:chartState.seriesData
    })



    setChartState(prev => {
      return {
        ...prev,
        seriesData: convertedSeriesData,

      }
    })
  }, []);


  useEffect(() => {
    const handleForm = (data) => {
      let filteredSeries = chartState.seriesData
      let isXAxis = chartState.formatting.isXAxis
      let stack = chartState.formatting.stack
      let isVisibleSeriesChange = false

      if (data.seriesData) {
        filteredSeries = convertValuesByPercent({
          visibleListString:data.seriesData,
          chart,
          filteredSeriesData:chartState.seriesData
        })
        isVisibleSeriesChange = true

      }

      if (typeof data.isXAxis !== 'undefined') {
        isXAxis = data.isXAxis
      }
      if (typeof data.stack !== 'undefined') {
        stack = data.stack
      }

      setChartState(prev => {
        return {
          ...prev,
          seriesData: filteredSeries,
          formatting: {
            ...prev.formatting,
            visible: Object.keys(filteredSeries),
            isXAxis: isXAxis,
            stack,
            isVisibleSeriesChange
          }

        }
      })
    };

    const onChange = methods.handleSubmit(handleForm);

    // Если вы хотите обрабатывать изменения формы при каждом изменении `inputs`,
    // можно использовать watch для слежения за полями формы и затем вручную вызывать обработчик.
    const subscription = methods.watch((value) => {
      onChange();
    });

    return () => {
      // Отписка от слежения за изменениями формы при размонтировании компонента
      subscription.unsubscribe();
    };
  }, [methods, inputs]);

  useEffect(() => {

    setChartState(prev => {
      return {
        ...prev,
        formatting: {
          ...prev.formatting,
          colors: Object.values(originalColors).filter(color => color[1]).map(color => color[0])
        }
      }
    })


  }, [originalColors]);

  useEffect(() => {
    if (!chartInstance) return;

    const seriesOptions = Object.keys(chartState.seriesData).map((seriesName) => {
          // console.log(chartState.seriesData[seriesName])
          return {
            name: seriesName,
            type: chartState.formatting.type_chart,
            data: chartState.seriesData[seriesName],
            stack: chartState.formatting.stack ? 'total' : null
          }
        }
      )
    ;

    const option = {
      ...tooltipConfig,
      ...legendConfig,
      color: chartState.formatting.colors || Object.values(originalColors).filter(color => color[1]).map(color => color[0]),
      series: seriesOptions,

      xAxis: chartState.formatting.isXAxis ? {type: 'category', data: chartState.xAxisData} : {
        type: 'value',
        max: chartState.ispercent ? 100 : null
      },
      yAxis: chartState.formatting.isXAxis ? {
        type: 'value',
        data: chartState.xAxisData,
        max: chartState.ispercent ? 100 : null
      } : {
        type: 'category',
        data: chartState.xAxisData
      },
    };

    chartInstance.setOption(option, {
      notMerge: !chartState.formatting.isVisibleSeriesChange,
      replaceMerge: !chartState.formatting.isVisibleSeriesChange ? ['legend','series'] : null,
      lazyUpdate: false,

    });
  }, [chartInstance, chartState]);

  const handleSave = () => {
    // console.log(originalColors)
    const {graph_id, xAxisData, seriesData, ...rest} = chartState
    const {isVisibleSeriesChange, ...restFormatting} = rest.formatting
    const request = {...rest, formatting: {...restFormatting, colors: originalColors}}
    dispatch(patchChartFormatting(request)).then(() => {
      const id = activeGroupId || groupsReports[0].group_id
      dispatch(fetchAllChartsByGroupId(id)).then(() => {
        dispatch(fetchAllChartsFormatByGroupId(id))
      })
    })

    dispatch(setOpenDrawer(false))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title_wrapper}>
        <h6>{chart.title}</h6>

      </div>
      <p>{chart.description}</p>
      <div ref={chartRef} style={{width: '100%', height: '400px'}}></div>
      <FormProvider {...methods}>
        <ChartFilters chart={{...chartState, seriesData: chart.seriesData}}/>
      </FormProvider>
      <Button className={styles.save_btn} onClick={handleSave}>Сохранить</Button>

    </div>
  );
};