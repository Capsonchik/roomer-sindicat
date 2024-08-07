import {Tabs, Placeholder, Input, InputGroup, TagPicker} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentClient, selectGroups} from "../../../store/reportSlice/reportSlice.selectors";
import styles from './reportingTabs.module.scss'
import {TestPageGraphComponent} from "../testPageGraphComponent/testPageGraphComponent";
import {fetchGetGraphs} from "../../../store/reportSlice/reportSlice.actions";
import {useEffect, useState} from "react";
import {clearGraphs, setReportTitle, setSearchString} from "../../../store/reportSlice/reportSlice";
import {debounce} from "../../../lib/debounce";
import {attributeMocks} from "./attributeMocks";

export const ReportingTabs = () => {
  const groups = useSelector(selectGroups);
  const dispatch = useDispatch();
  const defaultActiveKey = groups.length > 0 ? groups[0].group_id.toString() : null;
  const [activeKey, setActiveKey] = useState(defaultActiveKey)
  const currentClient = useSelector(selectCurrentClient);

  const data = attributeMocks.map(
    item => ({ label: item, value: item })
  );
  // const debouncedResize = debounce(onResize, 300);
  useEffect(() => {
    if (groups.length) {
      dispatch(fetchGetGraphs(defaultActiveKey))
    }

  }, [groups]);

  const handleSelect = (selectedKey) => {

    setActiveKey(selectedKey)
    dispatch(clearGraphs())
    dispatch(fetchGetGraphs(selectedKey))
  }

  const handleInputChange = (value) => {
    dispatch(setSearchString(value));
  };

  const filterAttribute = (data) => {
    console.log(data.join(','))
    dispatch(setSearchString(data.join(',')));
  }

  // const debouncedSearchString = debounce(handleInputChange, 400);
  return (
    <div className={styles.wrapper}>
      {currentClient.value === 'Тестовый клиент' && (
        <>
          {/*<p>Фильтры</p>*/}
          <div className={styles.filter}>
            <div className={styles.search}>
              {/*<label>Выберите параметр:</label>*/}
              <TagPicker placeholder={'Параметр'} data={data} className={styles.filterAttribute} onChange={filterAttribute}/>
              {/*<Input onChange={(value) => debouncedSearchString(value)} />*/}
            </div>
          </div>
        </>
      )}
      <Tabs
        className={styles.tabs}
        defaultActiveKey={defaultActiveKey}
        appearance="subtle"
        onSelect={handleSelect}
      >
        {groups.map((group, index) => {
          return (
            <Tabs.Tab key={group.group_id} eventKey={group.group_id.toString()} title={group.group_name}>
              {group.group_id.toString() === activeKey
                ? <TestPageGraphComponent/>
                : null
              }

            </Tabs.Tab>
          )
        })}

      </Tabs>
    </div>
  )
}