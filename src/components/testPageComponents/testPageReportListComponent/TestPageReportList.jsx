import styles from './styles.module.scss';
import {TABLE_MOCK_DATA} from "../../mock/mockTable";
import {Button, Table} from "rsuite";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {fetchGetAllGraphs} from "../../../store/reportSlice/reportSlice.actions";

const { Column, HeaderCell, Cell } = Table;

export const TestPageReportList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGetAllGraphs())
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Table
        height={400}
        data={TABLE_MOCK_DATA}
        onRowClick={rowData => {
          console.log(rowData);
        }}
      >

        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={150}>
          <HeaderCell>Название отчета</HeaderCell>
          <Cell dataKey="reportName" />
        </Column>

        <Column width={150}>
          <HeaderCell>Дата создания</HeaderCell>
          <Cell dataKey="createdAt" />
        </Column>

        <Column width={150}>
          <HeaderCell>Автор</HeaderCell>
          <Cell dataKey="authorName" />
        </Column>

        <Column width={150}>
          <HeaderCell>Ссылка на отчет</HeaderCell>
          <Cell dataKey="link" />
        </Column>

      </Table>
    </div>
  );
};