import styles from './styles.module.scss';
import {Button, SelectPicker} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {
  selectAllClients,
  selectClientReports, selectCurrentClient,
  selectGroups,
} from "../../../store/reportSlice/reportSlice.selectors";
import {useEffect, useState} from "react";
import {
  fetchGetAllClients,
  fetchGetClientReports, fetchGetGraphs,
  fetchGetGroups
} from "../../../store/reportSlice/reportSlice.actions";
import {
  clearGraphs,
  setReportId,
  setReportTitle,
  clearGroupReports,
  setCurrentClient, clearClientReports
} from "../../../store/reportSlice/reportSlice";

export const TestPageFilterComponent = () => {
  const dispatch = useDispatch();
  const allClients = useSelector(selectAllClients);
  const allClientReports = useSelector(selectClientReports);
  const currentClient = useSelector(selectCurrentClient);
  const groups = useSelector(selectGroups);


  const [selectedReport, setSelectedReport] = useState(null);


  const data = ['Необходимо выполнить предыдущие шаги'].map(
    item => ({ label: item, value: item })
  );

  const clientData = allClients.map(
    item => ({ label: item.client_name, value: item.client_name, id: item.client_id })
  )

  const reportData = allClientReports.map(
    item => ({ label: item.report_name, value: item.report_name, id: item.report_id })
  )

  const graphData = groups && groups.map(
    item => ({ label: item.group_name, value: item.group_name, id: item.group_id })
  )

  useEffect(() => {
    dispatch(fetchGetAllClients())
  }, [dispatch]);

  const handleClientSelectChange = (selectedOption) => {
    if(!selectedOption) {
      dispatch(clearClientReports())
      dispatch(setReportId(null))
      dispatch(setCurrentClient(null))
      dispatch(clearGroupReports())
      setSelectedReport(null);
      return
    }
    const foundClient = clientData.find(client => client.value === selectedOption);
    dispatch(fetchGetClientReports(foundClient.id))
    dispatch(setCurrentClient(foundClient))
    setSelectedReport(null);
  };

  const handleReportSelect = (value) => {
    setSelectedReport(value);
    if(!value) {
      dispatch(clearGroupReports())
      return
    }
    const foundClient = reportData.find(client => client.value === value);
    dispatch(fetchGetGroups(foundClient.id))
    dispatch(setReportId(foundClient.id))

  }

  const handleGraphGroupSelect = (value) => {
    const foundClient = graphData.find(client => client.value === value);
    dispatch(clearGraphs())
    dispatch(fetchGetGraphs(foundClient.id))
    dispatch(setReportTitle(value))
  }
  return (

    <div className={styles.filtersBlock}>
      <SelectPicker data={allClients && clientData} style={{width: 224}} placeholder={'Клиент'}
                    onChange={handleClientSelectChange}
      />
      <SelectPicker value={selectedReport} data={allClients && reportData} style={{width: 224}} placeholder={'Отчеты'}
                    onChange={handleReportSelect}/>
      {/*<SelectPicker data={groups ? graphData : data} style={{width: 224}} placeholder={'Группы отчетов'}*/}
      {/*              onChange={handleGraphGroupSelect}/>*/}
      {/*<Button>Save to ppt</Button>*/}
    </div>
  );
};