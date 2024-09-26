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
  fetchAllClients
} from "../../store/chartSlice/chart.actions";
import {
  selectActiveClient, selectActiveGroupId, selectActiveReport,
  selectCharts,
  selectClients, selectErrorCharts, selectFilterLoading, selectFilters, selectGroupsReports,
  selectIsChartLoading, selectIsOpenDrawer,
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


  return (

    <>
      <TopFilters/>
      <GroupFilters/>
      <div
        className={styles.list}>
        {(isChartLoading || resize) && (
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
            [styles.col_2]: data.length % 2 === 0,
            [styles.col_3]: Boolean(data.length % 2) && data.length > 1,
            [styles.isTablet]: isTablet
          })}
        >

          {!isChartLoading && !resize && data[0]?.title && data.map((chart, index) => (

            <ChartTypeView key={index} chart={chart}/>
          ))}
        </div>}

        {activeReport && !isChartLoading && !data.length && (
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
