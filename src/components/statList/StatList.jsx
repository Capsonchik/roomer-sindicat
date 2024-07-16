import {TOKEN2} from "../../consts/token";
import {List, Panel} from "rsuite";
import {useSelector} from "react-redux";
import {selectReports} from "../../store/main.selectors";

<iframe
  src={`https://datalens.yandex.cloud/embeds/chart#dl_embed_token=${TOKEN2}`}
  width="33%"
  height="380"
  frameBorder="0"
/>

export const StatList = () => {
  const data = ['отчет 1', 'отчет 2', "отчет 3"]
  const report = useSelector(selectReports);

  return (
    <Panel header={'Отчеты'} bordered>
      <List size="md">
        {report && data.map((item, index) => (
          <List.Item key={index} index={index}>
            {item}
            <iframe
              src={`https://datalens.yandex.cloud/embeds/chart#dl_embed_token=${TOKEN2}`}
              width="100%"
              height="200"
              frameBorder="0"
            />
          </List.Item>
        ))}
      </List>
    </Panel>
  );
};