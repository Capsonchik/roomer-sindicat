import {Table} from "rsuite";
const { Column, ColumnGroup, HeaderCell, Cell } = Table;


const data = [
  { id: 1, city: 'New Gust', street: 'Dickinson Keys', firstName: 'Ernest', lastName: 'Anderson', company: 'Lebsack - Nicolas', email: 'Leora13@yahoo.com' },
  { id: 2, city: 'New Gust', street: 'Dickinson Keys', firstName: 'Janis', lastName: 'Bode', company: 'Glover - Hermiston', email: 'Mose_Gerhold51@yahoo.com' },
  { id: 3, city: 'New Gust', street: 'Legros Divide', firstName: 'Makenzie', lastName: 'Vandervort', company: 'Williamson - Kassulke', email: 'Frieda.Sauer61@gmail.com' },
  { id: 4, city: 'Vandervort', street: 'Mosciski Estate', firstName: 'Ciara', lastName: 'Towne', company: 'Hilpert, Eichmann and Brown', email: 'Eloisa.OHara@hotmail.com' },
  { id: 5, city: 'Vandervort', street: 'Mosciski Estate', firstName: 'Suzanne', lastName: 'Wolff', company: 'Mayer - Considine', email: 'Brisa46@hotmail.com' },
  { id: 6, city: 'Vandervort', street: 'Kali Spurs', firstName: 'Alessandra', lastName: 'Smith', company: 'Nikolaus and Sons', email: 'Cody.Schultz56@gmail.com' },
  { id: 7, city: 'Gilberthaven', street: 'Kali Spurs', firstName: 'Alessandra', lastName: 'Moore', company: 'Maggio LLC', email: 'Gaylord_Reichel16@yahoo.com' },
];


export const TableTest = () => {
  return (
    <Table bordered cellBordered autoHeight data={data} headerHeight={60}>
      <Column width={70} fixed>
        <HeaderCell>Id</HeaderCell>
        <Cell dataKey="id" />
      </Column>

      {/* Группировка по вертикали (Y) */}
      <ColumnGroup header="Location">
        <Column
          width={200}
          verticalAlign="middle"
          rowSpan={rowData => {
            const cityRowSpan = data.filter(d => d.city === rowData.city).length;
            return cityRowSpan;
          }}
        >
          <HeaderCell>City</HeaderCell>
          <Cell dataKey="city" />
        </Column>

        <Column
          width={200}
          // verticalAlign="middle"
          rowSpan={rowData => {
            const streetRowSpan = data.filter(d => d.street === rowData.street).length;
            return streetRowSpan;
          }}
        >
          <HeaderCell>Street</HeaderCell>
          <Cell dataKey="street" />
        </Column>
      </ColumnGroup>

      {/* Группировка по горизонтали (X) */}
      <ColumnGroup header="Person Info">
        <Column width={130}>
          <HeaderCell>First Name</HeaderCell>
          <Cell dataKey="firstName" />
        </Column>

        <Column width={130}>
          <HeaderCell>Last Name</HeaderCell>
          <Cell dataKey="lastName" />
        </Column>
      </ColumnGroup>

      <Column width={200}>
        <HeaderCell>Company Name</HeaderCell>
        <Cell dataKey="company" />
      </Column>

      <Column width={250}>
        <HeaderCell>Email</HeaderCell>
        <Cell dataKey="email" />
      </Column>
    </Table>
  );
}