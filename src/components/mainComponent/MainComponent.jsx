import styles from './styles.module.scss'
import {Panel, Placeholder} from "rsuite";
import {News} from "../news/News";

export const MainComponent = () => {
  return (
    <div className={styles.container}>
      <Panel header="Статистика" shaded>
        <div className={styles.topPanel}>
          <Placeholder.Graph active width={350} height={150} className={styles.placeholderGraph}/>
          <Placeholder.Graph active width={350} height={150} className={styles.placeholderGraph}/>
          <Placeholder.Graph active width={350} height={150} className={styles.placeholderGraph}/>
          <Placeholder.Graph active width={350} height={150} className={styles.placeholderGraph}/>
        </div>
      </Panel>
      <News/>
    </div>
  );
};