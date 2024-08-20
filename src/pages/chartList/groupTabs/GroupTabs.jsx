import styles from './groupTabs.module.scss'
import {Tabs} from "rsuite";
import {
  TestPageGraphComponent
} from "../../../components/testPageComponents/testPageGraphComponent/testPageGraphComponent";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {selectGroups} from "../../../store/reportSlice/reportSlice.selectors";
import {selectGroupsReports} from "../../../store/chartSlice/chart.selectors";
import {ChartList} from "../ChartList";

export  const GroupTabs = () => {
  const groups = useSelector(selectGroupsReports);
  const dispatch = useDispatch();
  const defaultActiveKey = groups.length > 0 ? groups[0].group_id.toString() : null;
  const [activeKey, setActiveKey] = useState(defaultActiveKey)
  return (
    <div className={styles.wrapper}>
      <Tabs
        className={styles.tabs}
        defaultActiveKey={defaultActiveKey}
        appearance="subtle"
        // onSelect={handleSelect}
      >
        {groups.map((group, index) => {
          return (
            <Tabs.Tab key={group.group_id} eventKey={group.group_id.toString()} title={group.group_name}>
              {group.group_id.toString() === activeKey
                ? <ChartList/>
                : null
              }

            </Tabs.Tab>
          )
        })}

      </Tabs>
    </div>
  )
}