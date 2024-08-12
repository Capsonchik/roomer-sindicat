import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import PptxGenJS from 'pptxgenjs';
import styles from './editorChart.module.scss';
import { chartData } from './stackBarMock';
import { chartOption, labelOption } from './chartConfig';
import { Button } from "rsuite";

// Функция для преобразования данных в формат PptxGenJS
const prepareDataForPptx = (data, visibleSeries) => {
  return Object.keys(data.seriesData)
    .filter(name => visibleSeries[name]) // Учитываем только видимые серии
    .map(name => ({
      name,
      labels: data.xAxisData,
      values: data.seriesData[name]
    }));
};

// Функция для получения суммы значений по каждой категории
const getSumValues = (data, visibleSeries) => {
  const sums = data.xAxisData.map((_, index) => {
    return Object.keys(data.seriesData)
      .filter(name => visibleSeries[name]) // Учитываем только видимые серии
      .reduce((sum, series) => sum + data.seriesData[series][index], 0);
  });
  return Math.max(...sums);
};

export const EditorChart = () => {
  const [chartType, setChartType] = useState('bar'); // Состояние для типа графика
  const [isStacked, setIsStacked] = useState(false); // Состояние для стэка
  const [labelPosition, setLabelPosition] = useState('insideBottom'); // Состояние для позиции меток
  const [lineColors, setLineColors] = useState({
    Forest: '#5470c6',
    Steppe: '#91cc75',
    Desert: '#fac858',
    Wetland: '#ee6666'
  }); // Состояния для цветов линий
  const [rotate, setRotate] = useState(90); // Состояние для угла поворота меток

  const [chartInstance, setChartInstance] = useState(null);
  const [visibleSeries, setVisibleSeries] = useState(
    Object.fromEntries(Object.keys(chartData.seriesData).map(name => [name, true]))
  ); // Изначально все серии видимы
  const [yAxisMax, setYAxisMax] = useState(0); // Состояние для максимального значения оси Y

  useEffect(() => {
    const chartDom = document.getElementById('main');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    setChartInstance(myChart);

    // Событие для обновления видимости серий
    myChart.on('legendselectchanged', (params) => {
      setVisibleSeries(prevVisibleSeries => ({
        ...prevVisibleSeries,
        ...params.selected
      }));
    });

    return () => {
      myChart.dispose();
    };
  }, []);

  // Пересчитываем максимальное значение оси Y и цвета линий при изменении видимых серий
  useEffect(() => {
    // Обновляем максимальное значение оси Y
    const calculateYAxisMax = () => {
      if (chartType === 'bar' && isStacked) {
        // Стэковый бар график: вычисляем максимальную сумму
        const maxSum = getSumValues(chartData, visibleSeries);
        setYAxisMax(Math.ceil(maxSum * 1.1)); // Увеличиваем максимальное значение на 10%
      } else {
        // Обычный бар график или линия: находим максимальное значение среди всех видимых данных
        const maxValue = Math.max(
          ...Object.keys(chartData.seriesData)
            .filter(name => visibleSeries[name]) // Учитываем только видимые серии
            .map(name => Math.max(...chartData.seriesData[name]))
        );
        setYAxisMax(Math.ceil(maxValue * 1.1)); // Увеличиваем максимальное значение на 10%
      }
    };

    calculateYAxisMax();
  }, [visibleSeries, chartType, isStacked]);

  useEffect(() => {
    if (!chartInstance) return;

    // Создание опций для серий
    const seriesOptions = Object.keys(chartData.seriesData).map(seriesName => ({
      name: seriesName,
      type: chartType,
      stack: isStacked ? 'total' : null, // Установка стэка в зависимости от состояния
      label: {
        ...labelOption,
        position: labelPosition,
        rotate: rotate // Угол поворота меток
      },
      itemStyle: {
        color: lineColors[seriesName], // Цвет линии для каждой серии
      },
      data: chartData.seriesData[seriesName], // Убедитесь, что данные предоставлены
      // Применяем видимость серии
      emphasis: {
        disabled: !visibleSeries[seriesName],
      },
      lineStyle: {
        opacity: visibleSeries[seriesName] ? 1 : 0,
      }
    }));

    const option = {
      ...chartOption(chartData),
      series: seriesOptions,
      yAxis: {
        ...chartOption(chartData).yAxis,
        max: yAxisMax // Используем состояние для максимального значения оси Y
      }
    };

    chartInstance.setOption(option);
  }, [chartInstance, chartType, isStacked, labelPosition, lineColors, rotate, yAxisMax, visibleSeries]);

  // Функция для создания слайда с изображением графика
  const addChartSlide = () => {
    if (!chartInstance) return;

    // Capture the chart as an image
    const dataUrl = chartInstance.getDataURL({ type: 'png' });

    // Ensure the dataUrl is valid
    if (!dataUrl) {
      console.error('Failed to capture chart image');
      return;
    }

    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();

    // Добавляем изображение графика на слайд
    slide.addImage({ data: dataUrl, x: 1, y: 1, w: 8, h: 3, sizing: { type: 'contain', scale: true } });

    // Сохранение презентации
    pptx.writeFile({ fileName: 'ChartPresentationWithSnapshot.pptx' });
  };

  // Функция для скачивания презентации
  const downloadPpt = () => {
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();

    // Настройки сетки
    const slideWidth = pptx.width; // ширина слайда в дюймах
    const slideHeight = pptx.height; // высота слайда в дюймах
    const gridColor = 'D3D3D3'; // Светло-серый цвет для сетки
    const lineWidth = 0.5; // Толщина линий сетки

    // Добавляем горизонтальные и вертикальные линии сетки
    for (let y = 0; y <= slideHeight; y += 0.5) {
      slide.addShape(PptxGenJS.ShapeType.line, {
        x: 0,
        y: y,
        w: slideWidth,
        h: 0,
        line: { color: gridColor, width: lineWidth }
      });
    }

    for (let x = 0; x <= slideWidth; x += 0.5) {
      slide.addShape(PptxGenJS.ShapeType.line, {
        x: x,
        y: 0,
        w: 0,
        h: slideHeight,
        line: { color: gridColor, width: lineWidth }
      });
    }

    // Подготовка данных для графика
    const dataForChart = prepareDataForPptx(chartData, visibleSeries);
    const sumValues = getSumValues(chartData, visibleSeries);
    const valAxisMaxVal = Math.ceil(sumValues * 1.1); // Увеличиваем максимальное значение на 10%

    // Добавляем график
    slide.addChart(chartType, dataForChart, {
      x: 1,
      y: 1,
      w: 8,
      h: 4,
      chartColors: Object.values(lineColors), // Используем цвета для каждой серии
      title: "График",
      showLegend: true,
      legendPos: 'r',
      catAxisTitle: "Месяцы",
      valAxisTitle: "Значения",
      showValue: true,
      dataLabelColor: 'FFFFFF',
      valAxisMinVal: 0,
      valAxisMaxVal, // Используем вычисленное максимальное значение
      dataLabelPos: 'ctr',
      lineSize: 2,
      barGrouping: isStacked ? 'stacked' : 'standard',
      // Используем текущее состояние для стэка
    });

    // Сохранение презентации
    pptx.writeFile({ fileName: 'ChartPresentation.pptx' });
  };

  return (
    <div className={styles.wrapper}>
      <div id="main" className={styles.chartContainer}></div>
      <div className={styles.menu}>
        <label>
          Chart Type:
          <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="bar">Bar</option>
            <option value="line">Line</option>
          </select>
        </label>
        <label>
          Stack:
          <button onClick={() => setIsStacked(!isStacked)}>
            {isStacked ? 'Unstack' : 'Stack'}
          </button>
        </label>
        <label>
          Label Position:
          <select value={labelPosition} onChange={(e) => setLabelPosition(e.target.value)}>
            {[
              'left',
              'right',
              'top',
              'bottom',
              'inside',
              'insideTop',
              'insideLeft',
              'insideRight',
              'insideBottom',
              'insideTopLeft',
              'insideTopRight',
              'insideBottomLeft',
              'insideBottomRight',
            ].map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </label>
        <label>
          {Object.keys(lineColors).map((seriesName) => (
            <div key={seriesName}>
              <span>{seriesName} Color:</span>
              <input
                type="color"
                value={lineColors[seriesName]}
                onChange={(e) =>
                  setLineColors((prevColors) => ({
                    ...prevColors,
                    [seriesName]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
        </label>
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
      </div>
      <div className={styles.buttons}>
        <Button onClick={downloadPpt}>Download as PPTX</Button>
        <Button onClick={addChartSlide}>Add Chart Snapshot to PPTX</Button>
      </div>
    </div>
  );
};