import styles from './styles.module.scss';
import {Dropdown} from "rsuite";
import {useState} from "react";
import {PieChart} from "../../../charts/PieChart";
import {BarChart} from "../../../charts/BarChart";
import {CustomChart} from "../../../charts/CustomChart";
import {WaterfallChart} from "../../../charts/WaterFallChart";
import {TOKEN} from "../../../../consts/token";


export const Slide2 = () => {
  const [value, setValue] = useState('График 2')
  const [value2, setValue2] = useState('Выбор')
  const [value3, setValue3] = useState('Выбор')

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
        <Dropdown title={value3}>
          <Dropdown.Item onClick={() => setValue3('График 5')}>Бар чарт</Dropdown.Item>
          <Dropdown.Item onClick={() => setValue3('График 6')}>Пай чарт</Dropdown.Item>
        </Dropdown>

        {value3 === 'График 5' ? <BarChart color={'pink'}/> : <PieChart/>}
      </div>
      <div className={styles.block}>
        {/*<iframe*/}
        {/*  title={'test'}*/}
        {/*  frameBorder="0"*/}
        {/*  src="https://datalens.yandex/z2uxl5pbztkep?shopid_vj2j=sp-15&shopid_vj2j=sp-18&shopid_vj2j=sp-20&_embedded=1&_no_controls=1&_theme=light&_lang=ru"*/}
        {/*  width="100%"*/}
        {/*  height="100%"*/}
        {/*/>*/}
        <iframe
          src={`https://datalens.yandex.cloud/embeds/chart#dl_embed_token=${TOKEN}`}
          width="600"
          height="400"
          frameBorder="0"
        />
      </div>
    </div>
  );
};


