import {Tabs,Placeholder} from "rsuite";
import {useSelector} from "react-redux";
import {selectGroups} from "../../../store/reportSlice/reportSlice.selectors";
import styles from './reportingTabs.module.scss'

export const ReportingTabs = () => {
    const groups = useSelector(selectGroups);
  return (
    <div className={styles.wrapper}>
      <Tabs defaultActiveKey="1" appearance="subtle">
        <Tabs.Tab eventKey="1" title="Image">
          <Placeholder.Paragraph graph="image"/>
        </Tabs.Tab>
        <Tabs.Tab eventKey="2" title="Square">
          <Placeholder.Paragraph graph="square"/>
        </Tabs.Tab>
        <Tabs.Tab eventKey="3" title="Circle">
          <Placeholder.Paragraph graph="circle"/>
        </Tabs.Tab>
      </Tabs>
    </div>
  )
}