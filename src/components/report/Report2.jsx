import {Cascader, CheckPicker, Divider, Panel, Placeholder, Text} from "rsuite";
import {stack1} from "../../consts/stacks";
import styles from './styles.module.scss';
import { mockTreeData } from '../../consts/mock'
import {useState} from "react";

export const Report2 = () => {
  const data = stack1.map(item => ({ label: item, value: item }));

  const mockData = mockTreeData({
    limits: [3, 3, 4],
    labels: (layer, value, faker) => {
      const methodName = ['jobArea', 'jobType', 'firstName'];
      return faker.person[methodName[layer]]();
    }
  });

  const [categoryFilled, setCategoryFilled] = useState(false);
  const [manufacturerFilled, setManufacturerFilled] = useState(false);
  const [brandField, setBrandField] = useState(false);
  const [regionField, setRegionField] = useState(false);
  const [chanelField, setChanelField] = useState(false);
  const [netWorkField, setNetWorkField] = useState(false)
  // Добавьте состояния для остальных CheckPicker'ов

  const handleCategoryChange = (value) => {
    setCategoryFilled(!!value);
  };

  const handleManufacturerChange = (value) => {
    setManufacturerFilled(!!value);
  };

  const handleBrandChange = (value) => {
    setBrandField(!!value);
  }

  const handleRegionChange = (value) => {
    setRegionField(!!value);
  }

  const handleChanelChange = (value) => {
    setChanelField(!!value);
  }

  const handleNetWorkChange = (value) => {
    setNetWorkField(!!value);
  }

  return (
    <div className={styles.report2container}>
      <Panel header="Выберете фильтры для необходимой выгрузки*" shaded className={styles.panel}>
        <div className={styles.inputBlocks}>
          <div className={styles.inputContainer}>
            <h6>Категория</h6>
            <CheckPicker
              data={data}
              style={{width: 224}}
              placeholder={'Категория'}
              onChange={handleCategoryChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <h6>Производитель</h6>
            <CheckPicker
              data={data}
              style={{width: 224}}
              placeholder={'Производитель'}
              disabled={!categoryFilled}
              onChange={handleManufacturerChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <h6>Бренд</h6>
            <CheckPicker
              data={data}
              style={{width: 224}}
              placeholder={'Бренд'}
              disabled={!manufacturerFilled}
              onChange={handleBrandChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <h6>Регион</h6>
            <CheckPicker
              data={data}
              style={{width: 224}}
              placeholder={'Регион'}
              disabled={!brandField}
              onChange={handleRegionChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <h6>Канал</h6>
            <CheckPicker
              data={data}
              style={{width: 224}}
              placeholder={'Канал'}
              disabled={!regionField}
              onChange={handleChanelChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <h6>Сеть</h6>
            <CheckPicker
              data={data}
              style={{width: 224}}
              placeholder={'Сеть'}
              disabled={!chanelField}
              onChange={handleNetWorkChange}
            />
          </div>
        </div>
      </Panel>
      <Panel header="Второй способ выгрузки данных**" shaded className={styles.panel}>
        <Cascader data={mockData} block />
      </Panel>
      <Panel header="Выберете способ выгрузки данных" shaded className={styles.panel}>
        <div className={styles.botPanel}>
          <div>
            <h5 style={{marginBottom: 16}}>KPI</h5>
            <Placeholder.Graph width={250} height={150} className={styles.placeholderGraph}/>
          </div>
          <div>
            <h5 style={{marginBottom: 16}}>HML</h5>
            <Placeholder.Graph width={250} height={150} className={styles.placeholderGraph}/>
          </div>

          <div>
            <h5 style={{marginBottom: 16}}>Профиль</h5>
            <Placeholder.Graph width={250} height={150} className={styles.placeholderGraph}/>
          </div>
          <div>
            <h5 style={{marginBottom: 16}}>Портфель</h5>
            <Placeholder.Graph width={250} height={150} className={styles.placeholderGraph}/>
          </div>
          <div>
            <h5 style={{marginBottom: 16}}>Catman</h5>
            <Placeholder.Graph width={250} height={150} className={styles.placeholderGraph}/>
          </div>
          <div>
            <h5 style={{marginBottom: 16}}>Таблицы</h5>
            <Placeholder.Graph width={250} height={150} className={styles.placeholderGraph}/>
          </div>
        </div>
      </Panel>
      <Divider>Описание работы системы</Divider>
      <Text muted>*Допустим всего 6 фильтров</Text>
      <Text muted>*Начинается с 1-го, после того как выбрали категорию уходит запрос на бек, для запроса списка производителей, и так далее</Text>
      <Text muted>*После того как все фильтры составлены, можно будет сформировать отчет в необходимом формате</Text>
      <Text muted>**Данный вариант имеет ряд сложностей(время разработки), но в целом рабочий</Text>
    </div>
  );
};