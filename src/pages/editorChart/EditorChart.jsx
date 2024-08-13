  import React, { useEffect, useState } from 'react';
  import * as echarts from 'echarts';
  import styles from './editorChart.module.scss';
  import { chartData, labelArray } from './stackBarMock';
  import { chartOption, labelOption } from './chartConfig';
  import { Button, CheckPicker, SelectPicker, Toggle } from 'rsuite';
  import { prepareDataForPptx } from './prepareDataForPptx';
  import { getSumValues } from './getSumValues';
  import { downloadPpt } from './downloadPptx';
  import { downloadSnapshotPptx } from './downloadSnapshotPptx';

  const initialColors = {
    Forest: '#5470c6',
    Steppe: '#91cc75',
    Desert: '#fac858',
    Wetland: '#ee6666',
  };

  export const EditorChart = () => {
    const [chartType, setChartType] = useState('bar'); // Состояние для типа графика
    const [isStacked, setIsStacked] = useState(false); // Состояние для стэка
    const [labelPosition, setLabelPosition] = useState('insideBottom'); // Состояние для позиции меток
    const [lineColors, setLineColors] = useState(initialColors); // Состояния для цветов линий
    const [rotate, setRotate] = useState(90); // Состояние для угла поворота меток

    const [chartInstance, setChartInstance] = useState(null);
    const [visibleSeries, setVisibleSeries] = useState(
      Object.fromEntries(Object.keys(chartData.seriesData).map((name) => [name, true]))
    ); // Изначально все серии видимы
    const [yAxisMax, setYAxisMax] = useState(0); // Состояние для максимального значения оси Y
    const [barCategoryGap, setBarCategoryGap] = useState('30%'); // New state for bar category gap
    const [barGap, setBarGap] = useState('0%'); // New state for bar gap

    useEffect(() => {
      const chartDom = document.getElementById('main');
      if (!chartDom) return;

      const myChart = echarts.init(chartDom);
      setChartInstance(myChart);

      return () => {
        myChart.dispose();
      };
    }, []);

    useEffect(() => {
      // Обновляем максимальное значение оси Y
      const calculateYAxisMax = () => {
        if (chartType === 'bar' && isStacked) {
          // Стэковый бар график: вычисляем максимальную сумму
          const maxSum = getSumValues(chartData, visibleSeries, isStacked);
          setYAxisMax(Math.ceil(maxSum * 1.1)); // Увеличиваем максимальное значение на 10%
        } else {
          // Обычный бар график или линия: находим максимальное значение среди всех видимых данных
          const maxValue = Math.max(
            ...Object.keys(chartData.seriesData)
              .filter((name) => visibleSeries[name]) // Учитываем только видимые серии
              .map((name) => Math.max(...chartData.seriesData[name]))
          );
          setYAxisMax(Math.ceil(maxValue * 1.1)); // Увеличиваем максимальное значение на 10%
        }
      };

      calculateYAxisMax();
    }, [isStacked, visibleSeries]); // Зависимость от isStacked и visibleSeries

    useEffect(() => {
      if (!chartInstance) return;

      // Фильтруем серии, чтобы включать только видимые
      const filteredArray = Object.keys(chartData.seriesData).filter(series => visibleSeries[series]);

      // Создаем опции для серий
      const seriesOptions = filteredArray.map((seriesName) => ({
        name: seriesName,
        type: chartType,
        stack: isStacked ? 'total' : null, // Устанавливаем стэк на основе состояния
        label: {
          ...labelOption,
          position: labelPosition,
          rotate: rotate, // Угол поворота меток
        },
        itemStyle: {
          color: lineColors[seriesName], // Цвет линии для каждой серии
        },
        data: chartData.seriesData[seriesName], // Данные для видимых серий

        barCategoryGap: barCategoryGap, // Используем состояние для зазора между категориями
        barGap: barGap, // Используем состояние для зазора между столбиками
      }));

      const option = {
        ...chartOption(chartData),
        legend: {
          show: false, // Скрываем встроенную легенду
        },
        series: seriesOptions,
        yAxis: {
          ...chartOption(chartData).yAxis,
          max: yAxisMax, // Используем состояние для максимального значения оси Y
        },
        animation: true, // Включаем анимацию
        animationDuration: 1000, // Продолжительность анимации (в миллисекундах)
        animationEasing: 'cubicOut', // Эффект анимации
      };

      chartInstance.setOption(option, {
        notMerge: true, // Обновляем опции с учетом существующих
        lazyUpdate: false, // Обновляем сразу
      });

    }, [
      chartInstance,
      chartType,
      isStacked,
      labelPosition,
      lineColors,
      rotate,
      yAxisMax,
      visibleSeries,
      barGap,
      barCategoryGap,
    ]);

    const handleAddChartSlide = () => {
      downloadSnapshotPptx({
        chartInstance, // Экземпляр графика
      });
    };

    const handleDownload = () => {
      downloadPpt({
        chartData, // Данные графика
        visibleSeries, // Видимые серии данных
        isStacked, // Флаг стэка
        chartType, // Тип графика
        lineColors, // Цвета линий
        barCategoryGap, // Зазор между категориями столбиков
        barGap, // Зазор между столбиками
        prepareDataForPptx, // Функция для подготовки данных для PPTX
        getSumValues, // Функция для получения сумм значений
      });
    };

    const handleColorChange = (seriesName, color) => {
      setLineColors((prevColors) => ({
        ...prevColors,
        [seriesName]: color,
      }));
    };

    const checkPickerData = Object.keys(chartData.seriesData).map((name) => ({
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="color"
            value={lineColors[name]}
            onChange={(e) => handleColorChange(name, e.target.value)}
            style={{ marginRight: 8 }}
          />
          {name}
        </div>
      ),
      value: name,
    }));

    return (
      <div className={styles.wrapper}>
        <div id="main" className={styles.chartContainer}></div>
        <div className={styles.menu}>
          <CheckPicker
            data={checkPickerData}
            value={Object.keys(visibleSeries).filter((name) => visibleSeries[name])} // Initially selected series
            onChange={(value) => {
              const newVisibleSeries = Object.fromEntries(
                Object.keys(chartData.seriesData).map((name) => [name, value.includes(name)])
              );
              setVisibleSeries(newVisibleSeries);
            }}
            searchable={false}
            appearance="default"
            placeholder="Select series to display"
            className={styles.select}
          />
          <SelectPicker
            data={['bar', 'line'].map((item) => ({ label: item, value: item }))}
            searchable={false}
            placeholder="Выберите тип графика"
            onChange={(value) => setChartType(value)}
            className={styles.type}
          />
          <Toggle
            size="lg"
            checkedChildren="Stack"
            unCheckedChildren="UnStack"
            checked={isStacked}
            onChange={() => setIsStacked(!isStacked)}
          />
          <SelectPicker
            data={labelArray.map((item) => ({ label: item, value: item }))}
            searchable={false}
            placeholder="Положение label"
            onChange={(value) => setLabelPosition(value)}
            className={styles.type}
          />
          <label>
            Label Rotation:
            <input
              type="number"
              min="0"
              max="360"
              value={rotate}
              onChange={(e) => setRotate(Number(e.target.value))}
            />
          </label>
          <label>
            Bar Category Gap (%):
            <input
              type="number"
              value={parseFloat(barCategoryGap)}
              onChange={(e) => setBarCategoryGap(`${e.target.value}%`)}
            />
          </label>
          {!isStacked && (
            <label>
              Bar Gap (%):
              <input
                type="number"
                value={parseFloat(barGap)}
                onChange={(e) => setBarGap(`${e.target.value}%`)}
              />
            </label>
          )}
        </div>
        <div className={styles.buttons}>
          <Button onClick={handleDownload}>Download as PPTX</Button>
          <Button onClick={handleAddChartSlide}>Add Chart Snapshot to PPTX</Button>
        </div>
      </div>
    );
  };