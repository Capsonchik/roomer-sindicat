import React, {useEffect, useState} from 'react';
import * as echarts from 'echarts';
import styles from './editorChart.module.scss';
import {chartData, labelArray} from './stackBarMock';
import {chartOption, labelOption} from './chartConfig';
import {Button, ButtonToolbar, CheckPicker, InputNumber, Loader, SelectPicker, Toggle} from 'rsuite';
import {prepareDataForPptx} from './prepareDataForPptx';
import {getSumValues} from './getSumValues';
import {downloadPpt} from './downloadPptx';
import {downloadSnapshotPptx} from './downloadSnapshotPptx';
import {useDispatch, useSelector} from "react-redux";
import {fetchChartById} from "../../store/chartSlice/chart.actions";
import {useNavigate, useParams} from "react-router-dom";
import {selectAxes, selectCurrentChartLoading, selectCurrentGraph} from "../../store/chartSlice/chart.selectors";
import {ROUTES_PATH} from "../../routes/RoutesPath";
import {handleRotate} from "./handleRotate";
import {ChartDataTable} from "../../components/chartPage/chartDataTable/ChartDataTable";

const initialColors = {
  Forest: '#5470c6',
  Steppe: '#91cc75',
  Desert: '#fac858',
  Wetland: '#ee6666',
};

export const EditorChart = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);


  const [series, setSeries] = useState(chartData)
  const currentChart = useSelector(selectCurrentGraph)
  const storeAxes = useSelector(selectAxes)
  const currentChartLoading = useSelector(selectCurrentChartLoading)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const params = useParams();
  const [chartType, setChartType] = useState('bar'); // Состояние для типа графика
  const [isStacked, setIsStacked] = useState(false); // Состояние для стэка
  const [labelPosition, setLabelPosition] = useState('insideBottom'); // Состояние для позиции меток
  const [lineColors, setLineColors] = useState(initialColors); // Состояния для цветов линий
  const [rotate, setRotate] = useState(90); // Состояние для угла поворота меток
  const [isXAxis, setIsXAxis] = useState(true); // State for axis orientation

  const [chartInstance, setChartInstance] = useState(null);
  const [visibleSeries, setVisibleSeries] = useState([]); // Изначально все серии видимы
  const [yAxisMax, setYAxisMax] = useState(0); // Состояние для максимального значения оси Y
  const [barCategoryGap, setBarCategoryGap] = useState('30%'); // New state for bar category gap
  const [barGap, setBarGap] = useState('0%'); // New state for bar gap

  useEffect(() => {
    if (params.id) {
      dispatch(fetchChartById(params.id))
    }
  }, [params]);

  useEffect(() => {
    if (storeAxes) {
      setSeries(storeAxes)
    }
  }, [storeAxes]);

  useEffect(() => {
    if (currentChart) {
      setChartType(currentChart.data.config.chartType)
      setSeries(currentChart.data.axes)
      setVisibleSeries(Object.fromEntries(Object.keys(currentChart.data.axes.seriesData).map((name) => [name, true])))

      if (currentChart.data.additionalFields.isStacked) {
        setIsStacked(true)
      }
      if (typeof currentChart.data.additionalFields.rotateLabel === 'number') {
        setRotate(currentChart.data.additionalFields.rotateLabel)
      }


      const newColors = Object.keys(currentChart.data.axes.seriesData).reduce((acc, item, index) => {
        acc[item] = currentChart.data.additionalFields.colorsForSingleItem[index];
        return acc
      }, {});
      setLineColors(newColors)
    }

  }, [currentChart])


  useEffect(() => {
    const chartDom = document.getElementById('main');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    setChartInstance(myChart);

    return () => {
      myChart.dispose();
    };
  }, []);

  // console.log(yAxisMax)
  useEffect(() => {
    if (!series.length) return
    // Обновляем максимальное значение оси Y
    const calculateYAxisMax = () => {
      if (chartType === 'bar' && isStacked) {
        // Стэковый бар график: вычисляем максимальную сумму
        const maxSum = getSumValues(series, visibleSeries, isStacked);
        setYAxisMax(Math.ceil(maxSum * 1.1)); // Увеличиваем максимальное значение на 10%
      } else {
        // Обычный бар график или линия: находим максимальное значение среди всех видимых данных
        const maxValue = Math.max(
          ...Object.keys(series.seriesData)
            .filter((name) => visibleSeries[name]) // Учитываем только видимые серии
            .map((name) => Math.max(...series.seriesData[name]))
        );
        setYAxisMax(Math.ceil(maxValue * 1.1)); // Увеличиваем максимальное значение на 10%
      }
    };

    calculateYAxisMax();
  }, [isStacked, visibleSeries, isXAxis, series]);

  useEffect(() => {
    if (!chartInstance) return;

    // Фильтруем серии, чтобы включать только видимые
    const filteredArray = Object.keys(series.seriesData).filter(series => visibleSeries[series]);
    const filteredColor = filteredArray.map((item, index) => {
      return lineColors[item]
    })
    console.log(filteredArray)
    // console.log(filteredArray)
    // Создаем опции для серий
    const seriesOptions = filteredArray.map((seriesName, i) => ({
      name: seriesName,
      type: chartType,
      stack: isStacked ? 'total' : null, // Устанавливаем стэк на основе состояния
      label: {
        ...labelOption,
        position: labelPosition,
        rotate: rotate, // Угол поворота меток
      },
      itemStyle: {
        color: filteredColor[i], // Цвет линии для каждой серии
      },

      data: series.seriesData[seriesName], // Данные для видимых серий

      barCategoryGap: barCategoryGap, // Используем состояние для зазора между категориями
      barGap: barGap, // Используем состояние для зазора между столбиками
    }));

    const option = {
      ...chartOption(chartData),
      legend: {
        show: false, // Скрываем встроенную легенду
      },

      series: seriesOptions,
      xAxis: isXAxis ? {type: 'category', data: series.xAxisData} : {type: 'value'}, // Toggle axis
      yAxis: isXAxis ? {type: 'value'} : {type: 'category', data: series.xAxisData}, // Toggle axis
      animation: true, // Enable animation
      animationDuration: 1000, // Animation duration (milliseconds)
      animationEasing: 'cubicOut', // Animation easing effect
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
    isXAxis,
    currentChart,
    series
  ]);

  const handleAddChartSlide = () => {
    downloadSnapshotPptx({
      chartInstance, // Экземпляр графика
    });
  };

  const handleDownload = (series) => {
    downloadPpt({
      series, // Данные графика
      visibleSeries, // Видимые серии данных
      isStacked, // Флаг стэка
      chartType, // Тип графика
      lineColors, // Цвета линий
      barCategoryGap, // Зазор между категориями столбиков
      barGap, // Зазор между столбиками
      prepareDataForPptx, // Функция для подготовки данных для PPTX
      getSumValues, // Функция для получения сумм значений
      currentChart,
      isXAxis
    });
  };


  return (
    <div className={styles.wrapper}>
      <Button onClick={() => navigate('/main' + ROUTES_PATH.editorChart)}>Назад</Button>
      <h4>{currentChart?.title}</h4>
      <p>{currentChart?.description}</p>
      <div className={styles.layout}>
        <div id="main" className={styles.chartContainer}></div>
        <div className={styles.controls}>
          <div className={styles.menu}>
            <CheckPicker
              data={Object.keys(series.seriesData).map(name => ({value: name, label: name}))}
              value={Object.keys(visibleSeries).filter((name) => visibleSeries[name])} // Initially selected series
              onChange={(value) => {
                const newVisibleSeries = Object.fromEntries(
                  Object.keys(series.seriesData).map((name) => [name, value.includes(name)])
                );
                setVisibleSeries(newVisibleSeries);
              }}
              searchable={false}
              appearance="default"
              placeholder="Select series to display"
              className={styles.select}
            />
            <ButtonToolbar>
              <Button onClick={handleOpen}> Данные графика</Button>
            </ButtonToolbar>
            <SelectPicker
              data={['bar', 'line'].map((item) => ({label: item, value: item}))}
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
              onChange={() => {
                handleRotate(isXAxis,isStacked,setRotate)
                setIsStacked(!isStacked)
              }}
            />
            <Toggle
              size="lg"
              checkedChildren="X Axis"
              unCheckedChildren="Y Axis"
              checked={isXAxis}
              onChange={() => {
                handleRotate(isXAxis,isStacked,setRotate)
                setIsXAxis(prev => !prev)
              }}
              className={styles.axisToggle}
            />
            <SelectPicker
              data={labelArray.map((item) => ({label: item, value: item}))}
              searchable={false}
              placeholder="Положение label"
              onChange={(value) => setLabelPosition(value)}
              className={styles.type}
            />
            <div className={styles.rotate_wrapper}>
              <label>Угол подписи</label>
              <InputNumber
                value={rotate}
                defaultValue={0}
                formatter={value => `${value} °`}
                onChange={(value) => setRotate(Number(value))}
                className={styles.rotate}
                placeholder={'Угол наклона'}
              />
            </div>

            {
              chartType === 'bar' && (
                <div className={styles.barWidth_wrapper}>
                  <label>Ширина бара</label>
                  <InputNumber
                    value={parseFloat(barCategoryGap)}
                    formatter={value => `${value} %`}
                    onChange={(value) => setBarCategoryGap(Number(value))}
                    className={styles.barWidth}
                    placeholder={'Ширина бара'}
                  />
                </div>
              )
            }


            {!isStacked && (
              <div className={styles.barWidth_wrapper}>
                <label>Bar Gap</label>
                <InputNumber
                  value={parseFloat(barGap)}
                  formatter={value => `${value} %`}
                  onChange={(value) => setBarGap(`${value}%`)}
                  className={styles.barWidth}
                  placeholder={'Ширина бара'}
                />
              </div>

            )

            }

          </div>
          <div className={styles.buttons}>
            <Button onClick={() => handleDownload(series)}>Скачать редактируемый pptx</Button>
            <Button onClick={handleAddChartSlide}>Скачать скриншот pptx</Button>
          </div>
        </div>

        {currentChart && <ChartDataTable open={open} handleClose={() => setOpen(false)} axes={series}/>}

      </div>

    </div>
  )
    ;
};