import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import hexagonsData from './maptest.json'; // Импорт данных из JSON

export const Map1 = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      // Регистрация карты с данными из JSON
      echarts.registerMap('HexagonMap', hexagonsData);

      const option = {
        series: [
          {
            name: 'Hexagon Map',
            type: 'map',
            map: 'HexagonMap',
            itemStyle: {
              normal: {
                areaColor: '#C0C0C0',
                borderColor: '#000'
              },
              emphasis: {
                areaColor: '#F4A460'
              }
            }
          }
        ]
      };

      // Устанавливаем опции для карты
      chartInstance.setOption(option);

      // Очищаем карту при размонтировании компонента
      return () => {
        chartInstance.dispose();
      };
    }
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: '400px' }} // Задаем размеры контейнера для карты
    />
  );
};