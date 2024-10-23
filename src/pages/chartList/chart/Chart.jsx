import styles from './chart.module.scss';
import React, {useEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import {colors as colorsConsts,  legendConfig, tooltipConfig} from "./config";
import {Button} from "rsuite";
import {FormProvider, useForm} from "react-hook-form";
import {ChartFilters} from "../chartFilters/ChartFIlters";
import {
  setActiveChart,
  setFilterLoading, setGraphsPosition,
  setOpenDrawer,
  setOriginalColors
} from "../../../store/chartSlice/chart.slice";
import {useDispatch, useSelector} from "react-redux";
import {
  selectActiveClient,
  selectActiveGroupId, selectCharts, selectClients, selectFilters,
  selectGroupsReports,
  selectOriginalColors
} from "../../../store/chartSlice/chart.selectors";
import {
  deleteChartById,
  fetchAllChartsByGroupId,
  fetchAllChartsFormatByGroupId, getGroupById,
  patchChartFormatting
} from "../../../store/chartSlice/chart.actions";
import {convertValuesByPercent} from "./convertValuesByPercent";
import {getSumValues} from "../getSumValues";
import {calculateMaxValue} from "../calculateMaxValue";
import {calculateStepSize} from "../calculateStepSize";
import cl from "classnames";
import {selectCurrentUser} from "../../../store/userSlice/user.selectors";
import {getFilters} from "../../../store/chartSlice/filter.actions";
import {selectActiveFilters} from "../../../store/chartSlice/filter.slice";
import {selectSelectedFilters} from "../../../store/chartSlice/filter.selectors";
import {generateColors} from "../../../lib/generateColors";


export const Chart = ({chart}) => {
  const dispatch = useDispatch();
  const methods = useForm()
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [chartState, setChartState] = useState(chart)
  const originalColors = useSelector(selectOriginalColors)
  const activeGroupId = useSelector(selectActiveGroupId)
  const groupsReports = useSelector(selectGroupsReports)
  const activeFilters = useSelector(selectActiveFilters)
  const filters = useSelector(selectFilters)
  const user = useSelector(selectCurrentUser)
  const clients = useSelector(selectClients)
  const activeClient = useSelector(selectActiveClient)
  const selectedFilters = useSelector(selectSelectedFilters)
  const charts = useSelector(selectCharts)
  const [isDelete, setIsDelete] = useState(false)
  const [colors, setColors] = useState(colorsConsts)
  const [activeGroupObj, setActiveGroupObj] = useState()
  useEffect(() => {

    const foundGroup = groupsReports.find((group) => group.group_id == activeGroupId)
    if (foundGroup) {
      setActiveGroupObj(foundGroup)
    } else if (groupsReports.length) {
      setActiveGroupObj(groupsReports[0])
    }
    // setFileList([])

  }, [])
  console.log(activeGroupObj)
  // console.log(chart)
  useEffect(() => {
    const client = clients.find(clnt => clnt.client_id === activeClient)
    if (client?.chart_colors && client?.chart_colors?.colors) {
      // const test = ['#1675e0', '#fa8900']
      const gradientColors = generateColors(client?.chart_colors?.colors, Object.keys(chart.seriesData).length)
      // console.log(chart.seriesData)
      setColors(gradientColors)
    }
  },[charts])
  const inputs = methods.watch()
  // console.log(chart)

  useEffect(() => {

    methods.reset({
      isXAxis: chart.formatting.isXAxis,
      stack: chart.formatting.stack,
      column_width: chart.formatting.column_width,
      column_gap: chart.formatting.column_gap,
      title: chart.title,
      label_position: chart.formatting.label_position,
      label_size: chart.formatting.label_size || 16,
      format_value: chart.formatting.format_value ?? 1,
      seriesData: Object.keys(chart.seriesData),
    })
  }, []);
  // console.log()

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
  //   const colorsTest = chart?.formatting?.colors || colors.map(color => [color, true])
  //   dispatch(setOriginalColors(colorsTest))
  // }, []);

  useEffect(() => {
    let format_value = chartState.formatting.format_value ?? 1
    let filteredSeries = chartState.seriesData
    // for (const formatValueElement of filteredSeries) {
    //   console.log(formatValueElement)
    // }
    filteredSeries = Object.fromEntries(Object.entries(chart.seriesData).map(([key, value]) => {
      // console.log(value,format_value)
      return [key, value.map(item => (+item).toFixed(format_value))];
    }))

    setChartState(prev => {
      return {
        ...prev,
        seriesData: filteredSeries,

      }
    })
  }, []);

  // useEffect(() => {
  //
  //   setChartState(prev => {
  //     return {
  //       ...prev,
  //       formatting: {
  //         ...prev.formatting,
  //         colors: Object.values(originalColors).filter(color => color[1]).map(color => color[0]),
  //         isVisibleSeriesChange: false
  //       }
  //     }
  //   })
  //
  //
  // }, [originalColors]);


  const fetchCharts = (id) => {
    const filterData = {
      filter_data: activeGroupObj?.saved_filters?.filter_data?.filter(saveFilter => {
        console.log(saveFilter, filters)
        return !filters.some(filter => filter.filter_id === saveFilter.filter_id && !filter.isactive)
      }) || selectedFilters.map(filter => ({filter_id: filter.filter_id, filter_values: filter.value})) || []
    }
    // console.log(111111, id,selected)
    dispatch(fetchAllChartsByGroupId({
      groupId: id,
      filter_data: filterData
    })).then(() => {
      dispatch(fetchAllChartsFormatByGroupId(id));
    });
  }

  const handleDelete = async () => {
    dispatch(deleteChartById(chart.id)).then(() => {
      dispatch(getGroupById(activeGroupId)).then((res) => {
        console.log(res.payload)
        dispatch(setGraphsPosition(res.payload?.graphs_position?.positions))
        fetchCharts(activeGroupId)
      })

    })
    dispatch(setOpenDrawer(false))
  }


  useEffect(() => {
    const handleForm = (data) => {
      let filteredSeries = chartState.seriesData
      let isXAxis = chartState.formatting.isXAxis
      let stack = chartState.formatting.stack
      let column_width = chartState.formatting.column_width
      let column_gap = chartState.formatting.column_gap
      let label_position = chartState.formatting.label_position
      let label_size = chartState.formatting.label_size || 16
      let format_value = chartState.formatting.format_value ?? 1


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

      if (typeof data.format_value !== 'undefined') {
        format_value = data.format_value

        filteredSeries = Object.fromEntries(Object.entries(chart.seriesData).map(([key, value]) => {
          // console.log(value,format_value)
          return [key, value.map(item => (+item).toFixed(format_value))];
        }))
      }
      // console.log(data)
      setChartState(prev => {
        return {
          ...prev,
          seriesData: filteredSeries,
          title: data.title || chartState.title,
          formatting: {
            ...prev.formatting,
            // visible: Object.keys(filteredSeries),
            isXAxis: isXAxis,
            stack,
            // isVisibleSeriesChange: !!data.seriesData && data.seriesData?.length !== Object.keys(chartState?.seriesData)?.length,
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

    const calculatedMaxValue = calculateMaxValue(0, maxValue, 6)
    const step = calculateStepSize(0, calculatedMaxValue, 6)

    const option = {
      ...tooltipConfig,
      ...legendConfig,
      label: {
        show: true,
        position: chartState.formatting.label_position,
        verticalAlign: 'middle',
        fontSize: chartState.formatting.label_size
      },
      color: colors,
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
      notMerge: false,
      // replaceMerge: ['legend', 'series'],
      lazyUpdate: false,

    });
  }, [chartInstance, chartState]);

  const handleSave = () => {
    // console.log(methods.getValues())
    // return
    // console.log(originalColors)
    const {graph_id, xAxisData, seriesData, ...rest} = chartState
    const {isVisibleSeriesChange, ...restFormatting} = rest.formatting
    const request = {...rest, formatting: {...restFormatting}}
    dispatch(patchChartFormatting(request)).then(() => {
      const id = activeGroupId || groupsReports[0].group_id
      const activeFiltersRequest = filters
      // console.log('activeFilters[activeGroupId]',activeFilters[activeGroupId])
      const request = activeFiltersRequest
        .map(filter => {
          return {
            filter_id: filter.filter_id,
            filter_values: filter.value,
            isactive: filter.isactive,
          }
        })
        .filter(filter => filter.isactive && Array.isArray(filter.filter_values) && filter.filter_values.length > 0)
      dispatch(fetchAllChartsByGroupId({groupId: id, filter_data: {filter_data: request}})).then(() => {
        dispatch(fetchAllChartsFormatByGroupId(id))
      })
      // dispatch(getFilters(activeGroupId)).then(() => {
      //   dispatch(setFilterLoading('none'))
      // })
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
      {user && user.role !== 'viewer' && <div className={styles.buttons}>
        <Button
          className={cl(styles.delete_btn, {
            [styles.isDelete]: isDelete
          })}
          onClick={(e) => {
            if (!isDelete) {
              setIsDelete(true)
              return
            }
            handleDelete()
          }}>{!isDelete ? 'Удалить' : 'Да, удалить'}</Button>
        <Button className={styles.save_btn} onClick={handleSave}>Сохранить</Button>
      </div>}

      {/*deleteChartById*/}
    </div>
  );
};