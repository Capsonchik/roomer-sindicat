import {Panel, Table} from "rsuite";
import {data} from "../../../consts/tableData";
const { Column, HeaderCell, Cell } = Table;



export const ReportList = () => {
  return (
    <div style={{padding: 8, width: '100%'}}>
      <h3>Список ранее подготовленных отчетов</h3>
      <Panel header="Фильтрация" bordered style={{marginBottom: 16}}>
        Парметры фильтрации??
      </Panel>
      <Table
        height={400}
        data={data}
        onRowClick={rowData => {
          console.log(rowData);
        }}
      >
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={200}>
          <HeaderCell>Дата создания</HeaderCell>
          <Cell dataKey="startDate" />
        </Column>

        <Column width={400}>
          <HeaderCell>Название отчета</HeaderCell>
          <Cell dataKey="reportName" />
        </Column>

        <Column width={400}>
          <HeaderCell>Ссылка</HeaderCell>
          <Cell dataKey="link"/>
        </Column>

      </Table>
    </div>
  );
};