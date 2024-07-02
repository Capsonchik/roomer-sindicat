import ReactEcharts from "echarts-for-react";

export const CustomChart = () => {
  const data = [
    2.2, 1.6, 1.2, 1.2, 1.0, 0.4, 0.0, 0.1, 0.1, -1.0, -1.1, -1.2, -1.2, -1.9
  ];

  const categories = [
    'Bud', 'Velkopopov', 'Icky Kozel', 'Старый мельник', 'Балтика', 'Lowenbrau', 'ПК Балтика',
    'Tuborg', 'Zatecky Gus', 'Essa', 'Amstel', 'Жигули', 'Охота', 'Gold Mine'
  ];

  const cumulativeData = data.reduce((acc, value, index) => {
    const previous = acc.length ? acc[acc.length - 1] : 0;
    acc.push(previous + value);
    return acc;
  }, []);

  const initialData = cumulativeData.map((value, index) => ({
    value: value - data[index],
    itemStyle: {
      color: 'transparent'
    }
  }));

  const option = {
    // title: {
    //   text: 'Заголовок слайда',
    //   left: 'center',
    // },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: categories,
    },
    yAxis: {
      type: 'value',
      name: 'Объем (Л)',
    },
    series: [
      {
        name: 'Cumulative',
        type: 'bar',
        stack: 'total',
        label: {
          show: false,
        },
        itemStyle: {
          color: 'transparent',
        },
        data: initialData,
      },
      {
        name: 'Volume',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          position: 'top',
        },
        data: data.map(value => ({
          value,
          itemStyle: { color: value >= 0 ? '#52b788' : '#d62828' },
        })),
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
  };
  return (
    <div>
      <ReactEcharts option={option} />
    </div>
  );
};