import ReactEcharts from "echarts-for-react";

export const Chart1 = () => {
  const rawData = [
    [100, 302, 301, 334, 390, 330, 320],
    [320, 132, 101, 134, 90, 230, 210],
    [220, 182, 191, 234, 290, 330, 310],
    [150, 212, 201, 154, 190, 330, 410],
    [820, 832, 901, 934, 1290, 1330, 1320],
    [150, 212, 201, 154, 190, 330, 410],
    [150, 212, 201, 154, 190, 330, 410],
    [150, 212, 201, 154, 190, 330, 410],
  ];
  const totalData = [];
  for (let i = 0; i < rawData[0].length; ++i) {
    let sum = 0;
    for (let j = 0; j < rawData.length; ++j) {
      sum += rawData[j][i];
    }
    totalData.push(sum);
  }
  const grid = {
    left: 100,
    right: 100,
    top: 50,
    bottom: 50
  };
  const series = [
    'Центральный',
    'Приволжский',
    'Северо-западный',
    'Южный',
    'Уральский',
    'Сибирский',
    'Северо-кавказский',
    'Дальневосточный',
  ].map((name, sid) => {
    return {
      name,
      type: 'bar',
      stack: 'total',
      barWidth: '60%',
      label: {
        show: true,
        formatter: (params) => Math.round(params.value * 1000) / 10 + '%'
      },
      data: rawData[sid].map((d, did) =>
        totalData[did] <= 0 ? 0 : d / totalData[did]
      )
    };
  });

  const option = {
    legend: {
      selectedMode: false
    },
    grid,
    yAxis: {
      type: 'value'
    },
    xAxis: {
      type: 'category',
      data: ['Q 1.23', 'Q 1.24']
    },
    series
  };

  return <ReactEcharts option={option} style={{ height: 700 }} />
};