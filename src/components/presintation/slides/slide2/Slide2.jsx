import styles from './styles.module.scss';
import {Dropdown} from "rsuite";
import {useState} from "react";
import {PieChart} from "../../../charts/PieChart";
import {BarChart} from "../../../charts/BarChart";
import {CustomChart} from "../../../charts/CustomChart";
import {WaterfallChart} from "../../../charts/WaterFallChart";
import {TOKEN, TOKEN2, TOKEN3, TOKEN4} from "../../../../consts/token";


export const Slide2 = () => {
  const [value, setValue] = useState('График 2')
  const [value2, setValue2] = useState('Выбор')

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <Dropdown title={value}>
          <Dropdown.Item onClick={() => setValue('График 1')}>Бар чарт</Dropdown.Item>
          <Dropdown.Item onClick={() => setValue('График 2')}>Пай чарт</Dropdown.Item>
        </Dropdown>
        {value === 'График 1' ? <PieChart/> : <CustomChart/>}
      </div>
      <div className={styles.block}>
        <Dropdown title={value2}>
          <Dropdown.Item onClick={() => setValue2('График 3')}>Бар чарт</Dropdown.Item>
          <Dropdown.Item onClick={() => setValue2('График 4')}>Пай чарт</Dropdown.Item>
        </Dropdown>

        {value2 === 'График 4' ? <BarChart color={'green'}/> : <WaterfallChart/>}
      </div>
      <div className={styles.block}>
        <p style={{fontSize: 16, color: 'black'}}>Пенетрация 18+</p>
        <div style={{overflow: 'auto'}}>
          <iframe
            src={`https://datalens.yandex.cloud/embeds/chart#dl_embed_token=${TOKEN2}`}
            width="33%"
            height="380"
            frameBorder="0"
          />
          <iframe
            src={`https://datalens.yandex.cloud/embeds/chart#dl_embed_token=${TOKEN3}`}
            width="33%"
            height="380"
            frameBorder="0"
          />
          <iframe
            src={`https://datalens.yandex.cloud/embeds/chart#dl_embed_token=${TOKEN4}`}
            width="33%"
            height="380"
            frameBorder="0"
          />
        </div>
      </div>
      <div className={styles.block}>
        <iframe
          src={`https://datalens.yandex.cloud/embeds/chart#dl_embed_token=${TOKEN}`}
          width="100%"
          height="400"
          frameBorder="0"
        />
      </div>
    </div>
  );
};


