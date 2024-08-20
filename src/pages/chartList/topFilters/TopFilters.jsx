import styles from './topFilters.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {selectClients, selectGroupsReports, selectReportsClients} from "../../../store/chartSlice/chart.selectors";
import {useEffect} from "react";
import {fetchAllClients, fetchAllGroups, fetchAllReports} from "../../../store/chartSlice/chart.actions";
import {CustomSelectPicker} from "../../../components/rhfInputs/selectPicker/SelectPicker";
import {FormProvider, useForm} from "react-hook-form";
import {GroupTabs} from "../groupTabs/GroupTabs";

export const TopFilters = () => {
  const dispatch = useDispatch();
  const methods = useForm()
  const clients = useSelector(selectClients)
  const reportsClients = useSelector(selectReportsClients)
  const groupsReports = useSelector(selectGroupsReports)

  useEffect(() => {
    dispatch(fetchAllClients())
  }, []);

  const handleClientChange = (clientId) => {
    dispatch(fetchAllReports(clientId))
  }
  const handleReportChange = (reportId) => {
    dispatch(fetchAllGroups(reportId))
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
          data={reportsClients.map(report => ({value: report.report_id, label: report.report_name}))}
          onChangeOutside={value => {
            handleReportChange(value)
          }}
        />
      </div>
      {!!groupsReports.length && (
        <GroupTabs/>
      )}

    </FormProvider>
  )
}