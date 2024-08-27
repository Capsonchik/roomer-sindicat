import styles from './groupTabs.module.scss'
import {Tabs} from "rsuite";
import {
  TestPageGraphComponent
} from "../../../components/testPageComponents/testPageGraphComponent/testPageGraphComponent";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {selectGroups} from "../../../store/reportSlice/reportSlice.selectors";
import {selectGroupsReports} from "../../../store/chartSlice/chart.selectors";
import {ChartList} from "../ChartList";
import {Chart} from "../chart/Chart";
import {fetchAllChartsByGroupId, fetchAllChartsFormatByGroupId} from "../../../store/chartSlice/chart.actions";
import {setActiveGroup} from "../../../store/chartSlice/chart.slice";

export const GroupTabs = ({groupsReports}) => {
  // const groups = useSelector(selectGroupsReports);
  const dispatch = useDispatch();
  const defaultActiveKey = groupsReports.length > 0 ? groupsReports[0].group_id.toString() : null;
  const [activeKey, setActiveKey] = useState(defaultActiveKey)

  useEffect(() => {
    dispatch(fetchAllChartsByGroupId(activeKey)).then(() => {
      dispatch(fetchAllChartsFormatByGroupId(activeKey))
      dispatch(setActiveGroup(activeKey))
    })
  }, [groupsReports]);

  return (
    <div className={styles.wrapper}>
      <Tabs
        className={styles.tabs}
        defaultActiveKey={defaultActiveKey}
        appearance="subtle"
        onSelect={(key) => {
          dispatch(setActiveGroup(key))
          dispatch(fetchAllChartsByGroupId(key)).then(() => {
            dispatch(fetchAllChartsFormatByGroupId(key))
          })
        }}
      >
        {groupsReports.map((group, index) => {
          return (
            <Tabs.Tab key={group.group_id} eventKey={group.group_id.toString()} title={group.group_name}>
              {/*{group.group_id.toString() === activeKey*/}
              {/*  ? <ChartList/>*/}
              {/*  : null*/}
              {/*}*/}

            </Tabs.Tab>
          )
        })}

      </Tabs>
    </div>
  )
}