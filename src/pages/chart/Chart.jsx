import {useSelector} from "react-redux";
import {selectCharts} from "../../store/chartSlice/chart.selectors";
import styles from './chart.module.scss'
import {ROUTES_PATH} from "../../routes/RoutesPath";

export const Chart = () => {
    const charts = useSelector(selectCharts)
    console.log(charts)


    return (

        <div className={styles.grid}>
            {charts.map((chart, i) => {
                console.log(chart.preview)
                return (
                    <a
                        className={styles.link}
                        href={`${ROUTES_PATH.main}${ROUTES_PATH.editorChart}/${chart.id}`}
                    >
                        <h5 className={styles.title}>{chart.title}</h5>
                        <img width={300} height={200} src={chart.data.preview} alt=""/>
                    </a>
                )
            })}
        </div>
    )
}