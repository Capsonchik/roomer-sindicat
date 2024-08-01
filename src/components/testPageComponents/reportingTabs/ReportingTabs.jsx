import {Tabs, Placeholder} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentClient, selectGroups} from "../../../store/reportSlice/reportSlice.selectors";
import styles from './reportingTabs.module.scss'
import {TestPageGraphComponent} from "../testPageGraphComponent/testPageGraphComponent";
import {fetchGetGraphs} from "../../../store/reportSlice/reportSlice.actions";
import {useEffect} from "react";
import {setReportTitle} from "../../../store/reportSlice/reportSlice";

export const ReportingTabs = () => {
  const groups = useSelector(selectGroups);
  const dispatch = useDispatch();
  const defaultActiveKey = groups.length > 0 ? groups[0].group_id : null;
  const currentClient = useSelector(selectCurrentClient);

  useEffect(() => {
    if(groups.length) {
      console.log(222)
      dispatch(fetchGetGraphs(defaultActiveKey))
    }

  }, [groups]);

  const handleSelect = (selectedKey) => {
    // dispatch(setReportTitle(selectedKey))
    dispatch(fetchGetGraphs(selectedKey))
  }
  return (
    <div className={styles.wrapper}>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        appearance="subtle"
        onSelect={handleSelect}
      >
        {groups.map((group, index) => {
          return (
            <Tabs.Tab eventKey={group.group_id} title={group.group_name}>
              <TestPageGraphComponent/>
            </Tabs.Tab>
          )
        })}

      </Tabs>
    </div>
  )
}