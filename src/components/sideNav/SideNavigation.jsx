import styles from './styles.module.scss'
import {Nav, Sidenav} from "rsuite";
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import {Link, useNavigate} from "react-router-dom";
import {UserInterface} from "../userInterface/UserInterface";

export const SideNavigation = () => {
  const navigate = useNavigate();

  const test = (path) => {
    navigate(path);
  }

  return (
    <div className={styles.navContainer}>
      <Sidenav className={styles.sideNav} defaultOpenKeys={['3', '4']}>
        <Sidenav.Body>
          <UserInterface/>
          <Nav activeKey="1">
            <Nav.Item onClick={() => test('/main')} eventKey="1" icon={<DashboardIcon/>}>
              Главная
            </Nav.Item>
            <Nav.Menu title={'Пользователь'} eventKey="2" icon={<GroupIcon/>}>
              <Nav.Item onClick={() => test('/main/reportList')} eventKey="2-1">Мои отчеты</Nav.Item>
            </Nav.Menu>
            <Nav.Item onClick={() => test('/main/report')} eventKey="3" title="Advanced" icon={<MagicIcon/>}>
              Сформировать отчет
            </Nav.Item>
            <Nav.Menu eventKey="4" title="Настрройки" icon={<GearCircleIcon/>}>
              <Nav.Item eventKey="4-1">Выйти из системы</Nav.Item>
            </Nav.Menu>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </div>
  );
};

