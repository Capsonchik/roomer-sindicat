import {Button, Panel, Table} from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const data = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    gender: "Male",
    age: 32,
    postcode: 222-222,
    email: "john@example.com",

  }
]

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

        <Column width={150}>
          <HeaderCell>First Name</HeaderCell>
          <Cell dataKey="firstName" />
        </Column>

        <Column width={150}>
          <HeaderCell>Last Name</HeaderCell>
          <Cell dataKey="lastName" />
        </Column>

        <Column width={100}>
          <HeaderCell>Gender</HeaderCell>
          <Cell dataKey="gender" />
        </Column>

        <Column width={100}>
          <HeaderCell>Age</HeaderCell>
          <Cell dataKey="age" />
        </Column>

        <Column width={150}>
          <HeaderCell>Postcode</HeaderCell>
          <Cell dataKey="postcode" />
        </Column>

        <Column width={300}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>
        <Column width={80} fixed="right">
          <HeaderCell>...</HeaderCell>

          <Cell style={{ padding: '6px' }}>
            {rowData => (
              <Button appearance="link" onClick={() => alert(`id:${rowData.id}`)}>
                Edit
              </Button>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};