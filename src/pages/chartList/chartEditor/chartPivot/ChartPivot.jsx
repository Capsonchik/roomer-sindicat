import React, { useState } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import { aggregators } from 'react-pivottable/Utilities';
import './chartPivot.scss';
import { Button } from 'rsuite';
import { salesData } from './pivot.mocks';
import { useDispatch } from 'react-redux';
import { setActiveChart, setOpenDrawer } from '../../../../store/chartSlice/chart.slice';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const ChartPivot = ({ chart }) => {
  const dispatch = useDispatch();
  const russianAggregators = {
    Сумма: aggregators['Sum'],
    Максимум: aggregators['Maximum'],
    Минимум: aggregators['Minimum'],
    Количество: aggregators['Count'],
    Среднее: aggregators['Average'],
    Медиана: aggregators['Median'],
    'Количество уникальных': aggregators['Count Unique Values'],
    'Первое значение': aggregators['First'],
    'Последнее значение': aggregators['Last'],
  };

  const [state, setState] = useState({
    data: salesData,
    rows: ['region', 'product'],
    cols: ['sales', 'quantity', 'date'],
    aggregatorName: 'Сумма',
    vals: ['sales'],
    aggregators: russianAggregators,
  });

  const [isEditable, setIsEditable] = useState(true);
  const [columns, setColumns] = useState({
    column1: [],
    // column1: Object.keys(state.salesData[0]).filter(item => !state.rows.includes(item) &&  !state.cols.includes(item)),
    column2: state.rows,
    column3: state.cols,
  });

  const handleStateChange = (newState) => {
    setState((prev) => {
      console.log('prev', prev);
      console.log('new', newState);
      return newState;
    });
  };

  // Типы для DND
  const ITEM_TYPE = 'ITEM';

  // Элемент, который можно перетаскивать
  const DraggableItem = ({ name, index, column }) => {
    const [, drag] = useDrag({
      type: ITEM_TYPE,
      item: { name, index, column },
    });

    return (
      <div ref={drag} className="draggable-item">
        {name}
      </div>
    );
  };

  // Колонка, куда можно сбрасывать элементы
  const DroppableColumn = ({ children, columnName }) => {
    const [, drop] = useDrop({
      accept: ITEM_TYPE,
      drop: (item) => moveItem(item, columnName),
    });

    return (
      <div ref={drop} className="droppable-column">
        {children}
      </div>
    );
  };

  // Функция для перемещения элементов между колонками
  const moveItem = (item, toColumn) => {
    const fromColumn = item.column;

    // Проверяем, не пытается ли пользователь перетащить элемент в ту же колонку
    if (fromColumn === toColumn) {
      return;
    }

    setColumns((prevColumns) => {
      // Удаляем элемент из старой колонки
      const fromItems = [...prevColumns[fromColumn]];
      fromItems.splice(item.index, 1);

      // Добавляем элемент в новую колонку
      const toItems = [...prevColumns[toColumn], item.name];

      return {
        ...prevColumns,
        [fromColumn]: fromItems,
        [toColumn]: toItems,
      };
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div className={'editable'}>
          <div className={'title_wrapper'}>
            <h5>{chart.title}</h5>
          </div>
          <PivotTableUI onChange={(s) => handleStateChange(s)} {...state} />
        </div>

        {/* Блок с тремя колонками */}
        <div className="columns-container">
          <DroppableColumn columnName="column1">
            <h6>Доступно</h6>
            {columns.column1.map((item, index) => (
              <DraggableItem key={index} name={item} index={index} column="column1" />
            ))}
          </DroppableColumn>

          <DroppableColumn columnName="column2">
            <h6>ось X</h6>
            {columns.column2.map((item, index) => (
              <DraggableItem key={index} name={item} index={index} column="column2"/>
            ))}
          </DroppableColumn>

          <DroppableColumn columnName="column3">
            <h6>ось Y</h6>
            {columns.column3.map((item, index) => (
              <DraggableItem key={index} name={item} index={index} column="column3"/>
            ))}
          </DroppableColumn>
        </div>
      </div>
    </DndProvider>
  );
};
