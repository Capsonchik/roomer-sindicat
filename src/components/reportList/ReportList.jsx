import {List, Panel} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {setReports} from "../../store/main.slice";
import {selectClientReports} from "../../store/reportSlice/reportSlice.selectors";
import {fetchGetGraphs} from "../../store/reportSlice/reportSlice.actions";

export const ReportList = () => {
  const reportList = useSelector(selectClientReports);
  const dispatch = useDispatch()

  const handleClick = (id) => {
    dispatch(setReports('value'))
    dispatch(fetchGetGraphs(id))
  }

  return (
    <Panel header={'Список отчетов'} bordered>
      <List size="md">
        {reportList && reportList.map((item, index) => (
          <List.Item style={{cursor: 'pointer'}} onClick={() => handleClick(item.report_id)} key={item.report_id} index={index}>
            {item.report_name}
          </List.Item>
        ))}
      </List>
    </Panel>
  );
};