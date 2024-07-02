import styles from './styles.module.scss'
import {Title} from "../../../helpers/components/Title";
import {InlineEdit} from "rsuite";
import {secondSlideMockText} from "../../../mock/mock";
import {Chart1} from "../../../charts/Chart1";

export const Slide3 = () => {
  const title = 'Доли продаж по регионам'
  return (
    <div className={styles.container}>
      <Title title={title} level={3}/>
      <div style={{height: '100%'}}>
        <InlineEdit defaultValue={secondSlideMockText}/>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div className={styles.chartsBlock}>
            <Chart1/>
          </div>
          <div className={styles.chartsBlock}>
            <Chart1/>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <InlineEdit defaultValue={'Источник: Цифровая Потребительская платформа'} style={{width: '100%'}}/>
      </div>
    </div>
  );
};