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
import {Button} from "rsuite";
import {downloadPpt} from "../downloadPptx";

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

  useEffect(() => {
    const foundGroup = groups.find((group) => group.group_id == activeGroupId)
    setActiveGroup(foundGroup)

  }, [activeGroupId,groups])

  useEffect(() => {
    dispatch(fetchAllClients())
  }, []);


  console.log(activeGroup,activeGroupId)
  const handleClientChange = (clientId) => {
    dispatch(fetchAllReports(clientId))

    if(clientId) {
      dispatch(setActiveClient(clientId))
    }
    else {
      dispatch(setActiveClient(null))
      dispatch(setActiveReport(null))
    }
  }
  const handleReportChange = (reportId) => {
    dispatch(fetchAllGroups(reportId))

    if(reportId) {
      dispatch(setActiveReport(reportId))
    }
    else {
      dispatch(setActiveReport(null))
    }
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
        {!isChartLoading && activeReport && !!charts.length && <Button
          onClick={() => downloadPpt(charts,activeGroup)} // Передаем весь массив charts
          className={styles.save_pptx}
        >
          Скачать редактируемый pptx
        </Button>}
      </div>
      {!!groupsReports.length && activeReport && (
        <GroupTabs groupsReports={groupsReports}/>
      )}

    </FormProvider>
  )
}