import styles from './styles.module.scss';
import {Title} from "../../../helpers/components/Title";
import {InlineEdit, Steps} from "rsuite";
import {firstSlideMockText} from "../../../mock/mock";
import {CustomChart} from "../../../charts/CustomChart";
import {WaterfallChart} from "../../../charts/WaterFallChart";
import PencilSquareIcon from '@rsuite/icons/legacy/PencilSquare';
import BookIcon from '@rsuite/icons/legacy/Book';
import WechatIcon from '@rsuite/icons/Wechat';
import SteamSquareIcon from '@rsuite/icons/legacy/SteamSquare';
import PeoplesIcon from '@rsuite/icons/Peoples';
import CalendarIcon from '@rsuite/icons/Calendar';
import PeoplesCostomizeIcon from '@rsuite/icons/PeoplesCostomize';


export const Slide1 = () => {
  const title = 'KPI Категории'

  return (
    <div className={styles.container}>
      <Title title={title} level={3}/>
      <div style={{height:'100%'}}>
        <InlineEdit defaultValue={firstSlideMockText}/>
        <div className={styles.slideBlock}>
          <div className={styles.leftBlock} >
            {/*<Title title={'Total Offtrade'} level={4}/>*/}
            {/*<Steps current={1} vertical>*/}
            {/*  <Steps.Item*/}
            {/*    status={'finish'}*/}
            {/*    title="Пенетрация 18+"*/}
            {/*    icon={<PencilSquareIcon style={{ fontSize: 36 }} />}*/}
            {/*    description="Описание"*/}
            {/*  />*/}
            {/*  <Steps.Item*/}
            {/*    status={'finish'}*/}
            {/*    title="In Progress"*/}
            {/*    icon={<BookIcon style={{ fontSize: 36 }} />}*/}
            {/*    description="Описание"*/}
            {/*  />*/}
            {/*  <Steps.Item*/}
            {/*    status={'finish'}*/}
            {/*    title="Waiting"*/}
            {/*    icon={<WechatIcon style={{ fontSize: 36 }} />}*/}
            {/*    description="Описание"*/}
            {/*  />*/}
            {/*  <Steps.Item*/}
            {/*    status={'finish'}*/}
            {/*    title="Waiting"*/}
            {/*    icon={<SteamSquareIcon style={{ fontSize: 36 }} />}*/}
            {/*    description="Описание"*/}
            {/*  />*/}
            {/*</Steps>*/}
            <div className={styles.totalOffTrade}>
              <span className={styles.totalOffTradeTitle}>Total Offtrade</span>
            </div>
            <div className={styles.totalOffTradeContent}>
              <div className={styles.totalOffTradeItem}>
                <div className={styles.totalOffTradeItemLeftBlock}>
                  <div className={styles.totalOffTradeLogo}><PeoplesIcon style={{fontSize: 26, color: '#FF8200'}}/></div>
                  <div className={styles.totalOffTradeText}>Пенетрация 18+</div>
                </div>
                <div className={styles.totalOffTradeStat}>47.5%</div>
              </div>
              <div className={styles.totalOffTradeItem}>
                <div className={styles.totalOffTradeItemLeftBlock}>
                  <div className={styles.totalOffTradeLogo}><CalendarIcon style={{fontSize: 26, color: '#FF8200'}}/>
                  </div>
                  <div className={styles.totalOffTradeText}>Частота покупки</div>
                </div>
                <div className={styles.totalOffTradeStat}>47.5%</div>
              </div>
              <div className={styles.totalOffTradeItem}>
                <div className={styles.totalOffTradeItemLeftBlock}>
                  <div className={styles.totalOffTradeLogo}><PeoplesCostomizeIcon style={{fontSize: 26, color: '#FF8200'}}/></div>
                  <div className={styles.totalOffTradeText}>Средний чек</div>
                </div>
                <div className={styles.totalOffTradeStat}>47.5%</div>
              </div>
              <div className={styles.totalOffTradeItem}>
                <div className={styles.totalOffTradeItemLeftBlock}>
                  <div className={styles.totalOffTradeLogo}><PeoplesCostomizeIcon style={{fontSize: 26, color: '#FF8200'}}/></div>
                  <div className={styles.totalOffTradeText}>Средний объем покупки</div>
                </div>
                <div className={styles.totalOffTradeStat}>47.5%</div>
              </div>
            </div>
          </div>
          <div className={styles.rightBlock}>
            <Title title={'Вклад KPI в рост объемов'} level={4}></Title>
            <WaterfallChart/>
            <CustomChart/>
          </div>
        </div>
        <div className={styles.footer}>
          <InlineEdit defaultValue={'Источник: Цифровая Потребительская платформа'} style={{width: '100%'}}/>
        </div>
      </div>
    </div>
  );
};