import {Button, CheckPicker, Divider, Panel, Text} from "rsuite";
import {stack1} from "../../consts/stacks";
import styles from './styles.module.scss';
import { mockTreeData } from '../../consts/mock'
import {useState} from "react";
import {AdvancedAnalytics} from "@rsuite/icons";
import {DownloadMethods} from "../downloadMethods/DownloadMethods";
import {BASE_CATEGORY, BERR_CREATOR, REGION, BEER_NETWORK, BEER_CHANEL, BEER_BRAND} from "../../consts/beer/beer";

export const Report2 = () => {
  const category = BASE_CATEGORY.map(item => ({ label: item, value: item }));
  const creator = BERR_CREATOR.map(item => ({ label: item, value: item }));
  const region = REGION.map(item => ({ label: item, value: item }));
  const network = BEER_NETWORK.map(item => ({ label: item, value: item }));
  const chanel = BEER_CHANEL.map(item => ({ label: item, value: item }));
  const brand = BEER_BRAND.map(item => ({ label: item, value: item }));

  const [categoryFilled, setCategoryFilled] = useState(false);
  const [manufacturerFilled, setManufacturerFilled] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [brandField, setBrandField] = useState(false);
  const [regionField, setRegionField] = useState(false);
  const [chanelField, setChanelField] = useState(false);
  const [netWorkField, setNetWorkField] = useState(false);
  const [reportLoader, setReportLoader] = useState(false);
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

  const handleClick = () => {
    setReportLoader(true);

    setTimeout(() => {
      setReportLoader(false)
      console.log('Отчет запрошен');
      setCheckout(true);
    }, 3000);
  };

  return (
    <div className={styles.report2container}>
      <Panel header="Выберете параметры для необходимой выгрузки*" shaded className={styles.panel}>
        <div className={styles.inputBlocks}>
          <div className={styles.inputContainer}>
            <h6>Категория</h6>
            <CheckPicker
              data={category}
              style={{width: 224}}
              placeholder={'Категория'}
              onChange={handleCategoryChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <h6>Производитель</h6>
            <CheckPicker
              data={creator}
              style={{width: 224}}
              placeholder={'Производитель'}
              disabled={!categoryFilled}
              onChange={handleManufacturerChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <h6>Бренд</h6>
            <CheckPicker
              data={brand}
              style={{width: 224}}
              placeholder={'Бренд'}
              disabled={!manufacturerFilled}
              onChange={handleBrandChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <h6>Регион</h6>
            <CheckPicker
              data={region}
              style={{width: 224}}
              placeholder={'Регион'}
              disabled={!brandField}
              onChange={handleRegionChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <h6>Канал</h6>
            <CheckPicker
              data={chanel}
              style={{width: 224}}
              placeholder={'Канал'}
              disabled={!regionField}
              onChange={handleChanelChange}
            />
          </div>

          <div className={styles.inputContainer}>
            <h6>Сеть</h6>
            <CheckPicker
              data={network}
              style={{width: 224}}
              placeholder={'Сеть'}
              disabled={!chanelField}
              onChange={handleNetWorkChange}
            />
          </div>
        </div>
        <Button
          style={{marginTop: 16}}
          color='primary'
          loading={reportLoader}
          onClick={handleClick}
        >
          Запросить отчет
        </Button>
      </Panel>
      {checkout ? <DownloadMethods/> : null}
      <Divider>Описание работы системы</Divider>
      <Text muted>*Допустим всего 6 фильтров</Text>
      <Text muted>*Начинается с 1-го, после того как выбрали категорию уходит запрос на бек, для запроса списка производителей, и так далее</Text>
      <Text muted>*После того как все фильтры составлены, можно будет сформировать отчет в необходимом формате</Text>
    </div>
  );
};