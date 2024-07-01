import styles from './styles.module.scss';
import {Title} from "../../../helpers/components/Title";
import {InlineEdit, Steps} from "rsuite";
import {firstSlideMockText} from "../../../mock/mock";
import PencilSquareIcon from '@rsuite/icons/legacy/PencilSquare';
import BookIcon from '@rsuite/icons/legacy/Book';
import WechatIcon from '@rsuite/icons/Wechat';
import SteamSquareIcon from '@rsuite/icons/legacy/SteamSquare';
import {BarChart} from "../../../charts/BarChart";
import {PieChart} from "../../../charts/PieChart";

export const Slide1 = () => {
  const title = 'KPI Категории'

  return (
    <div className={styles.container}>
      <Title title={title} level={3}/>
      <div style={{height:'100%'}}>
        <InlineEdit defaultValue={firstSlideMockText}/>
        <div className={styles.slideBlock}>
          <div className={styles.leftBlock} >
            <Title title={'Total Offtrade'} level={4}></Title>
            {/*<Steps current={1} vertical>*/}
            {/*  <Steps.Item status={'finish'} title="Finished" icon={<PencilSquareIcon style={{ fontSize: 26 }} />} />*/}
            {/*  <Steps.Item status={'finish'} title="In Progress" icon={<BookIcon style={{ fontSize: 26 }} />} />*/}
            {/*  <Steps.Item status={'finish'} title="Waiting" icon={<WechatIcon style={{ fontSize: 26 }} />} />*/}
            {/*  <Steps.Item status={'finish'} title="Waiting" icon={<SteamSquareIcon style={{ fontSize: 26 }} />} />*/}
            {/*</Steps>*/}
            <PieChart/>
            <PieChart/>
          </div>
          <div className={styles.rightBlock}>
            <Title title={'Вклад KPI в рост объемов'} level={4}></Title>
            <BarChart/>
            <BarChart/>
          </div>
        </div>
        <div className={styles.footer}>
          <InlineEdit defaultValue={'Источник: Цифровая Потребительская платформа'} style={{width: '100%'}}/>
        </div>
      </div>
    </div>
  );
};