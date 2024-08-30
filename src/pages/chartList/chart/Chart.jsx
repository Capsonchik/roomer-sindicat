import styles from './chart.module.scss';
import React, {useEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import {colors, legendConfig, tooltipConfig} from "./config";
import {Button} from "rsuite";
import {FormProvider, useForm} from "react-hook-form";
import {ChartFilters} from "../chartFilters/ChartFIlters";
import {setActiveChart, setOpenDrawer, setOriginalColors} from "../../../store/chartSlice/chart.slice";
import {useDispatch, useSelector} from "react-redux";
import {
  selectActiveGroupId,
  selectGroupsReports,
  selectOriginalColors
} from "../../../store/chartSlice/chart.selectors";
import {
  fetchAllChartsByGroupId,
  fetchAllChartsFormatByGroupId,
  patchChartFormatting
} from "../../../store/chartSlice/chart.actions";
import {convertValuesByPercent} from "./convertValuesByPercent";
import {getSumValues} from "../getSumValues";
import {calculateMaxValue} from "../calculateMaxValue";
import {calculateStepSize} from "../calculateStepSize";


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
  console.log(chart)

  useEffect(() => {
    let series
    if (!chart.formatting.visible.length) {
      series =
        Object.fromEntries(
          Object.keys(chart.seriesData).map((name) => [name, true])
        )

    } else {
      series =
        Object.fromEntries(
          Object.keys(chart.seriesData).map((name) => [name, chart.formatting.visible.includes(name)])
        )

    }
    methods.reset({
      isXAxis: chart.formatting.isXAxis,
      stack: chart.formatting.stack,
      column_width: chart.formatting.column_width,
      column_gap: chart.formatting.column_gap,
      title: chart.title,
      label_position: chart.formatting.label_position,
      label_size: chart.formatting.label_size || 16,
      format_value: chart.formatting.format_value || 1,
      seriesData: Object.keys(series).filter((name) => series[name]),
    })
  }, []);
  // console.log()

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);
    setChartInstance(myChart);
    const colorsTest = chart?.formatting?.colors || colors
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
    let format_value = chartState.formatting.format_value || 1
    const filteredSeries = !!chart.formatting.visible.length
      ? Object.fromEntries(Object.entries(chart.seriesData).filter(([series, value]) => {
        return chartState.formatting.visible.includes(series);
      }))
      : chart.seriesData


    const convertedSeriesData = convertValuesByPercent({
      visibleListString: Object.keys(filteredSeries),
      chart,
      filteredSeriesData: chartState.seriesData,
      format_value
    })


    setChartState(prev => {
      return {
        ...prev,
        seriesData: convertedSeriesData,

      }
    })
  }, []);

  useEffect(() => {

    setChartState(prev => {
      return {
        ...prev,
        formatting: {
          ...prev.formatting,
          colors: Object.values(originalColors).filter(color => color[1]).map(color => color[0]),
          isVisibleSeriesChange: false
        }
      }
    })


  }, [originalColors]);


  useEffect(() => {
    const handleForm = (data) => {
      let filteredSeries = chartState.seriesData
      let isXAxis = chartState.formatting.isXAxis
      let stack = chartState.formatting.stack
      let column_width = chartState.formatting.column_width
      let column_gap = chartState.formatting.column_gap
      let label_position = chartState.formatting.label_position
      let label_size = chartState.formatting.label_size || 16
      let format_value = data.format_value ? data.format_value : chartState.formatting.format_value || 1

      console.log(data)

      if (data.seriesData) {
        filteredSeries = convertValuesByPercent({
          visibleListString: data.seriesData,
          chart,
          filteredSeriesData: chartState.seriesData,
          format_value
        })
      }

      // if(data.format_value) {
      //   filteredSeries = convertValuesByPercent({
      //     visibleListString: methods.getValues('seriesData'),
      //     chart,
      //     filteredSeriesData: chartState.seriesData,
      //     format_value
      //   })
      // }

      if (typeof data.isXAxis !== 'undefined') {
        isXAxis = data.isXAxis
      }
      if (typeof data.stack !== 'undefined') {
        stack = data.stack
      }
      if (typeof data.column_width !== 'undefined') {
        column_width = data.column_width
      }
      if (typeof data.column_gap !== 'undefined') {
        column_gap = data.column_gap
      }
      if (typeof data.label_position !== 'undefined') {
        label_position = data.label_position
      }
      if (typeof data.label_size !== 'undefined') {
        label_size = data.label_size
      }
      // if (typeof data.format_value !== 'undefined') {
      //   format_value = data.format_value
      // }
      // console.log(data)
      setChartState(prev => {
        return {
          ...prev,
          seriesData: filteredSeries,
          title: data.title || chartState.title,
          formatting: {
            ...prev.formatting,
            visible: Object.keys(filteredSeries),
            isXAxis: isXAxis,
            stack,
            isVisibleSeriesChange: !!data.seriesData && data.seriesData?.length !== Object.keys(chartState?.seriesData)?.length,
            column_width,
            column_gap,
            label_position,
            label_size,
            format_value
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
    if (!chartInstance) return;

    const seriesOptions = Object.keys(chartState.seriesData).map((seriesName) => {
          return {
            name: seriesName,
            type: chartState.formatting.type_chart,
            data: chartState.seriesData[seriesName],
            stack: chartState.formatting.stack ? 'total' : null
          }
        }
      )
    ;

    const maxValue = getSumValues({
      stack: chartState.formatting.stack,
      seriesData: chartState.seriesData,
      // seriesIndex: 0,
      ispercent: chartState.ispercent
    })

    const calculatedMaxValue = calculateMaxValue(0, maxValue ,6)
    const step = calculateStepSize(0,calculatedMaxValue, 6)

    const option = {
      ...tooltipConfig,
      ...legendConfig,
      label: {
        show: true,
        position: chartState.formatting.label_position,
        verticalAlign: 'middle',
        fontSize: chartState.formatting.label_size
      },
      color: chartState.formatting.colors || Object.values(originalColors).filter(color => color[1]).map(color => color[0]),
      series: seriesOptions,
      barCategoryGap: `${50 - chartState.formatting.column_width} %`,
      barGap: `${chartState.formatting.column_gap} %`,

      xAxis: chartState.formatting.isXAxis ? {type: 'category', data: chartState.xAxisData} : {
        type: 'value',
        max: chartState.ispercent ? 100 : calculatedMaxValue,
        interval: step
      },
      yAxis: chartState.formatting.isXAxis ? {
        type: 'value',
        data: chartState.xAxisData,
        max: chartState.ispercent ? 100 : calculatedMaxValue,
        interval: step
      } : {
        type: 'category',
        data: chartState.xAxisData
      },
    };

    chartInstance.setOption(option, {
      notMerge: chartState.formatting.isVisibleSeriesChange ? false : true,
      replaceMerge: ['legend', 'series'],
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