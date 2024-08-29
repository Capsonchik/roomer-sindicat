import styles from './topFilters.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {
  selectActiveClient, selectActiveGroupId, selectActiveReport, selectCharts,
  selectClients,
  selectGroupsReports, selectIsChartLoading,
  selectReportsClients
} from "../../../store/chartSlice/chart.selectors";
import React, {useEffect, useState} from "react";
import {
  fetchAllClients, fetchAllGroups,

  fetchAllReports
} from "../../../store/chartSlice/chart.actions";
import {CustomSelectPicker} from "../../../components/rhfInputs/selectPicker/SelectPicker";
import {FormProvider, useForm} from "react-hook-form";
import {GroupTabs} from "../groupTabs/GroupTabs";
import {setActiveClient, setActiveReport} from "../../../store/chartSlice/chart.slice";
import {Button, Uploader} from "rsuite";
import {downloadPpt} from "../downloadPptx";
import {convertDataCharts} from "./convertDataCharts";

export const TopFilters = () => {
  const dispatch = useDispatch();
  const methods = useForm()
  const clients = useSelector(selectClients)
  const reportsClients = useSelector(selectReportsClients)
  const groupsReports = useSelector(selectGroupsReports)
  const activeClient = useSelector(selectActiveClient)
  const activeReport = useSelector(selectActiveReport)
  const activeGroupId = useSelector(selectActiveGroupId)
  const charts = useSelector(selectCharts)
  const isChartLoading = useSelector(selectIsChartLoading)
  const [activeGroup, setActiveGroup] = useState()
  const groups = useSelector(selectGroupsReports);

  const [fileList, setFileList] = React.useState([]);
  const uploader = React.useRef();

  useEffect(() => {

    const foundGroup = groups.find((group) => group.group_id == activeGroupId)
    if (foundGroup) {
      setActiveGroup(foundGroup)
    } else if (groups.length) {
      setActiveGroup(groups[0])
    }

  }, [activeGroupId, groups])

  useEffect(() => {
    dispatch(fetchAllClients())
  }, []);


  // console.log(activeGroup,activeGroupId)
  const handleClientChange = (clientId) => {
    dispatch(fetchAllReports(clientId))

    if (clientId) {
      dispatch(setActiveClient(clientId))
    } else {
      dispatch(setActiveClient(null))
      dispatch(setActiveReport(null))
    }
  }
  const handleReportChange = (reportId) => {
    dispatch(fetchAllGroups(reportId))

    if (reportId) {
      dispatch(setActiveReport(reportId))
    } else {
      dispatch(setActiveReport(null))
    }
  }

  // const data = {
  //   title: JSON.stringify({
  //
  //     text: 'HML - анализ',
  //     fontSize: 14,
  //     h: 0.2,
  //     w: 8,
  //     yOffset: 0.2,
  //     xOffset: 0.2,
  //   }),
  //   description: JSON.stringify({
  //     text: 'Описание HML - анализ',
  //     fontSize: 14,
  //     h: 0.2,
  //     w: 8,
  //     yOffset: 0.2,
  //     xOffset: 0.2,
  //   }),
  //   charts: JSON.stringify([
  //     {
  //       title: 'Пиво Хеви',
  //       description: "Описание",
  //       formatting: {
  //         "type_chart": "bar",
  //         "column_width": 30,
  //         "column_gap": 0,
  //         "stack": false,
  //         "isXAxis": true,
  //         "visible": [],
  //         w: 3,
  //         h: 3,
  //         padding: 0.2,
  //         xOffset: 0.2,
  //         yOffset: 1
  //
  //       },
  //       xAxisData: ["хеви"],
  //       seriesData: {
  //         "2023-Q1": [1.5],
  //         "2024-Q1": [1.4]
  //       }
  //     },
  //   ])
  //
  // };
  const getDataCharts = ({charts, activeGroup}) => {
    return convertDataCharts({charts, activeGroup})
  }


  return (
    <FormProvider {...methods}>
      <div className={styles.wrapper}>
        <div className={styles.filters}>
          <CustomSelectPicker
            className={styles.clients_select}
            name={'clients'}
            placeholder={'Выберите клиента'}
            data={clients.map(client => ({value: client.client_id, label: client.client_name}))}
            onChangeOutside={value => {
              handleClientChange(value)
            }}
          />
          <CustomSelectPicker
            className={styles.clients_select}
            name={'reports'}
            value={activeReport}
            placeholder={'Выберите отчет'}
            data={reportsClients.map(report => ({value: report.report_id, label: report.report_name}))}
            onChangeOutside={value => {
              handleReportChange(value)
            }}
          />
        </div>
        {/*{!isChartLoading && activeReport && !!charts.length && (*/}
        {/*  <Uploader*/}
        {/*    ref={uploader}*/}
        {/*    className={styles.uploader}*/}
        {/*    autoUpload={false}*/}
        {/*    onChange={setFileList}*/}
        {/*    data={activeGroup && charts.length && getDataCharts({charts, activeGroup})}*/}
        {/*    action="https://7aa7-212-45-6-6.ngrok-free.app/api/v2/echart_graphs/form_data">*/}
        {/*    <Button>Выбрать файл</Button>*/}
        {/*  </Uploader>*/}
        {/*)}*/}

        {/*{!!fileList.length && (*/}
        {/*  <Button*/}
        {/*    disabled={!fileList.length}*/}
        {/*    onClick={() => {*/}
        {/*      uploader.current.start();*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Добавить слайд к файлу*/}
        {/*  </Button>*/}
        {/*)}*/}
        {!isChartLoading && activeReport && !!charts.length && <Button
          onClick={() => downloadPpt(charts, activeGroup)} // Передаем весь массив charts
          className={styles.save_pptx}
        >
          Скачать редактируемый pptx
        </Button>}


      </div>
      {!!groupsReports.length && activeReport && (
        <GroupTabs groupsReports={groupsReports} activeGroup={activeGroup}/>
      )}

    </FormProvider>
  )
}