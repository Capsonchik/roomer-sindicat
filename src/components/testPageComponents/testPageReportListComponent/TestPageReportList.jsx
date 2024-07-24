import styles from './styles.module.scss';
import {Table} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchGetAllGraphs} from "../../../store/reportSlice/reportSlice.actions";
import {useLocation} from "react-router-dom";
import {selectAllGraphs, selectError, selectTableLoader} from "../../../store/reportSlice/reportSlice.selectors";
import {dateFormatter} from "../../helpers/dateFormatter";
import {setGraphPreview, setIsDrawerOpen} from "../../../store/reportSlice/reportSlice";
import {PreviewDrawer} from "../../drawers/PreviewDrower/PreviewDrawer";

const { Column, HeaderCell, Cell } = Table;

export const TestPageReportList = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const loader = useSelector(selectTableLoader);
  const tableData = useSelector(selectAllGraphs);
  const error = useSelector(selectError);

  useEffect(() => {
    if(location.pathname === "/main/reportList") {
      dispatch(fetchGetAllGraphs())
    }
  }, [dispatch]);

  const handleOpenDrawer = (rowData) => {
    dispatch(setIsDrawerOpen(true))
    dispatch(setGraphPreview(rowData))
  }

  return (
    <div className={styles.container}>
      <Table
        loading={loader}
        height={700}
        data={!error ? tableData : []}
        onRowClick={rowData => {
          console.log(rowData);
        }}
      >
        <Column width={60} align="center" fixed>
          <HeaderCell>№</HeaderCell>
          <Cell dataKey="index" />
        </Column>

        {/*<Column width={60} align="center" fixed>*/}
        {/*  <HeaderCell>Id</HeaderCell>*/}
        {/*  <Cell dataKey="id" />*/}
        {/*</Column>*/}

        <Column width={250}>
          <HeaderCell>Название отчета</HeaderCell>
          <Cell dataKey="reportName" />
        </Column>

        <Column width={150}>
          <HeaderCell>Дата создания</HeaderCell>
          <Cell dataKey="createdAt" >
            {rowData => dateFormatter(rowData.createdAt)}
          </Cell>
        </Column>

        <Column width={150}>
          <HeaderCell>Описание</HeaderCell>
          <Cell dataKey="description" />
        </Column>

        <Column width={150}>
          <HeaderCell>Автор</HeaderCell>
          <Cell dataKey="authorName" />
        </Column>

        <Column width={200}>
          <HeaderCell>Ссылка на отчет</HeaderCell>
          <Cell dataKey="link">
            {rowData => <span className={styles.openPreview} onClick={() => handleOpenDrawer(rowData)}>Предпросмотр графика</span>}
          </Cell>
        </Column>

      </Table>
      <PreviewDrawer/>
    </div>
  );
};