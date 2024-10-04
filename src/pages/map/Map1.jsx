import React, { useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { feature } from 'topojson-client';
import topojsonData from './map_topo.json'; // TopoJSON файл
import newMap from './newMap2.json'; // GeoJSON файл
import { SelectPicker } from 'rsuite';

export const Map1 = () => {
  const chartRef = useRef(null); // Ссылка на экземпляр графика
  const [option, setOption] = useState({});
  const data = Object.keys(topojsonData.objects); // Получение всех регионов из TopoJSON
  const [currentRegion, setCurrentRegion] = useState(newMap); // Дефолтное значение пустое

  useEffect(() => {
    const chartInstance = chartRef.current.getEchartsInstance(); // Получаем текущий экземпляр ECharts
    let data = []
    // Если текущий регион это строка (имя региона), преобразуем TopoJSON в GeoJSON для этого региона
    if (typeof currentRegion === 'string') {
      console.log('Selected Region:', currentRegion);
      const geojsonData = feature(topojsonData, topojsonData.objects?.[currentRegion]);
      console.log(geojsonData)
      echarts.registerMap('myMap', geojsonData);
      data = geojsonData?.features?.map(item => ({name:item.properties.district,  value:Math.ceil(Math.random() * 1000)}));
    } else {
      console.log('Using full GeoJSON map');
      echarts.registerMap('myMap', newMap);
      data = newMap?.features?.map(item => ({name:item.properties.name, value:Math.ceil(Math.random() * 1000)}));
      console.log(newMap)
    }
    // console.log(newMap)
    // Обновление опций для карты после регистрации
    chartInstance.setOption({
      title: {
        text: 'Моя карта',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}',
      },

      visualMap: {
        min: 0,
        max: 100,
        text: ['High', 'Low'],
        realtime: false,
        calculable: true,
      },
      series: [
        {
          name: 'Карта',
          type: 'map',
          map: 'myMap', // Используем зарегистрированную карту 'myMap'
          roam: true,
          // layoutCenter: ['50%', '50%'], // Центр карты по контейнеру
          // layoutSize: '100%', // Пропорциональное масштабирование карты
          aspectScale: typeof currentRegion !== 'string' ?  1.3 : null, // Соотношение сторон карты
          label: {
            show: false, // Сначала скрываем подписи
            emphasis: { // Показываем при наведении
              show: true,
            },
          },

          data:data

        },
      ],
    });
  }, [currentRegion]);

  return (
    <div style={{ width: '100%', height: '800px' }}>
      <SelectPicker
        searchable
        data={data.map((item) => ({ value: item, label: item }))} // Мапим регионы для селектора
        onChange={(region) => {
          setCurrentRegion(region);
        }} // Установка выбранного региона
        placeholder="Выберите регион"
      />
      <ReactECharts
        ref={chartRef} // Присваиваем ref
        option={option}
        style={{ height: '600px' }}
      />
    </div>
  );
};
