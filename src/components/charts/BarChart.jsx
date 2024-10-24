import ReactEcharts from 'echarts-for-react';

export const BarChart = ({color}) => {

  const option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        color: color
      },
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        color: color
      },
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        color: color
      }
    ]
  };

  return (
    <div>
      <ReactEcharts option={option} />
    </div>
  );
};