import styles from './styles.module.scss'
import {Divider} from "rsuite";
export const TestPageMainComponent = () => {
  return (
    <div className={styles.container}>
      <div style={{width: 500}}>
        <Divider>Страница в разработке</Divider>
      </div>
    </div>
  );
};