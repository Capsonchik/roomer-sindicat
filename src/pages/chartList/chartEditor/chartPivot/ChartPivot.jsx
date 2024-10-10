import {selectActiveGroupId, selectFilters, selectGroupsReports} from "../../../../store/chartSlice/chart.selectors";
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';
import {ModuleRegistry} from '@ag-grid-community/core';
import {AgGridReact} from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {localeText} from "./agGridLocale";
import {ColumnsToolPanelModule} from "@ag-grid-enterprise/column-tool-panel";
import {MenuModule} from "@ag-grid-enterprise/menu";
import {RowGroupingModule} from "@ag-grid-enterprise/row-grouping";
import {FiltersToolPanelModule} from "@ag-grid-enterprise/filter-tool-panel";
import {agGridData} from "./agGridData";
import styles from './agGrid.module.scss'
import {Button} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import {useDispatch, useSelector} from "react-redux";
import {setActiveChart, setOpenDrawer} from "../../../../store/chartSlice/chart.slice";
import {
  fetchAllChartsByGroupId,
  fetchAllChartsFormatByGroupId,
  patchChartFormatting
} from "../../../../store/chartSlice/chart.actions";
import {selectCurrentUser} from "../../../../store/userSlice/user.selectors";
import {HTML5Backend} from "react-dnd-html5-backend";
import {useDrag, useDrop, DndProvider} from 'react-dnd';
import {salesData} from "./pivot.mocks";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MenuModule,
  RowGroupingModule,
  FiltersToolPanelModule,
]);


// Типы для DND
const ITEM_TYPE = 'ITEM';


export const ChartPivot = ({chart, columnsDef}) => {
  const user = useSelector(selectCurrentUser)
  const activeGroupId = useSelector(selectActiveGroupId)
  const groupsReports = useSelector(selectGroupsReports)
  const filters = useSelector(selectFilters)
  const gridRef = useRef(null);
  const dispatch = useDispatch()
  const [rowData, setRowData] = useState(chart?.['0']?.table_data ?? []);

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();


    if (chart.formatting.rowGroups) {
      gridRef.current.api.setRowGroupColumns(chart.formatting.rowGroups);
    }
    if (chart.formatting.colGroups) {
      gridRef.current.api.setPivotColumns(chart.formatting.colGroups);
    }
    if (chart.formatting.values) {
      gridRef.current.api.setValueColumns(chart.formatting.values);
    }


    params.api.expandAll(); // Раскрываем все группы
  }
  console.log(columnsDef)

  const autoGroupColumnDef = useMemo(() => ({
    headerName: "Группы",
    minWidth: 200,
    cellRenderer: 'agGroupCellRenderer',
    pinned: "left",
  }), []);


  const handlePatch = () => {
    const rowGroupColumns = gridRef.current.api.getRowGroupColumns().map(col => col.getColId());
    const valueColumns = gridRef.current.api.getValueColumns().map(col => col.getColId());
    const pivotColumns = gridRef.current.api.getPivotColumns().map(col => col.getColId());


    const {graph_id, xAxisData, seriesData, ...rest} = chart
    const {isVisibleSeriesChange, ...restFormatting} = rest.formatting
    const request = {
      ...rest, formatting: {
        ...restFormatting,
        rowGroups: rowGroupColumns,
        colGroups: pivotColumns,
        values: valueColumns,
      }
    }
    dispatch(patchChartFormatting(request)).then(() => {
      const id = activeGroupId || groupsReports[0].group_id
      const activeFiltersRequest = filters
      // console.log('activeFilters[activeGroupId]',activeFilters[activeGroupId])
      const request = activeFiltersRequest
        .map(filter => {
          return {
            filter_id: filter.filter_id,
            filter_values: filter.value,
            isactive: filter.isactive,
          }
        })
        .filter(filter => filter.isactive && Array.isArray(filter.filter_values) && filter.filter_values.length > 0)
      dispatch(fetchAllChartsByGroupId({groupId: id, filter_data: {filter_data: request}})).then(() => {
        dispatch(fetchAllChartsFormatByGroupId(id))
      })

    })

    dispatch(setOpenDrawer(false))

  }


  const [columns, setColumns] = useState({
    availableColumnValues: ['1'],
    availableColumnXY: ['2'],
    rows: ['region', 'product'],
    cols: ['sales', 'quantity', 'date'],
    values: ['dddd']
  });

  const moveItem = (item, toColumn) => {
    const fromColumn = item.column;
    const targetIndex = item.targetIndex; // Получаем индекс целевого элемента
    console.log(item)
    // Если перемещаем в ту же колонку
    if (fromColumn === toColumn) {
      const fromItems = [...columns[fromColumn]];
      const [movedItem] = fromItems.splice(item.index, 1); // Удаляем элемент
      fromItems.splice(targetIndex, 0, movedItem); // Вставляем элемент на новое место

      setColumns((prevColumns) => ({
        ...prevColumns,
        [fromColumn]: fromItems,
      }));
    } else {
      // Если перемещаем между колонками
      const fromItems = [...columns[fromColumn]];
      const toItems = [...columns[toColumn]];

      const [movedItem] = fromItems.splice(item.index, 1); // Удаляем элемент из исходной колонки
      toItems.splice(targetIndex, 0, movedItem); // Вставляем элемент в целевую колонку

      setColumns((prevColumns) => ({
        ...prevColumns,
        [fromColumn]: fromItems,
        [toColumn]: toItems,
      }));
    }
  };

  const moveItem2 = (item) => {
    if (item.dropType === 'column') {

      if (item.fromColumn === item.toColumn) {
        const currentColumn = columns[item.toColumn];
        const filterdColumn = currentColumn.filter(columnName => columnName !== item.dragItemName);
        filterdColumn.push(item.dragItemName)
        setColumns(prev => {
          return {
            ...prev,
            [item.toColumn]: filterdColumn,
          }
        })
      } else {
        setColumns(prev => {
          return {
            ...prev,
            [item.fromColumn]: prev[item.fromColumn].filter(columnName => columnName !== item.dragItemName),
            [item.toColumn]: [...prev[item.toColumn], item.dragItemName],
          }
        })
      }

    }
    if (item.dropType === 'item') {
      if (item.fromColumn === item.toColumn) {
        const currentColumn = columns[item.toColumn];
        const dropItemName = currentColumn[item.dropItemIndex]
        const filterdColumn = currentColumn.filter(columnName => columnName !== item.dragItemName);
        const changedDropItemIndex = filterdColumn.indexOf(dropItemName);
        filterdColumn.splice(changedDropItemIndex +1, 0,item.dragItemName);
        setColumns(prev => {
          return {
            ...prev,
            [item.toColumn]: filterdColumn,
          }
        })
      }
      else {
        setColumns(prev => {
          return {
            ...prev,
            [item.fromColumn]: prev[item.fromColumn].filter(columnName => columnName !== item.dragItemName),
            [item.toColumn]: [...prev[item.toColumn].slice(0, item.dropItemIndex), item.dragItemName, ...prev[item.toColumn].slice(item.dropItemIndex)],
          }
        })
      }

    }
  }

  // console.log(columns)
  const DroppableColumn = ({children, columnName, allowedColumns}) => {
    const [{isOver, canDrop}, drop] = useDrop({
      accept: ITEM_TYPE,
      canDrop: (item) => allowedColumns.includes(item.column),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      drop: (draggedItem, monitor) => {
        // Проверяем, был ли дроп на другой элемент
        if (!monitor.didDrop()) {
          const item = monitor.getItem();

          // Проверяем, если дропнутый элемент - это DraggableItem
          if (item && item.index !== undefined) {


            // console.log(item)
            const request = {
              fromColumn: draggedItem.column,
              toColumn: columnName,
              dragItemName: draggedItem.name,
              dragItemIndex: draggedItem.index,
              // dropItemIndex: targetIndex,
              dropType: 'column'
            };
            moveItem2(request)

          }
        }
      },
    });

    return (
      <div
        ref={drop}
        className={`${styles.droppableColumn} ${isOver && !canDrop ? styles.notAllowed : ''} ${canDrop && isOver ? styles.canDrop : ''}`}
      >
        {children}
      </div>
    );
  };

  const DraggableItem = ({name, index, column, allowedColumns}) => {
    const [, drag] = useDrag({
      type: ITEM_TYPE,
      item: {name, index, column},
    });



    const [{ isOver, canDrop }, dropRef] = useDrop({
      canDrop: (item) => allowedColumns.includes(item.column),
      accept: ITEM_TYPE,
      drop: (draggedItem) => {
        const targetIndex = index;

        const request = {
          fromColumn: draggedItem.column,
          toColumn: column,
          dragItemName: draggedItem.name,
          dragItemIndex: draggedItem.index,
          dropItemIndex: targetIndex,
          dropType: 'item'
        };
        console.log(allowedColumns, column)
        if (!allowedColumns.includes(column)) return

        // console.log('Dropped on DraggableItem:', draggedItem);
        // Логика обработки дропа для DraggableItem
        moveItem2(request);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),


    });




    return (
      <div
        ref={node => {
          dropRef.current = node;
          drag(dropRef(node));
        }}
        className={`${styles.draggableItem} ${canDrop && isOver ? styles.canDrop : ''}`}
      >
        {name}
      </div>
    );
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.wrapper}>

        <div className="ag-theme-alpine" style={{height: 500, width: '100%'}}>

          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnsDef}
            autoGroupColumnDef={autoGroupColumnDef}
            rowGroupPanelShow={"never"} // Всегда показывать панель группировки
            pivotMode={true} // Отключаем режим сводной таблицы
            sideBar={"none"}
            onGridReady={onGridReady}
            localeText={localeText}
            // suppressMovableColumns={true}    // Отключаем возможность перемещения колонок
            suppressDragLeaveHidesColumns={true} // Отключаем скрытие колонок при перетаскивании
            suppressAggFuncInHeader={true}   // Скрываем функцию агрегации в заголовках
            animateRows={true}               // Включаем анимацию строк
            pivotDefaultExpanded={1}
            suppressContextMenu={user.role === 'viewer'}
            rowHeight={34} // Уменьшаем высоту строки до 25px
            tooltipShowDelay={200} // Задержка перед показом тултипа
            tooltipHideDelay={4000} // Время до скрытия тултипа (например, 3 секунды)
            enableBrowserTooltips={false} // Отключаем нативные браузерные тултипы
            tooltipComponentParams={{textAlign: 'center'}}

          />
        </div>

        <div className={styles.columnsContainer}>
          <div className={styles.availableCols}>
            <DroppableColumn allowedColumns={['values', 'availableColumnValues']} columnName="availableColumnValues"
                             moveItem={moveItem}>
              <h6>Доступно для значений</h6>
              {columns.availableColumnValues.map((item, index) => (
                <DraggableItem allowedColumns={['values', 'availableColumnValues']} key={index} name={item}
                               index={index} column="availableColumnValues"/>
              ))}
            </DroppableColumn>

            <DroppableColumn allowedColumns={['rows', 'cols', 'availableColumnXY']} columnName="availableColumnXY"
                             moveItem={moveItem}>
              <h6>Доступно для x y</h6>
              {columns.availableColumnXY.map((item, index) => (
                <DraggableItem allowedColumns={['rows', 'cols', 'availableColumnXY']} key={index} name={item}
                               index={index} column="availableColumnXY"/>
              ))}
            </DroppableColumn>
          </div>
          <div className={styles.pivotCols}>

            <DroppableColumn allowedColumns={['availableColumnValues', 'values']} columnName="values"
                             moveItem={moveItem}>
              <h6>Значения</h6>
              {columns.values.map((item, index) => (
                <DraggableItem allowedColumns={['availableColumnValues', 'values']} key={index} name={item}
                               index={index} column="values"/>
              ))}
            </DroppableColumn>
            <DroppableColumn allowedColumns={['availableColumnXY', 'cols','rows']} columnName="cols" moveItem={moveItem}>
              <h6>ось X</h6>
              {columns.cols.map((item, index) => (
                <DraggableItem allowedColumns={['availableColumnXY', 'cols','rows']} key={index} name={item} index={index}
                               column="cols"/>
              ))}
            </DroppableColumn>

            <DroppableColumn allowedColumns={['availableColumnXY', 'rows','cols']} columnName="rows" moveItem={moveItem}>
              <h6>ось Y</h6>
              {columns.rows.map((item, index) => (
                <DraggableItem allowedColumns={['availableColumnXY', 'rows','cols']} key={index} name={item} index={index}
                               column="rows"/>
              ))}
            </DroppableColumn>


          </div>
        </div>
        <Button onClick={handlePatch} style={{
          marginTop: 50
        }}>Сохранить</Button>
      </div>
    </DndProvider>
  );
};
