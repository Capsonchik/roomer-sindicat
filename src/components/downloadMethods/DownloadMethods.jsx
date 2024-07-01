import styles from './styles.module.scss'
import {AdvancedAnalytics} from "@rsuite/icons";
import {Panel} from "rsuite";
import {useNavigate} from "react-router-dom";

export const DownloadMethods = () => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  }

  return (
    <Panel header="Выберете способ выгрузки данных" shaded >
      <div className={styles.botPanel}>
        <div onClick={() => handleNavigate('/report-page')}>
          <div className={styles.saveBlock} style={{width: 250, height: 150, display: 'flex', flexDirection: 'column'}}>
            <h5 style={{marginBottom: 16}}>KPI</h5>
            <AdvancedAnalytics style={{ fontSize: '30px' }} />
          </div>
        </div>
        <div onClick={() => handleNavigate('/report-page')}>
          <div className={styles.saveBlock}
               style={{width: 250, height: 150, display: 'flex', flexDirection: 'column'}}>
            <h5 style={{marginBottom: 16}}>HML</h5>
            <AdvancedAnalytics style={{fontSize: '30px'}}/>
          </div>
        </div>

        <div onClick={() => handleNavigate('/report-page')}>
          <div className={styles.saveBlock}
               style={{width: 250, height: 150, display: 'flex', flexDirection: 'column'}}>
            <h5 style={{marginBottom: 16}}>Профиль</h5>
            <AdvancedAnalytics style={{fontSize: '30px'}}/>
          </div>
        </div>
        <div onClick={() => handleNavigate('/report-page')}>
          <div className={styles.saveBlock}
               style={{width: 250, height: 150, display: 'flex', flexDirection: 'column'}}>
            <h5 style={{marginBottom: 16}}>Портфель</h5>
            <AdvancedAnalytics style={{fontSize: '30px'}}/>
          </div>
        </div>
        <div onClick={() => handleNavigate('/report-page')}>
          <div className={styles.saveBlock}
               style={{width: 250, height: 150, display: 'flex', flexDirection: 'column'}}>
            <h5 style={{marginBottom: 16}}>Catman</h5>
            <AdvancedAnalytics style={{fontSize: '30px'}}/>
          </div>
        </div>
        <div onClick={() => handleNavigate('/report-page')}>
          <div className={styles.saveBlock}
               style={{width: 250, height: 150, display: 'flex', flexDirection: 'column'}}>
            <h5 style={{marginBottom: 16}}>Таблицы</h5>
            <AdvancedAnalytics style={{fontSize: '30px'}}/>
          </div>
        </div>
      </div>
    </Panel>
  );
};