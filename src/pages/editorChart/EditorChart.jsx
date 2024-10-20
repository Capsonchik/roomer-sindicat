import React, {useEffect, useState} from 'react';
import * as echarts from 'echarts';
import styles from './editorChart.module.scss';
import {chartData, labelArray} from './stackBarMock';
import {chartOption, labelOption} from './chartConfig';
import {
  Button,
  ButtonToolbar,
  CheckPicker,
  InputNumber,
  Loader, Message,
  Radio,
  RadioGroup,
  SelectPicker,
  Toggle,
  useToaster
} from 'rsuite';
import {prepareDataForPptx} from './prepareDataForPptx';
import {getSumValues} from './getSumValues';
import {downloadPpt} from './downloadPptx';
import {downloadSnapshotPptx} from './downloadSnapshotPptx';
import {useDispatch, useSelector} from "react-redux";
import {fetchAllCharts, fetchChartById, patchChartById} from "../../store/chartSlice/chart.actions";
import {useNavigate, useParams} from "react-router-dom";
import {
  selectAxes,
  selectCurrentChartLoading,
  selectCurrentGraph,
  selectSaveChartLoading
} from "../../store/chartSlice/chart.selectors";
import {ROUTES_PATH} from "../../routes/RoutesPath";
import {handleRotate} from "./handleRotate";
import {ChartDataTable} from "../../components/chartPage/chartDataTable/ChartDataTable";
import {ChartDrawer} from "../../components/chartPage/chartDrawer/ChartDrawer";
import EditIcon from '@rsuite/icons/Edit';

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
  const saveChartLoading = useSelector(selectSaveChartLoading)
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
  const [formatLabel, setFormatLabel] = useState('data')
  const [sizeLabel, setSizeLabel] = useState(16)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [openDrawer, setOpenDrawer] = useState(false)
  const [colorBySeries, setColorBySeries] = useState(true)
  const [colorGroup, setColorGroup] = useState([])
  const toaster = useToaster();

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
      setTitle(currentChart.title)
      setDescription(currentChart.description)
      setChartType(currentChart.data.config.chartType)
      setSeries(currentChart.data.axes)
      if (currentChart.data.additionalFields.visibleSeries) {
        setVisibleSeries(currentChart.data.additionalFields.visibleSeries)
      } else {
        setVisibleSeries(Object.fromEntries(Object.keys(currentChart.data.axes.seriesData).map((name) => [name, true])))
      }

      if (typeof currentChart.data.additionalFields.isXAxis !== 'undefined') {
        setIsXAxis(currentChart.data.additionalFields.isXAxis)
      }

      if (currentChart.data.additionalFields.isStacked) {
        setIsStacked(true)
      }
      if (typeof currentChart.data.additionalFields.colorBySeries !== 'undefined') {
        setColorBySeries(currentChart.data.additionalFields.colorBySeries)
      }
      if (typeof currentChart.data.additionalFields.rotateLabel === 'number') {
        setRotate(currentChart.data.additionalFields.rotateLabel)
      }
      if (currentChart.data.additionalFields.labelPosition) {
        setLabelPosition(currentChart.data.additionalFields.labelPosition)
      }

      if(currentChart.data.additionalFields.colorGroup) {
        const newColorGroup = currentChart.data.axes.xAxisData.reduce((acc, item, index) => {
          acc[item] = currentChart.data.additionalFields.colorGroup[index];
          return acc
        }, {});
        setColorGroup(newColorGroup)

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
  console.log(chartInstance)

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
    const filteredColorGroup = series.xAxisData.map((item, index) => {
      return colorGroup[item]
    })
    // console.log(filteredArray)
    // Создаем опции для серий
    const seriesOptions = filteredArray.map((seriesName, i) => ({
      name: seriesName,
      type: chartType,
      stack: isStacked ? 'total' : null, // Устанавливаем стэк на основе состояния
      label: {
        ...labelOption,
        position: labelPosition,
        rotate: rotate,
        fontSize: sizeLabel,
        formatter: (value) => {
          if (formatLabel === 'all') {
            return `${value.data} ${value.seriesName}`
          }
          return value[formatLabel]
        }
      },
      // backgroundStyle: {
      //   color: 'red'
      // },
      // color: 'green',
      // itemStyle: {
      //   color: filteredColor[i], // Цвет линии для каждой серии
      // },
      // colorBy: colorBySeries,

      data: series.seriesData[seriesName], // Данные для видимых серий

      barCategoryGap: barCategoryGap, // Используем состояние для зазора между категориями
      barGap: barGap, // Используем состояние для зазора между столбиками
    }));


    const option = {
      ...chartOption(chartData),
      legend: {
        show: true,
        bottom: 0,
        selectedMode: false,
      },
      color:  filteredColor ,
      series: seriesOptions,
      xAxis: isXAxis ? {type: 'category', data: series.xAxisData} : {type: 'value'}, // Toggle axis
      yAxis: isXAxis ? {type: 'value'} : {type: 'category', data: series.xAxisData}, // Toggle axis

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
    series,
    formatLabel,
    sizeLabel,
    colorBySeries,
    colorGroup
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
      isXAxis,
      labelPosition,
      rotate
    });
  };

  const getChartBase64 = () => {
    if (chartInstance) {
      const dataURL = chartInstance.getDataURL({
        type: 'png', // можно использовать 'png', 'jpeg'
        pixelRatio: 5, // коэффициент пикселей для более высокого качества изображения
        backgroundColor: '#fff' // цвет фона для изображения
      });
      // console.log('1111',dataUrl)
      return dataURL; // Возвращает строку в формате base64
    }
    return null;
  };


  const handlePatchGraph = () => {
    const base64Image = getChartBase64(); // Получаем снимок графика

    const requestObj = {
      id: currentChart.id,
      title,
      description,
      data: {
        ...currentChart.data,
        axes: storeAxes ? storeAxes : currentChart.data.axes,
        config: {
          ...currentChart.data.config,
          chartType
        },
        additionalFields: {
          ...currentChart.data.additionalFields,
          visibleSeries,
          isXAxis,
          colorsForSingleItem: Object.values(lineColors),
          rotateLabel: rotate,
          labelPosition,
          // colorGroup: Object.values(colorGroup),
          // colorBySeries
        },
        preview: base64Image // Вставляем base64 строку в поле preview
      }
    };

    dispatch(patchChartById(requestObj)).then((res) => {
      dispatch(fetchAllCharts())
      toaster.push(<Message>Сохранено</Message>);
    });
  };

  const handleColorChange = (seriesName, color) => {
    setLineColors((prevColors) => ({
      ...prevColors,
      [seriesName]: color,
    }));
  };

  const handleColorChangeGroup = (seriesName, color) => {
    setColorGroup((prevColors) => ({
      ...prevColors,
      [seriesName]: color,
    }));
  };

  console.log(colorGroup)
  return (
    <div className={styles.wrapper}>
      <Button onClick={() => navigate('/main' + ROUTES_PATH.editorChart)}>Назад</Button>
      <div className={styles.title_wrapper}>
        <h4>{title}</h4>
        {title && <Button onClick={() => setOpenDrawer(true)}>
          <EditIcon/>
        </Button>}
      </div>
      <p>{description}</p>


      <div className={`${styles.layout} ${!currentChart ? '' : ''}`}>
        <div id="main" className={styles.chartContainer}></div>
        {/*  : */}
        {/*{currentChartLoading*/}
        {/*  ? <div className={styles.saveLoading}><Loader size={'lg'}/></div>*/}
        {/*}*/}

        <div className={styles.controls}>
          <div className={styles.menu}>
            <div className={styles.block}>
              <h6>Основное</h6>
              <div className={styles.line}>
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
                  renderMenuItem={(label, item) => (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <input
                        type="color"
                        value={lineColors[item.value]}
                        onChange={(e) => handleColorChange(item.value, e.target.value)}
                        style={{marginRight: 8}}
                      />
                      {label}
                    </div>
                  )}
                />
                <ButtonToolbar>
                  <Button onClick={handleOpen}> Данные графика</Button>
                </ButtonToolbar>
              </div>
              <div className={styles.line}>
                <SelectPicker
                  data={['bar', 'line'].map((item) => ({label: item, value: item}))}
                  value={chartType}
                  searchable={false}
                  placeholder="Выберите тип графика"
                  onChange={(value) => setChartType(value)}
                  className={styles.type}
                />

                <Toggle
                  size="lg"
                  checkedChildren="X Axis"
                  unCheckedChildren="Y Axis"
                  checked={isXAxis}
                  onChange={() => {
                    handleRotate(isXAxis, isStacked, setRotate)
                    setIsXAxis(prev => !prev)
                  }}
                  className={styles.axisToggle}
                />
              </div>


            </div>

            {/*<div className={styles.block}>*/}
            {/*  <h6>Цвет</h6>*/}
            {/*  <div className={styles.line}>*/}
            {/*    <Toggle*/}
            {/*      size="lg"*/}
            {/*      checkedChildren="Группы"*/}
            {/*      unCheckedChildren="Kолонки"*/}
            {/*      checked={colorBySeries}*/}
            {/*      onChange={() => {*/}
            {/*        setColorBySeries(!colorBySeries)*/}
            {/*      }}*/}
            {/*    />*/}
            {/*    {!colorBySeries && (*/}
            {/*      <CheckPicker*/}
            {/*        data={Object.keys(series.seriesData).map(name => ({value: name, label: name}))}*/}
            {/*        searchable={false}*/}
            {/*        c*/}
            {/*        appearance="default"*/}
            {/*        placeholder="Цвет колонок"*/}
            {/*        className={styles.select}*/}
            {/*        disabledItemValues={Object.keys(series.seriesData).map(name => name)}*/}
            {/*        renderMenuItem={(label, item) => (*/}
            {/*          <div style={{display: 'flex', alignItems: 'center'}}>*/}
            {/*            <input*/}
            {/*              type="color"*/}
            {/*              value={lineColors[item.value]}*/}
            {/*              onChange={(e) => handleColorChange(item.value, e.target.value)}*/}
            {/*              style={{marginRight: 8}}*/}
            {/*            />*/}
            {/*            {label}*/}
            {/*          </div>*/}
            {/*        )}*/}

            {/*      />*/}
            {/*    )}*/}
            {/*    {colorBySeries && (*/}
            {/*      <CheckPicker*/}
            {/*        data={series.xAxisData.map(name => ({value: name, label: name}))}*/}
            {/*        searchable={false}*/}
            {/*        c*/}
            {/*        appearance="default"*/}
            {/*        placeholder="Цвет групп"*/}
            {/*        className={styles.select}*/}
            {/*        disabledItemValues={Object.keys(series.xAxisData).map(name => name)}*/}
            {/*        renderMenuItem={(label, item) => (*/}
            {/*          <div style={{display: 'flex', alignItems: 'center'}}>*/}
            {/*            <input*/}
            {/*              type="color"*/}
            {/*              value={colorGroup[item.value]}*/}
            {/*              onChange={(e) => handleColorChangeGroup(item.value, e.target.value)}*/}
            {/*              style={{marginRight: 8}}*/}
            {/*            />*/}
            {/*            {label}*/}
            {/*          </div>*/}
            {/*        )}*/}

            {/*      />*/}
            {/*    )}*/}
            {/*  </div>*/}
            {/*</div>*/}

            <div className={styles.block}>
              <h6>Label</h6>
              <div className={styles.line}>
                <SelectPicker
                  data={labelArray.map((item) => ({label: item, value: item}))}
                  searchable={false}
                  placeholder="Положение label"
                  onChange={(value) => setLabelPosition(value)}
                  className={styles.type}
                  value={labelPosition}
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
              </div>
              <div className={styles.line}>
                <RadioGroup name="radio-group-inline" inline defaultValue="data" onChange={(value) => {
                  setFormatLabel(value)
                }}>
                  <Radio value="data">Значения</Radio>
                  <Radio value="seriesName">Название</Radio>
                  <Radio value="all">Значение и название</Radio>

                </RadioGroup>
                <InputNumber
                  formatter={value => `${value}px`}
                  value={sizeLabel}
                  placeholder={'Размер'}
                  onChange={(newValue) => {
                    console.log(newValue)
                    setSizeLabel(parseInt(newValue))
                  }}
                  style={{width: '100px'}}
                />
              </div>
            </div>

            {
              chartType === 'bar' && (
                <div className={styles.block}>
                  <h6>Bar</h6>
                  <div className={styles.line}>
                    <Toggle
                      size="lg"
                      checkedChildren="Stack"
                      unCheckedChildren="UnStack"
                      checked={isStacked}
                      onChange={() => {
                        handleRotate(isXAxis, isStacked, setRotate)
                        setIsStacked(!isStacked)
                      }}
                    />
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
                </div>
              )
            }


          </div>
          <div className={styles.buttons}>
            <Button onClick={() => handleDownload(series)}>Скачать редактируемый pptx</Button>
            <Button onClick={handleAddChartSlide}>Скачать скриншот pptx</Button>
          </div>
          <Button onClick={handlePatchGraph} loading={saveChartLoading} disabled={saveChartLoading}>Сохранить</Button>
        </div>

        {currentChart && <ChartDataTable open={open} handleClose={() => setOpen(false)} axes={series}/>}
        <ChartDrawer
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
        />
      </div>

    </div>
  )
    ;
};