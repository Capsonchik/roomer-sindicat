
import styles from './chartItemPie.module.scss'
import {Button} from "rsuite";
import {setActiveChart, setOpenDrawer} from "../../../store/chartSlice/chart.slice";
import EditIcon from "@rsuite/icons/Edit";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import * as echarts from "echarts";
import {colors as colorsConsts, legendConfig, tooltipConfig} from "../chart/config";
import {centerPie, pieMocks} from "../chartEditor/chartPie/pie-mocks";
import {selectActiveClient, selectCharts, selectClients} from "../../../store/chartSlice/chart.selectors";
import cl from 'classnames'
import {generateColors} from "../../../lib/generateColors";


export const ChartItemPie = ({chart}) => {
  const dispatch = useDispatch();
  const methods = useForm()
  const chartRef = useRef(null);
  const charts = useSelector(selectCharts)
  const [chartInstance, setChartInstance] = useState(null);
  const [chartState, setChartState] = useState(chart)
  const [radius, setRadius] = useState(chart?.formatting?.radius || [80, 140])
  const [colors, setColors] = useState(colorsConsts)
  const activeClient = useSelector(selectActiveClient)
  const clients = useSelector(selectClients)

  useEffect(() => {
    const client = clients.find(clnt => clnt.client_id === activeClient)
    if (client?.chart_colors && client?.chart_colors?.colors) {
      // const test = ['#1675e0', '#fa8900']
      const gradientColors = generateColors(client?.chart_colors?.colors, pieMocks[0].data.length)
      // console.log(chart.seriesData)
      setColors(gradientColors)
    }
  },[charts])


  useEffect(() => {
    const myChart = echarts.init(chartRef.current);
    setChartInstance(myChart);


    return () => {
      myChart.dispose();
    };
  }, []);





  useEffect(() => {
    if (!chartInstance) return;

    const seriesOptions = pieMocks.map((pieItem, index,arr) => {
      let center = centerPie[arr.length][index];

      return {
        name: pieItem.name,
        type: 'pie',
        data: pieItem.data,
        padAngle: chart?.formatting?.padAngle || 0,
        roseType: !!chart?.formatting?.roseType,
        itemStyle: {
          borderRadius: chart?.formatting?.borderRadius || 0,
        },
        center: center,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true
          }
        },
        radius: radius,

      }
    });




    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      ...legendConfig,
      color: colors,
      title: [
        ...pieMocks.map((pieItem, index,arr) => {
          let center = centerPie[arr.length][index];
          return {
            subtext: pieItem.name,
            left: center[0],
            top: '80%',
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
  }, [chartInstance, chartState]);


  return (
    <div className={cl(styles.wrapper, {
      [styles.full_width_2]: charts.length % 2 === 0,
      [styles.full_width_3]: charts.length % 2 !== 0 && charts.length > 1,
      [styles.full_width_1]: pieMocks.length === 1,
    })}>
      <div className={styles.title_wrapper}>
        <h5>{chart.title}</h5>
        <Button className={styles.btn} onClick={() => {

          dispatch(setActiveChart(chart))
          dispatch(setOpenDrawer(true))
        }}>
          <EditIcon/>
        </Button>
      </div>
      {/*<p>{chart.description}</p>*/}
      <div className={styles.chart} ref={chartRef} style={{width: '100%', minHeight: '400px'}}></div>

    </div>
  );
}