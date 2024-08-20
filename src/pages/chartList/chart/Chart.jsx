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


export const Chart = ({chart, editBtn = true}) => {
  const methods = useForm()
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false)

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);
    setChartInstance(myChart);

    return () => {
      myChart.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartInstance) return;

    const seriesOptions = Object.keys(chart.axes.seriesData).map((seriesName) => ({
      name: seriesName,
      type: chart.formatting.type_chart,
      data: chart.axes.seriesData[seriesName],
    }));

    const option = {
      ...tooltipConfig,
      ...legendConfig,
      color: colors,
      series: seriesOptions,
      xAxis: {type: 'category', data: chart.axes.xAxisData},
      yAxis: {type: 'value'},
    };

    chartInstance.setOption(option, {
      notMerge: true,
      lazyUpdate: false,
    });
  }, [chartInstance]);
  console.log(methods.formState)
  const test = () => {
    console.log(1)
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.title_wrapper}>
        <h6>{chart.title}</h6>
        {editBtn && <Button onClick={() => {
          setOpenDrawer(true)
        }}>
          <EditIcon/>
        </Button>}
      </div>
      <p>{chart.description}</p>
      <div ref={chartRef} style={{width: '100%', height: '400px'}}></div>
      {!editBtn && <FormProvider {...methods}>
        <ChartFilters chart={chart} test={test}/>
      </FormProvider>}

      {editBtn && <ChartDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        chart={chart}
      />
      }
    </div>
  );
};