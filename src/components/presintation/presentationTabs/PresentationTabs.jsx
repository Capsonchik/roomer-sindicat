import {Tabs, Placeholder} from "rsuite";
import styles from './styles.module.scss';
import {Slide1} from "../slides/slide1/Slide1";
import {Slide2} from "../slides/slide2/Slide2";

export const PresentationTabs = () => {
  return (
    <Tabs defaultActiveKey="1" className={styles.tabBox}>
      <Tabs.Tab eventKey="1" title="KPI Категории">
        <Slide1/>
      </Tabs.Tab>
      <Tabs.Tab eventKey="2" title="Доли продаж по регионам">
        <Slide2/>
      </Tabs.Tab>
      <Tabs.Tab eventKey="3" title="KPI Категории по регионам">
        <Placeholder.Paragraph graph="circle" />
      </Tabs.Tab>
      <Tabs.Tab eventKey="4" title="HML-анализ категории ">
        <Placeholder.Paragraph graph="circle" />
      </Tabs.Tab>
      <Tabs.Tab eventKey="5" title="KPI каналов продаж ">
        <Placeholder.Paragraph graph="circle" />
      </Tabs.Tab>
      <Tabs.Tab eventKey="6" title="KPI и долевое распределение каналов">
        <Placeholder.Paragraph graph="circle" />
      </Tabs.Tab>
      <Tabs.Tab eventKey="7" title="Ключевые KPI">
        <Placeholder.Paragraph graph="circle" />
      </Tabs.Tab>
    </Tabs>
  );
};