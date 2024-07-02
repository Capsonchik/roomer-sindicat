import React from 'react';
import ReactECharts from 'echarts-for-react';

export const WaterfallChart = () => {
  const data = [4.8, 1.6, -5.9];

  const option = {
    // title: {
    //   text: 'Waterfall Chart Example',
    //   left: 'center',
    // },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%',
    },
    xAxis: {
      type: 'category',
      data: ['Пенетрация (18+)', 'Частота', 'Ср. объём покупки'],
      axisLabel: {
        interval: 0,
        rotate: 0,
        align: 'center',
        verticalAlign: 'middle',
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Объем (Л)',
      show: false,
    },
    series: [
      {
        name: 'Volume',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
        },
        data: data.map((value, index) => ({
          value,
          itemStyle: {
            color: value >= 0 ? '#52b788' : '#d62828',
          },
        })),
        barWidth: '60%',
      },
    ],
    graphic: [
      {
        type: 'group',
        left: 'center',
        top: '70%',
        children: [
          {
            type: 'text',
            z: 100,
            left: 'center',
            top: '60%',
            style: {
              text: '+0,4% vs Q1\'23',
              fill: '#000',
              font: 'bold 18px sans-serif',
            },
          },
        ],
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
  };

  return <ReactECharts option={option} />;
};

