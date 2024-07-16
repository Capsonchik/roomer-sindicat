import {List, Panel} from "rsuite";
import {useDispatch, useSelector} from "react-redux";
import {selectClientList} from "../../store/main.selectors";
import {setReports} from "../../store/main.slice";

export const ReportList = () => {
  const data = ['отчет 1', 'отчет 2', "отчет 3"]
  const clientList = useSelector(selectClientList);
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setReports('value'))
  }

  return (
    <Panel header={'Список отчетов'} bordered>
      <List size="md">
        {clientList && data.map((item, index) => (
          <List.Item onClick={handleClick} key={index} index={index}>
            {item}
          </List.Item>
        ))}
      </List>
    </Panel>
  );
};