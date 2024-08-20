import styles from './chartList.module.scss';
import {Chart} from "./chart/Chart";
import {Button, Loader} from "rsuite";
import React, {useEffect, useState} from "react";
import {downloadPpt} from "./downloadPptx";
// import {charts} from "./chartMocks";
import {TopFilters} from "./topFilters/TopFilters";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllClients} from "../../store/chartSlice/chart.actions";
import {
  selectCharts,
  selectClients,
  selectIsChartLoading,
  selectReportsClients
} from "../../store/chartSlice/chart.selectors";

export const ChartList = (props) => {
  const charts = useSelector(selectCharts)
  const isChartLoading = useSelector(selectIsChartLoading)
  const [data, setData] = useState(charts)

  useEffect(() => {
    setData(charts)
  },[charts])
  console.log(data)




  return (

    <>
      <TopFilters/>
      <div className={styles.wrapper}>
        {isChartLoading && (
          <Loader/>
        )}
        {!isChartLoading && data[0]?.title && data.map((chart, index) => (
          <Chart key={index} chart={chart}/>
        ))}



      </div>
      {!isChartLoading && <Button
        onClick={() => downloadPpt(charts)} // Передаем весь массив charts
        className={styles.save_pptx}
      >
        Скачать pptx
      </Button>}
    </>

  );
};
