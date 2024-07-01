import styles from './styles.module.scss'
import {Nav, Sidenav} from "rsuite";
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import {Link, useNavigate} from "react-router-dom";
import {UserInterface} from "../userInterface/UserInterface";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectToggleMenu} from "../../store/main.selectors";
import {setToggleMenu} from "../../store/main.slice";

export const SideNavigation = () => {
  const navigate = useNavigate();
  const menu = useSelector(selectToggleMenu);
  const dispatch = useDispatch();
  const [onExpand, setOnExpand] = useState(false)

  const handleOpenExpand = () => {
    setOnExpand(true)
  }

  const test = (path) => {
    navigate(path);
  }

  return (
    <div className={styles.navContainer}>
      <Sidenav
        className={styles.sideNav}
        defaultOpenKeys={['3', '4']}
        expanded={menu}
      >
        <Sidenav.Body>
          <UserInterface expand={menu}/>
          <Nav activeKey="1">
            <Nav.Item onClick={() => test('/main')} eventKey="1" icon={<DashboardIcon/>}>Главная</Nav.Item>
            <Nav.Menu title={'Пользователь'} eventKey="2" icon={<GroupIcon/>}>
              <Nav.Item onClick={() => test('/main/reportList')} eventKey="2-1">Мои отчеты</Nav.Item>
            </Nav.Menu>
            <Nav.Item onClick={() => test('/main/report1')} eventKey="3" icon={<MagicIcon/>}>Отчет</Nav.Item>
            {/*<Nav.Menu eventKey="3" title="Отчет" icon={<MagicIcon/>}>*/}
            {/*  <Nav.Item onClick={() => test('/main/report')} eventKey="3-1">Вариант 1 </Nav.Item>*/}
            {/*  <Nav.Item onClick={() => test('/main/report1')} eventKey="3-1">Вариант 2</Nav.Item>*/}
            {/*</Nav.Menu>*/}
            <Nav.Menu eventKey="4" title="Настрройки" icon={<GearCircleIcon/>}>
              <Nav.Item eventKey="4-1">Выйти из системы</Nav.Item>
            </Nav.Menu>
          </Nav>
        </Sidenav.Body>
        <Sidenav.Toggle onToggle={() => dispatch(setToggleMenu(!menu))} />
      </Sidenav>
    </div>
  );
};

