import styles from './styles.module.scss';
import {Dropdown} from "rsuite";
import {useState} from "react";
import {PieChart} from "../../../charts/PieChart";
import {BarChart} from "../../../charts/BarChart";

export const Slide2 = () => {
  const [value, setValue] = useState('Выбор')
  const [value2, setValue2] = useState('Выбор')
  const [value3, setValue3] = useState('Выбор')
  const [value4, setValue4] = useState('Выбор')

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <Dropdown title={value}>
          <Dropdown.Item onClick={() => setValue('График 1')}>Бар чарт</Dropdown.Item>
          <Dropdown.Item onClick={() => setValue('График 2')}>Пай чарт</Dropdown.Item>
        </Dropdown>

        {value === 'График 1' ? <BarChart/> : <PieChart/>}
      </div>
      <div className={styles.block}>
        <Dropdown title={value2}>
          <Dropdown.Item onClick={() => setValue2('График 3')}>Бар чарт</Dropdown.Item>
          <Dropdown.Item onClick={() => setValue2('График 4')}>Пай чарт</Dropdown.Item>
        </Dropdown>

        {value2 === 'График 3' ? <BarChart color={'green'}/> : <PieChart/>}
      </div>
      <div className={styles.block}>
        <Dropdown title={value3}>
          <Dropdown.Item onClick={() => setValue3('График 5')}>Бар чарт</Dropdown.Item>
          <Dropdown.Item onClick={() => setValue3('График 6')}>Пай чарт</Dropdown.Item>
        </Dropdown>

        {value3 === 'График 5' ? <BarChart color={'pink'}/> : <PieChart/>}
      </div>
      <div className={styles.block}>
        <Dropdown title={value4}>
          <Dropdown.Item onClick={() => setValue4('График 7')}>Бар чарт</Dropdown.Item>
          <Dropdown.Item onClick={() => setValue4('График 8')}>Пай чарт</Dropdown.Item>
        </Dropdown>

        {value4 === 'График 7' ? <BarChart color={'red'}/> : <PieChart/>}
      </div>
    </div>
  );
};