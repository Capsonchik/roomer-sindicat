import styles from './chartList.module.scss';
import {Chart} from "./chart/Chart";
import {Button, Divider, Loader, useMediaQuery} from "rsuite";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
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
  selectActiveClient,
  selectActiveGraphsPosition,
  selectActiveGroupId,
  selectActiveReport,
  selectCharts,
  selectClients,
  selectCurrentGroup, selectCurrentGroupLoading,
  selectErrorCharts,
  selectFilterLoading,
  selectFilters,
  selectGraphsPosition,
  selectGroupsReports,
  selectIsChartLoading,
  selectIsLoadDependentFilters,
  selectIsOpenDrawer,
  selectReportsClients
} from "../../store/chartSlice/chart.selectors";
import {ChartDrawer} from "./chartDrawer/ChartDrawer";
import {
  setActiveChart, setActiveGraphsPosition,
  setDependentFilters,
  setFilterLoading, setGraphsPosition,
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
import {GroupFiltersWrapper} from "./groupFilters/GroupFIltersWrapper";
// import {charts} from "./chartMocks";

export const ChartList = (props) => {
  const dispatch = useDispatch();
  const charts = useSelector(selectCharts)
  const isChartLoading = useSelector(selectIsChartLoading)
  const activeClient = useSelector(selectActiveClient)
  const activeReport = useSelector(selectActiveReport)
  const isOpenDrawer = useSelector(selectIsOpenDrawer)
  const activeGroupId = useSelector(selectActiveGroupId)
  const activeGroup = useSelector(selectCurrentGroup)


  const errorCharts = useSelector(selectErrorCharts)
  const user = useSelector(selectCurrentUser)
  const filters = useSelector(selectFilters)
  const groups = useSelector(selectGroupsReports);
  const filterLoading = useSelector(selectFilterLoading);
  const filterDependentLoading = useSelector(selectIsLoadDependentFilters);
  const activeFilters = useSelector(selectActiveFilters)
  const activeGraphsPosition = useSelector(selectActiveGraphsPosition);
  const [filtersState, setFiltersState] = useState([filters])
  const graphsPosition = useSelector(selectGraphsPosition);
  const currentGroupLoading = useSelector(selectCurrentGroupLoading)


  // const [activeGroup, setActiveGroup] = useState()
  const [data, setData] = useState(charts)
  const [placeholderText, setPlaceholderText] = useState('')
  const [openGroupDrawer, setOpenGroupDrawer] = useState(false)
  const [resize, setResize] = useState(false)

  const [isTablet] = useMediaQuery('(max-width: 1200px)');
  const isFirstRender = useRef(true)
  const [images, setImages] = useState([])
  const [groupLoading, setGroupLoading] = useState(true)
  // console.log(images)

  //
  // useEffect(() => {
  //   // setImages([])
  //   if (filterLoading !== 'idle') return
  //   // console.log(groups,activeGroupId)
  //   const foundGroup = groups.find((group) => group.group_id == activeGroupId)
  //   if (foundGroup) {
  //     setActiveGroup(foundGroup)
  //     setGroupLoading(false)
  //
  //   } else if (groups.length) {
  //     setActiveGroup(groups[0])
  //     setGroupLoading(false)
  //
  //   }
  //
  // }, [activeGroupId, groups, filterLoading, charts])


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


  const [layouts, setLayouts] = useState({lg: []});


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

      if (layout.length === 1) {
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
    // console.log(activeGroup)
    let positions = []
    // console.log(activeGroup)
    if (activeGroup?.graphs_position) {
      dispatch(setActiveGraphsPosition(activeGroup.graphs_position.id))
      positions = activeGroup.graphs_position.positions
    } else {
      dispatch(setActiveGraphsPosition(null))
    }

    return {lg: activeGroup?.graphs_position ? positions : layout};
  };

  useEffect(() => {
    if (activeGroup && activeGroup.graphs_position) {
      dispatch(setGraphsPosition(activeGroup?.graphs_position.positions))

    }

  }, [activeGroup]);

  useEffect(() => {

    if (data.length) {

      setLayouts(generateLayout(data));
    }

  }, [data.length, activeGroup]);

  useEffect(() => {
    console.log('griup', activeGroup)
    if(activeGroup?.images) {
      setLayouts(generateLayout(activeGroup?.images));
      setData(activeGroup?.images.map(img => ({...img, title: 'image', formatting: {type_chart: 'image',}})))
    }

  }, [activeGroup]);


  const onLayoutChange = (layout, allLayouts) => {
    setLayouts(allLayouts);
    dispatch(setGraphsPosition(allLayouts))
  };

  const [topOffset, setTopOffset] = useState(0);
  const topFiltersRef = useRef(null);
  const groupFiltersRef = useRef(null);

  useLayoutEffect(() => {
    const calculateTop = () => {
      const topFiltersHeight = topFiltersRef.current?.offsetHeight || 0;
      const groupFiltersHeight = groupFiltersRef.current?.offsetHeight || 0;
      const totalTopOffset = topFiltersHeight + groupFiltersHeight;
      setTopOffset(totalTopOffset);
    };

    calculateTop();

    // Пересчитываем при изменении окна
    window.addEventListener('resize', calculateTop);
    return () => window.removeEventListener('resize', calculateTop);
  }, []);

  console.log(data)
  return (

    <>
      <div ref={topFiltersRef}>
        <TopFilters layouts={layouts}/>

      </div>
      <div ref={groupFiltersRef}>
        {/*GroupFiltersWrapper*/}
        {!activeGroup?.images && <GroupFiltersWrapper groups={groups}/>}


      </div>
      <div
        style={{
          top: `${topOffset}px`,
          height: `calc(100vh - ${topOffset + 80}px)`,
        }}
        className={styles.list}>
        { (isChartLoading || filterLoading === 'load') &&  (
          <div className={styles.loader_wrapper}>
            <Loader size={'lg'}/>
          </div>
        )}


        {activeReport &&  <div
          // className={`${styles.wrapper} ${data.length % 2 === 0 ? styles.col_2 : ''} ${data.length === 3 ? styles.col_3 : ''}`}
          className={cl(styles.wrapper, {
            // [styles.col_2]: data.length % 2 === 0,
            // [styles.col_3]: Boolean(data.length % 2) && data.length > 1,
            // [styles.isTablet]: isTablet
          })}
        >

          {(!filterLoading || !isChartLoading ) && data[0]?.title && (
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
                  initialLayout={activeGroup?.graphs_position?.positions ? activeGroup?.graphs_position?.positions : layouts.lg}
                  charts={data}
                  // images={images}
                >
                </ShowcaseLayout>
              </div>
            </>
          )}


        </div>}

        {activeReport && !filterLoading && !isChartLoading && !data.length && (
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
