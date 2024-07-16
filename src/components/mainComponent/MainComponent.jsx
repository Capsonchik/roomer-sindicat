import styles from './styles.module.scss'
import {Panel} from "rsuite";
import {News} from "../news/News";
import {FunnelTime, Scatter, Speaker, Trend} from "@rsuite/icons";
import {ClientList} from "../clientList/ClientList";
import {StatList} from "../statList/StatList";
import {ReportList} from "../reportList/ReportList";

export const MainComponent = () => {
  return (
    <div className={styles.container}>
      {/*<Panel header="Статистика" shaded>*/}
      {/*  <div className={styles.topPanel}>*/}
      {/*    <div className={styles.panelBlock}>*/}
      {/*      <FunnelTime className={styles.icon}/>*/}
      {/*      <h5 className={styles.blockHeader}>20 Отчетов за месяц</h5>*/}
      {/*    </div>*/}
      {/*    <div className={styles.panelBlock}>*/}
      {/*      <Trend className={styles.icon}/>*/}
      {/*      <h5 className={styles.blockHeader}>10 доступных баз</h5>*/}
      {/*    </div>*/}
      {/*    <div className={styles.panelBlock}>*/}
      {/*      <Scatter className={styles.icon}/>*/}
      {/*      <h5 className={styles.blockHeader}>5 Заявок от клиента</h5>*/}
      {/*    </div>*/}
      {/*    <div className={styles.panelBlock}>*/}
      {/*      <Speaker className={styles.icon}/>*/}
      {/*      <h5 className={styles.blockHeader}>15 Выполненных отчетов</h5>*/}
      {/*    </div>*/}

      {/*  </div>*/}
      {/*</Panel>*/}
      {/*<News/>*/}
      <div className={styles.containerBlock}>
        <ClientList listTitle={'Список клиентов'}/>
      </div>
      <div className={styles.containerBlock}>
        <ReportList/>
      </div>
      <div className={styles.containerBlock}>
        <StatList/>
      </div>
    </div>
  );
};