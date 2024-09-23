import styles from './chartPie.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {FormProvider, useForm} from "react-hook-form";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import {colors, legendConfig, tooltipConfig} from "../../chart/config";
import {Button} from "rsuite";
import {setActiveChart, setOpenDrawer} from "../../../../store/chartSlice/chart.slice";
import EditIcon from "@rsuite/icons/Edit";
import {selectActiveGroupId, selectCharts, selectGroupsReports} from "../../../../store/chartSlice/chart.selectors";
import {centerPie, pieMocks} from "./pie-mocks";
import cl from "classnames";
import {MainForm} from "./mainForm/MainForm";
import {
  fetchAllChartsByGroupId,
  fetchAllChartsFormatByGroupId,
  patchChartFormatting
} from "../../../../store/chartSlice/chart.actions";
import {selectActiveFilters} from "../../../../store/chartSlice/filter.slice";

export const ChartPie = ({chart}) => {
  const dispatch = useDispatch();
  const methods = useForm()
  const chartRef = useRef(null);
  const charts = useSelector(selectCharts)
  const [chartInstance, setChartInstance] = useState(null);
  const [chartState, setChartState] = useState(chart)
  const [radius, setRadius] = useState(chart?.formatting?.radius || [80, 140])
  const [padAngle, setPadAngle] = useState(chart?.formatting?.padAngle || 0)
  const [borderRadius, setBorderRadius] = useState(chart?.formatting?.borderRadius || 0)
  const [roseType, setRoseType] = useState(!!chart?.formatting?.roseType)
  const activeGroupId = useSelector(selectActiveGroupId)
  const groupsReports = useSelector(selectGroupsReports)
  const activeFilters = useSelector(selectActiveFilters)
  const inputs = methods.watch()
  const [isDelete, setIsDelete] = useState(false)


  useEffect(() => {
    const myChart = echarts.init(chartRef.current);
    setChartInstance(myChart);


    return () => {
      myChart.dispose();
    };
  }, []);


  useEffect(() => {
    methods.reset({
      title: chart.title,
      radius: 80 / 2,
      padAngle: padAngle,
      borderRadius: borderRadius,
      roseType: roseType,
    })
  }, [])

  // const watch = methods.getValues()

  useEffect(() => {

    const handleForm = (data) => {
      // const form = methods.getValues()
      if (data.radius !== undefined) {
        setRadius([data.radius, 140])
      }
      if (data.padAngle !== undefined) {
        setPadAngle(data.padAngle)
      }
      if (data.borderRadius !== undefined) {
        setBorderRadius(data.borderRadius)
      }
      if (data.roseType !== undefined) {
        setRoseType(data.roseType)
      }
      console.log(data)
    }


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


  }, [inputs]);


  useEffect(() => {
    if (!chartInstance) return;


    const seriesOptions = pieMocks.map((pieItem, index, arr) => {
      let center = centerPie[arr.length][index];


      return {
        name: pieItem.name,
        type: 'pie',
        data: pieItem.data,
        center: center,
        padAngle: padAngle,
        roseType: roseType,
        itemStyle: {
          borderRadius: borderRadius,
        },
        radius: radius.map(rads => rads / 2),
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true
          }
        },

      }
    });


    const option = {
      // ...tooltipConfig,
      ...legendConfig,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      title: [
        ...pieMocks.map((pieItem, index, arr) => {
          let center = centerPie[arr.length][index];
          return {
            subtext: pieItem.name,
            left: center[0],
            top: '70%',
            textAlign: 'center'
          }
        })
      ],


      series: seriesOptions,

    };

    chartInstance.setOption(option, {
      notMerge: true,
      lazyUpdate: false,
    });
  }, [chartInstance, chartState, radius, padAngle, borderRadius, roseType]);

  const handleSave = () => {

    const {seriesData, xAxisData, ...rest} = chart

    dispatch(patchChartFormatting({
      ...rest,
      formatting: {
        ...rest.formatting,
        radius,
        padAngle,
        borderRadius,
        roseType
      }
    })).then(() => {
      const id = activeGroupId || groupsReports[0].group_id
      const activeFiltersRequest = activeFilters[activeGroupId]
      console.log('activeFilters[activeGroupId]', activeFilters[activeGroupId])
      const request = activeFiltersRequest
        ? activeFiltersRequest.map(filter => {
          return {
            filter_id: filter.filter_id,
            filter_values: filter.value,
            isactive: filter.isactive,
          }
        })
          .filter(filter => filter.isactive && Array.isArray(filter.filter_values) && filter.filter_values.length > 0)
        : []
      dispatch(fetchAllChartsByGroupId({groupId: id, filter_data: {filter_data: request}})).then(() => {
        dispatch(fetchAllChartsFormatByGroupId(id))
      })
    })

    dispatch(setOpenDrawer(false))
  }

  const handleDelete = () => {

  }


  return (
    <div className={cl(styles.wrapper, {
      [styles.full_width_2]: charts.length % 2 === 0,
      [styles.full_width_3]: charts.length % 2 !== 0 && charts.length > 1,
      [styles.full_width_1]: pieMocks.length === 1,
    })}>
      <div className={styles.title_wrapper}>
        <h5>{chart.title}</h5>
        {/*<Button onClick={() => {*/}

        {/*  dispatch(setActiveChart(chart))*/}
        {/*  dispatch(setOpenDrawer(true))*/}
        {/*}}>*/}
        {/*  <EditIcon/>*/}
        {/*</Button>*/}
      </div>
      {/*<p>{chart.description}</p>*/}
      <div ref={chartRef} style={{width: '100%', minHeight: '250px', marginBottom: 24}}></div>
      <FormProvider {...methods} >
        <MainForm/>
        <div className={styles.buttons}>
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
        </div>
      </FormProvider>

    </div>
  );
}