import {Container, Nav, Navbar, SelectPicker, Heading, Text} from "rsuite";
import CogIcon from '@rsuite/icons/legacy/Cog';
import styles from './styles.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {
  fetchGetAllClients,
  fetchGetClientReports,
  fetchGetGraphs,
  fetchGetGroups
} from "../../store/reportSlice/reportSlice.actions";
import {
  selectAllClients,
  selectClientReports, selectGraphs,
  selectGroups,
  selectReportTitle
} from "../../store/reportSlice/reportSlice.selectors";
import {clearGraphs, setReportId, setReportTitle} from "../../store/reportSlice/reportSlice";

export const TestPage = () => {
  const dispatch = useDispatch();
  const allClients = useSelector(selectAllClients);
  const allClientReports = useSelector(selectClientReports);
  const groups = useSelector(selectGroups);
  const graphs = useSelector(selectGraphs);
  const reportTitle = useSelector(selectReportTitle)
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
    const foundClient = clientData.find(client => client.value === selectedOption);
    dispatch(fetchGetClientReports(foundClient.id))
  };

  const handleReportSelect = (value) => {
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

  function checkGraphsLength(graphs) {
    switch (graphs.length) {
      case 1:
        return styles.graphBig;
      case 2:
        return styles.graphMedium;
      case 3:
        return styles.graphSmall;
      default:
        return styles.graphsBlock;
    }
  }

  return (
    <Container>
      <Navbar appearance={'subtle'}>
        <Navbar.Brand href="#">РОМИР</Navbar.Brand>
        <Nav>
          <Nav.Item>Главная</Nav.Item>
          <Nav.Item>Отчет</Nav.Item>
          <Nav.Item>Products</Nav.Item>
          <Nav.Menu title="About">
            <Nav.Item>Company</Nav.Item>
            <Nav.Item>Team</Nav.Item>
            <Nav.Menu title="Contact">
              <Nav.Item>Via email</Nav.Item>
              <Nav.Item>Via telephone</Nav.Item>
            </Nav.Menu>
          </Nav.Menu>
        </Nav>
        <Nav pullRight>
          <Nav.Item icon={<CogIcon/>}>Settings</Nav.Item>
        </Nav>
      </Navbar>
      <div className={styles.filtersBlock}>
        <SelectPicker data={allClients && clientData} style={{width: 224}} placeholder={'Клиент'} onChange={handleClientSelectChange}/>
        <SelectPicker data={allClientReports && reportData} style={{width: 224}} placeholder={'Отчеты'} onChange={handleReportSelect}/>
        <SelectPicker data={groups ? graphData : data} style={{width: 224}} placeholder={'Группы отчетов'} onChange={handleGraphGroupSelect}/>
      </div>
      <div className={styles.content}>
        {reportTitle ? <Heading level={4}>{reportTitle}</Heading> : null}
        <div className={styles.graphContent}>
          {graphs && graphs.map((graph) => {
            return (
              <div className={checkGraphsLength(graphs)}>
                <span className={styles.graphTitle}>{graph.title}</span>
                <iframe
                  title={graph.title}
                  width="100%"
                  height="500"
                  seamless
                  frameBorder="0"
                  scrolling="no"
                  src={graph.link}
                >
                </iframe>
                <Text muted>{graph.description}</Text>
              </div>
            )
          })}
        </div>
      </div>

    </Container>
  );
};