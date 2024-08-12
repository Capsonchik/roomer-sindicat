import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import PptxGenJS from 'pptxgenjs';
import styles from './editorChart.module.scss';
import { chartData } from './stackBarMock';
import { chartOption, labelOption } from './chartConfig';
import { Button } from 'rsuite';

// Функция для преобразования данных в формат PptxGenJS
const prepareDataForPptx = (data) => {
  return Object.keys(data.seriesData).map((name) => ({
    name,
    labels: data.xAxisData,
    values: data.seriesData[name]
  }));
};

// Функция для получения суммы значений по каждой категории
const getSumValues = (data) => {
  const sums = data.xAxisData.map((_, index) => {
    return Object.values(data.seriesData).reduce((sum, series) => sum + series[index], 0);
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
  const [yAxisMax, setYAxisMax] = useState(100); // Состояние для максимального значения оси Y

  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const chartDom = document.getElementById('main');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    setChartInstance(myChart);

    // Функция для обновления максимального значения оси Y
    const calculateYAxisMax = () => {
      if (chartType === 'bar' && isStacked) {
        // Стэковый бар график: вычисляем максимальную сумму
        const maxSum = getSumValues(chartData);
        setYAxisMax(Math.ceil(maxSum * 1.1)); // Увеличиваем максимальное значение на 10%
      } else {
        // Обычный бар график или линия: находим максимальное значение среди всех данных
        const maxValue = Math.max(
          ...Object.values(chartData.seriesData).flat()
        );
        setYAxisMax(Math.ceil(maxValue * 1.1)); // Увеличиваем максимальное значение на 10%
      }
    };

    calculateYAxisMax();

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
      data: chartData.seriesData[seriesName] // Убедитесь, что данные предоставлены
    }));

    const option = {
      ...chartOption(chartData),
      series: seriesOptions,
      yAxis: {
        ...chartOption(chartData).yAxis,
        max: yAxisMax // Используем состояние для максимального значения оси Y
      }
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [chartType, isStacked, labelPosition, lineColors, rotate, yAxisMax]);

  // Функция для создания слайда с изображением графика
  const addChartSlide = () => {
    if (!chartInstance) return;

    // Захватываем график как изображение
    const dataUrl = chartInstance.getDataURL({ type: 'png' });

    // Проверяем, что dataUrl действителен
    if (!dataUrl) {
      console.error('Не удалось захватить изображение графика');
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
    const dataForChart = prepareDataForPptx(chartData);

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
      valAxisMaxVal: yAxisMax, // Используем состояние для максимального значения оси Y
      dataLabelPos: 'ctr',
      lineSize: 2,
      barGrouping: isStacked ? 'stacked' : 'standard', // Используем текущее состояние для стэка
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
            {['left', 'right', 'top', 'bottom', 'inside', 'insideTop', 'insideLeft', 'insideRight', 'insideBottom', 'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'].map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </label>
        <label>
          {Object.keys(lineColors).map(seriesName => (
            <div key={seriesName}>
              <span>{seriesName} Color:</span>
              <input
                type="color"
                value={lineColors[seriesName]}
                onChange={(e) => setLineColors(prevColors => ({
                  ...prevColors,
                  [seriesName]: e.target.value
                }))}
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