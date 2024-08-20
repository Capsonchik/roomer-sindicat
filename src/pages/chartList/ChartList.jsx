import styles from './chartList.module.scss';
import {Chart} from "./chart/Chart";
import {Button} from "rsuite";
import React, {useEffect, useState} from "react";
import {downloadPpt} from "./downloadPptx";
import {charts} from "./chartMocks";
import {TopFilters} from "./topFilters/TopFilters";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllClients} from "../../store/chartSlice/chart.actions";
import {selectClients, selectReportsClients} from "../../store/chartSlice/chart.selectors";

export const ChartList = (props) => {
  const clients = useSelector(selectClients)
  const reportsClients = useSelector(selectReportsClients)




  return (

    <>
      <TopFilters/>
      <div className={styles.wrapper}>
        {charts.map((chart, index) => (
          <Chart key={index} chart={chart}/>
        ))}
        <Button
          onClick={() => downloadPpt(charts)} // Передаем весь массив charts
          className={styles.save_pptx}
        >
          Скачать pptx
        </Button>


      </div>
    </>

  );
};
