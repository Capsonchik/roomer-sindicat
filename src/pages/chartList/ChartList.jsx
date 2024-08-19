import styles from './chartList.module.scss';
import { Chart } from "./chart/Chart";
import { Button } from "rsuite";
import {ChartDrawer} from "../../components/chartPage/chartDrawer/ChartDrawer";
import React, {useState} from "react";

export const ChartList = (props) => {

    const charts = [
        {
            title: 'Пиво Хеви',
            description: "Описание",
            axes: {
                xAxisData: ["хеви"],
                seriesData: {
                    "2023-Q1": [1.5],
                    "2024-Q1": [1.4]
                }
            },
        },
        {
            title: 'Пиво Медиум',
            description: "Описание",
            axes: {
                xAxisData: ["медиум"],
                seriesData: {
                    "2023-Q1": [1.8],
                    "2024-Q1": [1.3]
                }
            },
        },
        {
            title: 'Пиво Лайт',
            description: "Описание",
            axes: {
                xAxisData: ["лайт"],
                seriesData: {
                    "2023-Q1": [2.1],
                    "2024-Q1": [1.6]
                }
            },
        }
    ];

    return (
        <div className={styles.wrapper}>
            {charts.map((chart, index) => (
                <Chart key={index} chart={chart} />
            ))}
            <Button
                onClick={() => {}} // Передаем весь массив charts
                className={styles.save_pptx}
            >
                Скачать pptx
            </Button>


        </div>
    );
};
