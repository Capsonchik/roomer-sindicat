import styles from './chartList.module.scss';
import {Chart} from "./chart/Chart";
import {Button, Divider, Loader, useMediaQuery} from "rsuite";
import React, {useEffect, useState} from "react";
import {downloadPpt} from "./downloadPptx";
// import {charts} from "./chartMocks";
import {TopFilters} from "./topFilters/TopFilters";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllClients} from "../../store/chartSlice/chart.actions";
import {
  selectActiveClient, selectActiveGroupId, selectActiveReport,
  selectCharts,
  selectClients, selectErrorCharts, selectFilters, selectGroupsReports,
  selectIsChartLoading, selectIsOpenDrawer,
  selectReportsClients
} from "../../store/chartSlice/chart.selectors";
import {ChartDrawer} from "./chartDrawer/ChartDrawer";
import {setActiveChart, setOpenDrawer, setTypeGroupDrawer} from "../../store/chartSlice/chart.slice";
import {ChartListItem} from "./chartListItem/ChartListItem";
import {GroupDrawer} from "./groupDrawer/GroupDrawer";
import EditIcon from "@rsuite/icons/Edit";
import cl from "classnames";
import {GroupControlButtons} from "./groupControlButtons/GroupControlButtons";
import {getFilters} from "../../store/chartSlice/filter.actions";
import {CustomSelectPicker} from "../../components/rhfInputs/selectPicker/SelectPicker";
import {FormProvider, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
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
  const filters = useSelector(selectFilters)
  const groups = useSelector(selectGroupsReports);
  const [activeGroup, setActiveGroup] = useState()
  const [data, setData] = useState(charts)
  const [placeholderText, setPlaceholderText] = useState('')
  const [openGroupDrawer, setOpenGroupDrawer] = useState(false)
  const [resize, setResize] = useState(false)

  const [isTablet] = useMediaQuery('(max-width: 1200px)');

  const methods = useForm({
    // resolver: yupResolver(loginSchema),
    shouldFocusError: false,
    // defaultValues: {
    //   title: '',
    //   description: '',
    //   report_id: null
    // }
  })

  useEffect(() => {
    const foundGroup = groups.find((group) => group.group_id == activeGroupId)
    if (foundGroup) {
      setActiveGroup(foundGroup)
    } else if (groups.length) {
      setActiveGroup(groups[0])
    }
    // setActiveGroup(foundGroup)

  }, [activeGroupId, groups])

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
    if (!activeGroupId) return
    dispatch(getFilters(activeGroupId))
  }, [activeGroupId]);

  useEffect(() => {
    console.log('create')
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
        // console.log(11);
        setResize(false)
        setData([...charts]); // Перерендеринг списка
        // setResize(false)
        // setTimeout(() => {
        //   setResize(false)
        // }, 300);
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

  // useEffect(() => {
  //   // setResize(true)
  //   setData([...charts])
  //   // setResize(false)
  // }, [charts.length]);// Зависимость от charts, чтобы следить за изменениями данных

  // console.log(placeholderText)
  console.log(filters)
  return (

    <>
      <TopFilters/>
      {!!filters?.length && !isChartLoading && (
        <FormProvider {...methods}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 16,
            paddingInline:15
          }}>
            {filters.map((filter, i) => {

              return (
                // <p>dddd</p>
                <CustomSelectPicker key={i}
                  // disabled={true}
                                    name={'report_id'}
                  // defaultValue={activeReport}
                                    data={[]}
                  // data={filter.map((report) => ({
                  //   label: report.report_name,
                  //   value: report.report_id
                  // }))}
                                    searchable={false}
                                    placeholder={filter.filter_name}
                                    className={styles.select}
                  // container={getContainer}
                                    preventOverflow
                />
              )
            })}
          </div>
        </FormProvider>
      )}
      {/*{activeReport && <GroupControlButtons/>}*/}
      <div
        className={styles.list}>
        {(isChartLoading || resize) && (
          <div className={styles.loader_wrapper}>
            <Loader size={'lg'}/>
          </div>
        )}
        {/*{activeReport && !isChartLoading && !resize && (*/}
        {/*  <div className={styles.group_wrapper}>*/}
        {/*    <Button onClick={() => {*/}
        {/*      dispatch(setTypeGroupDrawer('edit'))*/}
        {/*      setOpenGroupDrawer(true)*/}
        {/*      // dispatch(setActiveChart(chart))*/}
        {/*      // dispatch(setOpenDrawer(true))*/}
        {/*    }}>*/}
        {/*      <EditIcon/>*/}
        {/*    </Button>*/}
        {/*    <h6 className={styles.title_group}>{activeGroup?.description}</h6>*/}

        {/*  </div>*/}
        {/*)}*/}
        {activeReport && !isChartLoading && !resize && (
          <div className={styles.info}>
            <h4 className={styles.group_name}>{activeGroup?.group_name}</h4>
            <h6 className={styles.title_group}>{activeGroup?.description}</h6>
          </div>
        )}
        {activeReport && <div
          // className={`${styles.wrapper} ${data.length % 2 === 0 ? styles.col_2 : ''} ${data.length === 3 ? styles.col_3 : ''}`}
          className={cl(styles.wrapper, {
            [styles.col_2]: data.length % 2 === 0,
            [styles.col_3]: Boolean(data.length % 2),
            [styles.isTablet]: isTablet
          })}
        >

          {!isChartLoading && !resize && data[0]?.title && data.map((chart, index) => (

            <ChartListItem key={index} chart={chart}/>
          ))}
        </div>}

        {activeReport && !isChartLoading && !data.length && (
          <div className={styles.placeholder}>
            <Divider>Нет графиков</Divider>

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
        {/*<GroupDrawer*/}
        {/*  activeGroup={activeGroup}*/}
        {/*  open={openGroupDrawer}*/}
        {/*  onClose={() => setOpenGroupDrawer(false)}*/}
        {/*/>*/}

      </div>


    </>

  );
};
