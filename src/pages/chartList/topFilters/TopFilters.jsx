import styles from './topFilters.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {
  selectActiveClient, selectActiveReport,
  selectClients,
  selectGroupsReports,
  selectReportsClients
} from "../../../store/chartSlice/chart.selectors";
import {useEffect} from "react";
import {
  fetchAllClients, fetchAllGroups,

  fetchAllReports
} from "../../../store/chartSlice/chart.actions";
import {CustomSelectPicker} from "../../../components/rhfInputs/selectPicker/SelectPicker";
import {FormProvider, useForm} from "react-hook-form";
import {GroupTabs} from "../groupTabs/GroupTabs";
import {setActiveClient, setActiveReport} from "../../../store/chartSlice/chart.slice";

export const TopFilters = () => {
  const dispatch = useDispatch();
  const methods = useForm()
  const clients = useSelector(selectClients)
  const reportsClients = useSelector(selectReportsClients)
  const groupsReports = useSelector(selectGroupsReports)
  const activeClient = useSelector(selectActiveClient)
  const activeReport = useSelector(selectActiveReport)

  useEffect(() => {
    dispatch(fetchAllClients())
  }, []);



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
        <CustomSelectPicker
          className={styles.clients_select}
          name={'clients'}

          data={clients.map(client => ({value: client.client_id, label: client.client_name}))}
          onChangeOutside={value => {
            handleClientChange(value)
          }}
        />
        <CustomSelectPicker
          className={styles.clients_select}
          name={'reports'}
          value={activeReport}
          data={reportsClients.map(report => ({value: report.report_id, label: report.report_name}))}
          onChangeOutside={value => {
            handleReportChange(value)
          }}
        />
      </div>
      {!!groupsReports.length && activeReport && (
        <GroupTabs groupsReports={groupsReports}/>
      )}

    </FormProvider>
  )
}