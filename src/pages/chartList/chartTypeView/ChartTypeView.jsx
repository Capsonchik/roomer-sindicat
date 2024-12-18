import {ChartListItem} from "../chartListItem/ChartListItem";
import {ChartItemTable} from "../chartItemTable/ChartItemTable";
import {ChartItemPie} from "../chartItemPie/ChartItemPie";
import '../chartItemPivotTable/styles.css'

import {CustomPivot} from "../chartItemPivotTable/CustomPivot";
import {ChartItemTree} from "../chartItemTree/ChartItemTree";
import {ChartItemGraph} from "../chartItemTree/ChartItemGraph";
import {CytoscapeTree} from "../chartItemTree/CyptoTree";
import {NewPivotTable, PivotTable} from "../chartItemPivotTable/NewPivot";
import {ChartAgGridWithoutPivot} from "../chartItemPivotTable/ChartAgGrid";
import {ChartAgGridPivot} from "../chartItemPivotTable/AgPivotTbale";
import {AgGridDataWrapper} from "../chartItemPivotTable/AgGridDataWrapper";
import {useEffect, useState} from "react";
import {colors as colorsConsts} from "../chart/config";
import {useSelector} from "react-redux";
import {selectActiveClient, selectClients} from "../../../store/chartSlice/chart.selectors";
import {generateShades} from "../chartItemPivotTable/utils/generateShades";

const rowFields = ['Top_region', 'Region',];
const colFields = ['period', 'Producer'];
const aggField = 'Total_value';
export const ChartTypeView = ({chart}) => {
  // const [colors, setColors] = useState({lightShade: [255, 248, 248], darkShade: [250, 134, 130]})
  const activeClient = useSelector(selectActiveClient)
  const clients = useSelector(selectClients)


  const client = clients.find(clnt => clnt.client_id === activeClient)

  const {lightShade, darkShade} = generateShades(client?.chart_colors?.colors?.[0] || '#f7635c')
  const colors = {lightShade, darkShade}

  let returnType = 'неизвестный тип графика'
  switch (chart.formatting.type_chart) {
    // case 'graph':
    //   returnType = <CytoscapeTree/>
    //   // returnType = <ChartItemTree/>
    //   break
    case 'image':
      returnType = <img src={chart.file_url} alt="" style={{objectFit: "contain", width: '100%', height: '100%'}}/>
      break
    case 'graph':
      returnType = <CytoscapeTree/>
      break
    case 'bar':
      returnType = <ChartListItem chart={chart}/>
      break
    case 'table':
      returnType = <ChartItemTable chart={chart}/>
      break
    case 'pie':
      returnType = <ChartItemPie chart={chart}/>
      break
    case 'pivot':
      returnType = <AgGridDataWrapper chart={chart} colors={colors}/>
      // returnType = <AgGridDataWrapper chart={chart}/>
      // returnType = <CustomPivot chart={chart} rowData={chart?.['0']?.table_data} rowFields={rowFields} colFields={colFields} aggregator={aggField} />
      // returnType = <CustomPivot rowData={chart?.['0']?.table_data} chart={chart} rowColData={{
      //   rowKey: chart.formatting?.rowKey || 'Region',
      //   subRowKey: chart.formatting?.subRowKey || 'Segment2',
      //   colKey: chart.formatting?.colKey || 'Segment1',
      //   subColKey: chart.formatting?.subColKey || 'Product',
      //   aggregator: chart.formatting?.aggregator || 'Total_value',
      //   digitsAfterDot: chart.formatting?.digitsAfterDot || null
      // }}
      // />
      // case 'pivot':
      // returnType = <CustomPivot rowData={chart?.['0']?.table_data} chart={chart} rowColData={{
      //   rowKey: chart.formatting?.rowKey || 'Region',
      //   subRowKey: chart.formatting?.subRowKey || 'Segment2',
      //   colKey: chart.formatting?.colKey || 'Segment1',
      //   subColKey: chart.formatting?.subColKey || 'Product',
      //   // rowKeys: ['Region','Segment2','Brand'],
      //   // colKeys: ['Segment1','Product','Chain'],
      //   aggregator: chart.formatting?.aggregator || 'Total_value',
      //   digitsAfterDot: chart.formatting?.digitsAfterDot || null
      // }}/>


      break
  }

  return returnType
}