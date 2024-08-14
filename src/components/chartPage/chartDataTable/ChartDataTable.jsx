import styles from './chartDataTable.module.scss';
import {Button, Modal, Table, InputNumber} from 'rsuite';
import {prepareTableData} from './prepareTableData';
import {useEffect, useState} from "react";
import {convertTableDataToAxesFormat} from "./convertTableDataToAxesFormat";
import {useDispatch} from "react-redux";
import {setAxes} from "../../../store/chartSlice/chart.slice";

const {Column, HeaderCell, Cell} = Table;

export const ChartDataTable = ({open, handleClose, axes}) => {
const dispatch = useDispatch();
  const [table, setTable] = useState([])
  useEffect(() => {
    const tableData = prepareTableData(axes);
    setTable(tableData)
  }, [open]);
  // Преобразование данных для таблицы


  // Получение уникальных названий серий для столбцов таблицы
  const seriesNames = Object.keys(axes.seriesData);

  const handleValueChange = (value, rowIndex, seriesName) => {
    // Обновляем значение в таблице
    // Обновляем таблицу, заменяя строку по индексу
    setTable(prev => {
      // Клонируем старые данные, чтобы не изменять исходный массив
      const updatedTable = [...prev];
      // Обновляем строку по индексу
      updatedTable[rowIndex] = {
        ...updatedTable[rowIndex],
        [seriesName]: +value
      };
      return updatedTable;
    });
  };

  const handleSave = () => {
    dispatch(setAxes(convertTableDataToAxesFormat(table)))
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>Данные графика</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table
          virtualized
          height={400}
          data={table}
        >
          <Column width={150} align="center" fixed>
            <HeaderCell>Ось Х</HeaderCell>
            <Cell dataKey="xAxisLabel"/>
          </Column>
          {seriesNames.map((seriesName) => (
            <Column key={seriesName} width={150} align="center">
              <HeaderCell>{seriesName}</HeaderCell>
              <Cell>
                {(rowData, rowIndex) => {
                  // Проверка наличия значения перед рендерингом
                  const value = rowData ? rowData[seriesName] : '';
                  return (
                    <InputNumber
                      value={value}
                      onChange={(newValue) => handleValueChange(newValue, rowIndex, seriesName)}
                      style={{width: '100%'}}
                    />
                  );
                }}
              </Cell>
            </Column>
          ))}
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave} appearance="primary">
          Ok
        </Button>
        <Button onClick={handleClose} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};