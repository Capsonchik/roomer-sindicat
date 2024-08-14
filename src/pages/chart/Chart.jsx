import {useSelector} from "react-redux";
import {selectCharts} from "../../store/chartSlice/chart.selectors";
import styles from './chart.module.scss'
import {ROUTES_PATH} from "../../routes/RoutesPath";
export const Chart = () => {
  const charts = useSelector(selectCharts)
  console.log(charts)

//   function convertImageUrlToBase64(url) {
//     return fetch(url)
//       .then(response => response.blob())
//       .then(blob => {
//         return new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onloadend = () => {
//             resolve(reader.result);
//           };
//           reader.onerror = () => {
//             reject(new Error("Failed to convert image to base64"));
//           };
//           reader.readAsDataURL(blob);
//         });
//       });
//   }
//
// // Использование функции
//   convertImageUrlToBase64('/avg.png')
//     .then(base64 => console.log(base64))
//     .catch(error => console.error(error));
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
            <img width={300} height={200} src={chart.data.preview} alt="" />
          </a>
        )
      })}
    </div>
  )
}