import styles from './chart.module.scss';
import React, {useEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import {chartOption} from "../../editorChart/chartConfig";
import {colors} from "./config";
import EditIcon from "@rsuite/icons/Edit";
import {Button} from "rsuite";
import {ChartDrawer} from "../chartDrawer/ChartDrawer";

export const Chart = ({chart,editBtn = true}) => {
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
            type: 'bar',
            data: chart.axes.seriesData[seriesName],
        }));

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                show: true,
                bottom: 0,
                selectedMode: false,
            },
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

            <ChartDrawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                chart={chart}
            />
        </div>
    );
};