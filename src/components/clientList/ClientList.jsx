import {List, Panel} from "rsuite";
import {setClientList} from "../../store/main.slice";
import {useDispatch} from "react-redux";

export const ClientList = ({listTitle}) => {
  const data = ['Roses are red', 'Violets are blue', 'Sugar is sweet', 'And so are you'];
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(setClientList('value'));
  }

  return (
    <Panel header={listTitle} bordered>
      <List size="md">
        {data.map((item, index) => (
          <List.Item onClick={handleClick} key={index} index={index}>
            {item}
          </List.Item>
        ))}
      </List>
    </Panel>
  );
};