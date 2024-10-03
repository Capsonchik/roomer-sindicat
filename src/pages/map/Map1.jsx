import React, {useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import {PivotTableComponent} from "../chartList/tableTest/TableTest";
import {PivotTableAgGrid} from "../chartList/tableTest/AgGrid";

export const Map1 = () => {
  const [option, setOption] = useState({});

  useEffect(() => {
    // Загрузка GeoJSON-файла через fetch
    fetch('/Russia_regions.geojson') // Убедитесь, что файл находится в папке public
      .then((response) => response.json())
      .then((geojsonData) => {
        console.log(geojsonData);
        const valuesData = geojsonData.features.map(item => {
          return {
            name: item.properties.region,
            value: Math.round(Math.random() * 500)
          }
        })
        // Регистрация карты в ECharts
        echarts.registerMap('myMap', geojsonData);


        // Настройка опций для карты
        setOption({
          title: {
            text: 'Моя карта'
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return `${params.name}: ${params.value}`;
            }
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
              map: 'myMap',
              roam: true,
              aspectScale: .5,
              zoom: 2,
              left: '-45%',
              // layoutCenter: ['100%', '30%'],
              label: {
                show: false // Не показывать метку по умолчанию
              },
              itemStyle: {
                areaColor: '#f3f3f3',
                borderColor: '#000',
                borderWidth: 0.5
              },
              emphasis: {
                label: {
                  show: true, // Показать метку при наведении
                  color: '#000', // Цвет текста метки
                },
                itemStyle: {
                  areaColor: '#ffa', // Цвет подсветки при наведении
                  borderColor: '#f00',
                  borderWidth: 1
                }
              },
              nameProperty: 'region', // Свойство для отображения названия региона
              data: valuesData // Использование преобразованных данных
            }
          ]
        });
      })
      .catch((error) => {
        console.error('Error loading GeoJSON:', error);
      });
  }, []);

  return (
    // <div style={{ width: '100%', height: '600px' }}>
    //   <ReactECharts option={option} style={{height:600}}/>
    // </div>
    <>
      <PivotTableComponent/>
      {/*<PivotTableAgGrid/>*/}
    </>
  );
};