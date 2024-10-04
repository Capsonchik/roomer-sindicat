import React, {useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import {feature} from 'topojson-client';
import topojsonData from './map_topo.json'; // TopoJSON файл
import newMap from './newMap2.json'; // GeoJSON файл
import {SelectPicker} from 'rsuite';

export const Map1 = () => {
  const [option, setOption] = useState({});
  const data = Object.keys(topojsonData.objects); // Получение всех регионов из TopoJSON
  const [currentRegion, setCurrentRegion] = useState(data[1]); // Дефолтное значение пустое

  useEffect(() => {
    // Отменяем регистрацию предыдущей карты, если она была зарегистрирована

    // const geojsonData = feature(topojsonData, topojsonData.objects?.[currentRegion]);
    // echarts.registerMap('myMap', geojsonData);


    //регионы
    //   const geojsonData = feature(topojsonData, currentRegion);
    //   echarts.registerMap('myMap', geojsonData);


    //   console.log('newMap', newMap)
    //Россия
      echarts.registerMap('myMap', newMap);



    // if (typeof currentRegion === 'string') {
    //   console.log(111)
    //   // Преобразование TopoJSON в GeoJSON для выбранного региона
    //   const geojsonData = feature(topojsonData, topojsonData.objects?.[currentRegion]);
    //   echarts.registerMap('myMap', geojsonData);
    // } else {
    //   // Регистрация карты для всего GeoJSON файла
    //   console.log('newMap', newMap)
    //   echarts.registerMap('myMap', currentRegion);
    // }

    // Обновление опций для карты после регистрации
    setOption({
      title: {
        text: 'Моя карта'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}'
      },
      visualMap: {
        min: 0,
        max: 100,
        text: ['High', 'Low'],
        realtime: false,
        calculable: true
      },
      series: [
        {
          name: 'Карта',
          type: 'map',
          map: 'myMap', // Используем зарегистированную карту 'myMap'
          roam: true,
          label: {
            show: true
          },
        }
      ]
    });
  }, [currentRegion]);

  return (
    <div style={{width: '100%', height: '800px'}}>
      <SelectPicker
        searchable
        data={data.map(item => ({value: item, label: item}))} // Мапим регионы для селектора
        onChange={region => {
          setCurrentRegion(region)
        }} // Установка выбранного региона
        placeholder="Выберите регион"
      />
      <ReactECharts option={option} style={{height: '600px'}}/>
    </div>
  );
};
