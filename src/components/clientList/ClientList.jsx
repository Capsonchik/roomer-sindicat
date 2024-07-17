import styles from './styles.module.scss'
import {List, Panel} from "rsuite";
import {setClientList} from "../../store/main.slice";
import {useDispatch, useSelector} from "react-redux";
import {selectAllClients} from "../../store/reportSlice/reportSlice.selectors";
import {setCurrentClient} from "../../store/reportSlice/reportSlice";
import {fetchGetClientReports} from "../../store/reportSlice/reportSlice.actions";

export const ClientList = ({listTitle}) => {
  const dispatch = useDispatch();
  const allClients = useSelector(selectAllClients);

  const handleClick = (item) => {
    dispatch(setClientList('value'));
    dispatch(setCurrentClient(item))
    dispatch(fetchGetClientReports(item.client_id))
  }

  return (
    <Panel header={listTitle} bordered>
      <List size="md">
        {allClients
          ? (
            allClients.map((item, index) => {
               return (
                 <List.Item className={styles.listItem} onClick={() => handleClick(item)} key={item.client_id} index={index}>
                   {item.client_name}
                 </List.Item>
               )
            })
          )
          : 'Идет загрузка'
        }
      </List>
    </Panel>
  );
};