import styles from './styles.module.scss'
import {Panel, Placeholder} from "rsuite";
import {News} from "../news/News";
import {FunnelTime, Scatter, Speaker, Trend} from "@rsuite/icons";

export const MainComponent = () => {
  return (
    <div className={styles.container}>
      <Panel header="Статистика" shaded>
        <div className={styles.topPanel}>
          <div className={styles.panelBlock}>
            <FunnelTime className={styles.icon}/>
            <h5>20 Отчетов за месяц</h5>
          </div>
          <div className={styles.panelBlock}>
            <Trend className={styles.icon}/>
            <h5>10 доступных баз</h5>
          </div>
          <div className={styles.panelBlock}>
            <Scatter className={styles.icon}/>
            <h5>5 Заявок от клиента</h5>
          </div>
          <div className={styles.panelBlock}>
            <Speaker className={styles.icon}/>
            <h5>15 Выполненных отчетов</h5>
          </div>

        </div>
      </Panel>
      <News/>
    </div>
  );
};