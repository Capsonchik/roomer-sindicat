import styles from './chartList.module.scss';
import {Chart} from "./chart/Chart";
import {Button, Divider, Loader, useMediaQuery} from "rsuite";
import React, {useEffect, useRef, useState} from "react";
import {downloadPpt} from "./downloadPptx";
// import {charts} from "./chartMocks";
import {TopFilters} from "./topFilters/TopFilters";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchAllChartsByGroupId,
  fetchAllChartsFormatByGroupId,
  fetchAllClients, fetchChartById
} from "../../store/chartSlice/chart.actions";
import {
  selectActiveClient, selectActiveGroupId, selectActiveReport,
  selectCharts,
  selectClients, selectErrorCharts, selectFilterLoading, selectFilters, selectGroupsReports,
  selectIsChartLoading, selectIsLoadDependentFilters, selectIsOpenDrawer,
  selectReportsClients
} from "../../store/chartSlice/chart.selectors";
import {ChartDrawer} from "./chartDrawer/ChartDrawer";
import {
  setActiveChart,
  setDependentFilters,
  setFilterLoading,
  setOpenDrawer,
  setTypeGroupDrawer
} from "../../store/chartSlice/chart.slice";
import {ChartListItem} from "./chartListItem/ChartListItem";
import {GroupDrawer} from "./groupDrawer/GroupDrawer";
import EditIcon from "@rsuite/icons/Edit";
import cl from "classnames";
import {GroupControlButtons} from "./groupControlButtons/GroupControlButtons";
import {getFilters, postDependentFilters} from "../../store/chartSlice/filter.actions";
import {CustomSelectPicker} from "../../components/rhfInputs/selectPicker/SelectPicker";
import {FormProvider, useFieldArray, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {CustomCheckPicker} from "../../components/rhfInputs/checkPicker/CheckPicker";
import {selectCurrentUser} from "../../store/userSlice/user.selectors";
import {ChartTypeView} from "./chartTypeView/ChartTypeView";
import {selectActiveFilters, setFilters} from "../../store/chartSlice/filter.slice";
import {GroupFilters} from "./groupFilters/GroupFilters";
import {fetchGetGraphs} from "../../store/reportSlice/reportSlice.actions";
import {DataLensChartItem} from "./dataLensChartItem/DataLensChartItem";
import ShowcaseLayout from "./gridLayoutItem/GridLayoutItem";
import {TableTest} from "./tableTest/TableTest";
// import {charts} from "./chartMocks";

export const ChartList = (props) => {
  const dispatch = useDispatch();
  const charts = useSelector(selectCharts)
  const isChartLoading = useSelector(selectIsChartLoading)
  const activeClient = useSelector(selectActiveClient)
  const activeReport = useSelector(selectActiveReport)
  const isOpenDrawer = useSelector(selectIsOpenDrawer)
  const activeGroupId = useSelector(selectActiveGroupId)
  const errorCharts = useSelector(selectErrorCharts)
  const user = useSelector(selectCurrentUser)
  const filters = useSelector(selectFilters)
  const groups = useSelector(selectGroupsReports);
  const filterLoading = useSelector(selectFilterLoading);
  const filterDependentLoading = useSelector(selectIsLoadDependentFilters);
  const activeFilters = useSelector(selectActiveFilters)
  const [filtersState, setFiltersState] = useState([filters])


  const [activeGroup, setActiveGroup] = useState()
  const [data, setData] = useState(charts)
  const [placeholderText, setPlaceholderText] = useState('')
  const [openGroupDrawer, setOpenGroupDrawer] = useState(false)
  const [resize, setResize] = useState(false)

  const [isTablet] = useMediaQuery('(max-width: 1200px)');
  const isFirstRender = useRef(true)


  useEffect(() => {
    if (filterLoading !== 'idle') return
    const foundGroup = groups.find((group) => group.group_id == activeGroupId)
    if (foundGroup) {
      setActiveGroup(foundGroup)
    } else if (groups.length) {
      setActiveGroup(groups[0])
    }
    // setActiveGroup(foundGroup)

  }, [activeGroupId, groups, filterLoading])

  useEffect(() => {
    if (!activeClient) {
      setPlaceholderText('Выберите клиента')
    } else if (!activeReport) {
      setPlaceholderText('Выберите отчет')
    } else {
      setPlaceholderText('')
    }


  }, [activeClient, activeReport]);


  useEffect(() => {
    // console.log('create')
    setData(charts)
  }, [charts])
  // console.log(data)

  useEffect(() => {
    // console.log('444444444444444444')
    let resizeTimeout;

    const handleResize = () => {
      setResize(true)
      // setData([]); // Перерендеринг списка
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(() => {
        setResize(false)
        setData([...charts]); // Перерендеринг списка

      }, 300); // Задержка в 300 мс перед вызовом функции
    };

    // Добавляем слушатель события resize
    window.addEventListener('resize', handleResize);

    // Удаляем слушатель при размонтировании компонента
    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [charts]);

  const [dataLensCharts, setDataLensCharts] = useState([])

  useEffect(() => {
    if (activeGroupId) {
      setDataLensCharts([])
      dispatch(fetchGetGraphs(activeGroupId)).then((res) => {
        setDataLensCharts(res.payload)
      })

    }
  }, [activeGroupId]);
  // console.log(filterLoading)

  // if(filterLoading === 'load') {
  //   return (
  //     <Loader/>
  //   )
  // }
  const [layouts, setLayouts] = useState({lg: []});
  const [isEditMode, setIsEditMode] = useState(false); // состояние для редактирования


  const generateLayout = (data) => {
    const layout = data.map((item, index) => ({
      i: String(index), // уникальный идентификатор, оставляем индекс без изменений
      x: (index % 2) * 6, // два элемента в строке, по 6 единиц ширины каждый
      y: Math.floor(index / 2) * 2, // каждые два элемента на новой строке
      w: 6, // ширина элемента (половина ширины контейнера)
      h: 2, // высота элемента
      minW: 3, // минимальная ширина
      minH: 2, // минимальная высота
      maxW: 12, // максимальная ширина
      static: false, // чтобы элемент можно было перемещать
    }));

    // Специально обновляем первый элемент, делаем его таким же по ширине, как и остальные
    if (layout.length > 0) {
      layout[0] = {
        i: "0", // первый элемент должен сохранять свой индекс
        x: 0,
        y: 0,
        w: 6, // ширина элемента
        h: 2, // высота элемента
        minW: 3,
        minH: 2,
        maxW: 12,
        static: false, // элемент также должен перемещаться
      };

      if(layout.length === 1) {
        layout[0] = {
          i: "0", // первый элемент должен сохранять свой индекс
          x: 0,
          y: 0,
          w: 12, // ширина элемента
          h: 3, // высота элемента
          minW: 3,
          minH: 2,
          maxW: 12,
          static: false, // элемент также должен перемещаться
        };
      }
    }

    return {lg: layout};
  };


  useEffect(() => {
    // Генерация лейаута при изменении массива data
    if (data.length) {
      setLayouts(generateLayout(data));
    }
  }, [data]);

  const onLayoutChange = (layout, allLayouts) => {
    setLayouts(allLayouts);
  };


  return (

    <>
      <TopFilters layouts={layouts}/>
      <GroupFilters/>
      <div
        className={styles.list}>
        { (filterLoading === 'load')  && (
          <div className={styles.loader_wrapper}>
            <Loader size={'lg'}/>
          </div>
        )}

        {/*{activeReport && !isChartLoading && !resize && (*/}
        {/*  <div className={styles.info}>*/}
        {/*    <h4 className={styles.group_name}>{activeGroup?.group_name}</h4>*/}
        {/*    <h6 className={styles.title_group}>{activeGroup?.description}</h6>*/}
        {/*  </div>*/}
        {/*)}*/}
        {activeReport && <div
          // className={`${styles.wrapper} ${data.length % 2 === 0 ? styles.col_2 : ''} ${data.length === 3 ? styles.col_3 : ''}`}
          className={cl(styles.wrapper, {
            // [styles.col_2]: data.length % 2 === 0,
            // [styles.col_3]: Boolean(data.length % 2) && data.length > 1,
            // [styles.isTablet]: isTablet
          })}
        >

          {(filterLoading !== 'load' || !isChartLoading) && data[0]?.title && (
            <>

              <div
                className={styles.grid_wrapper}
                style={{
                width: '100%',
                // height: 'calc(100vh - 80px)',
                // padding: '20px',
                overflowY: 'auto',
                overflowX: 'hidden'
              }}>
                <ShowcaseLayout
                  onLayoutChange={onLayoutChange}
                  initialLayout={layouts.lg}
                  charts={data}>
                </ShowcaseLayout>
              </div>
            </>
          )}


          {/*{!filterDependentLoading && filterLoading !== 'load' && !isChartLoading && !resize && data[0]?.title && data.map((chart, index) => (*/}

          {/*  <div style={{*/}
          {/*    width: '100%',*/}
          {/*    height: 'calc(100vh - 80px)',*/}
          {/*    padding: '20px',*/}
          {/*    overflowY: 'auto',*/}
          {/*    overflowX: 'hidden'*/}
          {/*  }}>*/}
          {/*    <ShowcaseLayout onLayoutChange={onLayoutChange} initialLayout={layouts.lg}*/}
          {/*                    chart={<ChartTypeView key={index} chart={chart}/>}>*/}
          {/*      /!*<ChartTypeView key={index} chart={chart}/>*!/*/}
          {/*    </ShowcaseLayout>*/}
          {/*  </div>*/}
          {/*))}*/}


          {/*{dataLensCharts?.map(dataLensChart => {*/}
          {/*  return (*/}
          {/*   <DataLensChartItem dataLensChart={dataLensChart}/>*/}

          {/*  )*/}
          {/*})}*/}
        </div>}

        {activeReport && filterLoading !== 'load' && !isChartLoading && !data.length && (
          <div className={styles.placeholder}>
            <Divider>{errorCharts ? 'По выбранным фильтрам нет данных' : 'Нет графиков'}</Divider>

          </div>
        )}


        {placeholderText && <div className={styles.placeholder}>
          <Divider>{placeholderText}</Divider>
        </div>}

      </div>
      <div className={styles.btn_wrapper}>


        <ChartDrawer
          open={isOpenDrawer}
          onClose={() => dispatch(setOpenDrawer(false))}
        />


      </div>


    </>

  );
};
