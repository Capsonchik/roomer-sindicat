import styles from './chartList.module.scss';
import {Chart} from "./chart/Chart";
import {Button, Divider, Loader} from "rsuite";
import React, {useEffect, useState} from "react";
import {downloadPpt} from "./downloadPptx";
// import {charts} from "./chartMocks";
import {TopFilters} from "./topFilters/TopFilters";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllClients} from "../../store/chartSlice/chart.actions";
import {
  selectActiveClient, selectActiveGroupId, selectActiveReport,
  selectCharts,
  selectClients, selectGroupsReports,
  selectIsChartLoading, selectIsOpenDrawer,
  selectReportsClients
} from "../../store/chartSlice/chart.selectors";
import {ChartDrawer} from "./chartDrawer/ChartDrawer";
import {setActiveChart, setOpenDrawer} from "../../store/chartSlice/chart.slice";
import {ChartListItem} from "./chartListItem/ChartListItem";
import {GroupDrawer} from "./groupDrawer/GroupDrawer";
import EditIcon from "@rsuite/icons/Edit";
// import {charts} from "./chartMocks";

export const ChartList = (props) => {
  const dispatch = useDispatch();
  const charts = useSelector(selectCharts)
  const isChartLoading = useSelector(selectIsChartLoading)
  const activeClient = useSelector(selectActiveClient)
  const activeReport = useSelector(selectActiveReport)
  const isOpenDrawer = useSelector(selectIsOpenDrawer)
  const activeGroupId = useSelector(selectActiveGroupId)
  const groups = useSelector(selectGroupsReports);
  const [activeGroup, setActiveGroup] = useState()
  const [data, setData] = useState(charts)
  const [placeholderText, setPlaceholderText] = useState('')
  const [openGroupDrawer, setOpenGroupDrawer] = useState(false)

  useEffect(() => {
    const foundGroup = groups.find((group) => group.group_id == activeGroupId)
    setActiveGroup(foundGroup)

  }, [activeGroupId,groups])

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
    setData(charts)
  }, [charts])
  // console.log(data)

  // Добавьте хук useEffect для отслеживания изменения размера окна
  // useEffect(() => {
  //   console.log(11)
  //   const handleResize = () => {
  //     // Обновите состояние, чтобы вызвать перерендеринг
  //     setData([...charts]); // Перерендеринг списка
  //   };
  //
  //   // Добавляем слушатель события resize
  //   window.addEventListener('resize', handleResize);
  //
  //   // Удаляем слушатель при размонтировании компонента
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, [charts]); // Зависимость от charts, чтобы следить за изменениями данных


  return (

    <>
      <TopFilters/>
      <div
        className={styles.list}>
        {isChartLoading && (
          <div className={styles.loader_wrapper}>
            <Loader size={'lg'}/>
          </div>
        )}
        {activeReport && !isChartLoading && (
          <div className={styles.group_wrapper}>
            <Button onClick={() => {
              setOpenGroupDrawer(true)
              // dispatch(setActiveChart(chart))
              // dispatch(setOpenDrawer(true))
            }}>
              <EditIcon/>
            </Button>
            <h6 className={styles.title_group}>{activeGroup?.description}</h6>

          </div>
        )}
        {activeReport && <div
          className={`${styles.wrapper} ${data.length % 2 === 0 ? styles.col_2 : ''} ${data.length === 3 ? styles.col_3 : ''}`}>

          {!isChartLoading && data[0]?.title && data.map((chart, index) => (

            <ChartListItem key={index} chart={chart}/>
          ))}
        </div>}
        {/*{activeReport && <div*/}
        {/*  className={`${styles.wrapper} ${data.length % 2 === 0 ? styles.col_2 : ''} ${data.length === 3 ? styles.col_3 : ''}`}>*/}
        {/*  {!isChartLoading && data[0]?.title && data.map((chart, index) => (*/}

        {/*    <ChartListItem key={index} chart={chart}/>*/}
        {/*  ))}*/}
        {/*</div>}*/}


      </div>
      <div className={styles.btn_wrapper}>
        {/*{!isChartLoading && activeReport && <Button*/}
        {/*  onClick={() => downloadPpt(charts)} // Передаем весь массив charts*/}
        {/*  className={styles.save_pptx}*/}
        {/*>*/}
        {/*  Скачать pptx*/}
        {/*</Button>}*/}


        {placeholderText && <div className={styles.placeholder}>
          <Divider>{placeholderText}</Divider>
        </div>}

        <ChartDrawer
          open={isOpenDrawer}
          onClose={() => dispatch(setOpenDrawer(false))}
        />
        <GroupDrawer
          activeGroup={activeGroup}
          open={openGroupDrawer}
          onClose={() => setOpenGroupDrawer(false)}
        />

      </div>


    </>

  );
};
